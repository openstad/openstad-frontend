import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeBackgroundImage } from "../../presentation";
import { View, Text, Button, TouchableHighlight, Image } from "react-native";

const centeredStyles = {
  position: 'absolute',
  margin: 'auto',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  zIndex: 10
}


const positionStyles = {
  top: {
    position: 'absolute',
    margin: 'auto',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    top: '0',
    height: '50%',
  },
  bottom: {
    position: 'absolute',
    margin: 'auto',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    height: '50%',
  },
  center: centeredStyles,
  bottomLeft : {
    position: 'absolute',
    margin: 'auto',
    width: '100%',
    justifyContent: 'left',
    alignItems: 'bottom',
    top: '50%',
    height: '50%',
  }
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
      <Button onPress={props.start} title="Restart" />
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

const QuizQuestion = ({giveAnswer, question, questionPosition, answerPosition}) => {
  return (<>
    <Text> Question: {question.id} </Text>
    <Question title={question.title} position={questionPosition} image={question.image}   />
    <Answers giveAnswer={giveAnswer} position={answerPosition} question={question} answers={question.answers}/>
  </>)
}

const Answers = ({answers, giveAnswer, question, position}) => {
  return (
    <View style={positionStyles[position]}>
      {answers.map((answer, key) => {
        const {text, image} = answer;
        return (
          <TouchableHighlight key={key} onPress={(answer) => giveAnswer(question, answer)}>
            <View>
              {text && <Text>{text}</Text>}
              {image && <Image source={{uri: image.src}} style={{height: image.height, width: image.width}}  />}
            </View>
          </TouchableHighlight>
        )
      })}
    </View>
  )
}

const Question = ({title, image, position}) => {
  return (
    <View style={positionStyles[position]}>
      {title && <Text>{title}</Text>}
      {image && <Image source={{uri: image.src}} style={{height: image.height, width: image.width}} />}
    </View>
  )
}

const AnswerTime =  ({time}) => {
  return (
    <View style={positionStyles.bottomLeft}>
      {time && <Text> Answertime left: {time}</Text>}
    </View>
  )
}

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.answerFeedbackDisplayTime = 400;


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
    if (this.isQuestionAnswered(question)) {

    } else {
      const quizSession = this.state.quizSession;
      const isCorrect = question.correctAnswerId === answerId;

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


  //    if (!this.props.autoNext) {
      setTimeout(() => {
        this.setNextQuestion();
      }, 3000)
    }
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
    this.syncQuizSession()

    if (this.state.wrong || this.state.correct) {
      console.log('componentDidUpdate run time out');

     setTimeout(()=> {
        console.log('hideAnswerFeedback run time out');

        this.hideAnswerFeedback();
      }, this.answerFeedbackDisplayTime)
    }
  }

  hideAnswerFeedback () {
    console.log('hideAnswerFeedback run time out');

    this.setState({
      wrong: false,
      correct: false,
    });
  }

  syncQuizSession () {
    // @todo sync the quiz session
  }

  setNextQuestion() {
    console.log('===== next');

    if (this.nextAnswerTimeout) {
      clearTimeout(this.nextAnswerTimeout);
    }

    if (this.timeLeftInterval) {
      clearInterval(this.timeLeftInterval);
    }


    const activeQuestionIndex = this.state.activeQuestion ? this.state.questions.map(function(e) { return e.id; }).indexOf(this.state.activeQuestion.id) : false;
    const nextActiveViewstepIndex = activeQuestionIndex === false && !this.state.finished ? 0 :  activeQuestionIndex + 1;
    const nextActiveQuestion = this.state.questions[nextActiveViewstepIndex] ? this.state.questions[nextActiveViewstepIndex] : false;
    const finished = !nextActiveQuestion;

    console.log('activeQuestionIndex',this.state.questions.map(function(e) { return e.id; }), this.state.questions.map(function(e) { return e.id; }).indexOf(this.state.activeQuestion.id), activeQuestionIndex );

    this.setState({
      finished: !nextActiveQuestion,
      activeQuestion: nextActiveQuestion,
      activeQuestionIndex: nextActiveViewstepIndex
    });

    // this get next question automatic, despite answer
    if (!finished && this.props.autoNext) {
      const SECOND = 1000;

      if (this.timeLeftInterval) {
        clearInterval(this.timeLeftInterval);
      }

      const setTimer = () => {
        const timeLeft = this.state.answerTimeLeft ? this.state.answerTimeLeft - SECOND : this.props.autoNext;

        //console.log('this.props.autoNext', this.props.autoNext)
        this.setState({
          'answerTimeLeft': timeLeft
        });

        if (!timeLeft) {
          clearInterval(this.timeLeftInterval)
        }
      }

      setTimer();

      this.timeLeftInterval = setInterval(setTimer, SECOND);

      if (this.nextAnswerTimeout) {
        clearTimeout(this.nextAnswerTimeout);
      }

      this.nextAnswerTimeout = setTimeout(() => {
        //give an empty answers
        this.giveAnswer(nextActiveQuestion, null);
        //
        //this.setNextQuestion();
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

  getAnswerForQuestion (question) {
    return this.state.quizSession.answers.find(answer => answer.questionId === question.id);
  }

  isQuestionAnswered (question) {
    console.log(' this.state.quizSessio',  this.state.quizSession);
    console.log(' this.state.getAnswerForQuestion',  this.getAnswerForQuestion(question));

    return !! this.getAnswerForQuestion(question);
  }

  render () {
    return (
      <SafeBackgroundImage backgroundImage={this.props.backgroundImage} style={{flex: 1}}>
        {!this.state.activeQuestion && !this.state.finished && <QuizStart start={this.start.bind(this)} />}
        {!this.isQuestionAnswered(this.state.activeQuestion) && this.state.activeQuestion && <QuizQuestion questionPosition={this.props.questionPosition} answerPosition={this.props.answerPosition} question={this.state.activeQuestion} giveAnswer={this.giveAnswer.bind(this)} />}
        {this.state.wrong && <WrongAnswer />}
        {this.state.correct && <CorrectAnswer />}
        { this.state.finished && <QuizEnd start={this.start.bind(this)} />}
        {this.props.autoNext && this.props.displayAnswerTime && <AnswerTime time={this.state.answerTimeLeft} />}
      </SafeBackgroundImage>
    )
  }
}

Quiz.propTypes = {
  questions: PropTypes.array,
  shuffle: PropTypes.bool,
  autoNext: PropTypes.number,
  backgroundImage:  PropTypes.string,
};

export default Quiz;
