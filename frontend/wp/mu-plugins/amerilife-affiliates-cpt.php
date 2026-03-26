<?php
/**
 * Plugin Name: AmeriLife Affiliates CPT (MU)
 * Description: Registers the Affiliate custom post type, categories taxonomy, and WPGraphQL fields.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Default affiliate category terms (slug => label).
 */
function amerilife_affiliate_default_categories() {
  return [
    'medical-life-health' => 'Medical, Life & Health Market',
    'wealth-management-retirement' => 'Wealth Management & Retirement Planning Market',
    'worksite-distribution' => 'Worksite Distribution',
    'direct-to-consumer' => 'Direct to Consumer',
  ];
}

add_action('init', function () {
  register_post_type('affiliate', [
    'labels' => [
      'name' => 'Affiliates',
      'singular_name' => 'Affiliate',
      'add_new' => 'Add Affiliate',
      'add_new_item' => 'Add New Affiliate',
      'edit_item' => 'Edit Affiliate',
      'new_item' => 'New Affiliate',
      'view_item' => 'View Affiliate',
      'search_items' => 'Search Affiliates',
      'not_found' => 'No affiliates found',
      'not_found_in_trash' => 'No affiliates found in Trash',
      'menu_name' => 'Affiliates',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-building',
    'supports' => ['title', 'thumbnail', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'affiliate', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'affiliate',
    'graphql_plural_name' => 'affiliates',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  register_taxonomy('affiliate_category', ['affiliate'], [
    'labels' => [
      'name' => 'Affiliate Categories',
      'singular_name' => 'Affiliate Category',
      'search_items' => 'Search Categories',
      'all_items' => 'All Categories',
      'edit_item' => 'Edit Category',
      'update_item' => 'Update Category',
      'add_new_item' => 'Add New Category',
      'new_item_name' => 'New Category Name',
      'menu_name' => 'Categories',
    ],
    'public' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'affiliateCategory',
    'graphql_plural_name' => 'affiliateCategories',
    'rewrite' => ['slug' => 'affiliate-category', 'with_front' => false],
  ]);

  register_post_meta('affiliate', 'website_url', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);
}, 9);

/**
 * Seed default category terms once taxonomy exists.
 */
add_action('init', function () {
  foreach (amerilife_affiliate_default_categories() as $slug => $name) {
    if (term_exists($slug, 'affiliate_category')) {
      continue;
    }
    wp_insert_term($name, 'affiliate_category', ['slug' => $slug]);
  }
}, 20);

/**
 * Admin metabox for website URL (clearer than raw Custom Fields).
 */
add_action('add_meta_boxes', function () {
  add_meta_box(
    'affiliate_website_url',
    'Website URL',
    function ($post) {
      if ($post->post_type !== 'affiliate') {
        return;
      }
      wp_nonce_field('affiliate_website_url_save', 'affiliate_website_url_nonce');
      $value = get_post_meta($post->ID, 'website_url', true);
      echo '<p><label for="affiliate_website_url_field">Optional link when the logo is clicked</label></p>';
      echo '<input type="url" id="affiliate_website_url_field" name="website_url" class="large-text" value="' . esc_attr((string) $value) . '" placeholder="https://" />';
    },
    'affiliate',
    'side',
    'default'
  );
});

add_action('save_post_affiliate', function ($post_id) {
  if (!isset($_POST['affiliate_website_url_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['affiliate_website_url_nonce'])), 'affiliate_website_url_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }
  $url = isset($_POST['website_url']) ? esc_url_raw(wp_unslash($_POST['website_url'])) : '';
  update_post_meta($post_id, 'website_url', $url);
}, 10, 1);

/**
 * Expose grouped affiliate fields on the Affiliate GraphQL type.
 */
add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('AffiliateFields', [
    'description' => 'AmeriLife affiliate-specific meta',
    'fields' => [
      'websiteUrl' => [
        'type' => 'String',
        'description' => 'Optional external website URL',
      ],
    ],
  ]);

  register_graphql_field('Affiliate', 'affiliateFields', [
    'type' => 'AffiliateFields',
    'description' => 'Affiliate website link',
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
        return ['websiteUrl' => null];
      }
      $url = get_post_meta($id, 'website_url', true);
      return [
        'websiteUrl' => $url !== '' ? (string) $url : null,
      ];
    },
  ]);
});
