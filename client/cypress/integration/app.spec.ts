describe("Librarian", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should upload and render a document", () => {
    cy.get('[data-cy="dropzone"]').attachFile("sample.pdf", {
      subjectType: "drag-n-drop",
    });
    // high timeout because conversion time is variable
    cy.contains("click to view", { timeout: 30000 }).click();
    // the rendered document should have an svg with text 'snowflake_2'
    cy.contains("snowflake_2");
  });
});
