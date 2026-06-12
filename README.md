# Shop Five — Premium Shopify Theme

A custom Shopify Online Store 2.0 theme built for **SHOP FIVE** (Qatar).
Light + dark mode, bilingual English/Arabic with full RTL, custom cart drawer,
announcement ticker, scroll animations, sale countdown and a filterable
collection page.

---

## 1. Install the theme

1. Zip the theme (or use the ready `shopfive-theme.zip` next to this folder):
   the zip must contain the folders `assets, config, layout, locales, sections, snippets, templates` at its root.
2. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize** to open the theme editor, then **Publish** when ready.

## 2. Create your collections (categories)

Create one collection per category in **Products → Collections**, and set a
featured image for each (it appears on the category cards):

| Arabic name | Suggested handle |
|---|---|
| العطور المستوحاة | inspired-perfumes |
| الأحذية | shoes |
| تيشيرت | t-shirts |
| شورت | shorts |
| قميص | shirts |
| بنطال | pants |
| أطقم رجالية | mens-sets |
| أطقم نسائية | womens-sets |
| هودي مقاسات كبيرة | plus-size-hoodies |
| كابات | caps |
| تحطيم الأسعار | price-smash |
| جاكيت | jackets |
| ساعات نسائية | womens-watches |
| ساعات رجالية | mens-watches |

Then in the theme editor, open the **Category showcase** section on the home
page and pick a collection for each card.

## 3. Menus

In **Online Store → Navigation**:

- **Main menu** (`main-menu`): add your top categories. Nested items become
  dropdown menus automatically.
- **Footer menu** (`footer`): add Contact, Refund policy, Terms of service, etc.

## 4. Arabic + English (bilingual)

1. In **Settings → Languages**, add **Arabic** (or English — whichever isn't
   your default) and publish it.
2. Install Shopify's free **Translate & Adapt** app to translate product titles
   and section content. All built-in theme text (buttons, cart, filters,
   checkout strings) is already translated in both languages.
3. When a visitor switches to Arabic with the globe icon in the header, the
   whole layout flips to RTL automatically.

## 5. Currency (QAR)

In **Settings → General → Store currency** set **Qatari Riyal (QAR)**.
The free-shipping progress bar threshold lives in
**Theme settings → Cart → Free shipping threshold** (default 200).

## 6. Policy pages (refund, terms, privacy)

Fill them in at **Settings → Policies**. They are linked automatically in the
footer bottom bar and styled by the theme. For standalone pages
(About us, FAQ), create pages in **Online Store → Pages** — they use the
styled "Page" template. For the contact page, create a page named "Contact"
and assign it the **contact** template.

## 7. Product filters

Filters on collection pages (price, availability, color, size…) are managed by
Shopify's free **Search & Discovery** app — install it and choose which filters
to show.

## 8. Theme settings worth knowing

- **Branding** — upload your logo (the bundled SHOP FIVE logo is the default) and favicon.
- **Colors** — accent color (default `#4f46e5` from your logo) and the default color mode (light/dark). Visitors can toggle modes; their choice is remembered.
- **Animations** — turn scroll-reveal animations on/off globally.
- **Social media** — Instagram, TikTok, X, Facebook, Snapchat, WhatsApp, YouTube links shown in the footer.
- **Promo countdown** section — set the sale end date (YYYY-MM-DD) for the "تحطيم الأسعار / Price Smash" banner.
- **Announcement ticker** — edit the scrolling messages at the very top in the theme editor.

## Pages included

Home, Collection (with filter sidebar + sort), All collections, Product
(gallery, variant pills, accordions, recommendations), Cart page + AJAX cart
drawer with free-shipping bar, Contact, generic Page (policies), Search, 404,
Blog + Article, Password page, and all customer account pages
(login, register, account, order, addresses, reset/activate).
