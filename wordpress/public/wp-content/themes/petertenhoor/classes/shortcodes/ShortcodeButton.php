<?php

namespace PTH;

/**
 * Class ShortcodeButton
 * @package PTH
 */
class ShortcodeButton extends Singleton
{

    const SHORTCODE_NAME = 'headless_button';

    /**
     * ShortcodeButton constructor.
     */
    protected function __construct()
    {
        add_shortcode(self::SHORTCODE_NAME, [$this, 'addShortcode']);
    }

    public static function addShortcode($atts)
    {
        $atts = shortcode_atts([
            'link' => '#',
            'type' => 'black',
            'target' => '_self',
            'text' => 'Click me',
        ], $atts, self::SHORTCODE_NAME);

        ob_start();
        ?>

        <Button type="<?php echo $atts['type'] ?>"
                link="<?php echo $atts['link'] ?>"
                target="<?php echo $atts['target'] ?>"
                text="<?php echo $atts['text'] ?>"/>

        <?php
        return ob_get_clean();
    }

}