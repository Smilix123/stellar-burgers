/// <reference types="cypress" />

Cypress.Commands.add('mockUser', () => {
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
});

Cypress.Commands.add('mockIngredients', () => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
});

Cypress.Commands.add('mockOrder', () => {
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'orderBurger'
  );
});

Cypress.Commands.add('setToken', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'mockRefreshToken');
  });
  cy.setCookie('accessToken', 'mockAccessToken');
});
