<?php
/**
 * Plugin Name: AmeriLife Agency CPT (MU)
 * Description: Career office / location (agency) custom post type with WPGraphQL fields.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('init', function () {
  register_post_type('agency', [
    'labels' => [
      'name' => 'Agencies',
      'singular_name' => 'Agency',
      'add_new' => 'Add Agency',
      'add_new_item' => 'Add New Agency',
      'edit_item' => 'Edit Agency',
      'new_item' => 'New Agency',
      'view_item' => 'View Agency',
      'search_items' => 'Search Agencies',
      'not_found' => 'No agencies found',
      'not_found_in_trash' => 'No agencies found in Trash',
      'menu_name' => 'Agencies',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-store',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'agency', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'agency',
    'graphql_plural_name' => 'agencies',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  $meta_auth = function () {
    return current_user_can('edit_posts');
  };

  foreach (
    [
      'phone' => 'string',
      'address_line1' => 'string',
      'address_line2' => 'string',
      'address_city' => 'string',
      'address_state' => 'string',
      'address_zip' => 'string',
      'hours' => 'string',
      'about_office' => 'string',
      'features_json' => 'string',
      'gravity_form_id' => 'integer',
      'map_search_url' => 'string',
    ] as $key => $type
  ) {
    register_post_meta('agency', $key, [
      'type' => $type,
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => $meta_auth,
    ]);
  }
}, 9);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'agency_details',
    'Agency details',
    'amerilife_agency_details_metabox',
    'agency',
    'normal',
    'high'
  );
});

function amerilife_agency_details_metabox($post) {
  wp_nonce_field('amerilife_agency_save', 'amerilife_agency_nonce');
  $fields = [
    'phone' => 'Phone',
    'address_line1' => 'Address line 1',
    'address_line2' => 'Address line 2',
    'address_city' => 'City',
    'address_state' => 'State',
    'address_zip' => 'ZIP',
    'hours' => 'Hours (use line breaks between lines)',
    'about_office' => 'About this office',
    'features_json' => 'Features (JSON array: [{"heading","body","icon"}] icon: medicare|health|life|annuity)',
    'gravity_form_id' => 'Gravity Form ID (Connect with an Agent)',
    'map_search_url' => 'Map (Google Maps search URL)',
  ];
  foreach ($fields as $key => $label) {
    $val = get_post_meta($post->ID, $key, true);
    echo '<p><label for="agency_' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong></label></p>';
    if ($key === 'hours' || $key === 'about_office' || $key === 'features_json') {
      echo '<textarea id="agency_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="large-text" rows="' . ($key === 'features_json' ? 12 : 6) . '">' . esc_textarea((string) $val) . '</textarea>';
    } elseif ($key === 'gravity_form_id') {
      echo '<input type="number" id="agency_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="small-text" step="1" min="0" value="' . esc_attr((string) $val) . '" />';
    } elseif ($key === 'map_search_url') {
      echo '<input type="url" id="agency_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="large-text" value="' . esc_attr((string) $val) . '" placeholder="https://www.google.com/maps/search/?api=1&amp;query=..." />';
    } else {
      echo '<input type="text" id="agency_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="large-text" value="' . esc_attr((string) $val) . '" />';
    }
  }
}

add_action('save_post_agency', function ($post_id) {
  if (!isset($_POST['amerilife_agency_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['amerilife_agency_nonce'])), 'amerilife_agency_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }
  $keys = ['phone', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'hours', 'about_office', 'features_json', 'gravity_form_id', 'map_search_url'];
  foreach ($keys as $key) {
    if (!isset($_POST[$key])) {
      continue;
    }
    $raw = wp_unslash($_POST[$key]);
    if ($key === 'gravity_form_id') {
      $n = absint($raw);
      update_post_meta($post_id, $key, $n > 0 ? $n : '');
    } elseif ($key === 'map_search_url') {
      update_post_meta($post_id, $key, $raw !== '' ? esc_url_raw($raw) : '');
    } elseif ($key === 'features_json') {
      update_post_meta($post_id, $key, sanitize_textarea_field($raw));
    } elseif (in_array($key, ['hours', 'about_office'], true)) {
      update_post_meta($post_id, $key, sanitize_textarea_field($raw));
    } else {
      update_post_meta($post_id, $key, sanitize_text_field($raw));
    }
  }
}, 10, 1);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('AgencyFields', [
    'description' => 'AmeriLife agency / office meta',
    'fields' => [
      'phone' => ['type' => 'String'],
      'addressLine1' => ['type' => 'String'],
      'addressLine2' => ['type' => 'String'],
      'addressCity' => ['type' => 'String'],
      'addressState' => ['type' => 'String'],
      'addressZip' => ['type' => 'String'],
      'hours' => ['type' => 'String'],
      'aboutOffice' => ['type' => 'String'],
      'featuresJson' => ['type' => 'String'],
      'gravityFormId' => ['type' => 'Int'],
      'mapSearchUrl' => ['type' => 'String'],
      /** Direct URL from _thumbnail_id — works when featuredImage { node } is null for public GraphQL. */
      'heroImageUrl' => ['type' => 'String'],
    ],
  ]);

  register_graphql_field('Agency', 'agencyFields', [
    'type' => 'AgencyFields',
    'resolve' => function ($post) {
      $id = amerilife_graphql_post_id($post);
      if (!$id) {
        return amerilife_empty_agency_fields();
      }
      $thumb_id = (int) get_post_thumbnail_id($id);
      $hero_url = null;
      if ($thumb_id > 0) {
        $u = wp_get_attachment_image_url($thumb_id, 'full');
        $hero_url = $u ? (string) $u : null;
      }
      return [
        'phone' => amerilife_meta_str($id, 'phone'),
        'addressLine1' => amerilife_meta_str($id, 'address_line1'),
        'addressLine2' => amerilife_meta_str($id, 'address_line2'),
        'addressCity' => amerilife_meta_str($id, 'address_city'),
        'addressState' => amerilife_meta_str($id, 'address_state'),
        'addressZip' => amerilife_meta_str($id, 'address_zip'),
        'hours' => amerilife_meta_str($id, 'hours'),
        'aboutOffice' => amerilife_meta_str($id, 'about_office'),
        'featuresJson' => amerilife_meta_str($id, 'features_json'),
        'gravityFormId' => amerilife_meta_int($id, 'gravity_form_id'),
        'mapSearchUrl' => amerilife_meta_str($id, 'map_search_url'),
        'heroImageUrl' => $hero_url,
      ];
    },
  ]);

});

function amerilife_graphql_post_id($post) {
  $id = 0;
  if (is_object($post)) {
    if (isset($post->ID)) {
      $id = (int) $post->ID;
    } elseif (isset($post->databaseId)) {
      $id = (int) $post->databaseId;
    }
  }
  return $id;
}

function amerilife_meta_str($post_id, $key) {
  $v = get_post_meta($post_id, $key, true);
  return $v !== '' && $v !== null ? (string) $v : null;
}

function amerilife_meta_int($post_id, $key) {
  $v = get_post_meta($post_id, $key, true);
  if ($v === '' || $v === null) {
    return null;
  }
  if (!is_numeric($v)) {
    return null;
  }
  return (int) $v;
}

function amerilife_empty_agency_fields() {
  return [
    'phone' => null,
    'addressLine1' => null,
    'addressLine2' => null,
    'addressCity' => null,
    'addressState' => null,
    'addressZip' => null,
    'hours' => null,
    'aboutOffice' => null,
    'featuresJson' => null,
    'gravityFormId' => null,
    'mapSearchUrl' => null,
    'heroImageUrl' => null,
  ];
}
