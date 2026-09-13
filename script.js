/* =========================================================
   JL SHOES — JAVASCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

/*
    IMPORTANT:

    Replace these two values with your own Supabase project
    information.

    Do NOT put your Supabase service_role key here.

    Use the public/publishable key.
*/

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

let supabaseClient = null;

if (
    SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
    SUPABASE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY"
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
    {
        id: "JL-green",
        name: "JL Everyday Sneaker",
        color: "Sage Green",
        category: "green",
        price: 1199,
        image: "images/gray.jpg",
        description:
            "A clean sage green JL sneaker designed for everyday comfort and versatile style."
    },

    {
        id: "JL-blue",
        name: "JL Everyday Sneaker",
        color: "Sky Blue",
        category: "blue",
        price: 1199,
        image: "images/blue.jpg",
        description:
            "A fresh sky blue JL sneaker made for casual days and everyday movement."
    },

    {
        id: "JL-PINK",
        name: "JL Everyday Sneaker",
        color: "Blush Pink",
        category: "pink",
        price: 1199,
        image: "images/pink.png",
        description:
            "A soft blush pink colorway combining clean design with everyday comfort."
    },

    {
        id: "JL-RED",
        name: "JL Everyday Sneaker",
        color: "Red",
        category: "red",
        price: 1199,
        image: "images/red.png",
        description:
            "A bold red JL sneaker made to add character to your everyday style."
    },

    {
        id: "JL-WBR",
        name: "JL Everyday Sneaker",
        color: "Sand Beige",
        category: "neutral",
        price: 1199,
        image: "images/wbr.jpg",
        description:
            "A classic navy blue JL sneaker designed for everyday outfits."
    },

    {
        id: "JL-Black",
        name: "JL Everyday Sneaker",
        color: "Black",
        category: "black",
        price: 1199,
        image: "images/wb.jpg",
        description:
            "A clean black JL sneaker with a simple and timeless look."
    },

    
];


/* =========================================================
   STATE
========================================================= */

let cart = JSON.parse(
    localStorage.getItem("jlCart")
) || [];

let currentProduct = null;
let selectedSize = null;
let modalQuantity = 1;
let currentFilter = "all";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productsGrid =
    document.getElementById("productsGrid");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const cartTotal =
    document.getElementById("cartTotal");

const productModal =
    document.getElementById("productModal");

const checkoutModal =
    document.getElementById("checkoutModal");

const successModal =
    document.getElementById("successModal");

const toast =
    document.getElementById("toast");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(price);
}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const filteredProducts =
        products.filter(product => {

            const matchesFilter =
                currentFilter === "all" ||
                product.category === currentFilter;

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                product.color
                    .toLowerCase()
                    .includes(searchTerm);

            return matchesFilter && matchesSearch;
        });


    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No JL shoes found.</h3>
                <p>Try another search or color.</p>
            </div>
        `;

        return;
    }


    productsGrid.innerHTML =
        filteredProducts.map(product => `

            <article class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="JL ${product.color} sneakers"
                        loading="lazy"
                    >

                    <span class="product-tag">
                        JL
                    </span>

                </div>


                <div class="product-info">

                    <span class="product-color">
                        ${product.color}
                    </span>

                    <h3 class="product-name">
                        ${product.name}
                    </h3>

                    <div class="rating">
                        ★★★★★
                        <span>5.0</span>
                    </div>

                    <p class="product-price">
                        ${formatPrice(product.price)}
                    </p>


                    <div class="product-actions">

                        <button
                            class="view-product"
                            onclick="openProductDetails('${product.id}')"
                        >
                            VIEW DETAILS
                        </button>

                        <button
                            class="quick-add"
                            onclick="quickAdd('${product.id}')"
                        >
                            ADD
                        </button>

                    </div>

                </div>

            </article>

        `).join("");
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        displayProducts();
    });

});


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    displayProducts
);


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function openProductDetails(productId) {

    currentProduct =
        products.find(
            product => product.id === productId
        );

    if (!currentProduct) {
        return;
    }

    selectedSize = null;
    modalQuantity = 1;

    document.getElementById(
        "modalProductImage"
    ).src = currentProduct.image;

    document.getElementById(
        "modalProductImage"
    ).alt =
        `JL ${currentProduct.color} sneakers`;

    document.getElementById(
        "modalProductName"
    ).textContent =
        currentProduct.name;

    document.getElementById(
        "modalProductColor"
    ).textContent =
        currentProduct.color;

    document.getElementById(
        "modalProductPrice"
    ).textContent =
        formatPrice(currentProduct.price);

    document.getElementById(
        "modalProductDescription"
    ).textContent =
        currentProduct.description;

    document.getElementById(
        "modalQuantity"
    ).textContent = "1";

    document.getElementById(
        "sizeError"
    ).style.display = "none";


    document.querySelectorAll(
        "#sizeOptions button"
    ).forEach(button => {
        button.classList.remove("selected");
    });


    productModal.classList.add("active");

    document.body.classList.add("no-scroll");
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

document.getElementById(
    "closeProductModal"
).addEventListener("click", () => {

    productModal.classList.remove("active");

    document.body.classList.remove("no-scroll");
});


/* =========================================================
   SIZE SELECTION
========================================================= */

document.querySelectorAll(
    "#sizeOptions button"
).forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(
            "#sizeOptions button"
        ).forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedSize =
            button.dataset.size;

        document.getElementById(
            "sizeError"
        ).style.display = "none";
    });

});


/* =========================================================
   MODAL QUANTITY
========================================================= */

document.getElementById(
    "modalMinus"
).addEventListener("click", () => {

    if (modalQuantity > 1) {
        modalQuantity--;

        document.getElementById(
            "modalQuantity"
        ).textContent = modalQuantity;
    }

});


document.getElementById(
    "modalPlus"
).addEventListener("click", () => {

    modalQuantity++;

    document.getElementById(
        "modalQuantity"
    ).textContent = modalQuantity;
});


/* =========================================================
   ADD TO CART FROM MODAL
========================================================= */

document.getElementById(
    "modalAddToCart"
).addEventListener("click", () => {

    if (!selectedSize) {

        document.getElementById(
            "sizeError"
        ).style.display = "block";

        return;
    }

    addToCart(
        currentProduct,
        selectedSize,
        modalQuantity
    );

    productModal.classList.remove("active");

    document.body.classList.remove("no-scroll");

    openCart();
});


/* =========================================================
   QUICK ADD
========================================================= */

function quickAdd(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    currentProduct = product;

    openProductDetails(productId);
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    product,
    size,
    quantity = 1
) {

    const existingItem =
        cart.find(item =>
            item.productId === product.id &&
            item.size === size
        );


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({

            cartId:
                Date.now() +
                Math.random(),

            productId: product.id,

            name: product.name,

            color: product.color,

            size: size,

            price: product.price,

            image: product.image,

            quantity: quantity
        });

    }


    saveCart();

    renderCart();

    showToast(
        `${product.color} added to your cart.`
    );
}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "jlCart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const itemCount =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        itemCount;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add a pair of JL shoes
                    to get started.
                </p>

            </div>
        `;

    } else {

        cartItems.innerHTML =
            cart.map(item => `

                <div class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.color} ·
                            Size ${item.size}
                        </p>

                        <div class="cart-quantity">

                            <button
                                onclick="decreaseQuantity('${item.cartId}')"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="increaseQuantity('${item.cartId}')"
                            >
                                +
                            </button>

                        </div>

                        <button
                            class="remove-cart"
                            onclick="removeFromCart('${item.cartId}')"
                        >
                            REMOVE
                        </button>

                    </div>


                    <div class="cart-item-price">
                        ${formatPrice(
                            item.price *
                            item.quantity
                        )}
                    </div>

                </div>

            `).join("");
    }


    const subtotal =
        calculateCartTotal();

    cartSubtotal.textContent =
        formatPrice(subtotal);

    cartTotal.textContent =
        formatPrice(subtotal);
}


/* =========================================================
   CART TOTAL
========================================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            item.price *
            item.quantity,
        0
    );
}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(cartId) {

    const item =
        cart.find(
            item =>
                String(item.cartId) ===
                String(cartId)
        );

    if (!item) {
        return;
    }

    item.quantity++;

    saveCart();

    renderCart();

    renderCheckout();
}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(cartId) {

    const item =
        cart.find(
            item =>
                String(item.cartId) ===
                String(cartId)
        );

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart =
            cart.filter(
                item =>
                    String(item.cartId) !==
                    String(cartId)
            );
    }

    saveCart();

    renderCart();

    renderCheckout();
}


/* =========================================================
   REMOVE
========================================================= */

function removeFromCart(cartId) {

    cart =
        cart.filter(
            item =>
                String(item.cartId) !==
                String(cartId)
        );

    saveCart();

    renderCart();

    renderCheckout();

    showToast("Item removed.");
}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    cartDrawer.classList.add("active");

    overlay.classList.add("active");

    document.body.classList.add("no-scroll");
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    cartDrawer.classList.remove("active");

    overlay.classList.remove("active");

    document.body.classList.remove("no-scroll");
}


document.getElementById(
    "openCartBtn"
).addEventListener(
    "click",
    openCart
);


document.getElementById(
    "closeCartBtn"
).addEventListener(
    "click",
    closeCart
);


overlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   CHECKOUT
========================================================= */

document.getElementById(
    "checkoutBtn"
).addEventListener("click", () => {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }

    closeCart();

    renderCheckout();

    checkoutModal.classList.add("active");

    document.body.classList.add("no-scroll");
});


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

document.getElementById(
    "closeCheckoutModal"
).addEventListener("click", () => {

    checkoutModal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "no-scroll"
    );
});


/* =========================================================
   RENDER CHECKOUT
========================================================= */

function renderCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );

    checkoutItems.innerHTML =
        cart.map(item => `

            <div class="checkout-item">

                <span>
                    ${item.name}
                    <br>
                    ${item.color}
                    · Size ${item.size}
                    · ×${item.quantity}
                </span>

                <span>
                    ${formatPrice(
                        item.price *
                        item.quantity
                    )}
                </span>

            </div>

        `).join("");


    const total =
        calculateCartTotal();

    document.getElementById(
        "checkoutSubtotal"
    ).textContent =
        formatPrice(total);

    document.getElementById(
        "checkoutTotal"
    ).textContent =
        formatPrice(total);
}


/* =========================================================
   PLACE ORDER
========================================================= */

document.getElementById(
    "checkoutForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (cart.length === 0) {

            showToast(
                "Your cart is empty."
            );

            return;
        }


        const customer = {

            name:
                document.getElementById(
                    "customerName"
                ).value.trim(),

            email:
                document.getElementById(
                    "customerEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "customerPhone"
                ).value.trim(),

            address:
                document.getElementById(
                    "customerAddress"
                ).value.trim(),

            city:
                document.getElementById(
                    "customerCity"
                ).value.trim(),

            province:
                document.getElementById(
                    "customerProvince"
                ).value.trim(),

            postal:
                document.getElementById(
                    "customerPostal"
                ).value.trim(),

            payment:
                document.getElementById(
                    "paymentMethod"
                ).value
        };


        const orderNumber =
            createOrderNumber();


        const orderData = {

            order_number: orderNumber,

            customer_name: customer.name,

            email: customer.email,

            phone: customer.phone,

            address: customer.address,

            city: customer.city,

            province: customer.province,

            postal_code: customer.postal,

            payment_method: customer.payment,

            total_amount:
                calculateCartTotal(),

            status: "Pending"
        };


        try {

            if (supabaseClient) {

                const {
                    data: order,
                    error: orderError
                } = await supabaseClient
                    .from("orders")
                    .insert(orderData)
                    .select()
                    .single();


                if (orderError) {
                    throw orderError;
                }


                const orderItems =
                    cart.map(item => ({

                        order_id: order.id,

                        product_id:
                            item.productId,

                        product_name:
                            item.name,

                        color:
                            item.color,

                        size:
                            item.size,

                        quantity:
                            item.quantity,

                        price:
                            item.price
                    }));


                const {
                    error: itemError
                } = await supabaseClient
                    .from("order_items")
                    .insert(orderItems);


                if (itemError) {
                    throw itemError;
                }

            } else {

                console.warn(
                    "Supabase is not configured. Order was only simulated locally."
                );

            }


            document.getElementById(
                "orderNumber"
            ).textContent =
                orderNumber;


            cart = [];

            saveCart();

            renderCart();

            this.reset();

            checkoutModal.classList.remove(
                "active"
            );

            successModal.classList.add(
                "active"
            );


        } catch (error) {

            console.error(error);

            showToast(
                "Something went wrong while placing your order."
            );

        }

    }
);


/* =========================================================
   ORDER NUMBER
========================================================= */

function createOrderNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `JL-${year}-${random}`;
}


/* =========================================================
   SUCCESS MODAL
========================================================= */

document.getElementById(
    "continueShoppingBtn"
).addEventListener("click", () => {

    successModal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    window.location.href = "#shop";
});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mobileNav =
    document.getElementById(
        "mobileNav"
    );


mobileMenuBtn.addEventListener(
    "click",
    () => {

        mobileNav.classList.toggle(
            "active"
        );

    }
);


mobileNav.querySelectorAll(
    "a"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            mobileNav.classList.remove(
                "active"
            );

        }
    );

});


/* =========================================================
   TOAST MESSAGE
========================================================= */

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);
}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            productModal.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "no-scroll"
            );

        }

    }
);


checkoutModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            checkoutModal
        ) {

            checkoutModal.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "no-scroll"
            );

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

displayProducts();

renderCart();