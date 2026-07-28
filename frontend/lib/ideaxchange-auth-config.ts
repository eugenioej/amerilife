/** True when Microsoft Entra JIT auth is fully configured. */
export function isMicrosoftIdeaxchangeAuthEnabled(): boolean {
  return Boolean(
    process.env.AUTH_SECRET?.trim() &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.trim() &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET?.trim() &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER?.trim(),
  );
}
