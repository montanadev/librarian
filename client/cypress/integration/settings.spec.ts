describe("Librarian", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should set aws settings", () => {
    // click settings menu bar
    cy.get('[data-cy="settings"]').click();
    // click s3 option
    cy.get('[data-cy="storage-mode-s3"]').click();
    // type in some values
    cy.get('[data-cy="settings-aws-access-key-id"]')
      .clear()
      .type("aws-access-key-id");
    cy.get('[data-cy="settings-aws-secret-access-key"]')
      .clear()
      .type("aws-secret-access-key");
    cy.get('[data-cy="settings-aws-bucket"]').clear().type("aws-bucket");
    // submit
    cy.get('[data-cy="settings-submit"]').click();

    // reopen modal
    cy.get('[data-cy="settings"]').click();
    cy.get('[data-cy="settings-aws-access-key-id"]').should(
      "have.value",
      "aws-access-key-id"
    );
    cy.get('[data-cy="settings-aws-secret-access-key"]').should(
      "have.value",
      "aws-secret-access-key"
    );
    cy.get('[data-cy="settings-aws-bucket"]').should(
      "have.value",
      "aws-bucket"
    );
  });

  it("should set persist aws settings", () => {
    cy.get('[data-cy="settings"]').click();
    cy.get('[data-cy="settings-aws-access-key-id"]').should(
      "have.value",
      "aws-access-key-id"
    );
    cy.get('[data-cy="settings-aws-secret-access-key"]').should(
      "have.value",
      "aws-secret-access-key"
    );
    cy.get('[data-cy="settings-aws-bucket"]').should(
      "have.value",
      "aws-bucket"
    );
  });
});
