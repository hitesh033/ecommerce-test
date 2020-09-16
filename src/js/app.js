var products = {
    1: {
        name: "Dining Table",
        desc: "Table & Chairs",
        img: "../../assets/images/table1.jpg",
        price: 2034
    },
    2: {
        name: "Table",
        desc: "Table & Chairs",
        img: "../../assets/images/table2.jpg",
        price: 1247
    },
    3: {
        name: "Sofa",
        desc: "Lounge",
        img: "../../assets/images/sofa2.jpg",
        price: 675
    },
    4: {
        name: "Sofa set",
        desc: "Lounge",
        img: "../../assets/images/sofa3.jpg",
        price: 842
    },
    5: {
        name: "Sofa with table",
        desc: "Lounge",
        img: "../../assets/images/sofa4.jpg",
        price: 842
    }
};

/* PRODUCTS HTML GRID GENERATOR */
window.addEventListener("load", function () {
    var container = document.getElementById("cart-products"),
        item = null, part = null;
    for (let i in products) {
        item = document.createElement("div");
        item.classList.add("p-item", "col-md-4");

        // Product Image
        partDiv = document.createElement("div");
        part = document.createElement("img");
        partDiv.appendChild(part);
        part.src = products[i]['img'];
        partDiv.classList.add("img-div");
        part.classList.add("p-img");
        item.appendChild(partDiv);

        // Product Name
        part = document.createElement("div");
        part.innerHTML = products[i]['name'];
        part.classList.add("p-name");
        item.appendChild(part);

        // Product Price
        part = document.createElement("div");
        part.innerHTML = "$" + products[i]['price'];
        part.classList.add("p-price");
        item.appendChild(part);

        // Product Description
        part = document.createElement("div");
        part.innerHTML = products[i]['desc'];
        part.classList.add("p-desc");
        item.appendChild(part);

        // Add to cart
        const cartIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                            <path fill-rule="evenodd" d="M8.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 .5-.5z"/>
                            </svg>`;

        part = document.createElement("a");
        part.href = "javascript:void(0)";
        part.innerHTML = cartIcon;
        part.classList.add("p-add");
        part.onclick = cart.add;
        part.dataset.id = i;
        item.appendChild(part);

        container.appendChild(item);
    }
});

/* SHOPPING CART */
var cart = {
    data: null, // current shopping cart

    /* [C1] LOCALSTORAGE */
    load: function () {
        // load() : load previous shopping cart

        cart.data = localStorage.getItem("cart");
        if (cart.data == null) { cart.data = {}; }
        else { cart.data = JSON.parse(cart.data); }
    },

    save: function () {
        // save() : save current cart

        localStorage.setItem("cart", JSON.stringify(cart.data));
    },

    gotoCart: function () {
        document.getElementById('cart-list').style.display = "flex";
        document.getElementById('products').style.display = "none";
    },

    gotoProductsPage: function() {
        document.getElementById('cart-list').style.display = "none";
        document.getElementById('products').style.display = "flex";
    },

    /* CART ACTIONS */
    add: function () {
        // Update current cart
        if (cart.data[this.dataset.id] == undefined) {
            var product = products[this.dataset.id];
            cart.data[this.dataset.id] = {
                name: product['name'],
                desc: product['desc'],
                img: product['img'],
                price: product['price'],
                qty: 1
            };
        } else {
            cart.data[this.dataset.id]['qty']++;
        }

        // Save local storage + HTML update
        cart.save();
        cart.list();
    },

    list: function () {
        // list() : update HTML

        var container = document.getElementById("cart-list"),
            item = null, part = null, product = null;
        container.innerHTML = "";

        // Empty cart
        var isempty = function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) { return false; }
            }
            return true;
        };
        if (isempty(cart.data)) {
            item = document.createElement("div");
            item.innerHTML = "Cart is empty";
            container.appendChild(item);
        }

        // Not empty
        else {
            // List items
            var total = 0, subtotal = 0;
            for (var i in cart.data) {
                item = document.createElement("div");
                item.classList.add("c-item", "col-md-12");
                product = cart.data[i];

                // Quantity
                part = document.createElement("input");
                part.type = "number";
                part.value = product['qty'];
                part.dataset.id = i;
                part.classList.add("c-qty");
                part.addEventListener("change", cart.change);
                item.appendChild(part);

                // Name
                part = document.createElement("span");
                part.innerHTML = product['name'];
                part.classList.add("c-name");
                item.appendChild(part);

                // Subtotal
                subtotal = product['qty'] * product['price'];
                total += subtotal;

                container.appendChild(item);
            }

            // EMPTY BUTTONS
            item = document.createElement("input");
            item.type = "button";
            item.value = "Empty";
            item.addEventListener("click", cart.reset);
            item.classList.add("c-empty");
            container.appendChild(item);

            // CHECKOUT BUTTONS
            item = document.createElement("input");
            item.type = "button";
            item.value = "Checkout - " + "$" + total;
            item.addEventListener("click", cart.checkout);
            item.classList.add("c-checkout");
            container.appendChild(item);
        }
    },

    change: function () {
        // change() : change quantity

        if (this.value == 0) {
            delete cart.data[this.dataset.id];
        } else {
            cart.data[this.dataset.id]['qty'] = this.value;
        }
        cart.save();
        cart.list();
    },

    reset: function () {
        // reset() : empty cart

        if (confirm("Empty cart?")) {
            cart.data = {};
            cart.save();
            cart.list();
        }
    },

    checkout: function () {
        console.log("TODO");
    }
};

// Load previous cart and update HTML on load
window.addEventListener("load", function () {
    cart.load();
    cart.list();
});