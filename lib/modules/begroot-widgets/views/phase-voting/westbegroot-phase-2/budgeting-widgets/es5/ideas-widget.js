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

var IdeasWidget =
/*#__PURE__*/
function (_OpenStadWidget) {
  _inherits(IdeasWidget, _OpenStadWidget);

  function IdeasWidget() {
    _classCallCheck(this, IdeasWidget);

    return _possibleConstructorReturn(this, _getPrototypeOf(IdeasWidget).apply(this, arguments));
  }

  _createClass(IdeasWidget, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(_getPrototypeOf(IdeasWidget.prototype), "connectedCallback", this).call(this);

      var self = this;
      self.fetch();
    }
  }, {
    key: "getTemplateHTML",
    value: function getTemplateHTML() {
      return "<link rel=\"stylesheet\" type=\"text/css\" media=\"all\"   href=\"/css/widgets/ideas.css\"/>\n\n<template id=\"idea-template\">\n\t<div class=\"idea\"> <!-- onclick=\"{{href}}\" -->\n\t\t<div class=\"idea-images\"></div>\n\t\t<div class=\"idea-title\"></div>\n\t\t<div class=\"idea-summary\"></div>\n\t\t<div class=\"idea-budget\"></div>\n\t\t<div class=\"idea-extra\"></div>\n\t\t<div class=\"idea-counters\"></div>\n\t</div>\n</template>\n\n<div class=\"ideas\">\n\t<slot name=\"title\"><h2>Idee\xEBn</h2></slot>\n\t<div class=\"ideas-list\">\n\t</div>\n</div>\n\n";
    }
  }, {
    key: "fetch",
    value: function (_fetch) {
      function fetch() {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function () {
      var self = this; // TODO: fetch is too modern, so change or polyfill
      // TODO: CORS

      var url = "{{apiUrl}}/api/site/{{siteId}}/idea/?running=true&includePosterImage=true&includeVoteCount=true";
      url = url + '&access_token=VRIth7Tv1j1tEyQ7Z8TnhSaqnmDXFenXoYCxrjxKMO9QwZYgLEiRfM1IU48zfMCxJEcNBm88HIzznomBhYgC3IRVFs9XguP3vi40';
      fetch(url, {
        method: 'get',
        headers: {
          "Accept": "application/json"
        }
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        // console.log('Request succeeded with JSON response', json);
        self.render(json);
      }).catch(function (error) {
        console.log('Request failed', error);
      });
    })
  }, {
    key: "render",
    value: function render(data) {
      var self = this;
      data.forEach(function (ideaData) {
        var template = self.shadowRoot.querySelector('#idea-template').content.cloneNode(true);
        self.renderIdea(template, ideaData);
      });

      if (self.getAttribute('afterRenderCallback')) {
        // console.log(`${self.getAttribute('afterRenderCallback')}(self)`);
        eval("".concat(self.getAttribute('afterRenderCallback'), "(self)"));
      }
    }
  }, {
    key: "renderIdea",
    value: function renderIdea(template, data) {
      var self = this;
      template.querySelector('.idea').id = "idea-".concat(data.id);
      var onclick = self.getAttribute('data-onclick') || '';
      template.querySelector('.idea').addEventListener('click', function () {
        eval(onclick.replace(/\[\[id\]\]/g, data.id));
      }, false);
      template.querySelector('.idea-title').innerHTML = data.title;
      template.querySelector('.idea-summary').innerHTML = data.summary;
      template.querySelector('.idea-budget').innerHTML = '€ ' + data.budget.toString().replace(/000$/, '.000'); // poor mans sprintf

      template.querySelector('.idea-budget').setAttribute('value', data.budget); // unformatted

      template.querySelector('.idea-counters').innerHTML = "".concat(data.yes, ", ").concat(data.no, ", ").concat(data.argCount); // temp, want moet beter

      var imagesElement = document.createElement('idea-images');
      var imageUrl = data.posterImage && data.posterImage.key;

      if (imageUrl) {
        imageUrl = '{{imageUrl}}/image/' + imageUrl;
      } else {
        imageUrl = '{{imageUrl}}/img/placeholders/idea.jpg';
      }

      var imageElement = document.createElement('div');
      imageElement.className = 'idea-image';
      var imageDiv = document.createElement('div');
      imageDiv.style.backgroundImage = 'url(' + imageUrl + ')';
      imageElement.setAttribute('image', imageUrl);
      imageElement.appendChild(imageDiv);
      imagesElement.appendChild(imageElement);
      template.querySelector('.idea-images').innerHTML = imagesElement.innerHTML;
      self.shadowRoot.querySelector('.ideas-list').appendChild(template);
    }
  }]);

  return IdeasWidget;
}(OpenStadWidget);

customElements.define('ideas-widget', IdeasWidget);