// Authentication layer. Uses Supabase Auth when configured in js/config.js,
// otherwise falls back to a browser-only demo store.
(function () {
  "use strict";
  var cfg = window.LUME_CONFIG || {};
  var listeners = [];
  function emit(u) { listeners.forEach(function (cb) { try { cb(u); } catch (e) { /* ignore */ } }); }

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  async function sha256(text) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  // ---------- demo (browser-only) ----------
  var USERS = "lume-demo-users", SESSION = "lume-demo-session";
  var demo = {
    mode: "demo",
    getUser: function () { return Promise.resolve(store(SESSION)); },
    signUp: async function (o) {
      var users = store(USERS) || {};
      var email = o.email.trim().toLowerCase();
      if (users[email]) throw new Error("An account with this email already exists.");
      users[email] = { name: o.name.trim(), hash: await sha256(email + ":" + o.password), created: Date.now() };
      store(USERS, users);
      var u = { email: email, name: users[email].name };
      store(SESSION, u); emit(u);
      return { user: u, needsConfirmation: false };
    },
    signIn: async function (o) {
      var users = store(USERS) || {};
      var email = o.email.trim().toLowerCase();
      var rec = users[email];
      if (!rec || rec.hash !== await sha256(email + ":" + o.password)) throw new Error("Incorrect email or password.");
      var u = { email: email, name: rec.name };
      store(SESSION, u); emit(u);
      return { user: u };
    },
    signOut: function () { store(SESSION, null); emit(null); return Promise.resolve(); },
    resetPassword: function () { return Promise.reject(new Error("Password reset needs a connected account service.")); }
  };

  // ---------- Supabase ----------
  function supa() {
    var clientP = null;
    function client() {
      if (clientP) return clientP;
      clientP = new Promise(function (resolve, reject) {
        if (window.supabase) return resolve(window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey));
        var s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.onload = function () { resolve(window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey)); };
        s.onerror = function () { reject(new Error("Could not reach the account service.")); };
        document.head.appendChild(s);
      });
      clientP.then(function (c) {
        c.auth.onAuthStateChange(function (_e, session) { emit(map(session && session.user)); });
      });
      return clientP;
    }
    function map(u) { return u ? { email: u.email, name: (u.user_metadata && u.user_metadata.name) || "" } : null; }
    return {
      mode: "supabase",
      getUser: function () {
        return client().then(function (c) { return c.auth.getSession(); })
          .then(function (r) { return map(r.data.session && r.data.session.user); })
          .catch(function () { return null; });
      },
      signUp: async function (o) {
        var c = await client();
        var r = await c.auth.signUp({ email: o.email.trim(), password: o.password, options: { data: { name: o.name.trim() }, emailRedirectTo: location.origin + "/account" } });
        if (r.error) throw r.error;
        return { user: map(r.data.user), needsConfirmation: !r.data.session };
      },
      signIn: async function (o) {
        var c = await client();
        var r = await c.auth.signInWithPassword({ email: o.email.trim(), password: o.password });
        if (r.error) throw r.error;
        return { user: map(r.data.user) };
      },
      signOut: async function () { var c = await client(); await c.auth.signOut(); emit(null); },
      resetPassword: async function (email) {
        var c = await client();
        var r = await c.auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + "/account" });
        if (r.error) throw r.error;
      }
    };
  }

  var impl = cfg.supabaseUrl && cfg.supabaseKey ? supa() : demo;
  impl.onChange = function (cb) { listeners.push(cb); };
  window.LumeAuth = impl;
  window.addEventListener("storage", function (e) { if (impl.mode === "demo" && e.key === SESSION) emit(store(SESSION)); });
})();
