window.onload = () => {
  let allProducts = document.getElementById("allProducts");
  let products = []; // Store all products for filtering

  // Fetch products from server
  fetch("http://localhost:3000/products")
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

      // Append all elements to product card
      child.append(img, name, price, prodDesc);

      // Append product card to container
      allProducts.append(child);
    });
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
};
