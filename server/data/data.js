// Products and their prices
export const products = {
  1: { name: 'One-way ticket', price: 5000 },
  2: { name: 'Round trip ticket', price: 10000 },
  3: { name: 'Half year unli Travel subscription', price: 50000 },
  4: { name: 'Full year unli Travel subscription', price: 100000 },
};

// Promotions
export const promotions = {
  BUY3GET1: {
    eligibleProduct: 1,
    requiredQuantity: 2,
    freeQuantity: 1,
  },
  '30OFF': {
    eligibleProduct: 2,
    discountRate: 0.3,
    maxDiscounts: 5,
  },
  FULLYEAR10OFF: {
    eligibleProduct: 4,
    discountRate: 0.1,
  },
  HALFYEAR10OFF: {
    eligibleProduct: 3,
    discountRate: 0.1,
    requiredQuantity: 2,
  },
};

export const promoCodes = {
  FREETWOWAY: {
    description: 'Adds a message for a free round trip ticket',
    effect: (cart, total) => {
      // Since we only want to show a message and not actually add a ticket,
      // we don't modify the cart or the total, just return the message.
      let message = 'One free round trip ticket added.';
      return { cart, total, message }; // Return the original cart and total, with the added message
    },
  },
  '5OFF': {
    description: '5% discount on total amount',
    effect: (cart, total) => {
      const discount = total * 0.05; // Calculate 5% of the total
      const newTotal = total - discount; // Apply the discount
      let message = `5% discount applied. New total is PHP ${newTotal.toFixed(
        2
      )}.`;
      // We return the new total which is the total after the discount
      return { cart, total: newTotal, message }; // Return the cart, new total, and the message
    },
  },
};
