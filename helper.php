<?php

if (!defined('DOKU_INC')) die();

class helper_plugin_quicksubscribe extends DokuWiki_Plugin {

    function tpl_subscribe() {
        global $INFO;
        if($INFO['subscribed']){
            $img = 'yes';
            $title = prettyprint_id($INFO['subscribed'][0]['target']);
        }else{
            global $lang;
            $img = 'no';
            $title = $lang['btn_subscribe'];
        }
        $sub = '<img class="qsub__link ' .
               ($INFO['subscribed'] ? 'qsub__subscribed' : 'qsub__notsubscribed') .
               '" src="'.DOKU_BASE.'lib/plugins/quicksubscribe/images/mail-' . $img .
               '.png" width="16" height="16" alt="" title="'.$title.'" />';
        tpl_actionlink('subscribe','','',$sub);
    }
}
