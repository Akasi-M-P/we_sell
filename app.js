// Products
const products = [
    { id: 1, name: 'Grey Chair', price: 10, description: 'A sleek, modern grey chair that complements any room with its minimalist design.', image: './images/1.png' },
    { id: 2, name: 'Blue Chair', price: 20, description: 'A comfortable blue chair that adds a pop of color and style to your space.', image: './images/2.png' },
    { id: 3, name: 'Wooden Chair', price: 30, description: 'Crafted from high-quality wood, this chair offers durability and a classic aesthetic.', image: './images/3.png' },
    { id: 4, name: 'Sea-blue Chair', price: 40, description: 'A calming sea-blue chair, perfect for creating a relaxing atmosphere.', image: './images/4.png' },
    { id: 5, name: 'Brown Chair', price: 40, description: 'A sturdy brown chair with an earthy tone that blends well with rustic interiors.', image: './images/5.png' },
    { id: 6, name: 'Black Chair', price: 40, description: 'An elegant black chair with a sleek finish, ideal for both home and office.', image: './images/6.png' },
    { id: 7, name: 'Plastic Chair', price: 40, description: 'A lightweight and durable plastic chair, great for indoor and outdoor use.', image: './images/7.png' },
    { id: 8, name: 'Vintage Wooden Chair', price: 40, description: 'A vintage wooden chair with intricate carvings that evoke timeless charm.', image: './images/8.png' },
    { id: 9, name: 'Apple', price: 40, description: 'Fresh, crisp, and juicy apples, perfect for a healthy snack or a sweet dessert.', image: './images/9.png' },
    { id: 10, name: 'Avocado', price: 40, description: 'Creamy and nutrient-rich avocados, ideal for toast, salads, or smoothies.', image: './images/10.png' },
    { id: 11, name: 'Bananas', price: 40, description: 'Sweet and versatile bananas, packed with energy and perfect for on-the-go snacks.', image: './images/11.png' },
    { id: 12, name: 'Grapes', price: 40, description: 'Juicy and sweet grapes, great for snacking or adding to your favorite recipes.', image: './images/12.png' },
    { id: 13, name: 'Guava', price: 40, description: 'Tropical guavas with a unique blend of sweetness and tang, full of vitamins.', image: './images/13.png' },
    { id: 14, name: 'Mango', price: 40, description: 'Ripe and succulent mangoes, bursting with tropical flavor.', image: './images/14.png' },
    { id: 15, name: 'Orange', price: 40, description: 'Citrusy and refreshing oranges, perfect for juicing or snacking.', image: './images/15.png' },
    { id: 16, name: 'Watermelon', price: 40, description: 'Juicy and hydrating watermelon slices, a summer favorite.', image: './images/16.png' },
];


let cart = [];
let currentProduct = null;

// DOM Elements
const productList = document.getElementById('product-list');
const cartModal = document.getElementById('cart-modal');
const productDetailModal = document.getElementById('product-detail-modal');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const closeCartButton = document.getElementById('close-cart');
const clearCartButton = document.createElement('button');
const searchBar = document.getElementById('search-bar');
const detailTitle = document.getElementById('detail-title');
const detailImage = document.getElementById('detail-image');
const detailDescription = document.getElementById('detail-description');
const detailPrice = document.getElementById('detail-price');
const addToCartButton = document.getElementById('add-to-cart-button');
const closeDetailButton = document.getElementById('close-detail');

// Add "Clear Cart" button to cart modal
clearCartButton.id = 'clear-cart-button';
clearCartButton.textContent = 'Clear Cart';
clearCartButton.addEventListener('click', clearCart);
cartModal.querySelector('.cart-summary').appendChild(clearCartButton);

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Render product list
function renderProducts(productsToRender) {
    productList.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
            <button onclick="viewDetails(${product.id})">View Details</button>
        `;

        // Add event listener to the "Add to Cart" button
        const addToCartBtn = productCard.querySelector('.add-to-cart-button');
        addToCartBtn.addEventListener('click', () => {
            const existingItem = cart.find(item => item.id === product.id);
            if (!existingItem) {
                cart.push({ ...product, quantity: 1 });
                updateCart();
            }
        });

        productList.appendChild(productCard);
    });

    // Update product card buttons based on cart state
    updateCart();
}

// Update cart UI and localStorage
function updateCart() {
    const uniqueItemsCount = cart.length;
    const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    cartCount.textContent = uniqueItemsCount;
    totalPrice.textContent = `$${totalCartPrice.toFixed(2)}`;

    // Render cart items
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <span>${item.name} - $${item.price} x ${item.quantity}</span>
            <div>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Update "Add to Cart" buttons on product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.querySelector('.add-to-cart-button').dataset.productId, 10);
        const inCart = cart.some(item => item.id === productId);
        const button = card.querySelector('.add-to-cart-button');
        if (inCart) {
            button.textContent = 'In Cart';
            button.disabled = true;
        } else {
            button.textContent = 'Add to Cart';
            button.disabled = false;
        }
    });

    // Update the "Add to Cart" button in the product details modal
    if (currentProduct) {
        const inCart = cart.some(item => item.id === currentProduct.id);
        if (inCart) {
            addToCartButton.textContent = 'In Cart';
            addToCartButton.disabled = true;
        } else {
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.disabled = false;
        }
    }

    saveCartToLocalStorage();
}

// Clear all items from the cart
function clearCart() {
    cart = [];
    updateCart();
}

// View product details
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    currentProduct = product;
    detailTitle.textContent = product.name;
    detailImage.src = product.image;
    detailDescription.textContent = product.description;
    detailPrice.textContent = `$${product.price}`;

    // Update the "Add to Cart" button in the modal
    const inCart = cart.some(item => item.id === product.id);
    if (inCart) {
        addToCartButton.textContent = 'In Cart';
        addToCartButton.disabled = true;
    } else {
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.disabled = false;
    }

    productDetailModal.style.display = 'flex';
}

// Add to cart from modal
addToCartButton.addEventListener('click', () => {
    if (currentProduct) {
        const existingItem = cart.find(item => item.id === currentProduct.id);
        if (!existingItem) {
            cart.push({ ...currentProduct, quantity: 1 });
            updateCart();
        }
        productDetailModal.style.display = 'none';
    }
});

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Increase item quantity
function increaseQuantity(productId) {
    const item = cart.find(product => product.id === productId);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const item = cart.find(product => product.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
        }
        updateCart();
    }
}

// Close product details modal
closeDetailButton.addEventListener('click', () => {
    productDetailModal.style.display = 'none';
});

// Toggle cart modal
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Filter products by search
searchBar.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
});

// Initialize
loadCartFromLocalStorage();
renderProducts(products);
updateCart();