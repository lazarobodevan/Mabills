describe('#LOGIN', ()=>{

    before(()=>{
        cy.createTestUser();
    })
    after(()=>{
        cy.deleteTestUser();
    })

    beforeEach(() =>{
        cy.visit('http://localhost:4200/')
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
        cy.validateToast('Erro', 'Email ou senha incorretos')
    })
    it('Should try to login with invalid email, and get a toast message', ()=>{
        cy.get('[data-testid="email-input"]').type('testgmail.com');
        cy.get('[data-testid="password-input"]').type('12');
        cy.get('[data-testid="login-button"]').click();
        cy.validateToast('Erro', 'Email deve ser válido')
    })
    it('Should try to login without email, and get a toast message', ()=>{
        cy.get('[data-testid="password-input"]').type('12');
        cy.get('[data-testid="login-button"]').click();
        cy.validateToast('Erro', 'Email é obrigatório')
    })
    it('Should try to login without password, and get a toast message', ()=>{
        cy.get('[data-testid="email-input"]').type('test@gmail.com');
        cy.get('[data-testid="login-button"]').click();
        cy.validateToast('Erro', 'Senha é obrigatória')
    })
    
    it('Should login successfully', ()=>{
        cy.login();
    })

})