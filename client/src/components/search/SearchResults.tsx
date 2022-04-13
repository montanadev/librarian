import { useLocation } from "react-router";
import { Api } from "../../utils/Api";
import { SearchTitleResults } from "./SearchTitleResults";
import { SearchTextResults } from "./SearchTextResults";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const q = query.get("q");
  const api = new Api();

  if (!q) {
    return <div>Must provide a search term, please try again</div>;
  }

  return (
    <>
      <SearchTitleResults q={q} />
      <SearchTextResults q={q} />
    </>
  );
}

export default SearchResults;
