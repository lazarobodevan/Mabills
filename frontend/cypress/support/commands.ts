// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getByTestId", (testId)=>{
    cy.get(`[data-testid = ${testId}]`);
})

Cypress.Commands.add("validateToast", (title, message)=>{
    cy.get('div.toast-title', {timeout:3000}).invoke('attr', 'aria-label').should('eq',title);
    cy.get('div.toast-message', {timeout:3000}).invoke('attr', 'aria-label').should('eq',message);
})


//----------INTEGRATION----------

Cypress.Commands.add("login", ()=>{
    cy.visit('/');
    cy.get('[data-testid="email-input"]').type('test@gmail.com');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-button"]').click();
    cy.validateToast('Sucesso', 'Login realizado');
    cy.wait(700)
})

Cypress.Commands.add("createTestUser", () =>{
    cy.request("POST", 'http://localhost:8080/signup', {
        name: "test",
        email:"test@gmail.com",
        password: "123"
    }).then(()=>{
        cy.wait(70)
    });
})

Cypress.Commands.add("deleteTestUser", () =>{
    
    cy.request('POST','http://localhost:8080/signin',{email: 'test@gmail.com', password:'123'}).then((response:any)=>{
        if(response.body && response.body.user)
            cy.request({
                method:'DELETE',
                url: 'http://localhost:8080/user/'+response.body.user.id,
                headers:{
                    authorization: 'bearer '+ response.body.token
                }
            }).then(response =>{
                console.log(response)
            })
    });
    
})
