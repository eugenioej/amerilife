import { fetchGraphQL } from "@/lib/wp-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";

export default async function TestPage() {
  const data = await fetchGraphQL<any>(GET_PAGE_BY_SLUG, {
    slug: "/about/",
  });

  return (
    <pre style={{ padding: "2rem" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}