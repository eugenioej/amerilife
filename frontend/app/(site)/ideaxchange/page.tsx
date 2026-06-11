import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { IdeaXchangeLoginView } from "@/app/components/ideaxchange/IdeaXchangeLoginView";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "ideaXchange Login | AmeriLife",
  "Sign in to AmeriLife ideaXchange — the internal online magazine for employees and affiliates. Learn about careers at AmeriLife.",
  "/ideaxchange/"
);

export default function IdeaXchangeLoginPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "ideaXchange", path: "/ideaxchange/" },
        ])}
      />
      <IdeaXchangeLoginView />
    </>
  );
}
