import { Link } from "react-router-dom";
import { Api } from "../../utils/Api";
import { useQuery } from "react-query";
import { ResourceModel } from "../../models/Resource";
import { Loading } from "../Loading";
import { DocumentTextModel } from "../../models/DocumentText";
import { Card } from "antd";
import { Pagination } from "../Pagination";
import { useEffect, useState } from "react";

export function SearchTextResults({ q }: { q: string }) {
  const api = new Api();
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const documents = useQuery<ResourceModel<DocumentTextModel>>(
    ["document-text-search", q, offset],
    () => api.searchDocumentText(q, limit, offset)
  );

  useEffect(() => {
    // reset the offset when query changes
    setOffset(0);
  }, [q]);

  if (documents.isLoading || !documents.data) {
    return <Loading />;
  }

  return (
    <Card title={`Text results (found on ${documents.data.count} pages)`}>
      {documents.data.count ? (
        <>
          {documents.data.results.map((l) => {
            const link = `/folders/${l.folder}/documents/${l.document}/pages/${
              l.page_number + 1
            }`;
            return (
              <Card
                type="inner"
                title={<Link to={link}>{l.document_filename}</Link>}
                style={{ marginBottom: "15px" }}
              >
                <div dangerouslySetInnerHTML={{ __html: l.headline }} />
              </Card>
            );
          })}
        </>
      ) : (
        <p>No search matches found...</p>
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
