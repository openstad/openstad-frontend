// ----------------------------------------------------------------------------------------------------
// dit zou ergens generiek moeten staan
// ----------------------------------------------------------------------------------------------------
// click selector

function initClickSelectorOptionOption(id) {
	var selector = document.querySelector('#click-selector-'+id);
	var values = JSON.parse( document.querySelector('#'+id).value || '[]' );
	var selected = [];
	for ( var i=0; i<selector.children.length; i++ ) {
		var option = selector.children[i];
		if (values.find(function (val) { return val == option.innerHTML})) {
			option.className += ' selected';
		}
	}
}


function toggleClickSelectorOptionOption(id, value) {
	var selector = document.querySelector('#click-selector-'+id);
	var selected = [];
	for ( var i=0; i<selector.children.length; i++ ) {
		var option = selector.children[i];
		if (option.innerHTML == value) {
			if (option.className.match(/( |^)selected( |$)/)) {
				option.className = option.className.replace(/( |^)selected( |$)/g, '');
			} else {
				option.className += ' selected';
			}
		}
		if (option.className.match('selected')) {
			selected.push(option.innerHTML)
		}
	}
	document.querySelector('#'+id).value = JSON.stringify(selected);
	document.querySelector('#'+id).onchange();
}

// end click selector
// ----------------------------------------------------------------------------------------------------
// textarea chars left

function initCharactersLeft(target, contentDiv, minLen, maxLen) {

	var msg = {
		min: contentDiv.querySelector('div.min'),
		max: contentDiv.querySelector('div.max')
	};
	var span = {
		min: msg.min.querySelector('span'),
		max: msg.max.querySelector('span')
	};

	updateCharsLeft();

	target.addEventListener('focus', function( event ) {
		console.log('???1');
		contentDiv.className += ' visible';
	});

	target.addEventListener('blur', function( event ) {
		console.log('???2');
		contentDiv.className = contentDiv.className.replace(' visible', '');
	});

	target.addEventListener('keyup', function() {
		console.log('???3');
		updateCharsLeft();
	});

	function updateCharsLeft() {

		var value = target.value || '';
		value = value.trim();

		var num_newlines = value.split(/\r\n|\r|\n/).length - 1;
		var len = value.length + num_newlines;

		var enable  = len < minLen ? 'min' : 'max';
		var disable = enable == 'max' ? 'min' : 'max';
		var ok = enable == 'max' ? len < maxLen : len > minLen;
		var chars   = len < minLen ?
			    minLen - len :
			    maxLen - len;

		msg[enable].className  = enable + ' ' + ( ok ? 'ok' : 'error' ) + ' visible';
		msg[disable].className = disable;
		span[enable].innerHTML = chars;
	}

}

// end textarea chars left
// ----------------------------------------------------------------------------------------------------
// TAF
