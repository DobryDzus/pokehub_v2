// pri nacteni stranky spusti funkce pro aktualizaci kosiku
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    injectCartModal(); // Vloží HTML modalu do stránky
});

// ziska kosik z pameti
function getCart() {
    return JSON.parse(localStorage.getItem('pokehub_cart')) || [];
}

// ulozi kosik
function saveCart(cart) {
    localStorage.setItem('pokehub_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(id, name, price) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseInt(price),
            quantity: 1
        });
    }

    saveCart(cart);
    showAddedModal(name, price); // ukaze modal
}

// aktualizuje cislo v kosiku
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        // animace
        badge.classList.remove('pulse'); 
        void badge.offsetWidth; // trigger reflow
        badge.style.animation = 'pulse 0.5s ease';
    });
}

// 4. doprava zdarma a modal
function showAddedModal(productName, productPrice) {
    const cart = getCart();
    // spocita celkovou cenu
    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const freeShippingLimit = 5000;
    
    // vypocet procent pro progress bar
    let percentage = (totalValue / freeShippingLimit) * 100;
    if (percentage > 100) percentage = 100;

    let shippingText = '';
    let progressBarColor = 'bg-warning';

    if (totalValue >= freeShippingLimit) {
        shippingText = `<span class="text-success fw-bold"><i class="fas fa-check"></i> Dopravu máš ZDARMA!</span>`;
        progressBarColor = 'bg-success';
    } else {
        const remaining = freeShippingLimit - totalValue;
        shippingText = `Nakup ještě za <strong>${remaining} Kč</strong> a máš dopravu zdarma!`;
    }

    // vytvori obsah modalu
    const modalBody = document.getElementById('cartModalBody');
    modalBody.innerHTML = `
        <div class="text-center mb-4">
            <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
            <h4 class="mt-3">Přidáno do košíku</h4>
            <p class="text-muted">${productName}</p>
        </div>

        <div class="shipping-bar p-3 bg-light rounded">
            <p class="mb-2 small text-center">${shippingText}</p>
            <div class="progress" style="height: 10px;">
                <div class="progress-bar ${progressBarColor} progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style="width: ${percentage}%"></div>
            </div>
            <div class="d-flex justify-content-between mt-1" style="font-size: 0.7em; color: #aaa;">
                <span>0 Kč</span>
                <span>5000 Kč</span>
            </div>
        </div>
    `;

    // zobrazi modal
    const myModal = new bootstrap.Modal(document.getElementById('cartModal'));
    myModal.show();
}

// vlozeni html modalu do stranky
function injectCartModal() {
    const modalHtml = `
    <div class="modal fade" id="cartModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-bottom-0">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="cartModalBody">
                    </div>
                <div class="modal-footer border-top-0 d-flex justify-content-center gap-2 pb-4">
                    <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">
                        Pokračovat v nákupu
                    </button>
                    <a href="kosik.html" class="btn btn-danger rounded-pill px-4">
                        <i class="fas fa-shopping-cart me-2"></i>Přejít do košíku
                    </a>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// uprava mnozstvi
function updateItemQuantity(id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        // kdyz je mnozstvi mensi nebo rovno nule, odstrani polozku
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    saveCart(cart);
    // prekresli stranku
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
}

// odstraneni polozky
function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    
    saveCart(cart);
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
}