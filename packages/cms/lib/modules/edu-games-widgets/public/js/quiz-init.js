
if ($('#quiz').length > 0 ) {
    $('#quiz').quiz({
      //resultsScreen: '#results-screen',
      //counter: false,
      homeButton: '#custom-home',
      counterFormat: 'Vraag %current van %total',
      allowIncorrect: true,
      questions: quizQuestions,
      nextButtonText: 'Volgende'
    });
}
