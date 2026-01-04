document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('etb-list');
    
    try {
        const response = await fetch('../data/produkty.json');
        const data = await response.json();
        
        container.innerHTML = '';

        // pole, jen single-boostery
        const products = Object.entries(data).filter(([key, product]) => product.type === 'single_booster');

        if (products.length === 0) {
            container.innerHTML = '<p class="text-center">Momentálně nejsou k dispozici žádné Single Boostery.</p>';
            return;
        }

        products.forEach(([id, product]) => {
            let badgeHtml = '';
            if (product.presell) {
                badgeHtml = `<div class="product-badge" style="background: linear-gradient(135deg, #ff6b6b, #ff8787);">Předprodej</div>`;
            } else if (product.soon) {
                badgeHtml = `<div class="product-badge" style="background: linear-gradient(135deg, #4a9eff, #6ab0ff);">Brzy skladem</div>`;
            } else if (product.stock && product.instock > 0) {
                badgeHtml = `<div class="product-badge" style="background: linear-gradient(135deg, #28a745, #34ce57);">Skladem</div>`;
            } else if (!product.stock || product.instock === 0) {
                badgeHtml = `<div class="product-badge" style="background: linear-gradient(135deg, #6c757d, #868e96);">Není skladem</div>`;
            }

            let priceHtml = '';
            if (product.oldPrice && product.oldPrice !== "") {
                priceHtml = `
                    <p class="card-text product-price sedasleva">${product.oldPrice} Kč</p>
                    <p class="card-text product-price sleva">${product.price} Kč</p>
                `;
            } else {
                priceHtml = `<p class="card-text product-price">${product.price} Kč</p>`;
            }

            const imgPath = `../${product.img}`;

            const cardHtml = `
                <div class="col">
                    <div class="card h-100 product-card" onclick="location.href = '../produkt?id=${id}'">
                        <div style="position: relative;">
                            ${badgeHtml}
                            <img src="${imgPath}" class="card-img-top product-image" alt="${product.name}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title product-name">${product.name}</h5>
                            <div class="price-container">
                                ${priceHtml}
                            </div>
                            <button class="btn add-to-cart-btn w-100" onclick="event.stopPropagation(); addToCart('${id}', '${product.name}', ${product.price})">Do košíku</button>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error('Chyba při načítání produktů:', error);
        container.innerHTML = '<div class="alert alert-danger w-100 text-center">Nepodařilo se načíst produkty. Zkuste to prosím později.</div>';
    }
});