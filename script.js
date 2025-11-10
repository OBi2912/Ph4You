// Enhanced JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const productSections = document.querySelectorAll('.product-section');
    const products = document.querySelectorAll('.product');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const productModal = document.getElementById('product-modal');
    const cartModal = document.getElementById('cart-modal');
    const closeButtons = document.querySelectorAll('.close');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const languageSelect = document.getElementById('language-select');
    const themeToggle = document.getElementById('theme-toggle');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentLanguage = localStorage.getItem('language') || 'en';
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Carousel functionality
    let currentSlide = 0;
    const totalSlides = 6;
    const carouselTrack = document.querySelector('.carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    let autoplayInterval;

    function updateCarousel() {
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${currentSlide * 16.666}%)`;
        }

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Carousel event listeners
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Carousel slide click to navigate to product
    document.addEventListener('click', function(e) {
        if (e.target.closest('.carousel-slide')) {
            const slide = e.target.closest('.carousel-slide');
            const productName = slide.dataset.product;

            // Find the product section and scroll to it
            const productSections = document.querySelectorAll('.product-section');
            const targetSection = Array.from(productSections).find(section => {
                const products = section.querySelectorAll('.product h3');
                return Array.from(products).some(product => product.textContent.includes(productName));
            });

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Highlight the specific product
                const products = targetSection.querySelectorAll('.product');
                const targetProduct = Array.from(products).find(product => {
                    const title = product.querySelector('h3').textContent;
                    return title.includes(productName);
                });

                if (targetProduct) {
                    targetProduct.style.animation = 'highlight 2s ease';
                    setTimeout(() => {
                        targetProduct.style.animation = '';
                    }, 2000);
                }
            }
        }
    });

    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Function to show a specific category
    function showCategory(category) {
        productSections.forEach(section => {
            if (section.id === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // Function to show all categories
    function showAllCategories() {
        productSections.forEach(section => {
            section.style.display = 'block';
        });
    }

    // Filter products based on search
    function filterProducts(searchTerm) {
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDetails = product.querySelector('.details').textContent.toLowerCase();
            const matches = productName.includes(searchTerm) || productDetails.includes(searchTerm);
            product.style.display = matches ? 'block' : 'none';
        });
    }

    // Sort products by price
    function sortProducts(sortType) {
        const productsArray = Array.from(products);
        const container = products[0].parentElement;

        productsArray.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);

            if (sortType === 'price-low') {
                return priceA - priceB;
            } else if (sortType === 'price-high') {
                return priceB - priceA;
            }
            return 0;
        });

        productsArray.forEach(product => container.appendChild(product));
    }

    // Show product modal
    function showProductModal(productElement) {
        const img = productElement.querySelector('img').src;
        const title = productElement.querySelector('h3').textContent;
        const price = productElement.querySelector('.price').textContent;
        const details = productElement.querySelector('.details').textContent;
        const specs = productElement.dataset.specs;
        const features = productElement.dataset.features;
        const condition = productElement.dataset.condition;
        const compatibility = productElement.dataset.compatibility;
        const images = productElement.dataset.images ? productElement.dataset.images.split(',') : [img];

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="modal-layout">
                <div class="image-viewer">
                    <div class="main-image-container">
                        <button class="nav-btn prev-btn" onclick="navigateImage(-1)">&#10094;</button>
                        <img src="${images[0]}" alt="${title}" class="main-image" id="main-image">
                        <button class="nav-btn next-btn" onclick="navigateImage(1)">&#10095;</button>
                        <div class="image-counter" id="image-counter">1 / ${images.length}</div>
                    </div>
                    <div class="thumbnail-strip">
                        ${images.map((imageUrl, index) => `<img src="${imageUrl}" alt="${title} - View ${index + 1}" class="thumbnail-strip-item ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">`).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h2>${title}</h2>
                    <p class="price" style="font-size: 1.5rem; color: #0071e3; margin: 1rem 0; font-weight: 600;">${price}</p>
                    <p style="margin-bottom: 1.5rem; color: #86868b;">${details}</p>

                    ${specs ? `<div class="info-section"><h3>Specifications</h3><p>${specs}</p></div>` : ''}

                    ${features ? `<div class="info-section"><h3>Key Features</h3><p>${features}</p></div>` : ''}

                    ${condition ? `<div class="info-section"><h3>Condition</h3><p>${condition}</p></div>` : ''}

                    ${compatibility ? `<div class="info-section"><h3>Compatibility</h3><p>${compatibility}</p></div>` : ''}

                    <button class="add-to-cart" onclick="addToCartFromModal('${title.replace(/'/g, "\\'")}', '${price.replace('$', '')}')">Add to Cart</button>
                </div>
            </div>
        `;

        // Initialize image viewer
        window.currentImageIndex = 0;
        window.productImages = images;

        productModal.style.display = 'block';
    }

    // Image viewer functions
    window.selectImage = function(index) {
        window.currentImageIndex = index;
        updateImageViewer();
    };

    window.navigateImage = function(direction) {
        const newIndex = window.currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < window.productImages.length) {
            window.currentImageIndex = newIndex;
            updateImageViewer();
        }
    };

    function updateImageViewer() {
        const mainImage = document.getElementById('main-image');
        const counter = document.getElementById('image-counter');
        const thumbnails = document.querySelectorAll('.thumbnail-strip-item');

        if (mainImage && counter && thumbnails.length > 0) {
            mainImage.src = window.productImages[window.currentImageIndex];
            counter.textContent = `${window.currentImageIndex + 1} / ${window.productImages.length}`;

            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === window.currentImageIndex);
            });
        }
    }

    // Keyboard navigation for image viewer
    document.addEventListener('keydown', function(e) {
        if (productModal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateImage(1);
            }
        }
    });

    // Add to cart from modal
    window.addToCartFromModal = function(product, price) {
        cart.push({ name: product, price: price });
        saveCart();
        const message = currentLanguage === 'es' ? `${product} agregado al carrito!` : `${product} added to cart!`;
        showNotification(message);
        productModal.style.display = 'none';
    };

    // Show cart modal
    function showCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cart.length === 0) {
            const emptyMessage = currentLanguage === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.';
            cartItems.innerHTML = `<p>${emptyMessage}</p>`;
            cartTotal.textContent = currentLanguage === 'es' ? 'Total: $0' : 'Total: $0';
        } else {
            const removeText = currentLanguage === 'es' ? 'Eliminar' : 'Remove';
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                    </div>
                    <button class="remove-item" data-index="${index}">${removeText}</button>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
            cartTotal.textContent = currentLanguage === 'es' ? `Total: $${total}` : `Total: $${total}`;
        }

        cartModal.style.display = 'block';
    }

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = this.dataset.price;

            cart.push({ name: product, price: price });
            saveCart();
            const message = currentLanguage === 'es' ? `${product} agregado al carrito!` : `${product} added to cart!`;
            showNotification(message);
        });
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (category === 'all') {
                showAllCategories();
            } else if (category === 'accessories') {
                showCategory('accessories');
            } else {
                showCategory(category + '-phones');
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        filterProducts(this.value.toLowerCase());
    });

    // Sort functionality
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Cart button
    cartButton.addEventListener('click', showCartModal);

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        }
    });

    // Product click for modal
    products.forEach(product => {
        product.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductModal(this);
            }
        });
    });

    // Remove from cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            saveCart();
            showCartModal();
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            const message = currentLanguage === 'es' ? '¡Tu carrito está vacío!' : 'Your cart is empty!';
            alert(message);
        } else {
            window.location.href = 'checkout.html';
        }
    });

    // Notification system
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            z-index: 1001;
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;

        // Add to body
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

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
        languageSelect.value = language;
    }

    // Language selector event listener
    languageSelect.addEventListener('change', function() {
        switchLanguage(this.value);
    });

    // Theme switching functionality
    function switchTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);

        // Update theme toggle button
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            switchTheme(newTheme);
        });
    }

    // Initialize
    showAllCategories();
    updateCartCount();
    switchLanguage(currentLanguage);
    switchTheme(currentTheme);

    // Start carousel autoplay
    startAutoplay();
});