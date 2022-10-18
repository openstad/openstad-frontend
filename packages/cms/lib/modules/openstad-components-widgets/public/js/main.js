let OpenStadComponentFiles = [
  { src: 'https://unpkg.com/react@16/umd/react.production.min.js' },
  { src: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js' },
];
let OpenStadComponentFilesLoaded = [];
let OpenStadComponentFilesLoading = false;

function loadOpenStadComponents({ component, onLoad, data }) {

  let filename = `${ data.OpenStadComponentsCdn }/${ component }.js`;
  let entry = OpenStadComponentFiles.find( file => file.src && file.src.match(filename) );
  if ( !entry ) {
    // not yet in the stack: add the file to the stack
    OpenStadComponentFiles.push({
      src: filename,
      onLoad: onLoad,
      component,
      data,
    });
  } else {
    // already on the stack
    if (onLoad) {
      if ( !OpenStadComponentFilesLoaded.find( file => file.src && file.src.match(filename) ) ) {
        // but not yet loaded; add to the onLoad stack
        if (!Array.isArray(entry.onLoad)) entry.onLoad = [ entry.onLoad ]
        entry.onLoad.push( onLoad );
      } else {
        // already loaded; execute onLoad
        LoadNextOpenStadComponentsEntry(onLoad)
      }
    }
  }

  if (!OpenStadComponentFilesLoading ) LoadNextOpenStadComponentsEntry();

}

function LoadNextOpenStadComponentsEntry(onLoad) {

  OpenStadComponentFilesLoading = true;
  
  if (onLoad) {
    if (!Array.isArray(onLoad)) onLoad = [ onLoad ]
    onLoad.forEach(func => {
      func();
    });
  }

  if (OpenStadComponentFiles.length == 0) return OpenStadComponentFilesLoading = false;

  let entry = OpenStadComponentFiles.shift();

  var script = document.createElement('script');
  script.setAttribute( 'src', entry.src );
  script.onload = function onload() {
    OpenStadComponentFilesLoaded.push(entry)
    LoadNextOpenStadComponentsEntry(entry.onLoad)
  }
  document.head.appendChild(script);

}
