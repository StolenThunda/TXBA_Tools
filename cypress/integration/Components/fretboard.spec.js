beforeEach(() => {
    cy.login("bob@bob.com", "password").then(() =>
      cy.visit("/tools/fretboard")
    );
} );
describe.only( "Fretboard Page", () => {
  

  it.only("should be accessible", () => {
    cy.url().should("include", "tools/fretboard");
  });
});
describe.only("should have fretboard", () => {
  it("should have fretboard container", () => {
    cy.get("#fretboard").should("be.visible");
  });

  it.only( "should have svg wrapper", () => {
    cy.get( "#fretboard-wrapper" )
      .should( "be.visible" )
    .should( "have.attr", "shape-rendering", "geometricPrecision" );
  });
});
describe.only("Has 1-4-5 for all keys", () => {
  /* ==== Test Created with Cypress Studio ==== */
  it.only("Key of E - 1-4-5 Visible", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '[points="748.33,-22.64 748.33,336.49 887.33,339.49 887.33,-25"]'
    ).should(
      "have.attr",
      "points",
      "748.33,-22.64 748.33,336.49 887.33,339.49 887.33,-25"
    );
  
    cy.get(
      '[points="1041.33,-29 1041.33,341.49 1166.33,342.49 1166.33,-31"]'
    ).should(
      "have.attr",
      "points",
      "1041.33,-29 1041.33,341.49 1166.33,342.49 1166.33,-31"
    );
    cy.get(
      '[points="1645.33,-41 1645.33,347.49 1735.33,350.49 1735.33,-41.59"]'
    ).should(
      "have.attr",
      "points",
      "1645.33,-41 1645.33,347.49 1735.33,350.49 1735.33,-41.59"
    );
    cy.get('[points="0,212.5 2498,226.5 2498,233.5 0,219.5 "]').should(
      "have.attr",
      "points",
      "0,212.5 2498,226.5 2498,233.5 0,219.5 "
    );
    cy.get(
      '[points="2246.33,-55 2246.33,357.49 2303.33,357.49 2303.33,-54"]'
    ).should(
      "have.attr",
      "points",
      "2246.33,-55 2246.33,357.49 2303.33,357.49 2303.33,-54"
    );

    cy.get('[points="0,174.5 2502,174.5 2502,180.5 0,180.5 "]').should(
      "have.attr",
      "points",
      "0,174.5 2502,174.5 2502,180.5 0,180.5 "
    );
    /* ==== End Cypress Studio ==== */
  });
  it.only("Key of F - 1-4-5 Visible", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '[points="52.33,-5.799999999999997 52.33,324.5 236.33,325 236.33,-12"]'
    ).should(
      "have.attr",
      "points",
      "52.33,-5.799999999999997 52.33,324.5 236.33,325 236.33,-12"
    );
    cy.get(
      '[points="897.33,-25 897.33,339.49 1031.33,341.49 1031.33,-29"]'
    ).should(
      "have.attr",
      "points",
      "897.33,-25 897.33,339.49 1031.33,341.49 1031.33,-29"
    );
    cy.get(
      '[points="1176.33,-31 1176.33,342.49 1293.33,343.49 1293.33,-33"]'
    ).should(
      "have.attr",
      "points",
      "1176.33,-31 1176.33,342.49 1293.33,343.49 1293.33,-33"
    );
    cy.get(
      '[points="1745.33,-41.59 1745.33,350.49 1831.33,351.49 1831.33,-44"]'
    ).should(
      "have.attr",
      "points",
      "1745.33,-41.59 1745.33,350.49 1831.33,351.49 1831.33,-44"
    );
    cy.get(
      '[points="2173.33,-51 2173.33,356.49 2236.33,357.49 2236.33,-55"]'
    ).should(
      "have.attr",
      "points",
      "2173.33,-51 2173.33,356.49 2236.33,357.49 2236.33,-55"
    );
    cy.get(
      '[points="2313.33,-54 2313.33,357.49 2367.33,359.49 2367.33,-54"]'
    ).should(
      "have.attr",
      "points",
      "2313.33,-54 2313.33,357.49 2367.33,359.49 2367.33,-54"
    );
    /* ==== End Cypress Studio ==== */
  });
});
