<?php

use dokuwiki\Extension\ActionPlugin;
use dokuwiki\Extension\EventHandler;
use dokuwiki\Extension\Event;
use dokuwiki\Subscriptions\SubscriberManager;

/**
 * DokuWiki Plugin quicksubscribe (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Andreas Gohr <gohr@cosmocode.de>
 */
class action_plugin_quicksubscribe extends ActionPlugin
{
    /** @inheritdoc */
    public function register(EventHandler $controller)
    {
        $controller->register_hook('AJAX_CALL_UNKNOWN', 'BEFORE', $this, 'handle_ajax_call_unknown');
    }

    /**
     * Handle subscription/unsubscription AJAX events
     *
     * @param Event $event
     * @param $param
     */
    public function handle_ajax_call_unknown(Event $event, $param)
    {
        if ($event->data != 'plugin_quicksubscribe') return;
        $event->preventDefault();
        $event->stopPropagation();

        global $INPUT;

        $ns = cleanID($INPUT->str('ns')) . ':'; // we only handle namespaces
        $do = $INPUT->str('do');

        $ok = false;
        $msg = '';

        $sub = new SubscriberManager();

        if ($do == 'subscribe') {
            // new subscriptions
            try {
                $ok = $sub->add($ns, $_SERVER['REMOTE_USER'], 'list');
            } catch (\Exception $ignored) {
                $ok = false;
            }
            if ($ok) {
                $msg = sprintf($this->getLang('sub_succ'), prettyprint_id($ns));
            } else {
                $msg = sprintf($this->getLang('sub_fail'), prettyprint_id($ns));
            }
        } elseif ($do == 'unsubscribe') {
            // subscription removal
            $ok = $sub->remove($ns, $_SERVER['REMOTE_USER']);
            if ($ok) {
                $msg = sprintf($this->getLang('unsub_succ'), prettyprint_id($ns));
            } else {
                $msg = sprintf($this->getLang('unsub_fail'), prettyprint_id($ns));
            }
        }

        if (!$ok) http_status(400);
        echo '<p>' . $msg . '</p>';
    }
}
