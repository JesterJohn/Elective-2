# Suki Trading POS — XAMPP Point-of-Sale App

A 5-category POS web app built with plain **PHP + one CSS file + one JS file**.
No frameworks, no build step, no database. Drop it into XAMPP's `htdocs` and
it runs.

## Pages

| Page            | File          |
|-----------------|---------------|
| Kitchen Utensils| `kitchen.php` |
| Local Bags      | `bags.php`    |
| Perfumes        | `perfumes.php`|
| Lights          | `lights.php`  |
| Shoes           | `shoes.php`   |

All 5 pages share `includes/header.php`, `includes/checkout.php`,
`includes/footer.php`, `css/style.css`, and `js/pos.js`. Only the `$products`
array and `$pageTitle` differ between pages.

## Features

- Tap a product tile → fills Name of Item, Price, focuses Quantity.
- Discount radio buttons (No Discount / Senior Citizen / With Disc. Card /
  Employee Disc.), each mapped to a rate.
- Running totals (Total Quantity, Total Discount Given, Total Discounted Amt.)
  across all saved lines.
- Cash Given + CALCULATE CHANGE.
- **Numeric keypad** on the till that types into whichever numeric field
  (Quantity or Cash Given) was focused last.
- SAVE appends a line to the visible receipt ledger; UPDATE replaces the most
  recent line; NEW clears only the current line.
- Category dropdown navigates immediately (on change), SEARCH button confirms,
  plus tab-style category links.

## XAMPP setup (Windows)

1. Install XAMPP (Apache required).
2. Start **Apache** from the XAMPP Control Panel.
3. Copy this whole `pos_app/` folder into
   `C:\xampp\htdocs\` so it becomes `C:\xampp\htdocs\pos_app\`.
4. Open your browser and go to:
   `http://localhost/pos_app/kitchen.php`
5. To get a fresh copy, copy the folder again under a different name —
   no database or config is touched.

Ledger data lives in memory only, so a refresh clears saved lines. That is
intentional for this base version.

## Adding persistence (optional)

If you want the receipt to survive a page reload later:

1. Create a MySQL database + table, e.g.
   `CREATE TABLE sales (id INT AUTO_INCREMENT PRIMARY KEY, item VARCHAR(120), qty INT, price DECIMAL(10,2), disc_amt DECIMAL(10,2), discounted DECIMAL(10,2), cash DECIMAL(10,2), change DECIMAL(10,2));`
2. Add `save.php` that accepts the same fields via POST and inserts a row.
3. In `js/pos.js`, fire a `fetch('save.php', …)` inside `emitSale()` (keep the
   client-side ledger for instant display).

## Design notes

The UI is styled as a working **receipt till** — monospace tabular numbers,
dashed "tear-off" cut lines, rotated price stickers on product tiles, and a
6-colour palette (`#f4f3ee` paper, `#202b26` ink, `#2f6d5b` till green,
`#d9a441` gold accent, `#c1443a` red, `#d8d4c8` line). It deliberately avoids
the default Bootstrap look.