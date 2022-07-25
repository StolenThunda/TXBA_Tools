  beforeEach(() => {
    cy.login("bob@bob.com", "password").then(() => cy.visit("/"));
  });
describe.only("Index Page", () => {

  it.only("should be the index page", () => {
    cy.url().should("include", "/");
  });

  it.only("should have 3 buttons", () => {
    cy.get("main .q-btn").should("have.length", 3);
  });
});
context("Check btn/tool routes", () => {
  ["tuner", "spider", "fretboard"].forEach((tool) => {
    const toolName = `${tool}-tool`;
   
    it.only(`should have a button for ${tool.toUpperCase()} tool`, () => {
      cy.log(`check ${tool.toUpperCase()} button data attribute`);
      cy.getBySel(toolName).invoke("attr", "data-cy").should("equal", toolName);
    });
     it.only(`checking ${tool.toUpperCase()} route`, () => {
       cy.getBySel(toolName).click();
       cy.url().should("include", `tools/${tool}`);
       cy.getBySel("back-btn").click({ force: true });
     });
  });
});
