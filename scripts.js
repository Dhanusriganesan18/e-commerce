let textoPesquisa = "";
let categoriaAtual = "all";
let cart = [];
let produtos = [];

const SHIPPING_COST = 25;

const categoryArtwork = {
    smartphones: {
        bg1: "#dbeafe",
        bg2: "#bfdbfe",
        stroke: "#1d4ed8",
        label: "Smartphone",
        shape: `
            <rect x="248" y="80" width="104" height="190" rx="18" fill="#eff6ff" stroke="#1d4ed8" stroke-width="10"/>
            <rect x="264" y="106" width="72" height="124" rx="10" fill="#bfdbfe"/>
            <circle cx="300" cy="250" r="8" fill="#1d4ed8"/>
        `
    },
    laptops: {
        bg1: "#dbeafe",
        bg2: "#cbd5e1",
        stroke: "#1e3a8a",
        label: "Laptop",
        shape: `
            <rect x="190" y="95" width="220" height="128" rx="14" fill="#eff6ff" stroke="#1e3a8a" stroke-width="10"/>
            <rect x="210" y="115" width="180" height="88" rx="8" fill="#bfdbfe"/>
            <path d="M160 248h280l26 28H134z" fill="#94a3b8" stroke="#1e3a8a" stroke-width="8" stroke-linejoin="round"/>
        `
    },
    headphones: {
        bg1: "#ede9fe",
        bg2: "#dbeafe",
        stroke: "#4338ca",
        label: "Headphones",
        shape: `
            <path d="M220 196a80 80 0 0 1 160 0" fill="none" stroke="#4338ca" stroke-width="18" stroke-linecap="round"/>
            <rect x="196" y="186" width="36" height="82" rx="18" fill="#c7d2fe" stroke="#4338ca" stroke-width="10"/>
            <rect x="368" y="186" width="36" height="82" rx="18" fill="#c7d2fe" stroke="#4338ca" stroke-width="10"/>
        `
    },
    accessories: {
        bg1: "#dcfce7",
        bg2: "#dbeafe",
        stroke: "#047857",
        label: "Accessory",
        shape: `
            <rect x="205" y="112" width="78" height="78" rx="16" fill="#ecfdf5" stroke="#047857" stroke-width="10"/>
            <rect x="317" y="112" width="78" height="78" rx="16" fill="#ecfdf5" stroke="#047857" stroke-width="10"/>
            <path d="M244 210v46M356 210v46M244 233h112" stroke="#047857" stroke-width="10" stroke-linecap="round"/>
        `
    },
    smartwatches: {
        bg1: "#fee2e2",
        bg2: "#dbeafe",
        stroke: "#be123c",
        label: "Smartwatch",
        shape: `
            <rect x="258" y="58" width="84" height="56" rx="20" fill="#fecdd3"/>
            <rect x="258" y="286" width="84" height="56" rx="20" fill="#fecdd3"/>
            <rect x="226" y="108" width="148" height="176" rx="32" fill="#fff1f2" stroke="#be123c" stroke-width="10"/>
            <circle cx="300" cy="196" r="42" fill="#fecdd3"/>
            <path d="M300 168v28l20 14" stroke="#be123c" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        `
    }
};

function criarImagemCategoria(categoria, nome) {
    const artwork = categoryArtwork[categoria] || {
        bg1: "#dbe6f3",
        bg2: "#cbd5e1",
        stroke: "#334155",
        label: "TechStore",
        shape: `<circle cx="300" cy="178" r="54" fill="#e2e8f0" stroke="#334155" stroke-width="10"/>`
    };

    const shortName = nome.length > 26 ? `${nome.slice(0, 23)}...` : nome;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${artwork.bg1}"/>
                    <stop offset="100%" stop-color="${artwork.bg2}"/>
                </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#bg)"/>
            ${artwork.shape}
            <text x="50%" y="315" text-anchor="middle"
                font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="${artwork.stroke}">
                ${artwork.label}
            </text>
            <text x="50%" y="347" text-anchor="middle"
                font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="${artwork.stroke}">
                ${shortName}
            </text>
        </svg>
    `);
}

const fallbackProducts = [
    {
        id: 1,
        nome: "iPhone 15 Pro Max",
        categoria: "smartphones",
        preco: 7999,
        precoOriginal: 8999,
        desconto: 11,
        imagem: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
        descricao: "Apple premium smartphone with an advanced camera, A17 Pro chip, and titanium design."
    },
    {
        id: 2,
        nome: "MacBook Air M2",
        categoria: "laptops",
        preco: 8999,
        precoOriginal: 10999,
        desconto: 18,
        imagem: "https://www.apple.com/newsroom/images/product/mac/standard/Apple-WWDC22-MacBook-Air-hero-220606_big.jpg.large.jpg",
        descricao: "Ultra-thin and lightweight laptop with the Apple M2 chip and long battery life."
    },
    {
        id: 3,
        nome: "AirPods Pro",
        categoria: "headphones",
        preco: 1899,
        precoOriginal: 2299,
        desconto: 17,
        imagem: "https://www.apple.com/newsroom/images/live-action/wwdc-2023/standard/airpods/Apple-AirPods-Pro-2nd-gen-press-to-mute-230605_inline.jpg.large.jpg",
        descricao: "Wireless earbuds with active noise cancellation and transparency mode."
    },
    {
        id: 4,
        nome: "Samsung Galaxy S24",
        categoria: "smartphones",
        preco: 5499,
        precoOriginal: 6299,
        desconto: 13,
        imagem: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
        descricao: "Samsung flagship smartphone with a high-resolution camera, ultra-fast performance, and AMOLED display."
    },
    {
        id: 5,
        nome: "Apple Watch Series 9",
        categoria: "smartwatches",
        preco: 3299,
        precoOriginal: 3799,
        desconto: 13,
        imagem: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
        descricao: "Smartwatch with health features, fitness tracking, and seamless iPhone integration."
    },
    {
        id: 6,
        nome: "Compact Wireless Keyboard",
        categoria: "accessories",
        preco: 499,
        precoOriginal: null,
        desconto: null,
        imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        descricao: "Portable wireless keyboard, ideal for productivity."
    },
    {
        id: 7,
        nome: "Sony WH-1000XM5",
        categoria: "headphones",
        preco: 2499,
        precoOriginal: 2999,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        descricao: "Over-ear headphones with industry-leading noise cancellation and high-quality audio."
    },
    {
        id: 8,
        nome: "Dell XPS 13 Laptop",
        categoria: "laptops",
        preco: 7999,
        precoOriginal: null,
        desconto: null,
        imagem: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
        descricao: "Compact and powerful ultrabook with an ultra-thin bezel display and premium finish."
    },
    {
        id: 9,
        nome: "Ergonomic Bluetooth Mouse",
        categoria: "accessories",
        preco: 299,
        precoOriginal: 399,
        desconto: 25,
        imagem: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
        descricao: "Precise and comfortable wireless mouse for everyday use."
    },
    {
        id: 10,
        nome: "Google Pixel 8 Pro",
        categoria: "smartphones",
        preco: 4999,
        precoOriginal: 5699,
        desconto: 12,
        imagem: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
        descricao: "AI-powered Android phone with a sharp display, clean software, and great camera tools."
    },
    {
        id: 11,
        nome: "OnePlus 12",
        categoria: "smartphones",
        preco: 4399,
        precoOriginal: 4899,
        desconto: 10,
        imagem: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=800&q=80",
        descricao: "Fast and fluid flagship phone with strong charging speed and a vibrant AMOLED screen."
    },
    {
        id: 12,
        nome: "Xiaomi 14",
        categoria: "smartphones",
        preco: 4199,
        precoOriginal: 4699,
        desconto: 11,
        imagem: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
        descricao: "Compact flagship smartphone with high-end performance and versatile photography features."
    },
    {
        id: 31,
        nome: "Nothing Phone 2",
        categoria: "smartphones",
        preco: 3899,
        precoOriginal: 4299,
        desconto: 9,
        imagem: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
        descricao: "Distinctive smartphone with a clean interface, smooth display, and eye-catching design."
    },
    {
        id: 13,
        nome: "Samsung Galaxy Watch 6",
        categoria: "smartwatches",
        preco: 2299,
        precoOriginal: 2599,
        desconto: 12,
        imagem: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
        descricao: "Sleek circular smartwatch with advanced health monitoring and long battery life."
    },
    {
        id: 14,
        nome: "Fitbit Versa 4",
        categoria: "smartwatches",
        preco: 999,
        precoOriginal: 1199,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
        descricao: "Fitness-focused smartwatch with built-in GPS and sleep tracking."
    },
    {
        id: 15,
        nome: "Garmin Venu 3",
        categoria: "smartwatches",
        preco: 2699,
        precoOriginal: 2999,
        desconto: 10,
        imagem: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        descricao: "High-end smartwatch with AMOLED display and advanced sports modes."
    },
    {
        id: 16,
        nome: "Amazfit GTR 4",
        categoria: "smartwatches",
        preco: 749,
        precoOriginal: 899,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80",
        descricao: "Affordable stylish smartwatch with built-in optical heart rate and compass."
    },
    {
        id: 17,
        nome: "Huawei Watch GT 3",
        categoria: "smartwatches",
        preco: 1799,
        precoOriginal: 2099,
        desconto: 14,
        imagem: "https://images.unsplash.com/photo-1617625802912-cde586faf331?auto=format&fit=crop&w=800&q=80",
        descricao: "Smartwatch with long battery life and precise activity tracking."
    },
    {
        id: 18,
        nome: "Lenovo Yoga Slim 7",
        categoria: "laptops",
        preco: 6299,
        precoOriginal: 6999,
        desconto: 10,
        imagem: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        descricao: "Elegant slim laptop with a crisp display, solid battery life, and reliable daily performance."
    },
    {
        id: 19,
        nome: "HP Spectre x360",
        categoria: "laptops",
        preco: 8499,
        precoOriginal: 9299,
        desconto: 9,
        imagem: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
        descricao: "Premium 2-in-1 laptop with touchscreen flexibility, strong performance, and a polished design."
    },
    {
        id: 20,
        nome: "ASUS ROG Zephyrus G14",
        categoria: "laptops",
        preco: 9999,
        precoOriginal: 10999,
        desconto: 9,
        imagem: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        descricao: "Portable performance laptop built for gaming, creative work, and fast multitasking."
    },
    {
        id: 21,
        nome: "Acer Swift Go 14",
        categoria: "laptops",
        preco: 5799,
        precoOriginal: 6499,
        desconto: 11,
        imagem: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        descricao: "Lightweight laptop with modern connectivity, smooth performance, and a sharp everyday display."
    },
    {
        id: 22,
        nome: "Bose QuietComfort Ultra",
        categoria: "headphones",
        preco: 2399,
        precoOriginal: 2799,
        desconto: 14,
        imagem: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
        descricao: "Comfortable premium headphones with immersive sound and effective active noise cancellation."
    },
    {
        id: 23,
        nome: "JBL Live 660NC",
        categoria: "headphones",
        preco: 999,
        precoOriginal: 1299,
        desconto: 23,
        imagem: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
        descricao: "Wireless over-ear headphones with punchy sound, long battery life, and noise cancelling."
    },
    {
        id: 24,
        nome: "Sennheiser Momentum 4",
        categoria: "headphones",
        preco: 2199,
        precoOriginal: 2599,
        desconto: 15,
        imagem: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=800&q=80",
        descricao: "Refined headphones with detailed audio, smart features, and long-lasting comfort."
    },
    {
        id: 25,
        nome: "Beats Studio Pro",
        categoria: "headphones",
        preco: 1899,
        precoOriginal: 2299,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80",
        descricao: "Stylish wireless headphones with balanced sound, spatial audio, and travel-friendly portability."
    },
    {
        id: 26,
        nome: "USB-C Hub 8-in-1",
        categoria: "accessories",
        preco: 349,
        precoOriginal: 449,
        desconto: 22,
        imagem: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
        descricao: "Versatile hub that adds HDMI, USB, card readers, and power delivery to your setup."
    },
    {
        id: 27,
        nome: "MagSafe Charging Stand",
        categoria: "accessories",
        preco: 279,
        precoOriginal: 349,
        desconto: 20,
        imagem: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
        descricao: "Clean magnetic charging stand that keeps your phone upright and your desk uncluttered."
    },
    {
        id: 28,
        nome: "Portable SSD 1TB",
        categoria: "accessories",
        preco: 699,
        precoOriginal: 849,
        desconto: 18,
        imagem: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80",
        descricao: "Fast external solid-state drive for backups, editing workflows, and portable storage."
    },
    {
        id: 29,
        nome: "1080p Webcam Pro",
        categoria: "accessories",
        preco: 429,
        precoOriginal: 529,
        desconto: 19,
        imagem: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
        descricao: "Sharp webcam with clear video, dual microphones, and easy setup for meetings and streaming."
    }
];

const containerProdutos = document.querySelector(".products-container");
const searchInput = document.querySelector(".search-input");
const cartTrigger = document.querySelector(".cart-trigger");
const cartCount = document.querySelector(".cart-count");
const cartOverlay = document.querySelector(".cart-overlay");
const cartPanel = document.querySelector(".cart-panel");
const cartClose = document.querySelector(".cart-close");
const cartItemsContainer = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const summaryItemsCount = document.querySelector(".summary-items-count");
const summarySubtotal = document.querySelector(".summary-subtotal");
const summaryShipping = document.querySelector(".summary-shipping");
const summaryTotal = document.querySelector(".summary-total");
const checkoutBtn = document.querySelector(".checkout-btn");
const summaryView = document.querySelector(".cart-summary-view");
const checkoutView = document.querySelector(".checkout-view");
const successView = document.querySelector(".success-view");
const checkoutForm = document.querySelector(".checkout-form");
const backToCartBtn = document.querySelector(".back-to-cart-btn");
const continueShoppingBtn = document.querySelector(".continue-shopping-btn");
const bankDetails = document.querySelector(".bank-details");
const successMessage = document.querySelector(".success-message");
const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function formatPrice(valor) {
    return `$${valor.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getProductById(id) {
    return produtos.find(produto => produto.id === id);
}

async function carregarProdutos() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        produtos = await response.json();
    } catch (error) {
        console.error("Falling back to local product data:", error);
        produtos = fallbackProducts;
    }
}

function getCartTotals() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.preco + 0.9) * item.quantity, 0);
    const shipping = itemCount > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;
    return { itemCount, subtotal, shipping, total };
}

function mostrarProdutos() {
    containerProdutos.classList.add("fade");

    setTimeout(() => {
        const termo = normalizarTexto(textoPesquisa);

        const produtosFiltrados = produtos.filter(produto => {
            const nome = normalizarTexto(produto.nome);
            const descricao = normalizarTexto(produto.descricao);
            return (
                (nome.includes(termo) || descricao.includes(termo)) &&
                (categoriaAtual === "all" || produto.categoria === categoriaAtual)
            );
        });

        let htmlProdutos = "";

        produtosFiltrados.forEach(produto => {
            const fallbackImagem = criarImagemCategoria(produto.categoria, produto.nome);

            htmlProdutos += `
                <div class="product-card">
                    <img
                        class="product-img"
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${fallbackImagem}'">
                    <div class="product-info">
                        <h3 class="product-name">${produto.nome}</h3>
                        <p class="product-price">${formatPrice(produto.preco + 0.9)}</p>
                        <p class="product-description">${produto.descricao}</p>
                        <button class="product-button" type="button" data-product-id="${produto.id}">
                            <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            `;
        });

        containerProdutos.innerHTML = htmlProdutos;
        containerProdutos.classList.remove("fade");
    }, 200);
}

function renderCart() {
    const { itemCount, subtotal, shipping, total } = getCartTotals();

    cartCount.textContent = itemCount;
    summaryItemsCount.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryShipping.textContent = formatPrice(shipping);
    summaryTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        cartEmpty.classList.remove("hidden");
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.6";
        checkoutBtn.style.cursor = "not-allowed";
        return;
    }

    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
    cartEmpty.classList.add("hidden");

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imagem}" alt="${item.nome}" onerror="this.onerror=null;this.src='${criarImagemCategoria(item.categoria, item.nome)}'">
            <div>
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-price">${formatPrice((item.preco + 0.9) * item.quantity)}</div>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
        </div>
    `).join("");
}

function addToCart(productId) {
    const produto = getProductById(productId);
    if (!produto) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...produto, quantity: 1 });
    }

    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(produto => produto.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(produto => produto.id !== productId);
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function openCart() {
    cartOverlay.classList.remove("hidden");
    cartPanel.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.add("hidden");
    cartPanel.classList.add("hidden");
    document.body.style.overflow = "";
    showCartSummary();
}

function showCartSummary() {
    summaryView.classList.remove("hidden");
    checkoutView.classList.add("hidden");
    successView.classList.add("hidden");
}

function showCheckoutView() {
    summaryView.classList.add("hidden");
    checkoutView.classList.remove("hidden");
    successView.classList.add("hidden");
}

function showSuccessView(message) {
    summaryView.classList.add("hidden");
    checkoutView.classList.add("hidden");
    successView.classList.remove("hidden");
    successMessage.textContent = message;
}

function handlePaymentMethodChange() {
    const selectedPayment = checkoutForm.paymentMethod.value;
    const bankInputs = bankDetails.querySelectorAll("input");

    if (selectedPayment === "upi") {
        bankDetails.classList.remove("hidden");
        bankInputs.forEach(input => {
            input.required = true;
        });
    } else {
        bankDetails.classList.add("hidden");
        bankInputs.forEach(input => {
            input.required = false;
            input.value = "";
        });
    }
}

function pesquisar() {
    textoPesquisa = searchInput.value.toLowerCase();
    mostrarProdutos();
}

async function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showCartSummary();
        return;
    }

    const formData = new FormData(checkoutForm);
    const customerName = formData.get("customerName");
    const mobileNumber = formData.get("mobileNumber");
    const address = formData.get("address");
    const paymentMethod = formData.get("paymentMethod");
    const orderedProducts = cart.map(item => `${item.nome} x${item.quantity}`).join(", ");
    const { subtotal, shipping, total } = getCartTotals();

    const paymentLabel = paymentMethod === "upi" ? "UPI / Bank Transfer" : "Cash on Delivery";

    try {
        const orderPayload = {
            customerName,
            mobileNumber,
            address,
            paymentMethod,
            bankName: formData.get("bankName"),
            upiId: formData.get("upiId"),
            accountHolder: formData.get("accountHolder"),
            accountLast4: formData.get("accountLast4"),
            subtotal,
            shipping,
            total,
            items: cart.map(item => ({
                id: item.id,
                nome: item.nome,
                quantity: item.quantity,
                unitPrice: Number((item.preco + 0.9).toFixed(2)),
                lineTotal: Number(((item.preco + 0.9) * item.quantity).toFixed(2))
            }))
        };

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderPayload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to place order");
        }

        showSuccessView(
            `${customerName}, your order for ${orderedProducts} has been placed successfully. Order ID: #${result.orderId}. Total purchase: ${formatPrice(total)}. Payment method: ${paymentLabel}.`
        );

        cart = [];
        renderCart();
        checkoutForm.reset();
        handlePaymentMethodChange();
    } catch (error) {
        alert(error.message);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await carregarProdutos();
    mostrarProdutos();
    renderCart();
    handlePaymentMethodChange();

    searchInput.addEventListener("input", pesquisar);

    const categoryBtns = document.querySelectorAll(".category-btn");
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            categoryBtns.forEach(button => button.classList.remove("active"));
            this.classList.add("active");
            categoriaAtual = this.getAttribute("data-category");
            mostrarProdutos();
        });
    });

    containerProdutos.addEventListener("click", event => {
        const button = event.target.closest(".product-button");
        if (!button) return;
        addToCart(Number(button.dataset.productId));
    });

    cartItemsContainer.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const productId = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "increase") updateQuantity(productId, 1);
        if (action === "decrease") updateQuantity(productId, -1);
        if (action === "remove") removeFromCart(productId);
    });

    cartTrigger.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) return;
        showCheckoutView();
    });

    backToCartBtn.addEventListener("click", showCartSummary);
    continueShoppingBtn.addEventListener("click", closeCart);
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    paymentMethodInputs.forEach(option => {
        option.addEventListener("change", handlePaymentMethodChange);
    });
});
