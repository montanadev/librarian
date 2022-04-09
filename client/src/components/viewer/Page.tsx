import React from "react";
import { Page as ReactPDFPage } from "react-pdf";

interface Props {
  index: number;
  data: any;
  style: any;
}

export default function Page({ index, data, style }: Props) {
  const { scale, numPages, triggerResize } = data;

  const pageNumber = index + 1;

  return (
    <div {...{ style }}>
      <div
        ref={(ref) => {
          const { pages, pageNumbers } = data;

          if (!pageNumbers.has(pageNumber)) {
            const key = { pageNumber };
            pageNumbers.set(pageNumber, key);
          }

          pages.set(pageNumbers.get(pageNumber), ref);
        }}
      >
        <ReactPDFPage
          {...{ pageNumber }}
          {...{ scale }}
          renderAnnotationLayer={false}
          onLoadError={
            (error) => console.error(error) /* eslint-disable-line no-console */
          }
          onLoadSuccess={(page) => {
            // This is necessary to ensure the row heights of
            // the variable list are correctly initialised.
            if (page.pageNumber === numPages) {
              triggerResize();
            }
          }}
        />
      </div>
    </div>
  );
}
