function initAttachmentManager( form, editor ) {
	var host   = '/image';
	// {key: true, ...}
	var images = {};
	
	document.addEventListener('trix-file-accept', function( event ) {
		// afbeeldingen in de tekst kunnen niet langer
		console.log('WTF');
		event.preventDefault();
	});
	document.addEventListener('trix-attachment-add', function( event ) {
		// afbeeldingen in de tekst kunnen niet langer
		console.log('WTF');
		event.stopPropagation();
		event.preventDefault();
		// var attachment = event.attachment;
		// if( attachment.file ) {
		//  	return uploadAttachment(attachment);
		// }
	});
	document.addEventListener('trix-attachment-remove', function( event ) {
		var attachment = event.attachment;
		if( attachment.file ) {
			var key = attachment.getAttribute('key');
			delete images[key];
		}
	});
	document.addEventListener('trix-action-invoke', function( event ) {
		if( event.actionName !== 'x-attach' ) return;
		
		var editorElement = event.target;
		editorElement.focus();
		
		var input      = document.createElement('input');
		input.type     = 'file';
		input.multiple = true;
		input.addEventListener('change', function( event ) {
			var i, file;
			for( i=0; file=input.files[i]; i++ ) {
				editorElement.editor.insertFile(file);
			}
		});
		
		var click = document.createEvent('MouseEvents');
		click.initMouseEvent('click',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
		input.dispatchEvent(click);
	});
	form.addEventListener('submit', function( event ) {
	});

	function uploadAttachment( attachment ) {
		var file = attachment.file;
		var key  = createStorageKey(file);
		
		var form = new FormData;
		form.append('key', key);
		form.append('file', file);
		
		var xhr = new XMLHttpRequest;
		xhr.open('POST', host, true);
		xhr.upload.onprogress = function( event ) {
			var progress = event.loaded / event.total * 100;
			return attachment.setUploadProgress(progress);
		};
		xhr.onload = function() {
			if( xhr.status === 204 ) {
				images[key] = true;
				return attachment.setAttributes({
					url  : host+'/'+key,
					key  : key
				});
			}
		};
		return xhr.send(form);
	};

	function createStorageKey( file ) {
		var date = new Date();
		var time = date.getTime();
		return time + '-' + file.name;
	};

}
