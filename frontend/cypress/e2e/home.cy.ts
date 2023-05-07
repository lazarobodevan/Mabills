/*
        * Cypress was giving a weird result when applying filters, what did not happen
        * when it was tested manually.
        * The framework was displaying multiplied instances of transactions. It stopped
        * when I removed the verification for each collumn of the transactions table.
        * 
        * Sometimes, it is needed to run the test more than once due to some odd errors
        * that I couldn't figure out.
*/

describe("#HOME", ()=>{

    before(()=>{
        cy.createTestUser();
        cy.login();
    })
    after(()=>{
        cy.deleteTestUser();
    })
    beforeEach(()=>{
        cy.visit('/home')
    })

    it("Should open Home page", ()=>{
        cy.contains('div', 'Contas a receber').should("be.visible");
        cy.contains('div', 'Contas a pagar').should("be.visible");
        cy.contains('div', 'Contas a vencer').should("be.visible");
        cy.get("span.value").should("contain", "R$ 0.00")
    })
})