import React, { Fragment, useEffect, useRef, useState } from "react";
import { Document as ReactPDFDocument } from "react-pdf/dist/esm/entry.webpack";
import { VariableSizeList } from "react-window";
import Page from "./Page";
import { debounce } from "throttle-debounce";

interface Props {
  scale: number;
  file: string;
  pageNumber?: number;
}

export default function Document({
  scale = 1.0,
  file,
  pageNumber = undefined,
}: Props) {
  const [pdf, setPdf] = useState<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const [cachedPageDimensions, setCachedPageDimensions] =
    useState<Map<any, any>>();
  const [responsiveScale, setResponsiveScale] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<Map<any, any>>(new Map());
  const [pages, setPages] = useState<Map<any, any>>(new Map());
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const [jumped, setJumped] = useState(false);

  const listRef = useRef<any>();

  const handleResize = () => {
    // Recompute the responsive scale factor on window resize
    const newResponsiveScale = computeResponsiveScale(currentPage);

    if (newResponsiveScale && responsiveScale !== newResponsiveScale) {
      setResponsiveScale(newResponsiveScale);
    }

    setContainerHeight(window.innerHeight);
  };

  const _callResizeHandler = debounce(50, handleResize);

  useEffect(() => {
    _callResizeHandler();
  }, [scale]);

  useEffect(() => {
    recomputeRowHeights();
  }, [responsiveScale]);

  useEffect(() => {
    if (listRef.current && !jumped && pdf && pageNumber) {
      // try to jump to the provided page number
      listRef.current.scrollToItem(pageNumber - 1);
      setJumped(true);
    }
  }, [listRef.current, pdf, pageNumber, jumped]);

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
    if (!listRef.current) {
      return;
    }
    listRef.current.resetAfterIndex(0);
  };

  const computeRowHeight = (index: any) => {
    if (cachedPageDimensions && responsiveScale) {
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

  return (
    <ReactPDFDocument
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.error(error)} // eslint-disable-line no-console
    >
      {cachedPageDimensions && (
        <Fragment>
          <VariableSizeList
            height={700}
            width={"100%"}
            itemCount={pdf.numPages}
            itemSize={computeRowHeight}
            itemData={{
              scale,
              pages,
              pageNumbers,
              numPages: pdf.numPages,
              triggerResize: _callResizeHandler,
            }}
            overscanCount={2}
            onItemsRendered={updateCurrentVisiblePage}
            ref={listRef}
          >
            {Page}
          </VariableSizeList>
        </Fragment>
      )}
    </ReactPDFDocument>
  );
}
