describe("#TRANSACTIONS", ()=>{

    before(()=>{
        cy.deleteTestUser();
        cy.createTestUser();
    })

    beforeEach(()=>{
        cy.login();
        cy.viewport(1280,720)
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
    });

    it('Should add an Income transaction', () =>{

        //Adding category
        cy.visit('/categories');
        cy.getByTestId("add-button").click();
        cy.getByTestId("name-input").type("category test");
        cy.getByTestId("color-input").click();
        cy.get("[type='color']").eq(1).invoke('val', '#af44fd').trigger('input')
        cy.getByTestId("conclude-button").click();

        //Adding transaction
        cy.visit('/expenses')
        cy.getByTestId('add-expense-button').click();
        cy.getByTestId('name-input').type("transaction");
        cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        cy.getByTestId('date-input').type("2023-05-02");
        cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click()

        //Verifying if it is displayed after added
        cy.getByTestId('transaction-name').should("have.text", "transaction");
        cy.getByTestId('transaction-type').should("contain", "Receita");
        cy.getByTestId('transaction-color').should("have.css",'background-color','rgb(175, 68, 253)');
        cy.getByTestId('transaction-category-name').should("have.text", "category test");
        cy.getByTestId('transaction-value').should('have.text','R$ 123');
        cy.getByTestId('transaction-date').should("contain","02/05/2023");
        cy.getByTestId('transaction-isPaid').should("contain","-");

    })
})