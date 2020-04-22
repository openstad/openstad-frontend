/**
  * Called when files are dropped on to the drop target or selected by the browse button.
  * For each file, uploads the content to Drive & displays the results when complete.
  */
 function handleFileSelect(evt) {
     evt.stopPropagation()
     evt.preventDefault()

     var files = evt.dataTransfer ? evt.dataTransfer.files : $(this).get(0).files
     var results = document.getElementById('results')

     /* Clear the results div */
     while (results.hasChildNodes()) results.removeChild(results.firstChild)

     /* Rest the progress bar and show it */
     updateProgress(0)
     document.getElementById('progress-container').style.display = 'block'

     /* Instantiate Vimeo Uploader */
     ;(new VimeoUpload({
         //name: document.getElementById('videoName').value,
        // description: document.getElementById('videoDescription').value,
         //private: document.getElementById('make_private').checked,
         file: files[0],
         token: 'e28f48a006ffcc1a396ca61e458d4e77d5e15484', // document.getElementById('accessToken').value,
         //upgrade_to_1080: document.getElementById('upgrade_to_1080').checked,
         onError: function(data) {
             showMessage('<strong>Error</strong>: ' + JSON.parse(data).error, 'danger')
         },
         onProgress: function(data) {
             updateProgress(data.loaded / data.total)
         },
         onComplete: function(videoId, index) {
             var url = 'https://vimeo.com/' + videoId

             if (index > -1) {
                 /* The metadata contains all of the uploaded video(s) details see: https://developer.vimeo.com/api/endpoints/videos#/{video_id} */
                 url = this.metadata[index].link //

                 /* add stringify the json object for displaying in a text area */
                 var pretty = JSON.stringify(this.metadata[index], null, 2)

                 console.log(pretty) /* echo server data */
             }

             showMessage('<strong>Upload Successful</strong>: check uploaded video @ <a href="' + url + '">' + url + '</a>. Open the Console for the response details.')
         }
     })).upload()

     /* local function: show a user message */
     function showMessage(html, type) {
         /* hide progress bar */
         document.getElementById('progress-container').style.display = 'none'

         /* display alert message */
         var element = document.createElement('div')
         element.setAttribute('class', 'alert alert-' + (type || 'success'))
         element.innerHTML = html
         results.appendChild(element)
     }
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
        * Updat progress bar.
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
           var dropZone = document.getElementById('drop_zone')
           var browse = document.getElementById('browse')
           dropZone.addEventListener('dragover', handleDragOver, false)
           dropZone.addEventListener('drop', handleFileSelect, false)
           browse.addEventListener('change', handleFileSelect, false)
       })
