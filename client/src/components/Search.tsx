import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { DocumentModel } from "../models/Document";
import { Link } from "react-router-dom";
import { DocumentTextModel } from "../models/DocumentText";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const [documentSearch, setDocumentSearch] = useState([]);
  const [documentTextSearch, setDocumentTextSearch] = useState([]);
  const query = useQuery();
  const q = query.get("q");
  console.log(q);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/documents/search", {
        params: { q },
      })
      .then((d) => setDocumentSearch(d.data));

    axios
      .get("http://localhost:8000/api/documents/text/search", {
        params: { q },
      })
      .then((d) => setDocumentTextSearch(d.data));
  }, [q]);

  const formatDocumentLinks = (links: Array<DocumentModel>) => {
    return (
      <ul>
        {links.map((l) => {
          return (
            <li>
              <Link to={`documents/${l.id}`}>{l.filename}</Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const formatDocumentTextLinks = (links: Array<DocumentTextModel>) => {
    return (
      <ul>
        {links.map((l) => {
          return (
            <li>
              <Link to={`documents/${l.id}`}>{l.text}</Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <h1>Document Search</h1>
      {documentSearch.length ? (
        <div>{formatDocumentLinks(documentSearch)}</div>
      ) : (
        <p>No document titles found...</p>
      )}

      <h1>Document Text Search</h1>
      {documentTextSearch.length ? (
        <div>{formatDocumentTextLinks(documentTextSearch)}</div>
      ) : (
        <p>No documents titles found...</p>
      )}
    </div>
  );
}

export default Search;
