/* ============================================================
   SUKI TRADING POS — shared logic for all 5 category pages.
   Reads window.PRODUCTS (defined by header include as a JSON
   array of { name, price, icon }). No build step, no deps.
   ============================================================ */
(function () {
    'use strict';

    var products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    var lastFocus = 'qty';
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

    function emitSale() {
        var item = $('item').value.trim();
        if (!item) { alert('Tap a product tile first to fill the order.'); return; }
        var qty = parseInt(String($('qty').value || '').replace(/[^0-9]/g, ''), 10) || 0;
        if (qty < 1) { alert('Enter a quantity of at least 1.'); return; }

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