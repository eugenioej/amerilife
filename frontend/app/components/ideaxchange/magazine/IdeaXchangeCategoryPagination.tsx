import { IDEAXCHANGE_CATEGORY_PATH } from "@/lib/ideaxchange-constants";
import { IdeaXchangePagination } from "./IdeaXchangePagination";

type Props = {
  topicSlug: string;
  currentPage: number;
  totalPages: number;
};

export function IdeaXchangeCategoryPagination({ topicSlug, currentPage, totalPages }: Props) {
  return (
    <IdeaXchangePagination
      basePath={`${IDEAXCHANGE_CATEGORY_PATH}${topicSlug}/`}
      currentPage={currentPage}
      totalPages={totalPages}
      ariaLabel="Category pages"
    />
  );
}
