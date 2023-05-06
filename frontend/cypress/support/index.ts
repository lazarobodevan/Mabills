/// <reference types="cypress" />
/// <reference types="cypress-real-events" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      getByTestId(value: string): Chainable<Element>;
      login(): Chainable<Element>;
      createTestUser(): Chainable<Element>;
      deleteTestUser(): Chainable<Element>;
      validateToast(title:string, message:string): Chainable<Element>;
    }
  }