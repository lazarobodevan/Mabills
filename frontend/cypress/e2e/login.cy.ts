describe('#LOGIN', ()=>{

    beforeEach(() =>{
        cy.visit('/')
    })
    
    it('Should open the Login page', () => {
        cy.visit('/');    
    })

    it('Should open SignUp page', () =>{
        cy.get('[data-testid="singup-button"]').click();
        cy.get('[data-testid="singup-title"]').should('have.text', 'Crie sua conta!')
    })

    it('Should try to login with invalid credentials, and get a toast message', ()=>{
        cy.get('[data-testid="email-input"]').type('test@test.com');
        cy.get('[data-testid="password-input"]').type('12');
        cy.get('[data-testid="login-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Incorrect email or password');
    })
    it('Should login successfully', ()=>{
        cy.get('[data-testid="email-input"]').type('test@test.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="login-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Sucesso');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Login realizado');
    })

})