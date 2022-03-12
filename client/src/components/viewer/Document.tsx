import React, { useRef, useState } from "react";
import "../Uploader.css";
import { Spin } from "antd";
import { Document as ReactPDFDocument, Page } from "react-pdf";
import { useContainerDimensions } from "../../utils/useContainerDimenstions";

interface Props {
  pageNumber: string;
  documentId: string;
}

function Document({ pageNumber, documentId }: Props) {
  const [numPages, setNumPages] = useState(null);
  const [pdf, setPdf] = useState(null);

  const onDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
    setPdf(pdf);
  };

  const containerRef = useRef<any>();
  const { width } = useContainerDimensions(containerRef);

  return (
    <div>
      <div ref={containerRef}>
        <ReactPDFDocument
          file={`/api/documents/${documentId}/data`}
          loading={<Spin size="large" />}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) =>
            alert("Error while loading document! " + error.message)
          }
          onSourceError={(error) =>
            alert("Error while retrieving document source! " + error.message)
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <>
              <Page
                onRenderSuccess={() => {
                  if (pageNumber && parseInt(pageNumber) === index + 1) {
                    const pageEl = document.querySelector(
                      `[data-page-number="${pageNumber}"`
                    );
                    if (pageEl) {
                      pageEl.scrollIntoView();
                    }
                  }
                }}
                width={width}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
              <div>
                <p style={{ float: "right" }}>{index + 1}</p>
                <hr style={{ margin: 10 }} />
              </div>
            </>
          ))}
        </ReactPDFDocument>
      </div>
    </div>
  );
}

export default Document;
