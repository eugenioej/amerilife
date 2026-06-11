<?php
/**
 * Plugin Name: AmeriLife ideaXchange CPT (MU)
 * Description: Gated ideaXchange magazine articles, topic & tag taxonomies, spotlight meta, WPGraphQL.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

function amerilife_ideaxchange_default_topics() {
  return [
    'health' => 'Health',
    'wealth' => 'Wealth',
    'leadership' => 'Leadership',
    'life' => 'Life',
  ];
}

add_action('init', function () {
  register_post_type('ideaxchange_article', [
    'labels' => [
      'name' => 'ideaXchange',
      'singular_name' => 'ideaXchange Article',
      'add_new' => 'Add Article',
      'add_new_item' => 'Add New Article',
      'edit_item' => 'Edit Article',
      'new_item' => 'New Article',
      'view_item' => 'View Article',
      'search_items' => 'Search ideaXchange',
      'not_found' => 'No articles found',
      'not_found_in_trash' => 'No articles found in Trash',
      'menu_name' => 'ideaXchange',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-lock',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'ideaxchange-article', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeArticle',
    'graphql_plural_name' => 'ideaxchangeArticles',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  register_taxonomy('ideaxchange_topic', ['ideaxchange_article'], [
    'labels' => [
      'name' => 'ideaXchange Topics',
      'singular_name' => 'ideaXchange Topic',
      'menu_name' => 'Topics',
    ],
    'public' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeTopic',
    'graphql_plural_name' => 'ideaxchangeTopics',
    'rewrite' => ['slug' => 'ideaxchange-topic', 'with_front' => false],
  ]);

  register_taxonomy('ideaxchange_tag', ['ideaxchange_article'], [
    'labels' => [
      'name' => 'ideaXchange Tags',
      'singular_name' => 'ideaXchange Tag',
      'menu_name' => 'Tags',
    ],
    'public' => true,
    'hierarchical' => false,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeTag',
    'graphql_plural_name' => 'ideaxchangeTags',
    'rewrite' => ['slug' => 'ideaxchange-tag', 'with_front' => false],
  ]);

  register_post_meta('ideaxchange_article', 'is_spotlight', [
    'type' => 'boolean',
    'single' => true,
    'show_in_rest' => true,
    'default' => false,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);

  register_post_meta('ideaxchange_article', 'is_featured', [
    'type' => 'boolean',
    'single' => true,
    'show_in_rest' => true,
    'default' => false,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);
}, 9);

add_action('init', function () {
  foreach (amerilife_ideaxchange_default_topics() as $slug => $name) {
    if (term_exists($slug, 'ideaxchange_topic')) {
      continue;
    }
    wp_insert_term($name, 'ideaxchange_topic', ['slug' => $slug]);
  }
  if (!term_exists('featured', 'ideaxchange_tag')) {
    wp_insert_term('Featured', 'ideaxchange_tag', ['slug' => 'featured']);
  }
}, 20);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeFields', [
    'description' => 'AmeriLife ideaXchange-specific meta',
    'fields' => [
      'isSpotlight' => [
        'type' => 'Boolean',
        'description' => 'Featured in Spotlight sidebar on the ideaXchange index',
      ],
      'isFeatured' => [
        'type' => 'Boolean',
        'description' => 'Shown in the Featured articles row',
      ],
    ],
  ]);

  register_graphql_field('IdeaxchangeArticle', 'ideaxchangeFields', [
    'type' => 'IdeaxchangeFields',
    'description' => 'ideaXchange spotlight and featured flags',
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
        return ['isSpotlight' => false, 'isFeatured' => false];
      }
      $raw_spot = get_post_meta($id, 'is_spotlight', true);
      $spotlight = (bool) filter_var($raw_spot, FILTER_VALIDATE_BOOLEAN);

      $raw_feat = get_post_meta($id, 'is_featured', true);
      $featured = (bool) filter_var($raw_feat, FILTER_VALIDATE_BOOLEAN);
      if (!$featured && taxonomy_exists('ideaxchange_tag')) {
        $featured = has_term('featured', 'ideaxchange_tag', $id);
      }

      return [
        'isSpotlight' => $spotlight,
        'isFeatured' => $featured,
      ];
    },
  ]);
});
