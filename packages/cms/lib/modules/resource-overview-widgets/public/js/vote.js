// als je dit in een losse js file stopt dan moet je wachten tot die geladen is en dat ziet er niet uit
// vote-creator - generic

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var voteCreatorElement = document.getElementById('vote-creator');

if (voteCreatorElement !== null) {

var placeholderText = $('.nothingYet .text').first().text();
var currentStep = 0;

function votingNextStep(doBeforeNextIsDone) {
  var step = steps[currentStep];
  var isValid = step.validate ? steps[currentStep].validate(true) : true;
  if (isValid && steps[currentStep+1]) {
    if (step.doBeforeNext && !doBeforeNextIsDone) {
      step.doBeforeNext()
    } else {
      hideWaitLayer();
      // deactivate current step
      hideStep(step);
      // activate next step
      currentStep++;
      var step = steps[currentStep];
      showStep(step);
    }
  }
  setNextButton();
}

// last minute hardcoded ellende
function votingPreviousStep() {
  hideStep(steps[currentStep]);
  hideStep({ barId: 'steps-bar-3', contentId: 'steps-content-error' }); // last minute hardcoded ellende
  currentStep = 0;
  var step = steps[currentStep];

  showStep(step);
  setNextButton();
}

function hideStep(step) {
  document.querySelector('#' + step.barId).className = document.querySelector('#' + step.barId).className.replace(/ active/g, '');
  document.querySelector('#' + step.contentId).className = document.querySelector('#' + step.contentId).className.replace(/ active/g, '');
  // activate next step
}

function showStep(step, doNotOpen) {
  if (!doNotOpen) showVoteCreator();
  if (step.doBeforeShow) {
    // todo: gebruik een doBeforeShowIsDone param zoals nextStep, zodat je hem kunt gebruiken met callbacks
    step.doBeforeShow();
  }
  document.querySelector('#' + step.barId).className = document.querySelector('#' + step.barId).className + ' active';
  document.querySelector('#' + step.contentId).className = document.querySelector('#' + step.contentId).className + ' active';
  updatePreview(document.querySelector('#' + step.contentId))
}

function setNextButton(showPrevious, hideNext) {
  var step = steps[currentStep];

  var isValid = step && step.validate ? steps[currentStep].validate() : true;
  if (steps[currentStep+1]) {
    if (isValid && !hideNext) {
      activateNextButton();
    } else {
      deactivateNextButton();
    }
  } else {
    hideNextButton();
  }

  // last minute hardcoded ellende
  if (currentStep == 1) {
    document.querySelector('#next-button').innerHTML = 'Verstuur';
  } else {
    document.querySelector('#next-button').innerHTML = 'Volgende';
  }

  // meer last minute hardcoded ellende
  if (currentStep == 1 || showPrevious) {
    document.querySelector('#previous-button').style.display = 'block';
  } else {
    document.querySelector('#previous-button').style.display = 'none';
  }
}



function activateNextButton() {
  if (!document.querySelector('#next-button').className.match(' active')) document.querySelector('#next-button').className = document.querySelector('#next-button').className + ' active';
}

function deactivateNextButton() {
  document.querySelector('#next-button').className = document.querySelector('#next-button').className.replace(/ active/g, '');
}

function hideNextButton() {
  document.querySelector('#next-button').style.display = 'none';
}

function showWaitLayer() {
  document.querySelector('#waitLayer').style.display = 'block';
}

function hideWaitLayer() {
  document.querySelector('#waitLayer').style.display = 'none';
}

setNextButton();

// vote-creator - specific
var previewHTML = '';
var previewDescriptionHTML = '';
function selectIdea(newIdeaId, doNotOpen) {

  if (!doNotOpen) showVoteCreator();
  voteCreatorElement = document.getElementById('vote-creator')

  ideaId = newIdeaId;

  openstadSetCookie('ideaId' + voteBlockIdentifier, ideaId);
  voteCreatorElement.querySelector('input[name=ideaId]').value = ideaId;

  $('.preview-container').removeClass('form-error');

  // last minute hardcoded ellende
  document.querySelector('.preview-overlay').style.display = 'block';

  var step = steps[currentStep] || steps[0];
  var stepElement = document.querySelector('#' + step.contentId);

  var previewElement = stepElement.querySelector('.preview');
  previewElement.className = previewElement.className.replace(/ form-error/g, '');

  var node = document.createElement('div');
  node.className = 'image';

  var ideaContainer = document.querySelector('#idea-' + ideaId);
  var imageContainer = ideaContainer ? ideaContainer.querySelector('.image') : false;
  var imageHtml = imageContainer ? imageContainer.innerHTML : false;
  var imageUrl = imageContainer ? $(imageContainer).attr('data-image-url') :  false;
  var ideaPresentOnPage = imageContainer ? true : false;


  if (!imageHtml) {
    imageUrl = localStorage.getItem('ideaImageUrl'+ ideaId);

    if (imageUrl) {
      imageHtml = '<div style="background-image:url(\''+ imageUrl +'\');  top: 0px; left: 0px; width: 100%; height: 100%;   background-position: center center; background-size: cover;"></div>';
    }
  }


  if (imageHtml) {
  //  imageHtml = imageHtml.replace('&quot;', '\'');
    $(node).html(imageHtml);
  }

  if (imageUrl) {
    localStorage.setItem('ideaImageUrl'+ ideaId, imageUrl);
  }

  previewElement.innerHTML = '';
  previewElement.appendChild(node)

  previewHTML = previewElement.innerHTML;

  // dit zou  gewoon in de title moeten, maar die is heel anders opgebouwd. Dat moet dus een keer gerefactored...
  var previewDescription = stepElement.querySelector('.preview-description');

  var desciptionContainer = ideaContainer ? ideaContainer.querySelector('.voteblock-description'): false;

  if (desciptionContainer) {
    previewDescriptionHTML = desciptionContainer.innerHTML;
    if (previewDescription) {
      previewDescription.innerHTML = desciptionContainer.innerHTML;
    }
  }

  //add idea-title
  var ideaTitle = $('#idea-' + ideaId + ' .title').first().text();
  if (previewDescriptionHTML) {
    $('.selected-idea-title').html(previewDescriptionHTML);
  } else {
    $('.selected-idea-title').text(ideaTitle);
  }
  
  previewElement.setAttribute('title', 'Ontwerp "' + ideaTitle + '" gekozen. Druk op enter om deze te verwijderen.');


  if (doShowImage && ideaPresentOnPage) {
    doShowImage(ideaId, previewElement);
  }

  setNextButton();
  setLoginUrlWithIdeaId(ideaId);

  location.href = "#vote-creator-anchor";

  return false;
}


function setLoginUrlWithIdeaId(ideaId) {
  var url =  loginUrl + '?' + returnToKey + '=' + currentPathname + '?' + returnFromKey + '=' + ideaId;
  $('.validate-auth-button').attr('href', url);
}

function unSelectIdea(event) {
  voteCreatorElement = document.getElementById('vote-creator');

  ideaId = undefined;
  openstadEraseCookie('ideaId' + voteBlockIdentifier);
  voteCreatorElement.querySelector('input[name=ideaId]').value = '';

  // last minute hardcoded ellende
  document.querySelector('.preview-overlay').style.display = 'none';

  var step = steps[currentStep] || steps[0];
  var stepElement = document.querySelector('#' + step.contentId);


  var previewElement = stepElement.querySelector('.preview');
  previewElement.innerHTML = '<div class="nothingYet"><div class="inner-container"><div class="text">'+ placeholderText +'</div></div></div>';
  previewElement.setAttribute('title', 'Kies een ontwerp.');

  setNextButton();

  event.stopPropagation();

}

function updatePreview(target) {
  var previewElement = target.querySelector('.preview');
  previewElement.innerHTML = previewHTML;

  if (doShowImage) {
  doShowImage(ideaId, previewElement);
  }

  var previewDescription = target.querySelector('.preview-description');
  if (previewDescription && previewDescriptionHTML) {
    previewDescription.innerHTML = previewDescriptionHTML;
  }

}

function ideaOverviewClickPreview(event) {
  var target = event.target;

  if (!ideaId) {
     overviewScrollToIdeas();
  } else {
    // let previewElement = target.querySelector('.preview');
    // previewElement.innerHTML = {
    //
    // };
  }
}

function ideaOverviewKeyDownPreview(event) {
  if (event.keyCode == 13) {
    if (ideaId) {
      unSelectIdea(event);
    } else {
      overviewScrollToIdeas();
    }
  }
}

function overviewScrollToIdeas() {
  var elem = document.getElementById('ideas-anchor');

  if (elem) {
    var jump = parseInt(elem.getBoundingClientRect().top * .2);
    document.body.scrollTop += jump;
    document.documentElement.scrollTop += jump;
    if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
      elem.lastjump = Math.abs(jump);
      setTimeout(function() { overviewScrollToIdeas();}, 25);
    } else {
      elem.lastjump = null;
    }
  }
}



function setVerified() {
  hideStep(steps[currentStep]);
  currentStep = 1
  showStep(steps[currentStep]);
}



function setHasVoted() {
  openstadSetCookie('hasVoted' + voteBlockIdentifier, true);
  hideStep(steps[currentStep])
  currentStep = 2;
  showStep(steps[currentStep], true);
  var buttons = document.querySelectorAll('.button-vote');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].className += ' hasVoted';
  }
  buttons = document.querySelectorAll('.button-more-info');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].className += ' centered';
  }
  buttons = document.querySelectorAll('.vote-button-container.hasNotVoted');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].className = buttons[i].className.replace(/active/g, '');
  }
  buttons = document.querySelectorAll('.vote-button-container.hasVoted');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].className += ' active';
  }
}

function setHasConfirmed() {
  currentStep = 4;
  openstadSetCookie('hasConfirmed' + voteBlockIdentifier,  true);
  hasConfirmed = true;
  hideStep(steps[0]);
  showStep({
    barId: 'steps-bar-3',
    contentId: 'steps-content-3c',
    doBeforeShow: function() {
    //  document.querySelector('#showZipCode3c').innerHTML = document.querySelector('input[name=zipCode]').value;
    //  document.querySelector('#showEmail3c').innerHTML = document.querySelector('input[name=email]').value;
    }
  })
  var buttons = document.querySelectorAll('.button-vote');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].className += ' hasVoted';
  }
}

function sendVote() {
  showWaitLayer();

  var ideaId = document.querySelector('input[name=ideaId]').value;

//  var body = {
//		zipCode: document.querySelector('input[name=zipCode]').value,/
//		email: document.querySelector('input[name=email]').value,
//	  _csrf: csrfToken,
//  }


  $.ajax({
    method: 'POST',
  //  url: "/api/site/"+siteId+"/idea/" + ideaId + "/vote",
    url: "/vote",
    data: { opinion: 'yes', ideaId: ideaId },
    json: true,
    error: function() {
      hideWaitLayer();
      hideStep(steps[currentStep]);

      showStep({
        barId: 'steps-bar-3',
        contentId: 'steps-content-error',
        doBeforeShow: function() {
        //  document.querySelector('#showZipCodeError').innerHTML = document.querySelector('input[name=zipCode]').value;
        //  document.querySelector('#showEmailError').innerHTML = document.querySelector('input[name=email]').value;
        }
      });

      setNextButton(true, true);
    },
    success: function () {
      hideWaitLayer();
      setHasVoted();
      votingNextStep(true);
    }
  });
}

function toggleVoteCreator() {
  // todo: real condition
  if (document.getElementById('vote-creator').className === 'open') {
    hideVoteCreator();
  } else if (document.getElementById('vote-creator').className === 'closed') {
    showVoteCreator();
  }
}
function showVoteCreator() {
  var doUpdateIdea = false;
  if (!document.getElementById('vote-creator').className.match('open')) {
    doUpdateIdea = true;
  }
  document.getElementById('vote-creator').className = 'open';
  if (ideaId && doUpdateIdea) selectIdea(ideaId, true);
}
function hideVoteCreator() {
  document.getElementById('vote-creator').className = 'closed';
}

// todo: dit stat nu hier omdat je anders de indeen nog niet hebt, maar zou natuurlijk in de widget moeten
function openstadGetCookie(name) {

  var match = document.cookie.match(new RegExp("(?:^|;\\s*)\\s*" + name +"=([^;]+)\\s*(?:;|$)"));

  var value;
  if (match) {
    value = match[1];
  }

  try {
    value = JSON.parse(value);
  } catch(err) {}

  return value;

}

function openstadSetCookie(name, value, days, path) {

  if ( typeof name != 'string' ) return;

  if ( typeof value == 'undefined' ) value = "";
  if ( typeof value == 'object' ) {
    try {
      value = JSON.stringify(value);
    } catch(err) {}
  };

  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "expires=" + date.toUTCString();
  }

  path = path ? "path= " + path : ""

  document.cookie = name + "=" + value + "; " + expires + "; " + path;

}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var returnFromKey = 'returnedFromVerification';
var match = window.location.hash.match(/ideaId-(\d+)/);
//var ideaId = match ? match[1] : undefined;

var returnFromId = getUrlParameter(returnFromKey); //window.location.hash.match(/returnedFromVerification-(\d+)/);
var returnedFromVerification =  !!returnFromId;


  var match = window.location.hash.match(/closed/);

  if (match) {
    hideVoteCreator();
  } else {

    if (hasConfirmed) {
      setHasConfirmed();
    } else {
      if (hasVoted) {
        setHasVoted();
      } else if (returnedFromVerification) {
      //  setHasVoted();
        selectIdea(parseInt(returnFromId,10));
        setVerified();
      }
    }

    var match = window.location.hash.match(/vote-creator-anchor/);

    if (match) {
      showVoteCreator();
    }

    setNextButton();
  }
}
