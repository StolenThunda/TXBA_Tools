describe.only("Fretboard Page", () => {
  beforeEach(() => {
    cy.login("bob@bob.com", "password").then(() =>
      cy.visit("/tools/fretboard")
    );
  });

  it.only("should be accessible", () => {
    cy.url().should("include", "tools/fretboard");
  });
});
