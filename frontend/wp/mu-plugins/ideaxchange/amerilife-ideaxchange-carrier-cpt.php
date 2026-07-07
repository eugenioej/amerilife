<?php
/**
 * AmeriLife ideaXchange Carrier CPT — loaded by amerilife-ideaxchange.php.
 * Description: Carrier Spotlight profiles with brand colors, highlights, and downloadable resources.
 */

if (!defined('ABSPATH')) {
  exit;
}

function amerilife_ideaxchange_carrier_post_id($post) {
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

function amerilife_ideaxchange_carrier_attachment_asset($attachment_id, $label) {
  $aid = (int) $attachment_id;
  if ($aid < 1) {
    return null;
  }
  $url = wp_get_attachment_url($aid);
  if (!$url) {
    return null;
  }
  $mime = get_post_mime_type($aid);
  return [
    'label' => $label,
    'fileUrl' => $url,
    'mimeType' => $mime ? (string) $mime : null,
  ];
}

function amerilife_ideaxchange_carrier_parse_highlights($json) {
  return amerilife_ideaxchange_parse_highlights_json($json);
}

add_action('init', function () {
  register_post_type('ideaxchange_carrier', [
    'labels' => [
      'name' => 'ideaXchange Carriers',
      'singular_name' => 'Carrier',
      'add_new' => 'Add Carrier',
      'add_new_item' => 'Add New Carrier',
      'edit_item' => 'Edit Carrier',
      'new_item' => 'New Carrier',
      'view_item' => 'View Carrier',
      'search_items' => 'Search Carriers',
      'not_found' => 'No carriers found',
      'not_found_in_trash' => 'No carriers found in Trash',
      'menu_name' => 'ideaXchange Carriers',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-shield-alt',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'ideaxchange-carrier', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeCarrier',
    'graphql_plural_name' => 'ideaxchangeCarriers',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  $meta_auth = function () {
    return current_user_can('edit_posts');
  };

  foreach (['is_spotlight', 'is_featured', 'is_hero'] as $key) {
    register_post_meta('ideaxchange_carrier', $key, [
      'type' => 'boolean',
      'single' => true,
      'show_in_rest' => true,
      'default' => false,
      'auth_callback' => $meta_auth,
    ]);
  }

  foreach (
    [
      'brand_color' => 'string',
      'website_url' => 'string',
      'highlights_json' => 'string',
    ] as $key => $type
  ) {
    register_post_meta('ideaxchange_carrier', $key, [
      'type' => $type,
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => $meta_auth,
    ]);
  }

  foreach (
    [
      'product_portfolio_attachment_id' => 'integer',
      'state_rate_sheets_attachment_id' => 'integer',
      'agent_resources_attachment_id' => 'integer',
    ] as $key => $type
  ) {
    register_post_meta('ideaxchange_carrier', $key, [
      'type' => $type,
      'single' => true,
      'show_in_rest' => true,
      'default' => 0,
      'auth_callback' => $meta_auth,
    ]);
  }
}, 9);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'ideaxchange_carrier_details',
    'Carrier spotlight details',
    function ($post) {
      if ($post->post_type !== 'ideaxchange_carrier') {
        return;
      }
      wp_nonce_field('ideaxchange_carrier_save', 'ideaxchange_carrier_nonce');

      $brand = get_post_meta($post->ID, 'brand_color', true);
      $website = get_post_meta($post->ID, 'website_url', true);
      $hero = (bool) filter_var(get_post_meta($post->ID, 'is_hero', true), FILTER_VALIDATE_BOOLEAN);
      $feat = (bool) filter_var(get_post_meta($post->ID, 'is_featured', true), FILTER_VALIDATE_BOOLEAN);

      echo '<p><label for="brand_color"><strong>Brand color (hex)</strong></label></p>';
      echo '<input type="text" class="regular-text" id="brand_color" name="brand_color" value="' . esc_attr((string) $brand) . '" placeholder="#244260" />';

      echo '<p style="margin-top:16px"><label for="website_url">Website URL</label></p>';
      echo '<input type="url" class="large-text" id="website_url" name="website_url" value="' . esc_attr((string) $website) . '" placeholder="https://" />';

      echo '<p style="margin-top:16px"><label><input type="checkbox" name="is_hero" value="1"' . checked($hero, true, false) . ' /> Hero tile (large, top row)</label></p>';
      echo '<p><label><input type="checkbox" name="is_featured" value="1"' . checked($feat, true, false) . ' /> Featured in additional grid</label></p>';

      echo '<p style="margin-top:20px"><strong>Highlights</strong></p>';
      amerilife_ideaxchange_render_highlights_repeater((int) $post->ID);

      echo '<p style="margin-top:20px"><strong>Carrier resources</strong></p>';
      echo '<p class="description">PDFs and downloads shown in the carrier profile sidebar.</p>';
      amerilife_ideaxchange_render_attachment_picker($post->ID, 'product_portfolio_attachment_id', 'Product Portfolio');
      amerilife_ideaxchange_render_attachment_picker($post->ID, 'state_rate_sheets_attachment_id', 'State Rate Sheets');
      amerilife_ideaxchange_render_attachment_picker($post->ID, 'agent_resources_attachment_id', 'Agent Resources');
    },
    'ideaxchange_carrier',
    'normal',
    'default'
  );
});

add_action('save_post_ideaxchange_carrier', function ($post_id) {
  if (!isset($_POST['ideaxchange_carrier_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ideaxchange_carrier_nonce'])), 'ideaxchange_carrier_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  $brand = isset($_POST['brand_color']) ? sanitize_hex_color(wp_unslash($_POST['brand_color'])) : '';
  update_post_meta($post_id, 'brand_color', $brand ? $brand : '');

  $website = isset($_POST['website_url']) ? esc_url_raw(wp_unslash($_POST['website_url'])) : '';
  update_post_meta($post_id, 'website_url', $website);

  update_post_meta($post_id, 'is_hero', !empty($_POST['is_hero']) ? '1' : '0');
  update_post_meta($post_id, 'is_featured', !empty($_POST['is_featured']) ? '1' : '0');

  $parsed = amerilife_ideaxchange_highlights_from_post_request();
  update_post_meta($post_id, 'highlights_json', wp_json_encode($parsed));

  foreach (
    [
      'product_portfolio_attachment_id',
      'state_rate_sheets_attachment_id',
      'agent_resources_attachment_id',
    ] as $key
  ) {
    $n = isset($_POST[$key]) ? absint($_POST[$key]) : 0;
    update_post_meta($post_id, $key, $n);
  }
}, 10, 1);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeCarrierHighlight', [
    'description' => 'Carrier highlight badge',
    'fields' => [
      'icon' => ['type' => 'String'],
      'label' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeCarrierResource', [
    'description' => 'Downloadable carrier resource',
    'fields' => [
      'label' => ['type' => 'String'],
      'fileUrl' => ['type' => 'String'],
      'mimeType' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeCarrierFields', [
    'description' => 'ideaXchange carrier spotlight meta',
    'fields' => [
      'isSpotlight' => ['type' => 'Boolean'],
      'isFeatured' => ['type' => 'Boolean'],
      'isHero' => ['type' => 'Boolean'],
      'brandColor' => ['type' => 'String'],
      'websiteUrl' => ['type' => 'String'],
      'highlights' => [
        'type' => ['list_of' => 'IdeaxchangeCarrierHighlight'],
      ],
      'carrierResources' => [
        'type' => ['list_of' => 'IdeaxchangeCarrierResource'],
      ],
    ],
  ]);

  register_graphql_field('IdeaxchangeCarrier', 'ideaxchangeCarrierFields', [
    'type' => 'IdeaxchangeCarrierFields',
    'resolve' => function ($post) {
      $id = amerilife_ideaxchange_carrier_post_id($post);
      if (!$id) {
        return [
          'isSpotlight' => false,
          'isFeatured' => false,
          'isHero' => false,
          'brandColor' => null,
          'websiteUrl' => null,
          'highlights' => [],
          'carrierResources' => [],
        ];
      }

      $spot = (bool) filter_var(get_post_meta($id, 'is_spotlight', true), FILTER_VALIDATE_BOOLEAN);
      $feat = (bool) filter_var(get_post_meta($id, 'is_featured', true), FILTER_VALIDATE_BOOLEAN);
      $hero = (bool) filter_var(get_post_meta($id, 'is_hero', true), FILTER_VALIDATE_BOOLEAN);
      $brand = get_post_meta($id, 'brand_color', true);
      $website = get_post_meta($id, 'website_url', true);
      $highlights = amerilife_ideaxchange_carrier_parse_highlights(get_post_meta($id, 'highlights_json', true));

      $resources = [];
      $map = [
        'product_portfolio_attachment_id' => 'Product Portfolio',
        'state_rate_sheets_attachment_id' => 'State Rate Sheets',
        'agent_resources_attachment_id' => 'Agent Resources',
      ];
      foreach ($map as $meta_key => $label) {
        $row = amerilife_ideaxchange_carrier_attachment_asset(get_post_meta($id, $meta_key, true), $label);
        if ($row) {
          $resources[] = $row;
        }
      }

      return [
        'isSpotlight' => $spot,
        'isFeatured' => $feat,
        'isHero' => $hero,
        'brandColor' => $brand !== '' ? (string) $brand : null,
        'websiteUrl' => $website !== '' ? (string) $website : null,
        'highlights' => $highlights,
        'carrierResources' => $resources,
      ];
    },
  ]);
});

/**
 * Seed demo carrier spotlight content from JSON.
 *
 * @return array{ok: bool, carriers: int}
 */
function amerilife_ideaxchange_carrier_seed_demo($force = false) {
  $path = __DIR__ . '/seed/ideaxchange-carrier-seed.json';
  if (!is_readable($path)) {
    return ['ok' => false, 'carriers' => 0, 'error' => 'seed file missing'];
  }

  $raw = file_get_contents($path);
  $data = json_decode((string) $raw, true);
  if (!is_array($data)) {
    return ['ok' => false, 'carriers' => 0, 'error' => 'invalid json'];
  }

  if (!$force && get_option('amerilife_ideaxchange_carrier_seeded_v1')) {
    return ['ok' => true, 'carriers' => 0, 'skipped' => true];
  }

  $default_highlights = [
    ['icon' => 'megaphone', 'label' => 'Brand Recognition'],
    ['icon' => 'shield', 'label' => 'Market Stability'],
    ['icon' => 'dollar', 'label' => 'Competitive Rates'],
    ['icon' => 'cog', 'label' => 'Technology Forward'],
    ['icon' => 'users', 'label' => 'Broker-Focused'],
  ];

  $created = 0;

  foreach ($data['carriers'] ?? [] as $row) {
    if (empty($row['slug']) || empty($row['title'])) {
      continue;
    }
    $existing = get_page_by_path((string) $row['slug'], OBJECT, 'ideaxchange_carrier');
    if ($existing && !$force) {
      continue;
    }
    if ($existing && $force) {
      wp_delete_post((int) $existing->ID, true);
    }

    $cid = wp_insert_post([
      'post_type' => 'ideaxchange_carrier',
      'post_status' => 'publish',
      'post_title' => (string) $row['title'],
      'post_name' => (string) $row['slug'],
      'post_content' => isset($row['content']) ? (string) $row['content'] : '',
      'post_excerpt' => isset($row['excerpt']) ? (string) $row['excerpt'] : '',
    ], true);

    if (is_wp_error($cid) || !$cid) {
      continue;
    }
    $created++;

    if (!empty($row['brand_color'])) {
      update_post_meta($cid, 'brand_color', sanitize_hex_color((string) $row['brand_color']));
    }
    if (!empty($row['website_url'])) {
      update_post_meta($cid, 'website_url', esc_url_raw((string) $row['website_url']));
    }
    update_post_meta($cid, 'is_hero', !empty($row['hero']) ? '1' : '0');
    update_post_meta($cid, 'is_featured', !empty($row['featured']) ? '1' : '0');

    $highlights = !empty($row['highlights']) && is_array($row['highlights'])
      ? $row['highlights']
      : $default_highlights;
    update_post_meta($cid, 'highlights_json', wp_json_encode(amerilife_ideaxchange_carrier_parse_highlights(wp_json_encode($highlights))));
  }

  update_option('amerilife_ideaxchange_carrier_seeded_v1', 1);

  return ['ok' => true, 'carriers' => $created];
}

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/seed-ideaxchange-carrier', [
    'methods' => 'POST',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'callback' => function ($req) {
      $force = (bool) $req->get_param('force');
      return rest_ensure_response(amerilife_ideaxchange_carrier_seed_demo($force));
    },
  ]);
});
