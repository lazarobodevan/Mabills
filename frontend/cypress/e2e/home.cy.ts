
describe("#HOME", ()=>{
    before(()=>{
        cy.deleteTestUser();
        cy.createTestUser();
        cy.login();
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