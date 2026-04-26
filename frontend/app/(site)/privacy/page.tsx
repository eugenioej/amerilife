import { permanentRedirect } from "next/navigation";

/** Canonical policy page is /privacy-policy/ */
export default function PrivacyRedirectPage() {
  permanentRedirect("/privacy-policy/");
}
