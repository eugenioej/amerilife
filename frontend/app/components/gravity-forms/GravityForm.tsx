"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import type { GfFieldNode, GfFormData } from "@/lib/gf-types";
import { nameInputsForDisplay } from "@/lib/gf-name-field";
import { submitGravityForm } from "@/lib/gf-client";
import { Button } from "@/app/components/ui/Button";
import { GfRecaptchaField } from "./GfRecaptchaField";


const inputClass =
  "w-full rounded border border-[var(--color-border)] px-4 py-3 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

/** Light inputs on dark panels (labels use light text via separate classes). */
const inputClassOnDark =
  "w-full rounded border border-white/25 bg-white px-4 py-3 text-[#2b3e50] placeholder:text-[#64748b] focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]";

/** Inline/horizontal pill style — no border, no ring, full height */
const inlineInputClass =
  "h-full w-full bg-transparent py-4 pl-6 pr-4 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:outline-none";

/** WordPress / GraphQL often returns HTML entities in labels and choice text (e.g. &amp;). */
function decodeHtmlEntities(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&nbsp;/g, "\u00A0");
}

function nodesList(form: GfFormData): GfFieldNode[] {
  return (form.formFields?.nodes ?? []).filter((n): n is GfFieldNode => Boolean(n));
}

/** Field types that never render UI (layout, markup, or server-only). */
function isDisplayOnlyLayoutField(type: string | undefined): boolean {
  return type === "SECTION" || type === "HTML" || type === "PAGE";
}

function nameKey(fieldId: number, inputId: number): string {
  return `${fieldId}_${inputId}`;
}

function buildNameValues(field: GfFieldNode, nameParts: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const inp of field.inputs ?? []) {
    const v = (nameParts[nameKey(field.databaseId, inp.id)] ?? "").trim();
    const lab = (inp.label ?? "").toLowerCase();
    if (lab.includes("prefix") || lab.includes("salutation")) out.prefix = v;
    else if (lab.includes("first")) out.first = v;
    else if (lab.includes("middle")) out.middle = v;
    else if (lab.includes("last")) out.last = v;
    else if (lab.includes("suffix")) out.suffix = v;
  }
  return out;
}

function buildFieldValuesPayload(
  nodes: GfFieldNode[],
  stringValues: Record<number, string>,
  nameParts: Record<string, string>,
  checkboxChecked: Record<string, boolean>,
  captchaToken: string,
): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];

  for (const field of nodes) {
    const id = field.databaseId;
    switch (field.type) {
      case "TEXT":
      case "PHONE":
      case "TEXTAREA":
      case "NUMBER":
      case "DATE":
      case "HIDDEN":
      case "RADIO":
      case "SELECT": {
        const v = stringValues[id] ?? "";
        out.push({ id, value: v });
        break;
      }
      case "EMAIL": {
        const v = stringValues[id] ?? "";
        out.push({ id, emailValues: { value: v } });
        break;
      }
      case "ADDRESS": {
        const zip = (stringValues[id] ?? "").trim();
        out.push({
          id,
          addressValues: {
            street: "",
            lineTwo: "",
            city: "",
            state: "",
            zip,
            country: "US",
          },
        });
        break;
      }
      case "NAME": {
        const nv = buildNameValues(field, nameParts);
        out.push({ id, nameValues: nv });
        break;
      }
      case "CHECKBOX": {
        const pairs: { inputId: number; value: string }[] = [];
        const inputs = field.inputs ?? [];
        const choices = field.choices ?? [];
        for (let i = 0; i < inputs.length; i++) {
          const inp = inputs[i];
          const key = nameKey(id, inp.id);
          if (!checkboxChecked[key]) continue;
          const choice = choices[i];
          pairs.push({ inputId: inp.id, value: choice?.value ?? "" });
        }
        if (pairs.length > 0) {
          out.push({ id, checkboxValues: pairs });
        }
        break;
      }
      case "MULTISELECT": {
        const raw = stringValues[id] ?? "";
        const values = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
        if (values.length > 0) out.push({ id, values });
        break;
      }
      case "CONSENT": {
        const checked = Boolean(stringValues[id]);
        out.push({ id, value: checked ? "1" : "" });
        break;
      }
      case "CAPTCHA": {
        out.push({ id, value: captchaToken });
        break;
      }
      default:
        break;
    }
  }

  return out;
}

type GravityFormProps = {
  form: GfFormData;
  className?: string;
  /** Render fields in a single horizontal pill row (hero search-bar style) */
  inline?: boolean;
  /** Dark surrounding panel: light labels, white input fields */
  onDarkPanel?: boolean;
};

export function GravityForm({ form, className, inline = false, onDarkPanel = false }: GravityFormProps) {
  const nodes = useMemo(() => nodesList(form), [form]);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
  const submitBtn = form.submitButton;
  const submitLabel = decodeHtmlEntities(submitBtn?.text?.trim() || "Submit");
  const submitIsImage =
    String(submitBtn?.type ?? "").toUpperCase() === "IMAGE" && Boolean(submitBtn?.imageUrl?.trim());
  const submitImageUrl = submitBtn?.imageUrl?.trim() ?? "";

  const [stringValues, setStringValues] = useState<Record<number, string>>({});
  const [frontendUrl, setFrontendUrl] = useState("");
  const [nameParts, setNameParts] = useState<Record<string, string>>({});
  const [checkboxChecked, setCheckboxChecked] = useState<Record<string, boolean>>({});
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successHtml, setSuccessHtml] = useState<string | null>(null);

  useEffect(() => {
    setFrontendUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!frontendUrl) return;

    const TARGET_FORM_ID = 31;   
    const TARGET_FIELD_ID = 17;  

    if (form.databaseId !== TARGET_FORM_ID) return;

    setStringValues((prev) => ({
      ...prev,
      [TARGET_FIELD_ID]: frontendUrl,
    }));

  }, [frontendUrl, form.databaseId]);


  const inputCn = onDarkPanel ? inputClassOnDark : inputClass;
  const labelBlock =
    "mb-1.5 block text-sm font-medium " +
    (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const legendClass =
    "mb-1.5 text-sm font-medium " + (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const choiceRowClass =
    "flex items-center gap-2 text-sm " + (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const choiceRowStartClass =
    "flex items-start gap-2 text-sm " + (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const consentLabelClass = "text-sm " + (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const captchaLabelClass =
    "mb-2 block text-sm font-medium " + (onDarkPanel ? "text-white" : "text-[var(--color-fg)]");
  const unsupportedClass =
    "text-sm " + (onDarkPanel ? "text-white/70" : "text-[var(--color-muted)]");

  const setStr = useCallback((id: number, v: string) => {
    setStringValues((s) => ({ ...s, [id]: v }));
  }, []);

  const setName = useCallback((key: string, v: string) => {
    setNameParts((s) => ({ ...s, [key]: v }));
  }, []);

  const toggleCb = useCallback((key: string, checked: boolean) => {
    setCheckboxChecked((s) => ({ ...s, [key]: checked }));
  }, []);

  const validateClient = useCallback((): string | null => {
    for (const field of nodes) {
      if (!field.isRequired) continue;
      if (field.type === "HIDDEN" || isDisplayOnlyLayoutField(field.type)) continue;
      switch (field.type) {
        case "TEXT":
        case "EMAIL":
        case "PHONE":
        case "TEXTAREA":
        case "SELECT":
        case "RADIO":
        case "ADDRESS":
        case "NUMBER":
        case "DATE": {
          const v = (stringValues[field.databaseId] ?? "").trim();
          if (!v) return `${field.label ?? "This field"} is required.`;
          break;
        }
        case "NAME": {
          // Only validate subfields we actually show (First + Last); GF may still have Prefix/Middle/Suffix in the schema.
          for (const inp of nameInputsForDisplay(field.inputs ?? [])) {
            const v = (nameParts[nameKey(field.databaseId, inp.id)] ?? "").trim();
            if (!v) return `${field.label ?? "Name"} is required.`;
          }
          break;
        }
        case "CHECKBOX": {
          const any = (field.inputs ?? []).some((inp) => checkboxChecked[nameKey(field.databaseId, inp.id)]);
          if (!any) return `${field.label ?? "This field"} is required.`;
          break;
        }
        case "CONSENT": {
          if (!stringValues[field.databaseId]) return "Please accept the consent to continue.";
          break;
        }
        case "CAPTCHA": {
          if (!siteKey) return "reCAPTCHA is not configured (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).";
          const token =
            recaptchaWidgetId != null && window.grecaptcha
              ? window.grecaptcha.getResponse(recaptchaWidgetId)
              : "";
          if (!token) return "Please complete the reCAPTCHA.";
          break;
        }
        default:
          break;
      }
    }
    return null;
  }, [checkboxChecked, nameParts, nodes, recaptchaWidgetId, siteKey, stringValues]);
  

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    setFieldErrors({});
    setSuccessHtml(null);

    const err = validateClient();
    if (err) {
      setClientError(err);
      return;
    }

    let captchaToken = "";
    if (nodes.some((f) => f.type === "CAPTCHA")) {
      if (!siteKey) {
        setClientError("reCAPTCHA site key is missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.");
        return;
      }
      if (recaptchaWidgetId == null || !window.grecaptcha) {
        setClientError("reCAPTCHA is still loading. Try again in a moment.");
        return;
      }
      captchaToken = window.grecaptcha.getResponse(recaptchaWidgetId);
      if (!captchaToken) {
        setClientError("Please complete the reCAPTCHA.");
        return;
      }
    }

    const payload = buildFieldValuesPayload(nodes, stringValues, nameParts, checkboxChecked, captchaToken);
    setSubmitting(true);
    try {
      const result = await submitGravityForm(form.databaseId, payload);
      if (!result) {
        setClientError("Submission failed. Please try again.");
        return;
      }
      if (process.env.NODE_ENV === "development" && result.errors?.length) {
        console.warn("[GravityForm] Submission errors from WordPress:", result.errors);
      }
      if (result.errors?.length) {
        const map: Record<string, string> = {};
        const generalMessages: string[] = [];
        for (const er of result.errors) {
          if (er.id != null) {
            map[String(er.id)] = er.message ?? "Invalid value";
          } else {
            generalMessages.push(er.message ?? "An error occurred. Please try again.");
          }
        }
        setFieldErrors(map);
        if (generalMessages.length) {
          setClientError(generalMessages.join(" "));
        }
        if (recaptchaWidgetId != null && window.grecaptcha) {
          window.grecaptcha.reset(recaptchaWidgetId);
        }
        return;
      }
      const conf = result.confirmation;
      if (conf?.url?.trim()) {
        window.location.assign(conf.url.trim());
        return;
      }
      if (conf?.message?.trim()) {
        setSuccessHtml(conf.message.trim());
        return;
      }
      setSuccessHtml("<p>Thank you — your message was sent.</p>");
    } catch {
      setClientError("Something went wrong. Please try again.");
      if (recaptchaWidgetId != null && window.grecaptcha) {
        window.grecaptcha.reset(recaptchaWidgetId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (successHtml) {
    return (
      <div
        className={
          className ??
          (onDarkPanel
            ? "rounded border border-white/20 bg-white p-6 text-sm text-[var(--color-fg)] [&_p]:mb-2"
            : "rounded border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-fg)] [&_p]:mb-2")
        }
        dangerouslySetInnerHTML={{ __html: successHtml }}
      />
    );
  }

  // ── Inline (horizontal pill) mode ──────────────────────────────────────
  if (inline) {
    // Only render simple text-like fields inline; skip CAPTCHA, CONSENT, etc.
    const inlineFields = nodes.filter((f) =>
      ["TEXT", "EMAIL", "PHONE", "NUMBER", "DATE", "SELECT", "ADDRESS", "NAME"].includes(f.type ?? ""),
    );

    return (
      <div className="flex flex-col gap-3">
        <form
          onSubmit={onSubmit}
          noValidate
          className={
            className ??
            "flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-lg)] sm:flex-row sm:items-stretch sm:rounded-[var(--radius-full)]"
          }
        >
          {inlineFields.map((field, idx) => {
            const fid = field.databaseId;
            const label = decodeHtmlEntities(field.label?.trim() || "Field");
            const placeholder = decodeHtmlEntities(
              field.placeholder?.trim() || label,
            );
            const isLast = idx === inlineFields.length - 1;
            const dividerClass = isLast
              ? ""
              : "border-b border-[var(--color-border)] sm:border-0 sm:border-r sm:border-[var(--color-border)]";

            if (field.type === "NAME") {
              const nameInputs = nameInputsForDisplay(field.inputs ?? []);
              return nameInputs.map((inp) => (
                <div key={`${fid}-${inp.id}`} className={`relative min-w-0 flex-1 ${dividerClass}`}>
                  <label htmlFor={`gf-${fid}-${inp.id}`} className="sr-only">
                    {decodeHtmlEntities(inp.label ?? label)}
                  </label>
                  <input
                    id={`gf-${fid}-${inp.id}`}
                    type="text"
                    autoComplete={
                      /\bfirst\b/i.test(inp.label ?? "") ? "given-name" : /\blast\b/i.test(inp.label ?? "") ? "family-name" : undefined
                    }
                    placeholder={decodeHtmlEntities(inp.label ?? placeholder)}
                    value={nameParts[nameKey(fid, inp.id)] ?? ""}
                    onChange={(e) => setName(nameKey(fid, inp.id), e.target.value)}
                    className={inlineInputClass}
                  />
                </div>
              ));
            }

            if (field.type === "SELECT") {
              return (
                <div key={fid} className={`relative min-w-0 flex-1 ${dividerClass}`}>
                  <label htmlFor={`gf-${fid}`} className="sr-only">
                    {label}
                  </label>
                  <select
                    id={`gf-${fid}`}
                    value={stringValues[fid] ?? ""}
                    onChange={(e) => setStr(fid, e.target.value)}
                    className={`${inlineInputClass} appearance-none pr-10`}
                  >
                    <option value="">{placeholder}</option>
                    {(field.choices ?? []).map((c) => (
                      <option key={c.value} value={c.value}>
                        {decodeHtmlEntities(c.text ?? "")}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </div>
              );
            }

            return (
              <div key={fid} className={`relative min-w-0 flex-1 ${dividerClass}`}>
                <label htmlFor={`gf-${fid}`} className="sr-only">
                  {label}
                </label>
                <input
                  id={`gf-${fid}`}
                  type={field.type === "PHONE" ? "tel" : field.type === "EMAIL" ? "email" : "text"}
                  placeholder={placeholder}
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  autoComplete={field.type === "EMAIL" ? "email" : undefined}
                  className={inlineInputClass}
                />
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full shrink-0 items-center justify-center gap-2 bg-[var(--color-brand-primary)] px-8 py-4 font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Sending…" : submitLabel}
          </button>
        </form>

        {clientError ? (
          <p className="px-2 text-sm text-red-600" role="alert">
            {clientError}
          </p>
        ) : null}
      </div>
    );
  }

  // ── Standard (vertical) mode ─────────────────────────────────────────────
  return (
    <form
      onSubmit={onSubmit}
      className={className ?? "space-y-5"}
      noValidate
    >
      {nodes.map((field) => {
        const fid = field.databaseId;
        const err = fieldErrors[String(fid)];
        const label = decodeHtmlEntities(field.label?.trim() || "Field");
        const req = field.isRequired ? (
          <span className="text-[var(--color-brand-primary)]" aria-hidden>
            *
          </span>
        ) : null;

        switch (field.type) {
          case "HIDDEN":
            return null;

          case "SECTION":
            return (
              <div key={fid} className="gf-consent-text text-sm text-[var(--color-muted)]">
                {field.description && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: decodeHtmlEntities(field.description),
                    }}
                  />
                )}
              </div>
            );

          case "HTML":
          case "PAGE":
            return null;

          case "TEXT":
          case "NUMBER":
          case "DATE":
          case "PHONE":
            return (
              <div key={fid}>
                <label htmlFor={`gf-${fid}`} className={labelBlock}>
                  {label}
                  {req}
                </label>
                <input
                  id={`gf-${fid}`}
                  type={field.type === "PHONE" ? "tel" : field.type === "DATE" ? "date" : "text"}
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  placeholder={field.placeholder ? decodeHtmlEntities(field.placeholder) : undefined}
                  className={inputCn}
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `gf-err-${fid}` : undefined}
                />
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "EMAIL":
            return (
              <div key={fid}>
                <label htmlFor={`gf-${fid}`} className={labelBlock}>
                  {label}
                  {req}
                </label>
                <input
                  id={`gf-${fid}`}
                  type="email"
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  className={inputCn}
                  autoComplete="email"
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `gf-err-${fid}` : undefined}
                />
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "TEXTAREA":
            return (
              <div key={fid}>
                <label htmlFor={`gf-${fid}`} className={labelBlock}>
                  {label}
                  {req}
                </label>
                <textarea
                  id={`gf-${fid}`}
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  placeholder={field.placeholder ? decodeHtmlEntities(field.placeholder) : undefined}
                  rows={4}
                  className={inputCn}
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `gf-err-${fid}` : undefined}
                />
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "SELECT":
            return (
              <div key={fid}>
                <label htmlFor={`gf-${fid}`} className={labelBlock}>
                  {label}
                  {req}
                </label>
                <select
                  id={`gf-${fid}`}
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  className={inputCn}
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `gf-err-${fid}` : undefined}
                >
                  <option value="">Select…</option>
                  {(field.choices ?? []).map((c) => (
                    <option key={c.value} value={c.value}>
                      {decodeHtmlEntities(c.text ?? "")}
                    </option>
                  ))}
                </select>
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "RADIO":
            return (
              <fieldset key={fid}>
                <legend className={legendClass}>
                  {label}
                  {req}
                </legend>
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {(field.choices ?? []).map((c) => (
                    <label key={c.value} className={choiceRowClass}>
                      <input
                        type="radio"
                        name={`gf-${fid}`}
                        value={c.value}
                        checked={(stringValues[fid] ?? "") === c.value}
                        onChange={() => setStr(fid, c.value)}
                      />
                      {decodeHtmlEntities(c.text ?? "")}
                    </label>
                  ))}
                </div>
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-2 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </fieldset>
            );

          case "ADDRESS":
            return (
              <div key={fid}>
                <label htmlFor={`gf-${fid}`} className={labelBlock}>
                  {label}
                  {req}
                </label>
                <input
                  id={`gf-${fid}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={stringValues[fid] ?? ""}
                  onChange={(e) => setStr(fid, e.target.value)}
                  className={inputCn}
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `gf-err-${fid}` : undefined}
                />
                {err ? (
                  <p id={`gf-err-${fid}`} className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "NAME": {
            const nameInputs = nameInputsForDisplay(field.inputs ?? []);
            return (
              <fieldset key={fid} className="space-y-3">
                <legend className={legendClass}>
                  {label}
                  {req}
                </legend>
                {nameInputs.map((inp) => (
                  <div key={inp.id}>
                    <label
                      htmlFor={`gf-${fid}-${inp.id}`}
                      className={labelBlock}
                    >
                      {decodeHtmlEntities(inp.label ?? "")}
                    </label>
                    <input
                      id={`gf-${fid}-${inp.id}`}
                      type="text"
                      autoComplete={
                        /\bfirst\b|^nombre$/i.test((inp.label ?? "").trim())
                          ? "given-name"
                          : /\blast\b|apellido/i.test((inp.label ?? "").trim())
                            ? "family-name"
                            : undefined
                      }
                      value={nameParts[nameKey(fid, inp.id)] ?? ""}
                      onChange={(e) => setName(nameKey(fid, inp.id), e.target.value)}
                      className={inputCn}
                    />
                  </div>
                ))}
                {err ? (
                  <p className="text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          case "CHECKBOX": {
            const cbInputs = field.inputs ?? [];
            const checkboxGridClass =
              cbInputs.length > 1
                ? "grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2"
                : "grid w-full grid-cols-1 gap-y-2";
            return (
              <fieldset key={fid} className="min-w-0">
                <legend className={legendClass}>
                  {label}
                  {req}
                </legend>
                <div className={checkboxGridClass}>
                  {cbInputs.map((inp, idx) => {
                    const choice = field.choices?.[idx];
                    const key = nameKey(fid, inp.id);
                    return (
                      <label key={inp.id} className={`${choiceRowStartClass} min-w-0`}>
                        <input
                          type="checkbox"
                          className="mt-1 shrink-0"
                          checked={Boolean(checkboxChecked[key])}
                          onChange={(e) => toggleCb(key, e.target.checked)}
                        />
                        <span className="min-w-0 flex-1">
                          {decodeHtmlEntities(choice?.text ?? inp.label ?? "")}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {err ? (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          case "CONSENT":
            return (
              <div key={fid} className="w-full min-w-0">
                <div className="flex w-full items-start gap-2">
                  <input
                    id={`gf-${fid}`}
                    type="checkbox"
                    checked={Boolean(stringValues[fid])}
                    onChange={(e) => setStr(fid, e.target.checked ? "1" : "")}
                    className="mt-1 shrink-0"
                    aria-invalid={Boolean(err)}
                  />
                  <label htmlFor={`gf-${fid}`} className={`${consentLabelClass} min-w-0 flex-1`}>
                    {decodeHtmlEntities(field.checkboxLabel ?? label)}
                    {req}
                  </label>
                </div>
                {err ? (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          case "CAPTCHA":
            if (!siteKey) {
              return (
                <p key={fid} className="text-sm text-red-600" role="alert">
                  Missing <code className="rounded bg-[#eee] px-1">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>. Add the
                  same Site Key configured in Gravity Forms.
                </p>
              );
            }
            return (
              <div key={fid}>
                <span className={captchaLabelClass}>
                  {label}
                  {req}
                </span>
                <GfRecaptchaField siteKey={siteKey} onReady={setRecaptchaWidgetId} />
                {err ? (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {err}
                  </p>
                ) : null}
              </div>
            );

          default:
            return (
              <p key={fid} className={unsupportedClass}>
                Unsupported field type: {field.type} ({label})
              </p>
            );
        }
      })}

      {clientError ? (
        <p className="text-sm text-red-600" role="alert">
          {clientError}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          "Sending…"
        ) : submitIsImage ? (
          // GF may point to any hosted image URL; next/image domains are not guaranteed.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={submitImageUrl} alt={submitLabel} className="mx-auto max-h-10 w-auto" />
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
