<?php
/**
 * Plugin Name: AmeriLife Agent CPT (MU)
 * Description: Career agent custom post type linked to agencies, with WPGraphQL fields.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('init', function () {
  register_post_type('agent', [
    'labels' => [
      'name' => 'Agents',
      'singular_name' => 'Agent',
      'add_new' => 'Add Agent',
      'add_new_item' => 'Add New Agent',
      'edit_item' => 'Edit Agent',
      'new_item' => 'New Agent',
      'view_item' => 'View Agent',
      'search_items' => 'Search Agents',
      'not_found' => 'No agents found',
      'not_found_in_trash' => 'No agents found in Trash',
      'menu_name' => 'Career Agents',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-businessperson',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'career-agent', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'agent',
    'graphql_plural_name' => 'agents',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  $meta_auth = function () {
    return current_user_can('edit_posts');
  };

  foreach (
    [
      'role' => 'string',
      'city' => 'string',
      'state' => 'string',
      'agent_phone' => 'string',
      'email' => 'string',
      'reviews_count' => 'string',
      'areas_of_focus' => 'string',
      'agency_id' => 'string',
    ] as $key => $type
  ) {
    register_post_meta('agent', $key, [
      'type' => $type,
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => $meta_auth,
    ]);
  }
}, 9);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'agent_details',
    'Agent details',
    'amerilife_agent_details_metabox',
    'agent',
    'normal',
    'high'
  );
});

function amerilife_agent_details_metabox($post) {
  wp_nonce_field('amerilife_agent_save', 'amerilife_agent_nonce');
  $agency_id = (int) get_post_meta($post->ID, 'agency_id', true);

  echo '<p><label for="agency_id"><strong>Agency</strong></label></p>';
  wp_dropdown_pages(
    [
      'name' => 'agency_id',
      'id' => 'agency_id',
      'post_type' => 'agency',
      'selected' => $agency_id,
      'show_option_none' => '— Select agency —',
    ]
  );

  $fields = [
    'role' => 'Role / title',
    'city' => 'City',
    'state' => 'State',
    'agent_phone' => 'Phone',
    'email' => 'Email',
    'reviews_count' => 'Reviews count (number)',
    'areas_of_focus' => 'Areas of focus (comma-separated)',
  ];

  foreach ($fields as $key => $label) {
    $val = get_post_meta($post->ID, $key, true);
    echo '<p><label for="agent_' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong></label></p>';
    if ($key === 'areas_of_focus') {
      echo '<input type="text" id="agent_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="large-text" value="' . esc_attr((string) $val) . '" />';
    } else {
      echo '<input type="text" id="agent_' . esc_attr($key) . '" name="' . esc_attr($key) . '" class="large-text" value="' . esc_attr((string) $val) . '" />';
    }
  }
}

add_action('save_post_agent', function ($post_id) {
  if (!isset($_POST['amerilife_agent_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['amerilife_agent_nonce'])), 'amerilife_agent_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  if (isset($_POST['agency_id'])) {
    $aid = absint($_POST['agency_id']);
    update_post_meta($post_id, 'agency_id', $aid > 0 ? (string) $aid : '');
  }

  foreach (['role', 'city', 'state', 'agent_phone', 'email', 'reviews_count', 'areas_of_focus'] as $key) {
    if (!isset($_POST[$key])) {
      continue;
    }
    update_post_meta($post_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
  }
}, 10, 1);

/**
 * GraphQL helpers (duplicated from agency plugin to keep plugins independent).
 */
function amerilife_agent_graphql_post_id($post) {
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

function amerilife_agent_meta_str($post_id, $key) {
  $v = get_post_meta($post_id, $key, true);
  return $v !== '' && $v !== null ? (string) $v : null;
}

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('AgentFields', [
    'description' => 'AmeriLife career agent meta',
    'fields' => [
      'role' => ['type' => 'String'],
      'city' => ['type' => 'String'],
      'state' => ['type' => 'String'],
      'agentPhone' => ['type' => 'String'],
      'email' => ['type' => 'String'],
      'reviewsCount' => ['type' => 'Int'],
      'areasOfFocus' => ['type' => 'String'],
      'agencyId' => ['type' => 'Int'],
      'agencySlug' => ['type' => 'String'],
    ],
  ]);

  register_graphql_field('Agent', 'agentFields', [
    'type' => 'AgentFields',
    'resolve' => function ($post) {
      $id = amerilife_agent_graphql_post_id($post);
      if (!$id) {
        return amerilife_agent_empty_fields();
      }
      $agency_id = (int) get_post_meta($id, 'agency_id', true);
      $agency_slug = null;
      if ($agency_id > 0) {
        $agency_slug = get_post_field('post_name', $agency_id, 'agency');
        if ($agency_slug === '') {
          $agency_slug = null;
        }
      }
      $rc = get_post_meta($id, 'reviews_count', true);
      $reviews = null;
      if ($rc !== '' && $rc !== null && is_numeric($rc)) {
        $reviews = (int) $rc;
      }
      return [
        'role' => amerilife_agent_meta_str($id, 'role'),
        'city' => amerilife_agent_meta_str($id, 'city'),
        'state' => amerilife_agent_meta_str($id, 'state'),
        'agentPhone' => amerilife_agent_meta_str($id, 'agent_phone'),
        'email' => amerilife_agent_meta_str($id, 'email'),
        'reviewsCount' => $reviews,
        'areasOfFocus' => amerilife_agent_meta_str($id, 'areas_of_focus'),
        'agencyId' => $agency_id > 0 ? $agency_id : null,
        'agencySlug' => $agency_slug,
      ];
    },
  ]);

  register_graphql_field('Agency', 'officeAgents', [
    'type' => ['list_of' => 'Agent'],
    'description' => 'Agents assigned to this agency',
    'resolve' => function ($post) {
      $id = amerilife_agent_graphql_post_id($post);
      if (!$id) {
        return [];
      }
      $q = new WP_Query([
        'post_type' => 'agent',
        'post_status' => 'publish',
        'posts_per_page' => 100,
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'meta_query' => [
          [
            'key' => 'agency_id',
            'value' => (string) $id,
            'compare' => '=',
          ],
        ],
      ]);
      $out = [];
      foreach ($q->posts as $p) {
        if ($p instanceof WP_Post) {
          $out[] = $p;
        }
      }
      return $out;
    },
  ]);

  register_graphql_field('RootQuery', 'agentByAgencyAndSlug', [
    'type' => 'Agent',
    'description' => 'Find agent by agency slug + agent slug (headless URL /agencySlug/agentSlug/)',
    'args' => [
      'agencySlug' => [
        'type' => 'String',
        'description' => 'Agency post slug',
      ],
      'agentSlug' => [
        'type' => 'String',
        'description' => 'Agent post slug',
      ],
    ],
    'resolve' => function ($root, $args) {
      $as = isset($args['agencySlug']) ? sanitize_title((string) $args['agencySlug']) : '';
      $gs = isset($args['agentSlug']) ? sanitize_title((string) $args['agentSlug']) : '';
      if ($as === '' || $gs === '') {
        return null;
      }
      $agencies = get_posts([
        'post_type' => 'agency',
        'name' => $as,
        'post_status' => 'publish',
        'posts_per_page' => 1,
      ]);
      if (empty($agencies)) {
        return null;
      }
      $aid = (int) $agencies[0]->ID;
      $agents = get_posts([
        'post_type' => 'agent',
        'name' => $gs,
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'meta_query' => [
          [
            'key' => 'agency_id',
            'value' => (string) $aid,
            'compare' => '=',
          ],
        ],
      ]);
      return !empty($agents) ? $agents[0] : null;
    },
  ]);
});

function amerilife_agent_empty_fields() {
  return [
    'role' => null,
    'city' => null,
    'state' => null,
    'agentPhone' => null,
    'email' => null,
    'reviewsCount' => null,
    'areasOfFocus' => null,
    'agencyId' => null,
    'agencySlug' => null,
  ];
}
