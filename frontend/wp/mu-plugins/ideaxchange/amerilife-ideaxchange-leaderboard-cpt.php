<?php
/**
 * ideaXchange Leaderboard — fixed table posts (7 production + E&O); upload CSV/JSON/Excel per table.
 */

if (!defined('ABSPATH')) {
  exit;
}

require_once __DIR__ . '/lib/SimpleXLSX.php';
require_once __DIR__ . '/lib/SimpleXLSXEx.php';

use Shuchkin\SimpleXLSX;

/** WordPress post type names must be ≤ 20 characters. */
define('AMERILIFE_IX_LEADERBOARD_PT', 'ideaxchange_lb_table');

/**
 * @return array<string, array{name: string, section: string}>
 */
function amerilife_ideaxchange_leaderboard_table_catalog() {
  return [
    'life' => ['name' => 'Life', 'section' => 'Life Production', 'schema' => 'standard'],
    'life-fe' => ['name' => 'Life (FE)', 'section' => 'Life Production', 'schema' => 'standard'],
    'life-non-fe' => ['name' => 'Life (Non-FE)', 'section' => 'Life Production', 'schema' => 'standard'],
    'annuity-production' => ['name' => 'Annuity Production', 'section' => 'Submitted Production', 'schema' => 'standard'],
    'medicare-supplement' => ['name' => 'Medicare Supplement', 'section' => 'Submitted Production', 'schema' => 'standard'],
    'medicare-advantage' => ['name' => 'Medicare Advantage', 'section' => 'Submitted Production', 'schema' => 'standard'],
    'health-specialty' => ['name' => 'Health Specialty', 'section' => 'Submitted Production', 'schema' => 'standard'],
    // E&O / O&E: Affiliate + New Policies (ranked names), not YTD/%.
    'oe' => ['name' => 'E&O', 'section' => 'E&O', 'schema' => 'eo'],
  ];
}

function amerilife_ideaxchange_leaderboard_table_schema($slug) {
  $catalog = amerilife_ideaxchange_leaderboard_table_catalog();
  return $catalog[$slug]['schema'] ?? 'standard';
}

function amerilife_ideaxchange_leaderboard_post_id($post) {
  if (is_object($post)) {
    if (isset($post->ID)) {
      return (int) $post->ID;
    }
    if (isset($post->databaseId)) {
      return (int) $post->databaseId;
    }
  }
  return 0;
}

function amerilife_ideaxchange_leaderboard_format_count($value) {
  if (!is_numeric($value)) {
    return (string) $value;
  }
  return number_format((float) $value, 0, '.', ',');
}

function amerilife_ideaxchange_leaderboard_normalize_trend($value) {
  $raw = trim((string) $value);
  if ($raw === '') {
    return '';
  }

  // Strip BOM / zero-width chars Excel sometimes adds when copying symbols.
  $raw = preg_replace('/[\x{FEFF}\x{200B}\x{200C}\x{200D}]/u', '', $raw);
  $t = strtolower($raw);

  if (in_array($t, ['up', 'down', 'flat', 'neutral', 'same', 'unchanged'], true)) {
    return $t === 'neutral' || $t === 'same' || $t === 'unchanged' ? 'flat' : $t;
  }

  $up_symbols = ['▲', '▴', '▵', '↑', '⬆', '⇧', '➚', '⬆️', '🔺', 'green', 'positive', 'increase', 'higher', 'gain'];
  $down_symbols = ['▼', '▾', '▿', '↓', '⬇', '⇩', '➘', '⬇️', '🔻', 'red', 'negative', 'decrease', 'lower', 'loss'];
  $flat_symbols = ['⬤', '●', '○', '◯', '—', '-', '–', '―', '→', '↔', '➡', 'flat', 'none', '0'];

  if (in_array($t, $up_symbols, true) || in_array($raw, $up_symbols, true)) {
    return 'up';
  }
  if (in_array($t, $down_symbols, true) || in_array($raw, $down_symbols, true)) {
    return 'down';
  }
  if (in_array($t, $flat_symbols, true) || in_array($raw, $flat_symbols, true)) {
    return 'flat';
  }

  // Wingdings / Symbol font glyphs (Excel often stores the char without font context).
  if (preg_match('/^[pq]$/i', $raw)) {
    return strtolower($raw) === 'p' ? 'up' : 'down';
  }

  if (preg_match('/[▲▴▵↑⬆⇧➚]/u', $raw)) {
    return 'up';
  }
  if (preg_match('/[▼▾▿↓⬇⇩➘]/u', $raw)) {
    return 'down';
  }
  if (preg_match('/[⬤●○◯]/u', $raw)) {
    return 'flat';
  }

  return '';
}

function amerilife_ideaxchange_leaderboard_normalize_header_cell($cell) {
  $h = strtolower(trim((string) $cell));
  $h = preg_replace('/[\s\-]+/', '_', $h);
  $h = preg_replace('/[^a-z0-9_]/', '', $h);
  return $h;
}

/**
 * @param list<string> $header Normalized header keys.
 * @param list<string>|null $raw_header Original header cells (for ▲▼⬤ trend column).
 * @return array{affiliate: int, map: array<string, int|null>}|WP_Error
 */
function amerilife_ideaxchange_leaderboard_header_indices($header, $raw_header = null) {
  $idx = static function ($names) use ($header) {
    foreach ((array) $names as $name) {
      $i = array_search($name, $header, true);
      if ($i !== false) {
        return $i;
      }
    }
    return null;
  };

  $affiliate_i = $idx(['affiliate', 'affiliate_name', 'affiliate_group', 'name', 'company']);
  if ($affiliate_i === null) {
    return new WP_Error('leaderboard_header_invalid', 'File must include an "affiliate" column', ['status' => 400]);
  }

  // Prefer literal "vs LYTD" over a symbol header that normalizes to the same key.
  $vs_lytd_i = null;
  if (is_array($raw_header)) {
    foreach ($raw_header as $i => $cell) {
      $norm = amerilife_ideaxchange_leaderboard_normalize_header_cell($cell);
      if ($norm === 'vs_lytd' && !preg_match('/[▲▼⬤]/u', (string) $cell)) {
        $vs_lytd_i = (int) $i;
        break;
      }
    }
  }
  if ($vs_lytd_i === null) {
    $vs_lytd_i = $idx(['vs_lytd', 'vslytd', 'vs_ly', 'vs_last_year', 'vs_last_ytd']);
  }

  $trend_i = $idx(['trend', 'trend_indicator', 'indicator', 'arrow', 'direction', 'status']);
  if ($trend_i === null && is_array($raw_header)) {
    foreach ($raw_header as $i => $cell) {
      if (preg_match('/[▲▼⬤]/u', (string) $cell)) {
        $trend_i = (int) $i;
        break;
      }
    }
  }

  $ytd_i = $idx(['ytd', 'ytd_amount', 'ytd_production']);
  $new_policies_i = $idx(['new_policies', 'new_policy', 'newpolicies', 'policies', 'policy_count']);
  // E&O files use "New Policies" instead of YTD — map into ytd for storage.
  if ($ytd_i === null && $new_policies_i !== null) {
    $ytd_i = $new_policies_i;
  }

  return [
    'affiliate' => $affiliate_i,
    'schema' => ($new_policies_i !== null && $idx(['ytd', 'ytd_amount', 'ytd_production']) === null) ? 'eo' : 'standard',
    'map' => [
      'ytd' => $ytd_i,
      'lytd' => $idx(['lytd', 'lytd_amount', 'lytd_production']),
      'vs_lytd' => $vs_lytd_i,
      'vs_lqtd' => $idx(['vs_lqtd', 'vslqtd', 'vs_last_quarter', 'vs_lq']),
      'vs_lmtd' => $idx(['vs_lmtd', 'vslmtd', 'vs_last_month', 'vs_lm']),
      'trend' => $trend_i,
    ],
  ];
}

/**
 * "1. Pinnacle Financial Services" → [rank => "1", affiliate => "Pinnacle Financial Services"]
 *
 * @return array{rank: string, affiliate: string}
 */
function amerilife_ideaxchange_leaderboard_split_ranked_affiliate($raw) {
  $s = trim((string) $raw);
  if (preg_match('/^(\d+)\.\s*(.+)$/u', $s, $m)) {
    return ['rank' => $m[1], 'affiliate' => trim($m[2])];
  }
  return ['rank' => '', 'affiliate' => $s];
}

/**
 * Excel often stores % cells as decimals (0.221 = 22.1%).
 */
function amerilife_ideaxchange_leaderboard_format_percent_value($value, $from_excel = false) {
  if (!is_numeric($value)) {
    $s = trim((string) $value);
    if ($s !== '' && str_ends_with($s, '%')) {
      return $s;
    }
    return (string) $value;
  }
  $n = (float) $value;
  if ($from_excel && abs($n) <= 1 && $n != 0.0) {
    $n *= 100;
  }
  return number_format($n, 2, '.', '') . '%';
}

/**
 * @param array{affiliate: int, map: array<string, int|null>} $indices
 * @param list<list<mixed>> $grid
 * @param bool $from_excel
 * @return list<array<string, string>>
 */
function amerilife_ideaxchange_leaderboard_rows_from_grid($indices, $grid, $from_excel = false) {
  $rows = [];
  $schema = $indices['schema'] ?? 'standard';
  foreach ($grid as $cells) {
    if (!is_array($cells)) {
      continue;
    }
    $affiliate_i = $indices['affiliate'];
    $raw_affiliate = isset($cells[$affiliate_i]) ? trim((string) $cells[$affiliate_i]) : '';
    if ($raw_affiliate === '') {
      continue;
    }

    $rank = '';
    $affiliate = $raw_affiliate;
    if ($schema === 'eo') {
      $split = amerilife_ideaxchange_leaderboard_split_ranked_affiliate($raw_affiliate);
      $rank = $split['rank'];
      $affiliate = $split['affiliate'];
    }

    $row = ['affiliate' => $affiliate];
    if ($rank !== '') {
      $row['rank'] = $rank;
    }
    foreach ($indices['map'] as $key => $col) {
      $val = ($col !== null && isset($cells[$col])) ? $cells[$col] : '';
      if (in_array($key, ['vs_lytd', 'vs_lqtd', 'vs_lmtd'], true)) {
        $row[$key] = amerilife_ideaxchange_leaderboard_format_percent_value($val, $from_excel);
      } else {
        $row[$key] = is_scalar($val) ? trim((string) $val) : '';
      }
    }
    // Skip blank E&O trailing rows (affiliate present but no New Policies).
    if ($schema === 'eo' && ($row['ytd'] ?? '') === '') {
      continue;
    }
    $rows[] = $row;
  }
  return $rows;
}

/**
 * @param array<int, mixed> $rows
 * @return list<array{affiliate: string, ytd: string, lytd: string, vs_lytd: string, vs_lqtd: string, vs_lmtd: string, trend: string}>
 */
function amerilife_ideaxchange_leaderboard_normalize_rows($rows) {
  if (!is_array($rows)) {
    return [];
  }
  $out = [];
  foreach ($rows as $row) {
    if (!is_array($row)) {
      continue;
    }
    $affiliate = sanitize_text_field((string) ($row['affiliate'] ?? ''));
    if ($affiliate === '') {
      continue;
    }
    // Accept ranked "1. Name" from EO CSVs even when schema wasn't detected upstream.
    $rank = sanitize_text_field((string) ($row['rank'] ?? ''));
    if ($rank === '' && preg_match('/^(\d+)\.\s*(.+)$/u', $affiliate, $m)) {
      $rank = $m[1];
      $affiliate = sanitize_text_field(trim($m[2]));
    }
    $meta = [
      'affiliate' => $affiliate,
      'ytd' => amerilife_ideaxchange_leaderboard_format_count($row['ytd'] ?? ''),
      'lytd' => amerilife_ideaxchange_leaderboard_format_count($row['lytd'] ?? ''),
      'vs_lytd' => amerilife_ideaxchange_leaderboard_format_percent_value($row['vs_lytd'] ?? ''),
      'vs_lqtd' => amerilife_ideaxchange_leaderboard_format_percent_value($row['vs_lqtd'] ?? ''),
      'vs_lmtd' => amerilife_ideaxchange_leaderboard_format_percent_value($row['vs_lmtd'] ?? ''),
      'trend' => amerilife_ideaxchange_leaderboard_normalize_trend($row['trend'] ?? ''),
    ];
    if ($rank !== '') {
      $meta['rank'] = $rank;
    }
    $out[] = $meta;
  }
  return $out;
}

/**
 * @return list<array<string, string>>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_parse_csv_content($content) {
  $content = preg_replace('/^\xEF\xBB\xBF/', '', (string) $content);
  $content = trim((string) $content);
  if ($content === '') {
    return new WP_Error('leaderboard_csv_empty', 'CSV file is empty', ['status' => 400]);
  }

  $lines = preg_split('/\r\n|\r|\n/', $content);
  $lines = array_values(array_filter($lines, static function ($line) {
    return trim((string) $line) !== '';
  }));
  if (count($lines) < 2) {
    return new WP_Error('leaderboard_csv_invalid', 'CSV needs a header row and at least one affiliate row', ['status' => 400]);
  }

  $raw_header = str_getcsv((string) $lines[0]);
  $header = array_map('amerilife_ideaxchange_leaderboard_normalize_header_cell', $raw_header);

  $indices = amerilife_ideaxchange_leaderboard_header_indices($header, $raw_header);
  if (is_wp_error($indices)) {
    return $indices;
  }

  $grid = [];
  for ($i = 1; $i < count($lines); $i++) {
    $grid[] = str_getcsv((string) $lines[$i]);
  }

  return amerilife_ideaxchange_leaderboard_normalize_rows(
    amerilife_ideaxchange_leaderboard_rows_from_grid($indices, $grid, false)
  );
}

/**
 * @return list<array<string, string>>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_parse_json_content($content) {
  $decoded = json_decode((string) $content, true);
  if (!is_array($decoded)) {
    return new WP_Error('leaderboard_json_invalid', 'Invalid JSON file', ['status' => 400]);
  }
  if (isset($decoded['rows']) && is_array($decoded['rows'])) {
    return amerilife_ideaxchange_leaderboard_normalize_rows($decoded['rows']);
  }
  if (isset($decoded['tables'][0]['rows']) && is_array($decoded['tables'][0]['rows'])) {
    return amerilife_ideaxchange_leaderboard_normalize_rows($decoded['tables'][0]['rows']);
  }
  if (array_is_list($decoded)) {
    return amerilife_ideaxchange_leaderboard_normalize_rows($decoded);
  }
  return new WP_Error('leaderboard_json_invalid', 'JSON must be a rows array or { "rows": [...] }', ['status' => 400]);
}

/**
 * @return list<array<string, string>>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_parse_xlsx_file($path) {
  if (!class_exists(SimpleXLSX::class)) {
    return new WP_Error('leaderboard_xlsx_missing', 'Excel parser is not available on this server', ['status' => 500]);
  }

  $xlsx = SimpleXLSX::parse($path);
  if (!$xlsx) {
    $err = SimpleXLSX::parseError();
    return new WP_Error('leaderboard_xlsx_invalid', $err ? (string) $err : 'Could not read Excel file', ['status' => 400]);
  }

  $sheet_rows = $xlsx->rows();
  if (!is_array($sheet_rows) || count($sheet_rows) < 2) {
    return new WP_Error('leaderboard_xlsx_invalid', 'Excel needs a header row and at least one affiliate row', ['status' => 400]);
  }

  $raw_header = $sheet_rows[0];
  $header = array_map('amerilife_ideaxchange_leaderboard_normalize_header_cell', $raw_header);
  $indices = amerilife_ideaxchange_leaderboard_header_indices($header, $raw_header);
  if (is_wp_error($indices)) {
    return $indices;
  }

  $grid = array_slice($sheet_rows, 1);
  $trend_i = $indices['map']['trend'] ?? null;

  // rowsEx preserves rich-text symbols (▲▼) that plain rows() can drop.
  if ($trend_i !== null && method_exists($xlsx, 'rowsEx')) {
    $extended = $xlsx->rowsEx();
    if (is_array($extended) && count($extended) >= 2) {
      foreach ($extended as $row_i => $ext_row) {
        if ($row_i === 0 || !isset($grid[$row_i - 1])) {
          continue;
        }
        $trend_cell = $ext_row[$trend_i] ?? null;
        if (!is_array($trend_cell)) {
          continue;
        }
        $trend_val = trim((string) ($trend_cell['value'] ?? ''));
        if ($trend_val !== '') {
          $grid[$row_i - 1][$trend_i] = $trend_val;
        }
      }
    }
  }

  return amerilife_ideaxchange_leaderboard_normalize_rows(
    amerilife_ideaxchange_leaderboard_rows_from_grid($indices, $grid, true)
  );
}

/**
 * @param array<string, mixed> $file
 * @return list<array<string, string>>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_parse_uploaded_file($file) {
  if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    return new WP_Error('leaderboard_upload_missing', 'No file selected', ['status' => 400]);
  }
  $name = isset($file['name']) ? (string) $file['name'] : '';
  $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  $tmp = (string) $file['tmp_name'];

  if (in_array($ext, ['xlsx', 'xlsm'], true)) {
    return amerilife_ideaxchange_leaderboard_parse_xlsx_file($tmp);
  }

  $raw = file_get_contents($tmp);
  if ($raw === false) {
    return new WP_Error('leaderboard_upload_read', 'Could not read file', ['status' => 400]);
  }
  if ($ext === 'csv') {
    return amerilife_ideaxchange_leaderboard_parse_csv_content($raw);
  }
  if ($ext === 'json') {
    return amerilife_ideaxchange_leaderboard_parse_json_content($raw);
  }
  return new WP_Error('leaderboard_upload_type', 'Upload a .xlsx, .csv, or .json file', ['status' => 400]);
}

function amerilife_ideaxchange_leaderboard_get_rows($post_id) {
  $raw = get_post_meta($post_id, 'rows_json', true);
  if (!is_string($raw) || $raw === '') {
    return [];
  }
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

function amerilife_ideaxchange_leaderboard_save_rows($post_id, $rows) {
  update_post_meta($post_id, 'rows_json', wp_json_encode(array_values($rows)));
  update_post_meta($post_id, 'row_count', (string) count($rows));
  update_post_meta($post_id, 'last_imported', gmdate('c'));
}

function amerilife_ideaxchange_leaderboard_ensure_table_posts() {
  $catalog = amerilife_ideaxchange_leaderboard_table_catalog();
  $order = 0;
  foreach ($catalog as $slug => $info) {
    $order++;
    $existing = get_page_by_path($slug, OBJECT, AMERILIFE_IX_LEADERBOARD_PT);
    if ($existing) {
      continue;
    }
    wp_insert_post([
      'post_type' => AMERILIFE_IX_LEADERBOARD_PT,
      'post_status' => 'publish',
      'post_title' => (string) $info['name'],
      'post_name' => $slug,
      'menu_order' => $order,
    ]);
  }
}

function amerilife_ideaxchange_leaderboard_purge_legacy_rows() {
  if (get_option('amerilife_ix_lb_migrated_v4')) {
    return;
  }
  $legacy = get_posts([
    'post_type' => 'ideaxchange_lb_row',
    'post_status' => 'any',
    'numberposts' => -1,
    'fields' => 'ids',
  ]);
  foreach ($legacy as $pid) {
    wp_delete_post((int) $pid, true);
  }
  update_option('amerilife_ix_lb_migrated_v4', 1);
}

add_action('init', function () {
  register_post_type(AMERILIFE_IX_LEADERBOARD_PT, [
    'labels' => [
      'name' => 'ideaXchange Leaderboard',
      'singular_name' => 'Leaderboard Table',
      'edit_item' => 'Edit table data',
      'menu_name' => 'ideaXchange Leaderboard',
      'all_items' => 'Leaderboard tables (8)',
    ],
    'public' => true,
    'publicly_queryable' => true,
    'exclude_from_search' => true,
    'rewrite' => false,
    'query_var' => false,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-chart-bar',
    'supports' => ['title', 'page-attributes'],
    'capability_type' => 'post',
    'map_meta_cap' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeLbTable',
    'graphql_plural_name' => 'ideaxchangeLbTables',
  ]);

  $meta_auth = static function () {
    return current_user_can('edit_posts');
  };

  foreach (['rows_json', 'report_date', 'row_count', 'last_imported', 'section_label'] as $key) {
    register_post_meta(AMERILIFE_IX_LEADERBOARD_PT, $key, [
      'type' => 'string',
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => $meta_auth,
    ]);
  }

  amerilife_ideaxchange_leaderboard_ensure_table_posts();
}, 9);

add_action('init', function () {
  amerilife_ideaxchange_leaderboard_purge_legacy_rows();
}, 99);

add_action('post_edit_form_tag', function () {
  global $post;
  if ($post && $post->post_type === AMERILIFE_IX_LEADERBOARD_PT) {
    echo ' enctype="multipart/form-data"';
  }
});

add_action('admin_menu', function () {
  remove_submenu_page(
    'edit.php?post_type=' . AMERILIFE_IX_LEADERBOARD_PT,
    'post-new.php?post_type=' . AMERILIFE_IX_LEADERBOARD_PT
  );
});

add_filter('map_meta_cap', function ($caps, $cap, $user_id, $args) {
  if (!in_array($cap, ['delete_post', 'create_posts'], true) || empty($args[0])) {
    return $caps;
  }
  $post = get_post((int) $args[0]);
  if ($post && $post->post_type === AMERILIFE_IX_LEADERBOARD_PT) {
    $caps = ['do_not_allow'];
  }
  return $caps;
}, 10, 4);

add_action('admin_head', function () {
  global $post;
  if (!$post || $post->post_type !== AMERILIFE_IX_LEADERBOARD_PT) {
    return;
  }
  echo '<style>#delete-action, #titlediv, .page-title-action { display: none !important; }</style>';
});

add_filter('manage_' . AMERILIFE_IX_LEADERBOARD_PT . '_posts_columns', function ($columns) {
  return [
    'cb' => $columns['cb'] ?? '<input type="checkbox" />',
    'title' => __('Table', 'amerilife'),
    'section' => __('Section', 'amerilife'),
    'row_count' => __('Affiliates', 'amerilife'),
    'report_date' => __('Report date', 'amerilife'),
    'last_imported' => __('Last upload', 'amerilife'),
  ];
});

add_action('manage_' . AMERILIFE_IX_LEADERBOARD_PT . '_posts_custom_column', function ($column, $post_id) {
  $slug = get_post_field('post_name', $post_id);
  $catalog = amerilife_ideaxchange_leaderboard_table_catalog();
  switch ($column) {
    case 'section':
      echo esc_html($catalog[$slug]['section'] ?? '—');
      break;
    case 'row_count':
      echo esc_html((string) get_post_meta($post_id, 'row_count', true) ?: '0');
      break;
    case 'report_date':
      echo esc_html((string) get_post_meta($post_id, 'report_date', true) ?: '—');
      break;
    case 'last_imported':
      $v = get_post_meta($post_id, 'last_imported', true);
      echo $v ? esc_html((string) $v) : '—';
      break;
  }
}, 10, 2);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'ideaxchange_leaderboard_upload',
    'Upload table data',
    function ($post) {
      if ($post->post_type !== AMERILIFE_IX_LEADERBOARD_PT) {
        return;
      }
      wp_nonce_field('ideaxchange_leaderboard_save', 'ideaxchange_leaderboard_nonce');

      $slug = $post->post_name;
      $catalog = amerilife_ideaxchange_leaderboard_table_catalog();
      $section = $catalog[$slug]['section'] ?? '';
      $schema = $catalog[$slug]['schema'] ?? 'standard';
      $rows = amerilife_ideaxchange_leaderboard_get_rows((int) $post->ID);
      $report_date = get_post_meta($post->ID, 'report_date', true);

      echo '<p style="margin-top:0;font-size:14px"><strong>' . esc_html($post->post_title) . '</strong>';
      if ($section !== '') {
        echo ' <span style="color:#646970">(' . esc_html($section) . ')</span>';
      }
      echo '<br /><code>' . esc_html($slug) . '</code></p>';

      echo '<p><label for="lb_data_file"><strong>Data file</strong></label></p>';
      echo '<input type="file" name="lb_data_file" id="lb_data_file" accept=".xlsx,.xlsm,.csv,.json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/json" />';
      if ($schema === 'eo') {
        echo '<p class="description">E&amp;O format: <strong>Affiliate</strong>, <strong>New Policies</strong> (names may be ranked like <code>1. Name</code>). Saving replaces all rows for this table.</p>';
      } else {
        echo '<p class="description">Upload <strong>.xlsx</strong> (recommended — keeps ▲▼ trend symbols), <strong>.csv</strong>, or <strong>.json</strong>. Columns: affiliate, ytd, lytd, vs_lytd, vs_lqtd, vs_lmtd, trend. Saving replaces all rows for this table.</p>';
      }

      echo '<p style="margin-top:16px"><label for="report_date"><strong>Report date</strong></label></p>';
      echo '<input type="date" name="report_date" id="report_date" value="' . esc_attr((string) $report_date) . '" class="widefat" />';

      echo '<p style="margin-top:16px"><strong>' . esc_html((string) count($rows)) . '</strong> affiliate rows loaded.</p>';

      if ($rows !== []) {
        echo '<table class="widefat striped" style="margin-top:8px"><thead><tr>';
        if ($schema === 'eo') {
          echo '<th>Rank</th><th>Affiliate</th><th>New Policies</th></tr></thead><tbody>';
          foreach (array_slice($rows, 0, 5) as $i => $row) {
            $rank = (string) ($row['rank'] ?? (string) ($i + 1));
            echo '<tr><td>' . esc_html($rank) . '</td>';
            echo '<td>' . esc_html((string) ($row['affiliate'] ?? '')) . '</td>';
            echo '<td>' . esc_html((string) ($row['ytd'] ?? '')) . '</td></tr>';
          }
        } else {
          echo '<th>Affiliate</th><th>YTD</th><th>LYTD</th><th>VS LYTD</th><th>Trend</th></tr></thead><tbody>';
          foreach (array_slice($rows, 0, 5) as $row) {
            echo '<tr><td>' . esc_html((string) ($row['affiliate'] ?? '')) . '</td>';
            echo '<td>' . esc_html((string) ($row['ytd'] ?? '')) . '</td>';
            echo '<td>' . esc_html((string) ($row['lytd'] ?? '')) . '</td>';
            echo '<td>' . esc_html((string) ($row['vs_lytd'] ?? '')) . '</td>';
            echo '<td>' . esc_html((string) ($row['trend'] ?? '')) . '</td></tr>';
          }
        }
        echo '</tbody></table>';
        if (count($rows) > 5) {
          echo '<p class="description">Showing first 5 of ' . esc_html((string) count($rows)) . ' rows.</p>';
        }
      }
    },
    AMERILIFE_IX_LEADERBOARD_PT,
    'normal',
    'high'
  );
});

add_action('save_post_' . AMERILIFE_IX_LEADERBOARD_PT, function ($post_id) {
  if (!isset($_POST['ideaxchange_leaderboard_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ideaxchange_leaderboard_nonce'])), 'ideaxchange_leaderboard_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  $slug = get_post_field('post_name', $post_id);
  $catalog = amerilife_ideaxchange_leaderboard_table_catalog();
  if (isset($catalog[$slug])) {
    update_post_meta($post_id, 'section_label', (string) $catalog[$slug]['section']);
  }

  if (isset($_POST['report_date'])) {
    update_post_meta($post_id, 'report_date', sanitize_text_field(wp_unslash($_POST['report_date'])));
  }

  // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
  if (empty($_FILES['lb_data_file']['tmp_name'])) {
    return;
  }

  $parsed = amerilife_ideaxchange_leaderboard_parse_uploaded_file($_FILES['lb_data_file']);
  if (is_wp_error($parsed)) {
    set_transient('ideaxchange_lb_import_error_' . $post_id, $parsed->get_error_message(), 30);
    return;
  }

  amerilife_ideaxchange_leaderboard_save_rows($post_id, $parsed);
  delete_transient('ideaxchange_lb_import_error_' . $post_id);
}, 10, 1);

add_action('admin_notices', function () {
  global $post;
  if (!$post || $post->post_type !== AMERILIFE_IX_LEADERBOARD_PT) {
    return;
  }
  $err = get_transient('ideaxchange_lb_import_error_' . $post->ID);
  if ($err) {
    echo '<div class="notice notice-error"><p>' . esc_html((string) $err) . '</p></div>';
    delete_transient('ideaxchange_lb_import_error_' . $post->ID);
  }
});

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeLeaderboardRow', [
    'fields' => [
      'rank' => ['type' => 'String'],
      'affiliate' => ['type' => 'String'],
      'ytdAmount' => ['type' => 'String'],
      'lytdAmount' => ['type' => 'String'],
      'vsLytd' => ['type' => 'String'],
      'vsLqtd' => ['type' => 'String'],
      'vsLmtd' => ['type' => 'String'],
      'trend' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeLbTableFields', [
    'fields' => [
      'sectionLabel' => ['type' => 'String'],
      'reportDate' => ['type' => 'String'],
      'rowCount' => ['type' => 'Int'],
      'schema' => ['type' => 'String'],
      'rows' => ['type' => ['list_of' => 'IdeaxchangeLeaderboardRow']],
      'visibility' => ['type' => 'IdeaxchangeVisibility'],
    ],
  ]);

  register_graphql_field('IdeaxchangeLbTable', 'ideaxchangeLbTableFields', [
    'type' => 'IdeaxchangeLbTableFields',
    'resolve' => function ($post) {
      $id = amerilife_ideaxchange_leaderboard_post_id($post);
      if (!$id) {
        return ['sectionLabel' => null, 'reportDate' => null, 'rowCount' => 0, 'schema' => 'standard', 'rows' => [], 'visibility' => 'BROKERAGE_CAREER'];
      }
      $slug = (string) get_post_field('post_name', $id);
      $schema = amerilife_ideaxchange_leaderboard_table_schema($slug);
      $stored = amerilife_ideaxchange_leaderboard_get_rows($id);
      $rows = array_map(static function ($row) {
        return [
          'rank' => (string) ($row['rank'] ?? ''),
          'affiliate' => (string) ($row['affiliate'] ?? ''),
          'ytdAmount' => (string) ($row['ytd'] ?? ''),
          'lytdAmount' => (string) ($row['lytd'] ?? ''),
          'vsLytd' => (string) ($row['vs_lytd'] ?? ''),
          'vsLqtd' => (string) ($row['vs_lqtd'] ?? ''),
          'vsLmtd' => (string) ($row['vs_lmtd'] ?? ''),
          'trend' => (string) ($row['trend'] ?? ''),
        ];
      }, $stored);

      return [
        'sectionLabel' => amerilife_ideaxchange_leaderboard_meta_string($id, 'section_label'),
        'reportDate' => amerilife_ideaxchange_leaderboard_meta_string($id, 'report_date'),
        'rowCount' => count($rows),
        'schema' => $schema,
        'rows' => $rows,
        'visibility' => amerilife_ideaxchange_visibility_graphql_enum($id),
      ];
    },
  ]);
});

function amerilife_ideaxchange_leaderboard_meta_string($post_id, $key) {
  $v = get_post_meta($post_id, $key, true);
  return $v !== '' ? (string) $v : null;
}

function amerilife_ideaxchange_leaderboard_seed_path() {
  return dirname(__FILE__) . '/seed/ideaxchange-leaderboard-seed.json';
}

function amerilife_ideaxchange_leaderboard_load_seed_rows() {
  $path = amerilife_ideaxchange_leaderboard_seed_path();
  if (!is_readable($path)) {
    return new WP_Error('leaderboard_seed_missing', 'Seed file missing', ['status' => 500]);
  }
  $data = json_decode((string) file_get_contents($path), true);
  if (!is_array($data) || empty($data['tables'][0]['rows'])) {
    return new WP_Error('leaderboard_seed_invalid', 'Invalid seed JSON', ['status' => 500]);
  }
  $rows = amerilife_ideaxchange_leaderboard_normalize_rows($data['tables'][0]['rows']);
  $report_date = isset($data['report_date']) ? sanitize_text_field((string) $data['report_date']) : '';

  $by_slug = [];
  if (!empty($data['tables']) && is_array($data['tables'])) {
    foreach ($data['tables'] as $table) {
      if (!is_array($table)) {
        continue;
      }
      $slug = sanitize_title((string) ($table['table_slug'] ?? $table['slug'] ?? ''));
      if ($slug === '' || empty($table['rows']) || !is_array($table['rows'])) {
        continue;
      }
      $by_slug[$slug] = amerilife_ideaxchange_leaderboard_normalize_rows($table['rows']);
    }
  }

  return ['rows' => $rows, 'rows_by_slug' => $by_slug, 'report_date' => $report_date];
}

/**
 * @return array<string, mixed>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_seed_demo($force = false) {
  if (!$force && get_option('amerilife_ideaxchange_leaderboard_seeded_v4')) {
    return ['ok' => true, 'tables' => 0, 'skipped' => true];
  }

  $seed = amerilife_ideaxchange_leaderboard_load_seed_rows();
  if (is_wp_error($seed)) {
    return $seed;
  }

  amerilife_ideaxchange_leaderboard_ensure_table_posts();
  $updated = 0;

  foreach (amerilife_ideaxchange_leaderboard_table_catalog() as $slug => $info) {
    $post = get_page_by_path($slug, OBJECT, AMERILIFE_IX_LEADERBOARD_PT);
    if (!$post) {
      continue;
    }
    if ($force || amerilife_ideaxchange_leaderboard_get_rows((int) $post->ID) === []) {
      $rows = $seed['rows_by_slug'][$slug] ?? null;
      // Don't paste Life production demo rows into the E&O table.
      if ($rows === null) {
        if (($info['schema'] ?? 'standard') === 'eo') {
          continue;
        }
        $rows = $seed['rows'];
      }
      amerilife_ideaxchange_leaderboard_save_rows((int) $post->ID, $rows);
      if ($seed['report_date'] !== '') {
        update_post_meta($post->ID, 'report_date', $seed['report_date']);
      }
      update_post_meta($post->ID, 'section_label', (string) $info['section']);
      $updated++;
    }
  }

  if ($seed['report_date'] !== '') {
    update_option('amerilife_ideaxchange_leaderboard_report_date', $seed['report_date']);
  }

  update_option('amerilife_ideaxchange_leaderboard_seeded_v4', 1);
  delete_option('amerilife_ideaxchange_leaderboard_seeded_v3');

  return [
    'ok' => true,
    'tables' => $updated,
    'rows_per_table' => count($seed['rows']),
    'report_date' => $seed['report_date'],
  ];
}

/**
 * Import SFTP-parsed tables.json payload into the fixed leaderboard CPT posts.
 *
 * Expected body:
 * {
 *   "report_date": "2026-07-20",
 *   "tables": [
 *     { "slug": "life", "rows": [...], "report_date": "2026-07-20" }
 *   ]
 * }
 *
 * @param array<string, mixed> $payload
 * @return array<string, mixed>|WP_Error
 */
function amerilife_ideaxchange_leaderboard_import_tables($payload) {
  if (!is_array($payload)) {
    return new WP_Error('leaderboard_import_invalid', 'Body must be a JSON object', ['status' => 400]);
  }

  $tables = $payload['tables'] ?? null;
  if (!is_array($tables) || $tables === []) {
    return new WP_Error('leaderboard_import_invalid', 'Body must include a non-empty "tables" array', ['status' => 400]);
  }

  $global_report_date = isset($payload['report_date'])
    ? sanitize_text_field((string) $payload['report_date'])
    : '';

  amerilife_ideaxchange_leaderboard_ensure_table_posts();
  $catalog = amerilife_ideaxchange_leaderboard_table_catalog();

  $updated = [];
  $skipped = [];
  $errors = [];

  foreach ($tables as $table) {
    if (!is_array($table)) {
      continue;
    }
    $slug = sanitize_title((string) ($table['slug'] ?? ''));
    if ($slug === '' || !isset($catalog[$slug])) {
      $skipped[] = ['slug' => $slug !== '' ? $slug : '(missing)', 'reason' => 'unknown_slug'];
      continue;
    }
    if (!isset($table['rows']) || !is_array($table['rows'])) {
      $errors[] = ['slug' => $slug, 'reason' => 'missing_rows'];
      continue;
    }

    $rows = amerilife_ideaxchange_leaderboard_normalize_rows($table['rows']);
    if ($rows === []) {
      $errors[] = ['slug' => $slug, 'reason' => 'empty_rows_after_normalize'];
      continue;
    }

    $post = get_page_by_path($slug, OBJECT, AMERILIFE_IX_LEADERBOARD_PT);
    if (!$post) {
      $errors[] = ['slug' => $slug, 'reason' => 'post_missing'];
      continue;
    }

    $report_date = isset($table['report_date'])
      ? sanitize_text_field((string) $table['report_date'])
      : $global_report_date;

    amerilife_ideaxchange_leaderboard_save_rows((int) $post->ID, $rows);
    if ($report_date !== '') {
      update_post_meta($post->ID, 'report_date', $report_date);
    }
    update_post_meta($post->ID, 'section_label', (string) $catalog[$slug]['section']);

    $updated[] = [
      'slug' => $slug,
      'rows' => count($rows),
      'report_date' => $report_date !== '' ? $report_date : null,
    ];
  }

  if ($global_report_date !== '') {
    update_option('amerilife_ideaxchange_leaderboard_report_date', $global_report_date);
  }

  if ($updated === [] && $errors !== []) {
    return new WP_Error(
      'leaderboard_import_failed',
      'No tables were imported',
      ['status' => 400, 'errors' => $errors, 'skipped' => $skipped]
    );
  }

  return [
    'ok' => true,
    'report_date' => $global_report_date !== '' ? $global_report_date : null,
    'tables_updated' => count($updated),
    'updated' => $updated,
    'skipped' => $skipped,
    'errors' => $errors,
  ];
}

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/seed-ideaxchange-leaderboard', [
    'methods' => 'POST',
    'permission_callback' => static function () {
      return current_user_can('edit_posts');
    },
    'callback' => static function ($req) {
      $force = (bool) $req->get_param('force');
      return rest_ensure_response(amerilife_ideaxchange_leaderboard_seed_demo($force));
    },
  ]);

  register_rest_route('amerilife/v1', '/import-ideaxchange-leaderboard', [
    'methods' => 'POST',
    'permission_callback' => static function () {
      return current_user_can('edit_posts');
    },
    'callback' => static function ($req) {
      $payload = $req->get_json_params();
      if (!is_array($payload) || $payload === []) {
        $payload = $req->get_body_params();
      }
      if (!is_array($payload)) {
        $payload = [];
      }
      return rest_ensure_response(amerilife_ideaxchange_leaderboard_import_tables($payload));
    },
  ]);
});
