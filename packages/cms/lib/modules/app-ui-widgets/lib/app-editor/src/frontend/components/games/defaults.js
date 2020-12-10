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
    },
    {
      id: 2,
      text: '',
      image: {
          src: "http://localhost:3333/image/circle1.png",
          width: 136,
          height: 127
      },
    },
    {
      id: 3,
      text: '',
      image: {
          src: "http://localhost:3333/image/circle1.png",
          width: 136,
          height: 127
      },
    }


    ],
    correctAnswerId: false
  }]
};

exports.shapeRecognitionDefaults = {
  backgroundImage:  "http://localhost:3333/image/robot_bg.png",
  questions: [{
    id: 2,
    title:  false,

    image: {
        src: "http://localhost:3333/image/robot_triangle.png",
        width: 248,
        height: 245
    },
    answers:[{
      id: 1,
      text: '',
      image: {
          src: "http://localhost:3333/image/circle1.png",
          width: 136,
          height: 127
      },
    }],
    correctAnswerId: null
  },
  {
      id: 3,
      title:  false,
      image: {
          src: "http://localhost:3333/image/robot_circle.png",
          width: 248,
          height: 245
      },
      answers:[{
        id: 1,
        text: '',
        image: {
            src: "http://localhost:3333/image/circle1.png",
            width: 136,
            height: 127
        },
      }],
    correctAnswerId: 1
  },
    {
      id: 4,
      title:  false,
      image: {
          src: "http://localhost:3333/image/robot_square.png",
          width: 248,
          height: 245
      },
      answers:[{
        id: 1,
        text: '',
        image: {
            src: "http://localhost:3333/image/circle2.png",
            width: 136,
            height: 127
        },
      }
    ],
    correctAnswerId: null
  },
  {
    id: 5,
    title:  false,
    image: {
        src: "http://localhost:3333/image/robot_triangle.png",
        width: 248,
        height: 245
    },
    answers:[{
      id: 1,
      text: '',
      image: {
          src: "http://localhost:3333/image/triangle.png",
          width: 136,
          height: 127
      },
    }],
    correctAnswerId: 1
  },
  {
    id: 6,
    title:  false,
    image: {
        src: "http://localhost:3333/image/robot_square.png",
        width: 248,
        height: 245
    },
    answers:[{
      id: 1,
      text: '',
      image: {
          src: "http://localhost:3333/image/triangle.png",
          width: 136,
          height: 127
      },
    }],
    correctAnswerId: 1
  }
]}
