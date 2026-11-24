TELAGLOBE DOWNLOAD PAGE  (GitHub Pages + GitHub Releases)
=========================================================

FILES
  index.html               the page
  css/style.css            the design
  js/main.js               the behaviour  (top of the file = the values you edit)
  assets/screenshots/*.webp  phone screenshots (720x1504)
  assets/favicon.svg       the icon of the browser tab
  (there is NO apk in this folder: the APK lives in GitHub Releases)

EDIT js/main.js (top of the file)
  githubRepo -> "your-github-username/your-repository"   e.g. "turry/telaglobe"
  whatsapp   -> your real number, digits only with country code
                (the WhatsApp buttons stay hidden until you change it)

PUBLISH THE PAGE
  Put the CONTENT of this folder at the root of your GitHub repository
  (index.html must be at the root, not inside a "Web" folder).
  Repository > Settings > Pages > Source: "Deploy from a branch" > main / (root) > Save.
  Your page: https://USERNAME.github.io/REPOSITORY/

PUBLISH THE APK / A NEW VERSION
  Repository > Releases > Create a new release
    Tag: v1.0 (next time v1.1 ...)   Title: TelaGlobe 1.0
    Attach your APK named exactly:  telaglobe.apk
    Publish release  (do NOT tick "pre-release")
  The page shows the new version, size and date by itself.

ADD A HOME SCREENSHOT
  assets/screenshots/home.webp (720x1504). It appears automatically.

TEST ON YOUR PC
  python3 -m http.server 8080      then open http://localhost:8080
