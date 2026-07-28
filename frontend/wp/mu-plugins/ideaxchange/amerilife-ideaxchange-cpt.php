<?php
/**
 * AmeriLife ideaXchange Magazine CPT — loaded by amerilife-ideaxchange.php (not a standalone MU plugin).
 * Description: Gated ideaXchange magazine (separate from public Insights) — topics, tags, spotlight meta, WPGraphQL.
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
      'name' => 'ideaXchange Articles',
      'singular_name' => 'Article',
      'add_new' => 'Add Article',
      'add_new_item' => 'Add New Article',
      'edit_item' => 'Edit Article',
      'new_item' => 'New Article',
      'view_item' => 'View Article',
      'search_items' => 'Search Articles',
      'not_found' => 'No articles found',
      'not_found_in_trash' => 'No articles found in Trash',
      'menu_name' => 'ideaXchange Articles',
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
  foreach (['sales' => 'Sales', 'recruit' => 'Recruit', 'initiative' => 'Initiative'] as $slug => $name) {
    if (!term_exists($slug, 'ideaxchange_tag')) {
      wp_insert_term($name, 'ideaxchange_tag', ['slug' => $slug]);
    }
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
      'visibility' => [
        'type' => 'IdeaxchangeVisibility',
        'description' => 'Brokerage / Career / Brokerage+Career audience',
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
        return ['isSpotlight' => false, 'isFeatured' => false, 'visibility' => 'BROKERAGE_CAREER'];
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
        'visibility' => amerilife_ideaxchange_visibility_graphql_enum($id),
      ];
    },
  ]);
});

/**
 * Seed demo magazine articles from JSON.
 *
 * @return array{ok: bool, articles: int}
 */
function amerilife_ideaxchange_magazine_seed_demo($force = false) {
  $path = __DIR__ . '/seed/ideaxchange-magazine-seed.json';
  if (!is_readable($path)) {
    return ['ok' => false, 'articles' => 0, 'error' => 'seed file missing'];
  }

  $raw = file_get_contents($path);
  $data = json_decode((string) $raw, true);
  if (!is_array($data)) {
    return ['ok' => false, 'articles' => 0, 'error' => 'invalid json'];
  }

  if (!$force && get_option('amerilife_ideaxchange_magazine_seeded_v1')) {
    return ['ok' => true, 'articles' => 0, 'skipped' => true];
  }

  $created = 0;

  foreach ($data['articles'] ?? [] as $row) {
    if (empty($row['slug']) || empty($row['title'])) {
      continue;
    }
    $existing = get_page_by_path((string) $row['slug'], OBJECT, 'ideaxchange_article');
    if ($existing && !$force) {
      continue;
    }
    if ($existing && $force) {
      wp_delete_post((int) $existing->ID, true);
    }

    $aid = wp_insert_post([
      'post_type' => 'ideaxchange_article',
      'post_status' => 'publish',
      'post_title' => (string) $row['title'],
      'post_name' => (string) $row['slug'],
      'post_content' => isset($row['content']) ? (string) $row['content'] : '',
      'post_excerpt' => isset($row['excerpt']) ? (string) $row['excerpt'] : '',
      'post_date' => isset($row['date']) ? (string) $row['date'] : current_time('mysql'),
    ], true);

    if (is_wp_error($aid) || !$aid) {
      continue;
    }
    $created++;

    if (!empty($row['spotlight'])) {
      update_post_meta($aid, 'is_spotlight', '1');
    }
    if (!empty($row['featured'])) {
      update_post_meta($aid, 'is_featured', '1');
    }
    if (!empty($row['visibility'])) {
      update_post_meta($aid, AMERILIFE_IX_VISIBILITY_META, amerilife_ideaxchange_sanitize_visibility($row['visibility']));
    }

    if (!empty($row['topic']) && taxonomy_exists('ideaxchange_topic')) {
      $term = get_term_by('slug', (string) $row['topic'], 'ideaxchange_topic');
      if ($term && !is_wp_error($term)) {
        wp_set_object_terms($aid, [(int) $term->term_id], 'ideaxchange_topic');
      }
    }

    if (!empty($row['tags']) && is_array($row['tags']) && taxonomy_exists('ideaxchange_tag')) {
      $tag_ids = [];
      foreach ($row['tags'] as $tag_slug) {
        $term = get_term_by('slug', (string) $tag_slug, 'ideaxchange_tag');
        if ($term && !is_wp_error($term)) {
          $tag_ids[] = (int) $term->term_id;
        }
      }
      if ($tag_ids) {
        wp_set_object_terms($aid, $tag_ids, 'ideaxchange_tag');
      }
    }
  }

  update_option('amerilife_ideaxchange_magazine_seeded_v1', 1);

  return ['ok' => true, 'articles' => $created];
}

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/seed-ideaxchange-magazine', [
    'methods' => 'POST',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'callback' => function ($req) {
      $force = (bool) $req->get_param('force');
      return rest_ensure_response(amerilife_ideaxchange_magazine_seed_demo($force));
    },
  ]);
});
