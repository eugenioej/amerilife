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

  register_post_meta('ideaxchange_article', 'hero_landscape_image_id', [
    'type' => 'integer',
    'single' => true,
    'show_in_rest' => true,
    'default' => 0,
    'auth_callback' => function () {
      return current_user_can('edit_posts');
    },
  ]);

add_action('add_meta_boxes', function () {
  add_meta_box(
    'ideaxchange_hero_landscape_image',
    'Hero Landscape Image',
    'amerilife_ideaxchange_render_hero_landscape_meta_box',
    'ideaxchange_article',
    'side',
    'default'
  );
});

function amerilife_ideaxchange_render_hero_landscape_meta_box($post) {
  wp_nonce_field(
    'ideaxchange_hero_landscape_image',
    'ideaxchange_hero_landscape_image_nonce'
  );

  $image_id = (int) get_post_meta($post->ID, 'hero_landscape_image_id', true);

  $image_url = $image_id
    ? wp_get_attachment_image_url($image_id, 'medium')
    : '';
  ?>

    <div id="ideaxchange-hero-landscape-preview" style="margin-bottom:10px;">
    <?php if ($image_url) : ?>
       <img
        src="<?php echo esc_attr($image_url); ?>"
        alt=""
        style="width:100%;height:auto;display:block;"
      />
    <?php endif; ?>
  </div>

  <input
    type="hidden"
    id="hero_landscape_image_id"
    name="hero_landscape_image_id"
    value="<?php echo esc_attr($image_id); ?>"
  />

  <p>
    <button
      type="button"
      class="button"
      id="ideaxchange-hero-landscape-select"
    >
      Select Image
    </button>

    <button
      type="button"
      class="button"
      id="ideaxchange-hero-landscape-remove"
      <?php echo $image_id ? '' : 'style="display:none;"'; ?>
    >
      Remove
    </button>
  </p>

  <p style="color:#666;font-size:12px;margin-bottom:0;">
    Optional landscape image used for the article hero background.
  </p>

  <?php
}

add_action('save_post_ideaxchange_article', function ($post_id) {
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (wp_is_post_revision($post_id)) {
    return;
  }

  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  if (
    !isset($_POST['ideaxchange_hero_landscape_image_nonce']) ||
    !wp_verify_nonce(
      sanitize_text_field(wp_unslash($_POST['ideaxchange_hero_landscape_image_nonce'])),
      'ideaxchange_hero_landscape_image'
    )
  ) {
    return;
  }

  $image_id = isset($_POST['hero_landscape_image_id'])
    ? absint($_POST['hero_landscape_image_id'])
    : 0;

  if ($image_id > 0) {
    update_post_meta($post_id, 'hero_landscape_image_id', $image_id);
  } else {
    delete_post_meta($post_id, 'hero_landscape_image_id');
  }
});

add_action('admin_enqueue_scripts', function ($hook) {
  if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
    return;
  }

  $screen = function_exists('get_current_screen') ? get_current_screen() : null;

  if (!$screen || $screen->post_type !== 'ideaxchange_article') {
    return;
  }

  wp_enqueue_media();
  wp_enqueue_script('jquery');

  wp_add_inline_script('jquery', <<<'JS'
jQuery(function($) {
  var frame;

  $(document).on('click', '#ideaxchange-hero-landscape-select', function(e) {
    e.preventDefault();

    if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
      console.error('WordPress media uploader is not available.');
      return;
    }

    if (frame) {
      frame.open();
      return;
    }

    frame = wp.media({
      title: 'Select Hero Landscape Image',
      button: {
        text: 'Use this image'
      },
      multiple: false
    });

    frame.on('select', function() {
      var attachment = frame.state().get('selection').first().toJSON();

      var imageUrl = attachment.url;

      if (
        attachment.sizes &&
        attachment.sizes.medium &&
        attachment.sizes.medium.url
      ) {
        imageUrl = attachment.sizes.medium.url;
      }

      $('#hero_landscape_image_id').val(attachment.id);

      $('#ideaxchange-hero-landscape-preview').html(
        '' + imageUrl + ''
      );

      $('#ideaxchange-hero-landscape-remove').show();
    });

    frame.open();
  });

  $(document).on('click', '#ideaxchange-hero-landscape-remove', function(e) {
    e.preventDefault();

    $('#hero_landscape_image_id').val('');
    $('#ideaxchange-hero-landscape-preview').empty();
    $(this).hide();
  });
});
JS);
});

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

  register_graphql_object_type('IdeaxchangeHeroLandscapeImage', [
  'description' => 'Optional landscape image used for the ideaXchange article hero background.',
  'fields' => [
    'sourceUrl' => [
      'type' => 'String',
      'description' => 'The hero landscape image URL.',
    ],
    'altText' => [
      'type' => 'String',
      'description' => 'The hero landscape image alt text.',
    ],
  ],
]);

register_graphql_field('IdeaxchangeArticle', 'heroLandscapeImage', [
  'type' => 'IdeaxchangeHeroLandscapeImage',
  'description' => 'Optional landscape image used for the ideaXchange article hero background.',
  'resolve' => function ($post) {
    $post_id = 0;

    if (is_object($post)) {
      if (isset($post->ID)) {
        $post_id = (int) $post->ID;
      } elseif (isset($post->databaseId)) {
        $post_id = (int) $post->databaseId;
      }
    }

    if (!$post_id) {
      return null;
    }

    $attachment_id = (int) get_post_meta(
      $post_id,
      'hero_landscape_image_id',
      true
    );

    if (!$attachment_id) {
      return null;
    }

    $source_url = wp_get_attachment_image_url($attachment_id, 'full');

    if (!$source_url) {
      return null;
    }

    $alt_text = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);

    return [
      'sourceUrl' => esc_url_raw($source_url),
      'altText' => is_string($alt_text) ? $alt_text : '',
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
