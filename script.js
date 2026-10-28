```javascript
"use strict";

const menu = [
  {
    id: 1,
    name: "Espresso",
    category: "Coffee",
    price: 80,
    emoji: "☕",
    description: "A bold, rich shot of freshly brewed coffee."
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "Coffee",
    price: 120,
    emoji: "☕",
    description: "Espresso topped with silky milk foam."
  },
  {
    id: 3,
    name: "Cafe Latte",
    category: "Coffee",
    price: 140,
    emoji: "🥛",
    description: "Smooth espresso blended with creamy milk."
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Coffee",
    price: 150,
    emoji: "🧋",
    description: "Chilled, creamy coffee for a refreshing break."
  },
  {
    id: 5,
    name: "Black Coffee",
    category: "Coffee",
    price: 90,
    emoji: "🖤",
    description: "Black coffee with warming spices."
  },
  {
    id: 6,
    name: "Masala Chai",
    category: "Tea",
    price: 40,
    emoji: "🍵",
    description: "Classic Indian tea with aromatic spices."
  },
  {
    id: 7,
    name: "Green Tea",
    category: "Tea",
    price: 60,
    emoji: "🍃",
    description: "A light, soothing cup of green tea."
  },
  {
    id: 8,
    name: "Hot Chocolate",
    category: "Coffee",
    price: 130,
    emoji: "🍫",
    description: "Rich chocolate goodness in every sip."
  },
  {
    id: 9,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 100,
    emoji: "🍫",
    description: "A soft, fudgy chocolate brownie."
  },
  {
    id: 10,
    name: "Blueberry Muffin",
    category: "Desserts",
    price: 90,
    emoji: "🧁",
    description: "A soft muffin with sweet blueberry bites."
  },
  {
    id: 11,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 140,
    emoji: "🍰",
    description: "A delicious slice of chocolate cake."
  },
  {
    id: 12,
    name: "Butter Croissant",
    category: "Desserts",
    price: 110,
    emoji: "🥐",
    description: "A flaky, golden, buttery pastry."
  }
];

const cart = new Map();
let activeCategory = "All";

const menuGrid = document.getElementById("menu-grid");
const searchInput = document.getElementById("search-input");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartNotice = document.getElementById("cart-notice");

function renderMenu() {
  const search = searchInput.value.trim().toLowerCase();

  const filtered = menu.filter(item => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML =
      '<p class="empty-message">No items found. Try another search.</p>';
    return;
  }

  menuGrid.innerHTML = filtered.map(item => `
    <article class="menu-card">
      <div class="menu-emoji" aria-hidden="true">${item.emoji}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-bottom">
        <span class="price">₹${item.price}</span>
        <button class="add-button" data-add="${item.id}" type="button">
          + Add
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const item = menu.find(product => product.id === id);
  if (!item) return;

  const existing = cart.get(id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.set(id, { ...item, quantity: 1 });
  }

  cartNotice.textContent = `${item.name} added to your cart.`;
  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.get(id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.delete(id);
  }

  cartNotice.textContent = "";
  renderCart();
}

function renderCart() {
  const entries = Array.from(cart.values());

  const count = entries.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = entries.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = `₹${total}`;

  if (entries.length === 0) {
    cartItems.innerHTML =
      "<p>Your cart is empty. Add something tasty!</p>";
    return;
  }

  cartItems.innerHTML = entries.map(item => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong>
        <div>₹${item.price} × ${item.quantity}</div>
      </div>
      <div class="quantity-controls">
        <button
          data-minus="${item.id}"
          aria-label="Remove one ${item.name}"
          type="button">−</button>
        <span>${item.quantity}</span>
        <button
          data-plus="${item.id}"
          aria-label="Add one ${item.name}"
          type="button">+</button>
      </div>
    </div>
  `).join("");
}

menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

searchInput.addEventListener("input", renderMenu);

document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter-button").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderMenu();
});

document.getElementById("open-cart").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

document.getElementById("close-cart").addEventListener("click", () => {
  cartDialog.close();
});

document.getElementById("clear-cart").addEventListener("click", () => {
  cart.clear();
  cartNotice.textContent = "Cart cleared.";
  renderCart();
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.size === 0) {
    cartNotice.textContent = "Your cart is empty. Add an item first.";
    return;
  }

  cart.clear();
  cartNotice.textContent =
    "Demo order complete! No payment was taken.";
  renderCart();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderMenu();
renderCart();
```
