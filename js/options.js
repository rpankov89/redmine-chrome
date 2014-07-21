/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

$(function() {

    var $language = $('#language'),
        $save = $('#save'),
        $urls = $('#urls'),
        $addUrl = $('#addUrl'),
        $roles = $('#roles'),
        $status = $('#status'),
        $number = $('#number'),
        $interval = $('#interval'),
        $notify = $('#notify');

    function init() {
        // language
        $language.change(function() {
            settings('language', $(this).val());
            location.reload(true);
        }).val(settings('language'));

        $save.click(save);

        // urls
        var itemTpl = $('#itemTpl').html(),
            urlsHtml = [];

        $.each(settings('urls'), function (i, url) {
            urlsHtml.push(util.sprintf(itemTpl, url));
        });
        $urls.html(urlsHtml.join(''));
        $addUrl.click(function () {
            $urls.append(util.sprintf(itemTpl, ''));
        });
        $(document).on('click', '.remove-url', function () {
            $(this).parents('.input-group').remove();
        });

        // roles, status
        $.each(['roles', 'status'], function (i, name) {
            var $name = $('#' + name).multipleSelect({
                selectAll: false,
                countSelected: false
            }).multipleSelect('setSelects', settings(name));
        });

        // number, interval
        $.each(['number', 'interval'], function (i, name) {
            var $name = $('#' + name).multipleSelect({
                single: true,
                name: name
            }).multipleSelect('setSelects', [settings(name)]);
        });

        $notify.prop('checked', settings('notify'));
    }

    function save() {
        var urls = [];
        $urls.find('input').each(function() {
            var url = $.trim($(this).val());
            if (url) {
                urls.push(url.replace(/\/$/, ''));
            }
        });
        settings('urls', urls);
        settings('roles', $roles.multipleSelect('getSelects'));
        settings('status', $status.multipleSelect('getSelects'));
        settings('number', +($number.multipleSelect('getSelects')[0]));
        settings('interval', +($interval.multipleSelect('getSelects')[0]));
        settings('notify', $notify.prop('checked'));
        alert(locale.save_successful);
        chrome.extension.getBackgroundPage().background.reset();
    }

    initLocale(init);
});