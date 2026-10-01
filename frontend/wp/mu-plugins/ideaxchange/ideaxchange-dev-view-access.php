<?php
/**
 * Plugin Name: ideaXchange Dev View Access
 * Description: Stores and validates the email allowlist for the ideaXchange persona preview switcher.
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const IX_DEV_ACCESS_OPTION = 'ix_dev_access_emails';

/**
 * Add admin menu.
 */
function amerilife_ix_dev_access_menu() {
	add_options_page(
		'ideaXchange Dev Access',
		'ideaXchange Dev Access',
		'manage_options',
		'ix-dev-access',
		'amerilife_ix_dev_access_page'
	);
}
add_action( 'admin_menu', 'amerilife_ix_dev_access_menu' );

/**
 * Register setting.
 */
function amerilife_ix_dev_access_register_settings() {
	register_setting(
		'ix_dev_access_group',
		IX_DEV_ACCESS_OPTION,
		array(
			'type'              => 'string',
			'sanitize_callback' => 'amerilife_ix_dev_access_sanitize',
			'default'           => '',
		)
	);
}
add_action(
	'admin_init',
	'amerilife_ix_dev_access_register_settings'
);

/**
 * Sanitize email list.
 *
 * One email per line.
 *
 * @param string $value Raw value.
 *
 * @return string
 */
function amerilife_ix_dev_access_sanitize( $value ) {
	$emails = preg_split(
		'/\r\n|\r|\n/',
		trim( (string) $value )
	);

	if ( ! is_array( $emails ) ) {
		return '';
	}

	$normalized = array();

	foreach ( $emails as $email ) {
		$email = strtolower(
			trim(
				sanitize_email( $email )
			)
		);

		if ( empty( $email ) ) {
			continue;
		}

		if ( ! is_email( $email ) ) {
			add_settings_error(
				IX_DEV_ACCESS_OPTION,
				'invalid_email',
				sprintf(
					'"%s" is not a valid email address.',
					esc_html( $email )
				)
			);

			continue;
		}

		$normalized[] = $email;
	}

	$normalized = array_unique( $normalized );

	sort( $normalized );

	return implode( "\n", $normalized );
}

/**
 * Settings page.
 */
function amerilife_ix_dev_access_page() {
	$value = get_option(
		IX_DEV_ACCESS_OPTION,
		''
	);
	?>

	<div class="wrap">
		<h1>ideaXchange Dev Access</h1>

		<p>
			Enter one Microsoft email address per line.
		</p>

		<?php settings_errors( IX_DEV_ACCESS_OPTION ); ?>

		<form method="post" action="options.php">

			<?php settings_fields( 'ix_dev_access_group' ); ?>

			<textarea
				name="<?php echo esc_attr( IX_DEV_ACCESS_OPTION ); ?>"
				rows="15"
				style="width:700px;max-width:100%;"
				placeholder="user1@amerilife.com&#10;user2@amerilife.com"
			><?php echo esc_textarea( $value ); ?></textarea>

			<?php submit_button(); ?>

		</form>
	</div>

	<?php
}

/**
 * Get allowlist emails.
 *
 * @return array<string>
 */
function amerilife_get_ideaxchange_dev_access_emails() {
	$value = get_option(
		IX_DEV_ACCESS_OPTION,
		''
	);

	if ( empty( $value ) ) {
		return array();
	}

	$emails = preg_split(
		'/\r\n|\r|\n/',
		$value
	);

	if ( ! is_array( $emails ) ) {
		return array();
	}

	return array_values(
		array_filter(
			array_map(
				'trim',
				$emails
			)
		)
	);
}

/**
 * Check if an email is allowed.
 *
 * @param string $email Email address.
 *
 * @return bool
 */
function amerilife_is_ideaxchange_email_allowed( $email ) {
	$email = strtolower(
		trim(
			sanitize_email( $email )
		)
	);

	if ( ! is_email( $email ) ) {
		return false;
	}

	return in_array(
		$email,
		amerilife_get_ideaxchange_dev_access_emails(),
		true
	);
}

/**
 * GraphQL field.
 */
function amerilife_register_ideaxchange_dev_access_graphql_field() {
	if ( ! function_exists( 'register_graphql_field' ) ) {
		return;
	}

	register_graphql_field(
		'RootQuery',
		'ideaxchangeDevViewEmailAllowed',
		array(
			'type' => array(
				'non_null' => 'Boolean',
			),
			'args' => array(
				'email' => array(
					'type' => array(
						'non_null' => 'String',
					),
				),
			),
			'resolve' => static function ( $root, $args ) {
				return amerilife_is_ideaxchange_email_allowed(
					$args['email'] ?? ''
				);
			},
		)
	);
}
add_action(
	'graphql_register_types',
	'amerilife_register_ideaxchange_dev_access_graphql_field'
);