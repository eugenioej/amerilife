<?php
/**
 * Plugin Name: AmeriLife Insights CPT (MU)
 * Description: Public magazine at /insights/ — separate from gated ideaXchange Magazine (`ideaxchange_article`).
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('init', function () {
  register_post_type('insight', [
    'labels' => [
      'name' => 'Insights',
      'singular_name' => 'Insight',
      'add_new' => 'Add Insight',
      'add_new_item' => 'Add New Insight',
      'edit_item' => 'Edit Insight',
      'new_item' => 'New Insight',
      'view_item' => 'View Insight',
      'search_items' => 'Search Insights',
      'not_found' => 'No insights found',
      'not_found_in_trash' => 'No insights found in Trash',
      'menu_name' => 'Insights',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-media-document',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'insight', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'insight',
    'graphql_plural_name' => 'insights',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  register_taxonomy('insight_topic', ['insight'], [
    'labels' => [
      'name' => 'Insight Topics',
      'singular_name' => 'Insight Topic',
      'search_items' => 'Search Topics',
      'all_items' => 'All Topics',
      'edit_item' => 'Edit Topic',
      'update_item' => 'Update Topic',
      'add_new_item' => 'Add New Topic',
      'new_item_name' => 'New Topic Name',
      'menu_name' => 'Topics',
    ],
    'public' => true,
    'hierarchical' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'insightTopic',
    'graphql_plural_name' => 'insightTopics',
    'rewrite' => ['slug' => 'insight-topic', 'with_front' => false],
  ]);

  register_taxonomy('insight_tag', ['insight'], [
    'labels' => [
      'name' => 'Insight Tags',
      'singular_name' => 'Insight Tag',
      'search_items' => 'Search Tags',
      'all_items' => 'All Tags',
      'edit_item' => 'Edit Tag',
      'update_item' => 'Update Tag',
      'add_new_item' => 'Add New Tag',
      'new_item_name' => 'New Tag Name',
      'menu_name' => 'Tags',
    ],
    'public' => true,
    'hierarchical' => false,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'insightTag',
    'graphql_plural_name' => 'insightTags',
    'rewrite' => ['slug' => 'insight-tag', 'with_front' => false],
  ]);

  register_post_meta('insight', 'is_spotlight', [
    'type' => 'boolean',
    'single' => true,
    'show_in_rest' => true,
    'default' => false,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);

  register_post_meta('insight', 'is_featured', [
    'type' => 'boolean',
    'single' => true,
    'show_in_rest' => true,
    'default' => false,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);

  $yoast_meta_keys = [
    '_yoast_wpseo_title',
    '_yoast_wpseo_metadesc',
    '_yoast_wpseo_focuskw',
    '_yoast_wpseo_canonical',
    '_yoast_wpseo_opengraph-title',
    '_yoast_wpseo_opengraph-description',
    '_yoast_wpseo_twitter-title',
    '_yoast_wpseo_twitter-description',
  ];

  foreach ($yoast_meta_keys as $key) {
    register_post_meta('insight', $key, [
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'auth_callback' => function () {
        return current_user_can('edit_posts');
      },
    ]);
  }
}, 9);

add_action('init', function () {
  if (!term_exists('featured', 'insight_tag')) {
    wp_insert_term('Featured', 'insight_tag', ['slug' => 'featured']);
  }
  if (!term_exists('sales', 'insight_tag')) {
    wp_insert_term('Sales', 'insight_tag', ['slug' => 'sales']);
  }
  if (!term_exists('recruit', 'insight_tag')) {
    wp_insert_term('Recruit', 'insight_tag', ['slug' => 'recruit']);
  }
  if (!term_exists('initiative', 'insight_tag')) {
    wp_insert_term('Initiative', 'insight_tag', ['slug' => 'initiative']);
  }
}, 20);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('InsightFields', [
    'description' => 'AmeriLife insight-specific meta',
    'fields' => [
      'isSpotlight' => [
        'type' => 'Boolean',
        'description' => 'Featured in Spotlight sidebar on the Insights index',
      ],
      'isFeatured' => [
        'type' => 'Boolean',
        'description' => 'Shown in the Featured articles row (is_featured meta and/or Featured tag)',
      ],
    ],
  ]);

  register_graphql_field('Insight', 'insightFields', [
    'type' => 'InsightFields',
    'description' => 'Insight spotlight and featured flags',
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
      if (!$featured && taxonomy_exists('insight_tag')) {
        $featured = has_term('featured', 'insight_tag', $id);
      }

      return [
        'isSpotlight' => $spotlight,
        'isFeatured' => $featured,
      ];
    },
  ]);
});

/**
 * Demo rows from insights-demo-seed.json (same file the Next.js app imports for fallback).
 *
 * @return array<int, array<string, mixed>>
 */
function amerilife_insight_get_demo_seed_rows() {
  $path = dirname(__FILE__) . '/insights-demo-seed.json';
  if (!is_readable($path)) {
    return [];
  }
  $json = file_get_contents($path);
  if ($json === false) {
    return [];
  }
  $data = json_decode($json, true);
  return is_array($data) ? $data : [];
}

/**
 * Create demo Insight posts from JSON. Idempotent unless $force is true.
 *
 * @param bool $force When true, deletes all existing insights and re-imports.
 * @return array<string, mixed>
 */
function amerilife_insight_seed_demo_posts($force = false) {
  if (!$force) {
    if (get_option('amerilife_insights_seeded_v1')) {
      return [
        'ok' => true,
        'skipped' => true,
        'reason' => 'already_seeded_flag',
      ];
    }
    $existing = get_posts([
      'post_type' => 'insight',
      'post_status' => ['publish', 'draft', 'pending', 'private'],
      'posts_per_page' => 1,
      'fields' => 'ids',
    ]);
    if (!empty($existing)) {
      update_option('amerilife_insights_seeded_v1', 1);
      return [
        'ok' => true,
        'skipped' => true,
        'reason' => 'insights_already_exist',
      ];
    }
  } else {
    delete_option('amerilife_insights_seeded_v1');
    $all = get_posts([
      'post_type' => 'insight',
      'post_status' => 'any',
      'posts_per_page' => -1,
      'fields' => 'ids',
    ]);
    foreach ($all as $pid) {
      wp_delete_post((int) $pid, true);
    }
  }

  if (!function_exists('media_sideload_image')) {
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
  }

  $demo = amerilife_insight_get_demo_seed_rows();
  if ($demo === []) {
    return [
      'ok' => false,
      'error' => 'no_seed_data',
      'path' => dirname(__FILE__) . '/insights-demo-seed.json',
    ];
  }

  $created = 0;
  foreach ($demo as $row) {
    if (empty($row['slug']) || empty($row['title'])) {
      continue;
    }

    $author_id = (int) get_current_user_id();
    if ($author_id < 1) {
      $author_id = 1;
    }
    if (!empty($row['author_login']) && is_string($row['author_login'])) {
      $u = get_user_by('login', $row['author_login']);
      if ($u) {
        $author_id = (int) $u->ID;
      }
    }

    $post_id = wp_insert_post([
      'post_type' => 'insight',
      'post_status' => 'publish',
      'post_title' => $row['title'],
      'post_name' => $row['slug'],
      'post_content' => isset($row['content']) ? (string) $row['content'] : '',
      'post_excerpt' => isset($row['excerpt']) ? (string) $row['excerpt'] : '',
      'post_date' => isset($row['date']) ? (string) $row['date'] : current_time('mysql'),
      'post_author' => $author_id,
    ], true);

    if (is_wp_error($post_id) || !$post_id) {
      continue;
    }

    $created++;

    if (!empty($row['topic'])) {
      $term = get_term_by('slug', (string) $row['topic'], 'insight_topic');
      if ($term && !is_wp_error($term)) {
        wp_set_object_terms($post_id, [(int) $term->term_id], 'insight_topic');
      }
    }

    if (!empty($row['tags']) && is_array($row['tags'])) {
      $tag_ids = [];
      foreach ($row['tags'] as $tag_slug) {
        $t = get_term_by('slug', (string) $tag_slug, 'insight_tag');
        if ($t && !is_wp_error($t)) {
          $tag_ids[] = (int) $t->term_id;
        }
      }
      if ($tag_ids !== []) {
        wp_set_object_terms($post_id, $tag_ids, 'insight_tag');
      }
    }

    $is_feat = false;
    if (!empty($row['tags']) && is_array($row['tags'])) {
      foreach ($row['tags'] as $tag_slug) {
        if (strtolower((string) $tag_slug) === 'featured') {
          $is_feat = true;
          break;
        }
      }
    }
    update_post_meta($post_id, 'is_featured', $is_feat ? '1' : '0');

    $spotlight = !empty($row['spotlight']);
    update_post_meta($post_id, 'is_spotlight', $spotlight ? '1' : '0');

    $img = isset($row['featured_image_url']) ? trim((string) $row['featured_image_url']) : '';
    if ($img !== '') {
      $att_id = media_sideload_image($img, $post_id, $row['title'], 'id');
      if (!is_wp_error($att_id) && $att_id) {
        set_post_thumbnail($post_id, (int) $att_id);
      }
    }
  }

  update_option('amerilife_insights_seeded_v1', 1);

  return [
    'ok' => true,
    'created' => $created,
    'force' => (bool) $force,
  ];
}

/**
 * Optional: wp-admin → Insights list with ?amerilife_seed_insights=1 (administrator).
 * &amerilife_seed_insights_force=1 wipes and re-imports.
 */
add_action('admin_init', function () {
  if (!current_user_can('manage_options')) {
    return;
  }
  // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- optional admin trigger
  if (empty($_GET['amerilife_seed_insights'])) {
    return;
  }
  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
  $force = !empty($_GET['amerilife_seed_insights_force']);
  amerilife_insight_seed_demo_posts($force);
  wp_safe_redirect(admin_url('edit.php?post_type=insight'));
  exit;
}, 999);

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/insights-seo', [
    'methods' => 'POST',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'callback' => function (WP_REST_Request $request) {
      $params = $request->get_json_params();
      $items  = isset($params['items']) && is_array($params['items']) ? $params['items'] : [];

      if ($items === []) {
        return new WP_REST_Response(['updated' => 0, 'skipped' => 0, 'errors' => []], 200);
      }

      $updated = 0;
      $skipped = 0;
      $errors  = [];

      foreach ($items as $item) {
        if (!is_array($item)) {
          $skipped++;
          continue;
        }

        $slug = isset($item['slug']) ? sanitize_title((string) $item['slug']) : '';
        if ($slug === '') {
          $skipped++;
          continue;
        }

        $posts = get_posts([
          'post_type' => 'insight',
          'post_status' => ['publish', 'draft', 'pending', 'private'],
          'name' => $slug,
          'posts_per_page' => 1,
          'fields' => 'ids',
        ]);

        if ($posts === []) {
          $errors[] = ['slug' => $slug, 'error' => 'not_found'];
          continue;
        }

        $post_id = (int) $posts[0];
        $fields  = [
          'seoTitle' => '_yoast_wpseo_title',
          'metaDescription' => '_yoast_wpseo_metadesc',
          'focusKeyphrase' => '_yoast_wpseo_focuskw',
        ];

        $changed = false;
        foreach ($fields as $input_key => $meta_key) {
          if (!array_key_exists($input_key, $item)) {
            continue;
          }
          $value = sanitize_text_field((string) $item[$input_key]);
          if ($value === '') {
            continue;
          }
          update_post_meta($post_id, $meta_key, $value);
          $changed = true;
        }

        if ($changed) {
          $updated++;
        } else {
          $skipped++;
        }
      }

      return new WP_REST_Response([
        'updated' => $updated,
        'skipped' => $skipped,
        'errors' => $errors,
      ], 200);
    },
  ]);

  register_rest_route('amerilife/v1', '/seed-insights', [
    'methods' => 'POST',
    'permission_callback' => function () {
      return current_user_can('manage_options');
    },
    'callback' => function (WP_REST_Request $request) {
      $force = (bool) $request->get_param('force');
      $result = amerilife_insight_seed_demo_posts($force);
      $status = !empty($result['ok']) ? 200 : 500;
      return new WP_REST_Response($result, $status);
    },
    'args' => [
      'force' => [
        'type' => 'boolean',
        'default' => false,
      ],
    ],
  ]);
});
