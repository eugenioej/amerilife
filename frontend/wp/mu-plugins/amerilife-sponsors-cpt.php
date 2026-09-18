<?php
/**
 * Plugin Name: AmeriLife Gives Back Sponsors
 * Description: Registers Gives Back sponsors and sponsor tiers.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the Sponsor custom post type.
 */
function amerilife_register_sponsor_post_type() {
	$labels = array(
		'name'                  => __( 'Sponsors', 'amerilife' ),
		'singular_name'         => __( 'Sponsor', 'amerilife' ),
		'menu_name'             => __( 'Sponsors', 'amerilife' ),
		'name_admin_bar'        => __( 'Sponsor', 'amerilife' ),
		'add_new'               => __( 'Add New', 'amerilife' ),
		'add_new_item'          => __( 'Add New Sponsor', 'amerilife' ),
		'new_item'              => __( 'New Sponsor', 'amerilife' ),
		'edit_item'             => __( 'Edit Sponsor', 'amerilife' ),
		'view_item'             => __( 'View Sponsor', 'amerilife' ),
		'all_items'             => __( 'All Sponsors', 'amerilife' ),
		'search_items'          => __( 'Search Sponsors', 'amerilife' ),
		'not_found'             => __( 'No sponsors found.', 'amerilife' ),
		'not_found_in_trash'    => __( 'No sponsors found in Trash.', 'amerilife' ),
		'featured_image'        => __( 'Sponsor Logo', 'amerilife' ),
		'set_featured_image'    => __( 'Set sponsor logo', 'amerilife' ),
		'remove_featured_image' => __( 'Remove sponsor logo', 'amerilife' ),
		'use_featured_image'    => __( 'Use as sponsor logo', 'amerilife' ),
	);

	register_post_type(
		'givesback_sponsor',
		array(
			'labels'                => $labels,
			'description'           => __( 'Sponsors displayed on the Gives Back page.', 'amerilife' ),
			'public'                => true,
			'publicly_queryable'    => false,
			'exclude_from_search'   => true,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'show_in_nav_menus'     => false,
			'show_in_admin_bar'     => true,
			'show_in_rest'          => true,
			'menu_position'         => 25,
			'menu_icon'             => 'dashicons-groups',
			'has_archive'           => false,
			'rewrite'               => false,
			'query_var'             => false,
			'hierarchical'          => false,
			'supports'              => array(
				'title',
				'thumbnail',
				'page-attributes',
			),
			'taxonomies'            => array(
				'givesback_sponsor_tier',
			),
			'show_in_graphql'       => true,
			'graphql_single_name'   => 'GivesBackSponsor',
			'graphql_plural_name'   => 'GivesBackSponsors',
			'graphql_description'   => 'A sponsor displayed on the Gives Back page.',
		)
	);
}
add_action( 'init', 'amerilife_register_sponsor_post_type' );

/**
 * Register the Sponsor Tier taxonomy.
 */
function amerilife_register_sponsor_tier_taxonomy() {
	$labels = array(
		'name'                       => __( 'Sponsor Tiers', 'amerilife' ),
		'singular_name'              => __( 'Sponsor Tier', 'amerilife' ),
		'menu_name'                  => __( 'Sponsor Tiers', 'amerilife' ),
		'all_items'                  => __( 'All Sponsor Tiers', 'amerilife' ),
		'edit_item'                  => __( 'Edit Sponsor Tier', 'amerilife' ),
		'view_item'                  => __( 'View Sponsor Tier', 'amerilife' ),
		'update_item'                => __( 'Update Sponsor Tier', 'amerilife' ),
		'add_new_item'               => __( 'Add New Sponsor Tier', 'amerilife' ),
		'new_item_name'              => __( 'New Sponsor Tier Name', 'amerilife' ),
		'search_items'               => __( 'Search Sponsor Tiers', 'amerilife' ),
		'popular_items'              => __( 'Popular Sponsor Tiers', 'amerilife' ),
		'separate_items_with_commas' => __( 'Separate tiers with commas', 'amerilife' ),
		'add_or_remove_items'        => __( 'Add or remove sponsor tiers', 'amerilife' ),
		'choose_from_most_used'      => __( 'Choose from the most used tiers', 'amerilife' ),
		'not_found'                  => __( 'No sponsor tiers found.', 'amerilife' ),
	);

	register_taxonomy(
		'givesback_sponsor_tier',
		array( 'givesback_sponsor' ),
		array(
			'labels'                => $labels,
			'description'           => __( 'Groups Gives Back sponsors into donation tiers.', 'amerilife' ),
			'public'                => true,
			'publicly_queryable'    => false,
			'show_ui'               => true,
			'show_admin_column'     => true,
			'show_in_nav_menus'     => false,
			'show_tagcloud'         => false,
			'show_in_rest'          => true,
			'hierarchical'          => true,
			'rewrite'               => false,
			'query_var'             => false,
			'show_in_graphql'       => true,
			'graphql_single_name'   => 'GivesBackSponsorTier',
			'graphql_plural_name'   => 'GivesBackSponsorTiers',
			'graphql_description'   => 'A donation tier assigned to Gives Back sponsors.',
		)
	);
}
add_action( 'init', 'amerilife_register_sponsor_tier_taxonomy' );