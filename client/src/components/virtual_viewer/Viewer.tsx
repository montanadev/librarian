import React, { PureComponent, Fragment, createRef } from "react";
import PropTypes from "prop-types";
import { Document } from "react-pdf/dist/esm/entry.webpack";
import { VariableSizeList } from "react-window";
import PageRenderer from "./PageRenderer";

class Viewer extends PureComponent {
  static propTypes = {
    scale: PropTypes.number.isRequired,
    file: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    scale: 1.2,
  };
  private _list: React.RefObject<unknown>;
  private _callResizeHandler: OmitThisParameter<() => void>;
  private _callOrientationChangeHandler: any;
  private _mounted: boolean = false;

  constructor(props: any) {
    super(props);

    this.state = {
      containerHeight: window.innerHeight,
      pdf: null,
      currentPage: 1,
      cachedPageDimensions: null,
      responsiveScale: 1,
      pageNumbers: new Map(),
      pages: new WeakMap(),
    };

    this._list = createRef();

    this._callResizeHandler = () => this.handleResize();
    this._callOrientationChangeHandler = () => this.handleResize();
  }

  componentDidMount() {
    this._mounted = true;
    window.addEventListener("resize", this._callResizeHandler);
    window.addEventListener(
      "orientationchange",
      this._callOrientationChangeHandler
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("resize", this._callResizeHandler);
    window.removeEventListener(
      "orientationchange",
      this._callOrientationChangeHandler
    );
  }

  /**
   * Load all pages so we can cache all page dimensions.
   *
   * @param {Object} pdf
   * @returns {void}
   */
  cachePageDimensions(pdf: any) {
    const promises = Array.from({ length: pdf.numPages }, (v, i) => i + 1).map(
      (pageNumber) => {
        return pdf.getPage(pageNumber);
      }
    );

    // Assuming all pages may have different heights. Otherwise we can just
    // load the first page and use its height for determining all the row
    // heights.
    Promise.all(promises).then((pages) => {
      if (!this._mounted) {
        return;
      }

      const pageDimensions = new Map();

      for (const page of pages) {
        const w = page.view[2] * (this.props as any).scale;
        const h = page.view[3] * (this.props as any).scale;

        pageDimensions.set(page._pageIndex + 1, [w, h]);
      }

      this.setState({ cachedPageDimensions: pageDimensions });
    });
  }

  recomputeRowHeights() {
    (this._list as any).current.resetAfterIndex(0);
  }

  computeRowHeight(index: any) {
    const { cachedPageDimensions, responsiveScale } = this.state as any;

    if (cachedPageDimensions && responsiveScale) {
      return cachedPageDimensions.get(index + 1)[1] / responsiveScale;
    }

    return 768; // Initial height
  }

  onDocumentLoadSuccess(pdf: any) {
    this.setState({ pdf });
    this.cachePageDimensions(pdf);
  }

  updateCurrentVisiblePage({ visibleStopIndex }: any) {
    this.setState({ currentPage: visibleStopIndex + 1 });
  }

  computeResponsiveScale(pageNumber: number) {
    const { cachedPageDimensions, pages, pageNumbers } = this.state as any;

    const node = pages.get(pageNumbers.get(pageNumber));

    if (!node) return;

    return cachedPageDimensions.get(pageNumber)[1] / node.clientHeight;
  }

  handleResize() {
    const { currentPage, responsiveScale } = this.state as any;

    // Recompute the responsive scale factor on window resize
    const newResponsiveScale = this.computeResponsiveScale(currentPage);

    if (newResponsiveScale && responsiveScale !== newResponsiveScale) {
      this.setState({ responsiveScale: newResponsiveScale }, () =>
        this.recomputeRowHeights()
      );
    }

    this.setState({ containerHeight: window.innerHeight });
  }

  handleClick(index: any) {
    (this._list as any).current.scrollToItem(index);
  }

  render() {
    const { scale, file, width } = this.props as any;
    const { cachedPageDimensions, containerHeight, pdf, pages, pageNumbers } =
      this.state as any;

    return (
      <Document
        file={file}
        onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
        onLoadError={(error) => console.error(error)} // eslint-disable-line no-console
      >
        {cachedPageDimensions && (
          <Fragment>
            <VariableSizeList
              height={containerHeight}
              width={width}
              itemCount={pdf.numPages}
              itemSize={this.computeRowHeight.bind(this)}
              itemData={{
                scale,
                pages,
                pageNumbers,
                numPages: pdf.numPages,
                triggerResize: this.handleResize.bind(this),
              }}
              overscanCount={2}
              onItemsRendered={this.updateCurrentVisiblePage.bind(this)}
              ref={this._list as any}
            >
              {PageRenderer as any}
            </VariableSizeList>
          </Fragment>
        )}
      </Document>
    );
  }
}

export default Viewer;
