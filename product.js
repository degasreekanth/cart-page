document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Apple", price: 110, image: "Apple.jpg", stock: true },
    { id: 2, name: "Banana", price: 60, image: "banana.jpg", stock: true },
    { id: 3, name: "Guava", price: 30, image: "guava.jpg", stock: true },
    { id: 4, name: "Kiwi", price: 80, image: "kiwi.jpg", stock: true },
    { id: 5, name: "Grapes", price: 45, image: "grapes.jpg", stock: true },
    { id: 6, name: "Pineapple", price: 40, image: "pineapple.jpg", stock: true },
    { id: 7, name: "Orange", price: 90, image: "orange.jpg", stock: true },
    { id: 8, name: "Dragon Fruit", price: 55, image: "dragon.jpg", stock: true },
    { id: 9, name: "Melon", price: 40, image: "melon.jpg", stock: false }
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let filteredProducts = [...products];

  const catalog = document.querySelector(".catalog");
  const cartCount = document.getElementById("cartCount");

  // Render products
  function renderProducts(productList) {
    catalog.innerHTML = "";
    productList.forEach(prod => {
      const article = document.createElement("article");
      article.setAttribute("data-category", getCategory(prod.name));

      article.innerHTML = `
        <img src="./${prod.image}" width="200" alt="${prod.name}" />
        <h2 class="product-title">${prod.name}</h2>
        <p>${getDescription(prod.name)}</p>
        <p><strong>Price:</strong> ₹${prod.price}</p>
        <p><strong>Availability:</strong> 
          <span class="${prod.stock ? 'in-Stock' : 'out-of-stock'}">
            ${prod.stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </p>
        <button class="add-to-cart" ${!prod.stock ? 'disabled' : ''}>Add to cart</button>
      `;

      const button = article.querySelector(".add-to-cart");
      button.addEventListener("click", () => {
        cart.push(prod);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${prod.name} added to cart!`);
        updateCartSidebar();
      });

      catalog.appendChild(article);
    });
  }

  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  function getDescription(name) {
    switch (name) {
      case "Apple": return "Kashmir Apple";
      case "Banana": return "Dozen (12 pieces)";
      case "Guava": return "1 kg (approx 10-15)";
      case "Kiwi": return "3 fruits";
      case "Grapes": return "1 kg";
      case "Pineapple": return "1 (approx 500g)";
      case "Orange": return "500g";
      case "Dragon Fruit": return "1 (approx 350g)";
      case "Melon": return "1.5kg - 2kg";
      default: return "";
    }
  }

  function getCategory(name) {
    if (["Apple", "Banana"].includes(name)) return "fruits";
    if (["Kiwi", "Grapes"].includes(name)) return "vitamin";
    return "others";
  }

  // Filter buttons
  const filterContainer = document.createElement("div");
  filterContainer.style.margin = "20px";
  filterContainer.innerHTML = `
    <button data-filter="all">All</button>
    <button data-filter="fruits">Fruits</button>
    <button data-filter="vitamin">Vitamin-Rich</button>
    <button data-filter="others">Others</button>
  `;
  document.body.insertBefore(filterContainer, catalog);

  filterContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    const filter = e.target.dataset.filter;
    filteredProducts = filter === "all"
      ? [...products]
      : products.filter(p => getCategory(p.name) === filter);
    renderProducts(filteredProducts);
  });

  // Sort dropdown
  document.getElementById("sortPrice").addEventListener("change", function () {
    const val = this.value;
    if (val === "low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (val === "high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    renderProducts(filteredProducts);
  });

  function updateCartSidebar() {
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const grouped = {};
    cartData.forEach(item => {
      grouped[item.name] = (grouped[item.name] || 0) + 1;
    });

    let sidebar = document.getElementById("cart-details");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.id = "cart-details";
      sidebar.style.position = "fixed";
      sidebar.style.top = "60px";
      sidebar.style.right = "10px";
      sidebar.style.background = "#222";
      sidebar.style.color = "yellow";
      sidebar.style.padding = "10px";
      sidebar.style.borderRadius = "10px";
      sidebar.style.maxWidth = "250px";
      sidebar.style.zIndex = 1000;
      document.body.appendChild(sidebar);
    }

    sidebar.innerHTML = `<h4>Cart Items</h4>` + Object.entries(grouped).map(([name, qty]) => {
      return `
        <div style="margin-bottom: 5px">
          ${name} <input type="number" min="1" value="${qty}" data-product="${name}" style="width:50px;">
          <button data-remove="${name}" style="margin-left:5px">X</button>
        </div>
      `;
    }).join("");

    sidebar.querySelectorAll("input[type='number']").forEach(input => {
      input.addEventListener("change", () => {
        const product = input.dataset.product;
        const newQty = parseInt(input.value);
        cartData = cartData.filter(item => item.name !== product);
        for (let i = 0; i < newQty; i++) {
          cartData.push(products.find(p => p.name === product));
        }
        localStorage.setItem("cart", JSON.stringify(cartData));
        cart = cartData;
        updateCartCount();
        updateCartSidebar();
      });
    });

    sidebar.querySelectorAll("button[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const product = btn.dataset.remove;
        cartData = cartData.filter(item => item.name !== product);
        localStorage.setItem("cart", JSON.stringify(cartData));
        cart = cartData;
        updateCartCount();
        updateCartSidebar();
      });
    });
  }

  renderProducts(products);
  updateCartCount();
  updateCartSidebar();
});
