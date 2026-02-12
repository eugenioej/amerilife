import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "../components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "SMS Text Messaging Terms and Conditions | AmeriLife",
  description:
    "AmeriLife SMS Text Messaging Terms and Conditions - Learn how we use SMS text messaging.",
};

export default function SmsTermsPage() {
  return (
    <LegalPageLayout title="SMS Text Messaging Terms and Conditions">
      <p>
        The AmeriLife® family of companies (&quot;AmeriLife&quot;) provides this policy to explain
        how we use SMS text messaging. Please read these SMS Text Messaging Terms &amp; Conditions
        (&quot;SMS Terms&quot;) carefully. By completing the opt in, you expressly consent to
        receive marketing and non-marketing text messages from AmeriLife, including text messages
        made with an auto dialer, at the mobile number you provide. These messages can be recurring
        or one-time.
      </p>

      <p>
        Opting in to receive marketing and non-marketing text messages is not required to purchase any
        products or services from AmeriLife. By providing your mobile number and opting in, you agree
        you have ownership rights or permission to use the number given to AmeriLife.
      </p>

      <p>
        You may opt out of these communications at any time by following the procedure established by
        the text message. For example, replying &quot;STOP&quot; to any message you received. After
        this, you will no longer receive messages from that particular short code. If you want to
        join again, you can sign up as you did the first time and AmeriLife will start sending
        messages to you again.
      </p>

      <p>
        You can receive assistance at any time by replying &quot;HELP&quot; to any message you
        receive or calling the AmeriLife Legal Department at (727) 726-0726.
      </p>

      <p>
        Data obtained from you in connection with this text messaging service may include your
        mobile phone number, your wireless provider&apos;s name, the date, time, and content of
        your messages and other information you provide to AmeriLife as part of this service.
        AmeriLife may use this information to contact you and provide services you request from
        AmeriLife. If you have questions regarding our privacy practices, please read our{" "}
        <Link href="/privacy/">Privacy Policy</Link> at Amerilife.com/privacy.
      </p>

      <p>
        Messaging and data rates may apply for any messages sent to you from us and to us from you.
        The maximum number of messages per month you receive will vary based on the service you opt
        into. If you have questions about your text or data plan, it is best to contact your wireless
        provider.
      </p>

      <p>
        AmeriLife may revise, modify, or amend these SMS Terms at any time. Any such revision,
        modification, or amendment shall take effect when it is posted to the AmeriLife website. You
        agree to review these SMS Terms periodically to ensure that you are aware of any changes.
        Your continued consent to receive AmeriLife text messages will indicate your acceptance of
        those changes.
      </p>

      <p>
        By opting in, you accept to be bound by these SMS Terms. These SMS Terms do not supersede the
        terms contained in the Legal Notice at Amerilife.com/terms. In the event of any conflict
        between the SMS Terms and the Legal Notice, such conflict shall be determined and resolved in
        favor of the terms, conditions, and notices in the Legal Notice, which is controlling over
        the SMS Terms, to the extent permitted by law.
      </p>

      <p className="mt-8 pt-8 border-t border-[var(--color-border)]">
        <Link href="/privacy/">Privacy Policy</Link> | <Link href="/terms/">Terms of Use</Link>
      </p>
    </LegalPageLayout>
  );
}
