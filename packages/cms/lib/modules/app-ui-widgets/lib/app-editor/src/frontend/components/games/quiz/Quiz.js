import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeBackgroundImage } from "../../presentation";
import { View, Text, Button } from "react-native";


const shuffle = useCallback((items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}, [])

const Answers = ({answers}) => {

}

const QuizEnd = ({answers}) => {

}

const CorrectAnswer = () => {

}

const WrongAnswer = () => {

}

const QuizStart = (props) => {
  return <>
    <Button onPress={props.start}> Start </button>
  </>
}

const QuizQuestion = ({answers}) => {
  return <>
    <Question />
    <Answers />
  </>
}


class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizSession : {
        startedAt: null,
        finishedAt:
        answers: [], 
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

  giveAnswer(questionId, answerId) {
    const question
    const


  }

  setQuestions() {
    let questions =  this.props.questions;

    if (this.props.shuffle) {
      questions = shuffle(questions);
    }

    this.setState({
      questions: questions
    });
  }

  getNextQuestion() {
    const activeQuestionIndex = activeQuestion ?  this.state.questions.map(function(e) { return e.id; }).indexOf(activeQuestion.id) : false;
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
      activeQuestion: this.getNextQuestion()
    })
  }

  render () {
    return (
      <SafeBackgroundImage backgroundImage={this.props.backgroundImage}>
        {!this.state.activeQuestion && <QuizStart start={this.start.bind(this)} />}
        {this.state.activeQuestion && <QuizQuestion question={this.state.activeQuestion} giveAnswer={this.giveAnswer.bind(this)} />}
        {this.state.wrongAnswer && <WrongAnswer />}
        {this.state.correctAnswer && <CorrectAnswer />}
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
