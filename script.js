document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
  
    // Fetch product data from an API (mock data in this example)
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(products => {
        // Display products in the product list
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
            <img src="${product.image}" alt="Product Image" width="350px" height="350px">
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="cart-button" data-id="${product.id}">Add to Cart</button>
          `;
          productList.appendChild(productElement);
  
          // Add event listener for Add to Cart button
          const cartButton = productElement.querySelector('.cart-button');
          cartButton.addEventListener('click', () => addToCart(product));
        });
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  
    // Initialize cart state
    let cart = [];
  
    // Function to add item to cart
    function addToCart(product) {
      // Check if the product is already in the cart
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        // If not, add it with a quantity of 1
        cart.push({ ...product, quantity: 1 });
      }
      renderCart();
    }
  
    // Function to remove item from cart
    function removeFromCart(id) {
      // Find the index of the item in the cart
      const index = cart.findIndex(item => item.id === id);
      if (index !== -1) {
        // Decrease the quantity, or remove if quantity is 1
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
      }
      renderCart();
    }
  
    // Function to render cart items
    function renderCart() {
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <div class="cart-item-details">
            <img src="${item.image}" alt="Product Image" width="100px" height="100px">
            <p>${item.title} - $${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-item-actions">
            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            <button class="remove-button" data-id="${item.id}">Remove</button>
          </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
  
        // Add event listeners for quantity buttons
        const decreaseBtn = cartItem.querySelector('.decrease-btn');
        decreaseBtn.addEventListener('click', () => decreaseQuantity(item.id));
  
        const increaseBtn = cartItem.querySelector('.increase-btn');
        increaseBtn.addEventListener('click', () => increaseQuantity(item.id));
  
        // Add event listener for Remove button
        const removeButton = cartItem.querySelector('.remove-button');
        removeButton.addEventListener('click', () => removeFromCart(item.id));
      });
      cartTotal.textContent = total.toFixed(2);
    }
  
    // Function to decrease quantity of an item in the cart
    function decreaseQuantity(id) {
      const index = cart.findIndex(item => item.id === id);
      if (index !== -1 && cart[index].quantity > 1) {
        cart[index].quantity--;
        renderCart();
      }
    }
  
    // Function to increase quantity of an item in the cart
    function increaseQuantity(id) {
      const index = cart.findIndex(item => item.id === id);
      if (index !== -1) {
        cart[index].quantity++;
        renderCart();
      }
    }
  });
  