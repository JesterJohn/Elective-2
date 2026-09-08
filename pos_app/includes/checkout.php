<aside class="till" aria-label="Order details">
        <form id="order-form" novalidate>
            <header class="till-head">
                <h2>ORDER DETAILS</h2>
                <span class="receipt-meta" id="sale-line">SALE #<span class="mono" id="sale-no">0001</span> · <?php echo date('d M Y'); ?></span>
            </header>
            <div class="cut" aria-hidden="true"><span>✂</span></div>

            <div class="field">
                <label for="item">Name of Item</label>
                <input type="text" id="item" class="mono" readonly placeholder="Tap a product…">
            </div>

            <div class="pair">
                <div class="field">
                    <label for="qty">Quantity</label>
                    <input type="number" id="qty" inputmode="numeric" value="1" min="1" class="mono num">
                </div>
                <div class="field">
                    <label for="price">Price</label>
                    <input type="text" id="price" class="mono num" readonly placeholder="0.00">
                </div>
            </div>

            <fieldset class="discs">
                <legend>Discount</legend>
                <div class="disc-grid">
                    <label class="disc"><input type="radio" name="discount" value="0" checked><span>No Discount</span></label>
                    <label class="disc"><input type="radio" name="discount" value="0.20"><span>Senior Citizen</span></label>
                    <label class="disc"><input type="radio" name="discount" value="0.15"><span>With Disc. Card</span></label>
                    <label class="disc"><input type="radio" name="discount" value="0.10"><span>Employee Disc.</span></label>
                </div>
            </fieldset>

            <div class="pair">
                <div class="field">
                    <label for="disc-amt">Discount Amount</label>
                    <input type="text" id="disc-amt" class="mono num" readonly>
                </div>
                <div class="field">
                    <label for="disc-total">Discounted Amount</label>
                    <input type="text" id="disc-total" class="mono num" readonly>
                </div>
            </div>

            <div class="cut" aria-hidden="true"><span>✂</span></div>

            <dl class="totals mono">
                <div><dt>Total Quantity</dt><dd id="total-qty">0</dd></div>
                <div><dt>Total Discount Given</dt><dd id="total-disc">₱ 0.00</dd></div>
                <div class="grand"><dt>Total Discounted Amt.</dt><dd id="total-amount">₱ 0.00</dd></div>
            </dl>

            <div class="cut" aria-hidden="true"><span>✂</span></div>

            <div class="pair">
                <div class="field">
                    <label for="cash">Cash Given</label>
                    <input type="text" id="cash" inputmode="decimal" class="mono num" placeholder="0.00">
                </div>
                <div class="field">
                    <label for="change">Change</label>
                    <input type="text" id="change" class="mono num" readonly>
                </div>
            </div>

            <div class="actions" role="group" aria-label="Order actions">
                <button type="button" id="btn-change" class="btn btn-till">CALCULATE&nbsp;CHANGE</button>
                <button type="button" id="btn-new" class="btn btn-outline">NEW</button>
                <button type="button" id="btn-save" class="btn btn-till">SAVE</button>
                <button type="button" id="btn-update" class="btn btn-accent">UPDATE</button>
            </div>

            <div class="keypad" aria-label="Numeric keypad">
                <button type="button" class="key" data-key="7">7</button>
                <button type="button" class="key" data-key="8">8</button>
                <button type="button" class="key" data-key="9">9</button>
                <button type="button" class="key" data-key="4">4</button>
                <button type="button" class="key" data-key="5">5</button>
                <button type="button" class="key" data-key="6">6</button>
                <button type="button" class="key" data-key="1">1</button>
                <button type="button" class="key" data-key="2">2</button>
                <button type="button" class="key" data-key="3">3</button>
                <button type="button" class="key key-wide" data-key="C">C</button>
                <button type="button" class="key" data-key="0">0</button>
                <button type="button" class="key key-wide" data-key=".">.</button>
            </div>
        </form>
    </aside>
</main>