/**
 * Icons for Carrier Partners page using Lucide React.
 */

import {
  HeartPulse,
  UserPlus,
  HeartHandshake,
  LifeBuoy,
  PackageOpen,
  Settings,
  Network,
  Shield,
  Building2,
} from "lucide-react";

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export function IconFileMedical() {
  return <HeartPulse {...iconProps} />;
}

export function IconUserPlus() {
  return <UserPlus {...iconProps} />;
}

export function IconHandHoldingMedical() {
  return <HeartHandshake {...iconProps} />;
}

export function IconLifeRing() {
  return <LifeBuoy {...iconProps} />;
}

export function IconBoxOpen() {
  return <PackageOpen {...iconProps} />;
}

export function IconCogs() {
  return <Settings {...iconProps} />;
}

export function IconNetworkWired() {
  return <Network {...iconProps} />;
}

export function IconShieldHalved() {
  return <Shield {...iconProps} />;
}

export function IconBuildingColumns() {
  return <Building2 {...iconProps} />;
}
