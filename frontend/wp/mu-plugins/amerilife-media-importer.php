<?php
/**
 * Plugin Name: AmeriLife Media Importer (MU)
 * Description: Registers existing uploads files as Media Library attachments via REST (no SSH needed).
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
  exit;
}

function amerilife_auth_with_application_password($username, $password) {
  if (!$username || !$password) {
    return new WP_Error('missing_credentials', 'Missing credentials.');
  }

  $user = get_user_by('login', $username);
  if (!$user && is_email($username)) {
    $user = get_user_by('email', $username);
  }
  if (!$user) {
    return new WP_Error('invalid_username', 'Unknown username/email.');
  }

  if (!function_exists('wp_is_application_passwords_available') || !wp_is_application_passwords_available()) {
    return new WP_Error('application_passwords_disabled', 'Application passwords are not available.');
  }
  if (!function_exists('wp_is_application_passwords_available_for_user') || !wp_is_application_passwords_available_for_user($user)) {
    return new WP_Error('application_passwords_disabled_for_user', 'Application passwords are not available for this user.');
  }

  // Application passwords are alphanumeric; spaces and punctuation are allowed for readability.
  $password = preg_replace('/[^a-z\d]/i', '', $password);
  $hashed_passwords = WP_Application_Passwords::get_user_application_passwords($user->ID);

  foreach ($hashed_passwords as $item) {
    if (WP_Application_Passwords::check_password($password, $item['password'])) {
      return $user;
    }
  }

  return new WP_Error('incorrect_password', 'The provided password is an invalid application password.');
}

add_action('rest_api_init', function () {
  register_rest_route('amerilife/v1', '/import-media', [
    'methods'             => 'POST',
    // Auth is handled inside the callback to avoid relying on the Authorization header
    // (some managed hosts/proxies strip it, which breaks Application Passwords).
    'permission_callback' => '__return_true',
    'callback'            => function (WP_REST_Request $request) {
      $params = $request->get_json_params();
      $paths = isset($params['paths']) && is_array($params['paths']) ? $params['paths'] : [];
      $dry_run = !empty($params['dryRun']);

      // Auth: either user is already authenticated (cookie/basic auth), OR
      // credentials are provided in the request body (for environments that strip Authorization headers).
      if (!is_user_logged_in()) {
        $username = isset($params['username']) && is_string($params['username']) ? $params['username'] : '';
        $app_password = isset($params['appPassword']) && is_string($params['appPassword']) ? $params['appPassword'] : '';

        if ($username && $app_password) {
          // Validate using Application Passwords without requiring Authorization header.
          $user = amerilife_auth_with_application_password($username, $app_password);

          // Optional fallback to normal password auth (only if app-password auth fails).
          if (is_wp_error($user)) {
            $fallback = wp_authenticate($username, $app_password);
            if (!is_wp_error($fallback) && $fallback instanceof WP_User) {
              $user = $fallback;
            }
          }

          if (is_wp_error($user) || !$user) {
            $code = is_wp_error($user) ? $user->get_error_code() : 'auth_failed';
            return new WP_REST_Response([
              'ok' => false,
              'error' => 'invalid_credentials',
              'code' => $code,
            ], 401);
          }
          wp_set_current_user($user->ID);
        }
      }

      if (!current_user_can('upload_files')) {
        return new WP_REST_Response([
          'ok' => false,
          'error' => 'forbidden',
        ], 401);
      }

      if (empty($paths)) {
        return new WP_REST_Response([
          'ok' => false,
          'error' => 'paths must be a non-empty array'
        ], 400);
      }

      require_once ABSPATH . 'wp-admin/includes/image.php';
      require_once ABSPATH . 'wp-admin/includes/file.php';

      $upload_dir = wp_upload_dir();
      $basedir = rtrim($upload_dir['basedir'], '/');
      $baseurl = rtrim($upload_dir['baseurl'], '/');

      $results = [];

      foreach ($paths as $rel) {
        $rel = is_string($rel) ? trim($rel) : '';
        // Expect "YYYY/MM/filename.ext" (relative to uploads base).
        $rel = ltrim($rel, '/');
        if ($rel === '' || strpos($rel, '..') !== false) {
          $results[] = ['path' => $rel, 'status' => 'skipped', 'reason' => 'invalid_path'];
          continue;
        }

        $abs = $basedir . '/' . $rel;
        if (!file_exists($abs) || !is_file($abs)) {
          $results[] = ['path' => $rel, 'status' => 'missing'];
          continue;
        }

        // If already registered, skip.
        $existing = get_posts([
          'post_type'      => 'attachment',
          'post_status'    => 'inherit',
          'fields'         => 'ids',
          'posts_per_page' => 1,
          'meta_query'     => [
            [
              'key'   => '_wp_attached_file',
              'value' => $rel,
            ],
          ],
        ]);

        if (!empty($existing)) {
          $results[] = ['path' => $rel, 'status' => 'exists', 'attachmentId' => (int) $existing[0]];
          continue;
        }

        $filetype = wp_check_filetype(basename($abs), null);
        $mime = isset($filetype['type']) ? $filetype['type'] : 'application/octet-stream';

        $attachment = [
          'post_mime_type' => $mime,
          'post_title'     => preg_replace('/\.[^.]+$/', '', basename($abs)),
          'post_content'   => '',
          'post_status'    => 'inherit',
          'guid'           => $baseurl . '/' . $rel,
        ];

        if ($dry_run) {
          $results[] = ['path' => $rel, 'status' => 'would_import'];
          continue;
        }

        $attach_id = wp_insert_attachment($attachment, $abs);
        if (is_wp_error($attach_id)) {
          $results[] = ['path' => $rel, 'status' => 'error', 'error' => $attach_id->get_error_message()];
          continue;
        }

        // Ensure the attached file meta points at the relative uploads path.
        update_post_meta($attach_id, '_wp_attached_file', $rel);

        $meta = wp_generate_attachment_metadata($attach_id, $abs);
        if (is_wp_error($meta)) {
          $results[] = ['path' => $rel, 'status' => 'error', 'attachmentId' => (int) $attach_id, 'error' => $meta->get_error_message()];
          continue;
        }
        wp_update_attachment_metadata($attach_id, $meta);

        $results[] = ['path' => $rel, 'status' => 'imported', 'attachmentId' => (int) $attach_id];
      }

      return new WP_REST_Response([
        'ok' => true,
        'count' => count($results),
        'results' => $results,
      ], 200);
    },
  ]);
});

