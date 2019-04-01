<?php

namespace PTH;

/**
 * Class FlushFrontendCacheComponent
 *
 * @package PTH
 */
class FlushFrontendCacheComponent extends Singleton
{
    /**
     * Define frontend cache flush url
     */
    const FRONTEND_FLUSH_URL = 'http://127.0.0.1:3000/flush-cache';

    /**
     * FlushFrontendCacheComponent constructor.
     */
    protected function __construct()
    {
        if (is_admin()) {
            add_action('deleted_post', [$this, 'flushFrontendCache']);
            add_action('edit_post', [$this, 'flushFrontendCache']);
            add_action('delete_attachment', [$this, 'flushFrontendCache']);
            add_action('admin_bar_menu', [$this, 'addFlushCacheButton'], 100);
        }
    }

    /**
     * Flush frontend application cache
     */
    public static function flushFrontendCache()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "3000",
            CURLOPT_URL => self::FRONTEND_FLUSH_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "",
            CURLOPT_HTTPHEADER => array(
                "Postman-Token: 43e3c2f2-f7a6-4649-8f78-7165bb24cee7",
                "cache-control: no-cache"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            Log::log("cURL Error #:" . $err);
        } else {
            Log::log($response);
        }

    }

    /**
     * Add flush cache button to admin bar
     *
     * @param $wp_admin_bar
     */
    public static function addFlushCacheButton($wp_admin_bar)
    {
        ?>

        <script type="application/javascript">
            function clearFrontendCache() {

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "<?php echo self::FRONTEND_FLUSH_URL; ?>",
                    "method": "POST"
                };

                jQuery.ajax(settings).done(function (response) {
                    alert(response);
                });

                return false;
            }
        </script>

        <?php
        $args = array(
            'id' => 'cache-cleaner',
            'title' => __('Clean frontend cache', Theme::TEXT_DOMAIN),
            'href' => '#',
            'meta' => array(
                'onclick' => 'clearFrontendCache()'
            )
        );

        $wp_admin_bar->add_node($args);
    }
}

?>