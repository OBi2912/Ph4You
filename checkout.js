// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardFields = document.getElementById('credit-card-fields');
    let currentLanguage = localStorage.getItem('language') || 'en';
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Language switching functionality
    function switchLanguage(language) {
        currentLanguage = language;
        localStorage.setItem('language', language);

        // Update all elements with data attributes
        const elements = document.querySelectorAll('[data-' + language + ']');
        elements.forEach(element => {
            const translation = element.getAttribute('data-' + language);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else if (element.tagName === 'TITLE') {
                    document.title = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update document title
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.getAttribute('data-' + language)) {
            document.title = titleElement.getAttribute('data-' + language);
        }

        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = language;
        }

        // Reload cart items to update language
        loadCartItems();

        // Update totals display
        calculateTotals();
    }

    // Language selector event listener
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            switchLanguage(this.value);
        });
    }

    // Load cart items
    function loadCartItems() {
        if (cart.length === 0) {
            const emptyMessage = currentLanguage === 'es' ? 'Tu carrito está vacío. <a href="index.html">Continuar comprando</a>' : 'Your cart is empty. <a href="index.html">Continue shopping</a>';
            checkoutItems.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        const removeText = currentLanguage === 'es' ? 'Eliminar' : 'Remove';
        checkoutItems.innerHTML = cart.map((item, index) => `
            <div class="checkout-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">${removeText}</button>
            </div>
        `).join('');

        calculateTotals();
    }

    // Calculate order totals
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const tax = subtotal * 0.085; // 8.5% tax
        const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
        const total = subtotal + tax + shipping;

        const freeText = currentLanguage === 'es' ? 'GRATIS' : 'FREE';
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? freeText : `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Remove item from cart
    checkoutItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCartItems();
        }
    });

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                creditCardFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'none';
            }
        });
    });

    // Form validation and submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Basic form validation
        const requiredFields = ['first-name', 'last-name', 'email', 'phone', 'address', 'city', 'zip', 'state'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = '#ff3b30';
                isValid = false;
            } else {
                field.style.borderColor = '#d2d2d7';
            }
        });

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        if (paymentMethod === 'credit-card') {
            const cardFields = ['card-number', 'expiry', 'cvv', 'card-name'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff3b30';
                    isValid = false;
                } else {
                    field.style.borderColor = '#d2d2d7';
                }
            });
        }

        if (!isValid) {
            const message = currentLanguage === 'es' ? 'Por favor complete todos los campos requeridos.' : 'Please fill in all required fields.';
            alert(message);
            return;
        }

        // Simulate order processing
        const message = currentLanguage === 'es' ? '¡Gracias por su pedido! Esta es una página de pago de demostración. En una aplicación real, esto procesaría su pago y enviaría correos de confirmación.' : 'Thank you for your order! This is a demo checkout page. In a real application, this would process your payment and send confirmation emails.';
        alert(message);

        // Clear cart and redirect
        localStorage.removeItem('cart');
        updateCartCount();
        window.location.href = 'index.html';
    });

    // Update cart count in header
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    // Initialize
    loadCartItems();
    updateCartCount();

    // Theme switching functionality for checkout page
    function switchTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);

        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }

    // Initialize language switching for checkout page
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', function() {
            switchLanguage(this.value);
        });
        switchLanguage(currentLanguage);
    }

    // Initialize theme switching for checkout page
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            switchTheme(newTheme);
        });
        switchTheme(currentTheme);
    }
});