// Idea form extensions
// --------------------
       // Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.

var fieldsetElement = document.querySelector('.filepondFieldset');


if (fieldsetElement) {
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginFileValidateSize);
  FilePond.registerPlugin(FilePondPluginFileValidateType);
  FilePond.registerPlugin(FilePondPluginFilePoster);
  FilePond.registerPlugin(FilePondPluginImageExifOrientation);

/*FilePond.setOptions({
    server: {
        process: '/image',
        fetch: null,
        revert: null
     }
  });*/

  var filePondSettings = {
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
  }

  var pond = FilePond.create(fieldsetElement, filePondSettings);

  var sortableInstance;

  var pondEl = document.querySelector('.filepond--root');
}

var formHasChanged = false;

$(document).ready(function () {
  var ideaForm = document.getElementById('js-form');


/*  if (ideaFiles) {
    ideaFiles.forEach(function (file) {
      pond.addFile(file).then(function(file){
      });
    })
  }*/


  if (ideaForm && pondEl) {



    // check if files are being uploaded
    $.validator.addMethod("validateFilePondProcessing", function() {
        var files = pond ? pond.getFiles() : [];
        var pondFileStates =  FilePond.FileStatus;

        var processingFiles = files.filter(function (file) {
          return file.status !== pondFileStates.PROCESSING_COMPLETE;
        });

        return processingFiles.length === 0;
    }, "Plaatjes zijn nog aan het uploaden.");



    $.validator.addMethod("minLengthWithoutHTML", function(val, el, params) {
      var mainEditor  = document.getElementById('js-editor');
      var lengthOfChars = stripHTML(mainEditor.innerHTML).length;
      return lengthOfChars >= params;
    }, "Minimaal {0} tekens.");

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
  }

  $.validator.addMethod("postcodeNL", function(value, element, val) {
    var rege = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
    return !value || rege.test(value);
  }, "Postcode niet correct");

  if (ideaForm) {

    initLeavePageWarningForForm();

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
        title : {
          required: true,
          minlength: titleMinLength,
          maxlength: titleMaxLength,
        },
        summary : {
          minlength: summaryMinLength,
          maxlength: summaryMaxLength,
        },
        description : {
          required: true,
          minlength: descriptionMinLength,
          maxlength: descriptionMaxLength,
        },
        validateImages: {
          validateFilePond: true,
          validateFilePondProcessing: true
        },
        firstName: {
          required: true
        },
        lastName: {
          required: true,
        },
        postcode: {
          required: false,
          minlength: 1,  // <- here
          postcodeNL: true
        },
    /*    description: {
          minLengthWithoutHTML: 140
        }*/
      },
      submitHandler: function(form) {



        $(form).find('input[type="submit"]').val('Verzenden...');
        $(form).find('input[type="submit"]').attr('disabled', true);
      //  console.log('X-CSRF-TOKEN');
      //  console.log('asdasdasdasd',$(form).serialize());
        console.log('submitHandler')

       $.ajax({
          url: $(form).attr('action'),
        //  context: document.body,
          type: 'POST',
          data: $(form).serialize(),
          dataType: 'json',
          success:function(response) {
              formHasChanged = false;
              var redirect = $(form).find('.form-redirect-uri').val();
              redirect = redirect.replace(':id', response.id);
              redirect = window.siteUrl + redirect;

              // in case its the same page a reload is necessary
              // otherwise when there hashtags used the page wont be reloaded
              if (redirect ===  window.location.href) {
                window.location.reload();
              } else {
                window.location.href = redirect;
              }

            //use href to simulate a link click! Not replace, that doesn't allow for back button to work
x          },
          error:function(response) {
            console.log('erererre', response)

            // "this" the object you passed
              alert(response.responseJSON.msg);
              $(form).find('input[type="submit"]').val('Opslaan');
              $(form).find('input[type="submit"]').attr('disabled', false);
          },

        });
        return false;
       //form.submit();
      },
      errorPlacement: function(error, element) {
        if (element.attr("type") === "radio" || element.attr("type") === "checkbox") {
          var elementContainer = $(element).closest('.form-field-container')
          error.insertAfter(elementContainer);
        } else {
          error.insertAfter(element);
        }
      },
      invalidHandler: function(form, validator) {

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

    $.validator.addMethod("validateFilePond", function() {
      if ($('.filepond').prop('required')) {
        var files = pond ? pond.getFiles() : [];
        var pondFileStates =  FilePond.FileStatus;

        files = files.filter(function (file) {
          return file.status === pondFileStates.PROCESSING_COMPLETE;
        });

        return files && files.length > 0;
      } else {
        return true;
      }

    }, "Eén of meerdere plaatjes zijn verplicht.");


    $('#locationField').on('change', function () {
      validator.element($(this))
    });
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

	target.addEventListener('focus', function( event ) {
		contentDiv.className += ' visible';
	});

	target.addEventListener('blur', function( event ) {
		contentDiv.className = contentDiv.className.replace(' visible', '');
	});

	target.addEventListener('keyup', function() {
		updateCharsLeftInfo(isHTML);
	});

  if (isHTML) {
	  target.addEventListener('change', function() {
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

    var match = value.match(/\r\n|\r|\n/);
		var num_newlines = match ? match.length : 0;
		var len = value.length + num_newlines;

		var enable  = len < minLen ? 'min' : 'max';
		var disable = enable == 'max' ? 'min' : 'max';
		var ok = enable == 'max' ? len < maxLen : len > minLen;
		var chars   = len < minLen ?
			    minLen - len :
			    maxLen - len;

		msg[enable].className  = enable + ' ' + ( ok ? 'ok' : 'error' ) + ' visible';
		msg[disable].className = disable;

		msg[enable].setAttribute("aria-live", "polite");
		msg[disable].removeAttribute("aria-live");

		var innerHTML = msg[enable].innerHTML;

    var output = innerHTML.replace("<span>", "").replace("</span>", "");
    output = output.replace(/nog -?\d* tekens/g, 'nog ' + chars + ' tekens');
    output = output.replace(/minimaal \d* tekens/g, 'minimaal ' + chars + ' tekens');

    msg[enable].innerHTML = '';
    msg[enable].innerHTML = output;

  }

}

window.addEventListener('load', function() {

	// title
	var textarea  = document.querySelector('textarea[name="title"]') || document.querySelector('input[name="title"]');
	var charsLeft = document.querySelector('#charsLeftTitle');
  if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, titleMinLength, titleMaxLength);

	// summary
	var textarea  = document.querySelector('textarea[name="summary"]') || document.querySelector('input[name="summary"]');
	var charsLeft = document.querySelector('#charsLeftSummary');
	if (textarea && charsLeft) initCharsLeftInfo(textarea, charsLeft, summaryMinLength, summaryMaxLength);

	// description
	var textarea  = document.querySelector('textarea[name="description"]') || document.querySelector('#js-editor');
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

// einde characters counters ------------------------------

function initLeavePageWarningForForm () {
  if ($('.add-warning-when-leaving-page').length > 0) {

    $(document).on('change', 'form.add-warning-when-leaving-page input, form.add-warning-when-leaving-page select, form.add-warning-when-leaving-page textarea', function (e) {
      formHasChanged = true;
    });

    $(document).ready(function () {

      $(window).on('beforeunload', function(e){
        if (formHasChanged) {
          var message = 'Weet u zeker dat u de pagina wilt verlaten? (Het formulier wordt dan geleegd)', e = e || window.event;
          if (e) {  e.returnValue = message; }
          return message;
        } else {
        }
      });


    });
  }
}






/*

FilePond.parse(document.body, {
  name: 'files',
});
*/
