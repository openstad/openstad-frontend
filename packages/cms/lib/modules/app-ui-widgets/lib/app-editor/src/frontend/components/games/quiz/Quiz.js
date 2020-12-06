import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeBackgroundImage } from "../../presentation";
import { View, Text, Button } from "react-native";

const centeredStyles = {
  position: 'absolute',
  margin: 'auto',
  width: 50,
  height: 150
}

const shuffle = useCallback((items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}, []);

const QuizEnd = ({answers}) => {
  return (
    <View style={centeredStyles}>
      <Text> Quiz finished! </Text>
      <Button onPress={props.start}> Start </button>
    </View>
  )
}

const CorrectAnswer = () => {
  return (
    <View style={centeredStyles}>
      <Text> Correct! </Text>
    </View>
  )
}

const WrongAnswer = () => {
  return (
    <View style={centeredStyles}>
      <Text> Wrong! </Text>
    </View>
  )
}

const QuizStart = (props) => {
  return (
    <View style={centeredStyles}>
      <Button onPress={props.start}> Start </button>
    </View>
  )
}

const QuizQuestion = ({giveAnswer, question}) => {
  return (<>
    <Question text={question.text} image={question.image}   />
    <Answers giveAnswer={answer} question={question} answers={question.answers}/>
  </>
}

const Answers = ({answers, giveAnswer, question}) => {
  return (
    <View>
      {answers.map((answer) => {
        <TouchableHightlight onPress={(answer) => giveAnswer(question, answer)}>
          {text && <Text>{text}</Text>}
          {image && <Image src={{uri: image.src}} style={{height: image.height, width: image.width}}  />}
        </TouchableHightlight>
      })}
    </View>
  )
}

const Question = ({text, image}) => {
  return (
    <View>
      {text && <Text>{text}</Text>}
      {image && <Image src={{uri: image.src}} style={{height: image.height, width: image.width}}  />}
    </View>
  )
}

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.answerFeedbackDisplayTime = 5000;

    this.state = {
      quizSession : {
        startedAt: null,
        finishedAt: null,
        answers: []
      },
      activeQuestion: false,
      finished: false,
      questions: []
    };
  }


  componentDidMount() {
    this.init();
  }

  // set configuration
  init() {
    this.setQuestions();
  }

  answer(question, answerId) {
    const quizSession = this.state.quizSession;
    const isCorrect = question.id === answerId;

    quizSession.answers.push({
      answerId: answerId,
      //safe question for reference purposes in case it's changed later on
      question: question,
      answeredAt: new Date().toISOString(),
      isCorrect
    });

    this.setState({
      quizSession: quizSession,
      wrong: !isCorrect,
      correct: isCorrect,
    });
  }

  setQuestions() {
    let questions = this.props.questions;

    if (this.props.shuffle) {
      questions = shuffle(questions);
    }

    this.setState({
      questions: questions
    });
  }

  componentDidUpdate () {
    this.syncQuizSession();

    if (this.state.wrongAnswer || this.state.correctAnswer) {
      this.setTimeout(this.hideAnswerFeedback, this.answerFeedbackDisplayTime)
    }
  }

  hideAnswerFeedback () {
    this.setState({
      wrong: false,
      correct: false,
    });
  }

  syncQuizSession () {
    // @todo sync the quiz session
  }

  getNextQuestion() {
    const activeQuestionIndex = this.state.activeQuestion ? this.state.questions.map(function(e) { return e.id; }).indexOf(activeQuestion.id) : false;
    const nextActiveViewstepIndex = activeQuestionIndex + 1;
    const nextActiveQuestion = this.props.questions[nextActiveViewstepIndex] ? this.props.questions[nextActiveViewstepIndex] : false;

    setState({
      finished: !nextActiveQuestion,
      activeQuestion: nextActiveQuestion,
      activeQuestionIndex: nextActiveViewstepIndex
    });

    // this get next question automatic, despite answer
    if (this.props.autoNext) {
      setTimeout(() => {
        this.getgetNextQuestion();
      }, this.props.autoNext);
    }
  }

  start () {
    this.setSetstate({
      quizSession: {
        ...this.state.quizSession,
        startedAt: new Date().toISOString()
      },
      activeQuestion: this.getNextQuestion()
    })
  }

  render () {
    return (
      <SafeBackgroundImage backgroundImage={this.props.backgroundImage}>
        {!this.state.activeQuestion && <QuizStart start={this.start.bind(this)} />}
        {this.state.activeQuestion && <QuizQuestion question={this.state.activeQuestion} giveAnswer={this.answer.bind(this)} />}
        {this.state.wrong && <WrongAnswer />}
        {this.state.correct && <CorrectAnswer />}
        {this.state.finished && <QuizEnd />}
      </SafeBackgroundImage>
    )
  }
}

Quiz.propTypes = {
  questions: PropTypes.object,
  shuffle: PropTypes.bool,
  autoNext: PropTypes.number,
  backgroundImage:  PropTypes.string,
};

export default Quiz;
