<?php
/**
 * Plugin Name: AmeriLife Leaders CPT (MU)
 * Description: Registers the Leader custom post type with WPGraphQL and leader-specific fields.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('init', function () {
  register_post_type('leader', [
    'labels' => [
      'name' => 'Leaders',
      'singular_name' => 'Leader',
      'add_new' => 'Add Leader',
      'add_new_item' => 'Add New Leader',
      'edit_item' => 'Edit Leader',
      'new_item' => 'New Leader',
      'view_item' => 'View Leader',
      'search_items' => 'Search Leaders',
      'not_found' => 'No leaders found',
      'not_found_in_trash' => 'No leaders found in Trash',
      'menu_name' => 'Leaders',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-groups',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'leader', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'leader',
    'graphql_plural_name' => 'leaders',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  register_post_meta('leader', 'job_title', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);

  register_post_meta('leader', 'linkedin_url', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);
}, 9);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'amerilife_leader_details',
    'Leader details',
    'amerilife_leader_details_metabox',
    'leader',
    'normal',
    'high'
  );
});

function amerilife_leader_details_metabox($post) {
  wp_nonce_field('amerilife_leader_save', 'amerilife_leader_nonce');
  $job_title = (string) get_post_meta($post->ID, 'job_title', true);
  $linkedin_url = (string) get_post_meta($post->ID, 'linkedin_url', true);

  echo '<p><label for="amerilife_leader_job_title"><strong>Job title</strong></label></p>';
  echo '<p><input type="text" id="amerilife_leader_job_title" name="job_title" class="large-text" value="' . esc_attr($job_title) . '" placeholder="e.g. President &amp; CEO" /></p>';
  echo '<p class="description">Shown under the leader’s name on the site (separate from the post title, which is the person’s name).</p>';

  echo '<p><label for="amerilife_leader_linkedin_url"><strong>LinkedIn profile URL</strong></label></p>';
  echo '<p><input type="url" id="amerilife_leader_linkedin_url" name="linkedin_url" class="large-text" value="' . esc_attr($linkedin_url) . '" placeholder="https://www.linkedin.com/in/..." inputmode="url" /></p>';
  echo '<p class="description">Full link to the leader’s public LinkedIn profile. Leave empty to hide the button.</p>';
}

add_action('save_post_leader', function ($post_id) {
  if (!isset($_POST['amerilife_leader_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['amerilife_leader_nonce'])), 'amerilife_leader_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  if (isset($_POST['job_title'])) {
    update_post_meta($post_id, 'job_title', sanitize_text_field(wp_unslash($_POST['job_title'])));
  }
  if (isset($_POST['linkedin_url'])) {
    $raw = (string) wp_unslash($_POST['linkedin_url']);
    $raw = trim($raw);
    update_post_meta($post_id, 'linkedin_url', $raw === '' ? '' : esc_url_raw($raw));
  }
}, 10, 1);

/**
 * Expose grouped leader fields on the Leader GraphQL type.
 */
add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('LeaderFields', [
    'description' => 'AmeriLife leader-specific meta',
    'fields' => [
      'jobTitle' => [
        'type' => 'String',
        'description' => 'Job title',
      ],
      'linkedinUrl' => [
        'type' => 'String',
        'description' => 'LinkedIn profile URL',
      ],
    ],
  ]);

  register_graphql_field('Leader', 'leaderFields', [
    'type' => 'LeaderFields',
    'description' => 'Leader job title and social links',
    'resolve' => function ($post) {
      $id = 0;
      if (is_object($post)) {
        if (isset($post->ID)) {
          $id = (int) $post->ID;
        } elseif (isset($post->databaseId)) {
          $id = (int) $post->databaseId;
        }
      }
      if (!$id) {
        return ['jobTitle' => null, 'linkedinUrl' => null];
      }
      $job = get_post_meta($id, 'job_title', true);
      $linkedin = get_post_meta($id, 'linkedin_url', true);
      return [
        'jobTitle' => $job !== '' ? (string) $job : null,
        'linkedinUrl' => $linkedin !== '' ? (string) $linkedin : null,
      ];
    },
  ]);
});
