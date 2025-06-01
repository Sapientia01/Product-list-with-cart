export const cart = [];

export function checkMatching(itemId) {
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == itemId) {
      found = true;
    }
  }
  return found;
}

export function addToCart(itemId, change) {
  let matchItem;
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == itemId) {
      matchItem = i;
      found = true;
    }
  }

  if (found) {
    if (change) {
      cart[matchItem].quantity++;
    } else {
      cart[matchItem].quantity--;
      if (cart[matchItem].quantity == 0) {
        removeFromCart(itemId);
      }
    }
  } else {
    const newItem = {
      id: itemId,
      quantity: 1,
    };

    cart.push(newItem);
  }
}

export function removeFromCart(itemId) {
  let matchItem;
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == itemId) {
      matchItem = i;
      found = true;
    }
  }
  if (found) {
    cart.splice(matchItem, 1);
  }
}
