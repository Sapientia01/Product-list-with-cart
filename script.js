import { cart, addToCart, checkMatching, removeFromCart } from "/cart.js";

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.querySelector(".products-grid");

  fetch("data.json")
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.querySelector(".products-grid");
      let productsHTML = ``;
      let screenSize = document.body.offsetWidth;
      products.forEach((item) => {
        const itemName = item.name;
        const itemCategory = item.category;
        const itemPrice = item.price;
        const itemId = item.id;
        let itemImage = item.image.desktop;
        if (screenSize <= 900 && screenSize >= 550) {
          itemImage = item.image.tablet;
        } else if (screenSize < 550) {
          itemImage = item.image.mobile;
        }

        productsHTML += `
        <div class="product-item">
          <img
            class="product-icon"
            src="${itemImage}"
            alt="${itemName}"
          />
          <button class="addCart"  data-id="${itemId}">
            <div class="add ">
                <img src="assets/images/icon-add-to-cart.svg" alt="Add" />
                <h3>Add to Cart</h3>
            </div> 
            <div class="change-quantity">
                <img class="decrease" src="assets/images/icon-decrement-quantity.svg" alt="-" data-id= "${itemId}">
                <span class="quantity">1</span>
                <img  class="increase"  src="assets/images/icon-increment-quantity.svg" alt="+"data-id= "${itemId}">
            </div>
          </button>
          <div class="description">
            <h3 class="category">${itemCategory}</h3>
            <h2 class="name">${itemName}</h2>
            <p class="cost">$ ${(itemPrice / 100).toFixed(2)}</p>
          </div>
        </div>
        `;
      });
      productContainer.innerHTML = productsHTML;

      const totalOrder = document.querySelector(".cart");
      const cartContent = totalOrder.querySelector(".non-empty-cart");
      const emptyCart = totalOrder.querySelector(".empty-cart");

      const orders = document.querySelector(".cart-content");
      const addToCartBtns = document.querySelectorAll(".addCart");

      function addToCartContent(container, itemId) {
        const newItem = document.createElement("div");
        newItem.classList.add("cart-items");
        newItem.setAttribute("data-id", `${itemId}`);
        newItem.innerHTML = `
                    <div class="details">
                      <h3>${products[itemId].name}</h3>
                      <div class="price-quantity">
                        <p class="item-quantity">1x</p> <p class="single-item-price">$ ${(
                          products[itemId].price / 100
                        ).toFixed(2)}</p>
                        <p class="total-item-price">$ ${(
                          products[itemId].price / 100
                        ).toFixed(2)}</p>
                      </div>
                    </div>
                    <img class="delete" src="assets/images/icon-remove-item.svg" alt="remove-item"data-id="${itemId}" />
                  `;
        container.appendChild(newItem);
        changeAddButton(itemId, true);
        newItem.querySelector(".delete").addEventListener("click", () => {
          removeFromCart(itemId);
          removeFromCartContent(itemId);
          updateTotalOrders();
          changeAddButton(itemId, false);
          // console.log(cart);
        });
      }
      function removeFromCartContent(itemId) {
        orders.querySelectorAll(".cart-items").forEach((item) => {
          if (item.dataset.id == itemId) {
            orders.removeChild(item);
          }
        });
      }
      function changeQuantity(itemId, change) {
        const orderItems = document.querySelectorAll(".cart-items");
        let quantity = 0;
        orderItems.forEach((item) => {
          if (item.dataset.id == itemId) {
            cart.forEach((cartItem) => {
              if (cartItem.id == itemId) {
                quantity = cartItem.quantity;
                // console.log(quantity);
              }
            });
            item.querySelector(".item-quantity").textContent = `${quantity}x`;
            item.querySelector(".total-item-price").textContent = `$${(
              (products[itemId].price * quantity) /
              100
            ).toFixed(2)}`;
          }
        });
      }
      function changeAddButton(itemId, show) {
        if (show) {
          addToCartBtns.forEach((addBtn) => {
            if (addBtn.dataset.id == itemId) {
              addBtn.querySelector(".add").classList.add("closed");
              const add = addBtn.querySelector(".change-quantity");
              add.classList.add("active");
            }
            console.log(true);
          });
        } else {
          addToCartBtns.forEach((addBtn) => {
            if (addBtn.dataset.id == itemId) {
              addBtn.querySelector(".add").classList.remove("closed");
              addBtn
                .querySelector(".change-quantity")
                .classList.remove("active");
            }
            console.log(false);
          });
        }
      }
      function updateTotalOrders() {
        const totalQuantity = totalOrder.querySelector(".cart-count");
        const totalOrderPrice = totalOrder.querySelector(".total-price");
        let totalItems = 0;
        let totalPrice = 0;
        cart.forEach((item) => {
          totalItems += item.quantity;
          totalPrice += products[item.id].price * item.quantity;
        });
        totalQuantity.textContent = totalItems;
        totalOrderPrice.textContent = `$${(totalPrice / 100).toFixed(2)}`;
        if (totalItems == 0) {
          emptyCart.classList.remove("close");
          cartContent.classList.remove("active");
        } else {
          emptyCart.classList.add("close");
          cartContent.classList.add("active");
        }
      }

      addToCartBtns.forEach((addBtn) => {
        addBtn.addEventListener("click", () => {
          const itemId = addBtn.dataset.id;

          let found = false;
          for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == itemId) {
              found = true;
            }
          }
          if (!found) {
            addToCartContent(orders, itemId);
            addToCart(itemId);
          }
          updateTotalOrders();
        });
      });
    })
    .catch((error) => console.error("Error loading products:", error));
});
