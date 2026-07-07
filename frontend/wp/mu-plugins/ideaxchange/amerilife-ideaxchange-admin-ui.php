<?php
/**
 * Shared ideaXchange WordPress admin UI — highlights repeater and media pickers.
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * @return array<string, string>
 */
function amerilife_ideaxchange_highlight_icon_options() {
  return [
    'megaphone' => 'Megaphone — brand / marketing',
    'shield' => 'Shield — stability / trust',
    'dollar' => 'Dollar — competitive rates',
    'cog' => 'Cog — technology',
    'users' => 'Users — broker-focused',
  ];
}

/**
 * @param mixed $json
 * @return list<array{icon: string, label: string}>
 */
function amerilife_ideaxchange_parse_highlights_json($json) {
  if (is_array($json)) {
    $decoded = $json;
  } elseif (is_string($json) && $json !== '') {
    $decoded = json_decode($json, true);
  } else {
    return [];
  }
  if (!is_array($decoded)) {
    return [];
  }

  $allowed = array_keys(amerilife_ideaxchange_highlight_icon_options());
  $out = [];
  foreach ($decoded as $row) {
    if (!is_array($row)) {
      continue;
    }
    $icon = isset($row['icon']) ? sanitize_key((string) $row['icon']) : '';
    $label = isset($row['label']) ? sanitize_text_field((string) $row['label']) : '';
    if ($label === '') {
      continue;
    }
    if (!in_array($icon, $allowed, true)) {
      $icon = 'megaphone';
    }
    $out[] = ['icon' => $icon, 'label' => $label];
  }
  return $out;
}

/**
 * @return list<array{icon: string, label: string}>
 */
function amerilife_ideaxchange_highlights_from_post_request() {
  // phpcs:ignore WordPress.Security.NonceVerification.Missing -- caller verifies nonce
  $icons = isset($_POST['highlight_icon']) && is_array($_POST['highlight_icon'])
    ? wp_unslash($_POST['highlight_icon'])
    : [];
  // phpcs:ignore WordPress.Security.NonceVerification.Missing
  $labels = isset($_POST['highlight_label']) && is_array($_POST['highlight_label'])
    ? wp_unslash($_POST['highlight_label'])
    : [];

  $rows = [];
  foreach ($labels as $i => $label) {
    $rows[] = [
      'icon' => isset($icons[$i]) ? (string) $icons[$i] : '',
      'label' => (string) $label,
    ];
  }
  return amerilife_ideaxchange_parse_highlights_json($rows);
}

/**
 * @param int $post_id
 * @param string $meta_key
 * @param string $label
 * @param string|null $input_name
 */
function amerilife_ideaxchange_render_attachment_picker($post_id, $meta_key, $label, $input_name = null) {
  $input_name = $input_name ?: $meta_key;
  $field_id = preg_replace('/[^a-z0-9_-]/i', '-', $input_name);
  $aid = (int) get_post_meta($post_id, $meta_key, true);
  $preview = '';
  $filename = '';
  if ($aid > 0) {
    $src = wp_get_attachment_image_src($aid, 'thumbnail');
    if (is_array($src) && !empty($src[0])) {
      $preview = (string) $src[0];
    }
    $filename = basename((string) get_attached_file($aid));
  }

  echo '<div class="amerilife-ix-attachment-field" style="margin-top:12px;padding:12px;border:1px solid #dcdcde;border-radius:4px;background:#fff">';
  echo '<p style="margin:0 0 8px"><strong>' . esc_html($label) . '</strong></p>';
  echo '<p class="amerilife-ix-attachment-preview-wrap" style="margin:0 0 8px">';
  echo '<img class="amerilife-ix-attachment-preview" id="amerilife-ix-preview-' . esc_attr($field_id) . '" src="' . esc_url($preview) . '" alt="" style="max-width:120px;height:auto;' . ($preview ? '' : 'display:none;') . '" />';
  echo '</p>';
  if ($filename !== '') {
    echo '<p class="description amerilife-ix-attachment-filename" id="amerilife-ix-filename-' . esc_attr($field_id) . '">' . esc_html($filename) . '</p>';
  } else {
    echo '<p class="description amerilife-ix-attachment-filename" id="amerilife-ix-filename-' . esc_attr($field_id) . '" style="display:none"></p>';
  }
  echo '<p style="margin:8px 0 0">';
  echo '<button type="button" class="button amerilife-ix-attachment-upload" data-target="' . esc_attr($field_id) . '">Choose file</button> ';
  echo '<button type="button" class="button-link amerilife-ix-attachment-clear" data-target="' . esc_attr($field_id) . '">Remove</button>';
  echo '</p>';
  echo '<input type="hidden" class="amerilife-ix-attachment-id" name="' . esc_attr($input_name) . '" id="amerilife-ix-id-' . esc_attr($field_id) . '" value="' . esc_attr((string) $aid) . '" />';
  echo '</div>';
}

/**
 * @param int $post_id
 */
function amerilife_ideaxchange_render_highlights_repeater($post_id) {
  $highlights = amerilife_ideaxchange_parse_highlights_json(get_post_meta($post_id, 'highlights_json', true));
  if ($highlights === []) {
    $highlights = [['icon' => 'megaphone', 'label' => '']];
  }
  $icons = amerilife_ideaxchange_highlight_icon_options();

  echo '<div id="amerilife-ix-highlights" class="amerilife-ix-highlights">';
  echo '<p class="description" style="margin-top:0">Icon badges shown on the carrier profile page. Add up to 5 highlights.</p>';
  echo '<table class="widefat striped" style="margin-top:8px"><thead><tr><th style="width:34%">Icon</th><th>Label</th><th style="width:48px"></th></tr></thead><tbody>';

  foreach ($highlights as $row) {
    amerilife_ideaxchange_render_highlight_row($icons, $row['icon'], $row['label']);
  }

  echo '</tbody></table>';
  echo '<p style="margin-top:10px"><button type="button" class="button amerilife-ix-highlight-add">Add highlight</button></p>';
  echo '</div>';
}

/**
 * @param array<string, string> $icons
 */
function amerilife_ideaxchange_render_highlight_row($icons, $icon, $label) {
  echo '<tr class="amerilife-ix-highlight-row">';
  echo '<td><select name="highlight_icon[]" class="widefat">';
  foreach ($icons as $value => $text) {
    echo '<option value="' . esc_attr($value) . '"' . selected($icon, $value, false) . '>' . esc_html($text) . '</option>';
  }
  echo '</select></td>';
  echo '<td><input type="text" class="widefat" name="highlight_label[]" value="' . esc_attr($label) . '" placeholder="e.g. Brand Recognition" /></td>';
  echo '<td><button type="button" class="button-link amerilife-ix-highlight-remove" aria-label="Remove highlight">&times;</button></td>';
  echo '</tr>';
}

add_action('admin_enqueue_scripts', function ($hook) {
  global $post;
  if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
    return;
  }
  if (!$post || !in_array($post->post_type, ['ideaxchange_carrier', 'ideaxchange_case'], true)) {
    return;
  }
  wp_enqueue_media();
});

add_action('admin_footer-post.php', 'amerilife_ideaxchange_admin_footer_scripts');
add_action('admin_footer-post-new.php', 'amerilife_ideaxchange_admin_footer_scripts');

function amerilife_ideaxchange_admin_footer_scripts() {
  global $post;
  if (!$post || !in_array($post->post_type, ['ideaxchange_carrier', 'ideaxchange_case'], true)) {
    return;
  }

  $icons = amerilife_ideaxchange_highlight_icon_options();
  ob_start();
  ?>
  <script>
  jQuery(function ($) {
    $(document).on('click', '.amerilife-ix-attachment-upload', function (e) {
      e.preventDefault();
      var target = $(this).data('target');
      var frame = wp.media({
        title: 'Choose file',
        button: { text: 'Use this file' },
        multiple: false
      });
      frame.on('select', function () {
        var att = frame.state().get('selection').first().toJSON();
        $('#amerilife-ix-id-' + target).val(att.id);
        var thumb = att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url;
        $('#amerilife-ix-preview-' + target).attr('src', thumb).show();
        $('#amerilife-ix-filename-' + target).text(att.filename || att.title || '').show();
      });
      frame.open();
    });

    $(document).on('click', '.amerilife-ix-attachment-clear', function (e) {
      e.preventDefault();
      var target = $(this).data('target');
      $('#amerilife-ix-id-' + target).val('0');
      $('#amerilife-ix-preview-' + target).hide();
      $('#amerilife-ix-filename-' + target).hide().text('');
    });

    var iconOptions = <?php echo wp_json_encode($icons); ?>;

    function highlightRow(icon, label) {
      var $row = $('<tr class="amerilife-ix-highlight-row"></tr>');
      var $iconCell = $('<td></td>');
      var $select = $('<select name="highlight_icon[]" class="widefat"></select>');
      $.each(iconOptions, function (value, text) {
        $select.append($('<option></option>').attr('value', value).text(text));
      });
      if (icon) $select.val(icon);
      $iconCell.append($select);
      var $labelCell = $('<td></td>').append(
        $('<input type="text" class="widefat" name="highlight_label[]" placeholder="e.g. Brand Recognition" />').val(label || '')
      );
      var $removeCell = $('<td></td>').append(
        $('<button type="button" class="button-link amerilife-ix-highlight-remove" aria-label="Remove highlight">&times;</button>')
      );
      $row.append($iconCell, $labelCell, $removeCell);
      return $row;
    }

    $(document).on('click', '.amerilife-ix-highlight-add', function (e) {
      e.preventDefault();
      var $tbody = $('#amerilife-ix-highlights tbody');
      if ($tbody.find('.amerilife-ix-highlight-row').length >= 5) {
        return;
      }
      $tbody.append(highlightRow('megaphone', ''));
    });

    $(document).on('click', '.amerilife-ix-highlight-remove', function (e) {
      e.preventDefault();
      var $tbody = $('#amerilife-ix-highlights tbody');
      if ($tbody.find('.amerilife-ix-highlight-row').length <= 1) {
        $(this).closest('tr').find('input[name="highlight_label[]"]').val('');
        return;
      }
      $(this).closest('tr').remove();
    });
  });
  </script>
  <?php
  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
  echo ob_get_clean();
}
