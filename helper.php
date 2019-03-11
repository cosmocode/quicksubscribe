<?php

class helper_plugin_quicksubscribe extends DokuWiki_Plugin
{
    /**
     * Returns the quick subscribe icon using an inline SVG
     *
     * @return string
     */
    function tpl_subscribe()
    {
        global $INFO;
        global $ACT;

        // only on show
        if($ACT !== 'show') return '';

        // check if subscription is available
        try {
            $submgr = new \dokuwiki\Menu\Item\Subscribe();
        } catch (\RuntimeException $ignored) {
            return '';
        }

        // we need to access the javascript translations
        $this->setupLocale();

        if ($INFO['subscribed']) {
            $title = $this->lang['js']['unsubscribe'];
            $target = $INFO['subscribed'][0]['target'];
            $class = 'plugin_qsub_subscribed';
        } else {
            $title = $this->lang['js']['subscribe'];
            $target = '';
            $class = 'plugin_qsub_notsubscribed';
        }

        // we hide one of the SVGs based on the outer class
        $svg = inlineSVG(__DIR__ . '/images/bell-ring.svg').inlineSVG(__DIR__ . '/images/bell-outline.svg');

        $link = $submgr->getLinkAttributes('plugin_qsub_');
        $link['data-target'] = $target;
        $link['title'] = $title;
        $link['class'] .= ' ' . $class;
        $attr = buildAttributes($link);

        return "<a $attr>$svg</a>";
    }
}
