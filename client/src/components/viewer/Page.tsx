import { Page as ReactPDFPage } from "react-pdf";
import React, { useEffect, useRef } from "react";

interface Props {
  index: any;
  data: any;
  style: any;
}

export function Page({ index, data, style }: Props) {
  const pageNumber = index + 1;
  const ref = useRef<any>();

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    // set a ref in the Document map of each page.
    // Used to compute the scaling that react-pdf applies to each page
    if (!data.pageRefs.get(index)) {
      data.pageRefs.set(index, ref);
    }
  }, [ref]);

  return (
    <div
      id={`page_container_${pageNumber}`}
      key={`page_container_${pageNumber}`}
      style={{ ...style }}
    >
      <ReactPDFPage
        inputRef={ref}
        renderMode="svg"
        renderAnnotationLayer={false}
        onRenderSuccess={() => {
          // if (pageNumber && parseInt(pageNumber) === index + 1) {
          //   tryJump();
          // }
          data.recalc();
        }}
        onLoadSuccess={(page) => {
          //data.recalc();
        }}
        width={data.width}
        key={`page_${pageNumber}`}
        pageNumber={pageNumber}
      />
    </div>
  );
}
