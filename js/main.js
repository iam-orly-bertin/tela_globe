// ===== Edit these values =====
const CONFIG = {
  githubRepo: "iam-orly-bertin/tela_globe",                      // where you publish the APK, as "username/repository", for example "turry/telaglobe"
  apkName: "telaglobe.apk",            // the file name you attach to every GitHub release (keep it the same every time)
  apkUrl: "assets/app/telaglobe.apk",  // only used when githubRepo is empty (APK stored inside this site)
  version: "1.0",                      // shown until GitHub answers; then the release tag is used
  size: "",
  updated: "November 2026",
  whatsapp: "25767846547",
  reviewsUrl: "https://script.google.com/macros/s/AKfycbwejo5b7h3mGYMBWapywG9kf3iPwT9PCrongWCGQ6ae5l-cGjVFzfPTUz6RmUueKCIq/exec"
  // the Google Apps Script web app link ending in /exec (see reviews_apps_script.gs). Empty = reviews show "open soon"
};
// =============================
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SHOTS = {
  home: "Home", categories: "Categories", products: "Product list", product: "Product page", cart: "Cart and delivery",
  placed: "Order placed", orders: "My orders", studio: "Photo and video studio", booking: "Book a session",
  bookings: "My bookings", login: "Log in", signup: "Create account"
};
const TOUR_ALL = {
  shop: { title: "Browse the shop", text: "Search, hot deals and categories make every product easy to reach. See the price, stock and warranty before you buy.", list: ["home", "categories", "products", "product"] },
  order: { title: "Order in a minute", text: "Choose your delivery area, check the total and place your order. Send it to the seller on WhatsApp and follow its status.", list: ["cart", "placed", "orders"] },
  studio: { title: "Book your session", text: "Pick a service, choose the date and the place, then send your request. The studio confirms and you follow it in My bookings.", list: ["studio", "booking", "bookings"] },
  account: { title: "Your account", text: "Log in with email or continue with Google. Creating an account takes less than a minute.", list: ["login", "signup"] }
};
const src = n => `assets/screenshots/${n}.webp`;

// ---------- APK links ----------
const setApk = url => $$("[data-apk]").forEach(a => a.href = url);
const soon = () => $$("[data-apk]").forEach(a => { a.classList.add("off"); a.textContent = "APK coming soon"; });
const meta = () => $("#apkMeta").textContent = ["Version " + CONFIG.version, CONFIG.size, "Updated " + CONFIG.updated, "Android only"].filter(Boolean).join(" · ");
meta();

if (CONFIG.githubRepo) {
  // The newest GitHub release is always used: publish a new release and this page updates itself.
  setApk(`https://github.com/${CONFIG.githubRepo}/releases/latest/download/${CONFIG.apkName}`);
  fetch(`https://api.github.com/repos/${CONFIG.githubRepo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
    .then(r => { if (r.status === 404) { soon(); return null; } return r.ok ? r.json() : null; })
    .then(rel => {
      if (!rel) return;
      const files = rel.assets || [];
      const asset = files.find(a => a.name === CONFIG.apkName) || files.find(a => /\.apk$/i.test(a.name));
      if (!asset) { soon(); return; }
      setApk(asset.browser_download_url);
      CONFIG.version = String(rel.tag_name || CONFIG.version).replace(/^v/i, "");
      CONFIG.size = Math.round(asset.size / 1048576) + " MB";
      if (rel.published_at) CONFIG.updated = new Date(rel.published_at).toLocaleDateString("en", { month: "long", year: "numeric" });
      meta();
    }).catch(() => { /* offline or rate-limited: the direct link above still works */ });
} else {
  setApk(CONFIG.apkUrl);
  fetch(CONFIG.apkUrl, { method: "HEAD" }).then(r => {
    if (r.status === 404) { soon(); return; }
    const len = +r.headers.get("content-length");
    if (!CONFIG.size && len) { CONFIG.size = (len / 1048576).toFixed(0) + " MB"; meta(); }
  }).catch(() => { });
}
if (!/android/i.test(navigator.userAgent)) {
  const h = $("#deviceHint"); h.hidden = false;
  h.textContent = "On a computer or iPhone? Open this page on your Android phone to install the app.";
}

// ---------- WhatsApp (hidden until you set your own number) ----------
const waOk = /^\d{8,15}$/.test(CONFIG.whatsapp) && CONFIG.whatsapp !== "254700000000";
if (waOk) {
  const link = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello, I have a question about Tela Globe");
  $("#contact").href = link; $("#wa").href = link; $("#wa").hidden = false;
} else { $("#contactRow").hidden = true; }

$("#year").textContent = new Date().getFullYear();
$("#share").onclick = async () => {
  try {
    if (navigator.share) await navigator.share({ title: "Tela Globe", url: location.href });
    else { await navigator.clipboard.writeText(location.href); $("#share").textContent = "Link copied"; }
  } catch (e) { /* user closed the share sheet */ }
};

// ---------- Scroll effects ----------
const bar = $(".progress");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + "%";
}, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
$$(".reveal").forEach(el => io.observe(el));
const tl = $(".tilt");
if (tl && !still && matchMedia("(hover:hover)").matches) {
  tl.parentElement.addEventListener("mousemove", e => {
    const r = tl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tl.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  tl.parentElement.addEventListener("mouseleave", () => tl.style.transform = "");
}

// ---------- Screenshots: only the ones that really exist are used ----------
const exists = n => new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src(n); });

(async function screens() {
  const found = await Promise.all(Object.keys(SHOTS).map(async n => (await exists(n)) ? n : null));
  const has = new Set(found.filter(Boolean));
  const all = [...has];
  if (!all.length) { $("#tour").hidden = true; $("#screens").hidden = true; return; }

  const stack = (el, list) => { el.innerHTML = list.map(n => `<img src="${src(n)}" alt="${SHOTS[n]} screen of Tela Globe">`).join(""); };
  const show = (el, i) => $$("img", el).forEach((im, k) => im.classList.toggle("on", k === i));

  // Hero phone
  const hero = $("#heroScreen"), heroList = ["home", "product", "cart", "studio", "booking"].filter(n => has.has(n));
  const heroUse = heroList.length ? heroList : all; let hi = 0;
  stack(hero, heroUse); show(hero, 0);
  if (!still && heroUse.length > 1) setInterval(() => show(hero, hi = (hi + 1) % heroUse.length), 3200);

  // Tour
  const TOUR = {};
  for (const k in TOUR_ALL) { const list = TOUR_ALL[k].list.filter(n => has.has(n)); if (list.length) TOUR[k] = { ...TOUR_ALL[k], list }; }
  $$(".tab").forEach(b => { if (!TOUR[b.dataset.tab]) b.hidden = true; });
  let tab = Object.keys(TOUR)[0], ti = 0, timer; const ts = $("#tourScreen");
  const caption = () => { $("#tourText").textContent = TOUR[tab].text + " — " + SHOTS[TOUR[tab].list[ti]]; };
  function tour() {
    const t = TOUR[tab]; stack(ts, t.list); show(ts, ti);
    $("#tourTitle").textContent = t.title; caption();
    $("#tourDots").innerHTML = t.list.map((_, k) => `<i class="${k === ti ? "on" : ""}" data-k="${k}"></i>`).join("");
    $$(".tab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  }
  function step(d) {
    const n = TOUR[tab].list.length; ti = (ti + d + n) % n; show(ts, ti); caption();
    $$("#tourDots i").forEach((x, k) => x.classList.toggle("on", k === ti));
  }
  function auto() { clearInterval(timer); if (!still) timer = setInterval(() => step(1), 4200); }
  $$(".tab").forEach(b => b.onclick = () => { tab = b.dataset.tab; ti = 0; tour(); auto(); });
  $("#prev").onclick = () => { step(-1); auto(); }; $("#next").onclick = () => { step(1); auto(); };
  $("#tourDots").onclick = e => { if (e.target.dataset.k) { ti = +e.target.dataset.k; step(0); auto(); } };
  tour(); auto();

  // Gallery and viewer
  const rail = $("#rail"), vw = $("#viewer"); let vi = 0;
  rail.innerHTML = all.map((n, i) => `<figure data-i="${i}"><img src="${src(n)}" alt="${SHOTS[n]}" loading="lazy"><figcaption>${SHOTS[n]}</figcaption></figure>`).join("");
  function view(i) { vi = (i + all.length) % all.length; $("img", vw).src = src(all[vi]); $("#cap").textContent = SHOTS[all[vi]] + "  ·  " + (vi + 1) + "/" + all.length; }
  rail.onclick = e => { const f = e.target.closest("figure"); if (f) { view(+f.dataset.i); vw.showModal(); } };
  vw.onclick = e => {
    if (e.target === vw || e.target.classList.contains("close")) vw.close();
    if (e.target.classList.contains("l")) view(vi - 1);
    if (e.target.classList.contains("r")) view(vi + 1);
  };
  addEventListener("keydown", e => { if (vw.open) { if (e.key === "ArrowLeft") view(vi - 1); if (e.key === "ArrowRight") view(vi + 1); } });
})();

// ---------- Reviews ----------
// Reviews are saved in a Google Sheet through a Google Apps Script (see reviews_apps_script.gs).
// Only the ones you approve in the sheet are shown here.
const reviewsOn = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(CONFIG.reviewsUrl);
const rvList = $("#rvList"), rvForm = $("#rvForm"), rvMsg = $("#rvMsg");
const starSvg = '<svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>';
const starRow = n => [1, 2, 3, 4, 5].map(i => `<svg class="ic${i <= n ? " on" : ""}" aria-hidden="true"><use href="#i-star"/></svg>`).join("");
let rate = 0;

$("#rvPick").innerHTML = [1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="false" aria-label="${i} star${i > 1 ? "s" : ""}" data-v="${i}">${starSvg}</button>`).join("");
const paint = () => $$("#rvPick button").forEach(b => { const v = +b.dataset.v; b.classList.toggle("on", v <= rate); b.setAttribute("aria-checked", String(v === rate)); });
$("#rvPick").onclick = e => { const b = e.target.closest("button"); if (b) { rate = +b.dataset.v; paint(); } };
$("#rvText").oninput = e => $("#rvLeft").textContent = 500 - e.target.value.length;

const say = (t, err) => { rvMsg.hidden = false; rvMsg.textContent = t; rvMsg.classList.toggle("err", !!err); };

function reviewCard(r) {
  const el = document.createElement("article"); el.className = "rv";
  const head = document.createElement("div"); head.className = "rv-head";
  const av = document.createElement("div"); av.className = "av"; av.textContent = String(r.name || "?").trim().charAt(0).toUpperCase();
  const who = document.createElement("div");
  const nm = document.createElement("b"); nm.textContent = r.name;
  const dt = document.createElement("small");
  const d = new Date(r.date); dt.textContent = isNaN(d) ? "" : d.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
  who.append(nm, dt);
  const st = document.createElement("div"); st.className = "stars"; st.setAttribute("aria-label", r.rating + " out of 5"); st.innerHTML = starRow(+r.rating || 0);
  head.append(av, who, st);
  const p = document.createElement("p"); p.textContent = r.comment;
  el.append(head, p);
  return el;
}

function showReviews(data) {
  const list = Array.isArray(data.reviews) ? data.reviews : [];
  const n = +data.count || list.length;
  const avg = +data.average || (list.length ? list.reduce((s, r) => s + (+r.rating || 0), 0) / list.length : 0);
  $("#rvAvg").textContent = n ? avg.toFixed(1) : "–";
  $("#rvStars").innerHTML = starRow(n ? Math.round(avg) : 0);
  $("#rvCount").textContent = n ? n + (n > 1 ? " reviews" : " review") : "No reviews yet";
  if (!list.length) { rvList.innerHTML = '<p class="rv-note">Be the first to share your experience.</p>'; return; }
  rvList.replaceChildren(...list.map(reviewCard));
}

function loadReviews() {
  fetch(CONFIG.reviewsUrl).then(r => r.json()).then(d => { if (d && d.ok) showReviews(d); })
    .catch(() => { rvList.innerHTML = '<p class="rv-note">Reviews cannot be loaded right now.</p>'; });
}

if (!reviewsOn) {
  rvForm.hidden = true;
  rvList.innerHTML = '<p class="rv-note">Reviews will open soon.</p>';
} else {
  loadReviews();
  rvForm.onsubmit = async e => {
    e.preventDefault();
    const name = $("#rvName").value.trim(), comment = $("#rvText").value.trim();
    if (!name) return say("Please write your name.", true);
    if (!rate) return say("Please choose a rating from 1 to 5 stars.", true);
    if (comment.length < 5) return say("Please write a short review.", true);
    let last = 0; try { last = +localStorage.getItem("tg_review_at") || 0; } catch (_) { }
    if (Date.now() - last < 60000) return say("Please wait a minute before sending another review.", true);
    const btn = $("#rvSend"); btn.disabled = true;
    try {
      await fetch(CONFIG.reviewsUrl, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name, rating: rate, comment, website: $("#rvWeb").value })
      });
      try { localStorage.setItem("tg_review_at", String(Date.now())); } catch (_) { }
      rvForm.reset(); rate = 0; paint(); $("#rvLeft").textContent = "500";
      say("Thank you! Your review was sent. It will appear here after it is checked.");
      setTimeout(loadReviews, 2000);
    } catch (_) { say("It could not be sent. Check your connection and try again.", true); }
    btn.disabled = false;
  };
}


// ---------- Phone menu (burger) ----------
const burger = $("#burger"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); };
burger.onclick = () => setMenu(!menu.classList.contains("open"));
menu.onclick = e => { if (e.target.closest("a")) setMenu(false); };
document.addEventListener("click", e => { if (!e.target.closest(".top")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 900) setMenu(false); });