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

  //only allow one file
  uploadFile(files[0]);
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
   var allowedFileTypes = [
     'video/mp4',
     'video/quicktime',
     'video/x-ms-wmv',
     'video/avi',
     'video/x-flv',
   ];


   if (!validateAllowedFileSize(file, maxSize)) {
     displayError('Bestand is te groot');
     return false;
   }

   if (!validateFileType(file, allowedFileTypes)) {
     displayError('Bestandsformaat is niet toegestaan');
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
   ajax.addEventListener("load", completeHandler, false);
   ajax.addEventListener("error", errorHandler, false);
   ajax.addEventListener("abort", abortHandler, false);
   ajax.open("POST", "/vimeo-upload");
   //use file_upload_parser.php from above url
   ajax.send(formdata);
 }

 function validateAllowedFileSize(file, maxSize){
   //turn bytes int mb
   var filesizeMB = (file.size/1024)/1024).toFixed(4);
   return filesizeMB =< maxSize;
 }

 function validateFileType(file, allowedFileTypes){
   return allowedFileTypes.indexOf(files.type) !== -1;
 }

 function progressHandler(event) {
   var percent = (event.loaded / event.total) * 100;
   _getEl("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
   _getEl("progressBar").value = Math.round(percent);
   _getEl("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
 }

 function completeHandler(event) {
   var response = event.target.responseText;
   response = response ? JSON.parse(response) : response;
   $('#vimeo-id').val(response.vimeoId);
   $('#vimeo-dropzone-container').removeClass().addClass('vimeo-processed vimeo-success');
   $('#vimeo-video').html('<iframe src="'+response.vimeoEmbedUrl+'" />');
//   _getEl("progressBar").value = 0; //wil clear progress bar after successful upload
 }

 function errorHandler(event) {
   $('#vimeo-dropzone-container').removeClass().addClass('vimeo-error');
   _getEl("vimeo-status").innerHTML = "Upload Failed";
 }

 function abortHandler(event) {
   _getEl("vimeo-status").innerHTML = "Upload Aborted";
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
     browse.click('change', function() {
       this.value = null;
     }, false)

     browse.addEventListener('change', handleFileSelect, false)
 })

}());
