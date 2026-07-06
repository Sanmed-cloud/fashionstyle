let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

const categoryAliases = {
    accesorios: "Accessories",
    accessories: "Accessories",
    bolsos: "Bags",
    bags: "Bags",
    joyería: "Jewelry",
    joyeria: "Jewelry",
    jewelry: "Jewelry",
    mujer: "Woman",
    woman: "Woman",
    hombre: "Man",
    man: "Man",
    dormitorio: "Dormitorio"
};

function normalizeCategory(value) {
    if (!value) return "";
    const normalized = String(value).trim().toLowerCase();
    return categoryAliases[normalized] || value;
}

getData();

async function getData(category = null) {
    let response = await fetch('json/products.json');
    let json = await response.json();
    productsContainer = json;

    const normalizedCategory = normalizeCategory(category);
    if (normalizedCategory) {
        productsContainer = productsContainer.filter(product => normalizeCategory(product.category) === normalizedCategory);
    }

    displayProducts();
}

function displayProducts() {
    let container = ``;

    if (productsContainer.length === 0) {
        document.getElementById("productCount").innerHTML = "0 productos";
        document.querySelector('.products .content').innerHTML = `
            <p class="no-products">No hay productos disponibles en esta categoría.</p>`;
        return;
    }

    for (let i = 0; i < productsContainer.length; i++) {
        container += `
        <div class="product-card" data-id="${productsContainer[i].id}">
        <div class="card-img">
            <img  onclick=displayDetails(${productsContainer[i].id});
             src=${productsContainer[i].images[0]}
             alt=${productsContainer[i].name}>
            <a href=""  class="addToCart">
                <ion-icon name="cart-outline" class="Cart"></ion-icon>
            </a>
        </div>
        <div class="card-info">
             <h4 class="product-name" onclick=displayDetails(${productsContainer[i].id});>${productsContainer[i].name}</h4>
             <h5 class="product-price">${productsContainer[i].price}</h5>
        </div>
    </div>`;
    }

    document.getElementById("productCount").innerHTML = `${productsContainer.length} producto${productsContainer.length === 1 ? '' : 's'}`;
    document.querySelector('.products .content').innerHTML = container;

    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                addToCart(id_product);
            }
        });
    });
}

function getCategory(e) {
    const link = e.currentTarget || e.target.closest('.categories_link');
    if (!link) return;

    const category = link.getAttribute('productCategory');
    setActiveLink(link);
    try {
        getData(category);
    } catch (error) {
        console.log("No se encontró", error);
    }

    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(function (element) {
    element.addEventListener('click', getCategory);
});

function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}
