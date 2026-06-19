import { rewriteUploadsUrl } from "@/lib/wp-media";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { ACQUISITION_PARTNER_FORM_ID, fetchGravityForm } from "@/lib/gf-client";

const BANNER_10 = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/banner-10.png";

export async function AcquisitionPartnerForm() {

    let acquisitionPartnerForm = null;
  try {
    acquisitionPartnerForm = await fetchGravityForm(ACQUISITION_PARTNER_FORM_ID);
  } catch {
    acquisitionPartnerForm = null;
  }
  return (
  <div
    className="relative w-full overflow-hidden bg-cover bg-center py-16"
    style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
  >
    {/* DARK OVERLAY */}
    <div className="absolute inset-0 bg-black/20" aria-hidden />

    {/* ✅ CONTAINER (matches rest of site) */}
    <div className="relative mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">

      {/* ✅ CARD WRAPPER */}
      
        <div className="bg-gray-100/75 p-10 md:p-12 rounded-xl" id="acquisitionPartnerForm">
          {acquisitionPartnerForm ? (<>
            <h2 className="mb-4 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
              Request an Exploratory Discussion Today!
            </h2>
            <GravityForm form={acquisitionPartnerForm} />
            </>
          ) : (
            <p className="text-sm text-[var(--color-fg)]">
              The acquisition partner form is temporarily unavailable. Please call{" "}
              <a
                href="tel:+18004587112"
                className="text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
              >
                (800) 458-7112
              </a>{" "}
              or try again later.
            </p>
          )}
        </div>

    </div>
  </div>
);

}
