addInitEvent(function () {
    var links = getElementsByClass('qsub__link', document, 'img');
    if (links.length === 0) return;

    function onclick() {
        var overlay = $('plugin_qsub_popup');
        if (overlay) overlay.parentNode.removeChild(overlay);

        var content = document.createElement('div');
        var s = this.className.match(/qsub__notsubscribed/);
        content.className = 'content';
        if (s) {
            content.innerHTML = '<p>Das Abo wird eingerichtet …</p>';
            var ajax = new doku_ajax('plugin_quicksubscribe_subscribe', {ns: NS + ':'});
        } else {
            content.innerHTML = '<p>Sie haben diese Seite über den Namespace ' + this.title +  ' abonniert.<br />' +
                                'Möchten Sie dieses Abo löschen? ' +
                                '<button class="button">' + 'Löschen' + '</button></p>';
            var ajax = new doku_ajax('plugin_quicksubscribe_unsubscribe', {ns: this.ns});
            addEvent(content.lastChild.lastChild, 'click', function () {
                // late bind!
                ajax.runAJAX();
            });
        }

        ajax.elementObj = content.lastChild;
        var _this = this;
        ajax.onCompletion = function () {
            if (this.responseStatus[0] !== 200) {
                return;
            }
            _this.className = _this.className.replace(/qsub__(not)?subscribed/g, '') +
                              (s ? 'qsub__subscribed' : 'qsub__notsubscribed');
            if (s) {
                _this.ns = NS + ':';
            }
            _this.title     = (s ? (NS ? (NS + ':*') : '*') : 'Änderungen abonnieren');
        };
        if (s) ajax.runAJAX();

        // FIXME lang
        plugin_qsub__createOverlay('Abo', content, this);
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
    more.innerHTML = 'Möchten Sie Ihre Abo-Einstellungen bearbeiten?' +
                     '<button class="button">' + 'Einstellungen' + '</button>';
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
