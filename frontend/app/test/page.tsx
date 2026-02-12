import { fetchGraphQL } from "@/lib/wp-client";
import { GET_NODE_BY_URI } from "@/lib/queries";

export default async function TestPage() {
  const data = await fetchGraphQL<any>(GET_NODE_BY_URI, {
    uri: "/about",
  });

  return (
    <pre style={{ padding: "2rem" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
