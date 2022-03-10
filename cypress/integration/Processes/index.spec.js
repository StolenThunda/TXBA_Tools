describe.only("Index Page", () => {
  beforeEach(() => {
    cy.login( "bob@bob.com", "password" )
      .then( () => cy.visit( "/" ) )
  });

    it.only("should be the index page", () => {
      cy.url().should("include", "/");
    });

  it.only("should have 3 buttons", () => {
    cy.get("main .q-btn").should("have.length", 3);
  });

  // context("check btn routes", () => {
    it.only("check routes", () => {
      cy.getBySel("fretboard-tool").click();
      cy.url().should("include", "/tools/fretboard");
      cy.getBySel("back-btn").click({ force: true });

      cy.getBySel("spider-tool").click();
      cy.url().should("include", "/tools/spider");
      cy.getBySel("back-btn").click({ force: true });

      cy.getBySel("tuner-tool").click();
      cy.url().should("include", "/tools/tuner");
    });
  // });
});
