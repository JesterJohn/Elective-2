/* ============================================================
   SUKI TRADING POS — shared logic for all 5 category pages.
   Reads window.PRODUCTS (defined by header include as a JSON
   array of { name, price, icon }). No build step, no deps.
   ============================================================ */
(function () {
    'use strict';

    var products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    var ledger = [];
    var lastFocus = 'qty';
    var saleNo = 0;
    var selectedIndex = -1;

    function $(id) { return document.getElementById(id); }

    function fmt(n) {
        n = Number(n) || 0;
        return '₱ ' + n.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function parseMoney(str) {
        return parseFloat(String(str || '').replace(/[^0-9.]/g, '')) || 0;
    }

    /* ---- current line math ---- */
    function currentAmount() {
        var price = parseMoney($('price').value);
        var qty = parseInt(String($('qty').value || '').replace(/[^0-9]/g, ''), 10) || 0;
        var raw = price * qty;
        var rate = parseFloat(document.querySelector('input[name="discount"]:checked').value) || 0;
        var disc = raw * rate;
        return { raw: raw, rate: rate, disc: disc, discounted: raw - disc };
    }

    function refreshLine() {
        var a = currentAmount();
        $('disc-amt').value = fmt(a.disc);
        $('disc-total').value = fmt(a.discounted);
        $('change').value = '';
    }

    /* ---- product grid ---- */
    function renderProducts() {
        var grid = $('product-grid');
        if (!grid) return;
        if (!products.length) {
            grid.innerHTML = '<p class="tile" style="grid-column:1/-1">No products defined for this page.</p>';
            return;
        }
        var frag = document.createDocumentFragment();
        products.forEach(function (p, i) {
            var tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'tile';
            tile.setAttribute('aria-label', p.name + ' — ' + fmt(p.price));
            var icon = document.createElement('span');
            icon.className = 'tile-icon';
            icon.setAttribute('aria-hidden', 'true');
            if (p.img) {
                var img = document.createElement('img');
                img.src = p.img;
                img.alt = '';
                img.loading = 'lazy';
                img.addEventListener('error', function () {
                    img.remove();
                    icon.textContent = p.name.slice(0, 2).toUpperCase();
                });
                icon.appendChild(img);
            } else {
                icon.textContent = p.name.slice(0, 2).toUpperCase();
            }
            var name = document.createElement('span');
            name.className = 'tile-name';
            name.textContent = p.name;
            var tag = document.createElement('span');
            tag.className = 'price-tag';
            tag.textContent = fmt(p.price);
            tile.appendChild(icon);
            tile.appendChild(name);
            tile.appendChild(tag);
            tile.addEventListener('click', function () { selectProduct(i); });
            frag.appendChild(tile);
        });
        grid.appendChild(frag);
    }

    function selectProduct(i) {
        var p = products[i];
        if (!p) return;
        $('item').value = p.name;
        $('price').value = String(p.price);
        $('qty').value = '1';
        document.querySelector('input[name="discount"][value="0"]').checked = true;
        selectedIndex = i;

        var tiles = document.querySelectorAll('#product-grid .tile');
        for (var t = 0; t < tiles.length; t++) {
            tiles[t].classList.toggle('is-selected', t === i);
        }
        refreshLine();
        var qtyEl = $('qty');
        qtyEl.focus();
        qtyEl.select();
    }

    /* ---- keypad -> last focused numeric field ---- */
    function attachKeypad() {
        var pad = document.querySelector('.keypad');
        if (!pad) return;
        pad.addEventListener('click', function (e) {
            var key = e.target.getAttribute && e.target.getAttribute('data-key');
            if (!key) return;
            var field = $(lastFocus);
            if (!field || field.readOnly) field = $('qty');

            if (key === 'C') {
                field.value = field.id === 'qty' ? '' : '';
            } else if (key === '.') {
                if (field.id === 'qty') return;
                if (field.value.indexOf('.') === -1) field.value += '.';
            } else {
                if (field.id === 'qty' && /[^0-9]/.test(field.value)) field.value = field.value.replace(/[^0-9]/g, '');
                field.value = (field.value || '') + key;
            }
            refreshLine();
        });
    }

    /* ---- totals ---- */
    function updateTotals() {
        var tq = 0, td = 0, ta = 0;
        ledger.forEach(function (l) {
            tq += l.qty;
            td += l.disc;
            ta += l.discounted;
        });
        $('total-qty').textContent = tq;
        $('total-disc').textContent = fmt(td);
        $('total-amount').textContent = fmt(ta);
    }

    function onEmptyNote(empty) {
        if (empty) {
            $('ledger-body').innerHTML =
                '<tr class="empty-note"><td colspan="8">No sales saved yet — tap a product, then SAVE.</td></tr>';
        }
    }

    function rebuildLedger() {
        var body = $('ledger-body');
        if (!ledger.length) { onEmptyNote(true); return; }
        var frag = document.createDocumentFragment();
        ledger.forEach(function (l) {
            var tr = document.createElement('tr');
            var cells = [
                String(l.no).padStart(4, '0'),
                l.item,
                l.qty,
                fmt(l.price),
                fmt(l.disc),
                fmt(l.discounted),
                fmt(l.cash),
                fmt(l.change)
            ];
            cells.forEach(function (txt, c) {
                var td = document.createElement('td');
                td.textContent = txt;
                if (c >= 2) td.className = 'num';
                tr.appendChild(td);
            });
            frag.appendChild(tr);
        });
        body.replaceChildren(frag);
    }

    function emitSale() {
        var item = $('item').value.trim();
        if (!item) { alert('Tap a product tile first to fill the order.'); return; }
        var a = currentAmount();
        var qty = parseInt(String($('qty').value || '').replace(/[^0-9]/g, ''), 10) || 0;
        if (qty < 1) { alert('Enter a quantity of at least 1.'); return; }

        ledger.push({
            no: ++saleNo,
            item: item,
            qty: qty,
            price: parseMoney($('price').value),
            disc: a.disc,
            discounted: a.discounted,
            cash: parseMoney($('cash').value),
            change: parseMoney($('change').value)
        });
        $('sale-no').textContent = String(saleNo + 1).padStart(4, '0');
        rebuildLedger();
        updateTotals();
        newLine();
    }

    function updateLastSale() {
        if (!ledger.length) { alert('Nothing to update — the ledger is empty.'); return; }
        var item = $('item').value.trim();
        if (!item) { alert('No pending line to update — tap a product tile first.'); return; }
        var a = currentAmount();
        var qty = parseInt(String($('qty').value || '').replace(/[^0-9]/g, ''), 10) || 0;
        if (qty < 1) { alert('Enter a quantity of at least 1.'); return; }

        var last = ledger[ledger.length - 1];
        last.item = item;
        last.qty = qty;
        last.price = parseMoney($('price').value);
        last.disc = a.disc;
        last.discounted = a.discounted;
        last.cash = parseMoney($('cash').value);
        last.change = parseMoney($('change').value);
        rebuildLedger();
        updateTotals();
        newLine();
    }

    function newLine() {
        $('item').value = '';
        $('price').value = '';
        $('qty').value = '1';
        $('cash').value = '';
        $('change').value = '';
        document.querySelector('input[name="discount"][value="0"]').checked = true;
        selectedIndex = -1;
        var tiles = document.querySelectorAll('#product-grid .tile.is-selected');
        for (var t = 0; t < tiles.length; t++) tiles[t].classList.remove('is-selected');
        refreshLine();
        $('item').focus();
    }

    function calcChange() {
        var a = currentAmount();
        var cash = parseMoney($('cash').value);
        $('change').value = fmt(cash - a.discounted);
        $('change').focus();
        $('change').select();
    }

    /* ---- navigation ---- */
    function setupNav() {
        var current = location.pathname.split('/').pop();
        var jump = $('jump');
        var btn = $('jump-btn');
        if (!jump) return;
        if (current) {
            var match = jump.querySelector('option[value="' + current + '"]');
            if (match) jump.value = current;
        }
        function go() { if (jump.value) location.href = jump.value; }
        if (btn) btn.addEventListener('click', go);
        jump.addEventListener('change', go);
    }

    /* ---- boot ---- */
    function bind() {
        var form = $('order-form');
        $('btn-save').addEventListener('click', emitSale);
        $('btn-update').addEventListener('click', updateLastSale);
        $('btn-new').addEventListener('click', newLine);
        $('btn-change').addEventListener('click', calcChange);

        form.addEventListener('focusin', function (e) {
            if (e.target.id === 'qty' || e.target.id === 'cash') lastFocus = e.target.id;
        });
        form.addEventListener('input', refreshLine);
        form.addEventListener('change', refreshLine);

        renderProducts();
        attachKeypad();
        setupNav();
        refreshLine();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();