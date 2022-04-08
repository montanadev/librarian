import React, { useEffect, useRef, useState } from "react";
import "../Uploader.css";
import { Document as ReactPDFDocument, Page as ReactPDFPage } from "react-pdf";
import { useContainerDimensions } from "../../utils/useContainerDimenstions";
import { toastError } from "../../utils/toasts";
import PageBoundary from "./PageBoundary";
import { Loading } from "../Loading";
import { VariableSizeList } from "react-window";
import { Page } from "./Page";
import { list } from "postcss";
import Viewer from "../virtual_viewer/Viewer";

interface Props {
  pageNumber: string;
  documentId: string;
  percentWidth: number;
}

function Document({ percentWidth, pageNumber, documentId }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pdf, setPdf] = useState<any>();
  const [pageDimensions, setPageDimensions] = useState<Map<number, number[]>>();
  const [pageRefs, setPageRefs] = useState<Map<number, any>>(new Map());
  const [currentVisiblePage, setCurrentVisiblePage] = useState(0);
  const [responsiveScale, setResponsiveScale] = useState(1);
  //
  // const onLoad = (pdf: any) => {
  //   setNumPages(pdf.numPages);
  //   setPdf(pdf);
  // };
  //
  // const computeResponsiveScale = (pageNumber: number) => {
  //   if (!pageRefs || !pageDimensions) {
  //     console.log("Bailing 1", pageRefs, pageDimensions);
  //     return 1;
  //   }
  //
  //   const pageRef = pageRefs.get(pageNumber);
  //   if (!pageRef || !pageRef.current) {
  //     console.log("Bailing 2", pageNumber, pageRefs);
  //     return 1;
  //   }
  //
  //   const pageDimension = pageDimensions.get(pageNumber);
  //   if (!pageDimension) {
  //     console.log("Bailing 3");
  //     return 1;
  //   }
  //
  //   console.log("Ref height: ", pageRef.current.clientHeight);
  //   return pageDimension[1] / pageRef.current.clientHeight;
  // };
  //
  // const recalculatePageDimensions = () => {
  //   const promises = Array.from({ length: pdf.numPages }, (v, i) => i + 1).map(
  //     (pageNumber) => {
  //       return pdf.getPage(pageNumber);
  //     }
  //   );
  //   Promise.all(promises).then((pages) => {
  //     const dimensions = new Map();
  //
  //     // TODO - compute the width responsiveness scale
  //
  //     for (const page of pages) {
  //       const w = page.view[2] * percentWidth;
  //       const h = page.view[3] * percentWidth;
  //       dimensions.set(page._pageIndex, [w, h]);
  //     }
  //     setPageDimensions(dimensions);
  //   });
  // };
  //
  // useEffect(() => {
  //   if (!pdf) {
  //     return;
  //   }
  //   recalculatePageDimensions();
  // }, [pdf]);
  //
  // useEffect(() => {
  //   setResponsiveScale(computeResponsiveScale(currentVisiblePage));
  //
  //   if (listRef.current) {
  //     listRef.current.resetAfterIndex(0);
  //   }
  // }, [percentWidth, pageRefs]);
  //
  const ref = useRef<any>();
  // const listRef = useRef<any>();
  const { width } = useContainerDimensions(ref);
  //
  // const tryJump = () => {
  //   const pageEl = document.querySelector(`[data-page-number="${pageNumber}"`);
  //
  //   if (pageEl) {
  //     pageEl.scrollIntoView();
  //   }
  // };
  //
  // let height = 720;
  // if (ref.current) {
  //   height = window.innerHeight - ref.current.getBoundingClientRect().top;
  // }

  return (
    <div id="document-container" ref={ref}>
      <Viewer file={`/api/documents/${documentId}/data`} width={width} />
    </div>

    // <div id="document-container" ref={ref}>
    //   <ReactPDFDocument
    //     file={`/api/documents/${documentId}/data`}
    //     loading={<Loading />}
    //     onLoadSuccess={onLoad}
    //     onLoadError={(e) => toastError(`Error loading document: ${e.message}`)}
    //     onSourceError={(e) => toastError(`Error loading source: ${e.message}`)}
    //   >
    //     {pageDimensions?.size && (
    //       <VariableSizeList
    //         ref={listRef}
    //         height={height}
    //         width={width}
    //         overscanCount={1}
    //         itemData={{
    //           numPages: numPages,
    //           width: width * percentWidth,
    //           pageRefs: pageRefs,
    //           recalc: () => {
    //             setResponsiveScale(computeResponsiveScale(currentVisiblePage));
    //
    //             //listRef.current.resetAfterIndex(0);
    //           },
    //         }}
    //         itemSize={(index) => {
    //           if (!pdf || !pageDimensions) {
    //             return 100;
    //           }
    //           if (!pageDimensions.get(index)) {
    //             return 100;
    //           }
    //           console.log(
    //             "itemSize height of ",
    //             pageDimensions.get(index)![1] / responsiveScale,
    //             "page height is",
    //             pageDimensions.get(index)![1],
    //             "and scale is",
    //             responsiveScale
    //           );
    //           return pageDimensions.get(index)![1] / responsiveScale;
    //         }}
    //         itemCount={numPages}
    //         onItemsRendered={({ visibleStopIndex }) =>
    //           setCurrentVisiblePage(visibleStopIndex)
    //         }
    //       >
    //         {Page}
    //       </VariableSizeList>
    //     )}
    //   </ReactPDFDocument>
    // </div>
  );
}

export default Document;
