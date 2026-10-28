
"use strict";

/* MENU DATA */
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

/* APPLICATION STATE */
const cart = new Map();
let activeCategory = "All";

/* HTML ELEMENTS */
const menuGrid = document.getElementById("menu-grid");
const searchInput = document.getElementById("search-input");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartNotice = document.getElementById("cart-notice");
const filters = document.querySelector(".filters");

/* RENDER MENU */
function renderMenu() {
  if (!menuGrid || !searchInput) {
    console.error("Menu elements are missing from index.html.");
    return;
  }

  const search = searchInput.value.trim().toLowerCase();

  const filtered = menu.filter(item => {
    const matchesCategory =
      activeCategory === "All" ||
      item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

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
        <button
          class="add-button"
          data-add="${item.id}"
          type="button"
        >+ Add</button>
      </div>
    </article>
  `).join("");
}

/* ADD ITEM TO CART */
function addToCart(id) {
  const item = menu.find(product => product.id === id);
  if (!item) return;

  const existing = cart.get(id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.set(id, { ...item, quantity: 1 });
  }

  if (cartNotice) {
    cartNotice.textContent = `${item.name} added to your cart.`;
  }

  renderCart();
}

/* CHANGE QUANTITY */
function changeQuantity(id, amount) {
  const item = cart.get(id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.delete(id);
  }

  if (cartNotice) {
    cartNotice.textContent = "";
  }

  renderCart();
}

/* RENDER CART */
function renderCart() {
  const entries = Array.from(cart.values());

  const count = entries.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = entries.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const countElement = document.getElementById("cart-count");
  const totalElement = document.getElementById("cart-total");

  if (countElement) {
    countElement.textContent = count;
  }

  if (totalElement) {
    totalElement.textContent = `₹${total}`;
  }

  if (!cartItems) return;

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
          type="button"
        >−</button>
        <span>${item.quantity}</span>
        <button
          data-plus="${item.id}"
          aria-label="Add one ${item.name}"
          type="button"
        >+</button>
      </div>
    </div>
  `).join("");
}

/* MENU BUTTON EVENTS */
if (menuGrid) {
  menuGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) {
      addToCart(Number(button.dataset.add));
    }
  });
}

/* CART QUANTITY EVENTS */
if (cartItems) {
  cartItems.addEventListener("click", event => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");

    if (plus) {
      changeQuantity(Number(plus.dataset.plus), 1);
    }

    if (minus) {
      changeQuantity(Number(minus.dataset.minus), -1);
    }
  });
}

/* SEARCH */
if (searchInput) {
  searchInput.addEventListener("input", renderMenu);
}

/* CATEGORY FILTERS */
if (filters) {
  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-button").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    renderMenu();
  });
}

/* OPEN CART */
const openCartButton = document.getElementById("open-cart");

if (openCartButton && cartDialog) {
  openCartButton.addEventListener("click", () => {
    renderCart();
    cartDialog.showModal();
  });
}

/* CLOSE CART */
const closeCartButton = document.getElementById("close-cart");

if (closeCartButton && cartDialog) {
  closeCartButton.addEventListener("click", () => {
    cartDialog.close();
  });
}

/* CLEAR CART */
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cart.clear();

    if (cartNotice) {
      cartNotice.textContent = "Cart cleared.";
    }

    renderCart();
  });
}

/* DEMO CHECKOUT */
const checkoutButton = document.getElementById("checkout-button");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.size === 0) {
      if (cartNotice) {
        cartNotice.textContent =
          "Your cart is empty. Add an item first.";
      }
      return;
    }

    cart.clear();

    if (cartNotice) {
      cartNotice.textContent =
        "Demo order complete! No payment was taken.";
    }

    renderCart();
  });
}

/* FOOTER YEAR */
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* INITIALIZE APPLICATION */
renderMenu();
renderCart();
