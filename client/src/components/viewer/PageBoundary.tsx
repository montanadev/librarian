interface Props {
  pageNumber: number;
}

function PageBoundary({ pageNumber }: Props) {
  return (
    <>
      <p style={{ float: "right" }}>{pageNumber}</p>
      <hr style={{ margin: 10 }} />
    </>
  );
}

export default PageBoundary;
