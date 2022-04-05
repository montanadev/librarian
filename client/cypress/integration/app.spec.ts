describe("Librarian", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should upload and render a pdf", () => {
    cy.get('[data-cy="dropzone"]').attachFile("sample.pdf", {
      subjectType: "drag-n-drop",
    });
    // high timeout because conversion time is variable
    cy.contains("click to view", { timeout: 30000 }).click();
    // the rendered document should have an svg with text 'snowflake_2'
    cy.contains("snowflake_2", { timeout: 30000 });
  });

  it("should upload and render a png", () => {
    cy.get('[data-cy="dropzone"]').attachFile("sample.png", {
      subjectType: "drag-n-drop",
    });
    cy.contains("click to view", { timeout: 30000 }).click();
    cy.contains("least", { timeout: 30000 });
  });
});
