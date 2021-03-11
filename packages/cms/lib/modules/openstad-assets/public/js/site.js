$(function () {
    // keep this one first in case a browser crashes on new JS syntax.
    initBrowserWarning();
    initAjaxForms();
    initHideFlash();
    initToggleMenuVisibility();
    initLogoutMijnOpenstad();
    initAdminHover();
    initRoleRequired();
    initFadeInOnReady();
    initNewsletterForm();
    initCloseModalWhenClickingOnBackground();
    initDataTables();
    initTrashPageWarning();
    initAjaxRefresh();
    initFormSubmit();
    initTrapFocusInOpenModal();
});

function initLogoutMijnOpenstad() {
    $('.logout-button').click(function (ev) {
        ev.preventDefault();

        var addressValue = $(this).attr("href");
        logoutMijnOpenstad({
            success: function () {
                window.location.href = addressValue;
            },
            error: function (err) {
                window.location.href = addressValue;
            }
        })
    });
}

function initDataTables() {
    var $tableElements = $('.data-table');

    // only run when table elements exist
    if ($tableElements.length === 0) {
        return;
    }

    // the init logic
    var init = function () {
        $tableElements.dataTable({
            "pageLength": 50,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });
    }

    // in case jquery dataTables already loaded run code immediately
    if (jQuery().dataTable) {
        init();
        // otherwise load scripts first
    } else {
        $.getScript("/modules/openstad-assets/js/vendor/jquery.dataTables.min.js")
            .done(function (script, textStatus) {
                init();
            })
            .fail(function (jqxhr, settings, exception) {
                alert('Something went wrong loading the table');
            });
    }

}

function initCloseModalWhenClickingOnBackground() {
    $('.content-modal').on('click', function (ev) {
        // only close if click is directly on the parent container
        if ($(ev.target).hasClass('content-modal')) {
            window.location.hash = '#closed';
        }
    });
}

function initHideFlash() {
    $('.flash-container .close-button').click(function () {
        $(this).closest('.flash-container').remove();
    });

    setTimeout(function () {
        $('.flash-container').remove();
    }, 5000);
}


function initToggleMenuVisibility() {
    $('.visibility-toggle').click(function (ev) {
        ev.preventDefault();
        var dataTarget = $(this).attr('data-target');
        var $target = $(dataTarget);
        var $button = $(this);
        var menusOpen = $('.visibility-toggle.active').length > 0 ? true : false;

        if ($target.is(':visible')) {
            $('.body-background').hide();
            $('.visibility-toggle').removeClass('active');
            $('.toggle-menu').removeClass('active').hide();
        } else {
            $('.visibility-toggle').removeClass('active');
            $('.toggle-menu').removeClass('active').hide();
            $('.body-background').show();
            $button.addClass('active');
            $target.addClass('active').show();
        }
    });

    $('.body-background').click(function (e) {
        $('.body-background').hide();
        $('.visibility-toggle').removeClass('active');
        $('.toggle-menu').removeClass('active').hide();
    });
}

function logoutMijnOpenstad(options) {
    $.ajax({
        url: authServerLogoutUrl,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Accept", "application/json");
        },
        success: options.sucess,
        error: options.error,
    });
}


/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function initBrowserWarning() {
    if (detectIE() && detectIE() < 11) {
        $('body').prepend('<div class="browser-warning"> U gebruikt een verouderde versie van uw browser, Internet Explorer. We kunnen daarom niet garanderen dat deze website naar behoren werkt voor u. </div>')
    }
}

function initAjaxForms($e) {
    $('body').on('submit', '.ajax-form', function (ev) {
        ev.preventDefault();
        var $form = $(this);
        var $submitButtons = $form.find('input[type="submit"], button[type="submit"]');
        $submitButtons.attr('disabled', true);

        $.ajax({
            url: $form.attr('action'),
            //  context: document.body,
            type: $form.attr('method'),
            data: $form.serialize(),
            //     dataType: 'json',
            success: function (response) {
                // for some reason, above redirectUrl is sometimes empty here.
                var redirectUrl = $form.find('.redirect-url').val();

                if ($form.hasClass('ajax-refresh-after-submit')) {
                    ajaxRefresh();
                } else if (redirectUrl) {
                    var separator = redirectUrl.indexOf('?') !== -1 ? '&' : '?';
                    redirectUrl = redirectUrl.startsWith('http') ? redirectUrl : window.siteUrl + redirectUrl;

                    window.location.href = redirectUrl + separator + 'n=' + new Date().getTime();
                } else {
                    window.location.hash = "";
                    window.location.reload();
                }
            },
            error: function (response) {
                var message, errorMessage;
                var redirectErrorUrl = $form.find('.redirect-error-url').val();

                response = response && response.responseJSON ? response : JSON.parse(response);

                message = response.responseJSON && response.responseJSON.message ? response.responseJSON.message : false;
                errorMessage = response.responseJSON && response.responseJSON.error && response.responseJSON.error.message ? response.responseJSON.error.message : false;

                $submitButtons.attr('disabled', false);

                if (message) {
                    alert('Er gaat iets mis: ' + message);
                }

                if (errorMessage) {
                    alert('Er gaat iets mis: ' + errorMessage);
                }

                if (redirectErrorUrl) {
                    redirectErrorUrl = redirectErrorUrl.startsWith('http') ? redirectErrorUrl : window.siteUrl + redirectErrorUrl;
                    window.location.replace(redirectErrorUrl);
                }
            },
        }).done(function (response) {
            //console.log('donenonoene', response);
        })

    });
}

/**
 * Take care of newsletter submitting logic: validation, error & success feedback & ajax submission
 */
function initNewsletterForm() {
    var $form = $('#newsletter-form');
    var $successMessage = $form.find('.newsletter-success-message');
    var validator = $('#newsletter-form').validate({
        submitHandler: function (form) {
            var $submitButton = $(form).find('button[type="submit"]');
            var submitButtonText = $submitButton.text();
            //add ... and disabled so form cant be submitted
            $submitButton.text(submitButtonText + '...')
            $form.find('button[type="submit"]').attr('disabled', true);
            // hide the message
            $form.find('.error-message').empty().hide();
            $form.find('.success-message').empty().hide();

            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                data: $(form).serialize(),
                dataType: 'json',
                success: function (response) {
                    $form.find('.success-message').text('Je bent ingeschreven!').show();
                    // set text back to normal and make the button clickable again
                    $submitButton.text(submitButtonText);
                    $submitButton.attr('disabled', false);
                },
                error: function (error) {
                    // get the error message
                    var errorMessage = error && error.responseJSON && error.responseJSON.message ? error.responseJSON.message : 'Er gaat iets mis...';
                    $form.find('.error-message').text(errorMessage).show();
                    // set text back to normal and make the button clickable again
                    $submitButton.text(submitButtonText);
                    $submitButton.attr('disabled', false);
                }
            });
            return false;
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
    });

}


function initAdminHover() {
    $('.apos-area-widget').hover(
        function (ev) {
            ev.stopPropagation();
            $('.apos-area-widget').removeClass('hover');
            var $childEl = $(this).find('.apos-area-widget');
            // $(this).addClass('hover')
            if ($childEl.length > 0) {
                $childEl.addClass('hover');
            } else {
                $(this).addClass('hover');
            }
        },
        function (ev) {
            var $this = $(this);
            $this.removeClass('hover')
        }
    );
}

function openstadGetStorage(name) {

    var value = localStorage.getItem(name);

    try {
        value = JSON.parse(value);
    } catch (err) {
    }

    return value;

}

function openstadSetStorage(name, value) {

    if (typeof name != 'string') return;

    if (typeof value == 'undefined') value = "";
    if (typeof value == 'object') {
        try {
            value = JSON.stringify(value);
        } catch (err) {
        }
    }
    ;

    localStorage.setItem(name, value);
}


function initRoleRequired() {
    var userRole = openstadUserRole ? openstadUserRole : false;
//  hasModeratorRights;

    $(".role-required-anonymous").on('click', function (ev) {
        // if no user role is set, redirect them to the anonymous role auth route
        if (!userRole) {
            ev.preventDefault();
            var loginUrl = '/oauth/login?useOauth=anonymous';
            loginUrl = $(this).attr('data-return-to') ? loginUrl + '&returnTo=' + encodeURIComponent($(this).attr('data-return-to')) : loginUrl;
            window.location.href = loginUrl;
        }
    });

    $(".role-required-member").on('click', function (ev) {
        if (userRole !== 'member' && !hasModeratorRights) {
            ev.preventDefault();
            //show login popup.
            var modalText = $(this).attr('data-modal-text');
            $('#login-required').find('.modal-login-text').text(modalText);
            location.hash = 'login-required';
            return false;
        }
    });

}

function initFadeInOnReady() {
    $(document).ready(function () {
        if ($('.opacity-0-for-load, .ajax-form').length > 0) {
            $('.opacity-0-for-load, .ajax-form').animate({opacity: 1}, 500, function () {
                $('body').addClass('page-loaded');
            });
        } else {
            $('body').addClass('page-loaded');
        }

        $('.hide-when-loaded').hide();

    });
}

function initTrashPageWarning() {
    $('[data-apos-trash-page]').on('click', function () {
        return confirm('Sure?');
    })
}

// Refresh certain elements after certain ajax calls
// Each element that will be refreshed needs own id, otherwise can't be found
// Remember to bind events in a way that work with dynamic events
// It's pretty similar to apostropheCMS way of doing ajax calls,
// their version doesn't seem to do a specific dom element select, so server side needs to be smarter
// this version is a bit less efficient since we get back almost whole the page
// the control elements should be refreshed server side otherwise it's values will not be corrrect
//
function initAjaxRefresh() {

    $('body').on('click', '.openstad-ajax-refresh-link', function (ev) {
        ev.preventDefault();

        var newUrl = $(this).attr('href');

        if (window.location.hash) {
            newUrl = newUrl + window.location.hash;
        }
        //update URL
        updateUrl(newUrl);

        //update DOM
        ajaxRefresh($(this).attr('data-reset-hash'));
    });

    $('body').on('submit', '.ajax-refresh-prevent-submit', function (ev) {
        ev.preventDefault();
    });

    $('body').on('click', '.openstad-ajax-refresh-click', function (ev) {
        ev.preventDefault();

        var params = getQueryParams();
        var refreshName = $(this).attr('data-refresh-name');
        var refreshValue = $(this).attr('data-refresh-value');

        if (refreshName && refreshValue) {
            //set value from selector
            params[refreshName] = refreshValue;
        }

        // if set, reset the page index for pagination
        if ($(this).attr('data-reset-pagination')) {
            params.page = 0;
        }

        if ($(this).attr('data-reset-search')) {
            params.search = '';
        }

        var newUrl = window.location.pathname + '?' + $.param(params);

        if ($(this).attr('data-reset-hash') && window.location.hash) {
            newUrl = newUrl + window.location.hash;
        }

        //update URL
        updateUrl(newUrl);

        //update DOM
        ajaxRefresh($(this).attr('data-reset-hash'));
    });

    $('body').on('change', '.openstad-ajax-refresh-input', function (ev) {
        ev.preventDefault();

        //get current query params'
        var params = getQueryParams();

        //set value from selector
        params[$(this).attr('name')] = $(this).val();

        // if set, reset the page index for pagination
        if ($(this).attr('data-reset-pagination')) {
            params.page = 0;
        }

        if ($(this).attr('data-reset-search')) {
            params.search = '';
        }

        var newUrl = window.location.pathname + '?' + $.param(params);

        if ($(this).attr('data-reset-hash') && window.location.hash) {
            newUrl = newUrl + window.location.hash;
        }

        //update URL
        updateUrl(newUrl);

        //update DOM
        ajaxRefresh($(this).attr('data-reset-hash'));
    });

    function getQueryParams() {
        var search = location.search.substring(1);
        return search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {};
    }

    function updateUrl(url) {
        window.history.pushState(null, null, url)
    }
}


function ajaxRefresh(resetHash) {
    $('.openstad-ajax-refresh').addClass('ajax-loading');

    $.ajax({
        url: window.location.href,
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        cache: false,
        error: function () {
            alert('Error... something went wrong.')
        }
    })
        .done(function (response) {
            var $newHtml = $('<div></div>');
            $newHtml.html(response);

            // in case of empty dom response alert
            if ($newHtml.length === 0) {
                return alert('Error... something went wrong.');
            }

            $('.openstad-ajax-refresh').removeClass('ajax-loading');

            $('.openstad-ajax-refresh').each(function () {
                //look for element with same ID and replaced
                //dont do check, in case it's empty replace with empety
                var idSelector = '#' + $(this).attr('id');

                var freshHtml = $newHtml.find(idSelector);

                $(this).replaceWith(freshHtml);
            });

            // trigger ajax refresh event for  binding to new dom events
            $(document).trigger('openstadAjaxRefresh');

            // trigger
            if (resetHash && window.location.hash && window.location.hash !== '#closed') {
                var hash = window.location.hash;
                window.location.hash = '#';
                window.location.hash = hash;
            }
        });
}

function initFormSubmit() {
    var $formToSubmit = $('#form-to-submit');

    if ($formToSubmit.length > 0) {
        $formToSubmit.submit();
    }
}

/**
 * Trap the focus inside the currently open modal when using tab.
 *
 * This functionality is required for accessibility compliance.
 */
function initTrapFocusInOpenModal() {
    document.addEventListener('keydown', function (e) {
        var isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        var focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        var $modal = $('.content-modal').filter(function () {
            // If we use the :visible selector, we always get all modals. The modals are using 'visibility: hidden;'
            // and are therefore technically visible, because they consume space in the layout.
            // We only want the currently visible modal, so we have to filter out all modals with 'visibility: hidden'
            return $(this).css('visibility') != 'hidden';
        });

        if (!$modal || $modal.length <= 0) {
            return;
        }

        var focusableContent = $modal.find(focusableElements);
        var firstFocusableElement = focusableContent[0];
        var lastFocusableElement = focusableContent[focusableContent.length - 1];

        // Based on whether or not the shift key is pressed, always return to the first / last focusable element
        // when tabbing through the modal's focusable items. This essentially 'locks' the user in the modal when using tab.
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}

function initImagesGallery() {
    var fotoramaEl = $('.fotorama');

    if (fotoramaEl.length > 0) {
        var initFotorama = function () {
            var fotorama = fotoramaEl.fotorama({
                thumbWidth: 60,
                thumbHeight: 60,
                minWidth: 300,
                keyboard: false
            });

            fotorama.on('fotorama:fullscreenenter fotorama:fullscreenexit', function (e, fotorama) {
                if (e.type === 'fotorama:fullscreenenter') {
                    // Options for the fullscreen
                    fotorama.setOptions({
                        fit: 'contain'
                    });
                } else {
                    // Back to normal settings
                    fotorama.setOptions({
                        fit: 'cover'
                    });
                }
            });
        }

        // in case jquery fotorama already loaded run code immediately
        if (jQuery().fotorama) {
            initFotorama();
            // otherwise load scripts first
        } else {
            $.getScript("/modules/openstad-assets/js/vendor/fotorama.min.js")
                .done(function (script, textStatus) {
                    initFotorama();
                })
                .fail(function (jqxhr, settings, exception) {
                    alert('Something went wrong loading the photo gallery');
                });
        }

    }
}