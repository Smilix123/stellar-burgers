/// <reference types="../support/index.d.ts" />

import * as constants from '../support/constants';

beforeEach(() => {
  cy.mockIngredients();
  cy.visit('/');
  cy.wait('@getIngredients');
});

afterEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

describe('Работа модального окна', () => {
  it('Открытие модального окна', () => {
    constants.getBun().click();
    constants.getModal().should('be.visible').should('contain.text', 'Булка 1');
  });

  it('Закрытие модального окна на крестик', () => {
    constants.getBun().click();
    constants.getModal().within(() => {
      cy.get('[data-testid="modal-close"]').click();
    });

    constants.getModal().should('not.exist');
  });

  it('Закрытие модального окна при клике на оверлей', () => {
    constants.getBun().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    constants.getModal().should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.mockUser();
    cy.setToken();
    cy.mockOrder();
    cy.reload();
    cy.wait('@getUser');
  });

  it('Открытие модального окна', () => {
    constants.getBun().find('button').click();
    constants.getConstructor().within(() => {
      cy.get('[data-testid="constructor-orderButton"]').click();
    });

    cy.wait('@orderBurger');

    constants.getModal().should('be.visible').should('contain.text', '123');
  });

  it('Закрытие модального окна и очистка конструктора', () => {
    constants.getBun().find('button').click();
    cy.get('[data-testid="sauce1"]').find('button').click();

    constants.getConstructor().within(() => {
      cy.get('[data-testid="constructor-orderButton"]').click();
    });

    cy.wait('@orderBurger');
    constants.getModal().within(() => {
      cy.get('[data-testid="modal-close"]').click();
    });

    constants.getModal().should('not.exist');

    constants.getConstructor().within(() => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});

describe('Добавление ингредиентов в конструктор', () => {
  it('Добавление начинки в конструктор', () => {
    cy.get('[data-testid="main1"]').find('button').click();

    constants.getConstructor().within(() => {
      cy.get('[data-testid="constructor-main1"]').should('exist');
    });
  });

  it('Добавление соуса в конструктор', () => {
    cy.get('[data-testid="sauce1"]').find('button').click();

    constants.getConstructor().within(() => {
      cy.get('[data-testid="constructor-sauce1"]').should('exist');
    });
  });

  it('Добавление булки в конструктор', () => {
    constants.getBun().find('button').click();

    constants.getConstructor().within(() => {
      cy.contains('Булка 1 (верх)').should('exist');
      cy.contains('Булка 1 (низ)').should('exist');
    });
  });
});
