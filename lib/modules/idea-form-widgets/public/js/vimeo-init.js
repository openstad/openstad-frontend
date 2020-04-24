/**
  * Called when files are dropped on to the drop target or selected by the browse button.
  * For each file, uploads the content to Drive & displays the results when complete.
*/


function handleFileSelect(evt) {
  evt.stopPropagation()
  evt.preventDefault()

  var files = evt.dataTransfer ? evt.dataTransfer.files : $(this).get(0).files
  var results = document.getElementById('results')

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

 /**
  * Update progress bar.
  */
 function updateProgress(progress) {
     progress = Math.floor(progress * 100)
     var element = document.getElementById('progress')
     element.setAttribute('style', 'width:' + progress + '%')
     element.innerHTML = '&nbsp;' + progress + '%'
 }
 /**
  * Wire up drag & drop listeners once page loads
  */
 document.addEventListener('DOMContentLoaded', function() {
     var dropZone = document.getElementById('vimeo-dropzone')
     var browse = document.getElementById('browse')
     dropZone.addEventListener('dragover', handleDragOver, false)
     dropZone.addEventListener('drop', handleFileSelect, false)
     browse.click('change', function() {
       this.value = null;
     }, false)

     browse.addEventListener('change', handleFileSelect, false)
 })

 function _getEl(el) {
   return document.getElementById(el);
 }

 function uploadFile(file) {
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

 function progressHandler(event) {
   _getEl("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
   var percent = (event.loaded / event.total) * 100;
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
   _getEl("status").innerHTML = "Upload Failed";
 }

 function abortHandler(event) {
   _getEl("status").innerHTML = "Upload Aborted";
 }
