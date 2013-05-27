<?php
/**
 * DokuWiki Plugin quicksubscribe (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Andreas Gohr <gohr@cosmocode.de>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

class action_plugin_quicksubscribe extends DokuWiki_Action_Plugin {

    function register(&$controller) {
        $controller->register_hook('AJAX_CALL_UNKNOWN', 'BEFORE', $this, 'handle_ajax_call_unknown');
    }

    function handle_ajax_call_unknown(&$event, $param) {
        if($event->data != 'plugin_quicksubscribe') return;
        $event->preventDefault();
        $event->stopPropagation();

        global $INPUT;

        $ns = cleanID($INPUT->str('ns')) . ':'; // we only handle namespaces
        $do = $INPUT->str('do');

        $ok = false;
        $msg = '';

        $sub = new Subscription();

        if($do == 'subscribe') {
            // new subscriptions
            $ok = $sub->add($ns, $_SERVER['REMOTE_USER'], 'list');
            if($ok) {
                $msg = sprintf($this->getLang('sub_succ'), $this->prettyid($ns));
            } else {
                $msg = sprintf($this->getLang('sub_fail'), $this->prettyid($ns));
            }
        } elseif($do == 'unsubscribe') {
            // subscription removal
            $ok = $sub->remove($ns, $_SERVER['REMOTE_USER']);
            if($ok) {
                $msg = sprintf($this->getLang('unsub_succ'), $this->prettyid($ns));
            } else {
                $msg = sprintf($this->getLang('unsub_fail'), $this->prettyid($ns));
            }
        }

        if(!$ok) http_status(400);
        echo '<p>' . $msg . '</p>';
    }

    private function prettyid($ns) {
        $ns = cleanID($ns);
        return $ns ? ($ns . ':*') : '*';
    }
}

// vim:ts=4:sw=4:et:enc=utf-8:
