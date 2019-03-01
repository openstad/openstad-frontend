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

var IdeasGridderWidget =
/*#__PURE__*/
function (_IdeasWidget) {
  _inherits(IdeasGridderWidget, _IdeasWidget);

  function IdeasGridderWidget() {
    _classCallCheck(this, IdeasGridderWidget);

    return _possibleConstructorReturn(this, _getPrototypeOf(IdeasGridderWidget).apply(this, arguments));
  }

  _createClass(IdeasGridderWidget, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(_getPrototypeOf(IdeasGridderWidget.prototype), "connectedCallback", this).call(this);

      var self = this;
    }
  }, {
    key: "getTemplateHTML",
    value: function getTemplateHTML() {
      return "<link rel=\"stylesheet\" type=\"text/css\" media=\"all\"   href=\"/css/widgets/ideas.css\"/>\n<link rel=\"stylesheet\" type=\"text/css\" media=\"all\"   href=\"/css/widgets/ideas-gridder.css\"/>\n\n<template id=\"idea-template\">\n\t<li class=\"gridder-list idea\">\n\t\t<!-- \n\t\t\t\t onmouseover=\"this.querySelector('.gridder-mouse-over').style.display = 'block';\"\n\t\t\t\t onmouseout=\"this.querySelector('.gridder-mouse-over').style.display = 'none';\">\n\t\t\t\t onclick=\"{{href}}\" -->\n\n\t\t<div class=\"idea-images\"></div>\n\t\t<div class=\"idea-title\"></div>\n\t\t<div class=\"idea-summary\"></div>\n\t\t<div class=\"idea-budget\"></div>\n\t\t<div class=\"idea-extra\"></div>\n\t\t<div class=\"idea-counters\"></div>\n\t\t<div class=\"gridder-content\">\n\t\t\t<div class=\"thisIdeaId\">{{idea.id}}</div>\n\t\t\t<h3 class=\"idea-content-title\"></h3>\n\t\t</div>\n\t</li>\n</template>\n\n<ul class=\"ideas gridder\" onclick=\"this.handleClick(event)\">\n\t<slot name=\"title\"><h2>Idee\xEBn</h2></slot>\n\t<div class=\"ideas-list\">\n\t</div>\n</ul>\n<script src=\"/js/ideas-lister.js\"></script>\n\n<!--\n\n\t\t <div class=\"image-container\" style=\"position: relative;\">\n\t\t <div class=\"image\">\n\t\t <img src=\"/img/eberhardvanderlaan2/image-background.jpg\" class=\"image-background\"/>\n\t\t <div class=\"image-upload\"></div>\n\t\t <img src=\"/img/eberhardvanderlaan2/image-foreground.png\" class=\"image-foreground\"/>\n\t\t </div>\n\t\t <div class=\"gridder-mouse-over\">\n\t\t <div class=\"background\">\n\t\t </div>\n\t\t <div class=\"button-more-info{% if userHasVoted %} centered{% endif %}\">\n\t\t Bekijk dit ontwerp\n\t\t </div>\n\t\t {% if not userHasVoted %}\n\t\t <div class=\"button-vote\">\n\t\t Stem op dit ontwerp\n\t\t </div>\n\t\t {% endif %}\n\t\t </div>\n\t\t </div>\n\t\t <div class=\"info\">\n\t\t <h3>{{idea.title}}</h3>\n\t\t {{idea.yes}} {{ 'stem' if idea.yes == 1 else 'stemmen'}}\n\t\t </div>\n\t\t <script>\n\t\t {% if (idea.posterImage) and (idea.posterImage.extraData) %}\n\t\t imageUrl[{{idea.id}}] = \"{{idea.posterImageUrl}}\";\n\t\t imageData[{{idea.id}}] = {{idea.posterImage.extraData | dump | safe}};\n\t\t doShowImage({{idea.id}}, document.querySelector('#idea-{{idea.id}}'))\n\t\t {% endif %}\n\t\t </script>\n\n\t\t {% for idea in runningIdeas %}\n\t\t <div id=\"ideaContent{{idea.id}}\" class=\"gridder-content\">\n\t\t <div class=\"thisIdeaId\">{{idea.id}}</div>\n\t\t <h3 class=\"phone\">{{idea.title}}</h3>\n\t\t <div class=\"image-and-vote-button-container\">\n\t\t <div class=\"image-mask\">\n\t\t <div class=\"image-container\">\n\t\t <div class=\"image\">\n\t\t <img src=\"/img/eberhardvanderlaan2/image-background.jpg\" class=\"image-background\"/>\n\t\t <div class=\"image-upload\"></div>\n\t\t <img src=\"/img/eberhardvanderlaan2/image-foreground.png\" class=\"image-foreground\" style=\"cursor: url('/img/vergrootglas.png'), pointer;\" onclick=\"showLightbox({{idea.id}})\" onmouseover=\"if (!isPhone) document.getElementById('mask-{{idea.id}}').style.display = 'block'\"/>\n\t\t <div id=\"mask-{{idea.id}}\" style=\"position: absolute; width: 100%; height: 100%; background-color: black; opacity: 0.4; z-index: 30; display: none; cursor: url('/img/vergrootglas.png'), pointer;\" onmouseout=\"document.getElementById('mask-{{idea.id}}').style.display = 'none'\" onclick=\"showLightbox({{idea.id}})\"></div>\n\t\t </div>\n\t\t </div>\n\t\t </div>\n\t\t <div class=\"vote-button-container hasVoted{% if userHasVoted %} active{% endif %}{% if idea.yes > 10000 %} gt10000{% elif idea.yes > 1000 %} gt1000{% endif %}\">\n\t\t {% set id = 'no-of-votes-hasvoted-' + idea.id %}\n\t\t {{numberPlateButton.numberPlateButton(id, 'no-of-votes-hasvoted', '', idea.yes, '', 'transparent')}}\n\t\t <div class=\"vote-button\"></div>\n\t\t </div>\n\t\t <div class=\"vote-button-container hasNotVoted{% if not userHasVoted %} active{% endif %}{% if idea.yes > 10000 %} gt10000{% elif idea.yes > 1000 %} gt1000{% endif %}\" onclick=\"selectIdea({{idea.id}})\">\n\t\t {% set id = 'no-of-votes-hasnotvoted-' + idea.id %}\n\t\t {{numberPlateButton.numberPlateButton(id, 'no-of-votes-hasnotvoted', '', idea.yes, '', 'transparent')}}\n\t\t <div class=\"vote-button\"></div>\n\t\t </div>\n\t\t </div>\n\t\t <div class=\"content\">\n\t\t <h3 class=\"desktop\">{{idea.title}}</h3>\n\t\t <div class=\"summary\">{{idea.summary}}</div>\n\t\t <div class=\"description\">{{idea.description | safe | nl2br}}</div>\n\t\t {% if isAdmin %}\n\t\t <div class=\"description\"><a href=\"/plan/{{idea.id}}\">Bewerk dit plan</a></div>\n\t\t {% endif %}\n\t\t <div class=\"share-spacer\"></div>\n\t\t <div class=\"share-buttons\">\n\t\t <div class=\"text\">Deel dit ontwerp:</div>\n\t\t <ul class=\"share\">\n\t\t <li><a class=\"facebook\" target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u={{fullHost}}/stemmen?showIdea={{idea.id}}\">Facebook</a></li>\n\t\t <li><a class=\"twitter\"  target=\"_blank\" href=\"https://twitter.com/home?status={{fullHost}}/stemmen?showIdea={{idea.id}}\">Twitter</a></li>\n\t\t <li><a class=\"email\"    target=\"_blank\" href=\"mailto:?subject={{'Zorg goed voor onze stad ontwerp: '+idea.title | urlencode}}&body={{fullHost | urlencode}}/stemmen?showIdea={{idea.id}}\">Email</a></li>\n\t\t </ul>\n\t\t </div>\n\t\t </div>\n\t\t </div>\n\t\t {% endfor %}\n\n-->\n";
    }
  }, {
    key: "render",
    value: function render(data) {
      var self = this;

      self.shadowRoot.querySelector('.ideas').handleClick = function (e) {
        console.log('HANDLECLICK');
      };

      data.forEach(function (ideaData) {
        var template = self.shadowRoot.querySelector('#idea-template').content.cloneNode(true);
        self.renderIdea(template, ideaData);
      }); // load grinder

      var script1 = document.createElement('script'); // first: load jquery

      script1.src = '/js/jquery-3.3.1.min.js';
      script1.type = 'text/javascript';

      script1.onload = function () {
        // hele vuile hack om grinder te laten werken; nu doet jquery het verder niet meer
        var old = window.$;

        window.$ = function override(selector, that) {
          return old(self.shadowRoot.querySelectorAll(selector));
        }; // load gridder


        var script2 = document.createElement('script');
        script2.src = '/js/jquery.gridder.for.widgets.js';
        script2.type = 'text/javascript';

        script2.onload = function () {
          // init grinder
          $('.gridder').gridderExpander({
            scroll: true,
            scrollOffset: 100,
            scrollTo: "panel",
            // panel or listitem
            animationSpeed: 300,
            animationEasing: "easeInOutExpo",
            showNav: true,
            // Show Navigation
            nextText: "<span></span>",
            // Next button text
            prevText: "<span></span>",
            // Previous button text
            closeText: "",
            // Close button text                // Close button text
            onStart: function onStart(target) {
              var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging

              this.scrollOffset = isPhone ? -40 : 100;
            },
            onContent: function onContent(args) {
              var element = args[0]; // var ideaId = element.querySelector('.thisIdeaId').innerHTML;
              // window.history.replaceState({}, '', '#showidea-' + ideaId);
              // return false;
            },
            onClosed: function onClosed() {
              window.history.replaceState({}, '', '#');
            }
          });
        };

        self.shadowRoot.appendChild(script2);
      };

      self.shadowRoot.appendChild(script1);

      if (self.getAttribute('afterRenderCallback')) {
        // console.log(`${self.getAttribute('afterRenderCallback')}(self)`);
        eval("".concat(self.getAttribute('afterRenderCallback'), "(self)"));
      }
    }
  }, {
    key: "renderIdea",
    value: function renderIdea(template, data) {
      var self = this;
      template.querySelector('li').id = 'idea-' + data.id;
      template.querySelector('li').setAttribute('data-griddercontent', '#idea-content-' + data.id);
      template.querySelector('.idea-extra').innerHTML = 'Niels is gek';
      template.querySelector('.idea-content-title').innerHTML = data.title;
      var gridderContent = template.querySelector('li').querySelector('.gridder-content');
      gridderContent.id = 'idea-content-' + data.id;
      gridderContent.querySelector('.thisIdeaId').innerHTML = data.id;

      _get(_getPrototypeOf(IdeasGridderWidget.prototype), "renderIdea", this).call(this, template, data);
    }
  }]);

  return IdeasGridderWidget;
}(IdeasWidget);

customElements.define('ideas-gridder-widget', IdeasGridderWidget);