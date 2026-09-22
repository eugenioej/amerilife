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
  const openContactPopup = useCallback(() => setOpen(true), []);

  return (
    <ContactPopupContext.Provider
      value={{
        openContactPopup,
        hideContactButton,
        setHideContactButton,
      }}
    >
      {children}
      <ContactFormDialog open={open} onClose={() => setOpen(false)} form={contactPopupForm} />
    </ContactPopupContext.Provider>
  );
}
