describe("#TRANSACTIONS", ()=>{

    before(()=>{
        cy.deleteTestUser();
        cy.createTestUser();
        cy.login();
    })

    beforeEach(()=>{
        cy.visit('/expenses');
        cy.get('div.loading-container').should('be.visible');
    })
    
    it('Should open the Expenses page', ()=>{
        cy.contains('b', 'Nome').should('be.visible');
        cy.contains('b', 'Tipo').should('be.visible');
        cy.contains('b', 'Categoria').should('be.visible');
        cy.contains('b', 'Valor').should('be.visible');
        cy.contains('b', 'Data').should('be.visible');
        cy.contains('b', 'Pago?').should('be.visible');
    })
})