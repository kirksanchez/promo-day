import { products, promotions, promoCodes } from '../data/data.js';

// Calculate the total cost of the cart
export function calculateTotal(cart, promoCode) {
  let total = 0;
  let promoMessage = '';

  // Apply product-specific promotions
  let promoResults = applyProductPromo(cart);
  cart = promoResults.cart;
  promoMessage += promoResults.promoMessage;

  // Calculate total price after applying promotions and promo codes
  cart.forEach((item) => {
    // If totalPrice is set by promotion, use it; otherwise, use the item price times quantity
    total +=
      item.totalPrice ??
      (item.discountedPrice ?? products[item.productId].price) * item.quantity;
  });

  // Apply promo codes
  if (promoCode && promoCodes[promoCode]) {
    const promoResult = promoCodes[promoCode].effect(cart, total);
    cart = promoResult.cart; // Update cart based on the promo code effect
    total = promoResult.total; // Update total based on the promo code effect
    promoMessage += promoResult.message; // Get message from the promo code effect
  }

  return { total, promoMessage };
}

// Apply product-specific promotions
function applyProductPromo(cart) {
  let promoMessage = '';
  let result = applyBuy3Get1Promo(cart);
  cart = result.cart;
  promoMessage += result.promoMessage;

  result = apply30OffPromo(cart);
  cart = result.cart;
  promoMessage += result.promoMessage;

  result = applyFullYear10OffPromo(cart);
  cart = result.cart;
  promoMessage += result.promoMessage;

  result = applyHalfYear10OffPromo(cart);
  cart = result.cart;
  promoMessage += result.promoMessage;

  return { cart, promoMessage };
}

function applyBuy3Get1Promo(cart) {
  let promoMessage = '';
  const promo = promotions.BUY3GET1;
  // Find the total quantity of the eligible product
  const totalQuantity = cart.reduce((acc, item) => {
    return item.productId === promo.eligibleProduct ? acc + item.quantity : acc;
  }, 0);

  // Calculate the number of free tickets
  const freeTickets = Math.floor(totalQuantity / (promo.requiredQuantity + 1));
  if (freeTickets > 0) {
    cart.push({
      productId: promo.eligibleProduct,
      quantity: freeTickets,
      discountedPrice: 0,
    });
    promoMessage += `Promo applied: ${freeTickets} free One-way ticket(s). `;
  }

  return { cart, promoMessage };
}

function apply30OffPromo(cart) {
  let promoMessage = '';
  const promo = promotions['30OFF'];
  cart.forEach((item) => {
    if (item.productId === promo.eligibleProduct) {
      // Calculate how many tickets get the discount
      const discountedTickets = Math.min(item.quantity, promo.maxDiscounts);
      // Calculate how many tickets are full price
      const fullPriceTickets = item.quantity - discountedTickets;

      // Calculate total for discounted tickets
      const discountedTotal =
        discountedTickets *
        products[item.productId].price *
        (1 - promo.discountRate);
      // Calculate total for full price tickets
      const fullPriceTotal = fullPriceTickets * products[item.productId].price;

      // Update the total price for this item
      item.totalPrice = discountedTotal + fullPriceTotal;

      promoMessage +=
        discountedTickets > 0
          ? `Promo applied: 30% off for ${discountedTickets} Round trip ticket(s). `
          : '';
    }
  });

  return { cart, promoMessage };
}

function applyFullYear10OffPromo(cart) {
  let promoMessage = '';
  const promo = promotions.FULLYEAR10OFF;
  cart.forEach((item) => {
    if (item.productId === promo.eligibleProduct) {
      item.discountedPrice =
        products[item.productId].price * (1 - promo.discountRate);
      promoMessage +=
        'Promo applied: 10% off Full year unli Travel subscription. ';
    }
  });

  return { cart, promoMessage };
}

function applyHalfYear10OffPromo(cart) {
  let promoMessage = '';
  const promo = promotions.HALFYEAR10OFF;
  const halfYearSubscriptions = cart.filter(
    (item) => item.productId === promo.eligibleProduct
  );

  if (
    halfYearSubscriptions.length &&
    halfYearSubscriptions.reduce((acc, item) => acc + item.quantity, 0) >=
      promo.requiredQuantity
  ) {
    halfYearSubscriptions.forEach((subscription) => {
      subscription.discountedPrice =
        products[subscription.productId].price * (1 - promo.discountRate);
    });
    promoMessage +=
      'Promo applied: 10% off Half year unli Travel subscription. ';
  }

  return { cart, promoMessage };
}
