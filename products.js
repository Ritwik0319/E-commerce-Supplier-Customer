window.onload = () => {
  let allProducts = document.getElementById("allProducts");
  let products = []; // Store all products for filtering

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Log initial cart state
  console.log("Initial cart loaded:", cart);
  console.log("Initial cart length:", cart.length);

  // Function to sync cart count from localStorage
  function syncCartCount() {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = storedCart;
    updateCartCount();
    console.log("Cart synced from localStorage:", cart);
  }

  // Function to force refresh cart from localStorage
  window.refreshCartFromStorage = function () {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = storedCart;
    updateCartCount();
    console.log("Cart refreshed from localStorage:", cart);
  };

  // Function to ensure cart count is visible
  function ensureCartCountVisible() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount && cartCount.textContent === "0" && cart.length > 0) {
      updateCartCount();
    }
  }

  // Initial cart count update - wait for DOM to be ready
  setTimeout(() => {
    updateCartCount();
  }, 100);

  // Listen for storage changes (when cart is updated from other tabs/pages)
  window.addEventListener("storage", function (e) {
    if (e.key === "cart") {
      syncCartCount();
    }
  });

  // Also update cart count when page becomes visible (when returning from cart page)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      syncCartCount();
    }
  });

  // Update cart count when page gains focus
  window.addEventListener("focus", function () {
    syncCartCount();
  });

  // Periodic cart count sync (every 2 seconds) to ensure consistency
  setInterval(() => {
    ensureCartCountVisible();
  }, 2000);

  // Fetch products from server
  fetch("https://ecommerce-json-server-a127.onrender.com/products")
    .then((res) => res.json())
    .then((fetchedProducts) => {
      console.log(fetchedProducts);
      products = fetchedProducts; // Store products for filtering

      if (products.length == 0) {
        allProducts.innerHTML =
          "<p style='text-align: center; color: white; font-size: 1.2rem;'>No products available</p>";
        return;
      }

      displayProducts(products);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      allProducts.innerHTML =
        "<p style='text-align: center; color: white; font-size: 1.2rem;'>Failed to load products.</p>";
    });

  // Function to display products
  function displayProducts(productsToShow) {
    allProducts.innerHTML = ""; // Clear existing products

    productsToShow.forEach((prod) => {
      // Create product container
      const child = document.createElement("div");
      child.className = "product-card";

      // Create and set image
      const img = document.createElement("img");
      console.log(prod.img);

      img.src = prod.img;
      img.alt = prod.name;

      // Create and set product name
      const name = document.createElement("h3");
      name.textContent = prod.name;
      name.className = "product-name";

      // Create and set product price
      const price = document.createElement("p");
      price.textContent = `₹${prod.price}`;
      price.className = "product-price";

      // Create and set product description
      const prodDesc = document.createElement("p");
      prodDesc.textContent = prod.description;
      prodDesc.className = "product-description";

      // Create Add to Cart button
      const addToCartBtn = document.createElement("button");
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.className = "add-to-cart-btn";
      addToCartBtn.onclick = () => addToCart(prod);

      // Append all elements to product card
      child.append(img, name, price, prodDesc, addToCartBtn);

      // Append product card to container
      allProducts.append(child);
    });

    // Ensure cart count is properly displayed after products are loaded
    ensureCartCountVisible();
  }

  // Category filtering functionality
  document.addEventListener("click", function (e) {
    if (e.target.matches("[data-category]")) {
      e.preventDefault();
      const category = e.target.getAttribute("data-category");

      if (category === "all") {
        displayProducts(products);
      } else {
        // Filter products by category (you'll need to add category field to your products)
        const filteredProducts = products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        );
        displayProducts(filteredProducts);
      }
    }
  });

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

  // Cart functions
  function addToCart(product) {
    console.log("Adding product to cart:", product);

    // Create a unique identifier for the product
    // Use combination of name and price if id is not available
    const productKey = product.id || `${product.name}-${product.price}`;

    // Check if this exact product already exists
    const existingItem = cart.find((item) => {
      const itemKey = item.id || `${item.name}-${item.price}`;
      return itemKey === productKey;
    });

    if (existingItem) {
      console.log("Product already exists, increasing quantity");
      existingItem.quantity += 1;
    } else {
      console.log("Adding new product to cart");
      cart.push({
        ...product,
        quantity: 1,
        // Ensure we have a unique identifier
        uniqueId: productKey,
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count immediately
    updateCartCount();

    // Show success message
    showNotification(`${product.name} added to cart!`);

    // Log for debugging
    console.log("Cart updated:", cart);
    console.log("Cart items count:", cart.length);
    console.log(
      "Total quantity:",
      cart.reduce((total, item) => total + item.quantity, 0)
    );

    // Also log the localStorage to verify
    console.log("localStorage cart:", localStorage.getItem("cart"));
  }

  function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
      console.log("Cart count updated to:", totalItems);
    } else {
      console.error("Cart count element not found");
    }
  }

  function showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Debug functions
  window.debugCart = function () {
    console.log("=== CART DEBUG INFO ===");
    console.log("Current cart array:", cart);
    console.log("Cart length:", cart.length);
    console.log("localStorage cart:", localStorage.getItem("cart"));
    console.log(
      "Parsed localStorage:",
      JSON.parse(localStorage.getItem("cart") || "[]")
    );
    console.log("Cart count element:", document.getElementById("cartCount"));
    console.log(
      "Cart count text:",
      document.getElementById("cartCount")?.textContent
    );
    console.log("=======================");

    // Show alert with cart info
    const cartInfo = `Cart Items: ${cart.length}\nTotal Quantity: ${cart.reduce(
      (total, item) => total + item.quantity,
      0
    )}\nItems: ${cart
      .map((item) => `${item.name} (${item.quantity})`)
      .join(", ")}`;
    alert(cartInfo);
  };

  window.clearCart = function () {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      showNotification("Cart cleared!");
      console.log("Cart cleared");
    }
  };
};
