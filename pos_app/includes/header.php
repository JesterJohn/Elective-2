<?php
if (!isset($pageTitle)) { $pageTitle = 'POS'; }
$nav = [
    ['kitchen.php',  'Kitchen Utensils'],
    ['bags.php',     'Local Bags'],
    ['perfumes.php', 'Perfumes'],
    ['lights.php',   'Lights'],
    ['shoes.php',    'Shoes'],
];
$productsJson = json_encode($products ?? [], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo htmlspecialchars($pageTitle); ?> — Suki Trading POS</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body class="cat-<?php echo htmlspecialchars($cat ?? 'default', ENT_QUOTES); ?>">
<script>window.PRODUCTS = <?php echo $productsJson; ?>;</script>

<header class="topbar">
    <p class="store-name" aria-label="store name">SERI'S&nbsp;CHOICE&nbsp;STORE</p>

    <div class="jump" role="search">
        <label class="visually-hidden" for="jump">Choose product category</label>
        <select id="jump" aria-label="Choose product category">
            <option value="">--select product--</option>
            <?php foreach ($nav as $n): ?>
            <option value="<?php echo $n[0]; ?>"><?php echo $n[1]; ?></option>
            <?php endforeach; ?>
        </select>
        <button type="button" id="jump-btn" class="btn btn-search">SEARCH</button>
    </div>
</header>

<main class="layout">
    <section class="catalog" aria-label="Products">
        <h2 class="section-title"><?php echo htmlspecialchars($pageTitle); ?></h2>
        <div class="product-grid" id="product-grid"></div>
    </section>