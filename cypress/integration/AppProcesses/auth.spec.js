beforeEach(() => {
  cy.visit("/auth");
});
describe.only("Authentication/Entry/Registration", () => {
  it.only("should be the auth page", () => {
    cy.url().should("include", "/auth");
  });
  it.only("can login", () => {
    cy.getBySel("enter-btn").click();
    cy.get("[type=submit]").click();
    cy.get("[aria-label='Email']").type("bob@bob.com");
    cy.get("[aria-label='Password']").type("password");
    cy.get("[type=submit]").should("contain", "login").click();
    cy.get( ".q-toolbar__title" ).should( "contain", "TXBA TOOLS" );
    cy.getBySel("back-btn").click({ force: true });
  });
  it.only("Button contain text 'enter'", () => {
    cy.getBySel("enter-btn").should("contain", "Enter");
  });
  it.only("button opens dialog", () => {
    cy.getBySel("enter-btn").click();
    cy.get(".q-dialog").should("be.visible");
  });

  it.only("login tab should be active", () => {
    cy.getBySel("enter-btn").click();
    cy.getBySel("login-tab").should("have.class", "q-tab--active");
  });
});
