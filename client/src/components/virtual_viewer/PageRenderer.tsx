import React, { Component } from "react";
import { Page } from "react-pdf";

interface Props {
  index: number;
  data: any;
  style: any;
}

export default function PageRenderer({ index, data, style }: Props) {
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
        <Page
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
