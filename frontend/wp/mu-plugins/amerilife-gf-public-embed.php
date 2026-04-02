<?php
/**
 * Plugin Name: AmeriLife GF Public Embed (MU)
 * Description: Public iframe-friendly Gravity Forms at ?gf_public_embed={id} for the headless Next.js site.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('template_redirect', function () {
  if (!isset($_GET['gf_public_embed'])) {
    return;
  }

  $fid = absint(wp_unslash($_GET['gf_public_embed']));
  if ($fid < 1) {
    return;
  }

  if (!function_exists('gravity_form')) {
    status_header(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Gravity Forms is not active.';
    exit;
  }

  if (class_exists('GFAPI')) {
    $form = \GFAPI::get_form($fid);
    if (is_wp_error($form) || empty($form['is_active'])) {
      status_header(404);
      header('Content-Type: text/plain; charset=UTF-8');
      echo 'Form not found.';
      exit;
    }
  }

  while (ob_get_level()) {
    ob_end_clean();
  }

  status_header(200);
  nocache_headers();
  header_remove('X-Frame-Options');
  header('Content-Security-Policy: frame-ancestors *');

  ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <?php wp_head(); ?>
  <style>body.amerilife-gf-embed-body{margin:0;padding:12px;}</style>
</head>
<body class="amerilife-gf-embed-body">
  <?php
  gravity_form($fid, false, false, false, [], true, 12, true);
  ?>
  <?php wp_footer(); ?>
</body>
</html>
  <?php
  exit;
}, 0);
