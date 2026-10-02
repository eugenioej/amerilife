"use client";

import { useEffect } from "react";
import { useContactPopup } from "@/app/components/layout/ContactPopupProvider";

type Props = {
  disclaimer?: string;
};

export function AgencyFooterDisclaimerSetter({
  disclaimer,
}: Props) {
  const {
    setAgencyFooterDisclaimer,
  } = useContactPopup();

  useEffect(() => {
    setAgencyFooterDisclaimer(disclaimer ?? null);

    return () => {
      setAgencyFooterDisclaimer(null);
    };
  }, [disclaimer, setAgencyFooterDisclaimer]);

  return null;
}