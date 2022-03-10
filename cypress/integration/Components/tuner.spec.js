describe.only( "Tuner Page", () => {
  beforeEach( () => {
    cy.login("bob@bob.com", "password").then(() =>
      cy.visit("/tools/tuner")
    );
  } );

  it.only( "should be accessible", () => {
    cy.url().should( "include", "/tools/tuner" );
  } );
})