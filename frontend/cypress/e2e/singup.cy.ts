/*
        * Cypress was giving a weird result when applying filters, what did not happen
        * when it was tested manually.
        * The framework was displaying multiplied instances of transactions. It stopped
        * when I removed the verification for each collumn of the transactions table.
        * 
        * Sometimes, it is needed to run the test more than once due to some odd errors
        * that I couldn't figure out.
*/


describe('#SIGNUP', () =>{
    beforeEach(()=>{
        cy.visit('/signup');
    });

    it('Should open the SignUp page', ()=>{
        cy.visit('/signup');
        cy.getByTestId("singup-title").should('have.text', 'Crie sua conta!');
        cy.get('[data-testid="name-input"]').should('exist');
        cy.get('[data-testid="email-input"]').should('exist');
        cy.get('[data-testid="password-input"]').should('exist');
        cy.get('[data-testid="confirm-input"]').should('exist');
        cy.get('[data-testid="signup-button"]').should('exist');
    })

    it('Should create a user', () =>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Sucesso', 'Usuário criado com sucesso');
        cy.url().should('eq','http://localhost:4200/')
    });

    it('Should try to create a user with email already in use', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Erro', 'Email já em uso');
        cy.deleteTestUser();
    })

    it('Should try to create a user without attribute "name"', ()=>{
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Erro', 'Nome é obrigatório');
        
    })

    it('Should try to create a user without attribute "email"', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Erro','Email é obrigatório');
    })

    it('Should try to create a user without attribute "password"', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Erro', 'As senhas não batem');
    })

    it('Should try to create a user without matching passwords', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('12');
        cy.get('[data-testid="signup-button"]').click();
        cy.validateToast('Erro', 'As senhas não batem')
    })

    
})
