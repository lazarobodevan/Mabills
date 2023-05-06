describe("#CATEGORIES", ()=>{
    
    before(()=>{
        cy.createTestUser();
    })

    after(()=>{
        cy.deleteTestUser();
    })

    beforeEach(()=>{
        cy.login();
        cy.visit('/categories');
    })


    it('Should add a category', ()=>{
        cy.getByTestId("add-button").click();
        cy.getByTestId("name-input").type("category test");
        cy.getByTestId("color-input").click();
        cy.get("[type='color']").eq(1).invoke('val', '#FFFFFF').trigger('input')
        cy.getByTestId("conclude-button").click();

        cy.getByTestId('category-item').children().get('.container').children().getByTestId('category-name').should('contain','category test');
        cy.getByTestId('category-item').children().get('.container').children().getByTestId('category-color').should("have.css",'background-color','rgb(255, 255, 255)');
        cy.getByTestId('category-item').children().getByTestId('delete-button').should('exist');
    })

    it('Should edit a category', ()=>{
        cy.getByTestId('category-item').click();
        cy.getByTestId('name-input').type('2');
        cy.get("[type='color']").eq(1).invoke('val', '#000000').trigger('input');
        cy.getByTestId('conclude-button').click();
        cy.validateToast('Sucesso', 'Categoria atualizada com sucesso');
    })
})