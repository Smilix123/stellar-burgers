/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    mockUser(): Chainable<void>;
    mockIngredients(): Chainable<void>;
    mockOrder(): Chainable<void>;
    setToken(): Chainable<void>;
  }
}
