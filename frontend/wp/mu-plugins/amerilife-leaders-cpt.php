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
});

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
