<?php

namespace PTH;

//utils
require_once("utils/Singleton.php");
require_once("utils/Log.php");

//post types
require_once("post-types/BlogPostType.php");

//components
//require_once("components/FlushFrontendCacheComponent.php");
//require_once("components/GraphqlCacheComponent.php");
require_once("components/MainNavigation.php");
require_once("components/PreviewComponent.php");
require_once("components/CorsComponent.php");

//api
require_once("api/FrontPageRoute.php");
require_once("api/NavigationRoute.php");

/**
 * Class Theme
 *
 * @package PTH
 */
class Theme extends Singleton
{
    /**
     * Define text domain
     */
    const TEXT_DOMAIN = 'petertenhoor';

    /**
     * Define image sizes
     */
    const IMAGE_SIZE_POST = 'imageSizePost';

    /**
     * Define API namespace
     */
    const API_NAMESPACE = 'pth/v1';

    /**
     * Define API prefix
     */
    const API_PREFIX = 'api';

    /**
     * Define frontend base url
     */
    const FRONTEND_BASE_URL = 'http://127.0.0.1:3000';

    /**
     * Theme constructor.
     */
    protected function __construct()
    {
        self::initPostTypes();
        self::initComponents();
        self::setImageSizes();
        self::initRestRoutes();
    }

    public static function initPostTypes()
    {
        BlogPostType::getInstance();
    }

    /**
     * Init component classes
     */
    public static function initComponents()
    {
        MainNavigation::getInstance();
        PreviewComponent::getInstance();
        CorsComponent::getInstance();
//        FlushFrontendCacheComponent::getInstance();
//        GraphqlCacheComponent::getInstance();
    }

    /**
     * Set image sizes
     */
    public static function setImageSizes()
    {
        add_theme_support('post-thumbnails');
        add_image_size(self::IMAGE_SIZE_POST, 450, 300, true);
    }

    public static function initRestRoutes()
    {
        FrontPageRoute::getInstance();
        NavigationRoute::getInstance();
    }

}
