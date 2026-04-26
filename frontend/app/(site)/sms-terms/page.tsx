import { permanentRedirect } from "next/navigation";

/**
 * Short URL; canonical content lives at /sms-text-messaging-terms-and-conditions/
 * (matches amerilife.com path).
 */
export default function SmsTermsRedirectPage() {
  permanentRedirect("/sms-text-messaging-terms-and-conditions/");
}
