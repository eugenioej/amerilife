"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { GfFormData } from "@/lib/gf-types";
import { ContactFormDialog } from "./ContactFormDialog";

type ContactPopupContextValue = {
  openContactPopup: () => void;
  hideContactButton: boolean;
  setHideContactButton: (hide: boolean) => void;

  showAgencyFooterDisclaimer: boolean;
  setShowAgencyFooterDisclaimer: (show: boolean) => void;

  agencyFooterDisclaimer: string | null;
  setAgencyFooterDisclaimer: (value: string | null) => void;
};

const ContactPopupContext = createContext<ContactPopupContextValue | null>(null);

export function useContactPopup(): ContactPopupContextValue {
  const ctx = useContext(ContactPopupContext);
  if (!ctx) {
    throw new Error("useContactPopup must be used within ContactPopupProvider");
  }
  return ctx;
}

type Props = {
  children: ReactNode;
  contactPopupForm: GfFormData | null;
};

export function ContactPopupProvider({ children, contactPopupForm }: Props) {
  const [open, setOpen] = useState(false);
  const [hideContactButton, setHideContactButton] = useState(false);
  const [showAgencyFooterDisclaimer, setShowAgencyFooterDisclaimer] =
  useState(false);
  const [agencyFooterDisclaimer, setAgencyFooterDisclaimer] =
  useState<string | null>(null);
  const openContactPopup = useCallback(() => setOpen(true), []);

  return (
    <ContactPopupContext.Provider
      value={{
        openContactPopup,
        hideContactButton,
        setHideContactButton,
            
        showAgencyFooterDisclaimer,
        setShowAgencyFooterDisclaimer,
            
        agencyFooterDisclaimer,
        setAgencyFooterDisclaimer,
      }}
    >
      {children}
      <ContactFormDialog open={open} onClose={() => setOpen(false)} form={contactPopupForm} />
    </ContactPopupContext.Provider>
  );
}
