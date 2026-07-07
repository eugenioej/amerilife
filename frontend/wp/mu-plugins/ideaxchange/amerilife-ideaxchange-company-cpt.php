<?php
/**
 * AmeriLife ideaXchange Company CPT — loaded by amerilife-ideaxchange.php.
 * Description: Affiliate company profiles for ideaXchange Recruiting Hub.
 */

if (!defined('ABSPATH')) {
  exit;
}

function amerilife_ideaxchange_company_post_id($post) {
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

add_action('init', function () {
  register_post_type('ideaxchange_company', [
    'labels' => [
      'name' => 'ideaXchange Companies',
      'singular_name' => 'ideaXchange Company',
      'add_new' => 'Add Company',
      'add_new_item' => 'Add New Company',
      'edit_item' => 'Edit Company',
      'new_item' => 'New Company',
      'view_item' => 'View Company',
      'search_items' => 'Search Companies',
      'not_found' => 'No companies found',
      'not_found_in_trash' => 'No companies found in Trash',
      'menu_name' => 'ideaXchange Companies',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-building',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'ideaxchange-company', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeCompany',
    'graphql_plural_name' => 'ideaxchangeCompanies',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  foreach (['website_url', 'learn_more_url'] as $key) {
    register_post_meta('ideaxchange_company', $key, [
      'type' => 'string',
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => function () {
        return current_user_can('edit_posts');
      },
    ]);
  }
}, 9);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'ideaxchange_company_urls',
    'Company links',
    function ($post) {
      if ($post->post_type !== 'ideaxchange_company') {
        return;
      }
      wp_nonce_field('ideaxchange_company_urls_save', 'ideaxchange_company_urls_nonce');
      $website = get_post_meta($post->ID, 'website_url', true);
      $learn = get_post_meta($post->ID, 'learn_more_url', true);
      echo '<p><label for="ideaxchange_company_website">Website URL</label></p>';
      echo '<input type="url" class="large-text" id="ideaxchange_company_website" name="website_url" value="' . esc_attr((string) $website) . '" placeholder="https://" />';
      echo '<p class="description" style="margin-top:12px"><label for="ideaxchange_company_learn_more">Learn more URL (optional — defaults to website)</label></p>';
      echo '<input type="url" class="large-text" id="ideaxchange_company_learn_more" name="learn_more_url" value="' . esc_attr((string) $learn) . '" placeholder="https://" />';
    },
    'ideaxchange_company',
    'normal',
    'default'
  );
});

add_action('save_post_ideaxchange_company', function ($post_id) {
  if (!isset($_POST['ideaxchange_company_urls_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ideaxchange_company_urls_nonce'])), 'ideaxchange_company_urls_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }
  $website = isset($_POST['website_url']) ? esc_url_raw(wp_unslash($_POST['website_url'])) : '';
  $learn = isset($_POST['learn_more_url']) ? esc_url_raw(wp_unslash($_POST['learn_more_url'])) : '';
  update_post_meta($post_id, 'website_url', $website);
  update_post_meta($post_id, 'learn_more_url', $learn);
}, 10, 1);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeCompanyFields', [
    'description' => 'ideaXchange company profile meta',
    'fields' => [
      'websiteUrl' => ['type' => 'String'],
      'learnMoreUrl' => ['type' => 'String'],
    ],
  ]);

  register_graphql_field('IdeaxchangeCompany', 'ideaxchangeCompanyFields', [
    'type' => 'IdeaxchangeCompanyFields',
    'description' => 'Company website and learn-more links',
    'resolve' => function ($post) {
      $id = amerilife_ideaxchange_company_post_id($post);
      if (!$id) {
        return ['websiteUrl' => null, 'learnMoreUrl' => null];
      }
      $website = get_post_meta($id, 'website_url', true);
      $learn = get_post_meta($id, 'learn_more_url', true);
      return [
        'websiteUrl' => $website !== '' ? (string) $website : null,
        'learnMoreUrl' => $learn !== '' ? (string) $learn : null,
      ];
    },
  ]);
});
