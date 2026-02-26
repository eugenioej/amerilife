type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <h1 className="text-2xl font-bold text-[var(--color-fg)]">
        Search
        {q ? (
          <span className="ml-2 font-normal text-[var(--color-muted)]">
            for &quot;{q}&quot;
          </span>
        ) : null}
      </h1>
      {q ? (
        <p className="mt-4 text-[var(--color-muted)]">
          Search results will be displayed here. Integrate with WordPress search
          or your search provider.
        </p>
      ) : (
        <p className="mt-4 text-[var(--color-muted)]">
          Enter a search term to find content.
        </p>
      )}
    </div>
  );
}
