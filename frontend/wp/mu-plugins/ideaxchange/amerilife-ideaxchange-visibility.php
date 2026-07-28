<?php
/**
 * Shared audience visibility for gated ideaXchange content.
 * Values: brokerage | career | brokerage_career (Brokerage / Career / Brokerage+Career)
 */

if (!defined('ABSPATH')) {
  exit;
}

define('AMERILIFE_IX_VISIBILITY_META', 'ideaxchange_visibility');

/**
 * @return list<string>
 */
function amerilife_ideaxchange_visibility_post_types() {
  return [
    'ideaxchange_article',
    'ideaxchange_case',
    'ideaxchange_company',
    'ideaxchange_carrier',
    'ideaxchange_lb_table',
  ];
}

/**
 * @return array<string, string>
 */
function amerilife_ideaxchange_visibility_options() {
  return [
    'brokerage' => 'Brokerage',
    'career' => 'Career',
    'brokerage_career' => 'Brokerage+Career',
  ];
}

/**
 * @param mixed $value
 */
function amerilife_ideaxchange_sanitize_visibility($value) {
  $key = is_string($value) ? sanitize_key($value) : '';
  $allowed = array_keys(amerilife_ideaxchange_visibility_options());
  if (!in_array($key, $allowed, true)) {
    return 'brokerage_career';
  }
  return $key;
}

/**
 * @param int $post_id
 */
function amerilife_ideaxchange_get_visibility($post_id) {
  $raw = get_post_meta((int) $post_id, AMERILIFE_IX_VISIBILITY_META, true);
  if ($raw === '' || $raw === false) {
    return 'brokerage_career';
  }
  return amerilife_ideaxchange_sanitize_visibility($raw);
}

/**
 * GraphQL enum value (BROKERAGE | CAREER | BROKERAGE_CAREER).
 *
 * @param int $post_id
 */
function amerilife_ideaxchange_visibility_graphql_enum($post_id) {
  $map = [
    'brokerage' => 'BROKERAGE',
    'career' => 'CAREER',
    'brokerage_career' => 'BROKERAGE_CAREER',
  ];
  $key = amerilife_ideaxchange_get_visibility($post_id);
  return $map[$key] ?? 'BROKERAGE_CAREER';
}

/**
 * @param string $value
 */
function amerilife_ideaxchange_visibility_admin_label($value) {
  $options = amerilife_ideaxchange_visibility_options();
  $key = amerilife_ideaxchange_sanitize_visibility($value);
  return $options[$key] ?? $options['brokerage_career'];
}

add_action('init', function () {
  $auth = function () {
    return current_user_can('edit_posts');
  };

  foreach (amerilife_ideaxchange_visibility_post_types() as $post_type) {
    register_post_meta($post_type, AMERILIFE_IX_VISIBILITY_META, [
      'type' => 'string',
      'single' => true,
      'show_in_rest' => true,
      'default' => 'brokerage_career',
      'auth_callback' => $auth,
    ]);
  }
}, 9);

add_action('add_meta_boxes', function () {
  foreach (amerilife_ideaxchange_visibility_post_types() as $post_type) {
    add_meta_box(
      'ideaxchange_visibility',
      'Audience visibility',
      'amerilife_ideaxchange_render_visibility_meta_box',
      $post_type,
      'side',
      'high'
    );
  }
});

/**
 * @param WP_Post $post
 */
function amerilife_ideaxchange_render_visibility_meta_box($post) {
  wp_nonce_field('ideaxchange_visibility_save', 'ideaxchange_visibility_nonce');
  $current = amerilife_ideaxchange_get_visibility($post->ID);
  $options = amerilife_ideaxchange_visibility_options();

  echo '<p class="description" style="margin-top:0">Controls which Entra groups see this item on amerilife.com/ideaxchange.</p>';
  echo '<p style="margin:10px 0 0"><label for="ideaxchange_visibility"><strong>Visibility</strong></label></p>';
  echo '<select name="ideaxchange_visibility" id="ideaxchange_visibility" class="widefat">';
  foreach ($options as $value => $label) {
    echo '<option value="' . esc_attr($value) . '"' . selected($current, $value, false) . '>' . esc_html($label) . '</option>';
  }
  echo '</select>';
  echo '<p class="description" style="margin-top:8px"><strong>Brokerage</strong> = sales users · <strong>Career</strong> = recruiting users · <strong>Brokerage+Career</strong> = both.</p>';
}

add_action('save_post', function ($post_id) {
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!isset($_POST['ideaxchange_visibility_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ideaxchange_visibility_nonce'])), 'ideaxchange_visibility_save')) {
    return;
  }
  $post = get_post($post_id);
  if (!$post || !in_array($post->post_type, amerilife_ideaxchange_visibility_post_types(), true)) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }
  // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above
  $value = isset($_POST['ideaxchange_visibility']) ? sanitize_text_field(wp_unslash($_POST['ideaxchange_visibility'])) : 'brokerage_career';
  update_post_meta($post_id, AMERILIFE_IX_VISIBILITY_META, amerilife_ideaxchange_sanitize_visibility($value));
}, 10, 1);

foreach (amerilife_ideaxchange_visibility_post_types() as $post_type) {
  add_filter("manage_{$post_type}_posts_columns", function ($columns) {
    $out = [];
    foreach ($columns as $key => $label) {
      $out[$key] = $label;
      if ($key === 'title') {
        $out['ideaxchange_visibility'] = 'Visibility';
      }
    }
    if (!isset($out['ideaxchange_visibility'])) {
      $out['ideaxchange_visibility'] = 'Visibility';
    }
    return $out;
  });

  add_action("manage_{$post_type}_posts_custom_column", function ($column, $post_id) {
    if ($column !== 'ideaxchange_visibility') {
      return;
    }
    echo esc_html(amerilife_ideaxchange_visibility_admin_label(amerilife_ideaxchange_get_visibility($post_id)));
  }, 10, 2);
}

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_enum_type')) {
    return;
  }

  register_graphql_enum_type('IdeaxchangeVisibility', [
    'description' => 'Which Entra audience groups can see gated ideaXchange content',
    'values' => [
      'BROKERAGE' => ['value' => 'BROKERAGE'],
      'CAREER' => ['value' => 'CAREER'],
      'BROKERAGE_CAREER' => ['value' => 'BROKERAGE_CAREER'],
    ],
  ]);
}, 9);
