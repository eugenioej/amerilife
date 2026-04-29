<?php
/**
 * Plugin Name: AmeriLife Insights Ads (MU)
 * Description: Sponsorship slots for Insights (image + URL), editable in WP Admin and exposed via WPGraphQL.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * @return array<string, array{attachment_id: int, target_url: string, alt: string}>
 */
function amerilife_insights_ads_defaults() {
  return [
    'primary_horizontal' => ['attachment_id' => 0, 'target_url' => '', 'alt' => ''],
    'secondary_horizontal' => ['attachment_id' => 0, 'target_url' => '', 'alt' => ''],
    'sidebar_vertical' => ['attachment_id' => 0, 'target_url' => '', 'alt' => ''],
    'in_article' => ['attachment_id' => 0, 'target_url' => '', 'alt' => ''],
  ];
}

/**
 * @param mixed $input
 * @return array<string, array{attachment_id: int, target_url: string, alt: string}>
 */
function amerilife_insights_ads_sanitize($input) {
  $defaults = amerilife_insights_ads_defaults();
  $out = [];
  foreach ($defaults as $key => $def) {
    $slot = isset($input[$key]) && is_array($input[$key]) ? $input[$key] : [];
    $out[$key] = [
      'attachment_id' => isset($slot['attachment_id']) ? absint($slot['attachment_id']) : 0,
      'target_url' => isset($slot['target_url']) ? esc_url_raw((string) $slot['target_url']) : '',
      'alt' => isset($slot['alt']) ? sanitize_text_field((string) $slot['alt']) : '',
    ];
  }
  return $out;
}

/**
 * @param array{attachment_id?: int, target_url?: string, alt?: string} $row
 * @return array{imageUrl: ?string, targetUrl: ?string, altText: ?string}
 */
function amerilife_insights_ads_resolve_slot($row) {
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
  return [
    'imageUrl' => $img !== '' ? $img : null,
    'targetUrl' => $target !== '' ? esc_url_raw($target) : null,
    'altText' => $alt !== '' ? $alt : null,
  ];
}

/**
 * @return array<string, array{imageUrl: ?string, targetUrl: ?string, altText: ?string}>
 */
function amerilife_insights_ads_graphql_resolve_all() {
  $defaults = amerilife_insights_ads_defaults();
  $saved = get_option('amerilife_insights_ads', []);
  if (!is_array($saved)) {
    $saved = [];
  }
  $merged = array_merge($defaults, $saved);
  return [
    'primaryHorizontal' => amerilife_insights_ads_resolve_slot($merged['primary_horizontal']),
    'secondaryHorizontal' => amerilife_insights_ads_resolve_slot($merged['secondary_horizontal']),
    'sidebarVertical' => amerilife_insights_ads_resolve_slot($merged['sidebar_vertical']),
    'inArticle' => amerilife_insights_ads_resolve_slot($merged['in_article']),
  ];
}

add_action('admin_menu', function () {
  add_submenu_page(
    'edit.php?post_type=insight',
    __('Insights ads', 'amerilife'),
    __('Ads', 'amerilife'),
    'manage_options',
    'amerilife-insights-ads',
    'amerilife_insights_ads_render_admin_page'
  );
});

add_action('admin_enqueue_scripts', function ($hook) {
  if ($hook !== 'insight_page_amerilife-insights-ads') {
    return;
  }
  wp_enqueue_media();
});

add_action('admin_post_amerilife_insights_ads_save', function () {
  if (!current_user_can('manage_options')) {
    wp_die(esc_html__('Forbidden.', 'amerilife'), '', ['response' => 403]);
  }
  check_admin_referer('amerilife_insights_ads_save');
  // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized in callback
  $raw = isset($_POST['amerilife_insights_ads']) && is_array($_POST['amerilife_insights_ads'])
    ? wp_unslash($_POST['amerilife_insights_ads'])
    : [];
  update_option('amerilife_insights_ads', amerilife_insights_ads_sanitize($raw));
  wp_safe_redirect(add_query_arg(['page' => 'amerilife-insights-ads', 'updated' => '1'], admin_url('edit.php?post_type=insight')));
  exit;
});

function amerilife_insights_ads_render_admin_page() {
  if (!current_user_can('manage_options')) {
    return;
  }
  $defaults = amerilife_insights_ads_defaults();
  $saved = get_option('amerilife_insights_ads', []);
  if (!is_array($saved)) {
    $saved = [];
  }
  $ads = array_merge($defaults, $saved);

  $slots = [
    'primary_horizontal' => __('Primary horizontal — below “Featured articles” (magazine index)', 'amerilife'),
    'secondary_horizontal' => __('Secondary horizontal — above main column (magazine index)', 'amerilife'),
    'sidebar_vertical' => __('Sidebar vertical — right column (magazine + article)', 'amerilife'),
    'in_article' => __('In-article horizontal — mid article (single insight)', 'amerilife'),
  ];

  if (!empty($_GET['updated'])) {
    echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Settings saved.', 'amerilife') . '</p></div>';
  }

  echo '<div class="wrap"><h1>' . esc_html__('Insights advertisement slots', 'amerilife') . '</h1>';
  echo '<p class="description">' . esc_html__('Upload an image and set the click-through URL for each placement.', 'amerilife') . '</p>';

  echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
  wp_nonce_field('amerilife_insights_ads_save');
  echo '<input type="hidden" name="action" value="amerilife_insights_ads_save" />';

  echo '<table class="form-table" role="presentation">';

  foreach ($slots as $key => $label) {
    $row = isset($ads[$key]) && is_array($ads[$key]) ? array_merge($defaults[$key], $ads[$key]) : $defaults[$key];
    $aid = (int) ($row['attachment_id'] ?? 0);
    $preview = '';
    if ($aid > 0) {
      $src = wp_get_attachment_image_src($aid, 'medium');
      if (is_array($src) && !empty($src[0])) {
        $preview = (string) $src[0];
      }
    }
    $field = 'amerilife_insights_ads[' . $key . ']';

    echo '<tr><th scope="row">' . esc_html($label) . '</th><td>';
    echo '<div class="amerilife-insights-ad-slot" data-slot="' . esc_attr($key) . '">';
    echo '<p><img class="amerilife-ad-preview" id="amerilife-ad-preview-' . esc_attr($key) . '" src="' . esc_url($preview) . '" style="max-width:280px;height:auto;' . ($preview ? '' : 'display:none;') . '" alt="" /></p>';
    echo '<p><button type="button" class="button amerilife-ad-upload" data-slot="' . esc_attr($key) . '">' . esc_html__('Choose image', 'amerilife') . '</button> ';
    echo '<button type="button" class="button-link amerilife-ad-clear" data-slot="' . esc_attr($key) . '">' . esc_html__('Clear image', 'amerilife') . '</button></p>';
    echo '<input type="hidden" class="amerilife-ad-id" name="' . esc_attr($field . '[attachment_id]') . '" id="amerilife-ad-id-' . esc_attr($key) . '" value="' . esc_attr((string) $aid) . '" />';
    echo '<p><label>' . esc_html__('Click URL', 'amerilife') . '<br /><input type="url" class="large-text" name="' . esc_attr($field . '[target_url]') . '" value="' . esc_attr((string) ($row['target_url'] ?? '')) . '" placeholder="https://"/></label></p>';
    echo '<p><label>' . esc_html__('Image alt text (accessibility)', 'amerilife') . '<br /><input type="text" class="large-text" name="' . esc_attr($field . '[alt]') . '" value="' . esc_attr((string) ($row['alt'] ?? '')) . '" /></label></p>';
    echo '</div></td></tr>';
  }

  echo '</table>';
  submit_button(__('Save ads', 'amerilife'));
  echo '</form></div>';

  ?>
  <script>
  jQuery(function ($) {
    $('.amerilife-ad-upload').on('click', function (e) {
      e.preventDefault();
      var slot = $(this).data('slot');
      var frame = wp.media({
        title: '<?php echo esc_js(__('Choose advertisement image', 'amerilife')); ?>',
        button: { text: '<?php echo esc_js(__('Use this image', 'amerilife')); ?>' },
        multiple: false
      });
      frame.on('select', function () {
        var att = frame.state().get('selection').first().toJSON();
        $('#amerilife-ad-id-' + slot).val(att.id);
        $('#amerilife-ad-preview-' + slot).attr('src', att.url).show();
      });
      frame.open();
    });
    $('.amerilife-ad-clear').on('click', function (e) {
      e.preventDefault();
      var slot = $(this).data('slot');
      $('#amerilife-ad-id-' + slot).val('0');
      $('#amerilife-ad-preview-' + slot).hide();
    });
  });
  </script>
  <?php
}

add_action('graphql_register_types', function () {
  if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
    return;
  }

  register_graphql_object_type('InsightsAdSlot', [
    'description' => 'Insights advertisement image + link',
    'fields' => [
      'imageUrl' => ['type' => 'String'],
      'targetUrl' => ['type' => 'String'],
      'altText' => ['type' => 'String'],
    ],
  ]);

  register_graphql_object_type('InsightsAdsSettings', [
    'fields' => [
      'primaryHorizontal' => ['type' => 'InsightsAdSlot'],
      'secondaryHorizontal' => ['type' => 'InsightsAdSlot'],
      'sidebarVertical' => ['type' => 'InsightsAdSlot'],
      'inArticle' => ['type' => 'InsightsAdSlot'],
    ],
  ]);

  register_graphql_field('RootQuery', 'insightsAdsSettings', [
    'type' => 'InsightsAdsSettings',
    'description' => 'Insights sponsorship slots configured in WP Admin → Insights → Ads',
    'resolve' => function () {
      return amerilife_insights_ads_graphql_resolve_all();
    },
  ]);
});
