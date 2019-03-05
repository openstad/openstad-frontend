// Idea form extensions
// --------------------
       // Used by poster file upload and description editor to register
// a reference to each uploaded file. This reference list is used
// by the server to connect the correct image uploads to this idea.
 var form = document.getElementById('js-form');
form.addAttachmentRef = function( key ) {
  var input   = document.createElement('input');
  input.type  = 'hidden';
  input.name  = 'images[]';
  input.value = key;
  this.appendChild(input);
};
form.clearAttachmentRef = function() {
  var images = Array.prototype.slice.call(
    form.querySelectorAll('input[name="images[]"]'), 0
  );
  images.forEach(function( image ) {
    this.removeChild(image);
  }, this);
};
form.addEventListener('submit', function( event ) {

  var uploadForm = document.getElementById('posterImageUpload');
  if( !uploadForm ) return;

  if( uploadForm.classList.contains('uploading') ) {
    event.stopPropagation();
    event.preventDefault();
    alert(
      'De afbeelding upload is nog niet afgerond.\n\n'+
      'Hierdoor kan uw idee nog niet opgeslagen worden.'
    );
  }

  // extra data
  var extraData = {
    gebied: document.getElementById('gebied').value,
    thema: document.getElementById('thema').value,
  }
  document.getElementById('extraData').value = JSON.stringify(extraData);

});


var currentImage;
var form        = document.getElementById('js-form');
var el          = document.getElementById('posterImageUpload');
var button      = el.querySelector('button');
var progressBar = el.querySelector('#posterImageUpload .progress .bar');

button.addEventListener('click', function() {
  upload.removeFile(currentImage || {});
});

var upload = new Dropzone(el, {
  maxFiles             : 1,
  uploadMultiple       : false,

  maxFilesize          : 10,
  maxThumbnailFilesize : 10,
  thumbnailWidth       : 1800,
  thumbnailHeight      : null,

  addedfile: function( file ) {
    this.removeFile(currentImage || {});
    currentImage = file;

    el.classList.add('uploading');
    progressBar.style.width = 0;

    file.key = Date.now()+'-'+file.name;
    this.options.params['key'] = file.key;
  },
  removedfile: function( file ) {
    el.removeAttribute('style');
    el.classList.remove('uploading');
    form.clearAttachmentRef();
  },

  thumbnail: function( file, dataURL ) {
    el.setAttribute('style', 'background-image: url('+dataURL+')');
  },
  sending: function() {
    button.innerHTML = 'Annuleer upload';
  },
  uploadprogress: function( file, progress, bytesSent ) {
    progressBar.style.width = progress+'%';
  },

  success: function( file ) {
    el.classList.remove('uploading');
    form.addAttachmentRef(file.key);
    button.innerHTML = 'Verwijder afbeelding';
  },
  error: function( file, error ) {
    button.innerHTML = 'Verwijder afbeelding';
    this.removeFile(file);
    if( typeof error != 'string' ) {
      alert(error.message);
    }
  }
});


// Summary
// -------
var maxLen    = 140;
var textarea  = document.querySelector('textarea[name="summary"]');
var charsLeft = document.querySelector('#charsLeft span');

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


// Main editor
// -----------
       var minLen = 140;
var charsLeftMain = document.querySelector('#charsLeftMain span');

setTimeout(function () {

  initAttachmentManager(
    document.getElementById('js-form'),
    document.getElementById('js-editor').editor
  );
  var mainEditor  = document.getElementById('js-editor');
  document.querySelector('#charsLeftMain').style.marginTop = '-20px';

  mainEditor.addEventListener('keyup', updateCharsLeftMain);

  function updateCharsLeftMain() {
    let length = minLen - mainEditor.innerHTML.length

    if (length <= 0) {
      document.querySelector('#charsLeftMain').style.display = 'none';
    } else {
      document.querySelector('#charsLeftMain').style.display = 'block';
      document.querySelector('#charsLeftMain span').innerHTML = length;
    }
  }

  updateCharsLeftMain();

} , 1000);
