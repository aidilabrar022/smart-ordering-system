// Initialize cart and daily data
let cart = [];
let dailyOrders = [];
let totalRevenue = 0;
let orderCount = 0;

// DOM Elements
const coverPage = document.getElementById('coverPage');
const mainPage = document.getElementById('mainPage');
const enterBtn = document.getElementById('enterBtn');
const menuSection = document.getElementById('menuSection');
const cartSection = document.getElementById('cartSection');
const incomeSection = document.getElementById('incomeSection');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

// Load saved data from localStorage
function loadSavedData() {
    const savedCart = localStorage.getItem('kingdomCart');
    const savedOrders = localStorage.getItem('kingdomDailyOrders');
    const savedRevenue = localStorage.getItem('kingdomTotalRevenue');
    const savedCount = localStorage.getItem('kingdomOrderCount');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedOrders) dailyOrders = JSON.parse(savedOrders);
    if (savedRevenue) totalRevenue = parseFloat(savedRevenue);
    if (savedCount) orderCount = parseInt(savedCount);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('kingdomCart', JSON.stringify(cart));
    localStorage.setItem('kingdomDailyOrders', JSON.stringify(dailyOrders));
    localStorage.setItem('kingdomTotalRevenue', totalRevenue.toString());
    localStorage.setItem('kingdomOrderCount', orderCount.toString());
}

// Enter button event
enterBtn.addEventListener('click', () => {
    coverPage.style.display = 'none';
    mainPage.style.display = 'block';
    loadSavedData();
    updateCartDisplay();
    updateIncomeDisplay();
});

// Navigation functions
function showSection(section) {
    menuSection.style.display = 'none';
    cartSection.style.display = 'none';
    incomeSection.style.display = 'none';
    
    if (section === 'menu') {
        menuSection.style.display = 'block';
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
        document.querySelectorAll('.nav-btn')[1].classList.remove('active');
        document.querySelectorAll('.nav-btn')[2].classList.remove('active');
    } else if (section === 'cart') {
        cartSection.style.display = 'block';
        updateCartDisplay();
        document.querySelectorAll('.nav-btn')[0].classList.remove('active');
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
        document.querySelectorAll('.nav-btn')[2].classList.remove('active');
    } else if (section === 'income') {
        incomeSection.style.display = 'block';
        updateIncomeDisplay();
        document.querySelectorAll('.nav-btn')[0].classList.remove('active');
        document.querySelectorAll('.nav-btn')[1].classList.remove('active');
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
    }
}

// Function to get image URL by item name
function getImageUrlByName(name) {
    const imageMap = {
        'Grilled Dragon Steak': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop&crop=center',
        'Knight\'s Roasted Chicken': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop&crop=center',
        'Royal Beef Stew': 'https://images.unsplash.com/photo-1569929238190-869826b1bb05?w=200&h=200&fit=crop&crop=center',
        'King\'s Lamb Chops': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop&crop=center',
        'Royal Mead': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop&crop=center',
        'Castle Ale': 'https://images.unsplash.com/photo-1566633808646-89c8bcd2d5f9?w=200&h=200&fit=crop&crop=center',
        'Royal Red Wine': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=200&h=200&fit=crop&crop=center',
        'Knight\'s Coffee': 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=200&h=200&fit=crop&crop=center',
        'Queen\'s Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&crop=center',
        'Royal Fruit Tart': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&h=200&fit=crop&crop=center',
        'Castle Cheesecake': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=200&h=200&fit=crop&crop=center'
    };
    
    return imageMap[name] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&crop=center';
}

// Add item to cart
function addToCart(name, price, icon, imageUrl) {
    const existingItem = cart.find(item => item.name === name);
    const image = imageUrl || getImageUrlByName(name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            icon: icon,
            image: image
        });
    }
    
    showNotification(`${name} added to cart!`, 'success');
    updateCartDisplay();
    saveData();
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Please select items from the menu.</p>';
        subtotalEl.textContent = 'Rp 0';
        taxEl.textContent = 'Rp 0';
        totalEl.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&crop=center'">
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <h4>${item.icon} ${item.name}</h4>
                        <span class="cart-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <button class="remove-item" onclick="removeItem(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    cartItems.innerHTML = html;
    subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    taxEl.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Cart item quantity functions
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
    saveData();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCartDisplay();
        saveData();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    saveData();
    showNotification('Item removed from cart', 'info');
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        saveData();
        showNotification('Cart cleared!', 'info');
    }
}

// Print receipt function
function printReceipt() {
    if (cart.length === 0) {
        showNotification('Cart is empty! Please add items first.', 'error');
        return;
    }
    
    let subtotal = 0;
    let receiptItemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        receiptItemsHTML += `
            <div class="receipt-item">
                <span class="item-name">${item.icon} ${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
                <span class="item-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('receiptDate').textContent = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('receiptTime').textContent = new Date().toLocaleTimeString('id-ID');
    document.getElementById('receiptNumber').textContent = 'KC-' + Date.now().toString().slice(-6);
    document.getElementById('receiptItems').innerHTML = receiptItemsHTML;
    document.getElementById('receiptSubtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('receiptTax').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    document.getElementById('receiptTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    const transaction = {
        time: new Date().toLocaleTimeString('id-ID'),
        items: [...cart],
        total: total
    };
    
    dailyOrders.push(transaction);
    totalRevenue += total;
    orderCount++;
    
    cart = [];
    saveData();
    updateCartDisplay();
    updateIncomeDisplay();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Kingdom Cafe Receipt</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; }
                    .receipt { max-width: 400px; margin: 0 auto; }
                    .receipt-header { text-align: center; margin-bottom: 20px; }
                    .receipt-divider { height: 1px; background: #000; margin: 10px 0; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .receipt-row { display: flex; justify-content: space-between; margin: 5px 0; }
                    .receipt-footer { text-align: center; margin-top: 20px; font-size: 12px; }
                </style>
            </head>
            <body>
                ${document.getElementById('receiptTemplate').innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    showNotification('Receipt printed successfully! Order completed.', 'success');
}

// Update income display
function updateIncomeDisplay() {
    document.getElementById('totalOrders').textContent = orderCount;
    document.getElementById('totalRevenue').textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
    
    const avgValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    document.getElementById('avgOrderValue').textContent = `Rp ${Math.round(avgValue).toLocaleString('id-ID')}`;
    
    if (dailyOrders.length === 0) {
        document.getElementById('transactionHistory').innerHTML = 
            '<p class="no-transactions">No transactions yet today.</p>';
        return;
    }
    
    let historyHTML = '';
    dailyOrders.forEach((order, index) => {
        historyHTML += `
            <div class="transaction-item">
                <p class="trans-time">Order #${index + 1} - ${order.time}</p>
                <p class="trans-items">${order.items.length} item(s)</p>
                <p class="trans-amount">Rp ${order.total.toLocaleString('id-ID')}</p>
            </div>
        `;
    });
    
    document.getElementById('transactionHistory').innerHTML = historyHTML;
}

// Reset daily data
function resetDailyData() {
    if (confirm('Are you sure you want to reset today\'s data? This cannot be undone!')) {
        dailyOrders = [];
        totalRevenue = 0;
        orderCount = 0;
        saveData();
        updateIncomeDisplay();
        showNotification('Daily data has been reset!', 'info');
    }
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.3s, fadeOut 0.5s 2.5s';
    
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #228B22 0%, #006400 100%)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #8B0000 0%, #650000 100%)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1569929238190-869826b1bb05?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1566633808646-89c8bcd2d5f9?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&h=500&fit=crop&crop=center'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    preloadImages();
    
    // Add image loading fallback
    document.querySelectorAll('.item-image').forEach(img => {
        img.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop&crop=center';
        };
    });
});