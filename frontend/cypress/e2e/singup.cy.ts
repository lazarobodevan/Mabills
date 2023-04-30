describe('#SIGNUP', () =>{
    beforeEach(()=>{
        cy.visit('/signup');
    })

    it('Should open the SignUp page', ()=>{
        cy.visit('/signup');
        cy.get('[data-testid="singup-title"]').should('have.text', 'Crie sua conta!');
        cy.get('[data-testid="name-input"]').should('exist');
        cy.get('[data-testid="email-input"]').should('exist');
        cy.get('[data-testid="password-input"]').should('exist');
        cy.get('[data-testid="confirm-input"]').should('exist');
        cy.get('[data-testid="signup-button"]').should('exist');
    })

    it('Should try to create a user with email already in use', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@test.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','User already exists');
    })

    it('Should try to create a user without attribute "name"', ()=>{
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','"name" is required');
        
    })
    it('Should try to create a user without attribute "email"', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','"email" is required');
    })
    it('Should try to create a user without attribute "password"', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="confirm-input"]').type('123');
        cy.get('[data-testid="signup-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).eq(1).invoke('attr', 'aria-label').should('eq','passwords should match');
        cy.get('div.toast-message', {timeout:3000}).eq(0).invoke('attr', 'aria-label').should('eq','"password" is required');
    })
    it('Should try to create a user without matching passwords', ()=>{
        cy.get('[data-testid="name-input"]').type('Test');
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="confirm-input"]').type('12');
        cy.get('[data-testid="signup-button"]').click();
        cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq','Erro');
        cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq','passwords should match');
    })
})

const deleteTestUser = () =>{
    cy.request('POST','http://localhost:8080/signin',{email: 'test@gmail.com', password:'123'}).then((response:any)=>{
        cy.request('DELETE', 'http://localhost:8080/user/'+response.user._id);
    })
}