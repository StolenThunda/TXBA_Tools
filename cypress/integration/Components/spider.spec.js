describe.only("Spider Page", () => {
  beforeEach(() => {
    cy.login("bob@bob.com", "password").then(() => cy.visit("/tools/spider"));
  });

  it.only("should be accessible", () => {
    cy.url().should("include", "/tools/spider");
  });
});
