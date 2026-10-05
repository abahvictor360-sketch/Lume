(function () {
  "use strict";

  var PRODUCTS = window.LUME_PRODUCTS || [];
  var CART_KEY = "lume-cart-v1";

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function byId(id) { return PRODUCTS.find(function (p) { return p.id === id; }); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return "$" + n.toLocaleString("en-US"); }

  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 6h16M4 12h11M4 18h14"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16 16 8M9 8h7v7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    chev: '<svg viewBox="0 0 40 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 2 6 6-6 6" opacity=".35"/><path d="m15 2 6 6-6 6" opacity=".65"/><path d="m27 2 6 6-6 6"/></svg>',
    blob: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 10c13 0 18 9 25 16s9 20 0 29-13 16-27 15-22-8-25-19 0-20 6-27 8-14 21-14Z" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/><path d="M40 15c11 0 15 8 21 14s7 17-1 25-11 13-22 12" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/><path d="M24 30c3-6 8-9 14-10" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>'
  };

  // ---------- cart store ----------
  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var c = raw ? JSON.parse(raw) : {};
      return c && typeof c === "object" ? c : {};
    } catch (e) { return memCart; }
  }
  var memCart = {};
  function writeCart(c) {
    memCart = c;
    try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) { /* storage unavailable */ }
    updateBadge();
  }
  function cartItems() {
    var c = readCart();
    return Object.keys(c).map(function (id) { return { product: byId(id), qty: c[id] }; })
      .filter(function (i) { return i.product && i.qty > 0; });
  }
  function cartCount() { return cartItems().reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartTotal() { return cartItems().reduce(function (n, i) { return n + i.qty * i.product.price; }, 0); }
  function addToCart(id, qty) {
    var c = readCart();
    c[id] = Math.min(99, (c[id] || 0) + (qty || 1));
    writeCart(c);
  }
  function setQty(id, qty) {
    var c = readCart();
    if (qty <= 0) delete c[id]; else c[id] = Math.min(99, qty);
    writeCart(c);
  }

  function updateBadge() {
    var n = cartCount();
    $all("[data-badge]").forEach(function (b) {
      b.textContent = n;
      b.hidden = n === 0;
      b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    });
  }

  // ---------- shell ----------
  function renderHeader(page) {
    var nav = [
      { href: "/", label: "Discover", key: "home" },
      { href: "/#collection", label: "Collection", key: "collection" },
      { href: "/cart", label: "Cart", key: "cart" }
    ];
    var header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML =
      '<div class="topbar__inner">' +
        '<button class="icon-btn" data-open-menu aria-label="Open menu">' + ICON.menu + '</button>' +
        '<a class="brand" href="/">Lume</a>' +
        '<nav class="topnav" aria-label="Primary">' +
          nav.map(function (n) {
            return '<a href="' + n.href + '"' + (n.key === page ? ' aria-current="page"' : "") + '>' + n.label + '</a>';
          }).join("") +
        '</nav>' +
        '<a class="icon-btn cart-btn" href="/cart" aria-label="Cart">' + ICON.bag + '<span class="badge" data-badge hidden>0</span></a>' +
      '</div>';
    document.body.prepend(header);

    var drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML =
      '<div class="drawer__scrim" data-close-menu></div>' +
      '<aside class="drawer__panel" role="dialog" aria-label="Menu">' +
        '<div class="drawer__head"><span class="brand">Lume</span><button class="icon-btn" data-close-menu aria-label="Close menu">' + ICON.close + '</button></div>' +
        '<nav class="drawer__nav">' +
          nav.map(function (n, i) { return '<a href="' + n.href + '" data-close-menu><span>0' + (i + 1) + '</span>' + n.label + '</a>'; }).join("") +
        '</nav>' +
        '<p class="drawer__foot">Lighting crafted for quiet evenings.<br>Free shipping &amp; 30-day returns.</p>' +
      '</aside>';
    document.body.appendChild(drawer);

    function setMenu(open) {
      drawer.classList.toggle("open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.documentElement.classList.toggle("no-scroll", open);
    }
    $("[data-open-menu]", header).addEventListener("click", function () { setMenu(true); });
    $all("[data-close-menu]", drawer).forEach(function (el) { el.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function renderFooter() {
    var f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = '<div class="wrap"><span class="brand">Lume</span><span>© ' + new Date().getFullYear() + ' Lume Lighting. Crafted for quiet evenings.</span></div>';
    document.body.appendChild(f);
  }

  var toastTimer;
  function toast(msg) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  function pillCard(p) {
    return '<a class="pill-card" href="/product?id=' + p.id + '">' +
      '<span class="pill-card__glow"></span>' +
      '<img src="/' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' +
      '<span class="pill-card__name">' + esc(p.short[0]) + '<br>' + esc(p.short[1]) + '</span>' +
      '<span class="pill-card__price">' + money(p.price) + '</span>' +
    '</a>';
  }

  // ---------- pages ----------
  function renderHome(main) {
    var featured = byId("helix");
    main.innerHTML =
      '<section class="hero wrap">' +
        '<div class="hero__copy">' +
          '<h1 class="display gold">Discover</h1>' +
          '<p class="eyebrow">New Collection</p>' +
          '<p class="hero__lead">Sculptural lamps that soften the edges of the evening — warm light, honest materials, quiet forms.</p>' +
          '<a class="btn btn--gold" href="/product?id=' + featured.id + '">Shop the ' + esc(featured.name) + ' <span class="btn__icon">' + ICON.arrow + '</span></a>' +
        '</div>' +
        '<a class="hero__feature" href="/product?id=' + featured.id + '" aria-label="' + esc(featured.name) + '">' +
          '<span class="hero__halo"></span>' +
          '<img src="/' + featured.img + '" alt="' + esc(featured.name) + '">' +
          '<span class="hero__tag">' + esc(featured.name) + ' · ' + money(featured.price) + '</span>' +
        '</a>' +
      '</section>' +
      '<section class="collection wrap" id="collection">' +
        '<div class="section-head">' +
          '<h2 class="h2">The Collection</h2>' +
          '<div class="filters" role="tablist" aria-label="Filter lamps">' +
            '<button role="tab" class="chip active" data-filter="all" aria-selected="true">All</button>' +
            '<button role="tab" class="chip" data-filter="ambient" aria-selected="false">Ambient</button>' +
            '<button role="tab" class="chip" data-filter="task" aria-selected="false">Task</button>' +
          '</div>' +
        '</div>' +
        '<div class="rail" data-rail></div>' +
      '</section>' +
      '<section class="features wrap">' +
        feature('<span class="feature__art feature__art--svg">' + ICON.blob + '</span>', "Warm Glow", "Tinted glass creating warm, diffused ambient glow.") +
        feature('<span class="feature__art"><img src="/img/halo.webp" alt=""></span>', "Soft Light", "Soft ambient lighting for cosy evenings and gatherings.") +
        feature('<span class="feature__art feature__art--svg feature__art--icon">' + ICON.shield + '</span>', "Made to Last", "Two-year warranty, free shipping and 30-day returns on every lamp.") +
      '</section>';

    var rail = $("[data-rail]", main);
    function draw(filter) {
      rail.innerHTML = PRODUCTS.filter(function (p) { return filter === "all" || p.category === filter; }).map(pillCard).join("");
      rail.scrollLeft = 0;
    }
    draw("all");
    $all("[data-filter]", main).forEach(function (b) {
      b.addEventListener("click", function () {
        $all("[data-filter]", main).forEach(function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", String(x === b)); });
        draw(b.getAttribute("data-filter"));
      });
    });
  }

  function feature(art, title, text) {
    return '<article class="feature">' + art + '<div><h3 class="feature__title gold">' + title + '</h3><p>' + text + '</p></div></article>';
  }

  function renderProduct(main) {
    var id = new URLSearchParams(location.search).get("id");
    var p = byId(id) || PRODUCTS[0];
    document.title = p.name + " — Lume";
    var qty = 1;
    var others = PRODUCTS.filter(function (x) { return x.id !== p.id && x.category === p.category; }).slice(0, 6);

    main.innerHTML =
      '<div class="product wrap">' +
        '<section class="stage">' +
          '<a class="back-link" href="/">' + ICON.back + 'Back</a>' +
          '<h1 class="display stage__title gold"><span>' + esc(p.short[0]) + '</span><span>' + esc(p.short[1]) + '</span></h1>' +
          '<div class="stage__lamp">' +
            '<span class="stage__glow"></span>' +
            '<img src="/' + p.img + '" alt="' + esc(p.name) + '">' +
            p.hotspots.map(function (h, i) {
              var side = h.x > 50 ? "left" : "right";
              return '<div class="hotspot hotspot--' + side + '" style="--x:' + h.x + '%;--y:' + h.y + '%">' +
                '<button class="hotspot__btn" aria-expanded="false" aria-controls="hs' + i + '">' +
                  '<span class="hotspot__label">' + esc(h.label) + '</span><span class="hotspot__dot">' + ICON.arrow + '</span>' +
                '</button>' +
                '<div class="hotspot__pop" id="hs' + i + '" role="note">' + esc(h.text) + '</div>' +
              '</div>';
            }).join("") +
          '</div>' +
          '<button class="buy-orb" data-buy aria-label="Buy ' + esc(p.name) + '">' + ICON.bag + '<span>Buy</span></button>' +
        '</section>' +
        '<section class="details">' +
          '<p class="eyebrow">' + (p.category === "ambient" ? "Ambient lighting" : "Task lighting") + '</p>' +
          '<h2 class="details__name">' + esc(p.name) + '</h2>' +
          '<p class="details__price gold">' + money(p.price) + '<small>.00</small></p>' +
          '<p class="details__tagline">' + esc(p.tagline) + '</p>' +
          '<p class="details__desc">' + esc(p.description) + '</p>' +
          '<dl class="specs">' + Object.keys(p.specs).map(function (k) { return '<div><dt>' + k + '</dt><dd>' + esc(p.specs[k]) + '</dd></div>'; }).join("") + '</dl>' +
          '<div class="purchase">' +
            '<div class="stepper" aria-label="Quantity">' +
              '<button class="step" data-dec aria-label="Decrease quantity">' + ICON.minus + '</button>' +
              '<output data-qty aria-live="polite">1</output>' +
              '<button class="step step--light" data-inc aria-label="Increase quantity">' + ICON.plus + '</button>' +
            '</div>' +
            '<button class="btn btn--gold btn--wide" data-add>Add to cart <span class="btn__icon">' + ICON.bag + '</span></button>' +
          '</div>' +
          '<p class="assurance">' + ICON.check + 'Free shipping + return · Ships in 2–4 days</p>' +
        '</section>' +
      '</div>' +
      (others.length ? '<section class="related wrap"><div class="section-head"><h2 class="h2">You may also like</h2></div><div class="rail">' + others.map(pillCard).join("") + '</div></section>' : "");

    var out = $("[data-qty]", main);
    $("[data-dec]", main).addEventListener("click", function () { qty = Math.max(1, qty - 1); out.textContent = qty; });
    $("[data-inc]", main).addEventListener("click", function () { qty = Math.min(99, qty + 1); out.textContent = qty; });
    function added(n) {
      addToCart(p.id, n);
      toast(ICON.check + '<span>' + esc(p.name) + (n > 1 ? " ×" + n : "") + ' added</span><a href="/cart">View cart</a>');
    }
    $("[data-add]", main).addEventListener("click", function () { added(qty); });
    $("[data-buy]", main).addEventListener("click", function () { addToCart(p.id, 1); location.href = "/cart"; });

    $all(".hotspot", main).forEach(function (hs) {
      var btn = $(".hotspot__btn", hs);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !hs.classList.contains("open");
        $all(".hotspot", main).forEach(function (o) { o.classList.remove("open"); $(".hotspot__btn", o).setAttribute("aria-expanded", "false"); });
        hs.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    document.addEventListener("click", function () {
      $all(".hotspot.open", main).forEach(function (o) { o.classList.remove("open"); $(".hotspot__btn", o).setAttribute("aria-expanded", "false"); });
    });
  }

  function renderCart(main) {
    main.innerHTML = '<div class="cart wrap"><div class="cart__list"><h1 class="display gold">Cart</h1><p class="eyebrow" data-sub></p><div data-items></div></div><aside class="cart__summary" data-summary></aside></div>';
    draw();

    function draw() {
      var items = cartItems();
      var count = cartCount();
      $("[data-sub]", main).textContent = count ? count + " item" + (count > 1 ? "s" : "") + " awaiting checkout" : "Your cart is empty";
      var list = $("[data-items]", main);
      var summary = $("[data-summary]", main);

      if (!items.length) {
        list.innerHTML = '<div class="empty"><img src="/img/cubo.webp" alt=""><p>Nothing here yet — find a lamp that suits your evenings.</p><a class="btn btn--gold" href="/#collection">Browse the collection <span class="btn__icon">' + ICON.arrow + '</span></a></div>';
        summary.hidden = true;
        return;
      }
      summary.hidden = false;
      list.innerHTML = items.map(function (i) {
        var p = i.product;
        return '<article class="line" data-id="' + p.id + '">' +
          '<a class="line__thumb" href="/product?id=' + p.id + '"><img src="/' + p.img + '" alt="' + esc(p.name) + '"></a>' +
          '<div class="line__body">' +
            '<a class="line__name" href="/product?id=' + p.id + '">' + esc(p.name) + '</a>' +
            '<p class="line__price gold">' + money(p.price * i.qty) + '</p>' +
            '<div class="stepper">' +
              '<button class="step" data-act="dec" aria-label="Decrease ' + esc(p.name) + '">' + ICON.minus + '</button>' +
              '<output>' + i.qty + '</output>' +
              '<button class="step step--light" data-act="inc" aria-label="Increase ' + esc(p.name) + '">' + ICON.plus + '</button>' +
            '</div>' +
          '</div>' +
          '<button class="line__remove icon-btn" data-act="remove" aria-label="Remove ' + esc(p.name) + '">' + ICON.close + '</button>' +
        '</article>';
      }).join("");

      var total = cartTotal();
      summary.innerHTML =
        '<h2 class="summary__title">Order summary</h2>' +
        '<dl class="summary__rows">' +
          '<div><dt>Subtotal</dt><dd>' + money(total) + '.00</dd></div>' +
          '<div><dt>Shipping</dt><dd>Free</dd></div>' +
        '</dl>' +
        '<div class="summary__total">' +
          '<p class="summary__ship">Free shipping<br>+ return</p>' +
          '<p class="summary__amount gold">' + money(total) + '<span>.00</span></p>' +
        '</div>' +
        '<div class="swipe" data-swipe>' +
          '<button class="swipe__knob" data-knob aria-label="Slide or press to place order">' + ICON.check + '</button>' +
          '<span class="swipe__label">Order</span>' +
          '<span class="swipe__chev">' + ICON.chev + '</span>' +
        '</div>' +
        '<p class="summary__hint">Slide to confirm your order</p>';

      initSwipe($("[data-swipe]", summary), placeOrder);
    }

    main.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var id = btn.closest("[data-id]").getAttribute("data-id");
      var c = readCart();
      var act = btn.getAttribute("data-act");
      if (act === "inc") setQty(id, (c[id] || 0) + 1);
      else if (act === "dec") setQty(id, (c[id] || 0) - 1);
      else if (act === "remove") setQty(id, 0);
      draw();
    });

    function placeOrder() {
      var total = cartTotal();
      var orderNo = "LM-" + Math.floor(100000 + Math.random() * 900000);
      writeCart({});
      var m = document.createElement("div");
      m.className = "modal";
      m.innerHTML = '<div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="ok-title">' +
        '<span class="modal__check">' + ICON.check + '</span>' +
        '<h2 id="ok-title" class="gold">Order placed</h2>' +
        '<p>Thank you — order <strong>' + orderNo + '</strong> for ' + money(total) + '.00 is confirmed. We\'ll email you when it ships.</p>' +
        '<a class="btn btn--gold" href="/">Continue shopping <span class="btn__icon">' + ICON.arrow + '</span></a>' +
      '</div>';
      document.body.appendChild(m);
      requestAnimationFrame(function () { m.classList.add("show"); });
      draw();
    }
  }

  function initSwipe(track, onDone) {
    var knob = $("[data-knob]", track);
    var dragging = false, startX = 0, x = 0, max = 0, done = false, moved = false;
    function setX(v) { x = Math.max(0, Math.min(max, v)); knob.style.transform = "translateX(" + x + "px)"; track.style.setProperty("--p", max ? x / max : 0); }
    function finish() {
      done = true;
      track.classList.add("done");
      setX(max);
      setTimeout(onDone, 350);
    }
    knob.addEventListener("pointerdown", function (e) {
      if (done) return;
      dragging = true; moved = false;
      max = track.clientWidth - knob.offsetWidth - 12;
      startX = e.clientX - x;
      knob.setPointerCapture(e.pointerId);
      track.classList.add("dragging");
    });
    knob.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX - x) > 2) moved = true;
      setX(e.clientX - startX);
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
      if (x > max * 0.82) finish(); else setX(0);
    }
    knob.addEventListener("pointerup", release);
    knob.addEventListener("pointercancel", release);
    // Keyboard / tap fallback: activating the knob without dragging places the order.
    knob.addEventListener("click", function () {
      if (done || moved) return;
      max = track.clientWidth - knob.offsetWidth - 12;
      finish();
    });
  }

  // ---------- boot ----------
  var page = document.body.getAttribute("data-page");
  renderHeader(page);
  var main = $("#main");
  if (page === "home") renderHome(main);
  else if (page === "product") renderProduct(main);
  else if (page === "cart") renderCart(main);
  renderFooter();
  updateBadge();
  window.addEventListener("storage", function (e) { if (e.key === CART_KEY) updateBadge(); });
})();
