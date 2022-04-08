import React, { Fragment, useRef, useState } from "react";
import { Document } from "react-pdf/dist/esm/entry.webpack";
import { VariableSizeList } from "react-window";
import PageRenderer from "./PageRenderer";

interface Props {
  scale: number;
  width: number;
  file: string;
}

export default function Viewer({ scale = 1.0, width, file }: Props) {
  const [pdf, setPdf] = useState<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const [cachedPageDimensions, setCachedPageDimensions] =
    useState<Map<any, any>>();
  const [responsiveScale, setResponsiveScale] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<Map<any, any>>(new Map());
  const [pages, setPages] = useState<Map<any, any>>(new Map());
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);

  const listRef = useRef<any>();

  const cachePageDimensions = (pdf: any) => {
    const promises = Array.from({ length: pdf.numPages }, (v, i) => i + 1).map(
      (pageNumber) => {
        return pdf.getPage(pageNumber);
      }
    );

    // Assuming all pages may have different heights. Otherwise we can just
    // load the first page and use its height for determining all the row
    // heights.
    Promise.all(promises).then((pages) => {
      const pageDimensions = new Map();

      for (const page of pages) {
        const w = page.view[2] * scale;
        const h = page.view[3] * scale;

        pageDimensions.set(page._pageIndex + 1, [w, h]);
      }

      setCachedPageDimensions(pageDimensions);
    });
  };

  const recomputeRowHeights = () => {
    listRef.current.resetAfterIndex(0);
  };

  const computeRowHeight = (index: any) => {
    if (cachedPageDimensions && responsiveScale) {
      console.log(responsiveScale);
      return cachedPageDimensions.get(index + 1)[1] / responsiveScale;
    }

    return 768; // Initial height
  };

  const onDocumentLoadSuccess = (pdf: any) => {
    setPdf(pdf);
    cachePageDimensions(pdf);
  };

  const updateCurrentVisiblePage = ({ visibleStopIndex }: any) => {
    setCurrentPage(visibleStopIndex + 1);
  };

  const computeResponsiveScale = (pageNumber: number) => {
    if (!pages || !pageNumbers || !cachedPageDimensions) {
      return;
    }
    const node = pages.get(pageNumbers.get(pageNumber));

    if (!node) return;

    return cachedPageDimensions.get(pageNumber)[1] / node.clientHeight;
  };

  const handleResize = () => {
    // Recompute the responsive scale factor on window resize
    const newResponsiveScale = computeResponsiveScale(currentPage);

    if (newResponsiveScale && responsiveScale !== newResponsiveScale) {
      setResponsiveScale(responsiveScale);
      recomputeRowHeights();
    }

    setContainerHeight(window.innerHeight);
  };

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.error(error)} // eslint-disable-line no-console
    >
      {cachedPageDimensions && (
        <Fragment>
          <VariableSizeList
            height={containerHeight}
            width={width}
            itemCount={pdf.numPages}
            itemSize={computeRowHeight}
            itemData={{
              scale,
              pages,
              pageNumbers,
              numPages: pdf.numPages,
              triggerResize: handleResize,
            }}
            overscanCount={2}
            onItemsRendered={updateCurrentVisiblePage}
            ref={listRef}
          >
            {PageRenderer}
          </VariableSizeList>
        </Fragment>
      )}
    </Document>
  );
}
