<?php

namespace PTH;

/**
 * Class FrontPageRoute
 * @package PTH
 */
class FrontPageRoute extends Singleton
{
    /**
     * Define route name
     */
    const ROUTE_NAME = 'frontpage';

    /**
     * FrontPageRoute constructor.
     */
    protected function __construct()
    {
        add_action('rest_api_init', [$this, 'registerEndpoints']);
    }

    /**
     * Register rest api endpoint
     */
    public function registerEndpoints()
    {
        register_rest_route(Theme::API_NAMESPACE, self::ROUTE_NAME, ['methods' => 'GET', 'callback' => [$this, 'getData']]);
    }

    /**
     * Get front page data
     *
     * @return \WP_Error|\WP_REST_Response
     */
    public static function getData()
    {
        $frontPageId = (int)get_option('page_on_front');
        $frontPagePost = ($frontPageId > 0) ? \get_post($frontPageId) : null;

        //handle scenario without front page
        if (!is_a($frontPagePost, '\WP_Post')) {
            return new \WP_Error(
                'pth-error',
                esc_html__('There currently is no frontpage. Please select one in the WordPress customizer and try again!', Theme::TEXT_DOMAIN),
                ['status' => 404]
            );
        }



        //set up response
        $data = [
            'id' => $frontPagePost->ID,
            'title' => $frontPagePost->post_title,
            'content' =>  apply_filters('the_content', $frontPagePost->post_content)
        ];

        return new \WP_REST_Response($data, 200);
    }
}