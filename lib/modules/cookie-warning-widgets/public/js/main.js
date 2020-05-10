apos.define('cookie-warning-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {

        self.play = function($widget, data, options) {
            $widget.find('.cookie-button').click(function(event) {
                event.preventDefault();

                var allowCookies = $(this).hasClass('cookie-button-blue');
                self.setCookieConsent(allowCookies);
            });
        };

        self.getCookieConsent = function() {
            var match = document.cookie.match('cookie-consent=(1|-1)');
            if (match) return match && match[1] === '1';
        }

        self.setCookieConsent = function(allowCookies) {
            var date = new Date();
            document.cookie = "cookie-consent=" + (allowCookies ? '1' : '-1') + '; path=/; expires=Thu, 31 Dec '+(date.getFullYear() + 5)+' 23:59:00 UTC;';
            document.location.reload();
        };

    }
});

$(document).ready(function() {
    var cookieConsent = apos.modules['cookie-warning-widgets'].getCookieConsent();
    if (typeof cookieConsent == 'undefined') {
        document.getElementById('cookiewarning-container-top').classList.remove("hidden")
    } else {
        document.getElementById('cookiewarning-container-top').classList.add("hidden")
    }
});
