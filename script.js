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
    const accountButton = document.getElementById('account-button');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentLanguage = localStorage.getItem('language') || 'en';
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let users = JSON.parse(localStorage.getItem('users')) || [];

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
            const href = this.getAttribute('href');
            const category = this.getAttribute('data-category');

            // If it's a link to another page (sell.html), don't prevent default
            if (href && href.includes('.html')) {
                return;
            }

            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (category === 'all') {
                showAllCategories();
            } else if (category === 'accessories') {
                showCategory('accessories');
            } else if (category === 'user-listings') {
                showCategory('user-listings');
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

    // Account button
    if (accountButton) {
        accountButton.addEventListener('click', showAccountModal);
        updateAccountButton();
    }

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
            // Close all modals that might be open in sell phone functionality
            const allModals = document.querySelectorAll('.modal');
            allModals.forEach(modal => {
                if (modal.style.display === 'block' || modal.parentNode) {
                    if (modal.id === 'success-modal' && modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    } else {
                        modal.style.display = 'none';
                    }
                }
            });
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

    // User listing click for modal
    document.addEventListener('click', function(e) {
        const userListing = e.target.closest('.user-listing');
        if (userListing && !e.target.classList.contains('contact-seller-btn') && !e.target.classList.contains('remove-listing-btn')) {
            const listingId = userListing.dataset.id;
            const phoneListings = JSON.parse(localStorage.getItem('phoneListings')) || [];
            const listing = phoneListings.find(item => item.id == listingId);

            if (listing) {
                showUserListingModal(listing);
            }
        }
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

    // Sell phone form handling
    const sellForm = document.getElementById('sell-phone-form');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const priceSuggestion = document.getElementById('price-suggestion');
    const suggestedPriceSpan = document.getElementById('suggested-price');

    // Photo upload functionality
    const photoUploadArea = document.getElementById('photo-upload-area');
    const photoInput = document.getElementById('phone-photos');
    const photoPreview = document.getElementById('photo-preview');
    let uploadedPhotos = [];

    let currentSuggestedPrice = 0;

    // Photo upload event listeners
    if (photoUploadArea && photoInput) {
        photoUploadArea.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', handlePhotoUpload);
    }

    // Handle photo upload
    function handlePhotoUpload(e) {
        const files = Array.from(e.target.files);

        // Validate files
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                showNotification(currentLanguage === 'es' ? 'Solo se permiten archivos de imagen.' : 'Only image files are allowed.');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification(currentLanguage === 'es' ? 'Cada imagen debe ser menor a 5MB.' : 'Each image must be less than 5MB.');
                return false;
            }
            return true;
        });

        // Limit to 5 photos
        if (uploadedPhotos.length + validFiles.length > 5) {
            showNotification(currentLanguage === 'es' ? 'Máximo 5 fotos permitidas.' : 'Maximum 5 photos allowed.');
            return;
        }

        // Process valid files
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name
                };
                uploadedPhotos.push(photoData);
                updatePhotoPreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Update photo preview
    function updatePhotoPreview() {
        if (!photoPreview) return;

        photoPreview.innerHTML = '';

        if (uploadedPhotos.length === 0) {
            photoPreview.style.display = 'none';
            return;
        }

        photoPreview.style.display = 'grid';

        uploadedPhotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${photo.dataUrl}" alt="Photo ${index + 1}">
                <button type="button" class="remove-photo-btn" data-index="${index}">×</button>
            `;
            photoPreview.appendChild(photoItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-photo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                uploadedPhotos.splice(index, 1);
                updatePhotoPreview();
            });
        });
    }

    // Get price suggestion
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            // Get current form values
            const brand = document.getElementById('phone-brand').value;
            const model = document.getElementById('phone-model').value;
            const condition = document.getElementById('phone-condition').value;
            const storage = document.getElementById('phone-storage').value;
            const accessories = Array.from(document.querySelectorAll('input[name="accessories"]:checked')).map(cb => cb.value);

            // Basic validation for quote
            if (!brand || !model || !condition || !storage) {
                const message = currentLanguage === 'es' ? 'Por favor complete marca, modelo, condición y almacenamiento para obtener una cotización.' : 'Please fill in brand, model, condition, and storage to get a quote.';
                showNotification(message);
                return;
            }

            // Calculate suggested price
            const brandMultipliers = {
                apple: 1.2,
                samsung: 1.0,
                google: 0.9,
                oneplus: 0.8,
                other: 0.6
            };

            const conditionMultipliers = {
                excellent: 1.0,
                good: 0.8,
                fair: 0.6,
                poor: 0.3
            };

            const storageMultipliers = {
                '64gb': 0.8,
                '128gb': 1.0,
                '256gb': 1.2,
                '512gb': 1.4,
                '1tb': 1.6,
                other: 1.0
            };

            // Base prices for popular models (simplified)
            const basePrices = {
                'iPhone 15': 999,
                'iPhone 15 Pro': 1199,
                'iPhone 15 Pro Max': 1399,
                'iPhone 14': 799,
                'iPhone 14 Pro': 999,
                'iPhone 14 Pro Max': 1099,
                'iPhone 13': 599,
                'iPhone 13 Pro': 799,
                'iPhone 13 Pro Max': 899,
                'iPhone 12': 499,
                'Samsung Galaxy S24': 899,
                'Samsung Galaxy S24+': 999,
                'Samsung Galaxy S24 Ultra': 1199,
                'Samsung Galaxy S23': 699,
                'Samsung Galaxy S23+': 799,
                'Samsung Galaxy S23 Ultra': 999,
                'Samsung Galaxy S22': 499,
                'Samsung Galaxy S22+': 599,
                'Samsung Galaxy S22 Ultra': 699,
                'Google Pixel 8': 699,
                'Google Pixel 8 Pro': 899,
                'Google Pixel 7': 399,
                'Google Pixel 7 Pro': 499,
                'OnePlus 11': 699,
                'OnePlus 12': 799
            };

            // Find base price or use average
            let modelBasePrice = basePrices[model] || 500;

            // Calculate final suggested price
            const brandMultiplier = brandMultipliers[brand] || 1;
            const conditionMultiplier = conditionMultipliers[condition] || 1;
            const storageMultiplier = storageMultipliers[storage] || 1;

            const suggestedPrice = Math.round(modelBasePrice * brandMultiplier * conditionMultiplier * storageMultiplier);

            // Add accessories bonus
            const accessoryBonus = accessories.length * 10;
            currentSuggestedPrice = suggestedPrice + accessoryBonus;

            // Display suggested price
            suggestedPriceSpan.textContent = `$${currentSuggestedPrice}`;
            priceSuggestion.style.display = 'block';

            // Scroll to price section
            priceSuggestion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const message = currentLanguage === 'es' ? `Precio sugerido calculado: $${currentSuggestedPrice}` : `Suggested price calculated: $${currentSuggestedPrice}`;
            showNotification(message);
        });
    }

    if (sellForm) {
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const customPrice = formData.get('customPrice');
            const finalPrice = customPrice && customPrice > 0 ? parseFloat(customPrice) : currentSuggestedPrice;

            const phoneData = {
                id: Date.now(), // Unique ID for the listing
                brand: formData.get('brand'),
                model: formData.get('model'),
                condition: formData.get('condition'),
                storage: formData.get('storage'),
                accessories: formData.getAll('accessories'),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                suggestedPrice: currentSuggestedPrice,
                askingPrice: finalPrice,
                photos: uploadedPhotos.map(photo => ({
                    id: photo.id,
                    dataUrl: photo.dataUrl,
                    name: photo.name
                })),
                dateListed: new Date().toISOString(),
                status: 'pending', // pending, available, sold
                availableAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
            };

            // Basic validation
            if (!phoneData.brand || !phoneData.model || !phoneData.condition || !phoneData.storage || !phoneData.name || !phoneData.email || !phoneData.phone) {
                const message = currentLanguage === 'es' ? 'Por favor complete todos los campos requeridos.' : 'Please fill in all required fields.';
                showNotification(message);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(phoneData.email)) {
                const message = currentLanguage === 'es' ? 'Por favor ingrese un correo electrónico válido.' : 'Please enter a valid email address.';
                showNotification(message);
                return;
            }

            // Price validation
            if (finalPrice <= 0) {
                const message = currentLanguage === 'es' ? 'Por favor obtenga una sugerencia de precio primero.' : 'Please get a price suggestion first.';
                showNotification(message);
                return;
            }

            // Save to localStorage (in a real app, this would be sent to a server)
            const phoneListings = JSON.parse(localStorage.getItem('phoneListings')) || [];
            phoneListings.push(phoneData);
            localStorage.setItem('phoneListings', JSON.stringify(phoneListings));

            // If user is logged in, also save to their account
            if (currentUser) {
                currentUser.listings = currentUser.listings || [];
                currentUser.listings.push(phoneData.id);
                // Update user in users array
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }

            // Show success modal
            showListingSuccessModal(phoneData);

            // Reset form and hide price suggestion
            this.reset();
            priceSuggestion.style.display = 'none';
            currentSuggestedPrice = 0;
            uploadedPhotos = [];
            updatePhotoPreview();

            // Refresh listings display
            displayPhoneListings();
        });
    }

    // Show listing success modal
    function showListingSuccessModal(phoneData) {
        const successModal = document.createElement('div');
        successModal.className = 'modal';
        successModal.innerHTML = `
            <div class="modal-content success-modal">
                <span class="close">&times;</span>
                <h2 data-en="Phone Listed Successfully!" data-es="¡Teléfono listado exitosamente!">Phone Listed Successfully!</h2>
                <div class="success-details">
                    <div class="success-summary">
                        <h3>${phoneData.brand.charAt(0).toUpperCase() + phoneData.brand.slice(1)} ${phoneData.model}</h3>
                        <p class="listing-price" data-en="Asking Price: $${phoneData.askingPrice}" data-es="Precio Solicitado: $${phoneData.askingPrice}">Asking Price: $${phoneData.askingPrice}</p>
                        <p class="listing-condition" data-en="Condition: ${phoneData.condition.charAt(0).toUpperCase() + phoneData.condition.slice(1)}" data-es="Condición: ${phoneData.condition.charAt(0).toUpperCase() + phoneData.condition.slice(1)}">Condition: ${phoneData.condition.charAt(0).toUpperCase() + phoneData.condition.slice(1)}</p>
                        <p class="listing-status" data-en="Status: Pending Review" data-es="Estado: Pendiente de Revisión">Status: Pending Review</p>
                    </div>
                    <div class="success-info">
                        <p data-en="Thank you for listing your phone with Ph4You! Your listing has been submitted and is pending review." data-es="¡Gracias por listar tu teléfono con Ph4You! Tu anuncio ha sido enviado y está pendiente de revisión.">Thank you for listing your phone with Ph4You! Your listing has been submitted and is pending review.</p>
                        <p data-en="We'll review your listing within 24-48 hours and contact you if we need any additional information." data-es="Revisaremos tu anuncio dentro de 24-48 horas y nos pondremos en contacto si necesitamos información adicional.">We'll review your listing within 24-48 hours and contact you if we need any additional information.</p>
                        <p data-en="Listing Details:" data-es="Detalles del Anuncio:">Listing Details:</p>
                        <ul>
                            <li data-en="Name: ${phoneData.name}" data-es="Nombre: ${phoneData.name}">Name: ${phoneData.name}</li>
                            <li data-en="Email: ${phoneData.email}" data-es="Correo: ${phoneData.email}">Email: ${phoneData.email}</li>
                            <li data-en="Phone: ${phoneData.phone}" data-es="Teléfono: ${phoneData.phone}">Phone: ${phoneData.phone}</li>
                            <li data-en="Storage: ${phoneData.storage.toUpperCase()}" data-es="Almacenamiento: ${phoneData.storage.toUpperCase()}">Storage: ${phoneData.storage.toUpperCase()}</li>
                            <li data-en="Accessories: ${phoneData.accessories.length > 0 ? phoneData.accessories.join(', ') : 'None'}" data-es="Accesorios: ${phoneData.accessories.length > 0 ? phoneData.accessories.join(', ') : 'Ninguno'}">Accessories: ${phoneData.accessories.length > 0 ? phoneData.accessories.join(', ') : 'None'}</li>
                        </ul>
                    </div>
                </div>
                <button class="close-success-btn" data-en="Close" data-es="Cerrar">Close</button>
            </div>
        `;

        document.body.appendChild(successModal);
        successModal.style.display = 'block';

        // Close modal functionality
        const closeBtn = successModal.querySelector('.close');
        const closeSuccessBtn = successModal.querySelector('.close-success-btn');

        const closeModal = () => {
            if (successModal && successModal.parentNode) {
                successModal.parentNode.removeChild(successModal);
            }
        };

        closeBtn.addEventListener('click', closeModal);
        closeSuccessBtn.addEventListener('click', closeModal);

        // Close on outside click
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeModal();
            }
        });

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && successModal && successModal.parentNode) {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Remove escape listener when modal is closed
        successModal.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleEscape);
        });

























        // Update language for modal
        switchLanguage(currentLanguage);
    }
    
        // Show user listing modal
        function showUserListingModal(listing) {
            const userListingModal = document.createElement('div');
            userListingModal.className = 'modal';
            userListingModal.innerHTML = `
                <div class="modal-content user-listing-modal">
                    <span class="close">&times;</span>
                    <div class="modal-layout">
                        <div class="image-viewer">
                            <div class="main-image-container">
                                ${listing.photos && listing.photos.length > 0
                                    ? `<img src="${listing.photos[0].dataUrl}" alt="${listing.brand} ${listing.model}" class="main-image">`
                                    : `<img src="https://picsum.photos/500/500?random=${listing.id % 100}" alt="${listing.brand} ${listing.model}" class="main-image">`
                                }
                            </div>
                            ${listing.photos && listing.photos.length > 1 ? `
                                <div class="thumbnail-strip">
                                    ${listing.photos.map((photo, index) => `<img src="${photo.dataUrl}" alt="Photo ${index + 1}" class="thumbnail-strip-item ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">`).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="product-info">
                            <h2>${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)} ${listing.model}</h2>
                            <p class="price" style="font-size: 1.8rem; color: #0071e3; margin: 1rem 0; font-weight: 700;">$${listing.askingPrice}</p>
                            <p style="margin-bottom: 1.5rem; color: #86868b; font-size: 1.1rem;">${currentLanguage === 'es' ? 'Condición' : 'Condition'}: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</p>
    
                            <div class="listing-details-section">
                                <h3 data-en="Phone Details" data-es="Detalles del Teléfono">Phone Details</h3>
                                <ul>
                                    <li data-en="Brand: ${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)}" data-es="Marca: ${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)}">Brand: ${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)}</li>
                                    <li data-en="Model: ${listing.model}" data-es="Modelo: ${listing.model}">Model: ${listing.model}</li>
                                    <li data-en="Storage: ${listing.storage.toUpperCase()}" data-es="Almacenamiento: ${listing.storage.toUpperCase()}">Storage: ${listing.storage.toUpperCase()}</li>
                                    <li data-en="Condition: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}" data-es="Condición: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}">Condition: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</li>
                                    ${listing.accessories.length > 0 ? `<li data-en="Accessories: ${listing.accessories.join(', ')}" data-es="Accesorios: ${listing.accessories.join(', ')}">Accessories: ${listing.accessories.join(', ')}</li>` : ''}
                                    <li data-en="Listed: ${new Date(listing.dateListed).toLocaleDateString()}" data-es="Publicado: ${new Date(listing.dateListed).toLocaleDateString('es-ES')}">Listed: ${new Date(listing.dateListed).toLocaleDateString()}</li>
                                </ul>
                            </div>
    
                            <div class="seller-info-section">
                                <h3 data-en="Seller Information" data-es="Información del Vendedor">Seller Information</h3>
                                <p data-en="Name: ${listing.name}" data-es="Nombre: ${listing.name}">Name: ${listing.name}</p>
                                <p data-en="Location: Available upon contact" data-es="Ubicación: Disponible al contactar">Location: Available upon contact</p>
                            </div>
    
                            ${listing.status === 'available' ? `
                                <div class="modal-action-buttons">
                                    <button class="add-to-cart-listing-btn" data-listing-id="${listing.id}" data-brand="${listing.brand}" data-model="${listing.model}" data-price="${listing.askingPrice}" data-en="Add to Cart" data-es="Agregar al Carrito">Add to Cart</button>
                                    <div class="contact-buttons">
                                        <button class="contact-email-btn" data-email="${listing.email}" data-en="Email Seller" data-es="Contactar por Email">Email Seller</button>
                                        <button class="contact-phone-btn" data-phone="${listing.phone}" data-en="Call Seller" data-es="Llamar al Vendedor">Call Seller</button>
                                    </div>
                                </div>
                            ` : `
                                <div class="pending-status-notice">
                                    <p data-en="This listing is currently under review and will be available for purchase in ${Math.max(0, Math.ceil((new Date(listing.availableAt) - new Date()) / (1000 * 60)))} minutes." data-es="Este anuncio está actualmente en revisión y estará disponible para compra en ${Math.max(0, Math.ceil((new Date(listing.availableAt) - new Date()) / (1000 * 60)))} minutos.">This listing is currently under review and will be available for purchase in ${Math.max(0, Math.ceil((new Date(listing.availableAt) - new Date()) / (1000 * 60)))} minutes.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
    
            document.body.appendChild(userListingModal);
            userListingModal.style.display = 'block';
    
            // Close modal functionality
            const closeBtn = userListingModal.querySelector('.close');
    
            const closeModal = () => {
                if (userListingModal && userListingModal.parentNode) {
                    userListingModal.parentNode.removeChild(userListingModal);
                }
            };
    
            closeBtn.addEventListener('click', closeModal);
    
            // Close on outside click
            userListingModal.addEventListener('click', function(e) {
                if (e.target === userListingModal) {
                    closeModal();
                }
            });
    
            // Add to cart and contact button functionality
            const addToCartBtn = userListingModal.querySelector('.add-to-cart-listing-btn');
            const emailBtn = userListingModal.querySelector('.contact-email-btn');
            const phoneBtn = userListingModal.querySelector('.contact-phone-btn');

            addToCartBtn.addEventListener('click', function() {
                const listingId = this.dataset.listingId;
                const brand = this.dataset.brand;
                const model = this.dataset.model;
                const price = this.dataset.price;

                // Add to cart with special identifier for user listings
                cart.push({
                    name: `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${model} (User Listing)`,
                    price: price,
                    type: 'user-listing',
                    listingId: listingId
                });
                saveCart();

                const message = currentLanguage === 'es' ? `${brand} ${model} agregado al carrito!` : `${brand} ${model} added to cart!`;
                showNotification(message);
                closeModal();
            });
    
            emailBtn.addEventListener('click', function() {
                const email = this.dataset.email;
                const subject = currentLanguage === 'es' ? `Interesado en ${listing.brand} ${listing.model}` : `Interested in ${listing.brand} ${listing.model}`;
                const body = currentLanguage === 'es' ? `Hola ${listing.name},\n\nEstoy interesado en el teléfono ${listing.brand} ${listing.model} que tienes en venta por $${listing.askingPrice}.\n\n¿Podemos hablar sobre los detalles?\n\nSaludos.` : `Hi ${listing.name},\n\nI'm interested in the ${listing.brand} ${listing.model} you have for sale for $${listing.askingPrice}.\n\nCan we discuss the details?\n\nBest regards.`;
    
                window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                closeModal();
            });
    
            phoneBtn.addEventListener('click', function() {
                const phone = this.dataset.phone;
                const message = currentLanguage === 'es' ? `Llamando al vendedor: ${phone}` : `Calling seller: ${phone}`;
                showNotification(message);
    
                // In a real app, this would initiate a phone call
                // For demo purposes, we'll just show the phone number
                setTimeout(() => {
                    const callMessage = currentLanguage === 'es' ? `Número de teléfono: ${phone}` : `Phone number: ${phone}`;
                    showNotification(callMessage);
                }, 1000);
    
                closeModal();
            });
    
            // Update language for modal
            switchLanguage(currentLanguage);
        }
    
        // Account management functions
        function updateAccountButton() {
            if (accountButton) {
                if (currentUser) {
                    accountButton.textContent = '👤';
                    accountButton.title = currentLanguage === 'es' ? `Cuenta: ${currentUser.name}` : `Account: ${currentUser.name}`;
                } else {
                    accountButton.textContent = '👤';
                    accountButton.title = currentLanguage === 'es' ? 'Iniciar Sesión' : 'Login';
                }
            }
        }
    
        function showAccountModal() {
            const accountModal = document.createElement('div');
            accountModal.className = 'modal';
            accountModal.innerHTML = `
                <div class="modal-content account-modal">
                    <span class="close">&times;</span>
                    <h2 data-en="${currentUser ? 'My Account' : 'Login / Register'}" data-es="${currentUser ? 'Mi Cuenta' : 'Iniciar Sesión / Registrarse'}">${currentUser ? 'My Account' : 'Login / Register'}</h2>
    
                    ${currentUser ? `
                        <div class="account-info">
                            <div class="user-details">
                                <h3 data-en="Welcome back, ${currentUser.name}!" data-es="¡Bienvenido de vuelta, ${currentUser.name}!">Welcome back, ${currentUser.name}!</h3>
                                <p data-en="Email: ${currentUser.email}" data-es="Correo: ${currentUser.email}">Email: ${currentUser.email}</p>
                                <p data-en="Member since: ${new Date(currentUser.joinDate).toLocaleDateString()}" data-es="Miembro desde: ${new Date(currentUser.joinDate).toLocaleDateString('es-ES')}">Member since: ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
                            </div>
                            <div class="account-actions">
                                <button class="account-btn-primary" id="view-listings-btn" data-en="My Listings" data-es="Mis Anuncios">My Listings</button>
                                <button class="account-btn-secondary" id="logout-btn" data-en="Logout" data-es="Cerrar Sesión">Logout</button>
                            </div>
                        </div>
                    ` : `
                        <div class="auth-tabs">
                            <button class="tab-btn active" id="login-tab" data-en="Login" data-es="Iniciar Sesión">Login</button>
                            <button class="tab-btn" id="register-tab" data-en="Register" data-es="Registrarse">Register</button>
                        </div>
    
                        <div class="auth-forms">
                            <form id="login-form" class="auth-form active">
                                <div class="form-group">
                                    <label for="login-email" data-en="Email" data-es="Correo">Email</label>
                                    <input type="email" id="login-email" required>
                                </div>
                                <div class="form-group password-group">
                                    <label for="login-password" data-en="Password" data-es="Contraseña">Password</label>
                                    <div class="password-input-container">
                                        <input type="password" id="login-password" required>
                                        <button type="button" class="password-toggle" data-target="login-password">
                                            <img src="assets/icons/eye.svg" alt="Show password" class="eye-icon">
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" class="auth-submit-btn" data-en="Login" data-es="Iniciar Sesión">Login</button>
                            </form>
    
                            <form id="register-form" class="auth-form">
                                <div class="form-group">
                                    <label for="register-name" data-en="Full Name" data-es="Nombre Completo">Full Name</label>
                                    <input type="text" id="register-name" required>
                                </div>
                                <div class="form-group">
                                    <label for="register-email" data-en="Email" data-es="Correo">Email</label>
                                    <input type="email" id="register-email" required>
                                </div>
                                <div class="form-group">
                                    <label for="register-phone" data-en="Phone Number" data-es="Número de Teléfono">Phone Number</label>
                                    <input type="tel" id="register-phone" required>
                                </div>
                                <div class="form-group password-group">
                                    <label for="register-password" data-en="Password" data-es="Contraseña">Password</label>
                                    <div class="password-input-container">
                                        <input type="password" id="register-password" required minlength="6">
                                        <button type="button" class="password-toggle" data-target="register-password">
                                            <img src="assets/icons/eye.svg" alt="Show password" class="eye-icon">
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group password-group">
                                    <label for="register-confirm-password" data-en="Confirm Password" data-es="Confirmar Contraseña">Confirm Password</label>
                                    <div class="password-input-container">
                                        <input type="password" id="register-confirm-password" required minlength="6">
                                        <button type="button" class="password-toggle" data-target="register-confirm-password">
                                            <img src="assets/icons/eye.svg" alt="Show password" class="eye-icon">
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" class="auth-submit-btn" data-en="Create Account" data-es="Crear Cuenta">Create Account</button>
                            </form>
                        </div>
                    `}
                </div>
            `;
    
            document.body.appendChild(accountModal);
            accountModal.style.display = 'block';

            // Password visibility toggle functionality
            const passwordToggles = accountModal.querySelectorAll('.password-toggle');
            passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.dataset.target;
                    const targetInput = accountModal.querySelector(`#${targetId}`);
                    const eyeIcon = this.querySelector('.eye-icon');

                    if (targetInput && eyeIcon) {
                        if (targetInput.type === 'password') {
                            targetInput.type = 'text';
                            // Change to eye-off icon (password visible)
                            eyeIcon.src = 'assets/icons/eye-off.svg';
                            eyeIcon.alt = currentLanguage === 'es' ? 'Ocultar contraseña' : 'Hide password';
                        } else {
                            targetInput.type = 'password';
                            // Change back to eye icon (password hidden)
                            eyeIcon.src = 'assets/icons/eye.svg';
                            eyeIcon.alt = currentLanguage === 'es' ? 'Mostrar contraseña' : 'Show password';
                        }
                    }
                });
            });

            // Close modal functionality
            const closeBtn = accountModal.querySelector('.close');
    
            const closeModal = () => {
                if (accountModal && accountModal.parentNode) {
                    accountModal.parentNode.removeChild(accountModal);
                }
            };
    
            closeBtn.addEventListener('click', closeModal);
    
            // Close on outside click
            accountModal.addEventListener('click', function(e) {
                if (e.target === accountModal) {
                    closeModal();
                }
            });
    
            // Tab switching for login/register
            if (!currentUser) {
                const loginTab = accountModal.querySelector('#login-tab');
                const registerTab = accountModal.querySelector('#register-tab');
                const loginForm = accountModal.querySelector('#login-form');
                const registerForm = accountModal.querySelector('#register-form');
    
                loginTab.addEventListener('click', () => {
                    loginTab.classList.add('active');
                    registerTab.classList.remove('active');
                    loginForm.classList.add('active');
                    registerForm.classList.remove('active');
                });
    
                registerTab.addEventListener('click', () => {
                    registerTab.classList.add('active');
                    loginTab.classList.remove('active');
                    registerForm.classList.add('active');
                    loginForm.classList.remove('active');
                });
            }
    
            // Form submissions
            if (!currentUser) {
                const loginForm = accountModal.querySelector('#login-form');
                const registerForm = accountModal.querySelector('#register-form');
    
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = this.querySelector('#login-email').value;
                    const password = this.querySelector('#login-password').value;
    
                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        currentUser = user;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        updateAccountButton();
                        showNotification(currentLanguage === 'es' ? '¡Inicio de sesión exitoso!' : 'Login successful!');
                        closeModal();
                    } else {
                        showNotification(currentLanguage === 'es' ? 'Correo o contraseña incorrectos.' : 'Invalid email or password.');
                    }
                });
    
                registerForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const name = this.querySelector('#register-name').value;
                    const email = this.querySelector('#register-email').value;
                    const phone = this.querySelector('#register-phone').value;
                    const password = this.querySelector('#register-password').value;
                    const confirmPassword = this.querySelector('#register-confirm-password').value;
    
                    if (password !== confirmPassword) {
                        showNotification(currentLanguage === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
                        return;
                    }
    
                    if (users.some(u => u.email === email)) {
                        showNotification(currentLanguage === 'es' ? 'Este correo ya está registrado.' : 'This email is already registered.');
                        return;
                    }
    
                    const newUser = {
                        id: Date.now(),
                        name,
                        email,
                        phone,
                        password,
                        joinDate: new Date().toISOString(),
                        listings: []
                    };
    
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    currentUser = newUser;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    updateAccountButton();
                    showNotification(currentLanguage === 'es' ? '¡Cuenta creada exitosamente!' : 'Account created successfully!');
                    closeModal();
                });
            } else {
                // Account actions for logged in users
                const viewListingsBtn = accountModal.querySelector('#view-listings-btn');
                const logoutBtn = accountModal.querySelector('#logout-btn');
    
                viewListingsBtn.addEventListener('click', () => {
                    closeModal();
                    // Scroll to user listings section
                    const userListingsSection = document.getElementById('user-listings');
                    if (userListingsSection) {
                        userListingsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
    
                logoutBtn.addEventListener('click', () => {
                    currentUser = null;
                    localStorage.removeItem('currentUser');
                    updateAccountButton();
                    showNotification(currentLanguage === 'es' ? 'Sesión cerrada.' : 'Logged out.');
                    closeModal();
                });
            }
    
            // Update language for modal
            switchLanguage(currentLanguage);
        }
    
        // Check and update listing statuses based on time
        function updateListingStatuses() {
            const phoneListings = JSON.parse(localStorage.getItem('phoneListings')) || [];
            const now = new Date();
            let hasUpdates = false;
    
            phoneListings.forEach(listing => {
                if (listing.status === 'pending' && listing.availableAt) {
                    const availableTime = new Date(listing.availableAt);
                    if (now >= availableTime) {
                        listing.status = 'available';
                        hasUpdates = true;
                    }
                }
            });
    
            if (hasUpdates) {
                localStorage.setItem('phoneListings', JSON.stringify(phoneListings));
            }
    
            return phoneListings;
        }
    
        // Display phone listings
        function displayPhoneListings() {
            const phoneListings = updateListingStatuses();
            const listingsContainer = document.getElementById('user-phone-listings');
    
            if (!listingsContainer) return;
    
            if (phoneListings.length === 0) {
                listingsContainer.innerHTML = `
                    <div class="no-listings">
                        <p data-en="No phone listings yet. Be the first to sell your phone!" data-es="Aún no hay anuncios de teléfonos. ¡Sé el primero en vender tu teléfono!">No phone listings yet. Be the first to sell your phone!</p>
                    </div>
                `;
                return;
            }
    
            listingsContainer.innerHTML = phoneListings.map(listing => {
                const isAvailable = listing.status === 'available';
                const timeLeft = listing.status === 'pending' && listing.availableAt ?
                    Math.max(0, Math.ceil((new Date(listing.availableAt) - new Date()) / (1000 * 60))) : 0;
    
                return `
                    <div class="user-listing" data-id="${listing.id}">
                        <div class="listing-image">
                            ${listing.photos && listing.photos.length > 0
                                ? `<img src="${listing.photos[0].dataUrl}" alt="${listing.brand} ${listing.model}" loading="lazy">`
                                : `<img src="https://picsum.photos/300/300?random=${listing.id % 100}" alt="${listing.brand} ${listing.model}" loading="lazy">`
                            }
                            ${listing.photos && listing.photos.length > 1 ? `<div class="photo-count">+${listing.photos.length - 1}</div>` : ''}
                        </div>
                        <div class="listing-details">
                            <h3>${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)} ${listing.model}</h3>
                            ${isAvailable ? `
                                <p class="listing-price" data-en="Price: $${listing.askingPrice}" data-es="Precio: $${listing.askingPrice}">Price: $${listing.askingPrice}</p>
                            ` : `
                                <p class="listing-price-pending" data-en="Price: Available in ${timeLeft} minutes" data-es="Precio: Disponible en ${timeLeft} minutos">Price: Available in ${timeLeft} minutes</p>
                            `}
                            <p class="listing-condition" data-en="Condition: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}" data-es="Condición: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}">Condition: ${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</p>
                            <p class="listing-storage" data-en="Storage: ${listing.storage.toUpperCase()}" data-es="Almacenamiento: ${listing.storage.toUpperCase()}">Storage: ${listing.storage.toUpperCase()}</p>
                            <p class="listing-accessories" data-en="Accessories: ${listing.accessories.length > 0 ? listing.accessories.join(', ') : 'None'}" data-es="Accesorios: ${listing.accessories.length > 0 ? listing.accessories.join(', ') : 'Ninguno'}">Accessories: ${listing.accessories.length > 0 ? listing.accessories.join(', ') : 'None'}</p>
                            <p class="listing-seller" data-en="Seller: ${listing.name}" data-es="Vendedor: ${listing.name}">Seller: ${listing.name}</p>
                            <p class="listing-date" data-en="Listed: ${new Date(listing.dateListed).toLocaleDateString()}" data-es="Publicado: ${new Date(listing.dateListed).toLocaleDateString('es-ES')}">Listed: ${new Date(listing.dateListed).toLocaleDateString()}</p>
                            <div class="listing-status status-${listing.status}">
                                <span data-en="Status: ${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}" data-es="Estado: ${listing.status === 'pending' ? 'Pendiente' : listing.status === 'available' ? 'Disponible' : 'Vendido'}">Status: ${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</span>
                            </div>
                        </div>
                        <div class="listing-actions">
                            ${isAvailable ? `
                                <button class="contact-seller-btn" data-email="${listing.email}" data-phone="${listing.phone}" data-en="Contact Seller" data-es="Contactar Vendedor">Contact Seller</button>
                            ` : `
                                <div class="pending-notice" data-en="Available in ${timeLeft} minutes" data-es="Disponible en ${timeLeft} minutos">Available in ${timeLeft} minutes</div>
                            `}
                            ${listing.status === 'pending' ? `<button class="remove-listing-btn" data-id="${listing.id}" data-en="Remove Listing" data-es="Eliminar Anuncio">Remove Listing</button>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
    
            // Update language for listings
            switchLanguage(currentLanguage);
        }

    // Contact seller functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('contact-seller-btn')) {
            const email = e.target.dataset.email;
            const phone = e.target.dataset.phone;
            const subject = currentLanguage === 'es' ? 'Interesado en tu teléfono' : 'Interested in your phone';
            const body = currentLanguage === 'es' ? 'Hola, estoy interesado en el teléfono que tienes en venta.' : 'Hi, I\'m interested in the phone you have for sale.';

            // Try to open email client
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Show phone number as fallback
            setTimeout(() => {
                const message = currentLanguage === 'es' ? `También puedes llamar al: ${phone}` : `You can also call: ${phone}`;
                showNotification(message);
            }, 1000);
        }

        if (e.target.classList.contains('remove-listing-btn')) {
            const listingId = parseInt(e.target.dataset.id);
            const phoneListings = JSON.parse(localStorage.getItem('phoneListings')) || [];
            const updatedListings = phoneListings.filter(listing => listing.id !== listingId);
            localStorage.setItem('phoneListings', JSON.stringify(updatedListings));
            displayPhoneListings();

            const message = currentLanguage === 'es' ? 'Anuncio eliminado exitosamente.' : 'Listing removed successfully.';
            showNotification(message);
        }
    });

    // Initialize
    showAllCategories();
    updateCartCount();
    switchLanguage(currentLanguage);
    switchTheme(currentTheme);
    displayPhoneListings(); // Display listings on page load

    // Update listing statuses every minute
    setInterval(displayPhoneListings, 60000); // Check every minute

    // Start carousel autoplay
    startAutoplay();
});