window.onload = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // DOM elements
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.querySelector(".cart-content");

  // Initialize cart display
  displayCart();

  // Event listeners
  clearCartBtn.addEventListener("click", clearCart);
  checkoutBtn.addEventListener("click", proceedToCheckout);

  // Display cart items
  function displayCart() {
    if (cart.length === 0) {
      showEmptyCart();
      return;
    }

    hideEmptyCart();

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="cart-item-description">${item.description}</p>
          <p class="cart-item-price">₹${item.price}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <div class="cart-item-total">
          <p>₹${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });

    updateCartSummary();
    updateTotals();
  }

  // Update quantity of an item
  window.updateQuantity = function (index, change) {
    const newQuantity = cart[index].quantity + change;

    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }

    cart[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger storage event for other tabs/pages
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "cart",
        newValue: JSON.stringify(cart),
      })
    );

    displayCart();
  };

  // Remove item from cart
  window.removeItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger storage event for other tabs/pages
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "cart",
        newValue: JSON.stringify(cart),
      })
    );

    displayCart();
  };

  // Clear entire cart
  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      // Trigger storage event for other tabs/pages
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "cart",
          newValue: JSON.stringify(cart),
        })
      );

      displayCart();
    }
  }

  // Update cart summary
  function updateCartSummary() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartSummary.textContent = `${totalItems} item${
      totalItems !== 1 ? "s" : ""
    } in cart`;
  }

  // Update totals
  function updateTotals() {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;

    // Enable/disable checkout button
    checkoutBtn.disabled = cart.length === 0;
  }

  // Show empty cart message
  function showEmptyCart() {
    emptyCart.style.display = "block";
    cartContent.style.display = "none";
  }

  // Hide empty cart message
  function hideEmptyCart() {
    emptyCart.style.display = "none";
    cartContent.style.display = "flex";
  }

  // Proceed to checkout
  function proceedToCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Here you would typically redirect to a checkout page
    // For now, we'll show a success message and clear the cart
    alert("Thank you for your order! Your items will be processed soon.");

    // Clear cart after successful checkout
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger storage event for other tabs/pages
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "cart",
        newValue: JSON.stringify(cart),
      })
    );

    displayCart();
  }

  // Smooth scrolling for navigation links
  document.addEventListener("click", function (e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const targetId = e.target.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });

  // Dropdown functionality
  document.addEventListener("click", function (e) {
    // Close dropdowns when clicking outside
    if (!e.target.closest(".dropdown")) {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach((dropdown) => {
        dropdown.style.opacity = "0";
        dropdown.style.visibility = "hidden";
        dropdown.style.transform = "translateY(-10px)";
      });
    }
  });

  // Handle dropdown toggle
  document.addEventListener("click", function (e) {
    if (e.target.matches(".dropdown-toggle")) {
      e.preventDefault();
      const dropdown = e.target.closest(".dropdown");
      const dropdownMenu = dropdown.querySelector(".dropdown-menu");

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        if (menu !== dropdownMenu) {
          menu.style.opacity = "0";
          menu.style.visibility = "hidden";
          menu.style.transform = "translateY(-10px)";
        }
      });

      // Toggle current dropdown
      const isVisible = dropdownMenu.style.opacity === "1";
      dropdownMenu.style.opacity = isVisible ? "0" : "1";
      dropdownMenu.style.visibility = isVisible ? "hidden" : "visible";
      dropdownMenu.style.transform = isVisible
        ? "translateY(-10px)"
        : "translateY(0)";
    }
  });

  // Contact form submission
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const subject = this.querySelectorAll('input[type="text"]')[1].value;
      const message = this.querySelector("textarea").value;

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields");
        return;
      }

      // Here you would typically send the form data to your server
      console.log("Contact form submitted:", { name, email, subject, message });

      // Show success message
      alert("Thank you for your message! We will get back to you soon.");

      // Reset form
      this.reset();
    });
  }
};
