
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
