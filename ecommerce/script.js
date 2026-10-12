/**
 * TAROTKNIGHT CRYSTAL ART - CLIENT ENGINE
 * Datamex College of Saint Adeline | Lead: Marcial Lawrence Jr V. Caronan
 * PayMongo API Key: pk_test_wfW6N69auD5WdUXDq7dRQVam
 * Integrated Logistics: J&T Express Philippines (https://www.jtexpress.ph/)
 */

// PayMongo Test API Key
const PAYMONGO_TEST_PUBLIC_KEY = "pk_test_wfW6N69auD5WdUXDq7dRQVam";
const JT_EXPRESS_URL = "https://www.jtexpress.ph/";

// Shopping Cart State
let cart = [];
let currentCategory = "All";
let searchQuery = "";
let selectedService = SPIRITUAL_SERVICES[0];

// Mock Order & Tracking Database for J&T Simulation
let simulatedOrders = [
  {
    orderId: "TK-ORD-8941",
    trackingNumber: "JNT-PH-8201948291",
    customer: "Maria Santos",
    city: "Parañaque City",
    items: "Celestial Amethyst Astral Wire-Wrapped Pendant x1",
    total: 1370,
    paymentMethod: "PayMongo (GCash)",
    status: "In Transit",
    courier: "J&T Express Philippines",
    timeline: [
      { status: "Waybill Created & Paid", location: "TarotKnight Parañaque Studio", time: "Oct 10, 09:30 AM", done: true },
      { status: "Parcel Picked Up by Courier", location: "J&T Hub Parañaque", time: "Oct 10, 02:15 PM", done: true },
      { status: "Sorted at Sorting Center", location: "J&T Pasay Mega Hub", time: "Oct 11, 04:45 AM", done: true },
      { status: "Out for Delivery", location: "Assigned to Rider (Kuya Arnel)", time: "Oct 12, 08:30 AM", done: false, active: true },
      { status: "Delivered & Signed", location: "Recipient Address", time: "Pending", done: false }
    ]
  },
  {
    orderId: "TK-ORD-8930",
    trackingNumber: "JNT-PH-7729104829",
    customer: "Joshua Reyes",
    city: "Quezon City",
    items: "Solar Citrine Abundance Talisman x1, Rose Quartz Mala x1",
    total: 2350,
    paymentMethod: "PayMongo (Card)",
    status: "Delivered",
    courier: "J&T Express Philippines",
    timeline: [
      { status: "Waybill Created & Paid", location: "TarotKnight Parañaque Studio", time: "Oct 08, 10:15 AM", done: true },
      { status: "Parcel Picked Up by Courier", location: "J&T Hub Parañaque", time: "Oct 08, 03:00 PM", done: true },
      { status: "Sorted at Sorting Center", location: "J&T Pasay Mega Hub", time: "Oct 09, 01:20 AM", done: true },
      { status: "Out for Delivery", location: "J&T QC Delivery Hub", time: "Oct 09, 09:00 AM", done: true },
      { status: "Delivered & Signed", location: "Received by J. Reyes", time: "Oct 09, 01:45 PM", done: true }
    ]
  }
];

// AI Spiritual Guide Knowledge Base (Matching paper's ai_knowledge_base)
const AI_KNOWLEDGE_BASE = [
  {
    keywords: ["amethyst", "sleep", "intuition", "third eye"],
    response: "✨ <strong>Amethyst Metaphysical Insight:</strong> Amethyst resonates with the Crown and Third Eye Chakras (approx 963Hz frequency). It dispels insomnia, calms anxiety, and repels psychic interference. Recommended ritual: cleanse under moonlight or with a selenite plate."
  },
  {
    keywords: ["citrine", "money", "wealth", "prosperity", "abundance"],
    response: "🌟 <strong>Citrine Abundance Insight:</strong> Citrine carries solar warmth and does not accumulate negative energy. Keep our wire-wrapped Citrine in your purse, workspace, or cash box to attract contracts, sales, and joyful motivation."
  },
  {
    keywords: ["obsidian", "protection", "shield", "negative", "curse"],
    response: "🛡️ <strong>Black Obsidian Insight:</strong> Formed from rapidly cooling volcanic lava, Obsidian forms a fierce auric mirror shield. It cuts psychic cords from toxic acquaintances and dissolves heavy electromagnetic fog."
  },
  {
    keywords: ["rose quartz", "love", "heart", "relationship"],
    response: "💖 <strong>Rose Quartz Insight:</strong> The sovereign stone of unconditional love and self-compassion. It softens grief, opens the heart chakra, and invites harmonious romantic alignment."
  },
  {
    keywords: ["paymongo", "payment", "gcash", "maya", "card"],
    response: "💳 <strong>PayMongo Integration:</strong> We utilize official PayMongo API keys (Test Key: <code>pk_test_wfW6N69auD5WdUXDq7dRQVam</code>) supporting GCash, Maya, and Visa/Mastercard. Transactions validate via secure instant webhooks without manual receipt sending!"
  },
  {
    keywords: ["j&t", "jnt", "shipping", "delivery", "track", "courier"],
    response: "📦 <strong>J&T Express Shipping:</strong> All crystal artifacts are cleansed, packed in bubble silk pouches, and dispatched via J&T Express Philippines. Standard delivery takes 1-2 days for Metro Manila and 3-5 days for provincial areas. You can track anytime via our tracker or <a href='https://www.jtexpress.ph/' target='_blank' class='text-gold'>jtexpress.ph</a>!"
  },
  {
    keywords: ["wire wrap", "wire", "copper", "bronze", "tarnish"],
    response: "💍 <strong>Artisan Wire-Wrapping:</strong> All pendants and rings are handcrafted by Marcial Caronan and team using tarnish-resistant jewelry-grade copper, brass, and bronze wires. Avoid spraying direct perfume onto wirework."
  },
  {
    keywords: ["tarot", "reading", "booking", "cleansing", "service"],
    response: "🔮 <strong>Spiritual Consultations:</strong> You can book a 45-min Tarot reading (₱650), Chakra Cleansing (₱850), or Pre-Shipment Crystal Blessing (₱1,200) in our Booking Hub with instant calendar reservation and PayMongo checkout!"
  }
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupFilterPills();
  setupSearch();
  renderServices();
  setupServiceBooking();
  setupCartEvents();
  setupPayMongoCheckout();
  setupJTTracking();
  setupAIGuide();
  updateCartBadge();
  setupAdminDashboard();
});

// Render 32 Crystal Products
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const filtered = CRYSTAL_PRODUCTS.filter(p => {
    const matchesCat = (currentCategory === "All") || (p.category === currentCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.chakra.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search text-gold fs-1 mb-3 d-block"></i>
        <h4 class="text-white">No Crystals Found Matching "${searchQuery}"</h4>
        <p class="text-muted">Try another spiritual search query or clear the filter.</p>
        <button class="btn btn-gold-primary mt-2" onclick="resetFilters()">View All 32 Crystals</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div class="product-card">
        <div class="product-thumb-wrap">
          <span class="product-tag-badge">${p.tag}</span>
          <span class="product-sku-badge">${p.sku}</span>
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-card-body">
          <div class="product-category-meta">${p.category}</div>
          <h3 class="product-title" title="${p.name}">${p.name}</h3>
          <div class="product-chakra-chip">
            <i class="bi bi-stars"></i> ${p.chakra}
          </div>
          <p class="text-light small mb-3" style="font-size: 0.85rem; line-height: 1.5; height: 3.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
            ${p.description}
          </p>
          <div class="product-card-footer">
            <div class="product-price">
              ₱${p.price.toLocaleString()}
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-warning" onclick="openProductQuickView(${p.id})" title="Inspect Crystal Metaphysics">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-add-cart" onclick="addToCart(${p.id})">
                <i class="bi bi-bag-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter pills logic
function setupFilterPills() {
  const pills = document.querySelectorAll('.btn-filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderProducts();
    });
  });
}

// Search box logic
function setupSearch() {
  const searchInput = document.getElementById('crystalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }
}

function resetFilters() {
  currentCategory = "All";
  searchQuery = "";
  const input = document.getElementById('crystalSearchInput');
  if (input) input.value = "";
  document.querySelectorAll('.btn-filter-pill').forEach((p, idx) => {
    if (idx === 0) p.classList.add('active');
    else p.classList.remove('active');
  });
  renderProducts();
}

// Quick View Modal
function openProductQuickView(productId) {
  const product = CRYSTAL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalEl = document.getElementById('quickViewModal');
  if (!modalEl) return;

  document.getElementById('qvImage').src = product.image;
  document.getElementById('qvTitle').textContent = product.name;
  document.getElementById('qvCategory').textContent = product.category;
  document.getElementById('qvSku').textContent = product.sku;
  document.getElementById('qvChakra').textContent = product.chakra;
  document.getElementById('qvPrice').textContent = `₱${product.price.toLocaleString()}`;
  document.getElementById('qvDesc').textContent = product.description;
  document.getElementById('qvWire').textContent = product.wireMaterial;
  document.getElementById('qvCleansing').textContent = product.cleansing;
  document.getElementById('qvStock').textContent = `${product.stock} pieces in stock`;
  
  const addBtn = document.getElementById('qvAddBtn');
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product.id);
      bootstrap.Modal.getInstance(modalEl).hide();
    };
  }

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// Shopping Cart Functions
function addToCart(productId) {
  const product = CRYSTAL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartBadge();
  renderCartDrawer();
  showToastNotification(`Added "${product.name}" to Sacred Cart!`);
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(b => {
    b.textContent = totalCount;
  });
}

function renderCartDrawer() {
  const cartList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('btnProceedCheckout');

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x text-gold fs-1 d-block mb-3"></i>
        <h5 class="text-white">Your Sacred Cart is Empty</h5>
        <p class="text-muted small">Select an artisan crystal from the catalog to begin.</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = "₱0";
    if (cartShippingEl) cartShippingEl.textContent = "₱0";
    if (cartTotalEl) cartTotalEl.textContent = "₱0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  cartList.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="flex-grow-1">
          <div class="fw-bold text-white small" style="line-height: 1.2;">${item.name}</div>
          <div class="text-gold small">₱${item.price.toLocaleString()} each</div>
          <div class="d-flex align-items-center gap-2 mt-2">
            <div class="cart-qty-ctrl">
              <button class="btn-qty" onclick="updateCartQty(${item.id}, -1)">-</button>
              <span class="small fw-bold px-1">${item.qty}</span>
              <button class="btn-qty" onclick="updateCartQty(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn-sm text-danger p-0 ms-2" onclick="removeFromCart(${item.id})" title="Remove item">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="text-end fw-bold text-gold">
          ₱${itemTotal.toLocaleString()}
        </div>
      </div>
    `;
  }).join('');

  // Shipping logic: Free shipping for orders ₱2,500+, else ₱120 standard J&T Metro Manila fee
  const shipping = subtotal >= 2500 ? 0 : 120;
  const grandTotal = subtotal + shipping;

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₱${subtotal.toLocaleString()}`;
  if (cartShippingEl) {
    cartShippingEl.innerHTML = shipping === 0 
      ? '<span class="text-success fw-bold">FREE (₱2,500+ Perk)</span>' 
      : '₱120 (J&T Express)';
  }
  if (cartTotalEl) cartTotalEl.textContent = `₱${grandTotal.toLocaleString()}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function setupCartEvents() {
  const cartModalEl = document.getElementById('cartModal');
  if (cartModalEl) {
    cartModalEl.addEventListener('show.bs.modal', renderCartDrawer);
  }
}

// Toast notification
function showToastNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed bottom-0 end-0 m-3 p-3 rounded-3 shadow-lg';
  toast.style.cssText = 'background: rgba(26, 14, 48, 0.96); border: 1px solid #d4af37; z-index: 9999; color: #fff; min-width: 280px;';
  toast.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <i class="bi bi-check-circle-fill text-gold fs-5"></i>
      <span class="small fw-semibold">${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// Render Spiritual Services
function renderServices() {
  const container = document.getElementById('servicesGrid');
  if (!container) return;

  container.innerHTML = SPIRITUAL_SERVICES.map(srv => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="service-card ${selectedService.id === srv.id ? 'border-warning' : ''}">
        <div class="service-icon-wrap">
          <i class="bi ${srv.icon}"></i>
        </div>
        <div class="text-gold small fw-bold text-uppercase mb-1">${srv.category} • ${srv.duration}</div>
        <h4 class="text-white fw-bold mb-2">${srv.name}</h4>
        <p class="text-light small mb-3">${srv.description}</p>
        
        <div class="mb-3">
          <div class="small fw-bold text-gold-light mb-1">Includes:</div>
          <ul class="list-unstyled small mb-0">
            ${srv.includes.map(inc => `<li class="text-light"><i class="bi bi-check2 text-gold me-1"></i> ${inc}</li>`).join('')}
          </ul>
        </div>
        
        <div class="mt-auto pt-3 border-top border-secondary d-flex align-items-center justify-content-between">
          <div class="text-gold fw-bold fs-4">₱${srv.price.toLocaleString()}</div>
          <button class="btn btn-gold-primary btn-sm" onclick="selectServiceForBooking('${srv.id}')">
            Book Reading
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function selectServiceForBooking(serviceId) {
  const srv = SPIRITUAL_SERVICES.find(s => s.id === serviceId);
  if (!srv) return;
  selectedService = srv;
  renderServices();

  const serviceSelect = document.getElementById('bookingServiceSelect');
  if (serviceSelect) serviceSelect.value = srv.id;
  updateBookingFee();

  // Scroll to booking form
  const formEl = document.getElementById('bookingFormCard');
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
}

function setupServiceBooking() {
  const serviceSelect = document.getElementById('bookingServiceSelect');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', (e) => {
      const srv = SPIRITUAL_SERVICES.find(s => s.id === e.target.value);
      if (srv) {
        selectedService = srv;
        updateBookingFee();
      }
    });
  }

  const bookingForm = document.getElementById('appointmentBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('bookingClientName').value.trim();
      const clientEmail = document.getElementById('bookingClientEmail').value.trim();
      const clientPhone = document.getElementById('bookingClientPhone').value.trim();
      const bookingDate = document.getElementById('bookingDate').value;
      const bookingTime = document.getElementById('bookingTime').value;

      if (!clientName || !clientEmail || !bookingDate) {
        alert("Please complete the booking name, email, and scheduled date.");
        return;
      }

      // Launch PayMongo Checkout for Service
      launchPayMongoModal({
        type: 'service',
        title: selectedService.name,
        amount: selectedService.price,
        client: { name: clientName, email: clientEmail, phone: clientPhone },
        bookingDetails: { date: bookingDate, time: bookingTime, service: selectedService.name }
      });
    });
  }
}

function updateBookingFee() {
  const feeEl = document.getElementById('computedBookingFee');
  if (feeEl) {
    feeEl.textContent = `₱${selectedService.price.toLocaleString()}`;
  }
}

// PayMongo Online Payment Engine Integration
function setupPayMongoCheckout() {
  const btnProceed = document.getElementById('btnProceedCheckout');
  if (btnProceed) {
    btnProceed.addEventListener('click', () => {
      if (cart.length === 0) return;
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const shipping = subtotal >= 2500 ? 0 : 120;
      const total = subtotal + shipping;

      // Close cart modal
      const cartModalEl = document.getElementById('cartModal');
      if (cartModalEl) bootstrap.Modal.getInstance(cartModalEl).hide();

      launchPayMongoModal({
        type: 'retail',
        title: `TarotKnight Crystal Order (${cart.length} items)`,
        amount: total,
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping
      });
    });
  }
}

let activeCheckoutPayload = null;

function launchPayMongoModal(payload) {
  activeCheckoutPayload = payload;
  const modalEl = document.getElementById('paymongoModal');
  if (!modalEl) return;

  document.getElementById('pmOrderTitle').textContent = payload.title;
  document.getElementById('pmAmountDisplay').textContent = `₱${payload.amount.toLocaleString()}`;
  document.getElementById('pmApiKeyDisplay').textContent = PAYMONGO_TEST_PUBLIC_KEY;

  // Reset steps
  document.getElementById('pmStepForm').classList.remove('d-none');
  document.getElementById('pmStepProcessing').classList.add('d-none');
  document.getElementById('pmStepSuccess').classList.add('d-none');

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// Payment method tab switching inside PayMongo modal
function selectPaymentMethod(method) {
  document.querySelectorAll('.pm-method-pill').forEach(p => p.classList.remove('active'));
  document.getElementById(`pmTab_${method}`).classList.add('active');

  document.getElementById('pmFields_card').classList.add('d-none');
  document.getElementById('pmFields_gcash').classList.add('d-none');
  document.getElementById('pmFields_maya').classList.add('d-none');

  document.getElementById(`pmFields_${method}`).classList.remove('d-none');
}

// Execute PayMongo Payment Simulation
function executePayMongoTransaction() {
  const formEl = document.getElementById('pmStepForm');
  const procEl = document.getElementById('pmStepProcessing');
  const succEl = document.getElementById('pmStepSuccess');

  formEl.classList.add('d-none');
  procEl.classList.remove('d-none');

  // Simulate 3-stage PayMongo API Handshake & Webhook Callback
  const logBox = document.getElementById('pmLiveHandshakeLogs');
  logBox.innerHTML = `
    <div>[0.00s] POST https://api.paymongo.com/v1/checkout_sessions</div>
    <div>[0.15s] Header: Authorization: Basic ${PAYMONGO_TEST_PUBLIC_KEY.substring(0, 14)}...</div>
    <div>[0.35s] Payload Amount: ${activeCheckoutPayload.amount * 100} centavos (PHP)</div>
  `;

  setTimeout(() => {
    logBox.innerHTML += `<div>[0.85s] PayMongo Gateway Responded: HTTP 200 OK (cs_test_session_active)</div>`;
  }, 900);

  setTimeout(() => {
    logBox.innerHTML += `<div>[1.60s] Webhook Received: event "payment.paid" validated</div>`;
  }, 1700);

  setTimeout(() => {
    logBox.innerHTML += `<div>[2.20s] Database status transition: Pending -> PAID / CONFIRMED</div>`;
    
    // Complete Payment
    procEl.classList.add('d-none');
    succEl.classList.remove('d-none');

    // Generate New Order in Database
    const newOrderId = `TK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTracking = `JNT-PH-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const customerName = document.getElementById('pmInputName').value || "Valued Seeker";
    const customerCity = document.getElementById('pmInputCity').value || "Metro Manila";

    const newOrderRecord = {
      orderId: newOrderId,
      trackingNumber: newTracking,
      customer: customerName,
      city: customerCity,
      items: activeCheckoutPayload.type === 'retail' 
        ? cart.map(i => `${i.name} x${i.qty}`).join(', ')
        : activeCheckoutPayload.title,
      total: activeCheckoutPayload.amount,
      paymentMethod: "PayMongo Test Gateway",
      status: "Waybill Created (J&T Express)",
      courier: "J&T Express Philippines",
      timeline: [
        { status: "Payment Verified via PayMongo", location: "Online Gateway Callback", time: "Just Now", done: true },
        { status: "Waybill Created at TarotKnight Studio", location: "Parañaque City Studio", time: "Pending Courier Pickup", done: true, active: true },
        { status: "Parcel Picked Up by J&T Express", location: "J&T Hub Parañaque", time: "Scheduled Today", done: false },
        { status: "In Transit via Sorting Center", location: "J&T Pasay Sorting Facility", time: "Scheduled", done: false },
        { status: "Out for Delivery", location: customerCity, time: "Scheduled", done: false }
      ]
    };

    simulatedOrders.unshift(newOrderRecord);

    // Update Success Display
    document.getElementById('pmSuccessOrderId').textContent = newOrderId;
    document.getElementById('pmSuccessTracking').textContent = newTracking;
    document.getElementById('pmSuccessAmount').textContent = `₱${activeCheckoutPayload.amount.toLocaleString()}`;

    // Clear cart if retail
    if (activeCheckoutPayload.type === 'retail') {
      cart = [];
      updateCartBadge();
    }

    // Refresh Admin table
    setupAdminDashboard();
  }, 2600);
}

// J&T Express Logistics Engine
function setupJTTracking() {
  const btnTrack = document.getElementById('btnSearchTracking');
  const inputTrack = document.getElementById('trackingInput');

  if (btnTrack && inputTrack) {
    btnTrack.addEventListener('click', () => {
      performJTTrackingLookup(inputTrack.value.trim());
    });
    inputTrack.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performJTTrackingLookup(inputTrack.value.trim());
    });
  }
}

function performJTTrackingLookup(query) {
  const resultCard = document.getElementById('trackingResultCard');
  if (!resultCard) return;

  if (!query) {
    alert("Please enter a J&T tracking number or Order ID.");
    return;
  }

  const order = simulatedOrders.find(o => 
    o.trackingNumber.toLowerCase() === query.toLowerCase() ||
    o.orderId.toLowerCase() === query.toLowerCase()
  );

  if (!order) {
    resultCard.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-exclamation-triangle text-warning fs-2 d-block mb-2"></i>
        <h5 class="text-white">Waybill "${query}" Not Found</h5>
        <p class="text-muted small">Check the number or verify with our studio. You can also track on the official website below.</p>
        <a href="${JT_EXPRESS_URL}" target="_blank" class="btn btn-sm btn-outline-danger">
          <i class="bi bi-box-arrow-up-right me-1"></i> Open J&T Express Portal (jtexpress.ph)
        </a>
      </div>
    `;
    resultCard.classList.remove('d-none');
    return;
  }

  resultCard.innerHTML = `
    <div class="border-bottom border-secondary pb-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <span class="badge bg-danger text-white px-3 py-2 fw-bold">
          <i class="bi bi-truck me-1"></i> J&T Express Philippines
        </span>
        <h4 class="text-gold mt-2 mb-0">${order.trackingNumber}</h4>
        <small class="text-muted">Order ID: <strong>${order.orderId}</strong> • Recipient: <strong>${order.customer}</strong> (${order.city})</small>
      </div>
      <div class="text-end">
        <span class="badge bg-success text-white px-3 py-2 fs-6">${order.status}</span>
        <div class="mt-1">
          <a href="${JT_EXPRESS_URL}" target="_blank" class="btn btn-sm btn-outline-warning py-1 px-3">
            <i class="bi bi-box-arrow-up-right me-1"></i> Check on Official J&T Website
          </a>
        </div>
      </div>
    </div>

    <div class="tracking-timeline">
      ${order.timeline.map(step => `
        <div class="timeline-step ${step.done ? 'completed' : ''} ${step.active ? 'active' : ''}">
          <div class="timeline-dot"></div>
          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-white">${step.status}</strong>
            <span class="small text-gold">${step.time}</span>
          </div>
          <div class="small text-muted">${step.location}</div>
        </div>
      `).join('')}
    </div>
  `;
  resultCard.classList.remove('d-none');
  resultCard.scrollIntoView({ behavior: 'smooth' });
}

// Quick prefill for sample tracking numbers
function fillSampleTracking(waybill) {
  const input = document.getElementById('trackingInput');
  if (input) {
    input.value = waybill;
    performJTTrackingLookup(waybill);
  }
}

// AI Spiritual Guide Chatbot
function setupAIGuide() {
  const sendBtn = document.getElementById('btnSendAiChat');
  const chatInput = document.getElementById('aiChatInput');

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', sendUserChatMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendUserChatMessage();
    });
  }
}

function sendUserChatMessage() {
  const input = document.getElementById('aiChatInput');
  const messageBox = document.getElementById('aiChatMessages');
  if (!input || !messageBox) return;

  const text = input.value.trim();
  if (!text) return;

  // Add User Message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-bubble chat-bubble-user';
  userMsg.textContent = text;
  messageBox.appendChild(userMsg);
  input.value = '';
  messageBox.scrollTop = messageBox.scrollHeight;

  // Find AI Response matching keywords
  const lower = text.toLowerCase();
  let matched = AI_KNOWLEDGE_BASE.find(item => 
    item.keywords.some(k => lower.includes(k))
  );

  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-bubble chat-bubble-ai';

    if (matched) {
      aiMsg.innerHTML = matched.response;
    } else {
      aiMsg.innerHTML = `
        🔮 <em>Blessed greetings, seeker.</em> Your inquiry regarding "<strong>${text}</strong>" has been logged into our spiritual consult queue.
        <br><br>
        Our lead artisan and reader, <strong>Marcial Caronan</strong>, has been notified. In the meantime, feel free to ask about our <strong>Amethyst</strong>, <strong>Citrine</strong>, <strong>PayMongo GCash checkout</strong>, or <strong>J&T Express tracking</strong>!
      `;
    }

    messageBox.appendChild(aiMsg);
    messageBox.scrollTop = messageBox.scrollHeight;
  }, 600);
}

// Admin Control Center Dashboard
function setupAdminDashboard() {
  const totalRevEl = document.getElementById('adminGrossRevenue');
  const ordersCountEl = document.getElementById('adminOrdersCount');
  const inventoryCountEl = document.getElementById('adminInventoryCount');
  const ordersTableBody = document.getElementById('adminOrdersTableBody');
  const inventoryTableBody = document.getElementById('adminInventoryTableBody');

  const grossTotal = simulatedOrders.reduce((sum, o) => sum + o.total, 0);

  if (totalRevEl) totalRevEl.textContent = `₱${grossTotal.toLocaleString()}`;
  if (ordersCountEl) ordersCountEl.textContent = simulatedOrders.length;
  if (inventoryCountEl) inventoryCountEl.textContent = CRYSTAL_PRODUCTS.length;

  if (ordersTableBody) {
    ordersTableBody.innerHTML = simulatedOrders.map(o => `
      <tr>
        <td class="font-monospace text-gold">${o.orderId}</td>
        <td><strong>${o.customer}</strong><br><small class="text-muted">${o.city}</small></td>
        <td class="small">${o.items}</td>
        <td class="text-gold fw-bold">₱${o.total.toLocaleString()}</td>
        <td><span class="badge bg-dark border border-secondary text-info">${o.paymentMethod}</span></td>
        <td><span class="badge bg-success text-white">${o.status}</span></td>
        <td class="font-monospace small">${o.trackingNumber}</td>
      </tr>
    `).join('');
  }

  if (inventoryTableBody) {
    inventoryTableBody.innerHTML = CRYSTAL_PRODUCTS.slice(0, 10).map(p => `
      <tr>
        <td class="font-monospace text-gold">${p.sku}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge bg-dark border border-warning text-warning">${p.category}</span></td>
        <td class="text-gold fw-bold">₱${p.price.toLocaleString()}</td>
        <td>
          <span class="badge ${p.stock <= 3 ? 'bg-danger' : 'bg-success'} text-white">
            ${p.stock} units
          </span>
        </td>
      </tr>
    `).join('');
  }
}
