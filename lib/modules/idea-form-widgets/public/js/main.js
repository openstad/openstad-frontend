// Idea form extensions
// --------------------
       // Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.

if (!!editorInputElement) {
  var map = new OpenStadMap(
    openstadMapMarkerstyles,
    openstadMapPolygon,
    editorInputElement,
    editorMarker
  );

  map.createMap(openstadMapDefaults, selectedMarkers, openstadPolygons);
}

var fieldsetElement = document.querySelector('.filepondFieldset');


if (fieldsetElement) {
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginFileValidateSize);
  FilePond.registerPlugin(FilePondPluginFileValidateType);
  FilePond.registerPlugin(FilePondPluginFilePoster);

  FilePond.setOptions({
    server: '/image'
  });

  var filePondSettings = {
    // set allowed file types with mime types
    acceptedFileTypes: ['image/*'],
    allowFileSizeValidation: true,
    maxFileSize: '2mb',
    name: 'image',
    maxFiles: 10,
    allowBrowse: true,
    files: ideaFiles,
    server: {
      process: '/image',
      fetch: '/fetch-image?img='
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
  }



  var pond = FilePond.create(fieldsetElement, filePondSettings);

  var sortableInstance;

  var pondEl = document.querySelector('.filepond--root');
}

$(document).ready(function () {
  var ideaForm = document.getElementById('js-form');


/*  if (ideaFiles) {
    ideaFiles.forEach(function (file) {
      console.log('file', file);
      pond.addFile(file).then(function(file){
          console.log('file added', file);
      });
    })
  }*/


  if (ideaForm) {
    $.validator.addMethod("validateFilePond", function() {
      var files = pond ? pond.getFiles() : [];
      var pondFileStates =  FilePond.FileStatus;

      files = files.filter(function (file) {
        return file.status === pondFileStates.PROCESSING_COMPLETE;
      });

      return files && files.length > 0;
    }, "Eén of meerdere plaatjes zijn verplicht.");

    $.validator.addMethod("minLengthWithoutHTML", function(val, el, params) {
      var mainEditor  = document.getElementById('js-editor');
      var lengthOfChars = stripHTML(mainEditor.innerHTML).length;
      console.log('lengthOfChars', lengthOfChars)
      console.log('length', params)

      return lengthOfChars >= params;
    }, "Minimaal {0} tekens.");




    /*$.validator.addClassRules('filepond', {
      validateFilePond: true,
    });*/

    var validator = $(ideaForm).validate({
      ignore: '',
      rules: {
        ignore: [],
  //      location: {
  //        required: true
  //      },
        description : {
          required: true,
          minlength: 140
        },
        validateImages: {
          validateFilePond: true
        },
        description: {
          minLengthWithoutHTML: 140
        }
      },
      submitHandler: function(form) {
        $(form).find('button[type="submit"]').text('Verzenden...');
        $(form).find('button[type="submit"]').attr('disabled', true);
        form.submit();
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element);
        //  if (element.attr("type") === "radio" || element.attr("type") === "checkbox") {
        //     error.insertAfter($(element).closest('.input-group'));
        //   } else {
        //     error.insertAfter(element);
        //   }
      },
    });

    pondEl.addEventListener('FilePond:addfile', function(e) {
        if (sortableInstance) {
          $("ul.filepond--list").sortable('refresh');
        } else {
          sortableInstance = true;
          $("ul.filepond--list").sortable();
        }

      //  validator.element($('input[name=validateImages]'))
    });

    pondEl.addEventListener('FilePond:processfile', function(e) {
      validator.element($('input[name=validateImages]'))
    });


    $('#locationField').on('change', function () {
      validator.element($(this))
    });
  }
});


// Summary
// -------
var maxLen    = 140;
var textarea  = document.querySelector('textarea[name="summary"]');
var charsLeft = document.querySelector('#charsLeft span');

if (textarea && charsLeft) {
  updateCharsLeft();
  textarea.addEventListener('keydown', function( event ) {
    var len = textarea.value.length;
    var key = event.key.toLowerCase();

    // Prevent input when maximum is reached.
      if( len == maxLen ) {
        switch( key ) {
          case 'delete': case 'backspace':
          case 'arrowdown': case 'arrowup':
          case 'arrowleft': case 'arrowright':
            return;
          default:
            event.preventDefault();
        }
      }
  });
  textarea.addEventListener('keyup', updateCharsLeft);

  function updateCharsLeft() {
    charsLeft.innerHTML = maxLen - textarea.value.length;
    if (maxLen >= textarea.value.length) {
      charsLeft.style.color = '#9A9A9A';
    } else {
      charsLeft.style.color = 'red';
    }
  }

}

// Main editor
// -----------
var minLen = 140;
var charsLeftMain = document.querySelector('#charsLeftMain span');

function stripHTML(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


if (charsLeftMain) {
  setTimeout(function () {

    initAttachmentManager(
      document.getElementById('js-form'),
      document.getElementById('js-editor').editor
    );
    var mainEditor  = document.getElementById('js-editor');
    //document.querySelector('#charsLeftMain').style.marginTop = '-20px';

    mainEditor.addEventListener('keyup', updateCharsLeftMain);

    function updateCharsLeftMain() {
      var length = minLen - mainEditor.innerHTML.length

      length = minLen - stripHTML(mainEditor.innerHTML).length;

      if (length <= 0) {
        document.querySelector('#charsLeftMain').style.display = 'none';
      } else {
        document.querySelector('#charsLeftMain').style.display = 'block';
        document.querySelector('#charsLeftMain span').innerHTML = length;
      }
    }

    updateCharsLeftMain();

  } , 1000);
}








/*

FilePond.parse(document.body, {
  name: 'files',
});
*/
