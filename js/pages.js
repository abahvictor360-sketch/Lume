// Contact, legal, and account pages. Registered on window.LumePages and
// rendered by app.js with shared helpers.
(function () {
  "use strict";
  var cfg = window.LUME_CONFIG || {};
  var pages = (window.LumePages = window.LumePages || {});

  function nextParam() {
    var n = new URLSearchParams(location.search).get("next") || "/account";
    return /^\/(?!\/)/.test(n) ? n : "/account"; // same-origin paths only
  }

  // ---------- contact ----------
  pages.contact = function (main, h) {
    var I = h.ICON;
    var faqs = [
      ["How long does shipping take?", "Orders ship from our studio within 1–2 business days and usually arrive in 2–4 business days. Shipping is free on every order."],
      ["What is your return policy?", "If a lamp isn't right for your space, return it within 30 days of delivery in its original condition for a full refund. Return shipping is on us."],
      ["Do the lamps come with bulbs?", "Yes. Every lamp ships with a warm 2700K LED or integrated LED module, so it's ready to use out of the box."],
      ["Is there a warranty?", "All Lume lamps carry a two-year warranty covering manufacturing defects in materials and electronics."],
      ["Can I order for a project or hotel?", "Absolutely. Write to us with quantities and timelines and we'll put together trade pricing."]
    ];
    main.innerHTML =
      '<section class="page-hero wrap">' +
        '<h1 class="display gold">Contact</h1>' +
        '<p class="eyebrow">We\'d love to hear from you</p>' +
      '</section>' +
      '<section class="contact wrap">' +
        '<div class="contact__info">' +
          infoCard(I.mail, "Email", '<a href="mailto:' + h.esc(cfg.contactEmail) + '">' + h.esc(cfg.contactEmail) + '</a>') +
          infoCard(I.phone, "Phone", '<a href="tel:' + h.esc((cfg.contactPhone || "").replace(/[^+\d]/g, "")) + '">' + h.esc(cfg.contactPhone) + '</a>') +
          infoCard(I.pin, "Studio", h.esc(cfg.studioAddress)) +
          infoCard(I.clock, "Hours", "Mon – Fri · 9:00 – 18:00<br>Sat · 10:00 – 16:00") +
        '</div>' +
        '<form class="card form" data-contact novalidate>' +
          '<h2 class="form__title">Send us a message</h2>' +
          '<div class="form__row">' +
            field("name", "Name", "text", "name", true) +
            field("email", "Email", "email", "email", true) +
          '</div>' +
          '<label class="field"><span>Topic</span><select name="topic">' +
            ["Order question", "Product advice", "Returns & warranty", "Trade & projects", "Something else"].map(function (t) { return "<option>" + t + "</option>"; }).join("") +
          '</select></label>' +
          '<label class="field"><span>Message</span><textarea name="message" rows="5" required minlength="10" placeholder="How can we help?"></textarea><em class="field__err"></em></label>' +
          '<p class="form__status" data-status role="status" aria-live="polite"></p>' +
          '<button class="btn btn--gold btn--wide" type="submit">Send message <span class="btn__icon">' + I.arrow + '</span></button>' +
        '</form>' +
      '</section>' +
      '<section class="faq wrap" id="faq">' +
        '<h2 class="h2">Frequently asked</h2>' +
        '<div class="faq__list">' + faqs.map(function (f) {
          return '<details class="faq__item"><summary>' + f[0] + '<span class="faq__icon">' + I.plus + '</span></summary><p>' + f[1] + '</p></details>';
        }).join("") + '</div>' +
      '</section>';

    var form = h.$("[data-contact]", main);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var d = new FormData(form);
      var body = d.get("message") + "\n\nFrom: " + d.get("name") + " (" + d.get("email") + ")";
      var href = "mailto:" + cfg.contactEmail + "?subject=" + encodeURIComponent("[" + d.get("topic") + "] Message from " + d.get("name")) + "&body=" + encodeURIComponent(body);
      location.href = href;
      setStatus(form, "ok", "Your email app should open with the message ready to send. If it doesn't, write to us at " + h.esc(cfg.contactEmail) + ".");
    });
    if (location.hash === "#faq") setTimeout(function () { h.$("#faq").scrollIntoView(); }, 50);
  };

  function infoCard(icon, label, value) {
    return '<div class="info-card"><span class="info-card__icon">' + icon + '</span><div><p class="info-card__label">' + label + '</p><p class="info-card__value">' + value + '</p></div></div>';
  }

  function field(name, label, type, autocomplete, required, extra) {
    return '<label class="field"><span>' + label + '</span>' +
      '<input name="' + name + '" type="' + type + '" autocomplete="' + autocomplete + '"' + (required ? " required" : "") + (extra || "") + '>' +
      '<em class="field__err"></em></label>';
  }

  function passwordField(name, label, autocomplete, extra) {
    return '<label class="field field--pw"><span>' + label + '</span>' +
      '<span class="field__wrap"><input name="' + name + '" type="password" autocomplete="' + autocomplete + '" required' + (extra || "") + '>' +
      '<button type="button" class="field__toggle" data-toggle-pw aria-label="Show password"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></span>' +
      '<em class="field__err"></em></label>';
  }

  function validate(form) {
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll("input, textarea"), function (el) {
      var err = el.closest(".field") && el.closest(".field").querySelector(".field__err");
      var msg = "";
      if (el.type === "checkbox") { if (el.required && !el.checked) msg = "Please accept to continue."; }
      else if (el.required && !el.value.trim()) msg = "This field is required.";
      else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) msg = "Enter a valid email address.";
      else if (el.minLength > 0 && el.value.length < el.minLength) msg = "Must be at least " + el.minLength + " characters.";
      else if (el.dataset.match && el.value !== form.elements[el.dataset.match].value) msg = "Passwords don't match.";
      if (err) err.textContent = msg;
      el.toggleAttribute("aria-invalid", !!msg);
      if (msg && ok) { ok = false; el.focus(); }
    });
    return ok;
  }

  function setStatus(form, kind, html) {
    var s = form.querySelector("[data-status]");
    s.className = "form__status" + (kind ? " is-" + kind : "");
    s.innerHTML = html;
  }

  function bindPwToggles(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-toggle-pw]"), function (b) {
      b.addEventListener("click", function () {
        var input = b.parentNode.querySelector("input");
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        b.setAttribute("aria-label", show ? "Hide password" : "Show password");
        b.classList.toggle("on", show);
      });
    });
  }

  // ---------- legal ----------
  function legal(main, h, title, intro, sections) {
    main.innerHTML =
      '<section class="page-hero wrap">' +
        '<h1 class="display display--md gold">' + title + '</h1>' +
        '<p class="eyebrow">Last updated October 5, 2026</p>' +
      '</section>' +
      '<div class="legal wrap">' +
        '<nav class="legal__toc" aria-label="On this page"><p>On this page</p>' +
          sections.map(function (s, i) { return '<a href="#' + s[0] + '"><span>' + String(i + 1).padStart(2, "0") + '</span>' + s[1] + '</a>'; }).join("") +
        '</nav>' +
        '<article class="legal__body">' +
          '<p class="legal__intro">' + intro + '</p>' +
          sections.map(function (s, i) {
            return '<section id="' + s[0] + '"><h2><span>' + String(i + 1).padStart(2, "0") + '</span>' + s[1] + '</h2>' + s[2] + '</section>';
          }).join("") +
        '</article>' +
      '</div>';
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
    }
  }

  pages.terms = function (main, h) {
    var email = h.esc(cfg.contactEmail);
    legal(main, h, "Terms &amp; Conditions",
      "These Terms &amp; Conditions govern your use of the Lume website and any purchase you make from Lume Lighting (\"Lume\", \"we\", \"us\"). By using the site or placing an order you agree to these terms. Please read them carefully.",
      [
        ["use", "Using our site", "<p>You may browse and shop on this site for personal, non-commercial use. You agree not to misuse the site, interfere with its operation, attempt to gain unauthorised access, or use automated means to scrape content.</p>"],
        ["orders", "Orders &amp; pricing", "<p>All prices are shown in US dollars and include applicable taxes unless stated otherwise. Placing an order is an offer to buy; a contract is formed when we confirm your order by email.</p><p>We work hard to keep prices and product details accurate. If we discover an error after you order, we'll contact you and you may cancel for a full refund. We may limit quantities or refuse orders at our discretion.</p>"],
        ["payment", "Payment", "<p>Payment is taken when your order is confirmed. We accept major credit and debit cards and other methods shown at checkout. Payments are processed by secure third-party providers; we never store full card numbers.</p>"],
        ["shipping", "Shipping &amp; delivery", "<p>Shipping is free on all orders. Orders usually leave our studio within 1–2 business days and arrive within 2–4 business days. Delivery estimates are not guaranteed. Risk of loss passes to you on delivery.</p>"],
        ["returns", "Returns &amp; refunds", "<p>You may return any item within <strong>30 days of delivery</strong> for a full refund, provided it is unused, undamaged, and in its original packaging. Return shipping is free. Contact us at <a href=\"mailto:" + email + "\">" + email + "</a> to receive a prepaid label.</p><p>Refunds are issued to your original payment method within 5–10 business days of the return being received and inspected. If an item arrives damaged, tell us within 7 days and we'll replace or refund it.</p>"],
        ["warranty", "Warranty", "<p>Lume lamps include a <strong>two-year limited warranty</strong> against defects in materials and workmanship under normal use. The warranty does not cover wear and tear, accidental damage, misuse, unauthorised modification, or use with incompatible power supplies or bulbs.</p>"],
        ["safety", "Product use &amp; safety", "<p>Follow the instructions supplied with each lamp. Use only the included or recommended power adapters and bulbs, keep lamps away from water and heat sources, and unplug before cleaning. Lamps are not toys and should be kept out of reach of young children.</p>"],
        ["accounts", "Accounts", "<p>If you create an account, you're responsible for keeping your login details confidential and for activity under your account. Tell us promptly about any unauthorised use. We may suspend accounts that breach these terms.</p>"],
        ["ip", "Intellectual property", "<p>All content on this site, including text, product designs, photography, logos, and code, belongs to Lume or its licensors and is protected by intellectual-property laws. You may not copy or reuse it without our written permission.</p>"],
        ["liability", "Limitation of liability", "<p>To the fullest extent permitted by law, Lume is not liable for indirect, incidental, or consequential losses arising from your use of the site or our products. Our total liability for any claim is limited to the amount you paid for the product concerned. Nothing in these terms limits rights you have under consumer-protection law.</p>"],
        ["changes", "Changes to these terms", "<p>We may update these terms from time to time. The version posted on this page at the time of your order applies to that order.</p>"],
        ["contact", "Contact", "<p>Questions about these terms? Email <a href=\"mailto:" + email + "\">" + email + "</a> or visit our <a href=\"/contact\">contact page</a>.</p>"]
      ]);
  };

  pages.privacy = function (main, h) {
    var email = h.esc(cfg.contactEmail);
    legal(main, h, "Privacy Policy",
      "Your privacy matters to us. This policy explains what personal information Lume Lighting collects, how we use it, and the choices you have.",
      [
        ["collect", "Information we collect", "<ul><li><strong>Account details</strong>: your name, email address, and password (stored securely as a hash) when you sign up.</li><li><strong>Order details</strong>: shipping address, contact details, and the items you purchase.</li><li><strong>Messages</strong>: anything you send us through the contact form or by email.</li><li><strong>Technical data</strong>: basic device and browser information, and pages visited, used to keep the site working and secure.</li></ul><p>We do not collect or store full payment card numbers; payments are handled by our payment processor.</p>"],
        ["use", "How we use your information", "<ul><li>To process and deliver your orders, and handle returns and warranty claims.</li><li>To create and manage your account.</li><li>To reply to your questions and provide customer support.</li><li>To send order updates and, only if you opt in, occasional news about new collections.</li><li>To protect our site and customers against fraud and abuse.</li></ul>"],
        ["storage", "Cookies &amp; local storage", "<p>We use your browser's local storage to remember your cart and keep you signed in. We don't use third-party advertising cookies. You can clear this data at any time from your browser settings; doing so will empty your cart and sign you out.</p>"],
        ["sharing", "Sharing your information", "<p>We never sell your personal information. We share it only with service providers who help us run the store (such as payment processors, shipping carriers, and hosting and authentication providers), and only as needed for them to perform those services, or where required by law.</p>"],
        ["retention", "How long we keep it", "<p>We keep account information while your account is active and order records for as long as needed for accounting, tax, and warranty purposes. You can ask us to delete your account at any time.</p>"],
        ["rights", "Your rights", "<p>Depending on where you live, you may have the right to access, correct, delete, or export your personal information, and to object to or restrict certain processing. To make a request, email <a href=\"mailto:" + email + "\">" + email + "</a>. We'll respond within 30 days.</p>"],
        ["security", "Security", "<p>We use industry-standard safeguards, including encrypted connections (HTTPS) and hashed passwords, to protect your information. No method of transmission or storage is completely secure, but we work to protect your data and will notify you of any breach as required by law.</p>"],
        ["children", "Children", "<p>Our store is not directed at children under 16, and we do not knowingly collect their personal information.</p>"],
        ["changes", "Changes to this policy", "<p>We may update this policy from time to time. We'll post the new version here and update the date at the top of the page.</p>"],
        ["contact", "Contact", "<p>Questions about your privacy? Email <a href=\"mailto:" + email + "\">" + email + "</a> or write to us at " + h.esc(cfg.studioAddress) + ".</p>"]
      ]);
  };

  // ---------- auth ----------
  function authShell(main, h, title, sub, formHtml) {
    var demo = window.LumeAuth && window.LumeAuth.mode === "demo";
    main.innerHTML =
      '<section class="auth wrap">' +
        '<div class="auth__visual" aria-hidden="true">' +
          '<span class="auth__halo"></span>' +
          '<img src="/img/helix.webp" alt="">' +
          '<p class="auth__quote">“Light is the first<br>thing you feel<br>in a room.”</p>' +
        '</div>' +
        '<div class="auth__panel">' +
          '<h1 class="display display--md gold">' + title + '</h1>' +
          '<p class="eyebrow">' + sub + '</p>' +
          formHtml +
          (demo ? '<p class="auth__demo">Demo mode: accounts are saved in this browser only.</p>' : "") +
        '</div>' +
      '</section>';
    bindPwToggles(main);
  }

  function redirectIfSignedIn() {
    if (!window.LumeAuth) return;
    window.LumeAuth.getUser().then(function (u) { if (u) location.replace(nextParam()); });
  }

  pages.login = function (main, h) {
    redirectIfSignedIn();
    authShell(main, h, "Welcome back", "Log in to your Lume account",
      '<form class="form auth__form" data-login novalidate>' +
        field("email", "Email", "email", "email", true) +
        passwordField("password", "Password", "current-password") +
        '<div class="auth__row"><button type="button" class="link" data-forgot>Forgot password?</button></div>' +
        '<p class="form__status" data-status role="status" aria-live="polite"></p>' +
        '<button class="btn btn--gold btn--wide" type="submit">Log in <span class="btn__icon">' + h.ICON.arrow + '</span></button>' +
        '<p class="auth__switch">New to Lume? <a href="/signup' + location.search + '">Create an account</a></p>' +
      '</form>');

    var form = h.$("[data-login]", main);
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true; setStatus(form, "", "Signing in…");
      try {
        await window.LumeAuth.signIn({ email: form.email.value, password: form.password.value });
        setStatus(form, "ok", "Signed in. Redirecting…");
        location.href = nextParam();
      } catch (err) {
        setStatus(form, "err", h.esc(friendly(err)));
        btn.disabled = false;
      }
    });
    h.$("[data-forgot]", main).addEventListener("click", async function () {
      var email = form.email.value.trim();
      if (!email) { setStatus(form, "err", "Enter your email above, then tap “Forgot password?” again."); form.email.focus(); return; }
      try {
        await window.LumeAuth.resetPassword(email);
        setStatus(form, "ok", "If an account exists for " + h.esc(email) + ", a reset link is on its way.");
      } catch (err) { setStatus(form, "err", h.esc(friendly(err))); }
    });
  };

  pages.signup = function (main, h) {
    redirectIfSignedIn();
    authShell(main, h, "Join Lume", "Create an account for faster checkout",
      '<form class="form auth__form" data-signup novalidate>' +
        field("name", "Full name", "text", "name", true) +
        field("email", "Email", "email", "email", true) +
        passwordField("password", "Password", "new-password", ' minlength="8"') +
        '<div class="meter" data-meter aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
        '<p class="meter__hint" data-meter-hint>Use 8+ characters with a mix of letters, numbers and symbols.</p>' +
        passwordField("confirm", "Confirm password", "new-password", ' data-match="password"') +
        '<label class="field check"><input type="checkbox" name="agree" required><span>I agree to the <a href="/terms" target="_blank">Terms &amp; Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</span><em class="field__err"></em></label>' +
        '<p class="form__status" data-status role="status" aria-live="polite"></p>' +
        '<button class="btn btn--gold btn--wide" type="submit">Create account <span class="btn__icon">' + h.ICON.arrow + '</span></button>' +
        '<p class="auth__switch">Already have an account? <a href="/login' + location.search + '">Log in</a></p>' +
      '</form>');

    var form = h.$("[data-signup]", main);
    var bars = h.$all("[data-meter] span", main), hint = h.$("[data-meter-hint]", main);
    form.password.addEventListener("input", function () {
      var v = form.password.value, score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) score++;
      bars.forEach(function (b, i) { b.className = i < score ? "on s" + score : ""; });
      hint.textContent = !v ? "Use 8+ characters with a mix of letters, numbers and symbols." : ["Too short", "Weak", "Fair", "Good", "Strong"][score];
    });
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true; setStatus(form, "", "Creating your account…");
      try {
        var r = await window.LumeAuth.signUp({ name: form.elements.name.value, email: form.email.value, password: form.password.value });
        if (r.needsConfirmation) {
          setStatus(form, "ok", "Almost there! Check " + h.esc(form.email.value.trim()) + " for a link to confirm your account.");
        } else {
          setStatus(form, "ok", "Welcome to Lume! Redirecting…");
          location.href = nextParam();
        }
      } catch (err) {
        setStatus(form, "err", h.esc(friendly(err)));
        btn.disabled = false;
      }
    });
  };

  pages.account = function (main, h) {
    main.innerHTML = '<section class="page-hero wrap"><p class="eyebrow">Loading…</p></section>';
    window.LumeAuth.getUser().then(function (u) {
      if (!u) { location.replace("/login?next=/account"); return; }
      var orders = [];
      try { orders = (JSON.parse(localStorage.getItem("lume-orders") || "[]") || []).filter(function (o) { return o.email === u.email; }); } catch (e) { /* ignore */ }
      main.innerHTML =
        '<section class="page-hero wrap account__hero">' +
          '<span class="avatar avatar--lg">' + h.esc(h.initials(u)) + '</span>' +
          '<div><h1 class="display display--md gold">Hello' + (u.name ? ", " + h.esc(u.name.split(" ")[0]) : "") + '</h1>' +
          '<p class="eyebrow">' + h.esc(u.email) + '</p></div>' +
        '</section>' +
        '<section class="account wrap">' +
          '<div class="card account__orders"><h2 class="form__title">Your orders</h2>' +
            (orders.length ? '<ul class="orders">' + orders.slice().reverse().map(function (o) {
              return '<li><div><strong>' + h.esc(o.id) + '</strong><span>' + new Date(o.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) + ' · ' + o.count + ' item' + (o.count > 1 ? "s" : "") + '</span></div><span class="gold">' + h.money(o.total) + '.00</span></li>';
            }).join("") + '</ul>'
              : '<p class="muted">No orders yet. When you place an order it will appear here.</p><a class="btn btn--gold" href="/#collection">Browse the collection <span class="btn__icon">' + h.ICON.arrow + '</span></a>') +
          '</div>' +
          '<div class="card account__side">' +
            '<h2 class="form__title">Account</h2>' +
            '<dl class="summary__rows"><div><dt>Name</dt><dd>' + h.esc(u.name || "Not set") + '</dd></div><div><dt>Email</dt><dd>' + h.esc(u.email) + '</dd></div></dl>' +
            '<a class="link-row" href="/cart">View cart</a>' +
            '<a class="link-row" href="/contact">Get help</a>' +
            '<button class="btn btn--ghost btn--wide" data-signout>Sign out</button>' +
          '</div>' +
        '</section>';
      h.$("[data-signout]", main).addEventListener("click", function () {
        window.LumeAuth.signOut().then(function () { location.href = "/"; });
      });
    });
  };

  function friendly(err) {
    var m = (err && err.message) || "Something went wrong. Please try again.";
    if (/invalid login credentials/i.test(m)) return "Incorrect email or password.";
    if (/already registered/i.test(m)) return "An account with this email already exists.";
    return m;
  }
})();
