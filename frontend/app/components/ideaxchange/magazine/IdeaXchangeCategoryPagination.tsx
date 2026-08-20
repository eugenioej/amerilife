import { IdeaXchangePagination } from "./IdeaXchangePagination";

type Props = {
  topicSlug: string;
  currentPage: number;
  totalPages: number;
};

export function IdeaXchangeCategoryPagination({
  topicSlug,
  currentPage,
  totalPages,
}: Props) {
  return (
    <IdeaXchangePagination
      basePath={`/ideaxchange/${topicSlug}/`}
      currentPage={currentPage}
      totalPages={totalPages}
      ariaLabel="Category pages"
    />
  );
}