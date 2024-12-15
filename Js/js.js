function api(method = 'GET', url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url);
    xmlHttp.send();

    xmlHttp.addEventListener('readystatechange', function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            var jsonData = JSON.parse(xmlHttp.responseText);
            var htmlProductView = document.getElementById('productView');
            var navBarDDMenu = document.getElementById('categoryMenu');
            var htmlCollections = ``;
            var navBarCollections = ``;
            var categoryTypes = {};

            for (var product of jsonData) {
                if (!categoryTypes[product.category]) {
                    categoryTypes[product.category] = [];
                }
                categoryTypes[product.category].push(product);
            }


            for (var category in categoryTypes) {
                navBarCollections += `
                    <li><a class="dropdown-item text-capitalize" href="#${category}">${category}</a></li>`;

                htmlCollections += `
                    <div class="mb-4">
                        <h1 class="fs-3 text-capitalize" id="${category}">${category}</h1>
                        <div class="row">`;

                for (const product of categoryTypes[category]) {
                    htmlCollections += `
                        <div class="col-md-6 mb-3">
                            <div class="light-hover-div p-2 card card-body overflow-hidden text-bg-dark">
                                <div class="overflow-hidden">
                                    <h3 class="light-hover2 text-center card-header border-0">${product.title}</h3>
                                    <div class="overflow-hidden w-100 d-flex justify-content-center">
                                        <img src="${product.image}" alt="${product.title}" data-id="${product.id}" loading="lazy"
                                        class="p-image shadow clickable-img">
                                    </div>
                                    <h4 class="light-hover"><strong>Price: </strong>${product.price} $</h4>
                                    <div class="d-flex justify-content-between">
                                        <p class="light-hover"><strong>Rating: </strong>${getStarIcons(product.rating.rate)} <small>(${product.rating.rate})</small></p>
                                        <p class="light-hover"><strong>Rated: </strong>${product.rating.count} times</p>
                                    </div>
                                    <p class="light-hover"><strong>Description: </strong>${product.description}</p>
                                </div>
                            </div>
                        </div>`;
                }

                htmlCollections += `
                        </div> <!-- Close row -->
                    </div> <!-- Close category -->`;
            }

            htmlProductView.innerHTML = htmlCollections;
            navBarDDMenu.innerHTML = navBarCollections;
        }
    });
}

function getStarIcons(rate) {
    var fullStars = Math.floor(rate);
    var halfStar = rate % 1 >= 0.5 ? 1 : 0;
    var emptyStars = 5 - fullStars - halfStar;

    var stars = '';

    for (var i = 0; i < fullStars; i++) {
        stars += '<i class="fa-solid fa-star text-warning"></i>';
    }

    if (halfStar) {
        stars += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
    }

    for (var i = 0; i < emptyStars; i++) {
        stars += '<i class="fa-regular fa-star text-warning"></i>';
    }

    return stars;
}


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('clickable-img')) {
        var productId = event.target.getAttribute('data-id');
        var productImageSrc = event.target.src;

        var selectImgContainer = document.querySelector('#selectImg img');
        selectImgContainer.src = productImageSrc;
        selectImgContainer.alt = `Product ID: ${productId}`;

        document.getElementById('closeBtn').style.display = 'block';
        document.getElementById('selectImg').style.display = 'block';
    }
});

var closeButton = document.getElementById('closeBtn');
closeButton.addEventListener('click', function () {
    var selectImgContainer = document.querySelector('#selectImg img');
    selectImgContainer.src = '';
    selectImgContainer.alt = '';

    document.getElementById('closeBtn').style.display = 'none';
    document.getElementById('selectImg').style.display = 'none';
});

api('GET', 'https://fakestoreapi.com/products');
