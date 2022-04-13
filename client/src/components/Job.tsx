import "./Job.css";
import React from "react";
import Progress from "./Progress";
import { Link } from "react-router-dom";
import { DocumentModel } from "../models/Document";

interface Props {
  document: DocumentModel;
}

export default function Job({ document }: Props) {
  let progress = () => {
    switch (document.status) {
      case "CREATED":
        return <Progress percent={10} done={false} success={false} />;
      case "PERSISTING":
        return <Progress percent={25} done={false} success={false} />;
      case "PERSISTED":
        return <Progress percent={40} done={false} success={false} />;
      case "TRANSLATING_PDF_TO_IMAGES":
        return <Progress percent={55} done={false} success={false} />;
      case "TRANSLATED_PDF_TO_IMAGES":
        return <Progress percent={70} done={false} success={false} />;
      case "ANNOTATING":
        return <Progress percent={85} done={false} success={false} />;
      case "ANNOTATED":
        return <Progress percent={100} done={true} success={true} />;
      default:
        return <Progress percent={100} done={true} success={false} />;
    }
  };

  return (
    <div className="Job">
      <div className="JobFilename">
        {document.status === "ANNOTATED" ? (
          <Link to={`/folders/${document.folder}/documents/${document.id}`}>
            {document.filename} (click to view)
          </Link>
        ) : (
          document.filename
        )}
      </div>
      <div className="JobProgress">{progress()}</div>
    </div>
  );
}
