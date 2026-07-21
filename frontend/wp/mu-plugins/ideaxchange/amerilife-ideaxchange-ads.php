<?php
/**
 * Plugin Name: AmeriLife ideaXchange Ads (MU)
 * Description: Location-specific sponsorship slots for ideaXchange (up to 3 creatives per slot), editable in WP Admin and exposed via WPGraphQL.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * @return array{attachment_id: int, target_url: string, alt: string}
 */
function amerilife_ideaxchange_ads_empty_creative() {
  return ['attachment_id' => 0, 'target_url' => '', 'alt' => ''];
}

/**
 * Slot registry: key => [label, dimensions legend, group].
 *
 * @return array<string, array{label: string, dimensions: string, group: string}>
 */
function amerilife_ideaxchange_ads_slot_meta() {
  return [
    'home_primary_horizontal' => [
      'label' => __('Home / Magazine — primary horizontal (below featured)', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Home / Magazine index', 'amerilife'),
    ],
    'home_secondary_horizontal' => [
      'label' => __('Home / Magazine — secondary horizontal (main column)', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Home / Magazine index', 'amerilife'),
    ],
    'home_sidebar_vertical' => [
      'label' => __('Home / Magazine — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Home / Magazine index', 'amerilife'),
    ],
    'category_primary_horizontal' => [
      'label' => __('Category page — primary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Category', 'amerilife'),
    ],
    'recruiting_primary_horizontal' => [
      'label' => __('Recruiting Hub — primary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Recruiting Hub', 'amerilife'),
    ],
    'recruiting_secondary_horizontal' => [
      'label' => __('Recruiting Hub — secondary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Recruiting Hub', 'amerilife'),
    ],
    'recruiting_sidebar_vertical' => [
      'label' => __('Recruiting Hub — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Recruiting Hub', 'amerilife'),
    ],
    'sales_success_primary_horizontal' => [
      'label' => __('Sales Success — primary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Sales Success', 'amerilife'),
    ],
    'sales_success_sidebar_vertical' => [
      'label' => __('Sales Success — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Sales Success', 'amerilife'),
    ],
    'leaderboard_secondary_horizontal' => [
      'label' => __('Sales Leaderboard — secondary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Sales Leaderboard', 'amerilife'),
    ],
    'leaderboard_sidebar_vertical' => [
      'label' => __('Sales Leaderboard — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Sales Leaderboard', 'amerilife'),
    ],
    'carrier_sidebar_vertical' => [
      'label' => __('Carrier Spotlight — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Carrier Spotlight', 'amerilife'),
    ],
    'article_in_article' => [
      'label' => __('Article — mid-content horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Article', 'amerilife'),
    ],
    'article_sidebar_vertical' => [
      'label' => __('Article — sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Article', 'amerilife'),
    ],
  ];
}

/**
 * @return array<string, array{creatives: list<array{attachment_id: int, target_url: string, alt: string}>}>
 */
function amerilife_ideaxchange_ads_defaults() {
  $out = [];
  foreach (array_keys(amerilife_ideaxchange_ads_slot_meta()) as $key) {
    $out[$key] = [
      'creatives' => [
        amerilife_ideaxchange_ads_empty_creative(),
        amerilife_ideaxchange_ads_empty_creative(),
        amerilife_ideaxchange_ads_empty_creative(),
      ],
    ];
  }
  return $out;
}

/**
 * @param mixed $input
 * @return array<string, array{creatives: list<array{attachment_id: int, target_url: string, alt: string}>}>
 */
function amerilife_ideaxchange_ads_sanitize($input) {
  $defaults = amerilife_ideaxchange_ads_defaults();
  $out = [];
  foreach ($defaults as $key => $def) {
    $slot = isset($input[$key]) && is_array($input[$key]) ? $input[$key] : [];
    $raw_creatives = isset($slot['creatives']) && is_array($slot['creatives']) ? $slot['creatives'] : [];
    $creatives = [];
    for ($i = 0; $i < 3; $i++) {
      $row = isset($raw_creatives[$i]) && is_array($raw_creatives[$i]) ? $raw_creatives[$i] : [];
      $creatives[] = [
        'attachment_id' => isset($row['attachment_id']) ? absint($row['attachment_id']) : 0,
        'target_url' => isset($row['target_url']) ? esc_url_raw((string) $row['target_url']) : '',
        'alt' => isset($row['alt']) ? sanitize_text_field((string) $row['alt']) : '',
      ];
    }
    $out[$key] = ['creatives' => $creatives];
  }
  return $out;
}

/**
 * @param array{attachment_id?: int, target_url?: string, alt?: string} $row
 * @return array{imageUrl: ?string, targetUrl: ?string, altText: ?string}|null
 */
function amerilife_ideaxchange_ads_resolve_creative($row) {
  $aid = isset($row['attachment_id']) ? (int) $row['attachment_id'] : 0;
  $target = isset($row['target_url']) ? trim((string) $row['target_url']) : '';
  $alt = isset($row['alt']) ? trim((string) $row['alt']) : '';
  $img = '';
  if ($aid > 0) {
    $src = wp_get_attachment_image_src($aid, 'full');
    if (is_array($src) && !empty($src[0])) {
      $img = (string) $src[0];
    }
  }
  if ($img === '') {
    return null;
  }
  return [
    'imageUrl' => $img,
    'targetUrl' => $target !== '' ? esc_url_raw($target) : null,
    'altText' => $alt !== '' ? $alt : null,
  ];
}

/**
 * @param array{creatives?: list<array{attachment_id?: int, target_url?: string, alt?: string}>} $slot
 * @return array{creatives: list<array{imageUrl: ?string, targetUrl: ?string, altText: ?string}>}
 */
function amerilife_ideaxchange_ads_resolve_slot($slot) {
  $creatives = isset($slot['creatives']) && is_array($slot['creatives']) ? $slot['creatives'] : [];
  $resolved = [];
  foreach ($creatives as $row) {
    if (!is_array($row)) {
      continue;
    }
    $creative = amerilife_ideaxchange_ads_resolve_creative($row);
    if ($creative !== null) {
      $resolved[] = $creative;
    }
  }
  return ['creatives' => $resolved];
}

/**
 * @return array<string, array{creatives: list<array{imageUrl: ?string, targetUrl: ?string, altText: ?string}>}>
 */
function amerilife_ideaxchange_ads_graphql_resolve_all() {
  $defaults = amerilife_ideaxchange_ads_defaults();
  $saved = get_option('amerilife_ideaxchange_ads', []);
  if (!is_array($saved)) {
    $saved = [];
  }

  $map = [
    'home_primary_horizontal' => 'homePrimaryHorizontal',
    'home_secondary_horizontal' => 'homeSecondaryHorizontal',
    'home_sidebar_vertical' => 'homeSidebarVertical',
    'category_primary_horizontal' => 'categoryPrimaryHorizontal',
    'recruiting_primary_horizontal' => 'recruitingPrimaryHorizontal',
    'recruiting_secondary_horizontal' => 'recruitingSecondaryHorizontal',
    'recruiting_sidebar_vertical' => 'recruitingSidebarVertical',
    'sales_success_primary_horizontal' => 'salesSuccessPrimaryHorizontal',
    'sales_success_sidebar_vertical' => 'salesSuccessSidebarVertical',
    'leaderboard_secondary_horizontal' => 'leaderboardSecondaryHorizontal',
    'leaderboard_sidebar_vertical' => 'leaderboardSidebarVertical',
    'carrier_sidebar_vertical' => 'carrierSidebarVertical',
    'article_in_article' => 'articleInArticle',
    'article_sidebar_vertical' => 'articleSidebarVertical',
  ];

  $out = [];
  foreach ($map as $option_key => $graphql_key) {
    $slot = isset($saved[$option_key]) && is_array($saved[$option_key])
      ? $saved[$option_key]
      : $defaults[$option_key];
    $out[$graphql_key] = amerilife_ideaxchange_ads_resolve_slot($slot);
  }
  return $out;
}

add_action('admin_menu', function () {
  add_submenu_page(
    'edit.php?post_type=ideaxchange_article',
    __('ideaXchange ads', 'amerilife'),
    __('Ads', 'amerilife'),
    'manage_options',
    'amerilife-ideaxchange-ads',
    'amerilife_ideaxchange_ads_render_admin_page'
  );
});

add_action('admin_enqueue_scripts', function ($hook) {
  if ($hook !== 'ideaxchange_article_page_amerilife-ideaxchange-ads') {
    return;
  }
  wp_enqueue_media();
});

add_action('admin_post_amerilife_ideaxchange_ads_save', function () {
  if (!current_user_can('manage_options')) {
    wp_die(esc_html__('Forbidden.', 'amerilife'), '', ['response' => 403]);
  }
  check_admin_referer('amerilife_ideaxchange_ads_save');
  // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized in callback
  $raw = isset($_POST['amerilife_ideaxchange_ads']) && is_array($_POST['amerilife_ideaxchange_ads'])
    ? wp_unslash($_POST['amerilife_ideaxchange_ads'])
    : [];
  update_option('amerilife_ideaxchange_ads', amerilife_ideaxchange_ads_sanitize($raw));
  wp_safe_redirect(
    add_query_arg(
      ['page' => 'amerilife-ideaxchange-ads', 'updated' => '1'],
      admin_url('edit.php?post_type=ideaxchange_article')
    )
  );
  exit;
});

function amerilife_ideaxchange_ads_render_admin_page() {
  if (!current_user_can('manage_options')) {
    return;
  }

  $meta = amerilife_ideaxchange_ads_slot_meta();
  $defaults = amerilife_ideaxchange_ads_defaults();
  $saved = get_option('amerilife_ideaxchange_ads', []);
  if (!is_array($saved)) {
    $saved = [];
  }
  $ads = array_merge($defaults, $saved);

  if (!empty($_GET['updated'])) {
    echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Settings saved.', 'amerilife') . '</p></div>';
  }

  echo '<div class="wrap"><h1>' . esc_html__('ideaXchange advertisement slots', 'amerilife') . '</h1>';
  echo '<p class="description">' . esc_html__('Upload up to three images per placement. Each image needs its click-through URL. On the site, one creative is shown at random per page load.', 'amerilife') . '</p>';

  echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
  wp_nonce_field('amerilife_ideaxchange_ads_save');
  echo '<input type="hidden" name="action" value="amerilife_ideaxchange_ads_save" />';

  $current_group = null;
  foreach ($meta as $key => $info) {
    if ($current_group !== $info['group']) {
      if ($current_group !== null) {
        echo '</table>';
      }
      $current_group = $info['group'];
      echo '<h2 style="margin-top:2em;">' . esc_html($current_group) . '</h2>';
      echo '<table class="form-table" role="presentation">';
    }

    $slot = isset($ads[$key]) && is_array($ads[$key]) ? $ads[$key] : $defaults[$key];
    $creatives = isset($slot['creatives']) && is_array($slot['creatives']) ? $slot['creatives'] : $defaults[$key]['creatives'];

    echo '<tr><th scope="row"><span>' . esc_html($info['label']) . '</span>';
    echo '<p class="description" style="font-weight:400;margin-top:6px;"><strong>' . esc_html__('Recommended size:', 'amerilife') . '</strong> ' . esc_html($info['dimensions']) . '</p>';
    echo '</th><td>';

    for ($i = 0; $i < 3; $i++) {
      $row = isset($creatives[$i]) && is_array($creatives[$i])
        ? array_merge(amerilife_ideaxchange_ads_empty_creative(), $creatives[$i])
        : amerilife_ideaxchange_ads_empty_creative();
      $aid = (int) ($row['attachment_id'] ?? 0);
      $preview = '';
      if ($aid > 0) {
        $src = wp_get_attachment_image_src($aid, 'medium');
        if (is_array($src) && !empty($src[0])) {
          $preview = (string) $src[0];
        }
      }
      $uid = $key . '_' . $i;
      $field = 'amerilife_ideaxchange_ads[' . $key . '][creatives][' . $i . ']';

      echo '<div class="amerilife-ix-ad-creative" style="border:1px solid #dcdcde;padding:12px 14px;margin:0 0 12px;background:#fff;max-width:640px;">';
      echo '<p style="margin:0 0 8px;"><strong>' . esc_html(sprintf(__('Creative %d', 'amerilife'), $i + 1)) . '</strong></p>';
      echo '<p><img class="amerilife-ix-ad-preview" id="amerilife-ix-ad-preview-' . esc_attr($uid) . '" src="' . esc_url($preview) . '" style="max-width:280px;height:auto;' . ($preview ? '' : 'display:none;') . '" alt="" /></p>';
      echo '<p><button type="button" class="button amerilife-ix-ad-upload" data-uid="' . esc_attr($uid) . '">' . esc_html__('Choose image', 'amerilife') . '</button> ';
      echo '<button type="button" class="button-link amerilife-ix-ad-clear" data-uid="' . esc_attr($uid) . '">' . esc_html__('Clear image', 'amerilife') . '</button></p>';
      echo '<input type="hidden" class="amerilife-ix-ad-id" name="' . esc_attr($field . '[attachment_id]') . '" id="amerilife-ix-ad-id-' . esc_attr($uid) . '" value="' . esc_attr((string) $aid) . '" />';
      echo '<p><label>' . esc_html__('Click URL', 'amerilife') . '<br /><input type="url" class="large-text" name="' . esc_attr($field . '[target_url]') . '" value="' . esc_attr((string) ($row['target_url'] ?? '')) . '" placeholder="https://"/></label></p>';
      echo '<p><label>' . esc_html__('Image alt text (accessibility)', 'amerilife') . '<br /><input type="text" class="large-text" name="' . esc_attr($field . '[alt]') . '" value="' . esc_attr((string) ($row['alt'] ?? '')) . '" /></label></p>';
      echo '</div>';
    }

    echo '</td></tr>';
  }

  if ($current_group !== null) {
    echo '</table>';
  }

  submit_button(__('Save ads', 'amerilife'));
  echo '</form></div>';

  ?>
  <script>
  jQuery(function ($) {
    $('.amerilife-ix-ad-upload').on('click', function (e) {
      e.preventDefault();
      var uid = $(this).data('uid');
      var frame = wp.media({
        title: '<?php echo esc_js(__('Choose advertisement image', 'amerilife')); ?>',
        button: { text: '<?php echo esc_js(__('Use this image', 'amerilife')); ?>' },
        multiple: false
      });
      frame.on('select', function () {
        var att = frame.state().get('selection').first().toJSON();
        $('#amerilife-ix-ad-id-' + uid).val(att.id);
        $('#amerilife-ix-ad-preview-' + uid).attr('src', att.url).show();
      });
      frame.open();
    });
    $('.amerilife-ix-ad-clear').on('click', function (e) {
      e.preventDefault();
      var uid = $(this).data('uid');
      $('#amerilife-ix-ad-id-' + uid).val('0');
      $('#amerilife-ix-ad-preview-' + uid).hide();
    });
  });
  </script>
  <?php
}

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('IdeaxchangeAdCreative', [
    'description' => 'ideaXchange advertisement creative (image + link)',
    'fields' => [
      'imageUrl' => ['type' => 'String'],
      'targetUrl' => ['type' => 'String'],
      'altText' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeAdSlot', [
    'description' => 'ideaXchange ad placement with up to three rotating creatives',
    'fields' => [
      'creatives' => [
        'type' => ['list_of' => 'IdeaxchangeAdCreative'],
      ],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeAdsSettings', [
    'fields' => [
      'homePrimaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'homeSecondaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'homeSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
      'categoryPrimaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'recruitingPrimaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'recruitingSecondaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'recruitingSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
      'salesSuccessPrimaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'salesSuccessSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
      'leaderboardSecondaryHorizontal' => ['type' => 'IdeaxchangeAdSlot'],
      'leaderboardSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
      'carrierSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
      'articleInArticle' => ['type' => 'IdeaxchangeAdSlot'],
      'articleSidebarVertical' => ['type' => 'IdeaxchangeAdSlot'],
    ],
  ]);

  register_graphql_field('RootQuery', 'ideaxchangeAdsSettings', [
    'type' => 'IdeaxchangeAdsSettings',
    'description' => 'ideaXchange sponsorship slots configured in WP Admin → ideaXchange → Ads',
    'resolve' => function () {
      return amerilife_ideaxchange_ads_graphql_resolve_all();
    },
  ]);
});
