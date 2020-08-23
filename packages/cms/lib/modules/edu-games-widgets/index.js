const styleSchema = require('../../../config/styleSchema.js').default;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Edu Games',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Titel',
      required: true
    },
    {
      name: 'game',
      type: 'select',
      label: 'What game?',
      choices: [
        {
          label: 'Memory',
          value: 'memory',
          showFields: ['memoryCards', 'maxMemoryCardPairs']
        },
        {
          label: 'Quiz',
          value: 'quiz',
          showFields: ['quizQuestions', 'shuffleQuizQuestions']
        },
/*        {
          label: 'Vote count (not)',
          value: 'voteCount',
        },
        {
          label: 'Arguments count',
          value: 'argumentsCount',
        },
        */
      ]
    },
    {
      name: 'memoryCards',
      type: 'array',
      label: 'Memory cards',
      titleField: 'name',
      schema: [
        {
          name: 'name',
          label: 'Name',
          required: true,
          type: 'string',
        },
        {
          name: 'image',
          type: 'attachment',
          label: 'Image',
          required: true,
          trash: true
        },
        {
          name: 'sound',
          type: 'attachment',
          label: 'Sound (not implemented yet, if added will turn on automatically)',
          trash: true
        },
      ]
    },
    {
      name: 'maxMemoryCardPairs',
      type: 'string',
      label: 'Max memorycard pairs',
      required: true
    },
    {
      name: 'quizQuestions',
      type: 'array',
      label: 'Quiz questions',
      titleField: 'name',
      schema: [
        {
          name: 'title',
          label: 'Title',
          required: true,
          type: 'string',
        },
        {
          name: 'displayTitle',
          type: 'boolean',
          label: 'Display Title',
          def: true,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Type',
          required: true,
          choices: [
            {
              label: 'Standard',
              value: 'standard',
            },
            {
              label: 'Drag 1 answer (not yet done)',
              value: 'text',
              showFields: ['drag_one']
            },
            {
              label: 'Drag multiple words (not yet done)',
              value: 'text',
              showFields: ['drag_multiple']
            },
          ]
        },
        {
          name: 'image',
          type: 'attachment',
          label: 'Image ',
          trash: true
        },
        {
          name: 'sound',
          type: 'attachment',
          label: 'Sound',
          trash: true,
          image: false,
        },
        {
          name: 'answers',
          type: 'array',
          titleField: 'label',
          label: 'Answers',
          schema: [
            {
              name: 'label',
              label: 'Text',
              required: true,
              type: 'string',
            },
            {
              name: 'isCorrect',
              label: 'Is correct answer?',
              required: true,
              type: 'boolean',
              def: false
            },
            {
              name: 'image',
              type: 'attachment',
              label: 'Image ',
              trash: true
            },
            {
              name: 'sound',
              type: 'attachment',
              label: 'Sound',
              trash: true,
              image: false,
            }
          ]
        },
        {
          name: 'shuffleQuizQuestions',
          type: 'boolean',
          label: 'Shuffle Quiz Questions?',
          def: false
        },
      ]
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
        });

        return superLoad(req, widgets, function (err) {
            if (err) {
                return callback(err);
            }
            // `widgets` is each widget of this type being loaded on a page
            widgets.forEach(function (widget) {
                // do something cool, attach it to widge
            });
            return callback(null);
        });
    };



    const superOutput = self.output;
    self.output = function(widget, options) {
      widget.activeMemoryCards = [];

      if (widget.memoryCards && widget.memoryCards.length > 0) {
        // shuffle cards
        widget.activeMemoryCards = shuffle(widget.memoryCards);

        // if max isset slice the cards.
        widget.activeMemoryCards = widget.maxMemoryCardPairs ? widget.activeMemoryCards.slice(0, parseInt(widget.maxMemoryCardPairs)) : widget.activeMemoryCards;
      }


      /*
        activeQuizQuestions
       */
      widget.activeQuizQuestions  = [];

      if (widget.quizQuestions && widget.quizQuestions.length > 0) {
        widget.activeQuizQuestions = widget.shuffleQuizQuestions ? shuffle(widget.quizQuestions) : widget.quizQuestions;
      }

      var result = superOutput(widget, options);
      return result;
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'memory', { when: 'always' });
      self.pushAsset('stylesheet', 'quiz', { when: 'always' });
      self.pushAsset('stylesheet', 'main', { when: 'always' });

      self.pushAsset('script', 'memory', { when: 'always' });
      self.pushAsset('script', 'quiz', { when: 'always' });
      self.pushAsset('script', 'quiz-init', { when: 'always' });
    };
  }
};
