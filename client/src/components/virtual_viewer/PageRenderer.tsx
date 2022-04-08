import React, { Component } from "react";
import { Page } from "react-pdf";

class PageRenderer extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { index, data, style } = this.props as any;
    const { scale, numPages, triggerResize } = data;

    const pageNumber = index + 1;

    return (
      <div {...{ style }}>
        <div
          ref={(ref) => {
            const { pages, pageNumbers } = (this.props as any).data;

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
              (error) =>
                console.error(error) /* eslint-disable-line no-console */
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
}

export default PageRenderer;
