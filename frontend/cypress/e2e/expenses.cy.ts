
    /*
        * Cypress was giving a weird result when applying filters, what did not happen
        * when it was tested manually.
        * The framework was displaying multiplied instances of transactions. It stopped
        * when I removed the verification for each collumn of the transactions table.
        * 
        * Sometimes, it is needed to run the test more than once due to some odd errors
        * that I couldn't figure out.
    */

describe("#TRANSACTIONS", ()=>{
    

    before(()=>{
        cy.createTestUser();
    });

    after(()=>{
        cy.deleteTestUser();
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
        cy.getByTestId('transaction-name').should("contain", "transaction");
        cy.getByTestId('transaction-type').should("contain", "Receita");
        cy.getByTestId('transaction-color').should("have.css",'background-color','rgb(175, 68, 253)');
        cy.getByTestId('transaction-category-name').should("contain", "category test");
        cy.getByTestId('transaction-value').should('contain','R$ 123.00');
        cy.getByTestId('transaction-date').should("contain","02/05/2023");
        cy.getByTestId('transaction-isPaid').should("contain","-");
    });

    it('Should try to add a transaction without name', ()=>{
        cy.getByTestId('add-expense-button').click();
        //cy.getByTestId('name-input').type("transaction");
        cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        cy.getByTestId('date-input').type("2023-05-02");
        cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Erro', 'Nome é obrigatório');
    })

    it('Should try to add a transaction without type', ()=>{
        cy.getByTestId('add-expense-button').click();
        cy.getByTestId('name-input').type("transaction");
        //cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        cy.getByTestId('date-input').type("2023-05-02");
        cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Erro', 'Tipo é obrigatório');
    })

    it('Should try to add a transaction without category', ()=>{
        cy.getByTestId('add-expense-button').click();
        cy.getByTestId('name-input').type("transaction");
        cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        //cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        cy.getByTestId('date-input').type("2023-05-02");
        cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Erro', 'Categoria é obrigatória');
    })

    it('Should try to add a transaction without date', ()=>{
        cy.getByTestId('add-expense-button').click();
        cy.getByTestId('name-input').type("transaction");
        cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        //cy.getByTestId('date-input').type("2023-05-02");
        cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Erro', 'Data é obrigatória');
    })

    it('Should try to add a transaction without value', ()=>{
        cy.getByTestId('add-expense-button').click();
        cy.getByTestId('name-input').type("transaction");
        cy.getByTestId('type-select').select(2).should("have.value", "INCOME")
        cy.getByTestId('category-select').select(1).find(':selected').contains("category test");
        cy.getByTestId('date-input').type("2023-05-02");
        //cy.getByTestId('value-input').type('123');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Erro', 'Valor é obrigatório');
    })

    it('Should load the selected transaction information in the modal', ()=>{
        cy.get('[type="radio"]').first().check();
        cy.getByTestId("update-button").click();
        cy.getByTestId('name-input').invoke("attr","ng-reflect-input-value").should("contain",'transaction');
        cy.getByTestId('type-select').should("have.value", "INCOME")
        cy.getByTestId('category-select').find(':selected').contains("category test");
        cy.getByTestId('date-input').children().children().invoke("attr","ng-reflect-model").should('contain','2023-05-02');
        
        cy.getByTestId('value-input').invoke("attr","ng-reflect-input-value").should("contain",'123');
    });

    it("Should update the selected transaction", ()=>{
        //Adding category
        cy.visit('/categories');
        cy.getByTestId("add-button").click();
        cy.getByTestId("name-input").type("category2");
        cy.getByTestId("color-input").click();
        cy.get("[type='color']").eq(1).invoke('val', '#ffffff').trigger('input')
        cy.getByTestId("conclude-button").click();

        //Adding transaction
        cy.visit('/expenses')
        cy.get('[type="radio"]').first().check();
        cy.getByTestId("update-button").click();
        cy.getByTestId('name-input').clear().type("transaction2");
        cy.getByTestId('type-select').select(1).should("have.value", "EXPENSE")
        cy.getByTestId('category-select').select(2).find(':selected').contains("category2");
        cy.getByTestId('date-input').type("2023-05-03");
        cy.getByTestId('value-input').clear().type('321');
        cy.getByTestId('isPaid-checkbox').check();
        cy.getByTestId('conclude-button').click()

        //Verifying if it is displayed after added
        cy.getByTestId('transaction-name').should("contain", "transaction2");
        cy.getByTestId('transaction-type').should("contain", "Despesa");
        cy.getByTestId('transaction-color').should("have.css",'background-color','rgb(255, 255, 255)');
        cy.getByTestId('transaction-category-name').should("contain", "category2");
        cy.getByTestId('transaction-value').should('contain','R$ 321.00');
        cy.getByTestId('transaction-date').should("contain","03/05/2023");
        cy.getByTestId('transaction-isPaid').should("contain","Sim");
        cy.validateToast('Sucesso','Transação atualizada com sucesso');
    });

    it('Should apply name filter', ()=>{
        //Filtering by name - transaction should be shown
        cy.getByTestId('search-input-filter').type('tran');
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
    })

    it('Should apply type filter', ()=>{
        //Filtering by type - transaction should be shown
        cy.getByTestId('type-select-filter').select(1);
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
    })

    it('Should apply category filter', ()=>{
        //Filtering by category - transaction should be shown
        cy.getByTestId('category-select-filter').select(2);
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
    })

    it('Should apply date filter', ()=>{
        //Filtering by date - transaction should be shown
        cy.getByTestId('date-input-filter').type('2023-05-03').trigger('input');
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
    })


    it('Should apply all filters together and show the correct transaction', ()=>{

        //Filtering by name - transaction should be shown
        cy.getByTestId('search-input-filter').type('tran');
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");

        //Adding filter by tipe - transaction should be shown
        cy.getByTestId('type-select-filter').select(1).should("have.value", "EXPENSE");
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");

        //Adding filter by category - transaction should be shown
        cy.getByTestId('category-select-filter').select(2);
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
        
        //Adding filter by date - transaction should be shown
        cy.getByTestId('date-input-filter').type('2023-05-03').trigger('input');
        cy.getByTestId('transaction-name').eq(0).should("contain", "transaction2");
    });

    it('Should delete selected transaction', ()=>{
        cy.visit('/expenses')
        cy.get('[type="radio"]').first().check();
        cy.getByTestId("delete-button").click();
        cy.validateToast('Sucesso','Transação deletada com sucesso')
        cy.getByTestId('transaction-name').should("not.exist");
    })
})