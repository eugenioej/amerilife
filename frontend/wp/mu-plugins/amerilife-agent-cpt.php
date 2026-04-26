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

add_action('edit_form_top', function ($post) {
  if (!isset($post->post_type) || $post->post_type !== 'agent') {
    return;
  }
  wp_nonce_field('amerilife_agent_save', 'amerilife_agent_nonce');
}, 1);

add_action('add_meta_boxes', function () {
  // Office link: sidebar is easy to find in the block editor; "normal" meta boxes sit far below the blocks.
  add_meta_box(
    'agent_office',
    'Office / agency',
    'amerilife_agent_office_metabox',
    'agent',
    'side',
    'high'
  );
  add_meta_box(
    'agent_details',
    'Agent details',
    'amerilife_agent_details_metabox',
    'agent',
    'normal',
    'high'
  );
});

/**
 * Renders a &lt;select&gt; of published agencies. wp_dropdown_pages() / get_pages() do not
 * list non-hierarchical CPTs, so the Agency dropdown was empty for "agency" posts.
 */
function amerilife_agent_render_agency_select($name, $html_id, $selected_id) {
  if (!post_type_exists('agency')) {
    echo '<p><strong>Agency post type is missing.</strong> The amerilife-agency-cpt plugin must be active.</p>';
    return;
  }
  $agencies = get_posts(
    [
      'post_type'      => 'agency',
      'post_status'    => 'publish',
      'posts_per_page' => 500,
      'orderby'        => 'title',
      'order'          => 'ASC',
      'no_found_rows'  => true,
    ]
  );
  $selected_id = (int) $selected_id;
  echo '<select name="' . esc_attr($name) . '" id="' . esc_attr($html_id) . '" class="widefat" style="max-width:100%;box-sizing:border-box;">';
  echo '<option value="0">— Select agency —</option>';
  foreach ($agencies as $a) {
    $id = (int) $a->ID;
    echo '<option value="' . (int) $id . '" ' . selected($selected_id, $id, false) . '>' . esc_html(get_the_title($a)) . '</option>';
  }
  echo '</select>';
  if (count($agencies) === 0) {
    echo '<p class="description" style="margin-top:8px;">No published <strong>Agencies</strong> found. Add offices under <strong>Agencies</strong> in the admin menu, then return here.</p>';
  }
}

function amerilife_agent_office_metabox($post) {
  $agency_id = (int) get_post_meta($post->ID, 'agency_id', true);

  echo '<p><label for="amerilife_agent_agency_id"><strong>Linked office</strong></label></p>';
  amerilife_agent_render_agency_select('agency_id', 'amerilife_agent_agency_id', $agency_id);
  echo '<p class="description" style="margin-top:0.5em;">';
  echo 'Pick the office and <strong>Update</strong> the agent. The ID is saved as <code>agency_id</code>. ';
  if ($agency_id > 0) {
    $title = get_the_title($agency_id);
    echo 'Saved: <code>agency_id</code> = <strong>' . esc_html((string) $agency_id) . '</strong>';
    if ($title !== '') {
      echo ' — ' . esc_html($title);
    }
    echo '.';
  }
  echo '</p>';
}

function amerilife_agent_details_metabox($post) {
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
  if ($post instanceof WP_Post) {
    return (int) $post->ID;
  }
  if (is_object($post)) {
    if (isset($post->databaseId)) {
      return (int) $post->databaseId;
    }
    if (isset($post->ID) && is_numeric($post->ID)) {
      return (int) $post->ID;
    }
  }
  return 0;
}

function amerilife_agent_meta_str($post_id, $key) {
  $v = get_post_meta($post_id, $key, true);
  return $v !== '' && $v !== null ? (string) $v : null;
}

/**
 * Build a flat OfficeAgent data array from a WP_Post — avoids WPGraphQL model wrapping.
 */
function amerilife_build_office_agent($p) {
  if (!$p instanceof WP_Post) {
    return null;
  }
  $id = (int) $p->ID;
  $rc = get_post_meta($id, 'reviews_count', true);
  $reviews = ($rc !== '' && $rc !== null && is_numeric($rc)) ? (int) $rc : null;
  $agency_id = (int) get_post_meta($id, 'agency_id', true);
  $agency_slug = null;
  if ($agency_id > 0) {
    $s = get_post_field('post_name', $agency_id);
    if ($s !== '') $agency_slug = $s;
  }
  $photo = null;
  $thumb_id = (int) get_post_thumbnail_id($id);
  if ($thumb_id > 0) {
    $img = wp_get_attachment_image_src($thumb_id, 'full');
    if ($img) $photo = $img[0];
  }
  return [
    'slug'         => $p->post_name !== '' ? $p->post_name : null,
    'name'         => $p->post_title !== '' ? $p->post_title : null,
    'menuOrder'    => (int) $p->menu_order,
    'content'      => $p->post_content,
    'photoUrl'     => $photo,
    'role'         => amerilife_agent_meta_str($id, 'role'),
    'email'        => amerilife_agent_meta_str($id, 'email'),
    'phone'        => amerilife_agent_meta_str($id, 'agent_phone'),
    'city'         => amerilife_agent_meta_str($id, 'city'),
    'state'        => amerilife_agent_meta_str($id, 'state'),
    'areasOfFocus' => amerilife_agent_meta_str($id, 'areas_of_focus'),
    'reviewsCount' => $reviews,
    'agencyId'     => $agency_id > 0 ? $agency_id : null,
    'agencySlug'   => $agency_slug,
  ];
}

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  /**
   * OfficeAgent — flat custom type for office listings.
   * Does NOT extend the WPGraphQL 'Agent' node, so no model-wrapping needed.
   * All fields are resolved directly from WP_Post + post_meta.
   */
  register_graphql_object_type('OfficeAgent', [
    'description' => 'AmeriLife career agent (flat, model-free)',
    'fields' => [
      'slug'         => ['type' => 'String'],
      'name'         => ['type' => 'String'],
      'menuOrder'    => ['type' => 'Int'],
      'content'      => ['type' => 'String'],
      'photoUrl'     => ['type' => 'String'],
      'role'         => ['type' => 'String'],
      'email'        => ['type' => 'String'],
      'phone'        => ['type' => 'String'],
      'city'         => ['type' => 'String'],
      'state'        => ['type' => 'String'],
      'areasOfFocus' => ['type' => 'String'],
      'reviewsCount' => ['type' => 'Int'],
      'agencyId'     => ['type' => 'Int'],
      'agencySlug'   => ['type' => 'String'],
    ],
  ]);

  // Keep AgentFields on the built-in Agent type for any existing queries.
  register_graphql_object_type('AgentFields', [
    'description' => 'AmeriLife career agent meta (legacy, via Agent node)',
    'fields' => [
      'role'         => ['type' => 'String'],
      'city'         => ['type' => 'String'],
      'state'        => ['type' => 'String'],
      'agentPhone'   => ['type' => 'String'],
      'email'        => ['type' => 'String'],
      'reviewsCount' => ['type' => 'Int'],
      'areasOfFocus' => ['type' => 'String'],
      'agencyId'     => ['type' => 'Int'],
      'agencySlug'   => ['type' => 'String'],
    ],
  ]);

  register_graphql_field('Agent', 'agentFields', [
    'type' => 'AgentFields',
    'resolve' => function ($post) {
      $id = amerilife_agent_graphql_post_id($post);
      if (!$id) return amerilife_agent_empty_fields();
      $agency_id = (int) get_post_meta($id, 'agency_id', true);
      $agency_slug = null;
      if ($agency_id > 0) {
        $s = get_post_field('post_name', $agency_id);
        if ($s !== '') $agency_slug = $s;
      }
      $rc = get_post_meta($id, 'reviews_count', true);
      $reviews = ($rc !== '' && $rc !== null && is_numeric($rc)) ? (int) $rc : null;
      return [
        'role'         => amerilife_agent_meta_str($id, 'role'),
        'city'         => amerilife_agent_meta_str($id, 'city'),
        'state'        => amerilife_agent_meta_str($id, 'state'),
        'agentPhone'   => amerilife_agent_meta_str($id, 'agent_phone'),
        'email'        => amerilife_agent_meta_str($id, 'email'),
        'reviewsCount' => $reviews,
        'areasOfFocus' => amerilife_agent_meta_str($id, 'areas_of_focus'),
        'agencyId'     => $agency_id > 0 ? $agency_id : null,
        'agencySlug'   => $agency_slug,
      ];
    },
  ]);

  register_graphql_field('Agency', 'officeAgents', [
    'type'        => ['list_of' => 'OfficeAgent'],
    'description' => 'Agents assigned to this agency (flat OfficeAgent type)',
    'resolve' => function ($post) {
      $id = amerilife_agent_graphql_post_id($post);
      if (!$id) return [];
      $q = new WP_Query([
        'post_type'      => 'agent',
        'post_status'    => 'publish',
        'posts_per_page' => 100,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
        'meta_query'     => [[
          'key'     => 'agency_id',
          'value'   => (string) $id,
          'compare' => '=',
        ]],
      ]);
      $out = [];
      foreach ($q->posts as $p) {
        $agent = amerilife_build_office_agent($p);
        if ($agent !== null) $out[] = $agent;
      }
      return $out;
    },
  ]);

  register_graphql_field('RootQuery', 'agentByAgencyAndSlug', [
    'type'        => 'OfficeAgent',
    'description' => 'Find agent by agency slug + agent slug',
    'args' => [
      'agencySlug' => ['type' => 'String', 'description' => 'Agency post slug'],
      'agentSlug'  => ['type' => 'String', 'description' => 'Agent post slug'],
    ],
    'resolve' => function ($root, $args) {
      $as = isset($args['agencySlug']) ? sanitize_title((string) $args['agencySlug']) : '';
      $gs = isset($args['agentSlug'])  ? sanitize_title((string) $args['agentSlug'])  : '';
      if ($as === '' || $gs === '') return null;
      $agencies = get_posts([
        'post_type'      => 'agency',
        'name'           => $as,
        'post_status'    => 'publish',
        'posts_per_page' => 1,
      ]);
      if (empty($agencies)) return null;
      $aid = (int) $agencies[0]->ID;
      $agents = get_posts([
        'post_type'      => 'agent',
        'name'           => $gs,
        'post_status'    => 'publish',
        'posts_per_page' => 1,
        'meta_query'     => [[
          'key'     => 'agency_id',
          'value'   => (string) $aid,
          'compare' => '=',
        ]],
      ]);
      return !empty($agents) ? amerilife_build_office_agent($agents[0]) : null;
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
