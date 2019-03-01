"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BudgetingWidget =
/*#__PURE__*/
function (_OpenStadWidget) {
  _inherits(BudgetingWidget, _OpenStadWidget);

  function BudgetingWidget() {
    _classCallCheck(this, BudgetingWidget);

    return _possibleConstructorReturn(this, _getPrototypeOf(BudgetingWidget).apply(this, arguments));
  }

  _createClass(BudgetingWidget, [{
    key: "getTemplateHTML",
    value: function getTemplateHTML() {
      return "<link rel=\"stylesheet\" type=\"text/css\" media=\"all\"   href=\"/css/widgets/budgeting.css\"/>\n\n<template id=\"budget-view-idea\">\n\t<idea onclick=\"document.querySelector('budgeting-widget').removeIdeaFromBudget([[id]])\">\n\t\t<idea-image></idea-image>\n\t</idea>\n</template>\n\n\n<div class=\"budgeting\">\n\n\t<div id=\"budgetView\"></div>\n\t<div id=\"budgetTotal\"></div>\n\t<a href=\"javascript: void document.querySelector('budgeting-widget').sendBudget()\">Verstuur deze begroting</a><br><br>\n\n\t<!-- todo: defaultem naar de standaard widget? -->\n\t<slot name=\"ideas\"></slot>\n\n\t<div id=\"info-popup\">\n\t\t<!-- todo: override met slots -->\n\t\t<div class=\"content\">\n\t\t\t<div class=\"closeButton\"><a href=\"javascript: void document.querySelector('budgeting-widget').hideInfoPopup()\">&#10005;</a></div>\n\t\t\t<div id=\"you-must-login-first\">\n\t\t\t\tJe gaat nu je begroting insturen.<br/><br/>\n\t\t\t\tJe kunt hem daarna niet meer wijzigen.<br/><br/>\n\t\t\t\tVoor je je begroting kunt insturen moet je <a href=\"/oauth/login?redirect_uri=/begroten?returnFromLogin=true\">INLOGGEN</a> met je unieke code.<br/><br/>\n\t\t\t</div>\n\t\t\t<div id=\"you-are-about-to-vote\">\n\t\t\t\tJe gaat nu je begroting insturen.<br/><br/>\n\t\t\t\tJe kunt hem daarna niet meer wijzigen.<br/><br/>\n\t\t\t\tWeet je het zeker, druk dan op <a href=\"javascript: void document.querySelector('budgeting-widget').sendBudget(true)\">VERSTUUR</a>.\n\t\t\t</div>\n\t\t\t<div id=\"error\">\n\t\t\t\terror\n\t\t\t</div>\n\t\t\t<div id=\"success\">\n\t\t\t\tJe begroting is opgeslagen; je hebt gestemd.<br/><br/>\n\t\t\t\t<a href=\"/begroten\">Sluit dit venster</a>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\n</div>\n\n";
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(_getPrototypeOf(BudgetingWidget.prototype), "connectedCallback", this).call(this);

      var self = this;

      if (!window.sessionStorage.getItem('currentBudget')) {
        window.sessionStorage.setItem('currentBudget', '[]');
      }

      self.currentBudget = JSON.parse(window.sessionStorage.getItem('currentBudget'));
      self.userAccessToken = '{{accessToken}}'; // console.log('===1', self.shadowRoot.getElementById('test1'));
      // console.log('===2', self.shadowRoot.getElementById('test2'));
      // document.querySelector('#budget-ideas').setAttribute('afterRenderCallback', 'document.querySelector(\'budgeting-widget\').updateBudgetView');
      // ["DOMNodeInserted", "DOMAttrModified", "DOMNodeRemoved"].forEach(function (eventName) {
      //  	self.shadowRoot.addEventListener(eventName, self.test, true);
      // });

      window.addEventListener('WebComponentsReady', function () {
        document.querySelector('#budget-ideas').setAttribute('afterRenderCallback', 'document.querySelector(\'budgeting-widget\').updateBudgetView');
      }, true);

      if (window.location.search.match(/returnFromLogin=true/)) {
        self.sendBudget();
      }
    }
  }, {
    key: "test",
    value: function test(e) {
      console.log('===', document.getElementById('budget-ideas'));
      console.log('mutation', e);
    }
  }, {
    key: "createdCallback",
    value: function createdCallback() {
      console.log('createdCallback');
    }
  }, {
    key: "adoptedCallback",
    value: function adoptedCallback() {
      console.log('adoptedCallback');
    }
  }, {
    key: "addIdeaToBudget",
    value: function addIdeaToBudget(ideaId) {
      var self = this;

      if (self.currentBudget.indexOf(ideaId) == -1) {
        self.currentBudget.push(ideaId);
      }

      self.updateBudgetStore();
      self.updateBudgetView();
    }
  }, {
    key: "removeIdeaFromBudget",
    value: function removeIdeaFromBudget(ideaId) {
      var self = this;
      var index = self.currentBudget.indexOf(ideaId);

      if (index != -1) {
        self.currentBudget.splice(index, 1);
      }

      self.updateBudgetStore();
      self.updateBudgetView();
    }
  }, {
    key: "updateBudgetStore",
    value: function updateBudgetStore() {
      var self = this;
      window.sessionStorage.setItem('currentBudget', JSON.stringify(self.currentBudget));
    }
  }, {
    key: "updateBudgetView",
    value: function updateBudgetView() {
      var self = this;
      var viewElement = self.shadowRoot.querySelector('#budgetView');
      var totalElement = self.shadowRoot.querySelector('#budgetTotal');
      var innerHTML = '';
      var budget = 0;
      self.currentBudget.map(function (ideaId) {
        var idea = document.querySelector('#budget-ideas').shadowRoot.querySelector("#idea-".concat(ideaId));
        var width = 100;
        var height = 100;
        var img = idea.querySelector('.idea-image').getAttribute('image');
        innerHTML += "<div class=\"budget-idea-image\" style=\"display: inline-block; width: ".concat(width, "px; height: ").concat(height, "px; background-image: url('").concat(img, "'); cursor: pointer;\" onclick=\"document.querySelector('budgeting-widget').removeIdeaFromBudget(").concat(ideaId, ")\"></div>\n");
        budget += parseInt(idea.querySelector('.idea-budget').getAttribute('value'));
      });
      viewElement.innerHTML = innerHTML;
      totalElement.innerHTML = 'Totaal: € ' + budget.toString().replace(/000$/, '.000'); // poor mans sprintf;
    }
  }, {
    key: "sendBudget",
    value: function sendBudget(confirmed) {
      var self = this;

      if (!self.userAccessToken) {
        console.log('?');
        return self.showInfoPopup('you-must-login-first');
      }

      if (!confirmed) {
        return self.showInfoPopup('you-are-about-to-vote');
      }

      var data = {
        budgetVote: self.currentBudget,
        _csrf: '{{csrfToken}}' // TODO: fetch is too modern, so change or polyfill
        // TODO: CORS

      };
      var url = "{{apiUrl}}/api/site/{{siteId}}/budgeting?";
      url = url + "&access_token=".concat(self.userAccessToken);
      fetch(url, {
        method: 'post',
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        if (json.status && json.status != 200) throw json.message;
        self.showInfoPopup('success'); // na het stemmen bewaren we niets meer

        self.currentBudget = [];
        self.updateBudgetStore();
      }).catch(function (error) {
        console.log('Request failed', error);
        self.showInfoPopup('error', error);
      });
    }
  }, {
    key: "showInfoPopup",
    value: function showInfoPopup(which, content) {
      var self = this;
      self.hideInfoPopupContent();
      self.shadowRoot.querySelector('#info-popup').style.display = 'block';
      var popup = self.shadowRoot.querySelector("#".concat(which));
      popup.style.display = 'block';
      if (content) popup.innerHTML = content;
      var handler = self.infoPopupEventListener.bind(self);
      document.addEventListener('keyup', handler, false);
      self.shadowRoot.querySelector('#info-popup').addEventListener('mousedown', handler, false);
    }
  }, {
    key: "hideInfoPopupContent",
    value: function hideInfoPopupContent() {
      var self = this;
      var popup = self.shadowRoot.querySelector('#info-popup');
      popup.querySelector('#you-must-login-first').style.display = 'none';
      popup.querySelector('#you-are-about-to-vote').style.display = 'none';
      popup.querySelector('#error').style.display = 'none';
      popup.querySelector('#success').style.display = 'none';
    }
  }, {
    key: "hideInfoPopup",
    value: function hideInfoPopup() {
      var self = this;
      var popup = self.shadowRoot.querySelector('#info-popup');
      popup.style.display = 'none';
      self.hideInfoPopupContent();
    }
  }, {
    key: "infoPopupEventListener",
    value: function infoPopupEventListener(event) {
      var self = this;

      if (event.which == 27 || event.target == self.shadowRoot.querySelector('#info-popup')) {
        // escape
        self.hideInfoPopup();
      }
    }
  }]);

  return BudgetingWidget;
}(OpenStadWidget);

customElements.define('budgeting-widget', BudgetingWidget);