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
            imgElement.onload = function(){
                $(this).blowup({
                    "scale": 1,
                })
            }
            
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
            badgeHtml = `<div class="product-badge">Předprodej</div>`;
        }
        
        col.innerHTML = `
            <div class="card h-100 product-card" onclick="location.href = 'produkt.html?id=${id}'">
                ${badgeHtml}
                <img src="${product.img}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title product-name">${product.name}</h5>
                    ${cenaHtml}
                    <a href="#" class="btn add-to-cart-btn" onclick="event.stopPropagation();">Do košíku</a>
                </div>
            </div>
        `;
        
        relatedContainer.appendChild(col);
    });
}