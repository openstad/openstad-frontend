import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeBackgroundImage } from "../../presentation";
import { View, Text, Button, TouchableHighlight, Image } from "react-native";

const centeredStyles = {
  position: 'absolute',
  margin: 'auto',
  width: 50,
  height: 150
}

const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const QuizEnd = (props) => {
  return (
    <View style={centeredStyles}>
      <Text> Quiz finished! </Text>
      <Button onPress={props.start} title="Start" />
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
      <Button onPress={props.start} title="Start" />
    </View>
  )
}

const QuizQuestion = ({giveAnswer, question}) => {
  return (<>
    <Question title={question.title} image={question.image}   />
    <Answers giveAnswer={giveAnswer} question={question} answers={question.answers}/>
  </>)
}

const Answers = ({answers, giveAnswer, question}) => {
  return (
    <View>
      {answers.map((answer) => {
        const {text, image} = answer;
        return (
          <TouchableHighlight onPress={(answer) => giveAnswer(question, answer)}>
            <View>
              {text && <Text>{text}</Text>}
              {image && <Image src={{uri: image.src}} style={{height: image.height, width: image.width}}  />}
            </View>
          </TouchableHighlight>
        )
      })}
    </View>
  )
}

const Question = ({title, image}) => {
  return (
    <View>
      {title && <Text>{title}</Text>}
      {image && <Image src={{uri: image.src}} style={{height: image.height, width: image.width}}  />}
    </View>
  )
}

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.answerFeedbackDisplayTime = 3000;

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

  giveAnswer(question, answerId) {
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


  //  if (!this.props.autoNext) {
      setTimeout(() => {
        this.setNextQuestion();
      }, this.answerFeedbackDisplayTime)
  //  }
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

  setNextQuestion() {
    const activeQuestionIndex = this.state.activeQuestion ? this.state.questions.map(function(e) { return e.id; }).indexOf(this.state.activeQuestion.id) : false;
    const nextActiveViewstepIndex = activeQuestionIndex ? activeQuestionIndex + 1 : 0;
    const nextActiveQuestion = this.props.questions[nextActiveViewstepIndex] ? this.props.questions[nextActiveViewstepIndex] : false;


    this.setState({
      finished: !nextActiveQuestion,
      activeQuestion: nextActiveQuestion,
      activeQuestionIndex: nextActiveViewstepIndex
    });

    // this get next question automatic, despite answer
    if (false && this.props.autoNext) {
      setTimeout(() => {
        this.getNextQuestion();
      }, this.props.autoNext);
    }
  }

  start () {
    this.setState({
      quizSession: {
        ...this.state.quizSession,
        startedAt: new Date().toISOString()
      }
    })

    this.setNextQuestion();
  }

  render () {
    console.log('this.state.activeQuestion', this.state.activeQuestion)

    return (
      <SafeBackgroundImage backgroundImage={this.props.backgroundImage}>
        {!this.state.activeQuestion && <QuizStart start={this.start.bind(this)} />}
        {this.state.activeQuestion && <QuizQuestion question={this.state.activeQuestion} giveAnswer={this.giveAnswer.bind(this)} />}
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
