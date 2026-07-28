<?php
/**
 * Plugin Name: AmeriLife ideaXchange Ads (MU)
 * Description: Global sponsorship slots for ideaXchange with unlimited rotating creatives and audience visibility rules, editable in WP Admin and exposed via WPGraphQL.
 * Version: 2.0.0
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * @return array<string, string>
 */
function amerilife_ideaxchange_ads_visibility_options() {
  return [
    'brokerage' => __('Brokerage', 'amerilife'),
    'career' => __('Career', 'amerilife'),
    'both' => __('Brokerage + Career', 'amerilife'),
  ];
}

/**
 * @return array{attachment_id: int, target_url: string, alt: string, visibility: string}
 */
function amerilife_ideaxchange_ads_empty_creative() {
  return [
    'attachment_id' => 0,
    'target_url' => '',
    'alt' => '',
    'visibility' => 'both',
  ];
}

/**
 * Slot registry.
 *
 * @return array<string, array{label: string, dimensions: string, group: string}>
 */
function amerilife_ideaxchange_ads_slot_meta() {
  return [
    'home_primary_horizontal' => [
      'label' => __('Primary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Global ideaXchange ads', 'amerilife'),
    ],
    'home_secondary_horizontal' => [
      'label' => __('Secondary horizontal', 'amerilife'),
      'dimensions' => '1200 × 280 px (min 960 × 200)',
      'group' => __('Global ideaXchange ads', 'amerilife'),
    ],
    'home_sidebar_vertical' => [
      'label' => __('Sidebar vertical', 'amerilife'),
      'dimensions' => '400 × 600 px (min 300 × 450)',
      'group' => __('Global ideaXchange ads', 'amerilife'),
    ],
  ];
}

/**
 * Defaults are empty. Existing saved creatives are loaded from the option table.
 *
 * @return array<string, array{creatives: list<array{attachment_id: int, target_url: string, alt: string, visibility: string}>}>
 */
function amerilife_ideaxchange_ads_defaults() {
  $out = [];

  foreach (array_keys(amerilife_ideaxchange_ads_slot_meta()) as $key) {
    $out[$key] = [
      'creatives' => [],
    ];
  }

  return $out;
}

/**
 * @param mixed $visibility
 * @return string
 */
function amerilife_ideaxchange_ads_sanitize_visibility($visibility) {
  $visibility = is_string($visibility) ? sanitize_key($visibility) : 'both';
  $allowed = array_keys(amerilife_ideaxchange_ads_visibility_options());

  return in_array($visibility, $allowed, true) ? $visibility : 'both';
}

/**
 * Normalize existing saved rows.
 * Older rows without visibility become "both".
 *
 * @param mixed $row
 * @return array{attachment_id: int, target_url: string, alt: string, visibility: string}
 */
function amerilife_ideaxchange_ads_normalize_creative($row) {
  $row = is_array($row) ? $row : [];

  return [
    'attachment_id' => isset($row['attachment_id']) ? absint($row['attachment_id']) : 0,
    'target_url' => isset($row['target_url']) ? (string) $row['target_url'] : '',
    'alt' => isset($row['alt']) ? (string) $row['alt'] : '',
    'visibility' => amerilife_ideaxchange_ads_sanitize_visibility($row['visibility'] ?? 'both'),
  ];
}

/**
 * @param mixed $row
 * @return array{attachment_id: int, target_url: string, alt: string, visibility: string}
 */
function amerilife_ideaxchange_ads_sanitize_creative($row) {
  $row = is_array($row) ? $row : [];

  return [
    'attachment_id' => isset($row['attachment_id']) ? absint($row['attachment_id']) : 0,
    'target_url' => isset($row['target_url']) ? esc_url_raw((string) $row['target_url']) : '',
    'alt' => isset($row['alt']) ? sanitize_text_field((string) $row['alt']) : '',
    'visibility' => amerilife_ideaxchange_ads_sanitize_visibility($row['visibility'] ?? 'both'),
  ];
}

/**
 * @param array{attachment_id: int, target_url: string, alt: string, visibility: string} $creative
 * @return bool
 */
function amerilife_ideaxchange_ads_creative_is_empty($creative) {
  return (int) $creative['attachment_id'] <= 0
    && trim((string) $creative['target_url']) === ''
    && trim((string) $creative['alt']) === '';
}

/**
 * Supports unlimited creatives per slot.
 *
 * @param mixed $input
 * @return array<string, array{creatives: list<array{attachment_id: int, target_url: string, alt: string, visibility: string}>}>
 */
function amerilife_ideaxchange_ads_sanitize($input) {
  $defaults = amerilife_ideaxchange_ads_defaults();
  $input = is_array($input) ? $input : [];
  $out = [];

  foreach ($defaults as $key => $def) {
    $slot = isset($input[$key]) && is_array($input[$key]) ? $input[$key] : [];
    $raw_creatives = isset($slot['creatives']) && is_array($slot['creatives']) ? $slot['creatives'] : [];

    $creatives = [];

    foreach ($raw_creatives as $raw_row) {
      $creative = amerilife_ideaxchange_ads_sanitize_creative($raw_row);

      if (amerilife_ideaxchange_ads_creative_is_empty($creative)) {
        continue;
      }

      $creatives[] = $creative;
    }

    $out[$key] = [
      'creatives' => $creatives,
    ];
  }

  return $out;
}

/**
 * @param array{attachment_id?: int, target_url?: string, alt?: string, visibility?: string} $row
 * @return array{imageUrl: ?string, targetUrl: ?string, altText: ?string, visibility: string}|null
 */
function amerilife_ideaxchange_ads_resolve_creative($row) {
  $aid = isset($row['attachment_id']) ? (int) $row['attachment_id'] : 0;
  $target = isset($row['target_url']) ? trim((string) $row['target_url']) : '';
  $alt = isset($row['alt']) ? trim((string) $row['alt']) : '';
  $visibility = amerilife_ideaxchange_ads_sanitize_visibility($row['visibility'] ?? 'both');

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
    'visibility' => $visibility,
  ];
}

/**
 * @param array{creatives?: list<array{attachment_id?: int, target_url?: string, alt?: string, visibility?: string}>} $slot
 * @return array{creatives: list<array{imageUrl: ?string, targetUrl: ?string, altText: ?string, visibility: string}>}
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

  return [
    'creatives' => $resolved,
  ];
}

/**
 * @return array<string, array{creatives: list<array{imageUrl: ?string, targetUrl: ?string, altText: ?string, visibility: string}>}>
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
      [
        'page' => 'amerilife-ideaxchange-ads',
        'updated' => '1',
      ],
      admin_url('edit.php?post_type=ideaxchange_article')
    )
  );

  exit;
});

/**
 * @param string $slot_key
 * @param int|string $index
 * @param array{attachment_id: int, target_url: string, alt: string, visibility: string} $row
 * @return void
 */
function amerilife_ideaxchange_ads_render_creative_card($slot_key, $index, $row) {
  $row = amerilife_ideaxchange_ads_normalize_creative($row);

  $aid = (int) $row['attachment_id'];
  $preview = '';

  if ($aid > 0) {
    $src = wp_get_attachment_image_src($aid, 'medium');

    if (is_array($src) && !empty($src[0])) {
      $preview = (string) $src[0];
    }
  }

  $uid = $slot_key . '_' . $index;
  $field = 'amerilife_ideaxchange_ads[' . $slot_key . '][creatives][' . $index . ']';
  $visibility_options = amerilife_ideaxchange_ads_visibility_options();

  echo '<div class="amerilife-ix-ad-creative" style="border:1px solid #dcdcde;padding:12px 14px;margin:0 0 12px;background:#fff;max-width:720px;">';

  echo '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">';
  echo '<strong class="amerilife-ix-ad-title">' . esc_html__('Creative', 'amerilife') . '</strong>';
  echo '<button type="button" class="button-link-delete amerilife-ix-ad-remove">' . esc_html__('Remove creative', 'amerilife') . '</button>';
  echo '</div>';

  echo '<p>';
  echo '<img class="amerilife-ix-ad-preview" id="amerilife-ix-ad-preview-' . esc_attr($uid) . '" src="' . esc_url($preview) . '" style="max-width:280px;height:auto;' . ($preview ? '' : 'display:none;') . '" alt="" />';
  echo '</p>';

  echo '<p>';
  echo '<button type="button" class="button amerilife-ix-ad-upload" data-uid="' . esc_attr($uid) . '">' . esc_html__('Choose image', 'amerilife') . '</button> ';
  echo '<button type="button" class="button-link amerilife-ix-ad-clear" data-uid="' . esc_attr($uid) . '">' . esc_html__('Clear image', 'amerilife') . '</button>';
  echo '</p>';

  echo '<input type="hidden" class="amerilife-ix-ad-id" name="' . esc_attr($field . '[attachment_id]') . '" id="amerilife-ix-ad-id-' . esc_attr($uid) . '" value="' . esc_attr((string) $aid) . '" />';

  echo '<p>';
  echo '<label>' . esc_html__('Click URL', 'amerilife') . '<br />';
  echo '<input type="url" class="large-text" name="' . esc_attr($field . '[target_url]') . '" value="' . esc_attr((string) $row['target_url']) . '" placeholder="https://" />';
  echo '</label>';
  echo '</p>';

  echo '<p>';
  echo '<label>' . esc_html__('Image alt text (accessibility)', 'amerilife') . '<br />';
  echo '<input type="text" class="large-text" name="' . esc_attr($field . '[alt]') . '" value="' . esc_attr((string) $row['alt']) . '" />';
  echo '</label>';
  echo '</p>';

  echo '<p>';
  echo '<label>' . esc_html__('Visibility', 'amerilife') . '<br />';
  echo '<select class="large-text" name="' . esc_attr($field . '[visibility]') . '">';

  foreach ($visibility_options as $value => $label) {
    echo '<option value="' . esc_attr($value) . '"' . selected($row['visibility'], $value, false) . '>' . esc_html($label) . '</option>';
  }

  echo '</select>';
  echo '</label>';
  echo '<br />';
  echo '<span class="description">' . esc_html__('Brokerage = sales users. Career = recruiting users. Brokerage + Career = both.', 'amerilife') . '</span>';
  echo '</p>';

  echo '</div>';
}

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

  $ads = array_replace_recursive($defaults, $saved);

  if (!empty($_GET['updated'])) {
    echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Settings saved.', 'amerilife') . '</p></div>';
  }

  echo '<div class="wrap">';
  echo '<h1>' . esc_html__('ideaXchange advertisement slots', 'amerilife') . '</h1>';
  echo '<p class="description">' . esc_html__('Add as many creatives as needed for each ad slot. Each creative can include an image, click-through URL, alt text, and audience visibility.', 'amerilife') . '</p>';

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
    $creatives = isset($slot['creatives']) && is_array($slot['creatives']) ? $slot['creatives'] : [];

    echo '<tr>';
    echo '<th scope="row">';
    echo '<span>' . esc_html($info['label']) . '</span>';
    echo '<p class="description" style="font-weight:400;margin-top:6px;"><strong>' . esc_html__('Recommended size:', 'amerilife') . '</strong> ' . esc_html($info['dimensions']) . '</p>';
    echo '</th>';

    echo '<td>';
    echo '<div class="amerilife-ix-ad-creatives" data-slot="' . esc_attr($key) . '">';

    foreach ($creatives as $i => $row) {
      if (!is_array($row)) {
        continue;
      }

      $normalized = amerilife_ideaxchange_ads_normalize_creative($row);

      if (amerilife_ideaxchange_ads_creative_is_empty($normalized)) {
        continue;
      }

      amerilife_ideaxchange_ads_render_creative_card($key, $i, $normalized);
    }

    echo '</div>';

    echo '<p>';
    echo '<button type="button" class="button button-secondary amerilife-ix-ad-add" data-slot="' . esc_attr($key) . '">' . esc_html__('Add creative', 'amerilife') . '</button>';
    echo '</p>';

    echo '</td>';
    echo '</tr>';
  }

  if ($current_group !== null) {
    echo '</table>';
  }

  submit_button(__('Save ads', 'amerilife'));

  echo '</form>';
  echo '</div>';

  $visibility_options = amerilife_ideaxchange_ads_visibility_options();
  ?>

  <script>
  jQuery(function ($) {
    var visibilityOptions = <?php echo wp_json_encode($visibility_options); ?>;
    var chooseImageText = <?php echo wp_json_encode(__('Choose image', 'amerilife')); ?>;
    var chooseAdImageText = <?php echo wp_json_encode(__('Choose advertisement image', 'amerilife')); ?>;
    var useImageText = <?php echo wp_json_encode(__('Use this image', 'amerilife')); ?>;
    var removeCreativeText = <?php echo wp_json_encode(__('Remove creative', 'amerilife')); ?>;
    var creativeText = <?php echo wp_json_encode(__('Creative', 'amerilife')); ?>;
    var clickUrlText = <?php echo wp_json_encode(__('Click URL', 'amerilife')); ?>;
    var altTextText = <?php echo wp_json_encode(__('Image alt text (accessibility)', 'amerilife')); ?>;
    var visibilityText = <?php echo wp_json_encode(__('Visibility', 'amerilife')); ?>;
    var clearImageText = <?php echo wp_json_encode(__('Clear image', 'amerilife')); ?>;
    var visibilityHelpText = <?php echo wp_json_encode(__('Brokerage = sales users. Career = recruiting users. Brokerage + Career = both.', 'amerilife')); ?>;
    var newCreativeCounter = 0;

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function buildVisibilityOptions(selected) {
      var html = '';

      $.each(visibilityOptions, function (value, label) {
        html += '<option value="' + escapeHtml(value) + '"' + (value === selected ? ' selected' : '') + '>' + escapeHtml(label) + '</option>';
      });

      return html;
    }

    function buildCreativeCard(slot, index) {
      var uid = slot + '_' + index;
      var field = 'amerilife_ideaxchange_ads[' + slot + '][creatives][' + index + ']';

      return '' +
        '<div class="amerilife-ix-ad-creative" style="border:1px solid #dcdcde;padding:12px 14px;margin:0 0 12px;background:#fff;max-width:720px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">' +
            '<strong class="amerilife-ix-ad-title">' + escapeHtml(creativeText) + '</strong>' +
            '<button type="button" class="button-link-delete amerilife-ix-ad-remove">' + escapeHtml(removeCreativeText) + '</button>' +
          '</div>' +

          '<p>' +
            '<img class="amerilife-ix-ad-preview" id="amerilife-ix-ad-preview-' + escapeHtml(uid) + '" src="" style="max-width:280px;height:auto;display:none;" alt="" />' +
          '</p>' +

          '<p>' +
            '<button type="button" class="button amerilife-ix-ad-upload" data-uid="' + escapeHtml(uid) + '">' + escapeHtml(chooseImageText) + '</button> ' +
            '<button type="button" class="button-link amerilife-ix-ad-clear" data-uid="' + escapeHtml(uid) + '">' + escapeHtml(clearImageText) + '</button>' +
          '</p>' +

          '<input type="hidden" class="amerilife-ix-ad-id" name="' + escapeHtml(field + '[attachment_id]') + '" id="amerilife-ix-ad-id-' + escapeHtml(uid) + '" value="0" />' +

          '<p>' +
            '<label>' + escapeHtml(clickUrlText) + '<br />' +
              '<input type="url" class="large-text" name="' + escapeHtml(field + '[target_url]') + '" value="" placeholder="https://" />' +
            '</label>' +
          '</p>' +

          '<p>' +
            '<label>' + escapeHtml(altTextText) + '<br />' +
              '<input type="text" class="large-text" name="' + escapeHtml(field + '[alt]') + '" value="" />' +
            '</label>' +
          '</p>' +

          '<p>' +
            '<label>' + escapeHtml(visibilityText) + '<br />' +
              '<select class="large-text" name="' + escapeHtml(field + '[visibility]') + '">' +
                buildVisibilityOptions('both') +
              '</select>' +
            '</label>' +
            '<br />' +
            '<span class="description">' + escapeHtml(visibilityHelpText) + '</span>' +
          '</p>' +
        '</div>';
    }

    $(document).on('click', '.amerilife-ix-ad-add', function (e) {
      e.preventDefault();

      var slot = $(this).data('slot');
      var $wrapper = $('.amerilife-ix-ad-creatives[data-slot="' + slot + '"]');
      var index = 'new_' + Date.now() + '_' + newCreativeCounter;

      newCreativeCounter += 1;

      $wrapper.append(buildCreativeCard(slot, index));
    });

    $(document).on('click', '.amerilife-ix-ad-remove', function (e) {
      e.preventDefault();

      $(this).closest('.amerilife-ix-ad-creative').remove();
    });

    $(document).on('click', '.amerilife-ix-ad-upload', function (e) {
      e.preventDefault();

      var uid = $(this).data('uid');

      var frame = wp.media({
        title: chooseAdImageText,
        button: {
          text: useImageText
        },
        multiple: false
      });

      frame.on('select', function () {
        var att = frame.state().get('selection').first().toJSON();

        $('#amerilife-ix-ad-id-' + uid).val(att.id);
        $('#amerilife-ix-ad-preview-' + uid).attr('src', att.url).show();
      });

      frame.open();
    });

    $(document).on('click', '.amerilife-ix-ad-clear', function (e) {
      e.preventDefault();

      var uid = $(this).data('uid');

      $('#amerilife-ix-ad-id-' + uid).val('0');
      $('#amerilife-ix-ad-preview-' + uid).attr('src', '').hide();
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
    'description' => 'ideaXchange advertisement creative with image, link, alt text, and audience visibility.',
    'fields' => [
      'imageUrl' => [
        'type' => 'String',
      ],
      'targetUrl' => [
        'type' => 'String',
      ],
      'altText' => [
        'type' => 'String',
      ],
      'visibility' => [
        'type' => 'String',
        'description' => 'Creative visibility: brokerage, career, or both.',
      ],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeAdSlot', [
    'description' => 'ideaXchange ad placement with unlimited rotating creatives.',
    'fields' => [
      'creatives' => [
        'type' => ['list_of' => 'IdeaxchangeAdCreative'],
      ],
    ],
  ]);

  register_graphql_object_type('IdeaxchangeAdsSettings', [
    'fields' => [
      'homePrimaryHorizontal' => [
        'type' => 'IdeaxchangeAdSlot',
      ],
      'homeSecondaryHorizontal' => [
        'type' => 'IdeaxchangeAdSlot',
      ],
      'homeSidebarVertical' => [
        'type' => 'IdeaxchangeAdSlot',
      ],
    ],
  ]);

  register_graphql_field('RootQuery', 'ideaxchangeAdsSettings', [
    'type' => 'IdeaxchangeAdsSettings',
    'description' => 'ideaXchange sponsorship slots configured in WP Admin → ideaXchange → Ads.',
    'resolve' => function () {
      return amerilife_ideaxchange_ads_graphql_resolve_all();
    },
  ]);
});