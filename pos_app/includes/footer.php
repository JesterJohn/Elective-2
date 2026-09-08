<section class="ledger-wrap" aria-labelledby="ledger-title">
        <h2 id="ledger-title">RECEIPT LEDGER</h2>
        <p class="ledger-hint mono">TOTALS ONLY REFLECT LINES <span class="ok">SAVED</span> TO THE LEDGER BELOW.</p>
        <div class="table-scroll">
            <table class="ledger">
                <thead>
                    <tr>
                        <th scope="col">Sale</th>
                        <th scope="col">Item</th>
                        <th class="num" scope="col">Qty</th>
                        <th class="num" scope="col">Price</th>
                        <th class="num" scope="col">Disc. Amt</th>
                        <th class="num" scope="col">Discounted</th>
                        <th class="num" scope="col">Cash</th>
                        <th class="num" scope="col">Change</th>
                    </tr>
                </thead>
                <tbody id="ledger-body">
                    <tr class="empty-note"><td colspan="8">No sales saved yet — tap a product, then SAVE.</td></tr>
                </tbody>
            </table>
        </div>
    </section>

    <footer class="site-foot">
        <p>SUKI TRADING · XAMPP POS · Cashier panel — copy into <code>htdocs</code> and load via Apache.</p>
    </footer>

    <script src="js/pos.js"></script>
</body>
</html>