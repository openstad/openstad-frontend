// Idea form extensions
// --------------------
// Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.

apos.define('resource-form-widgets', {
  extend: 'map-widgets',
  construct: function (self, options) {
    self.playAfterlibsLoaded = function ($widget, data, options) {
      var fieldsetElements = $widget.find('.filepondFieldset');
      var pondEl = null;
      var pond = null;
      var sortableInstance;
      var formHasChanged = false;
      var documentPond = null;

      if (fieldsetElements) {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateSize);
        FilePond.registerPlugin(FilePondPluginFileValidateType);
        FilePond.registerPlugin(FilePondPluginFilePoster);
        FilePond.registerPlugin(FilePondPluginImageExifOrientation);

        var filePondSettings = function (options) {
          return Object.assign(
            {},
            {
              // set allowed file types with mime types
              acceptedFileTypes: ['image/*'],
              allowFileSizeValidation: true,
              maxFileSize: '8mb',
              name: 'image',
              maxFiles: 5,
              allowBrowse: true,
              files: uploadedFiles,
              server: {
                process: window.siteUrl + '/image',
                fetch: window.siteUrl + '/fetch-image?img=',
                revert: null,
              },
              labelIdle:
                "Sleep afbeelding(en) naar deze plek of <span class='filepond--label-action'>klik hier</span>",
              labelInvalidField: 'Field contains invalid files',
              labelFileWaitingForSize: 'Wachtend op grootte',
              labelFileSizeNotAvailable: 'Grootte niet beschikbaar',
              labelFileCountSingular: 'Bestand in lijst',
              labelFileCountPlural: 'Bestanden in lijst',
              labelFileLoading: 'Laden',
              labelFileAdded: 'Toegevoegd', // assistive only
              labelFileLoadError: 'Fout bij het uploaden',
              labelFileRemoved: 'Verwijderd', // assistive only
              labelFileRemoveError: 'Fout bij het verwijderen',
              labelFileProcessing: 'Laden',
              labelFileProcessingComplete: 'Afbeelding geladen',
              labelFileProcessingAborted: 'Upload cancelled',
              labelFileProcessingError: 'Error during upload',
              labelFileProcessingRevertError: 'Error during revert',
              labelTapToCancel: 'tap to cancel',
              labelTapToRetry: 'tap to retry',
              labelTapToUndo: 'tap to undo',
              labelButtonRemoveItem: 'Verwijderen',
              labelButtonAbortItemLoad: 'Abort',
              labelButtonRetryItemLoad: 'Retry',
              labelButtonAbortItemProcessing: 'Verwijder',
              labelButtonUndoItemProcessing: 'Undo',
              labelButtonRetryItemProcessing: 'Retry',
              labelButtonProcessItem: 'Upload',
            },
            options || {}
          );
        };

        for (var i = 0; i < fieldsetElements.length; i++) {
          var fieldsetElement = fieldsetElements[i];

          if (fieldsetElement.classList.contains('docs')) {
            documentPond = FilePond.create(
              fieldsetElement,
              filePondSettings({
                name: 'begrotingen',
                files: [],
                acceptedFileTypes: [
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-excel',
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  '.docx',
                  '.doc',
                  'application/vnd.ms-powerpoint',
                  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                  '.ppt',
                  '.pptx',
                ],
                server: undefined,
                labelIdle:
                  "Sleep bestanden naar deze plek of <span class='filepond--label-action'>klik hier</span>",
                labelFileProcessingComplete: 'Begrotingen geladen',
              })
            );
          } else {
            pond = FilePond.create(fieldsetElement, filePondSettings());
          }
          pondEl = $widget.find('.filepond--root')[0];
        }
      }

      var ideaForm = $widget.find('#js-form')[0];
      if (ideaForm && pondEl) {
        // check if files are being uploaded
        $.validator.addMethod(
          'validateFilePondProcessing',
          function () {
            var files = pond ? pond.getFiles() : [];
            var pondFileStates = FilePond.FileStatus;

            var processingFiles = files.filter(function (file) {
              return file.status !== pondFileStates.PROCESSING_COMPLETE;
            });

            return processingFiles.length === 0;
          },
          'Plaatjes zijn nog aan het uploaden.'
        );

        $.validator.addMethod(
          'validateDocFilePondProcessing',
          function () {
            var files = documentPond ? documentPond.getFiles() : [];
            var docPondFileStates = FilePond.FileStatus;

            var processingDocFiles = files.filter(function (file) {
              return file.status !== docPondFileStates.PROCESSING_COMPLETE;
            });

            return processingDocFiles.length === 0;
          },
          'Begrotingen zijn nog aan het uploaden.'
        );

        $.validator.addMethod(
          'minLengthWithoutHTML',
          function (val, el, params) {
            var mainEditor = document.getElementById('js-editor');
            var lengthOfChars = stripHTML(mainEditor.innerHTML).length;
            return lengthOfChars >= params;
          },
          'Minimaal {0} tekens.'
        );

        pondEl.addEventListener('FilePond:addfile', function (e) {
          if (sortableInstance) {
            $('ul.filepond--list').sortable('refresh');
          } else {
            sortableInstance = true;
            $('ul.filepond--list').sortable();
          }

          //  validator.element($('input[name=validateImages]'))
        });

        pondEl.addEventListener('FilePond:processfile', function (e) {
          validator.element($('input[name=validateImages]'));
        });
      }

      $.validator.addMethod(
        'postcodeNL',
        function (value, element, val) {
          var rege = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
          return !value || rege.test(value);
        },
        'Postcode niet correct'
      );

      if (ideaForm) {
        initLeavePageWarningForForm();

        const conditionalRequired = function (element) {
          const publishAsConceptInput = $('#publishAsConcept');
          const shouldBeSavedAsConcept = publishAsConceptInput
            ? publishAsConceptInput.val()
            : false;
          return shouldBeSavedAsConcept
            ? false
            : element.hasAttribute('required');
        };

        const conditionalLength = function (element, lengthField, lengthValue) {
          const publishAsConceptInput = $('#publishAsConcept');
          const shouldBeSavedAsConcept =
            publishAsConceptInput && publishAsConceptInput.val();
          const hasLength =
            element.hasAttribute(lengthField) &&
            element.getAttribute(lengthField);
          return shouldBeSavedAsConcept
            ? 0
            : hasLength
            ? element.getAttribute(lengthField)
            : lengthValue;
        };

        // Default set of rules
        var rules = {
          ignore: [],

          title: {
            required: true,
            minlength: titleMinLength,
            maxlength: titleMaxLength,
          },
          summary: {
            minlength: function (element) {
              return conditionalLength(element, 'minlength', summaryMinLength);
            },
            maxlength: summaryMaxLength,
          },
          description: {
            minlength: function (element) {
              return conditionalLength(
                element,
                'minlength',
                descriptionMinLength
              );
            },
            maxlength: descriptionMaxLength,
          },
          validateImages: {
            validateFilePond: true,
            validateFilePondProcessing: true,
          },
          validateBudgetDocs: {
            validateDocFilePond: true,
            validateDocFilePondProcessing: true,
          },
          firstName: {
            required: true,
          },
          lastName: {
            required: true,
          },
          postcode: {
            required: false,
            minlength: 1, // <- here
            postcodeNL: true,
          },
          'extraData[phone]': {
            minlength: function (element) {
              return conditionalLength(element, 'minlength', 10);
            },
          },
        };

        // Get all required fields in the form and make them concept aware - skipping title because that one is always required
        const form = document.querySelector('#formulier-block form');
        var requiredInputs = Array.from(
          form ? form.querySelectorAll(':scope *[required]') : []
        ).filter(function (i) {
          return i.name !== 'title';
        });

        const fieldsMadeConceptAware = requiredInputs.reduce(function (
          obj,
          item
        ) {
          return Object.assign({}, obj, {
            [item.name]: { required: conditionalRequired },
          });
        },
        {});

        for (const [name, rule] of Object.entries(rules)) {
          if (fieldsMadeConceptAware[name]) {
            fieldsMadeConceptAware[name] = Object.assign(
              rule,
              fieldsMadeConceptAware[name]
            );
          }
        }
        rules = Object.assign(rules, fieldsMadeConceptAware);

        var validator = $(ideaForm).validate({
          ignore: '',
          rules: rules,

          submitHandler: function (form) {
            const publishField = $('#publishAsConcept');
            const oldButtonValues = [];

            $widget.find('input[type="submit"]').each(function (index, button) {
              oldButtonValues.push($(this).val());
              if (button.id === 'btnSaveAsConcept' && publishField.val()) {
                $(this).val('Verzenden...');
              } else if (!publishField.val()) {
                $(this).val('Verzenden...');
              }
              $(this).attr('disabled', 'true');
            });

            const formdata = new FormData(form);
            const pondFiles = documentPond ? documentPond.getFiles() : [];
            for (var i = 0; i < pondFiles.length; i++) {
              formdata.append('docFilePond', pondFiles[i].file);
            }

            $.ajax({
              url: $(form).attr('action'),
              type: 'POST',
              data: formdata,
              processData: false,
              contentType: false,
              success: function (response) {
                formHasChanged = false;
                var redirect = $(form).find('.form-redirect-uri').val();

                // for some reason when you select the dynamic form then the input field with class .form-redirect-uri is not within the form
                if (!redirect) {
                  redirect = $widget.find('.form-redirect-uri')[0].value;
                }

                redirect = redirect.replace(':id', response.id);
                redirect = window.siteUrl + redirect;

                // in case its the same page a reload is necessary
                // otherwise when there hashtags used the page wont be reloaded
                if (redirect === window.location.href) {
                  window.location.reload();
                } else {
                  window.location.href = redirect;
                }

                //use href to simulate a link click! Not replace, that doesn't allow for back button to work
              },
              error: function (response) {
                // "this" the object you passed
                $widget
                  .find('input[type="submit"]')
                  .each(function (index, button) {
                    $(this).val(oldButtonValues[index]);
                  });
                alert(response.responseJSON.msg);
                $widget.find('input[type="submit"]').attr('disabled', false);
              },
            });
            return false;
            //form.submit();
          },
          errorPlacement: function (error, element) {
            if (
              element.attr('type') === 'radio' ||
              element.attr('type') === 'checkbox'
            ) {
              var elementContainer = $(element).closest(
                '.form-field-container'
              );
              error.insertAfter(elementContainer);
            } else {
              error.insertAfter(element);
            }
          },
          invalidHandler: function (form, validator) {
            if (!validator.numberOfInvalids()) {
              return;
            }

            var $firstErrorEl = $(validator.errorList[0].element).closest(
              '.form-group'
            );
            if ($firstErrorEl.length > 0) {
              var scrollOffset = parseInt($firstErrorEl.offset().top, 10);
              scrollOffset = scrollOffset; // - 1200;

              $('html, body').scrollTop(scrollOffset);
            }
          },
        });

        $.validator.addMethod(
          'validateFilePond',
          function () {
            if ($('.filepond').prop('required')) {
              var files = pond ? pond.getFiles() : [];
              var pondFileStates = FilePond.FileStatus;

              files = files.filter(function (file) {
                return file.status === pondFileStates.PROCESSING_COMPLETE;
              });

              return files && files.length > 0;
            } else {
              return true;
            }
          },
          'Eén of meerdere plaatjes zijn verplicht.'
        );

        $.validator.addMethod(
          'validateDocFilePond',
          function () {
            if ($('.docFilePond').prop('required')) {
              var files = documentPond ? documentPond.getFiles() : [];
              var pondFileStates = FilePond.FileStatus;

              files = files.filter(function (file) {
                return file.status === pondFileStates.PROCESSING_COMPLETE;
              });

              return files && files.length > 0;
            } else {
              return true;
            }
          },
          'Eén of meerdere begrotingen zijn verplicht.'
        );

        $('#locationField').on('change', function () {
          validator.element($(this));
        });
      }

      function initLeavePageWarningForForm() {
        if ($('.add-warning-when-leaving-page').length > 0) {
          $(document).on(
            'change',
            'form.add-warning-when-leaving-page input, form.add-warning-when-leaving-page select, form.add-warning-when-leaving-page textarea',
            function (e) {
              formHasChanged = true;
            }
          );

          $(window).on('beforeunload', function (e) {
            if (formHasChanged) {
              var message =
                  'Weet u zeker dat u de pagina wilt verlaten? (Het formulier wordt dan geleegd)',
                e = e || window.event;
              if (e) {
                e.returnValue = message;
              }
              return message;
            } else {
            }
          });
        }
      }

      // Load the map
      var mapConfig =
        typeof resourceMapConfig !== 'undefined' && resourceMapConfig
          ? resourceMapConfig
          : data.mapConfig;

      if (mapConfig) {
        self.createMap(mapConfig);
        self.addPolygon(mapConfig);
        self.setIdeaMarker(mapConfig);
        self.addFormEventListeners(mapConfig);
        self.center();
      }
    };
  },
});

// Global
function deleteBudgetDocument(name, date, id, siteUrl) {
  $.ajax({
    url: siteUrl + '/modules/resource-form-widgets/budget',
    type: 'PUT',
    data: { name: name, date: date, id: id },
    success: function (data) {
      location.reload();
    },
    error: function (e) {
      alert(e.responseJSON.msg);
    },
  });
}

// characters counters ------------------------------

function initCharsLeftInfo(target, contentDiv, minLen, maxLen, isHTML) {
  if (!contentDiv) {
    return;
  }

  var msg = {
    min: contentDiv.querySelector('div.min'),
    max: contentDiv.querySelector('div.max'),
  };
  var span = {
    min: msg.min.querySelector('span'),
    max: msg.max.querySelector('span'),
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

    if (isHTML) {
      // strip html
      var tmp = document.createElement('DIV');
      tmp.innerHTML = value;
      value = tmp.textContent || tmp.innerText || '';
    }

    var match = value.match(/\r\n|\r|\n/);
    var num_newlines = match ? match.length : 0;
    var len = value.length + num_newlines;

    var enable = len < minLen ? 'min' : 'max';
    var disable = enable == 'max' ? 'min' : 'max';
    var ok = enable == 'max' ? len < maxLen : len > minLen;
    var chars = len < minLen ? minLen - len : maxLen - len;

    msg[enable].className = enable + ' ' + (ok ? 'ok' : 'error') + ' visible';
    msg[disable].className = disable;

    msg[enable].setAttribute('aria-live', 'polite');
    msg[disable].removeAttribute('aria-live');

    var innerHTML = msg[enable].innerHTML;

    var output = innerHTML.replace('<span>', '').replace('</span>', '');
    output = output.replace(/nog -?\d* tekens/g, 'nog ' + chars + ' tekens');
    output = output.replace(
      /minimaal \d* tekens/g,
      'minimaal ' + chars + ' tekens'
    );

    msg[enable].innerHTML = '';
    msg[enable].innerHTML = output;
  }
}

window.addEventListener('load', function () {
  // title
  var textarea =
    document.querySelector('textarea[name="title"]') ||
    document.querySelector('input[name="title"]');
  var charsLeft = document.querySelector('#charsLeftTitle');
  if (textarea && charsLeft)
    initCharsLeftInfo(textarea, charsLeft, titleMinLength, titleMaxLength);

  // summary
  var textarea =
    document.querySelector('textarea[name="summary"]') ||
    document.querySelector('input[name="summary"]');
  var charsLeft = document.querySelector('#charsLeftSummary');
  if (textarea && charsLeft)
    initCharsLeftInfo(textarea, charsLeft, summaryMinLength, summaryMaxLength);

  // description
  var textarea =
    document.querySelector('textarea[name="description"]') ||
    document.querySelector('#js-editor');
  var charsLeft = document.querySelector('#charsLeftDescription');
  if (textarea && charsLeft)
    initCharsLeftInfo(
      textarea,
      charsLeft,
      descriptionMinLength,
      descriptionMaxLength,
      true
    );

  // add dynamic fields if exist
  $('.chars-counter').each(function () {
    var $inputEl = $(this);
    var minChar = $inputEl.attr('minlength');
    var maxChar = $inputEl.attr('maxlength');
    var $charsLeft = $inputEl.siblings('.charsLeft');

    initCharsLeftInfo(
      $inputEl.get(0),
      $charsLeft.get(0),
      minChar,
      maxChar,
      true
    );
  });

  var $inputsAndSelects = $('#formulier-block input, #formulier-block select');

  if ($inputsAndSelects && $inputsAndSelects.length) {
    $inputsAndSelects.on('keydown', function (e) {
      if (e.key === 'Enter') {
        var $nextGroup = $(this).closest('div').next('div');

        e.preventDefault();

        if ($nextGroup) {
          $nextGroup.find('input,select,textarea').first().focus();
          return false;
        } else {
          return $(this).closest('form').submit();
        }
      }
    });
  }
});

// einde characters counters ------------------------------
