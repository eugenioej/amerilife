import { Download } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeCampaignAsset } from "@/lib/ideaxchange-recruiting-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type Props = {
  assets: IdeaxchangeCampaignAsset[];
  marketingCtaUrl?: string | null;
};

function fileTypeLabel(mimeType: string | null | undefined): string {
  if (!mimeType) return "File";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word") || mimeType.includes("document")) return "DOC";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "XLS";
  return "File";
}

function CampaignAssetDownload({ asset }: { asset: IdeaxchangeCampaignAsset }) {
  const url = asset.fileUrl?.trim();
  if (!url) return null;
  const href = rewriteUploadsUrl(url);
  return (
    <li className="flex items-center gap-4 border-b border-[var(--color-border)] px-5 py-4 last:border-b-0">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-dark)] text-white"
        aria-hidden
      >
        <Download className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <a
          href={href}
          download
          target="_blank"
          className="block text-sm font-bold text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
        >
          {asset.label}
        </a>
        <span className="text-xs text-[var(--color-muted)]">
          {fileTypeLabel(asset.mimeType)}
        </span>
      </div>
    </li>
  );
}

export function RunThisCampaignSidebar({ assets, marketingCtaUrl }: Props) {
  const visible = assets.filter((a) => a.fileUrl?.trim());
  const ctaHref = marketingCtaUrl?.trim() || "/connect/";

  return (
    <aside className="sticky top-24 space-y-6">
      {visible.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] shadow-[0_4px_20px_rgba(36,66,96,0.06)]">
          <div className="flex items-center gap-3 bg-[var(--color-brand-dark)] px-5 py-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-lg"
              aria-hidden
            >
              📣
            </span>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
              Run this campaign
            </h2>
          </div>
          <ul className="bg-[#f4f8f7]">
            {visible.map((asset) => (
              <CampaignAssetDownload key={asset.label ?? asset.fileUrl} asset={asset} />
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg bg-[var(--color-brand-dark)] px-6 py-8 text-center text-white">
        <p className="text-sm leading-relaxed">
          Want to run this ad with help? Consult the AmeriLife Marketing Team.
        </p>
        <Link
          href={ctaHref}
          variant="button"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-8 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
        >
          Get started
        </Link>
      </div>
    </aside>
  );
}
