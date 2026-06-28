# FitFuel Station — Healthy Meal Bowls Website

A modern, fully responsive website for **FitFuel Station** — high-protein healthy bowls in Chhatrapati Sambhajinagar. Built with pure HTML, CSS, and JavaScript. No backend required — all orders go directly to WhatsApp.

## Features

- **Brand-matched design** — Black & lime green fitness aesthetic from your flyers
- **Full menu** — Chicken, Paneer, Egg, Sprouts & Soya Chunks bowls
- **Custom bowl builder** — Customers describe their custom bowl in order notes
- **Shopping cart** — Add items, adjust quantities, see live totals
- **WhatsApp checkout** — One tap sends a formatted order to your WhatsApp
- **Home delivery banner** — Promotes delivery availability
- **Mobile-friendly** — Hamburger nav, responsive layout

## Menu (from your flyer)

| Bowl | Sizes & Prices |
|------|----------------|
| Chicken Rice Bowl | 100g ₹129 · 200g ₹179 |
| Paneer Rice Bowl | 100g ₹139 · 200g ₹189 |
| Egg Rice Bowl | 4 Egg (100g) ₹129 |
| Sprouts Chaat Bowl | 100g ₹59 |
| Soya Chunks Rice Bowl | 100g ₹129 |

## Contact

- **WhatsApp / Call:** [98226 60872](https://wa.me/919822660872)
- **Instagram:** [@fitfuel_station.in](https://instagram.com/fitfuel_station.in)
- **Location:** Chhatrapati Sambhajinagar

## Getting Started

```bash
cd healthy-food-website
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

Or deploy the `public/` folder to Vercel, Netlify, or any static host.

## Customize WhatsApp Number

Edit the top of `script.js`:

```javascript
const WHATSAPP_NUMBER = '919822660872';
```

## File Structure

```
├── index.html      # Main page
├── styles.css      # FitFuel branding & layout
├── script.js       # Menu, cart & WhatsApp logic
└── public/         # Identical copies for static deploy
```

## How Orders Work

1. Customer adds bowls to cart and selects size
2. Fills name, address, phone & delivery slot
3. Clicks **Place Order via WhatsApp**
4. WhatsApp opens with a pre-filled order message to your number
5. You confirm and arrange delivery — no server needed

---

Built for FitFuel Station — *Power in Every Bite* 💪
