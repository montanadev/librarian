import React, { useRef, useState } from "react";
import "../Uploader.css";
import { Spin } from "antd";
import { Document as ReactPDFDocument, Page as ReactPDFPage } from "react-pdf";
import { useContainerDimensions } from "../../utils/useContainerDimenstions";
import { toastError } from "../../utils/toasts";
import PageBoundary from "./PageBoundary";
import { Loading } from "../Loading";

interface Props {
  pageNumber: string;
  documentId: string;
  zoom: number;
}

function Document({ zoom, pageNumber, documentId }: Props) {
  const [numPages, setNumPages] = useState(null);
  const [pdf, setPdf] = useState(null);

  const onLoad = (pdf: any) => {
    setNumPages(pdf.numPages);
    setPdf(pdf);
  };

  const ref = useRef<any>();
  const { width } = useContainerDimensions(ref);

  const tryJump = () => {
    const pageEl = document.querySelector(`[data-page-number="${pageNumber}"`);

    if (pageEl) {
      pageEl.scrollIntoView();
    }
  };

  return (
    <div ref={ref}>
      <ReactPDFDocument
        file={`/api/documents/${documentId}/data`}
        loading={<Loading />}
        onLoadSuccess={onLoad}
        onLoadError={(e) => toastError(`Error loading document: ${e.message}`)}
        onSourceError={(e) => toastError(`Error loading source: ${e.message}`)}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_container_${index + 1}`}
            style={{ width: width * zoom }}
          >
            <ReactPDFPage
              renderMode="svg"
              renderAnnotationLayer={false}
              onRenderSuccess={() => {
                if (pageNumber && parseInt(pageNumber) === index + 1) {
                  tryJump();
                }
              }}
              width={width * zoom}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
            <PageBoundary pageNumber={index + 1} />
          </div>
        ))}
      </ReactPDFDocument>
    </div>
  );
}

export default Document;
