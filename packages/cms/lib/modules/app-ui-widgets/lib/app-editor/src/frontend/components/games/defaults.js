exports.hiddenImagesQuizDefaults = {
  questions: [{
    id: 1,
    title: {
      text: 'Triangle',
      image: {
        src: "",
        width: 120,
        height: 120
      }
    },
    answers:[{
      id: 1,
      text: '',
      image: ''
    }],
    correctAnswerId: false
  }]
};

exports.shapeRecognitionDefaults = {
  questions: [{
    id: 2,
    title:  'What shape?',
    imageFalse: {
        src: "",
        width: 120,
        height: 120
    },
    answers:[{
      id: 1,
      text: 'Triangle',
      image: ''
    }],
    correctAnswerId: 1
  }]
}
