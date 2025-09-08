// Get references to DOM elements
let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productImg = document.getElementById("productImg");
let productDesc = document.getElementById("productDesc");
let productCategory = document.getElementById("productCategory");
let productsContainer = document.getElementById("productsContainer");
let addProductBtn = document.getElementById("addProductBtn");
let logoutbtn = document.getElementsByClassName("logoutbtn")[0];

// Add edit form elements
let editForm = null;
let editProductId = null;

logoutbtn.onclick = () => {
  let isConfirm = confirm("Loging Out, Are you sure?");

  if (isConfirm) {
    location.href = "index.html";
  }
};

// Get user ID from local storage
let userid = localStorage.getItem("userId");
console.log(userid);

// Function to update product count
function updateProductCount() {
  const productCount = document.getElementById("productCount");
  const products = productsContainer.children;
  if (productCount) {
    productCount.textContent = products.length;
  }
}

// Function to fetch and display products based on user ID
function showProducts(id) {
  fetch(`https://ecommerce-json-server-a127.onrender.com/products`) // Fetch all products
    .then((res) => res.json()) // Parse response as JSON
    .then((products) => {
      // Clear existing products
      productsContainer.innerHTML = "";

      // Filter products that match the provided ID
      let newproducts = products.filter((prod) => {
        return prod.id == id;
      });

      // Loop through filtered products and display them
      newproducts.forEach((prod) => {
        let child = document.createElement("div"); // Container for each product
        child.className = "seller-product"; // Add CSS class for styling

        let img = document.createElement("img"); // Product image
        img.src = prod.img;
        img.alt = prod.name; // Add alt text for accessibility

        let name = document.createElement("h3"); // Product name
        name.innerHTML = prod.name;

        let price = document.createElement("p"); // Product price
        price.innerHTML = `₹${prod.price}`;
        price.className = "price";

        let prodDesc = document.createElement("p"); // Product description
        prodDesc.innerHTML = prod.description;
        prodDesc.className = "description";

        // Create delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete Product";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteProduct(prod.id);

        // Create edit button
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit Product";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => showEditForm(prod);

        // Append all product details to the container
        child.append(img, name, price, prodDesc, deleteBtn, editBtn);

        // Append the product container to the main container
        productsContainer.append(child);

        // Log product to console for debugging
        console.log(prod);
      });

      // Update product count
      updateProductCount();
    })
    .catch((err) => {
      // Handle errors
      console.log(err);
    });
}

// Function to delete a product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`https://ecommerce-json-server-a127.onrender.com/products/${productId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        console.log("Product deleted successfully");
        showProducts(userid); // Refresh the product list
      })
      .catch((err) => console.log(err));
  }
}

// Function to create and show edit form
function showEditForm(product) {
  // Remove existing edit form if any
  if (editForm) {
    editForm.remove();
  }

  // Create edit form
  editForm = document.createElement("div");
  editForm.className = "edit-form-overlay";
  editForm.innerHTML = `
    <div class="edit-form">
      <div class="edit-form-header">
        <h3>Edit Product</h3>
        <button class="close-btn" onclick="closeEditForm()">&times;</button>
      </div>
      <form id="editProductForm">
        <input type="text" id="editProductName" placeholder="Product Name" value="${product.name}" required>
        <input type="number" id="editProductPrice" placeholder="Price" value="${product.price}" required>
        <input type="text" id="editProductImg" placeholder="Image URL" value="${product.img}" required>
        <input type="text" id="editProductCategory" placeholder="Product Category" value="${product.category}" required>
        <textarea id="editProductDesc" placeholder="Description" required>${product.description}</textarea>
        <div class="edit-form-buttons">
          <button type="submit" class="update-btn">Update Product</button>
          <button type="button" class="cancel-btn" onclick="closeEditForm()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  // Add form to body
  document.body.appendChild(editForm);

  // Store the product ID being edited
  editProductId = product.id;

  // Add event listener to the edit form
  document
    .getElementById("editProductForm")
    .addEventListener("submit", handleEditSubmit);
}

// Function to close edit form
function closeEditForm() {
  if (editForm) {
    editForm.remove();
    editForm = null;
    editProductId = null;
  }
}

// Function to handle edit form submission
function handleEditSubmit(e) {
  e.preventDefault();

  // Get form values
  const updatedProduct = {
    name: document.getElementById("editProductName").value,
    price: document.getElementById("editProductPrice").value,
    img: document.getElementById("editProductImg").value,
    category: document.getElementById("editProductCategory").value,
    description: document.getElementById("editProductDesc").value,
  };

  // Validate form
  if (
    !updatedProduct.name ||
    !updatedProduct.price ||
    !updatedProduct.img ||
    !updatedProduct.category ||
    !updatedProduct.description
  ) {
    alert("All fields are mandatory");
    return;
  }

  // Send PATCH request to update product
  fetch(`https://ecommerce-json-server-a127.onrender.com/products/${editProductId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((res) => res.json())
    .then(() => {
      console.log("Product updated successfully");
      closeEditForm();
      showProducts(userid); // Refresh the product list
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to update product. Please try again.");
    });
}

// Call the function to show products for the current user
showProducts(userid);

// Add event listener to the "Add Product" button
addProductBtn.onclick = (e) => {
  e.preventDefault(); // Prevent form submission

  // Create an object with product details from form inputs
  let productDetails = {
    id: userid,
    name: productName.value,
    price: productPrice.value,
    img: productImg.value,
    category: productCategory.value,
    description: productDesc.value,
  };

  // Check if any of the fields are missing
  if (
    !productName.value ||
    !productPrice.value ||
    !productImg.value ||
    !productCategory.value ||
    !productDesc.value
  ) {
    alert("All fields are mandatory"); // Show alert if any field is missing
    return;
  }

  // Send a POST request to add the product
  fetch(`https://ecommerce-json-server-a127.onrender.com/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Fixed typo in header name
    },
    body: JSON.stringify(productDetails), // Convert object to JSON string
  })
    .then((res) => res.json()) // Parse response
    .then(() => {
      console.log("Product Added Successfully");
      // Clear the form
      productName.value = "";
      productPrice.value = "";
      productImg.value = "";
      productCategory.value = "";
      productDesc.value = "";
      // Refresh the product list
      showProducts(userid);
    })
    .catch((err) => console.log(err)); // Handle errors
};
