const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch('data/produkty.json')
    .then(response => {
        return response.json();
    })
    .then(productsDb => {
        const product = productsDb[productId];

        if (product) {
            const imgElement = document.getElementById('detail-img');
            imgElement.src = product.img;
            document.getElementById('detail-title').textContent = product.name;
            document.getElementById('detail-price').textContent = product.price + ' Kč';
            if (product.oldPrice) {
                document.getElementById('detail-old-price').textContent = product.oldPrice + ' Kč';
            }
            document.getElementById('detail-desc').textContent = product.desc;            
            // info o skladu badge
            const skladBadge = document.getElementById('stock-badge');
            if (product.presell) {
                skladBadge.innerHTML = '<span class="badge bg-warning text-dark fs-6"><i class="fas fa-clock me-2"></i>Předprodej</span>';
            } else if (product.soon) {
                skladBadge.innerHTML = '<span class="badge bg-info text-dark fs-6"><i class="fas fa-hourglass-half me-2"></i>Brzy skladem</span>';
            } else if (product.stock) {
                skladBadge.innerHTML = '<span class="badge bg-success fs-6"><i class="fas fa-check-circle me-2"></i>Skladem</span>';
            } else {
                skladBadge.innerHTML = '<span class="badge bg-danger fs-6"><i class="fas fa-times-circle me-2"></i>Není skladem</span>';
            }
            
            // info o skladu
            const skladInfo = document.getElementById('stock-info');
            let skladInfoHtml = '';
            
            if (product.presell) {
                skladInfoHtml = '<div class="alert alert-warning" role="alert"><i class="fas fa-info-circle me-2"></i>Tento produkt je v předprodeji. Odesíláme po oficiálním vydání.</div>';
            } else if (product.soon) {
                skladInfoHtml = '<div class="alert alert-info" role="alert"><i class="fas fa-info-circle me-2"></i>Tento produkt očekáváme brzy na sklad.</div>';
            } else if (product.stock && product.instock > 0) {
                const deliveryText = "Doručení do 2-3 pracovních dnů.";
                skladInfoHtml = `
                    <div class="sklad-details">
                        <p class="mb-1"><i class="fas fa-box me-2 text-success"></i><strong>Počet kusů skladem:</strong> ${product.instock}</p>
                        <p class="mb-0"><i class="fas fa-shipping-fast me-2 text-primary"></i><strong>Dodání:</strong> ${deliveryText}</p>
                    </div>
                `;
            } else if (!product.stock) {
                skladInfoHtml = '<div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle me-2"></i>Produkt není momentálně dostupný.</div>';
            }
            
            skladInfo.innerHTML = skladInfoHtml;
            imgElement.onload = function(){
                $(this).blowup({
                    "scale": 1,
                })
            }
            
            // nastav onclick pro hlavni tlacitko Do kosiku
            const addToCartBtn = document.getElementById('add-to-cart-main');
            addToCartBtn.onclick = function() {
                addToCart(productId, product.name, parseInt(product.price));
            };
            
            // nacte produkty
            loadRelatedProducts(productsDb, productId);
        } else {
            document.getElementById('product-container').innerHTML = '<p>Produkt nebyl nalezen.</p>';
        }
    })
    .catch(error => {
        console.error('Chyba při načítání produktů:', error);
        document.getElementById('product-container').innerHTML = '<p>Došlo k chybě při načítání produktu.</p>';
    });

function loadRelatedProducts(productsDb, currentProductId) {
    const relatedContainer = document.getElementById('related-products');
    
    // ziska vsechny id krome aktualniho produktu
    const allProductIds = Object.keys(productsDb).filter(id => id !== currentProductId);
    
    // tahle vecicka to promicha a vezme prvni 4
    const shuffled = allProductIds.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 4);
    
    selectedIds.forEach(id => {
        const product = productsDb[id];
        const col = document.createElement('div');
        col.className = 'col';
        
        let cenaHtml = '';
        if (product.oldPrice) {
            cenaHtml = `
                <div class="price-container">
                    <p class="card-text product-price sedasleva">${product.oldPrice} Kč</p>
                    <p class="card-text product-price sleva">${product.price} Kč</p>
                </div>`;
        } else {
            cenaHtml = `<p class="card-text product-price">${product.price} Kč</p>`;
        }
        
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
        
        col.innerHTML = `
            <div class="card h-100 product-card" onclick="location.href = 'produkt?id=${id}'">
                ${badgeHtml}
                <img src="${product.img}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title product-name">${product.name}</h5>
                    ${cenaHtml}
                    <button class="btn add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${id}', '${product.name}', ${product.price})">Do košíku</button>
                </div>
            </div>
        `;
        
        relatedContainer.appendChild(col);
    });
}