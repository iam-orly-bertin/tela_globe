# Tela Globe

**Shop electronics. Book your photo session.**

Tela Globe is an Android app that brings two services together: ordering phones, laptops and TVs with delivery to your area, and booking photo and video sessions on the day you choose.

This repository hosts the official download page of the app and its releases.

### [Open the download page](https://iam-orly-bertin.github.io/tela_globe/)

[Download the latest APK](https://github.com/iam-orly-bertin/tela_globe/releases/latest/download/telaglobe.apk) | [All releases](https://github.com/iam-orly-bertin/tela_globe/releases)

---

## Screenshots

<p align="center">
  <img src="assets/screenshots/categories.webp" width="19%" alt="Categories">
  <img src="assets/screenshots/product.webp" width="19%" alt="Product page">
  <img src="assets/screenshots/cart.webp" width="19%" alt="Cart and delivery">
  <img src="assets/screenshots/studio.webp" width="19%" alt="Photo and video studio">
  <img src="assets/screenshots/booking.webp" width="19%" alt="Book a session">
</p>

## What the app does

**Shop**
- Search, categories, hot deals and brands in one tap
- Price, stock and warranty shown before you buy
- Delivery to your area, with the total shown up front

**Order**
- Place your order and send it to the seller on WhatsApp
- Follow every order from pending to delivered in My orders

**Studio**
- Book photo and video sessions for weddings, birthdays, events and portraits
- Choose the service, date and place, then follow the request in My bookings

**Account**
- Log in with email or continue with Google

## Install

The app is not on the Play Store yet, so Android asks a few extra questions. This is normal.

1. Download the APK from the [download page](https://iam-orly-bertin.github.io/tela_globe/) or from the link above.
2. Open the file. If Android blocks it, tap **Settings** and allow your browser to **install unknown apps**, then go back.
3. If **Play Protect** warns you, tap **More details**, then **Install anyway**.
4. Open Tela Globe, create your account and start.

## Good to know

- **Android only.** The app does not work on iPhone yet.
- **Install it only from this page** or from this repository's releases.
- **The first opening can be slow.** The server sleeps when nobody uses it, so the first start can take up to a minute. After that it is fast.

## Contact

Questions or problems? Use the WhatsApp button on the [download page](https://iam-orly-bertin.github.io/tela_globe/).

---

## For the site owner

The download page is a static site (HTML, CSS and JavaScript) served with GitHub Pages. The APK is not stored in the repository: it lives in GitHub Releases.

```
index.html                  the page
css/style.css               the design
js/main.js                  the behaviour (settings at the top of the file)
assets/screenshots/*.webp   phone screenshots (720x1504)
assets/favicon.svg          browser tab icon
```

**Publish a new version**

1. Go to Releases, then Create a new release.
2. Set the tag (for example `v1.1`) and the title (for example `Tela Globe 1.1`).
3. Attach the APK named exactly `telaglobe.apk`.
4. Publish the release. Do not tick "pre-release".

The page reads the latest release and updates the version, size and date by itself.

**Test on your computer**

```
python3 -m http.server 8080
```

Then open http://localhost:8080

&copy; Tela Globe. All rights reserved.