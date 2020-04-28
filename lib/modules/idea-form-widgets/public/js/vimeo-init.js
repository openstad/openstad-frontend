/**
  * Called when files are dropped on to the drop target or selected by the browse button.
  * For each file, uploads the content to Drive & displays the results when complete.
*/
(function(){


function handleFileSelect(evt) {
  evt.stopPropagation()
  evt.preventDefault()

  //select file
  var files = evt.dataTransfer ? evt.dataTransfer.files : $(this).get(0).files
  var file = files[0];
  //only allow one file
  uploadFile(file);

}

 /**
  * Dragover handler to set the drop effect.
  */
 function handleDragOver(evt) {
   evt.stopPropagation()
   evt.preventDefault()
   evt.dataTransfer.dropEffect = 'copy'
 }

 function _getEl(el) {
   return document.getElementById(el);
 }

 function uploadFile(file) {
   clearErrors();

   var allowedFileTypes = [
     'video/mp4',
     'video/quicktime',
     'video/x-ms-wmv',
     'video/avi',
     'video/x-flv',
     'video/3gpp'
   ];

   var maxSize = 120;

   if (!validateAllowedFileSize(file, maxSize)) {
     displayError('<b>Het bestand is te groot.</b>');
     return false;
   }

   if (!validateFileType(file, allowedFileTypes)) {
     displayError('<b>Verkeerd bestandsformaat.</b> <br /> Kies een videobestand (mpeg, mp4, mov, avi, 3gp, wmv, flv)');
     return false;
   }

   $('#vimeo-dropzone-container').removeClass().addClass('vimeo-processing');

   var formdata = new FormData();
   formdata.append("file_data", file);
   formdata.append("upload", JSON.stringify({
     "approach": "post",
      "size": file.size,
      //"redirect_url": 'http://demo2.cms.acc.openstad.amsterdam/'
   }));



   var ajax = new XMLHttpRequest();
  // ajax.upload.addEventListener("progress", progressHandler, false);
   ajax.addEventListener("load", function(event) {
     completeHandler(event, file);
   }, false);
   ajax.addEventListener("error", errorHandler, false);
   ajax.addEventListener("abort", abortHandler, false);
   ajax.open("POST", "/vimeo-upload");
   //use file_upload_parser.php from above url
   ajax.send(formdata);
 }

 function validateAllowedFileSize(file, maxSize){
   //turn bytes int mb
   return file ? ((file.size/1024)/1024).toFixed(4) <= maxSize : false;
 }

 function validateFileType(file, allowedFileTypes){
   return allowedFileTypes.indexOf(file.type) !== -1;
 }

 function progressHandler(event) {
   var percent = (event.loaded / event.total) * 100;
   _getEl("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
   _getEl("progressBar").value = Math.round(percent);
   _getEl("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
 }

 function completeHandler(event, file) {
   var response = event.target.responseText;
   response = response ? JSON.parse(response) : response;
   $('#vimeo-id').val(response.vimeoId);
   $('#vimeo-dropzone-container').removeClass().addClass('vimeo-processed vimeo-success');
   $('#video-file-name').html(file.name)
   //clean up iframe in case already one
   $('#vimeo-video').html('');
//   _getEl("progressBar").value = 0; //wil clear progress bar after successful upload
 }

 function clearErrors() {
   _getEl("vimeo-status").innerHTML = "";
 }

 function errorHandler(event) {
   $('#vimeo-dropzone-container').removeClass().addClass('vimeo-error');
   _getEl("vimeo-status").innerHTML = "Upload gefaald";
 }

 function abortHandler(event) {
   _getEl("vimeo-status").innerHTML = "Upload afgebroken";
 }

 function displayError(message) {
    _getEl("vimeo-status").innerHTML = message;
 }

 /**
  * Bind the dom events to the functions
  */
 document.addEventListener('DOMContentLoaded', function() {
     var dropZone = document.getElementById('vimeo-dropzone')
     var browse = document.getElementById('vimeo-browse')
     dropZone.addEventListener('dragover', handleDragOver, false)
     dropZone.addEventListener('drop', handleFileSelect, false)

     // set value to null on click otherwise change event not triggered second time
     browse.onclick = function () {
        this.value = null;
      };


     browse.addEventListener('change', handleFileSelect, false)
 })

}());
