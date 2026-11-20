"use client";

import { useEffect } from "react";
import { useContactPopup } from "./ContactPopupProvider";

export function HideContactButton() {
  const { setHideContactButton } = useContactPopup();

  useEffect(() => {
    setHideContactButton(true);

    return () => {
      setHideContactButton(false);
    };
  }, [setHideContactButton]);

  return null;
}