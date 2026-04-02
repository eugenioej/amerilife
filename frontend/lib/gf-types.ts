/** Shapes returned by `GET_GF_FORM` (aligned with WPGraphQL for Gravity Forms). */

export type GfChoice = {
  text: string;
  value: string;
};

export type GfNameInput = {
  id: number;
  label: string;
};

export type GfFieldNode = {
  databaseId: number;
  type: string;
  label?: string | null;
  isRequired?: boolean | null;
  placeholder?: string | null;
  captchaType?: string | null;
  choices?: GfChoice[] | null;
  /** Name / Checkbox sub-fields */
  inputs?: GfNameInput[] | null;
  checkboxLabel?: string | null;
};

/** Matches `FormSubmitButton` on `GfForm` (WPGraphQL for Gravity Forms). */
export type GfSubmitButton = {
  text?: string | null;
  /** e.g. `TEXT` | `IMAGE` */
  type?: string | null;
  imageUrl?: string | null;
};

export type GfFormData = {
  databaseId: number;
  title: string;
  submitButton?: GfSubmitButton | null;
  formFields: {
    nodes: (GfFieldNode | null)[] | null;
  } | null;
};
