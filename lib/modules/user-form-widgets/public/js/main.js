function initFilePond() {
    var fieldsetElement = document.querySelector('.filepondUserformFieldset');
    
    if (fieldsetElement) {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateSize);
        FilePond.registerPlugin(FilePondPluginFileValidateType);
        FilePond.registerPlugin(FilePondPluginFilePoster);
        FilePond.registerPlugin(FilePondPluginImageExifOrientation);
        
        var filePondSettings = {
            // set allowed file types with mime types
            acceptedFileTypes:              ['image/*'],
            allowFileSizeValidation:        true,
            maxFileSize:                    '8mb',
            name:                           'image',
            maxFiles:                       5,
            allowBrowse:                    true,
            files:                          [],
            server:                         {
                process: '/image',
                fetch:   '/fetch-image?img=',
                revert:  null
            },
            labelIdle:                      "Sleep afbeelding(en) naar deze plek of <span class='filepond--label-action'>klik hier</span>",
            labelInvalidField:              "Field contains invalid files",
            labelFileWaitingForSize:        "Wachtend op grootte",
            labelFileSizeNotAvailable:      "Grootte niet beschikbaar",
            labelFileCountSingular:         "Bestand in lijst",
            labelFileCountPlural:           "Bestanden in lijst",
            labelFileLoading:               "Laden",
            labelFileAdded:                 "Toegevoegd", // assistive only
            labelFileLoadError:             "Fout bij het uploaden",
            labelFileRemoved:               "Verwijderd", // assistive only
            labelFileRemoveError:           "Fout bij het verwijderen",
            labelFileProcessing:            "Laden",
            labelFileProcessingComplete:    "Afbeelding geladen",
            labelFileProcessingAborted:     "Upload cancelled",
            labelFileProcessingError:       "Error during upload",
            labelFileProcessingRevertError: "Error during revert",
            labelTapToCancel:               "tap to cancel",
            labelTapToRetry:                "tap to retry",
            labelTapToUndo:                 "tap to undo",
            labelButtonRemoveItem:          "Verwijderen",
            labelButtonAbortItemLoad:       "Abort",
            labelButtonRetryItemLoad:       "Retry",
            labelButtonAbortItemProcessing: "Verwijder",
            labelButtonUndoItemProcessing:  "Undo",
            labelButtonRetryItemProcessing: "Retry",
            labelButtonProcessItem:         "Upload",
            labelMaxFileSizeExceeded:       "Afbeelding is te groot, max grootte is 8MB"
        };
        
        
        FilePond.create(fieldsetElement, filePondSettings);
    }
}

window.addEventListener("DOMContentLoaded", initFilePond);

$(document).ready(function () {
    $('.user-form').each(function () {
        
        var rules = {};
        
        $.each(window.userFormValidation, function (k, v) {
            var params = v.split(',');
            
            k = 'data[' + k + ']';
            
            $.each(params, function (i, param) {
                param = param.trim();
    
                if (!rules[k]) {
                    rules[k] = {};
                }
    
                if (param == 'required' || param == 'email' || param == 'url') {
                    rules[k][param] = true;
                } else {
                    var splitParam = param.split(':');
                    rules[k][splitParam[0]] = splitParam[1];
                }
            });
        });
        
        var $form = $(this);
        
        $form.validate({
                           ignore:         '',
                           rules:          rules,
                           submitHandler:  function (form) {
                               $(form).find('input[type="submit"]').val('Versturen...');
                               $(form).find('input[type="submit"]').attr('disabled', true);
                
                               $.ajax({
                                          url:      $(form).attr('action'),
                                          type:     'POST',
                                          data:     $(form).serialize(),
                                          dataType: 'json',
                                          success:  function (response) {
                                              window.location = response.url;
                                          },
                                          error:    function (response) {
                                              window.alert('Er ging iets fout bij het versturen, probeer het alstublieft opnieuw.');
                                              $(form).find('input[type="submit"]').val('Verstuur');
                                              $(form).find('input[type="submit"]').attr('disabled', false);
                                          },
                    
                                      });
                               return false;
                           },
                           errorPlacement: function (error, element) {
                               $(element).closest(".form-group").addClass('error').append(error);
                           },
                           success:        function (label) {
                               $form.find(".form-group").removeClass('error');
                           }
                       });
    });
});
