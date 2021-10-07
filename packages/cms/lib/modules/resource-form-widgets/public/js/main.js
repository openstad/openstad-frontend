// Idea form extensions
// --------------------
// Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.

apos.define('resource-form-widgets', {
    extend: 'map-widgets',
    construct: function (self, options) {

        self.playAfterlibsLoaded = function($widget, data, options) {
            var mapConfig = typeof resourceMapConfig !== 'undefined' && resourceMapConfig ? resourceMapConfig : {};

            self.registerFilePondPlugins();

            if (mapConfig && Object.keys(mapConfig).length > 0) {
                self.createMap(mapConfig);
                self.addPolygon(mapConfig);
                self.setIdeaMarker(mapConfig);
                self.addFormEventListeners(mapConfig);
                self.center();
            }


            self.initRepeatableForm($widget);

            self.initPlaceholderLabel($widget);

            $widget.find('.resource-form').each(function () {
                var form = this;
                initUploadField(form);
                bindResourceFormValidation(form);

                // in case of a checkout form with order items, redirect, otherwise will cause problems
                if ($(form).hasClass('checkout-form') && $(form).hasClass('cart-is-empty')) {
                    window.location.href = window.siteUrl;
                } else if ($(form).hasClass('auto-submit-form-container')) {
                    if (!window.hasModeratorRights) {
                        $(form).submit();
                    }
                }
            });

        }

        self.initPlaceholderLabel = function ($widget) {
            var $hipInputElements = $widget.find('.hip-label input, .hip-label textarea');
            var handleElementClass = function (el) {
                var $el = $(el);

                if ($el.val().length > 0) {
                    $el.closest('.hip-label').addClass('hip-active');
                } else {
                    $el.closest('.hip-label').removeClass('hip-active');
                }
            }

            $hipInputElements.each(function () {
                handleElementClass(this)
            });
            $hipInputElements.on('keyup', function (el) {
                handleElementClass(this)
            });
        }

        self.initRepeatableForm = function ($widget) {
            // add first form

            // add a save form
            $widget.find('.repeatable-submit').on('click', function () {
                $widget.find('.resource-form').each(function () {
                    var form = this;
                    var $form = $(form);
                    $form.unbind();
                    $form.data("validator", null);
                    bindResourceFormValidation(form);
                    $form.submit();
                });
            });

            // add a append button
            $widget.find('.resource-form').each(function () {
                self.bindRepeatableDelete($(this))
            });

            $widget.find('.repeatable-add').on('click', function () {
                self.addRepeatableForm($widget);
            });

            self.addRepeatableForm($widget);
        }

        self.bindRepeatableDelete = function ($form) {
            $form.find('.repeatable-delete').off('click');

            $form.find('.repeatable-delete').on('click', function (ev) {
                ev.preventDefault();

                $form.addClass('processing');

                var resourceId = $form.find('input[name="resourceId"]').val();
                var resourceType = $form.find('input[name="resourceType"]').val();
                var resourceEndPoint = $form.find('input[name="resourceEndPoint"]').val();

                if (resourceId) {
                    $.ajax({
                        method: 'POST',
                        url: '/modules/resource-admin-widgets/delete',
                        data: {
                            resourceId: resourceId,
                            resourceType: resourceType,
                            resourceEndPoint: resourceEndPoint,
                        },
                        success: function () {
                            // on succes remove complete wrapper;
                            $form.closest('.repeatable-form-wrapper').remove();
                        },
                        error: function () {
                            alert('Error trying to remove, try again...')
                        },
                    })
                } else {
                    $form.closest('.repeatable-form-wrapper').remove();
                }
            });
        }

        self.addRepeatableForm = function ($widget) {
            var formContainerHTML = $widget.find('.repeatable-form-template').html();
            var $formContainer = $(formContainerHTML);
            $widget.find('.repeatable-form-container-forms').append($formContainer);
            var form = $formContainer.find('.resource-form');
            initUploadField(form);
            bindResourceFormValidation(form);
            self.bindRepeatableDelete($(form));
        }

        self.registerFilePondPlugins = function () {
            FilePond.registerPlugin(FilePondPluginImagePreview);
            FilePond.registerPlugin(FilePondPluginFileValidateSize);
            FilePond.registerPlugin(FilePondPluginFileValidateType);
            FilePond.registerPlugin(FilePondPluginFilePoster);
            FilePond.registerPlugin(FilePondPluginImageExifOrientation);
        };

    }
});

// characters counters ------------------------------

function initCharsLeftInfo(target, contentDiv, minLen, maxLen, isHTML) {

    if (!contentDiv) {
        return;
    }

    var msg = {
        min: contentDiv.querySelector('div.min'),
        max: contentDiv.querySelector('div.max')
    };
    var span = {
        min: msg.min.querySelector('span'),
        max: msg.max.querySelector('span')
    };

    updateCharsLeftInfo(isHTML);

    target.addEventListener('focus', function (event) {
        contentDiv.className += ' visible';
    });

    target.addEventListener('blur', function (event) {
        contentDiv.className = contentDiv.className.replace(' visible', '');
    });

    target.addEventListener('keyup', function () {
        updateCharsLeftInfo(isHTML);
    });

    if (isHTML) {
        target.addEventListener('change', function () {
            updateCharsLeftInfo(isHTML);
        });
    }

    function updateCharsLeftInfo(isHTML) {
        var value = target.value || '';
        value = value.trim();

        if (isHTML) { // strip html
            var tmp = document.createElement("DIV");
            tmp.innerHTML = value;
            value = tmp.textContent || tmp.innerText || "";
        }

        var num_newlines = value.split(/\r\n|\r|\n/).length - 1;
        var len = value.length + num_newlines;

        var enable = len < minLen ? 'min' : 'max';
        var disable = enable == 'max' ? 'min' : 'max';
        var ok = enable == 'max' ? len < maxLen : len > minLen;
        var chars = len < minLen ?
            minLen - len :
            maxLen - len;

        msg[enable].className = enable + ' ' + (ok ? 'ok' : 'error') + ' visible';
        msg[disable].className = disable;
        span[enable].innerHTML = chars;
    }

}


function initUploadField(resourceForm) {
    var $resourceForm = $(resourceForm);
    // Init form validation
    var $fieldsetElement = $resourceForm.find('.filepondFieldset');

    console.log('fieldsetElement', $fieldsetElement, $fieldsetElement.length)

    if ($fieldsetElement && $fieldsetElement.length > 0) {
        console.log('fieldsetElement start', $fieldsetElement)

        $fieldsetElement.each(function(i) {
            console.log('fieldsetElement 2222')

            var $el = $(this);
            console.log('$el.siblings 122', $el.closest('.image-upload-container').find('.image-input'));
            console.log('$el.siblings 222', $el.closest('.image-upload-container'));
            console.log('$el.siblings333', $el);

            var $input = $el.closest('.image-upload-container').find('.image-input');

            var image = $input.val();

            var uploadedFiles = image ? [{
                source: {"url":image},
                options : {
                    type: 'local',
                    // mock file information
                    file: {
                        name: image,
                        //		 size: 3001025,
                        //	 type: 'image/png'
                    },
                    metadata: {
                        poster: image,
                    }
                }
            }] : [];

            var filePondSettings = {
                // set allowed file types with mime types
                acceptedFileTypes: ['image/*'],
                allowFileSizeValidation: true,
                maxFileSize: '8mb',
                name: 'image', // $(this).attr('data-name'),
                maxFiles: 5,
                allowBrowse: true,
                files: uploadedFiles, //Fixme: remove this global var?
                server: {
                    process: {
                        url: '/image',
                        method: 'POST',
                        withCredentials: false,
                        headers: {},
                        timeout: 7000,
                        onload: function(response){
                            response = response ? JSON.parse(response) : {};
                            console.log('$input$input', $input);

                            $input.val(response.url);
                        },
                       // onerror: null,
                      //  ondata: null,
                    },
                    fetch: '/fetch-image?img=',
                    revert: null
                },
                labelIdle: "Sleep afbeelding(en) naar deze plek of <span class='filepond--label-action'>klik hier</span>",
                labelInvalidField: "Field contains invalid files",
                labelFileWaitingForSize: "Wachtend op grootte",
                labelFileSizeNotAvailable: "Grootte niet beschikbaar",
                labelFileCountSingular: "Bestand in lijst",
                labelFileCountPlural: "Bestanden in lijst",
                labelFileLoading: "Laden",
                labelFileAdded: "Toegevoegd", // assistive only
                labelFileLoadError: "Fout bij het uploaden",
                labelFileRemoved: "Verwijderd", // assistive only
                labelFileRemoveError: "Fout bij het verwijderen",
                labelFileProcessing: "Laden",
                labelFileProcessingComplete: "Afbeelding geladen",
                labelFileProcessingAborted: "Upload cancelled",
                labelFileProcessingError: "Error during upload",
                labelFileProcessingRevertError: "Error during revert",
                labelTapToCancel: "tap to cancel",
                labelTapToRetry: "tap to retry",
                labelTapToUndo: "tap to undo",
                labelButtonRemoveItem: "Verwijderen",
                labelButtonAbortItemLoad: "Abort",
                labelButtonRetryItemLoad: "Retry",
                labelButtonAbortItemProcessing: "Verwijder",
                labelButtonUndoItemProcessing: "Undo",
                labelButtonRetryItemProcessing: "Retry",
                labelButtonProcessItem: "Upload"
            };

            var pond = FilePond.create($(this).get(0), filePondSettings);

            var sortableInstance;

            var pondEl = $resourceForm.find('.filepond--root')[i];


            pondEl.addEventListener('FilePond:processfile', function (e) {
            //    validator.element($('input[name=validateImages]'))
            });

            pondEl.addEventListener('FilePond:removefile', function (e) {
                //    validator.element($('input[name=validateImages]'))
                $input.val('');
            });

        });
/*
        // check if files are being uploaded
        $.validator.addMethod("validateFilePondProcessing", function (val, el, param) {
            var files = pond ? pond.getFiles() : [];
            var pondFileStates = FilePond.FileStatus;

            var processingFiles = files.filter(function (file) {
                return file.status !== pondFileStates.PROCESSING_COMPLETE;
            });

            return processingFiles.length === 0;
        }, "Plaatjes zijn nog aan het uploaden.");

        $.validator.addMethod("validateFilePond", function (val, el, param) {
            if ($resourceForm.find('.filepond').prop('required')) {
                var files = pond ? pond.getFiles() : [];
                var pondFileStates = FilePond.FileStatus;

                files = files.filter(function (file) {
                    return file.status === pondFileStates.PROCESSING_COMPLETE;
                });

                return files && files.length > 0;
            } else {
                return true;
            }

        }, "Eén of meerdere plaatjes zijn verplicht.");

 */
    }

}

function bindResourceFormValidation(resourceForm) {
    var ideaForm = $(resourceForm);



    //todo fix
    $.validator.addMethod("minLengthWithoutHTML", function (val, el, params) {
        var mainEditor = document.getElementById('js-editor');
        var lengthOfChars = stripHTML(mainEditor.innerHTML).length;
        return lengthOfChars >= params;
    }, "Minimaal {0} tekens.");


    console.log(' $(resourceForm)',  $(resourceForm))

    var validator = $(resourceForm).validate({
        ignore: '',
        rules: {
            ignore: [],
            //      location: {
            //        required: true
            //      },
            title: {
                required: true,
                minlength: titleMinLength,
                maxlength: titleMaxLength,
            },
            summary: {
                minlength: summaryMinLength,
                maxlength: summaryMaxLength,
            },
            description: {
                required: true,
                minlength: descriptionMinLength,
                maxlength: descriptionMaxLength,
            },
           /* validateImages: {
                validateFilePond: true,
                validateFilePondProcessing: true
            },*/
            /*    description: {
                  minLengthWithoutHTML: 140
                }*/
        },
        submitHandler: function (form) {
            var buttonText = $(form).find('input[type="submit"]').val();

            $(form).find('input[type="submit"]').val(buttonText + '...');

            $(form).find('input[type="submit"]').attr('disabled', true);

            $(form).addClass('submitting');
            $(form).removeClass('success-submit');
            $(form).removeClass('error-submit');

            if (window.recaptchaKey) {
                console.log('grecaptcha validation')
                grecaptcha.ready(function() {
                    grecaptcha.execute(window.recaptchaKey, {action: 'submit'}).then(function (token) {
                        $(form).find('input[name="recaptcha"]').val(token);
                        submitForm(form);
                    });
                });

            } else {
                console.log(' no grecaptcha validation')

                submitForm(form);
            }

            function submitForm(form) {
                $.ajax({
                    url: $(form).attr('action'),
                    //  context: document.body,
                    type: 'POST',
                    data: $(form).serialize(),
                    dataType: 'json',
                    success: function (response) {
                        console.log('->>>>', response);

                        var redirectUrl = response.redirectUrl ? response.redirectUrl : false;

                        $(form).removeClass('submitting');
                        $(form).addClass('success-submit');

                        var submittingFormCount = $('.resource-form.submitting').length;
                        var submittingErrorCount = $('.resource-form.error-submit').length;

                        // if not edit form, turn it into an edit form by adding the ID
                        // This way the resource can be created and then edited
                        if (response && $(form).find('input[name="resourceId"]').length === 0) {
                            var resourceIdInput = '<input type="hidden" name="resourceId" value="' + response.id + '">';
                            var putInput = '<input type="hidden" name="_method" value="PUT">';
                            $(form).append(resourceIdInput + putInput);
                            var inputLabel = $(form).find('input[type="submit"]').val()
                            $(form).find('input[type="submit"]').val(inputLabel.replace("...", ""));
                            $(form).find('input[type="submit"]').attr('disabled', false);
                        }

                        if (submittingFormCount === 0 && submittingErrorCount === 0) {

                            var redirect = $(form).find('.form-redirect-uri').val();
                            redirect = redirect.replace(':id', response.id);

                            redirectUrl = redirectUrl ? redirectUrl : redirect;
                            //use href to simulate a link click! Not replace, that doesn't allow for back button to work
                            window.location.href = (redirectUrl);
                        }
                    },
                    error: function (response) {
                        console.log('->>>> eerr', response);

                        $(form).removeClass('submitting');
                        $(form).addClass('error-submit');

                        if (response.status === 401) {
                            $(form).find('.login-message').show();
                        } else {
                            // "this" the object you passed
                            alert(response.responseJSON.msg);  
                        }

                        $(form).find('input[type="submit"]').val('Opslaan');
                        $(form).find('input[type="submit"]').attr('disabled', false);
                    },

                });
            }

            return false;
        },
        errorPlacement: function (error, element) {
            if (element.attr("type") === "radio" || element.attr("type") === "checkbox") {
                var elementContainer = $(element).closest('.form-field-container')
                error.insertAfter(elementContainer);
            } else {
                error.insertAfter(element);
            }
        },
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids()) {
                return;
            }

            var $firstErrorEl = $(validator.errorList[0].element).closest('.form-group');
            if ($firstErrorEl.length > 0) {
                var scrollOffset = parseInt($firstErrorEl.offset().top, 10);
                scrollOffset = scrollOffset;// - 1200;

                $('html, body').scrollTop(scrollOffset);
            }

        }
    });

    $('#locationField').on('change', function () {
        validator.element($(this))
    });
}

window.addEventListener('load', function () {

    // title
    var textarea = document.querySelector('textarea[name="title"]') || document.querySelector('input[name="title"]');
    var charsLeft = document.querySelector('#charsLeftTitle');
    if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, titleMinLength, titleMaxLength);

    // summary
    var textarea = document.querySelector('textarea[name="summary"]') || document.querySelector('input[name="summary"]');
    var charsLeft = document.querySelector('#charsLeftSummary');
    if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, summaryMinLength, summaryMaxLength);

    // description
    var textarea = document.querySelector('textarea[name="description"]') || document.querySelector('#js-editor');
    var charsLeft = document.querySelector('#charsLeftDescription');
    if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, descriptionMinLength, descriptionMaxLength, true);

    // add dynamic fields if exist
    $('.chars-counter').each(function () {
        var $inputEl = $(this);
        var minChar = $inputEl.attr('minlength');
        var maxChar = $inputEl.attr('maxlength');
        var $charsLeft = $inputEl.siblings('.charsLeft');

        initCharsLeftInfo($inputEl.get(0), $charsLeft.get(0), minChar, maxChar, true);
    })

    var $inputsAndSelects = $('#formulier-block input, #formulier-block select');

    if ($inputsAndSelects && $inputsAndSelects.length) {

        $inputsAndSelects.on('keydown', function (e) {
            if (e.key === "Enter") {
                var $nextGroup = $(this).closest('div').next('div');

                e.preventDefault();

                if ($nextGroup) {
                    $nextGroup.find('input,select,textarea').first().focus();
                    return false;
                } else {
                    return $(this).closest('form').submit();
                }
            }
        })

    }

});
