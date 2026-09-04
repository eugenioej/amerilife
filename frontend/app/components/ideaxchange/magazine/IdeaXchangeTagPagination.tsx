import { IdeaXchangePagination } from "./IdeaXchangePagination";

type Props = {
  tagSlug: string;
  currentPage: number;
  totalPages: number;
};

export function IdeaXchangeTagPagination({
  tagSlug,
  currentPage,
  totalPages,
}: Props) {
  return (
    <IdeaXchangePagination
      basePath={`/ideaxchange/tags/${tagSlug}/`}
      currentPage={currentPage}
      totalPages={totalPages}
      ariaLabel="Tag pages"
    />
  );
}