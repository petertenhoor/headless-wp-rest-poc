<?php

namespace PTH;

/**
 * Class CorsComponent
 * @package PTH
 */
class CorsComponent extends Singleton
{
    /**
     * CorsComponent constructor.
     */
    protected function __construct()
    {
        /**
         * Only from certain origins
         */
        add_action('rest_api_init', function () {

            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

            add_filter('rest_pre_serve_request', function ($value) {

                $origin = get_http_origin();

                if ($origin && in_array($origin, array(Theme::FRONTEND_BASE_URL))) {
                    header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
                    header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
                    header('Access-Control-Allow-Credentials: true');
                }

                return $value;

            });

        }, 15);
    }
}