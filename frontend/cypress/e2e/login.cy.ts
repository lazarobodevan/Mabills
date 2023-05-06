describe('#LOGIN', ()=>{

    before(()=>{
        cy.createTestUser();
    })
    after(()=>{
        cy.deleteTestUser();
    })

    beforeEach(() =>{
        cy.visit('/')
    })
    
    it('Should open the Login page', () => {
        //cy.visit('/');    
        cy.get('[data-testid="email-input"]').should('exist');
        cy.get('[data-testid="password-input"]').should('exist');
    })

    it('Should open SignUp page', () =>{
        cy.get('[data-testid="singup-button"]').click();
        cy.get('[data-testid="singup-title"]').should('have.text', 'Crie sua conta!')
    })

    it('Should try to login with invalid credentials, and get a toast message', ()=>{
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="password-input"]').type('12');
        cy.get('[data-testid="login-button"]').click();
        cy.validateToast('Erro', 'Incorrect email or password')
    })
    
    it('Should login successfully', ()=>{
        cy.login();
    })

})