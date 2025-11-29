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
                } else {
                    document.getElementById('product-container').innerHTML = '<p>Produkt nebyl nalezen.</p>';
                }
            })
            .catch(error => {
                console.error('Chyba při načítání produktů:', error);
                document.getElementById('product-container').innerHTML = '<p>Došlo k chybě při načítání produktu.</p>';
            });