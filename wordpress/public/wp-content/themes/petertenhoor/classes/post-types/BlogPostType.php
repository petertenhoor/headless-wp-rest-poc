<?php

namespace PTH;

/**
 * Class BlogPostType
 * @package PTH
 */
class BlogPostType extends Singleton
{
    const TYPE = 'post';
    const BASE_SLUG = 'blog';

    /**
     * BlogPostType constructor.
     */
    protected function __construct()
    {
        $singular = __("Blog post", Theme::TEXT_DOMAIN);
        $plural = __("Blog posts", Theme::TEXT_DOMAIN);

        add_action('init', function () use ($singular, $plural) {
            register_post_type(self::TYPE, [
                'label' => $singular,
                'labels' => [
                    'name' => $plural,
                    'singular_name' => $singular,
                    'add_new' => sprintf(__('New %s', Theme::TEXT_DOMAIN), $singular),
                    'add_new_item' => sprintf(__('Add New %s', Theme::TEXT_DOMAIN), $singular),
                    'edit_item' => sprintf(__('Edit %s', Theme::TEXT_DOMAIN), $singular),
                    'new_item' => sprintf(__('New %s', Theme::TEXT_DOMAIN), $singular),
                    'view_item' => sprintf(__('View %s', Theme::TEXT_DOMAIN), $singular),
                    'search_items' => sprintf(__('Search %s', Theme::TEXT_DOMAIN), $singular),
                    'not_found' => sprintf(__('No %s found', Theme::TEXT_DOMAIN), $singular),
                    'not_found_in_trash' => sprintf(__('No %s found in trash', Theme::TEXT_DOMAIN), $plural),
                    'all_items' => sprintf(__('All %s', Theme::TEXT_DOMAIN), $plural)
                ],
                'menu_name' => $plural,
                'show_ui' => true,
                'publicly_queryable' => true,
                'public' => true,
                'show_in_menu' => true,
                'query_var' => true,
                'name_admin_bar' => $singular,
                'description' => __('Blogposts', Theme::TEXT_DOMAIN),
                'has_archive' => true,
                'menu_icon' => 'dashicons-welcome-write-blog',
                'capability_type' => 'post',
                'rewrite' => [
                    'slug' => self::BASE_SLUG,
                    'with_front' => false,
                ]
            ]);
        });

        //remove tags taxonomy
        add_action('init', [$this, 'unsetTaxonomyTags']);
        add_action('init', [$this, 'unsetTaxonomyCategory']);
        //remove double admin menu items
        add_action('admin_init', [$this, 'removeDoubleAdminMenuItems']);
        //disable comments
        add_action('admin_init', [$this, 'disableCommentsPostTypeSupport']);
        add_filter('comments_open', [$this, 'disableCommentStatus'], 20, 2);
        add_filter('pings_open', [$this, 'disableCommentStatus'], 20, 2);
        add_action('admin_menu', [$this, 'removeCommentsMenuPage']);
        add_action('admin_init', [$this, 'redirectCommentPage']);
        add_action('admin_init', [$this, 'disableCommentsDashboardWidget']);
        add_action('init', [$this, 'removeCommentsFeatureAdminBar']);
    }

    /**
     * Remove double admin menu items of post type `post`
     */
    public function removeDoubleAdminMenuItems()
    {
        global $menu;
        if ($menu && is_array($menu)) {
            $postCount = 0;
            foreach ($menu as $key => $menuItem) {
                if ($menuItem[2] === 'edit.php') {
                    $postCount++;
                    if ($postCount > 1) {
                        unset($menu[$key]);
                    }
                }
            }
        }
    }

    /**
     * Unset taxonomy tags
     */
    public static function unsetTaxonomyTags()
    {
        global $wp_taxonomies;
        $taxonomy = 'post_tag';
        if (taxonomy_exists($taxonomy)) {
            unset($wp_taxonomies[$taxonomy]);
        }
    }

    /**
     * Unset category
     */
    public static function unsetTaxonomyCategory()
    {
        global $wp_taxonomies;
        $taxonomy = 'category';
        if (taxonomy_exists($taxonomy)) {
            unset($wp_taxonomies[$taxonomy]);
        }
    }

    /**
     * Remove comments link from admin bar
     */
    public function removeCommentsFeatureAdminBar()
    {
        if (is_admin_bar_showing()) {
            remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
        }
    }

    /**
     * Remove comments metabox from dashboard
     */
    public function disableCommentsDashboardWidget()
    {
        remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
    }

    /**
     * Redirect any user trying to access comments page
     */
    public function redirectCommentPage()
    {
        global $pagenow;
        if ($pagenow === 'edit-comments.php') {
            wp_redirect(admin_url());
            exit;
        }
    }

    /**
     * Remove comments page in admin menu
     */
    public function removeCommentsMenuPage()
    {
        remove_menu_page('edit-comments.php');
    }

    /**
     * Close comments on the front-end
     *
     * @return bool
     */
    public function disableCommentStatus()
    {
        return false;
    }

    /**
     * Disable support for comment and trackbacks in posttypes
     */
    public function disableCommentsPostTypeSupport()
    {
        $post_types = get_post_types();
        foreach ($post_types as $post_type) {
            if (post_type_supports($post_type, 'comments')) {
                remove_post_type_support($post_type, 'comments');
                remove_post_type_support($post_type, 'trackbacks');
            }
        }
    }
}