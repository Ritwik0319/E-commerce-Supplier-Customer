window.onload = () => {
  let allProducts = document.getElementById("allProducts");
  fetch("http://localhost:3000/products")
    .then((res) => res.json())
    .then((products) => {
      console.log(products);
      if(products.length==0){allProducts.innerHTML="No products"}
      products.forEach((prod) => {
        // Create product container
        const child = document.createElement("div");
        child.className = "product-card";

        // Create and set image
        const img = document.createElement("img");
        img.src = prod.img;
        img.alt = prod.name; // Accessibility improvement

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
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      allProducts.innerHTML = "<p>Failed to load products.</p>";
    });
};
