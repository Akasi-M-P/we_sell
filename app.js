const products = [
    { id: 1, name: 'Grey Chair', price: 10, description: 'Description for Product 1', image: '/images/1.png' },
    { id: 2, name: 'Blue Chair', price: 20, description: 'Description for Product 2', image: '/images/2.png' },
    { id: 3, name: 'Wooden Chair', price: 30, description: 'Description for Product 3', image: '/images/3.png' },
    { id: 4, name: 'Sea-blue Chair', price: 40, description: 'Description for Product 4', image: '/images/4.png' },
    { id: 5, name: 'Brown Chair', price: 40, description: 'Description for Product 4', image: '/images/5.png' },
    { id: 6, name: 'Black Chair', price: 40, description: 'Description for Product 4', image: '/images/6.png' },
    { id: 7, name: 'Plastic Chair', price: 40, description: 'Description for Product 4', image: '/images/7.png' },
    { id: 8, name: 'Vintage Wooden Chair', price: 40, description: 'Description for Product 4', image: '/images/8.png' },
    { id: 9, name: 'Apple', price: 40, description: 'Description for Product 4', image: '/images/9.png' },
    { id: 10, name: 'Avocado', price: 40, description: 'Description for Product 4', image: '/images/10.png' },
    { id: 11, name: 'Bananas', price: 40, description: 'Description for Product 4', image: '/images/11.png' },
    { id: 12, name: 'Grapes', price: 40, description: 'Description for Product 4', image: '/images/12.png' },
    { id: 13, name: 'Guava', price: 40, description: 'Description for Product 4', image: '/images/13.png' },
    { id: 14, name: 'Mango', price: 40, description: 'Description for Product 4', image: '/images/14.png' },
    { id: 15, name: 'Orange', price: 40, description: 'Description for Product 4', image: '/images/15.png' },
    { id: 16, name: 'Watermelon', price: 40, description: 'Description for Product 4', image: '/images/16.png' },
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
const searchBar = document.getElementById('search-bar');
const detailTitle = document.getElementById('detail-title');
const detailImage = document.getElementById('detail-image');
const detailDescription = document.getElementById('detail-description');
const detailPrice = document.getElementById('detail-price');
const addToCartButton = document.getElementById('add-to-cart-button');
const closeDetailButton = document.getElementById('close-detail');



function renderProducts(productsToRender) {
    productList.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart-button">Add to Cart</button>
            <button onclick="viewDetails(${product.id})">View Details</button>
        `;

        // Add event listener to the "Add to Cart" button
        const addToCartBtn = productCard.querySelector('.add-to-cart-button');
        addToCartBtn.addEventListener('click', () => {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        });

        productList.appendChild(productCard);
    });
}

// Function to show product details
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    currentProduct = product;
    detailTitle.textContent = product.name;
    detailImage.src = product.image;
    detailDescription.textContent = product.description;
    detailPrice.textContent = `$${product.price}`;
    productDetailModal.style.display = 'flex';
}

// Add product to cart or increase quantity if already in cart
addToCartButton.addEventListener('click', () => {
    if (currentProduct) {
        const existingItem = cart.find(item => item.id === currentProduct.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...currentProduct, quantity: 1 });
        }
        updateCart();
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

// Update cart UI and total price
function updateCart() {
    cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
    totalPrice.textContent = `$${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;

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
}

// Toggle Cart Modal
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close product details modal
closeDetailButton.addEventListener('click', () => {
    productDetailModal.style.display = 'none';
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

// Initialize product display
renderProducts(products);