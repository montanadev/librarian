import { DocumentModel } from "../../models/Document";
import { Link } from "react-router-dom";
import { Api } from "../../utils/Api";
import { useQuery } from "react-query";
import { ResourceModel } from "../../models/Resource";
import { Loading } from "../Loading";
import { Card } from "antd";
import { Pagination } from "../Pagination";
import { useEffect, useState } from "react";

export function SearchTitleResults({ q }: { q: string }) {
  const api = new Api();
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const documents = useQuery<ResourceModel<DocumentModel>>(
    ["document-title-search", q, offset],
    () => api.searchDocumentTitles(q, limit, offset)
  );

  useEffect(() => {
    // reset the offset when query changes
    setOffset(0);
  }, [q]);

  if (documents.isLoading || !documents.data) {
    return <Loading />;
  }

  return (
    <Card title={`Title results (found ${documents.data.count} matches)`}>
      {documents.data.count ? (
        <>
          {documents.data.results.map((l) => {
            const link = `/folders/${l.folder}/documents/${l.id}`;
            return (
              <>
                <Link to={link}>{l.filename}</Link>
                <br />
              </>
            );
          })}
        </>
      ) : (
        <p>No document titles found...</p>
      )}

      <Pagination
        offset={offset}
        onChange={setOffset}
        data={documents.data}
        limit={limit}
      />
    </Card>
  );
}
