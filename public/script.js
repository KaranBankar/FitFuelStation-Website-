const WHATSAPP_NUMBER = '919822660872';

function openWhatsApp(message) {
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
}

const meals = [
    {
        id: 1,
        name: 'Chicken Rice Bowl',
        description: 'High-protein chicken & rice bowl — fresh, filling & made daily.',
        image: 'images/chicken-rice-bowl.jpg',
        tag: 'High Protein',
        category: 'protein',
        variants: [
            {
                size: '100g',
                label: 'Regular',
                price: 149,
                nutrition: {
                    calories: 535,
                    protein: 41,
                    carbs: 62,
                    fiber: 9,
                    fat: 8,
                    fatLabel: 'fat',
                },
            },
            {
                size: '200g',
                label: 'Large',
                price: 210,
                nutrition: {
                    calories: 700,
                    protein: 72,
                    carbs: 62,
                    fiber: 9,
                    fat: 15,
                    fatLabel: 'healthy fats',
                },
            },
        ],
    },
    {
        id: 2,
        name: 'Paneer Rice Bowl',
        description: 'High-protein paneer & rice bowl — perfect vegetarian muscle fuel.',
        image: 'images/paneer-rice-bowl.jpg',
        tag: 'Veg Protein',
        category: 'veg',
        variants: [
            {
                size: '100g',
                label: 'Regular',
                price: 160,
                nutrition: {
                    calories: 575,
                    protein: 31,
                    carbs: 67,
                    fiber: 9,
                    fat: 21,
                    fatLabel: 'fat',
                },
            },
            {
                size: '200g',
                label: 'Large',
                price: 210,
                nutrition: {
                    calories: 840,
                    protein: 50,
                    carbs: 67,
                    fiber: 9,
                    fat: 40,
                    fatLabel: 'fat',
                },
            },
        ],
    },
    {
        id: 3,
        name: 'Egg Rice Bowl',
        description: '4-egg protein bowl with rice — simple, powerful & affordable.',
        image: 'images/egg-rice-bowl.jpg',
        tag: 'High Protein',
        category: 'protein',
        variants: [
            {
                size: '4 Egg (100g)',
                label: 'Standard',
                price: 129,
                nutrition: {
                    calories: 670,
                    protein: 34,
                    carbs: 67,
                    fiber: 9,
                    fat: 28,
                    fatLabel: 'fat',
                },
            },
        ],
    },
    {
        id: 4,
        name: 'Soya Chunks Rice Bowl',
        description: 'High-protein soya chunks & rice — plant-powered veg muscle fuel.',
        image: 'images/soya-chunks-rice-bowl.jpg',
        tag: 'Veg Protein',
        category: 'veg',
        variants: [
            {
                size: '100g',
                label: 'Regular',
                price: 129,
                nutrition: {
                    calories: 690,
                    protein: 62,
                    carbs: 93,
                    fiber: 18,
                    fat: 8,
                    fatLabel: 'fat',
                },
            },
        ],
    },
    {
        id: 5,
        name: 'Sprouts Chaat Bowl',
        description: 'Light, fresh sprouts chaat — nutritious, crunchy & low-cal.',
        image: 'images/sprouts-chaat-bowl.jpg',
        tag: 'Light & Fresh',
        category: 'light',
        variants: [
            {
                size: '100g',
                label: 'Regular',
                price: 59,
                nutrition: {
                    calories: 220,
                    protein: 13,
                    carbs: 31,
                    fiber: 9,
                    fat: 4,
                    fatLabel: 'fat',
                },
            },
        ],
    },
];

let cart = [];
let currentFilter = 'all';
let liveLocation = null;
let locationWatchId = null;

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDeliveryDateLimits() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 3);

    return {
        min: formatLocalDate(today),
        max: formatLocalDate(maxDate),
    };
}

function setupDeliveryDateInput() {
    const dateInput = document.getElementById('deliveryDate');
    if (!dateInput) return;

    const { min, max } = getDeliveryDateLimits();
    dateInput.min = min;
    dateInput.max = max;
}

document.addEventListener('DOMContentLoaded', () => {
    setupDeliveryDateInput();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    renderMeals('all');
    setupEventListeners();
    updateCartUI();
});

function setupEventListeners() {
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    document.getElementById('useLiveLocation').addEventListener('click', useLiveLocation);

    initDevModal();

    document.getElementById('addressManual').addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            liveLocation = null;
            document.getElementById('locationPreview').hidden = true;
            setLocationStatus('');
        }
    });
    document.getElementById('prevBtn').addEventListener('click', prevTestimonial);
    document.getElementById('nextBtn').addEventListener('click', nextTestimonial);

    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderMeals(currentFilter);
        });
    });

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function getFilteredMeals(filter) {
    if (filter === 'all') return meals;
    return meals.filter((meal) => meal.category === filter);
}

function renderSizePicker(meal) {
    const isDual = meal.variants.length > 1;
    const options = meal.variants
        .map(
            (v, i) => `
            <button type="button" class="size-pill${i === 0 ? ' active' : ''}" data-size="${v.size}" data-price="${v.price}" aria-label="${v.size} ₹${v.price}">
                <span class="size-pill-weight">${v.size}</span>
                <span class="size-pill-price">₹${v.price}</span>
            </button>
        `
        )
        .join('');

    return `
        <div class="size-picker">
            <span class="size-picker-label">${isDual ? 'Size' : 'Portion'}</span>
            <div class="size-pills${isDual ? ' dual' : ''}">${options}</div>
        </div>
    `;
}

function getSelectedVariant(card) {
    const active = card.querySelector('.size-pill.active');
    return {
        size: active.dataset.size,
        price: Number(active.dataset.price),
    };
}

function renderNutrition(nutrition) {
    if (!nutrition) return '';

    const fatLabel = nutrition.fatLabel || 'fat';

    return `
        <div class="meal-nutrition" aria-label="Nutrition per serving">
            <span class="nutrition-item">🔥 ${nutrition.calories} kcal</span>
            <span class="nutrition-item">💪 ${nutrition.protein} g protein</span>
            <span class="nutrition-item">🍚 ${nutrition.carbs} g carbs</span>
            <span class="nutrition-item">🌾 ${nutrition.fiber} g fiber</span>
            <span class="nutrition-item">🥜 ${nutrition.fat} g ${fatLabel}</span>
        </div>
    `;
}

function updateMealNutrition(card, nutrition) {
    const wrap = card.querySelector('.meal-nutrition-wrap');
    if (!wrap) return;

    if (!nutrition) {
        wrap.hidden = true;
        wrap.innerHTML = '';
        return;
    }

    wrap.hidden = false;
    wrap.innerHTML = renderNutrition(nutrition);
}

function renderMeals(filter) {
    const mealsGrid = document.getElementById('mealsGrid');
    mealsGrid.innerHTML = '';

    getFilteredMeals(filter).forEach((meal) => {
        const defaultVariant = meal.variants[0];
        const card = document.createElement('article');
        card.className = 'meal-card';
        card.dataset.mealId = meal.id;

        card.innerHTML = `
            <div class="meal-image-wrap">
                <img class="meal-image" src="${meal.image}" alt="${meal.name}" loading="lazy">
            </div>
            <div class="meal-body">
                <div class="meal-head">
                    <h3 class="meal-name">${meal.name}</h3>
                    <span class="meal-tag">${meal.tag}</span>
                </div>
                <p class="meal-description">${meal.description}</p>
                ${renderSizePicker(meal)}
                <div class="meal-nutrition-wrap"${defaultVariant.nutrition ? '' : ' hidden'}>
                    ${renderNutrition(defaultVariant.nutrition)}
                </div>
            </div>
            <div class="meal-action">
                <div class="meal-price" data-price-for="${meal.id}">₹${defaultVariant.price}</div>
                <button type="button" class="add-to-cart-btn" data-add-meal="${meal.id}">Add to Cart</button>
            </div>
        `;

        const priceEl = card.querySelector('.meal-price');
        card.querySelectorAll('.size-pill').forEach((btn) => {
            btn.addEventListener('click', () => {
                card.querySelectorAll('.size-pill').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                priceEl.textContent = `₹${btn.dataset.price}`;
                const variant = meal.variants.find((v) => v.size === btn.dataset.size);
                updateMealNutrition(card, variant?.nutrition);
            });
        });

        card.querySelector('[data-add-meal]').addEventListener('click', () => {
            const selected = getSelectedVariant(card);
            addToCart(meal.id, selected.size, selected.price);
        });

        mealsGrid.appendChild(card);
    });
}

function cartKey(id, size) {
    return `${id}::${size}`;
}

function addToCart(mealId, size, price) {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;
    const key = cartKey(mealId, size);
    const existing = cart.find((item) => item.key === key);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            key,
            id: meal.id,
            name: meal.name,
            size,
            price,
            quantity: 1,
        });
    }

    updateCartUI();
    showNotification('Added to cart!');
    openCart(true);
}

function removeFromCart(key) {
    cart = cart.filter((item) => item.key !== key);
    updateCartUI();
}

function updateQuantity(key, delta) {
    const item = cart.find((m) => m.key === key);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(key);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;

    const cartItemsContainer = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItemsContainer.innerHTML = cart
            .map(
                (item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size}${item.price ? ` — ₹${item.price} each` : ''}</p>
                </div>
                <div class="cart-item-controls">
                    <button type="button" class="qty-btn" data-qty="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button type="button" class="qty-btn" data-qty="${item.key}" data-delta="1" aria-label="Increase quantity">+</button>
                    <button type="button" class="remove-btn" data-remove="${item.key}" aria-label="Remove item">✕</button>
                </div>
            </div>
        `
            )
            .join('');

        cartItemsContainer.querySelectorAll('[data-qty]').forEach((btn) => {
            btn.addEventListener('click', () => {
                updateQuantity(btn.dataset.qty, Number(btn.dataset.delta));
            });
        });
        cartItemsContainer.querySelectorAll('[data-remove]').forEach((btn) => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
        });
    }

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${subtotal}`;
}

function openCart(scrollToCheckout = false) {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');

    if (scrollToCheckout) {
        setTimeout(() => {
            const checkout = document.getElementById('cartCheckout');
            if (checkout) {
                checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar.classList.contains('active')) {
        closeCart();
    } else {
        openCart(false);
    }
}

function handleCheckout(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before placing an order.');
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const addressManual = document.getElementById('addressManual').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryDate = document.getElementById('deliveryDate').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const sauceChoice = document.getElementById('sauceChoice').value;
    const specialNotes = document.getElementById('specialNotes').value.trim();

    if (!fullName || !phone || !deliveryDate || !timeSlot || !sauceChoice) {
        alert('Please fill in all required fields, including your sauce choice.');
        return;
    }

    const { min, max } = getDeliveryDateLimits();
    if (deliveryDate < min || deliveryDate > max) {
        alert('Please choose a delivery date within the next 3 days (today through 3 days ahead).');
        return;
    }

    if (!liveLocation && !addressManual) {
        alert('Please use "Get Exact Live Location" or enter your full delivery address manually.');
        return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    const message = generateWhatsAppMessage(
        fullName,
        { landmark, addressManual, liveLocation },
        phone,
        deliveryDate,
        timeSlot,
        sauceChoice,
        specialNotes
    );
    openWhatsApp(message);
    resetOrderForm();
}

function resetOrderForm() {
    cart = [];
    updateCartUI();
    closeCart();

    const form = document.getElementById('checkoutForm');
    if (form) form.reset();

    setupDeliveryDateInput();

    liveLocation = null;
    stopLocationWatch();

    const preview = document.getElementById('locationPreview');
    if (preview) preview.hidden = true;

    const mapFrame = document.getElementById('locationMapFrame');
    if (mapFrame) mapFrame.src = '';

    setLocationStatus('');
    showNotification('Order sent! Form cleared.');
}

function setLocationStatus(text, type = '') {
    const statusEl = document.getElementById('locationStatus');
    if (!text) {
        statusEl.hidden = true;
        statusEl.textContent = '';
        statusEl.className = 'location-status';
        return;
    }
    statusEl.hidden = false;
    statusEl.textContent = text;
    statusEl.className = `location-status ${type}`.trim();
}

function buildMapsUrl(lat, lng) {
    const q = `${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${q}&zoom=19`;
}

function buildEmbedMapUrl(lat, lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=19&output=embed`;
}

function formatCoords(lat, lng) {
    return `${lat.toFixed(7)}, ${lng.toFixed(7)}`;
}

function stopLocationWatch() {
    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
}

function applyLiveLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = Math.round(position.coords.accuracy);
    const mapsUrl = buildMapsUrl(lat, lng);

    liveLocation = { lat, lng, accuracy, mapsUrl };

    const preview = document.getElementById('locationPreview');
    const coordsEl = document.getElementById('coordsDisplay');
    const accuracyEl = document.getElementById('accuracyDisplay');
    const verifyLink = document.getElementById('verifyMapLink');
    const mapFrame = document.getElementById('locationMapFrame');

    preview.hidden = false;
    coordsEl.textContent = `Latitude: ${lat.toFixed(7)}  ·  Longitude: ${lng.toFixed(7)}`;
    accuracyEl.textContent = `GPS accuracy: ±${accuracy} meters — tap "Verify on Google Maps" to confirm the pin`;
    verifyLink.href = mapsUrl;
    mapFrame.src = buildEmbedMapUrl(lat, lng);

    document.getElementById('addressManual').value = '';
    setLocationStatus('Exact GPS pin saved. Add flat/landmark below if needed.', 'success');
}

function getAccuratePosition(onProgress) {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('unsupported'));
            return;
        }

        let best = null;
        let readings = 0;
        const maxReadings = 8;
        const targetAccuracy = 25;

        stopLocationWatch();

        locationWatchId = navigator.geolocation.watchPosition(
            (position) => {
                readings++;
                if (!best || position.coords.accuracy < best.coords.accuracy) {
                    best = position;
                    onProgress?.(position, readings);
                }

                if (position.coords.accuracy <= targetAccuracy || readings >= maxReadings) {
                    stopLocationWatch();
                    resolve(best);
                }
            },
            (error) => {
                stopLocationWatch();
                reject(error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 25000,
            }
        );

        setTimeout(() => {
            stopLocationWatch();
            if (best) resolve(best);
            else reject(new Error('timeout'));
        }, 25000);
    });
}

function useLiveLocation() {
    const btn = document.getElementById('useLiveLocation');

    if (!navigator.geolocation) {
        alert('Live location is not supported on this device or browser.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Getting exact GPS...';
    setLocationStatus('Locking exact GPS signal… stay outdoors or near a window for best accuracy.', 'loading');

    getAccuratePosition((position, count) => {
        const accuracy = Math.round(position.coords.accuracy);
        setLocationStatus(`Reading ${count}… current accuracy ±${accuracy}m`, 'loading');
    })
        .then((position) => {
            applyLiveLocation(position);
            showNotification('Exact live location captured!');
        })
        .catch((error) => {
            liveLocation = null;
            document.getElementById('locationPreview').hidden = true;

            if (error.code === 1) {
                setLocationStatus('Location permission denied. Allow GPS access or type address manually.', 'error');
            } else if (error.code === 2) {
                setLocationStatus('GPS unavailable. Try again outdoors or enter address manually.', 'error');
            } else if (error.message === 'timeout') {
                setLocationStatus('GPS timed out. Try again or enter address manually.', 'error');
            } else {
                setLocationStatus('Could not get exact location. Please type address manually.', 'error');
            }
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<span aria-hidden="true">📍</span> Get Exact Live Location';
        });
}

function formatLocationForWhatsApp({ landmark, addressManual, liveLocation: location }) {
    if (location) {
        const coords = formatCoords(location.lat, location.lng);
        let text = `📍 *Exact GPS:* ${coords}\n🗺️ *Google Maps Pin:* ${location.mapsUrl}\n📡 *Accuracy:* ±${location.accuracy}m`;
        if (landmark) text += `\n🏠 *Flat / Landmark:* ${landmark}`;
        return text;
    }

    let text = `📍 *Address:* ${addressManual}`;
    if (landmark) text += `\n🏠 *Landmark:* ${landmark}`;
    return text;
}

function generateWhatsAppMessage(name, locationInfo, phone, date, time, sauce, notes) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderItems = cart
        .map((item) => {
            const lineTotal = item.price * item.quantity;
            const priceText = item.price ? ` — ₹${lineTotal}` : ' — price on confirmation';
            return `• ${item.quantity}x ${item.name} (${item.size})${priceText}`;
        })
        .join('\n');

    return `
💪 *NEW ORDER — FitFuel Station*
-----------------------------------------
*Customer Details:*
👤 Name: ${name}
${formatLocationForWhatsApp(locationInfo)}
📞 Phone: ${phone}
⏰ Delivery: ${date} | ${time}

*Order Items:*
${orderItems}

🥫 *Sauce:* ${sauce}
-----------------------------------------
💰 *Total: ₹${subtotal}*
${notes ? `\n📝 *Notes:* ${notes}` : ''}

---
Thank you for choosing FitFuel Station! 🥗
`.trim();
}

function nextTestimonial() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth + 32;
    carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
}

function prevTestimonial() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth + 32;
    carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('toast-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function initDevModal() {
    const btn = document.getElementById('devCreditBtn');
    const modal = document.getElementById('devModal');
    const overlay = document.getElementById('devModalOverlay');
    const closeBtn = document.getElementById('devModalClose');
    if (!btn || !modal || !overlay || !closeBtn) return;

    function openDevModal() {
        modal.hidden = false;
        overlay.hidden = false;
        requestAnimationFrame(() => {
            modal.classList.add('active');
            overlay.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeDevModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        btn.focus();
        setTimeout(() => {
            modal.hidden = true;
            overlay.hidden = true;
        }, 300);
    }

    btn.addEventListener('click', openDevModal);
    closeBtn.addEventListener('click', closeDevModal);
    overlay.addEventListener('click', closeDevModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDevModal();
        }
    });
}
