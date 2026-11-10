export function AgencyFooterDisclaimer() {
  return (
    <div className="bg-gray-100 py-6">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] text-sm text-gray-600">
        We do not offer every plan available in your area. Currently we represent [insert number of organizations] organizations which offer [insert number of plans] products in your area. Please contact <a href="http://medicare.gov/">Medicare.gov</a> or 1-800-MEDICARE to get information on all of your options.
      </div>
    </div>
  );
}