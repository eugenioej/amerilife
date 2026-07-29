<?php
/**
 * AmeriLife ideaXchange Case Study CPT — loaded by amerilife-ideaxchange.php.
 * Description: Recruiting Hub case studies with campaign download assets and company author.
 */

if (!defined('ABSPATH')) {
  exit;
}

/** WordPress post type names must be ≤ 20 characters. */
define('AMERILIFE_IX_CASE_STUDY_PT', 'ideaxchange_case');

function amerilife_ideaxchange_case_study_post_id($post) {
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

function amerilife_ideaxchange_case_study_attachment_asset($attachment_id, $label) {
  return amerilife_ideaxchange_attachment_asset($attachment_id, $label);
}

/** @return array<string, string> */
function amerilife_ideaxchange_case_study_legacy_asset_map() {
  return [
    'call_scripts_attachment_id' => 'Call Scripts',
    'interview_questions_attachment_id' => 'Interview Questions',
    'email_templates_attachment_id' => 'Email Templates',
  ];
}

add_action('init', function () {
  register_post_type(AMERILIFE_IX_CASE_STUDY_PT, [
    'labels' => [
      'name' => 'ideaXchange Case Studies',
      'singular_name' => 'Case Study',
      'add_new' => 'Add Case Study',
      'add_new_item' => 'Add New Case Study',
      'edit_item' => 'Edit Case Study',
      'new_item' => 'New Case Study',
      'view_item' => 'View Case Study',
      'search_items' => 'Search Case Studies',
      'not_found' => 'No case studies found',
      'not_found_in_trash' => 'No case studies found in Trash',
      'menu_name' => 'ideaXchange Case Studies',
    ],
    'public' => true,
    'has_archive' => false,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-megaphone',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'page-attributes'],
    'rewrite' => ['slug' => 'ideaxchange-case-study', 'with_front' => false],
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeCaseStudy',
    'graphql_plural_name' => 'ideaxchangeCaseStudies',
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);

  register_taxonomy('ideaxchange_case_study_tag', [AMERILIFE_IX_CASE_STUDY_PT], [
    'labels' => [
      'name' => 'Case Study Tags',
      'singular_name' => 'Case Study Tag',
      'menu_name' => 'Tags',
    ],
    'public' => true,
    'hierarchical' => false,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'ideaxchangeCaseStudyTag',
    'graphql_plural_name' => 'ideaxchangeCaseStudyTags',
    'rewrite' => ['slug' => 'ideaxchange-case-study-tag', 'with_front' => false],
  ]);

  $meta_auth = function () {
    return current_user_can('edit_posts');
  };

  register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, 'company_id', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => $meta_auth,
  ]);

  foreach (['is_spotlight', 'is_featured', 'is_hero'] as $key) {
    register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, $key, [
      'type' => 'boolean',
      'single' => true,
      'show_in_rest' => true,
      'default' => false,
      'auth_callback' => $meta_auth,
    ]);
  }

  register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, 'campaign_assets_json', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => $meta_auth,
  ]);

  foreach (amerilife_ideaxchange_case_study_legacy_asset_map() as $key => $label) {
    register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, $key, [
      'type' => 'integer',
      'single' => true,
      'show_in_rest' => true,
      'default' => 0,
      'auth_callback' => $meta_auth,
    ]);
  }

  register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, 'marketing_cta_url', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'auth_callback' => $meta_auth,
  ]);

  foreach (
    [
      'target_audience' => 'string',
      'campaign_spend' => 'string',
      'campaign_results' => 'string',
      'campaign_overview' => 'string',
    ] as $key => $type
  ) {
    register_post_meta(AMERILIFE_IX_CASE_STUDY_PT, $key, [
      'type' => $type,
      'single' => true,
      'show_in_rest' => true,
      'auth_callback' => $meta_auth,
    ]);
  }
}, 9);

add_action('init', function () {
  if (!term_exists('featured', 'ideaxchange_case_study_tag')) {
    wp_insert_term('Featured', 'ideaxchange_case_study_tag', ['slug' => 'featured']);
  }
}, 20);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'ideaxchange_case_study_details',
    'Case study details',
    function ($post) {
      if ($post->post_type !== AMERILIFE_IX_CASE_STUDY_PT) {
        return;
      }
      wp_nonce_field('ideaxchange_case_study_save', 'ideaxchange_case_study_nonce');

      $company_id = get_post_meta($post->ID, 'company_id', true);
      $companies = get_posts([
        'post_type' => 'ideaxchange_company',
        'post_status' => 'publish',
        'numberposts' => 200,
        'orderby' => 'title',
        'order' => 'ASC',
      ]);

      echo '<p><label for="ideaxchange_case_study_company"><strong>Company</strong></label></p>';
      echo '<p class="description" style="margin-top:0">Author byline on the case study and campaigns table. Links to the company profile page.</p>';
      echo '<select name="company_id" id="ideaxchange_case_study_company" class="widefat" style="margin-top:6px">';
      echo '<option value="">— Select company —</option>';
      foreach ($companies as $c) {
        $sel = (string) $company_id === (string) $c->ID ? ' selected' : '';
        $slug = $c->post_name ? (string) $c->post_name : '';
        $label = $slug !== '' ? $c->post_title . ' (' . $slug . ')' : $c->post_title;
        echo '<option value="' . esc_attr((string) $c->ID) . '"' . $sel . '>' . esc_html($label) . '</option>';
      }
      echo '</select>';
      if ($company_id) {
        $edit_url = get_edit_post_link((int) $company_id, 'raw');
        if ($edit_url) {
          echo '<p style="margin-top:8px"><a href="' . esc_url($edit_url) . '">Edit company profile</a></p>';
        }
      }

      $spot = (bool) filter_var(get_post_meta($post->ID, 'is_spotlight', true), FILTER_VALIDATE_BOOLEAN);
      $feat = (bool) filter_var(get_post_meta($post->ID, 'is_featured', true), FILTER_VALIDATE_BOOLEAN);
      $hero = (bool) filter_var(get_post_meta($post->ID, 'is_hero', true), FILTER_VALIDATE_BOOLEAN);
      echo '<p style="margin-top:16px"><label><input type="checkbox" name="is_spotlight" value="1"' . checked($spot, true, false) . ' /> Spotlight sidebar</label></p>';
      echo '<p><label><input type="checkbox" name="is_featured" value="1"' . checked($feat, true, false) . ' /> Featured on Recruiting Hub</label></p>';
      echo '<p><label><input type="checkbox" name="is_hero" value="1"' . checked($hero, true, false) . ' /> Hero tile (top row)</label></p>';

      $cta = get_post_meta($post->ID, 'marketing_cta_url', true);
      echo '<p style="margin-top:16px"><label for="marketing_cta_url"><strong>Get started button URL</strong></label></p>';
      echo '<input type="url" class="large-text" id="marketing_cta_url" name="marketing_cta_url" value="' . esc_attr((string) $cta) . '" placeholder="/connect/" />';
      echo '<p class="description">Sidebar CTA in &ldquo;Run this campaign&rdquo;. Defaults to /connect/ on the frontend when empty.</p>';

      $table_fields = [
        'target_audience' => 'Target audience (campaigns table)',
        'campaign_spend' => 'Spend (campaigns table)',
        'campaign_results' => 'Results (campaigns table)',
        'campaign_overview' => 'Overview tooltip (optional)',
      ];
      echo '<p style="margin-top:16px"><strong>Campaigns table</strong></p>';
      echo '<p class="description" style="margin-top:0">Shown on the Recruiting Hub campaigns table. Overview powers the info tooltip.</p>';
      foreach ($table_fields as $key => $label) {
        $val = get_post_meta($post->ID, $key, true);
        echo '<p style="margin-top:8px"><label for="' . esc_attr($key) . '">' . esc_html($label) . '</label></p>';
        echo '<input type="text" class="large-text" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr((string) $val) . '" />';
      }
    },
    AMERILIFE_IX_CASE_STUDY_PT,
    'side',
    'default'
  );

  add_meta_box(
    'ideaxchange_case_study_assets',
    'Run this campaign — downloads',
    function ($post) {
      if ($post->post_type !== AMERILIFE_IX_CASE_STUDY_PT) {
        return;
      }
      amerilife_ideaxchange_render_resources_repeater(
        (int) $post->ID,
        'campaign_assets_json',
        amerilife_ideaxchange_case_study_legacy_asset_map(),
        'Downloads in the "Run this campaign" sidebar. Add a name and file for each download.'
      );
    },
    AMERILIFE_IX_CASE_STUDY_PT,
    'normal',
    'default'
  );
});

add_action('save_post_' . AMERILIFE_IX_CASE_STUDY_PT, function ($post_id) {
  if (!isset($_POST['ideaxchange_case_study_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ideaxchange_case_study_nonce'])), 'ideaxchange_case_study_save')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  $company = isset($_POST['company_id']) ? sanitize_text_field(wp_unslash($_POST['company_id'])) : '';
  update_post_meta($post_id, 'company_id', $company);

  update_post_meta($post_id, 'is_spotlight', !empty($_POST['is_spotlight']) ? '1' : '0');
  update_post_meta($post_id, 'is_featured', !empty($_POST['is_featured']) ? '1' : '0');
  update_post_meta($post_id, 'is_hero', !empty($_POST['is_hero']) ? '1' : '0');

  $cta = isset($_POST['marketing_cta_url']) ? esc_url_raw(wp_unslash($_POST['marketing_cta_url'])) : '';
  update_post_meta($post_id, 'marketing_cta_url', $cta);

  foreach (['target_audience', 'campaign_spend', 'campaign_results', 'campaign_overview'] as $key) {
    $val = isset($_POST[$key]) ? sanitize_text_field(wp_unslash($_POST[$key])) : '';
    update_post_meta($post_id, $key, $val);
  }

  $assets = amerilife_ideaxchange_resources_from_post_request();
  update_post_meta($post_id, 'campaign_assets_json', wp_json_encode($assets));

  foreach (array_keys(amerilife_ideaxchange_case_study_legacy_asset_map()) as $key) {
    delete_post_meta($post_id, $key);
  }
}, 10, 1);

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeCampaignAsset', [
    'description' => 'Downloadable campaign asset for a case study',
    'fields' => [
      'label' => ['type' => 'String'],
      'fileUrl' => ['type' => 'String'],
      'mimeType' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeCaseStudyFields', [
    'description' => 'ideaXchange case study meta',
    'fields' => [
      'isSpotlight' => ['type' => 'Boolean'],
      'isFeatured' => ['type' => 'Boolean'],
      'isHeroFeatured' => ['type' => 'Boolean'],
      'marketingCtaUrl' => ['type' => 'String'],
      'targetAudience' => ['type' => 'String'],
      'campaignSpend' => ['type' => 'String'],
      'campaignResults' => ['type' => 'String'],
      'campaignOverview' => ['type' => 'String'],
      'campaignAssets' => [
        'type' => ['list_of' => 'IdeaxchangeCampaignAsset'],
        'description' => 'Run this campaign download files',
      ],
      'visibility' => [
        'type' => 'IdeaxchangeVisibility',
        'description' => 'Brokerage / Career / Brokerage+Career audience',
      ],
    ],
  ]);

  register_graphql_field('IdeaxchangeCaseStudy', 'ideaxchangeCaseStudyFields', [
    'type' => 'IdeaxchangeCaseStudyFields',
    'resolve' => function ($post) {
      $id = amerilife_ideaxchange_case_study_post_id($post);
      if (!$id) {
        return [
          'isSpotlight' => false,
          'isFeatured' => false,
          'isHeroFeatured' => false,
          'marketingCtaUrl' => null,
          'targetAudience' => null,
          'campaignSpend' => null,
          'campaignResults' => null,
          'campaignOverview' => null,
          'campaignAssets' => [],
          'visibility' => 'BROKERAGE_CAREER',
        ];
      }

      $spot = (bool) filter_var(get_post_meta($id, 'is_spotlight', true), FILTER_VALIDATE_BOOLEAN);
      $feat = (bool) filter_var(get_post_meta($id, 'is_featured', true), FILTER_VALIDATE_BOOLEAN);
      $hero = (bool) filter_var(get_post_meta($id, 'is_hero', true), FILTER_VALIDATE_BOOLEAN);
      if (!$feat && taxonomy_exists('ideaxchange_case_study_tag')) {
        $feat = has_term('featured', 'ideaxchange_case_study_tag', $id);
      }

      $cta = get_post_meta($id, 'marketing_cta_url', true);
      $target_audience = get_post_meta($id, 'target_audience', true);
      $campaign_spend = get_post_meta($id, 'campaign_spend', true);
      $campaign_results = get_post_meta($id, 'campaign_results', true);
      $campaign_overview = get_post_meta($id, 'campaign_overview', true);
      $assets = amerilife_ideaxchange_resolve_resources_graphql(
        $id,
        'campaign_assets_json',
        amerilife_ideaxchange_case_study_legacy_asset_map()
      );

      return [
        'isSpotlight' => $spot,
        'isFeatured' => $feat,
        'isHeroFeatured' => $hero,
        'marketingCtaUrl' => $cta !== '' ? (string) $cta : null,
        'targetAudience' => $target_audience !== '' ? (string) $target_audience : null,
        'campaignSpend' => $campaign_spend !== '' ? (string) $campaign_spend : null,
        'campaignResults' => $campaign_results !== '' ? (string) $campaign_results : null,
        'campaignOverview' => $campaign_overview !== '' ? (string) $campaign_overview : null,
        'campaignAssets' => $assets,
        'visibility' => amerilife_ideaxchange_visibility_graphql_enum($id),
      ];
    },
  ]);

  register_graphql_field('IdeaxchangeCaseStudy', 'caseStudyCompany', [
    'type' => 'IdeaxchangeCompany',
    'description' => 'Linked affiliate company profile',
    'resolve' => function ($post) {
      $id = amerilife_ideaxchange_case_study_post_id($post);
      if (!$id) {
        return null;
      }
      $company_id = (int) get_post_meta($id, 'company_id', true);
      if ($company_id < 1) {
        return null;
      }
      $company = get_post($company_id);
      if (!$company || $company->post_type !== 'ideaxchange_company' || $company->post_status !== 'publish') {
        return null;
      }
      if (class_exists('\WPGraphQL\Model\Post')) {
        return new \WPGraphQL\Model\Post($company);
      }
      return $company;
    },
  ]);
});

/**
 * Apply case study meta from a seed row.
 *
 * @param int $sid
 * @param array<string, mixed> $row
 * @param array<string, int> $company_map
 */
function amerilife_ideaxchange_case_study_apply_seed_meta($sid, $row, $company_map) {
  if (!empty($row['company_slug']) && isset($company_map[(string) $row['company_slug']])) {
    update_post_meta($sid, 'company_id', (string) $company_map[(string) $row['company_slug']]);
  }

  if (!empty($row['featured'])) {
    update_post_meta($sid, 'is_featured', '1');
    $term = get_term_by('slug', 'featured', 'ideaxchange_case_study_tag');
    if ($term && !is_wp_error($term)) {
      wp_set_object_terms($sid, [(int) $term->term_id], 'ideaxchange_case_study_tag');
    }
  } else {
    update_post_meta($sid, 'is_featured', '0');
  }

  update_post_meta($sid, 'is_spotlight', !empty($row['spotlight']) ? '1' : '0');

  if (!empty($row['marketing_cta_url'])) {
    update_post_meta($sid, 'marketing_cta_url', esc_url_raw((string) $row['marketing_cta_url']));
  }

  foreach (
    [
      'target_audience',
      'campaign_spend',
      'campaign_results',
      'campaign_overview',
    ] as $key
  ) {
    if (array_key_exists($key, $row)) {
      update_post_meta($sid, $key, sanitize_text_field((string) $row[$key]));
    }
  }

  if (!empty($row['visibility'])) {
    update_post_meta(
      $sid,
      AMERILIFE_IX_VISIBILITY_META,
      amerilife_ideaxchange_sanitize_visibility($row['visibility'])
    );
  }
}

/**
 * Seed demo recruiting content from JSON.
 *
 * @return array{ok: bool, companies: int, case_studies: int}
 */
function amerilife_ideaxchange_recruiting_seed_demo($force = false) {
  $path = __DIR__ . '/seed/ideaxchange-recruiting-seed.json';
  if (!is_readable($path)) {
    return ['ok' => false, 'companies' => 0, 'case_studies' => 0, 'error' => 'seed file missing'];
  }

  $raw = file_get_contents($path);
  $data = json_decode((string) $raw, true);
  if (!is_array($data)) {
    return ['ok' => false, 'companies' => 0, 'case_studies' => 0, 'error' => 'invalid json'];
  }

  if (!$force && get_option('amerilife_ideaxchange_recruiting_seeded_v3')) {
    return ['ok' => true, 'companies' => 0, 'case_studies' => 0, 'skipped' => true];
  }

  $companies_created = 0;
  $studies_created = 0;
  $company_map = [];

  foreach ($data['companies'] ?? [] as $row) {
    if (empty($row['slug']) || empty($row['title'])) {
      continue;
    }
    $existing = get_page_by_path((string) $row['slug'], OBJECT, 'ideaxchange_company');
    if ($existing && !$force) {
      $company_map[(string) $row['slug']] = (int) $existing->ID;
      continue;
    }
    if ($existing && $force) {
      wp_delete_post((int) $existing->ID, true);
    }

    $cid = wp_insert_post([
      'post_type' => 'ideaxchange_company',
      'post_status' => 'publish',
      'post_title' => (string) $row['title'],
      'post_name' => (string) $row['slug'],
      'post_content' => isset($row['description']) ? (string) $row['description'] : '',
      'post_excerpt' => isset($row['excerpt']) ? (string) $row['excerpt'] : '',
    ], true);

    if (is_wp_error($cid) || !$cid) {
      continue;
    }
    $companies_created++;
    $company_map[(string) $row['slug']] = (int) $cid;

    if (!empty($row['website_url'])) {
      update_post_meta($cid, 'website_url', esc_url_raw((string) $row['website_url']));
    }
    if (!empty($row['learn_more_url'])) {
      update_post_meta($cid, 'learn_more_url', esc_url_raw((string) $row['learn_more_url']));
    }
    if (!empty($row['visibility'])) {
      update_post_meta(
        $cid,
        AMERILIFE_IX_VISIBILITY_META,
        amerilife_ideaxchange_sanitize_visibility($row['visibility'])
      );
    }
  }

  foreach ($data['case_studies'] ?? [] as $row) {
    if (empty($row['slug']) || empty($row['title'])) {
      continue;
    }
    $existing = get_page_by_path((string) $row['slug'], OBJECT, AMERILIFE_IX_CASE_STUDY_PT);
    if ($existing && !$force) {
      amerilife_ideaxchange_case_study_apply_seed_meta((int) $existing->ID, $row, $company_map);
      continue;
    }
    if ($existing && $force) {
      wp_delete_post((int) $existing->ID, true);
    }

    $sid = wp_insert_post([
      'post_type' => AMERILIFE_IX_CASE_STUDY_PT,
      'post_status' => 'publish',
      'post_title' => (string) $row['title'],
      'post_name' => (string) $row['slug'],
      'post_content' => isset($row['content']) ? (string) $row['content'] : '',
      'post_excerpt' => isset($row['excerpt']) ? (string) $row['excerpt'] : '',
      'post_date' => isset($row['date']) ? (string) $row['date'] : current_time('mysql'),
    ], true);

    if (is_wp_error($sid) || !$sid) {
      continue;
    }
    $studies_created++;

    amerilife_ideaxchange_case_study_apply_seed_meta((int) $sid, $row, $company_map);
  }

  update_option('amerilife_ideaxchange_recruiting_seeded_v3', 1);
  delete_option('amerilife_ideaxchange_recruiting_seeded_v2');
  delete_option('amerilife_ideaxchange_recruiting_seeded_v1');

  return [
    'ok' => true,
    'companies' => $companies_created,
    'case_studies' => $studies_created,
  ];
}

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/seed-ideaxchange-recruiting', [
    'methods' => 'POST',
    'permission_callback' => function () {
      return current_user_can('edit_posts');
    },
    'callback' => function ($req) {
      $force = (bool) $req->get_param('force');
      return rest_ensure_response(amerilife_ideaxchange_recruiting_seed_demo($force));
    },
  ]);
});

add_action('admin_init', function () {
  if (!current_user_can('manage_options')) {
    return;
  }
  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
  if (empty($_GET['amerilife_seed_ideaxchange_recruiting'])) {
    return;
  }
  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
  $force = !empty($_GET['amerilife_seed_ideaxchange_recruiting_force']);
  amerilife_ideaxchange_recruiting_seed_demo($force);
  wp_safe_redirect(admin_url('edit.php?post_type=' . AMERILIFE_IX_CASE_STUDY_PT . '&seeded=1'));
  exit;
});
