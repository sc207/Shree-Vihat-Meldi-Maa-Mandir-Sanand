# Shri Vihat Meldi Mata Mandir — Temple Management Platform

A **static, no-build, vanilla-JavaScript single-page app** for running a temple:
devotees, donations (cash **and** in-kind, with 80G receipts + Dhanyavaad
certificates), poojas, festivals/events, a multi-team Management module, a
Samaj/Committee governance module, a Bappa/Bhuvaji padhramani register, a unified
calendar, role-scoped dashboards, an Accounts & Access console with a live audit
trail, and PDF / Excel / CSV export everywhere.

No framework, bundler, package manager, or backend. Everything is in-memory demo
data — **every reload resets to the seed state**.

---

## Run it locally

Open `index.html` directly in a browser, **or** serve the folder statically:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Any static file server works (`npx serve`, VS Code Live Server, etc.).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (contents at the repo root).
2. Repo **Settings → Pages → Build and deployment → Source: “Deploy from a branch”**,
   branch `main`, folder `/ (root)`, **Save**.
3. The site publishes at `https://<user>.github.io/<repo>/`.

All asset, script, and stylesheet paths are **relative**, so it works from a
project sub-path without configuration. `.nojekyll` is included so GitHub Pages
serves every file verbatim (no Jekyll processing).

## Trilingual

English / हिन्दी / ગુજરાતી — switch from the top bar. Data entry stays in
English; all display text, dates and fixed vocabulary localise.

## Demo access contexts

Use the **role selector** in the top bar (or **Sign in as** on the
Accounts & Access page) to view the app as:

| Context | Sees |
| --- | --- |
| Super Admin | the whole platform |
| Management Lead | only their volunteer team(s) |
| Pooja Coordinator | only their assigned poojas |
| Committee Leader | only their Samaj committee(s) |
| Temple Accountant | donations, expenses, reports |

Scoped contexts get a mini-dashboard limited to their own data and cannot open
other modules — the router enforces it centrally.

---

## Project structure

```
index.html          the single page — all static markup + script/style links
.nojekyll            tells GitHub Pages to skip Jekyll
css/styles.css       the entire hand-authored design system
assets/              icon.png (emblem) + temple.png (cutout) — used across the UI,
                     the badges, invitations, receipts, certificates and PDFs
js/
  i18n.js            trilingual layer (loads first)
  people.js          ACCOUNTS registry — who has a login and what they can open
  export.js          CSV / Excel / certificate-grade PDF export service
  app.js             core SPA shell, routing + access guard, core records
  management.*        Management module  (store / -ui / -forms)
  pooja.*            Pooja module
  donations.*        Donations module
  committee.*        Committee / Samaj module
  events.*           Temple Events module
  visits.js          Bappa / Bhuvaji padhramani register
  calendar.js        unified cross-module month calendar
  dashboard.js       role-aware dashboard cockpit
  access.js          Accounts & Access / Reports / Settings pages
```

Script **load order matters** and is fixed in `index.html`
(`i18n → people → export → app → management.* → pooja.* → donations.* →
committee.* → events.* → visits → calendar → dashboard → access`).

There is no lint / test / build step — verification is manual in the browser.
See `CLAUDE.md` for the full architecture notes.
