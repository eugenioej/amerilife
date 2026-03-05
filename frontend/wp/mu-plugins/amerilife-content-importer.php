<?php
/**
 * Plugin Name: AmeriLife Content Importer (MU)
 * Description: Exposes Yoast SEO meta fields for writing via the REST API and provides a bulk-post-check endpoint.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Register Yoast meta keys so they are writable via the REST API.
 * By default Yoast exposes them for reading but not always for writing
 * via external REST POST requests.
 */
add_action('init', function () {
  $meta_keys = [
    '_yoast_wpseo_title',
    '_yoast_wpseo_metadesc',
    '_yoast_wpseo_canonical',
    '_yoast_wpseo_opengraph-title',
    '_yoast_wpseo_opengraph-description',
    '_yoast_wpseo_twitter-title',
    '_yoast_wpseo_twitter-description',
  ];

  foreach ($meta_keys as $key) {
    register_post_meta('post', $key, [
      'show_in_rest'  => true,
      'single'        => true,
      'type'          => 'string',
      'auth_callback' => function () {
        return current_user_can('edit_posts');
      },
    ]);
  }
});

/**
 * Bulk slug existence check — avoids N+1 queries during migration.
 *
 * POST /wp-json/amerilife/v1/check-slugs
 * Body: { "slugs": ["slug-1", "slug-2", ...] }
 * Response: { "existing": { "slug-1": 123, "slug-2": 456 }, "missing": ["slug-3"] }
 */
add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/check-slugs', [
    'methods'             => 'POST',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'callback' => function (WP_REST_Request $request) {
      $params = $request->get_json_params();
      $slugs  = isset($params['slugs']) && is_array($params['slugs']) ? $params['slugs'] : [];

      if (empty($slugs)) {
        return new WP_REST_Response(['existing' => (object)[], 'missing' => []], 200);
      }

      $existing = [];
      $missing  = [];

      foreach (array_chunk($slugs, 50) as $chunk) {
        $posts = get_posts([
          'post_type'      => 'post',
          'post_status'    => 'any',
          'post_name__in'  => $chunk,
          'posts_per_page' => count($chunk),
          'fields'         => 'ids',
        ]);

        $found_slugs = [];
        foreach ($posts as $post_id) {
          $post = get_post($post_id);
          if ($post) {
            $existing[$post->post_name] = (int) $post->ID;
            $found_slugs[] = $post->post_name;
          }
        }

        foreach ($chunk as $slug) {
          if (!in_array($slug, $found_slugs, true)) {
            $missing[] = $slug;
          }
        }
      }

      return new WP_REST_Response([
        'existing' => (object) $existing,
        'missing'  => array_values($missing),
      ], 200);
    },
  ]);
});
