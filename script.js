jQuery(function () {
    var $links = jQuery('img.qsub__link');
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

        if (jQuery(this).hasClass('qsub__notsubscribed')) {
            // Handle Subscriptions

            $overlay.html(
                    '<p>' + LANG.plugins.quicksubscribe.subscr_in_progress + '</p>'
                ).load(
                DOKU_BASE + 'lib/exe/ajax.php',
                {
                    call: 'plugin_quicksubscribe',
                    ns: JSINFO.namespace + ':',
                    do: 'subscribe'
                },
                function (text, status) {
                    if (status == 'success') {
                        $link.addClass('qsub__subscribed');
                        $link.removeClass('qsub__notsubscribed');
                    }
                    addmore($overlay, $link.attr('href'));
                }
            );
        } else {
            // Handle unsubscriptions

            $overlay.html(
                    '<p>' + LANG.plugins.quicksubscribe.is_subscr.replace(/%s/, this.title) +
                        ' ' + LANG.plugins.quicksubscribe.del_subscr +
                        '<button class="button">' +
                        LANG.plugins.quicksubscribe.del_subscr_button +
                        '</button>' + '</p>'
                ).find('button').click(function () {
                    $overlay.load(
                        DOKU_BASE + 'lib/exe/ajax.php',
                        {
                            call: 'plugin_quicksubscribe',
                            ns: $link.attr('data-ns'),
                            do: 'unsubscribe'
                        },
                        function (text, status) {
                            if (status == 'success') {
                                $link.removeClass('qsub__subscribed');
                                $link.addClass('qsub__notsubscribed');
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
        var $img = jQuery(this);
        var $link = $img.parent();

        // copy attributes to surrounding link, then remove the inner image
        $link.addClass($img.attr('class'));
        $link.attr('title', $img.attr('title'));
        $img.remove();

        // attach namespace info to link
        var ns = $link.attr('class').match(/qsubns__([^ ]+)/);
        if (ns){
            ns = ns[1];
        }else{
            ns = JSINFO.namespace + ':';
        }
        $link.attr('data-ns', ns);

        // attach click handler
        $link.click(clickhandler);
    });
});
