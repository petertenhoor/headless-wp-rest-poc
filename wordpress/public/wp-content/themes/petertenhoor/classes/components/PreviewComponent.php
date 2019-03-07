<?php

namespace PTH;

/**
 * Class PreviewComponent
 * @package PTH
 */
class PreviewComponent extends Singleton
{
    /**
     * PreviewComponent constructor.
     */
    protected function __construct()
    {
        add_filter('preview_post_link', [$this, 'filter_preview_link'], 9999);
        add_filter('preview_page_link', [$this, 'filter_preview_link'], 9999);
        add_filter('get_sample_permalink', [$this, 'filter_preview_link'], 9999);
        add_filter('get_sample_permalink_html', [$this, 'filter_replace_base_url_html'], 9999);
        add_action('admin_bar_menu', [$this, 'customize_wp_admin_bar_preview_links'], 9999);
        add_filter('post_row_actions', [$this, 'change_base_url_view_link'], 9999, 2);
        add_filter('page_row_actions', [$this, 'change_base_url_view_link'], 9999, 2);
    }


    /**
     * @param $permalink
     * @return array|string
     */
    public static function filter_preview_link($permalink)
    {
        $base_url = Theme::FRONTEND_BASE_URL;
        if (is_array($permalink)) {
            $url_data = wp_parse_url($permalink[0]);
            $permalink[0] = str_replace($url_data['scheme'] . '://' . $url_data['host'], untrailingslashit($base_url), $permalink[0]);
            return $permalink;
        } else {
            $url_data = wp_parse_url($permalink);
            $permalink = untrailingslashit($base_url) . $url_data['path'] . (isset($url_data['query']) ? '?' . $url_data['query'] : '');
            return $permalink;
        }
    }

    /**
     * @param $html
     * @return mixed
     */
    public static function filter_replace_base_url_html($html)
    {
        $html = str_replace(untrailingslashit(site_url()), untrailingslashit(Theme::FRONTEND_BASE_URL), $html);
        return $html;
    }

    /**
     * @param $wp_admin_bar
     */
    public static function customize_wp_admin_bar_preview_links($wp_admin_bar)
    {
        Log::log($wp_admin_bar);
        $viewSiteNode = $wp_admin_bar->get_node('view-site');
        $viewSiteNode->meta['target'] = '_blank';
        $viewSiteNode->title = __("Visit frontend", Theme::TEXT_DOMAIN);
        $viewSiteNode->href = Theme::FRONTEND_BASE_URL;
        $wp_admin_bar->add_node($viewSiteNode);

        $siteNameNode = $wp_admin_bar->get_node('site-name');
        $siteNameNode->meta['target'] = '_blank';
        $siteNameNode->title = __("Visit frontend", Theme::TEXT_DOMAIN);
        $siteNameNode->href = Theme::FRONTEND_BASE_URL;
        $wp_admin_bar->add_node($siteNameNode);
    }

    /**
     * @param $actions
     * @param $post
     * @return mixed
     */
    public static function change_base_url_view_link($actions, $post)
    {
        $actions['view'] = self::filter_replace_base_url_html($actions['view']);
        return $actions;
    }

}