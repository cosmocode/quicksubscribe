jQuery(function () {
    var $links = jQuery('a.plugin_qsub_subscribe');
    if (!$links.length) return;

    /**
     * Add additional stuff to the dialog
     *
     * @param $to {object} jQuery dialog object
     * @param href {string}
     */
    function addmore($to, href) {
        var $more = jQuery(document.createElement('div'));
        $more.addClass('more');
        $more.html(
            '<p>' + LANG.plugins.quicksubscribe.edit_subscr +
            '<button class="button">' + LANG.plugins.quicksubscribe.edit_subscr_button +
            '</button></p>'
        ).find('button').click(function () {
            document.location = href;
        });

        $to.append($more);
    }

    /**
     * Handles the whole click processing
     *
     * @param e
     * @returns {boolean}
     */
    function clickhandler(e) {
        // remove any existing popup
        jQuery('#plugin_qsub__popup').remove();

        // create a new popup
        var $overlay = jQuery(document.createElement('div'));
        $overlay.attr({
            id: 'plugin_qsub__popup',
            title: LANG.plugins.quicksubscribe.title
        });

        var $link = jQuery(this);

        if (jQuery(this).hasClass('plugin_qsub_notsubscribed')) {
            // Handle Subscriptions
            $overlay.html(
                '<p>' + LANG.plugins.quicksubscribe.subscr_in_progress + '</p>'
            ).load(
                DOKU_BASE + 'lib/exe/ajax.php',
                {
                    call: 'plugin_quicksubscribe',
                    ns: JSINFO.namespace + ':',
                    'do': 'subscribe'
                },
                function (text, status) {
                    if (status === 'success') {
                        $link.addClass('plugin_qsub_subscribed');
                        $link.removeClass('plugin_qsub_notsubscribed');
                        $link.data('target', JSINFO.namespace + ':');
                    }
                    addmore($overlay, $link.attr('href'));
                }
            );
        } else {
            // Handle unsubscriptions
            $overlay.html(
                '<p>' + LANG.plugins.quicksubscribe.is_subscr.replace(/%s/, $link.data('target')) +
                ' ' + LANG.plugins.quicksubscribe.del_subscr +
                '<button class="button">' +
                LANG.plugins.quicksubscribe.del_subscr_button +
                '</button>' + '</p>'
            ).find('button').click(function () {
                $overlay.load(
                    DOKU_BASE + 'lib/exe/ajax.php',
                    {
                        call: 'plugin_quicksubscribe',
                        ns: $link.data('target'),
                        'do': 'unsubscribe'
                    },
                    function (text, status) {
                        if (status === 'success') {
                            $link.data('target', '');
                            $link.removeClass('plugin_qsub_subscribed');
                            $link.addClass('plugin_qsub_notsubscribed');
                        }
                        addmore($overlay, $link.attr('href'));
                    }
                );
            });
            addmore($overlay, $link.attr('href'));
        }

        // show the dialog
        $overlay.dialog();
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // attach dialog creation to any quicksubscribe link
    $links.each(function () {
        var $link = jQuery(this);
        // attach click handler
        $link.click(clickhandler);
    });
});
