function secondimg(odkaz, element){
    element.src = odkaz;
}

function resetimg(odkaz, element){
    element.src = odkaz;
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
    const map = new google.maps.Map(document.getElementById("map"),
     {
      center: { lat: 50.108, lng: 14.584 },
      zoom: 14,
      mapId: "3f84587718826a6",
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    });

    const contentstring = 
    `<div class="info-window">` +
      `<p>Chlumecká 765/6, 198 19 Praha 9</p>` +
      `<a href="https://maps.app.goo.gl/YC3GVb49LeAVu9vH8">Navigovat</a>` +
      `<img class="wcm_foto" src="img/misc/WCM.webp">` +
    `</div>`;
    

    const infowindow = new google.maps.InfoWindow({
      content: contentstring,
    });

    const marker = new AdvancedMarkerElement({
      position: { lat: 50.108, lng: 14.584 },
      map,

    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  }
  
  
  window.initMap = initMap;

// prida badge k produktu na zaklade stavu skladu
async function addProductBadges() {
    try {
        const response = await fetch('data/produkty.json');
        const data = await response.json();
        
        const productCards = document.querySelectorAll('[data-product-id]');
        
        productCards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            const product = data[productId];
            
            if (!product) return;
            
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
            
            if (badgeHtml) {
                const firstImg = card.querySelector('img');
                if (firstImg) {
                    firstImg.insertAdjacentHTML('beforebegin', badgeHtml);
                }
            }
        });
    } catch (error) {
        console.error('Chyba při načítání produktů:', error);
    }
}

document.addEventListener('DOMContentLoaded', addProductBadges);