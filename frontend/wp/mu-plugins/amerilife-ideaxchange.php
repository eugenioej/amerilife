<?php
/**
 * Plugin Name: AmeriLife ideaXchange
 * Description: Loads ideaXchange MU plugins (magazine, companies, case studies, carriers, leaderboard, ads).
 * Version: 1.2.0
 */

if (!defined('ABSPATH')) {
  exit;
}

$ideaxchange_mu_dir = __DIR__ . '/ideaxchange';

$ideaxchange_mu_plugins = [
  'amerilife-ideaxchange-admin-ui.php',
  'amerilife-ideaxchange-visibility.php',
  'amerilife-ideaxchange-cpt.php',
  'amerilife-ideaxchange-company-cpt.php',
  'amerilife-ideaxchange-case-study-cpt.php',
  'amerilife-ideaxchange-carrier-cpt.php',
  'amerilife-ideaxchange-leaderboard-cpt.php',
  'amerilife-ideaxchange-ads.php',
];

foreach ($ideaxchange_mu_plugins as $file) {
  $path = $ideaxchange_mu_dir . '/' . $file;
  if (is_readable($path)) {
    require_once $path;
  }
}
