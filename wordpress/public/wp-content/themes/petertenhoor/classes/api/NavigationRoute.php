<?php

namespace PTH;

/**
 * Class NavigationRoute
 * @package PTH
 */
class NavigationRoute extends Singleton
{
    /**
     * Define route name
     */
    const ROUTE_NAME = 'navigation';

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
        $menuLocations = get_nav_menu_locations();
        $primaryNavigationObject = get_term($menuLocations[MainNavigation::NAVIGATION_LOCATION_SLUG], 'nav_menu');

        //handle scenario without primary navigation
        if (!is_a($primaryNavigationObject, '\WP_Term')) {
            return new \WP_Error(
                'pth-error',
                esc_html__('There currently is no menu set as primary navigation. Please select one in WordPress and try again!', Theme::TEXT_DOMAIN),
                ['status' => 404]
            );
        }

        $menuItems = wp_get_nav_menu_items($primaryNavigationObject);

        Log::log($menuItems);

        //set up response
        $data = [
            'items' => array_map(function ($item) {
                $menuItem = new \stdClass();
                $menuItem->id = $item->ID;
                $menuItem->label = $item->title;
                $menuLink = self::parseMenuLink($item);
                $menuItem->href = $menuLink->href;
                $menuItem->target = $item->target;
                $menuItem->as = $menuLink->as;
                return $menuItem;
            }, $menuItems)
        ];

        return new \WP_REST_Response($data, 200);
    }


    /**
     * Utility to parse navigation links to something Next.js router understands
     *
     * @param $linkItem
     * @return \stdClass
     */
    public static function parseMenuLink($linkItem)
    {
        $returnObject = new \stdClass();
        $type = strtolower($linkItem->object);

        //handle homepage url
        if (trailingslashit($linkItem->url) === trailingslashit(get_home_url())) {
            $returnObject->href = '/';
            $returnObject->as = '/';
            return $returnObject;
        }

        $slug = untrailingslashit(str_replace(trailingslashit(get_home_url()), '', $linkItem->url));
        $returnObject->href = '';
        $returnObject->as = '';

        switch ($type) {
            case 'page':
                $returnObject->href = '/page?slug=' . $slug;
                $returnObject->as = '/' . $slug;
                break;
            case 'post':
                $returnObject->href = '/post?slug=' . $slug;
                $returnObject->as = '/post/' . $slug;
                break;
            case 'custom':
                $returnObject->href = '/' . $slug;
                $returnObject->as = '/' . $slug;
                break;
            default:
                break;
        }

        return $returnObject;
    }
}