addInitEvent(function () {
    var links = getElementsByClass('qsub__link', document, 'img');
    if (links.length === 0) return;

    function prettyid(ns) {
        return ns ? (ns + ':*') : '*';
    }

    function onclick(e) {
        // IE fix, dunno
        e.preventDefault();

        var overlay = $('plugin_qsub_popup');
        if (overlay) overlay.parentNode.removeChild(overlay);

        var content = document.createElement('div');
        var s = this.className.match(/qsub__notsubscribed/);
        content.className = 'content';
        if (s) {
            content.innerHTML = '<p>' + LANG.plugins.quicksubscribe.subscr_in_progress + '</p>';
            var ajax = new doku_ajax('plugin_quicksubscribe_subscribe', {ns: NS + ':'});
        } else {
            content.innerHTML = '<p>' + LANG.plugins.quicksubscribe.is_subscr.replace(/%s/, this.title) +
                                '<br/>' + LANG.plugins.quicksubscribe.del_subscr +
                                ' <button class="button">' + LANG.plugins.quicksubscribe.del_subscr_button +
                                '</button></p>';
            var ajax = new doku_ajax('plugin_quicksubscribe_unsubscribe', {ns: this.ns});
            addEvent(content.lastChild.lastChild, 'click', function () {
                // late bind!
                ajax.runAJAX();
            });
        }

        var _this = this;
        var tgt = content.lastChild;
        ajax.onCompletion = function () {
            tgt.innerHTML = LANG.plugins.quicksubscribe[(s ? 'sub' : 'unsub') +
                                                        '_' + (this.responseStatus[0] == 200 ?
                                                        'succ' : 'fail')].replace(/%s/, prettyid(this.ns));
            if (this.responseStatus[0] !== 200) {
                return;
            }
            _this.className = _this.className.replace(/qsub__(not)?subscribed/g, '') +
                              (s ? 'qsub__subscribed' : 'qsub__notsubscribed');
            if (s) {
                _this.ns = NS + ':';
            }
            _this.title     = s ? prettyid(NS) : LANG.plugins.quicksubscribe.subscribe;
        };
        if (s) ajax.runAJAX();

        plugin_qsub__createOverlay(LANG.plugins.quicksubscribe.title, content, this);
        return false;
    }

    for (var i = 0 ; i < links.length ; ++i) {
        var link = links[i].parentNode;
        link.className += ' ' + links[i].className;
        link.ns = link.className.match(/qsubns__([^ ]+)/);
        link.ns = link.ns ? link.ns[1] : (NS + ':');
        link.title = links[i].title;
        link.innerHTML = ' ';
        addEvent(link, 'click', onclick);
    }
});

function plugin_qsub__createOverlay(title, content, button) {
    var div = document.createElement('div');
    div.innerHTML = '<div class="title">' +
                    '<img src="' + DOKU_BASE + 'lib/images/close.png">' +
                    title + '</div>';

    content.appendChild(document.createElement('hr'));
    var more = document.createElement('p');
    more.innerHTML = LANG.plugins.quicksubscribe.edit_subscr +
                     ' <button class="button">' + LANG.plugins.quicksubscribe.edit_subscr_button +
                     '</button>';

    addEvent(more.lastChild, 'click', function () {document.location = button.href});
    content.appendChild(more);
    div.appendChild(content);

    div.id = 'plugin_qsub_popup';

    div.__close = function(event) {
        div.style.display = 'none';
    };

    addEvent(div.firstChild.firstChild,'click',div.__close);

    drag.attach(div, div.firstChild);
    var dw = getElementsByClass('dokuwiki', document.body, 'div')[0];
    dw.appendChild(div);
    // FIXME
    div.style.top  = '300px';
    div.style.left = '500px';
    return div;
}
