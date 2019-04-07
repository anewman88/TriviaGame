var DebugOn = true;

   //*******************************************************************
   //*  Global Variable Declarations
   //********************************************************************
   var CorrectCount = 0;     // integer - number of questions answered correctly
   var WrongCount = 0;       // integer - number of questions answered incorrecttly
   var UnAnswCount = 0;      // integer - number of questions unanswered
   var MaxQuestionInt = 15;  // integer - The max amount of time in seconds to answer a question
   var QuestionTmRemain = 0; // integer - amount of time left the user has to answer a question
   var QuestionIntId;        // ???  - Interval Id for question timer
   var MaxAnswerInt = 3;     // integer - The max amount of time in seconds to show answer
   var AnswerTmRemain = 0;   // integer - amount of time left to show the displayed answer
   var AnswerIntId;          // ??? - Interval Id for the answer timer
   var CurQuestionIndex = 0; // Integer - index of current question in question array
   var OneSecond = 1000;     // Integer - Interval time
   var CurQuestion = 0;      // Integer - Current Question pointer to object

   QuestArray = [
    { QText: "How many eyes does a no-eyed, big-eyed wolf spider have?", 
      AText: ["No eyes", "No eyes, but big ones", "One eye that doesn't work", "144 eyelike warts"], CorrectAnswer: 0 },
    { QText: "How many toes does a two-toed sloth have?", 
      AText: ["Two", "Four", "Six or Eight", "None"], CorrectAnswer: 2 },
    { QText: "What is the biggest thing a blue whale can swallow?", 
      AText: ["A small family car", "A very large mushroom", "A sailor", "A grapefruit"], CorrectAnswer: 3 },
    { QText: "What bird lays the smallest egg for its size?", 
      AText: ["An ostrich", "A chicken", "A goose", "A sparrow"], CorrectAnswer: 0 },
    { QText: "Which of the followng are Chinese inventions?", 
      AText: ["Glass", "Rickshaws", "Chop suey", "None of the above", "All of the above"], CorrectAnswer: 2 },
    { QText: "True or False - The French invented champagne?", 
      AText: ["True", "False"], CorrectAnswer: 1 },
    { QText: "Which metal is liquid at room temperature?", 
      AText: ["Mercury", "Gallium", "Caesium", "Francium", "All of the above"], CorrectAnswer: 4 },
    { QText: "Where is the highest known mountain?", 
      AText: ["Earth", "Mars", "Venus", "Saturn"], CorrectAnswer: 1 },
    { QText: "True or False - The direction water swirls when flushed depends on which hemisphere it's flushed?", 
      AText: ["True", "False"], CorrectAnswer: 1 },
    { QText: "Which one of the following was NOT invented by Thomas Crapper?", 
      AText: ["The manhole cover", "The bathroom showroom", "The ballcock", "The flush toilet"], CorrectAnswer: 3 }
   ] 

//***************************************************************
//Function for displaying the input question
function DisplayQuestion(CurQuesNum) {

   // Clear the Question and Answer Sections and turn on the Display area DIV
   $("#DisplayAreaDIV").show();

   // Display the question
   CurQuestion = QuestArray[CurQuesNum];
   $("#QuestionID").text("Q"+(CurQuesNum+1)+": " + CurQuestion.QText);

   // Dynamically display the Answers
   // Create a pointer to the Answer Div
   var NewAnswerDiv = $("#AnswerID");

   // Append each answer line
   for (var i = 0; i < CurQuestion.AText.length; i++) {
   
      var NewAnswer = $("<div>").text(CurQuestion.AText[i]);
      NewAnswer.attr("class", "AnswClass");
      NewAnswer.attr("isansw", i);
      NewAnswer.attr("id", "AnswID"+i);

      // if this is the correct answer then send true to AnswerClickFunction() 
      if (i === CurQuestion.CorrectAnswer) {
         NewAnswer.attr("onclick", "AnswerClickFunction("+true+")");
      }
      else {  // if not the correct answer send false to AnswerClickFunction()
         NewAnswer.attr("onclick", "AnswerClickFunction("+false+")");
      }
      NewAnswerDiv.append(NewAnswer);
      if (DebugOn) console.log ("Answer: " + CurQuestion.AText[i]);
   }

   $("#UserMessageID").show();
   $("#UserMessageID").text("Click on your answer");

} // function DisplayQuestion()

//********************************************************************
//  Function to display the final results
function DisplayResults () {

  /* Turn off unused display areas */
  $("#DisplayAreaDIV").hide();
  $("#TimerDIV").hide();

  // Show the quiz results
  $("#ScoreAreaDIV").show();
  $("#CorrectID").text("Correct: " + CorrectCount);
  $("#WrongID").text("Wrong: " + WrongCount);
  $("#UnAnswID").text("Unanswered: " + UnAnswCount);

  // Instruct the user
  $("#UserMessageID").text("Press the Start button to take the quiz again");
 
  // Enable the Instruction and Start Buttons
  $("#InstructBTN").show();
  $("#StartBTN").show();
  $("#StopBTN").hide();

} // function DisplayResults()   

//***************************************************************
//Function for decrimenting the question timer
function DecrQuestionTmr() {

  if(DebugOn) console.log ("In DecrQuestionTmr()");

  //  Decrease the timer by one.
  QuestionTmRemain--;

  //  Show the time remaining on screen.
  $("#DispTimerID").text(QuestionTmRemain + " Seconds");

  //  If the question time is up...
  if (QuestionTmRemain === 0) {

    //  stop/clear the Question Interval
    clearInterval(QuestionIntId);

    // Increment the un-answered count
    UnAnswCount++;

    // Display to user that time is up
    $("#UserMessageID").text("Time's Up!!");

    // Display only the correct answer 
    for (var i = 0; i < CurQuestion.AText.length; i++) {
      // if this is not the correct answer then clear that answer 
      if (i !== CurQuestion.CorrectAnswer) {
        $("#AnswID"+i).hide();
      }
    }

    // start the Answer Interval Timer
    $("#TimerDIV").hide();
    AnswerTmRemain = MaxAnswerInt;
    clearInterval(AnswerIntId);
    AnswerIntId = setInterval(DecrAnswerTmr, OneSecond);

  }  // if (QuestionTmRemain)

} // function DecrQuestionTmr()

//***************************************************************
//Function for decrimenting the answer timer
function DecrAnswerTmr() {
if(DebugOn) console.log ("In DecrAnswerTmr()");

  //  Decrease the timer by one.
  AnswerTmRemain--;

  //  Once the display answer timer is zero...
  if (AnswerTmRemain === 0) {

    //  stop/clear the Answer Interval
    clearInterval(AnswerIntId);

    // Clear the Answer screen
    $("#AnswerID").empty();

    // Display the next question as long as there is another question
    CurQuestionIndex++;
    if (CurQuestionIndex < QuestArray.length) {
      DisplayQuestion(CurQuestionIndex);

      // Start the Question Interval Timer
      QuestionTmRemain = MaxQuestionInt;
      $("#TimerDIV").show();
      $("#DispTimerID").text(QuestionTmRemain + " Seconds");
      clearInterval(QuestionIntId);
      QuestionIntId = setInterval(DecrQuestionTmr, OneSecond);
    }
    else {  // All the questions have been asked. 
      // Stop all the timers 
      clearInterval(QuestionIntId);
      clearInterval(AnswerIntId);

      // Display the final results page
      DisplayResults();
    }
  
  }  // if (AnswerTmRemain === 0)
} // function DecrQuestionTmr()

//***************************************************************
//Function for managing the click of an answer
function AnswerClickFunction(IsCorrect) {
   
  if (DebugOn) console.log ("in AnswerClickFunction() Answer Pressed: " + IsCorrect );

  // Stop the Question interval timer
  clearInterval(QuestionIntId);
  
  
  //  Check if the user clicked the correct answer. The value is passed into
  //  the function depending on which question they clicked
  if (IsCorrect) {
    CorrectCount++;
    $("#UserMessageID").text("Correct!!");
  }
  else { // The answer was wrong
    WrongCount++;
    $("#UserMessageID").text("Wrong!!");
  }
  
  // Display only the correct answer 
  for (var i = 0; i < CurQuestion.AText.length; i++) {
    // if this is not the correct answer then clear that answer 
    if (i !== CurQuestion.CorrectAnswer) {
      $("#AnswID"+i).hide();
    }
  }

  // start the Answer Interval Timer
  AnswerTmRemain = MaxAnswerInt;
  clearInterval(AnswerIntId);
  $("#TimerDIV").hide();
  AnswerIntId = setInterval(DecrAnswerTmr, OneSecond);

 } // AnswerClickFunction()


//*******************************************************************
// Use the ready() function to wait for the DOM (document object model) to be loaded
//*******************************************************************
$(document).ready(function() {
  if (DebugOn) console.log ("Start of document.ready");

//****************************************************************************
//Function for the Instruction Button
$("#InstructBTN").on("click", function() {
  alert("Instructions:\n\nThis trivia quiz comes from The Book of General Ignorance by John Lloyd & John Mitchinson. Once each question is posted, you will have a limited amount of time to click on your answer. \n\nPress the 'Start' button to begin. \n\nGood Luck!");
}); // function InstructBTN click

//****************************************************************************
//Function for the Stop Button
$("#StopBTN").on("click", function() {

  // stop both of the interval timers
  clearInterval(QuestionIntId);
  clearInterval(AnswerIntId);

  $("#StopBTN").hide();

  DisplayResults();

  if(DebugOn) console.log ("Stopped the Timers");
  
});  // function StopBTN click

//****************************************************************************
//Function for the Start Button
$("#StartBTN").on("click", function() {
  if(DebugOn) console.log ("In StartBTN on click");

  // Initialize all the variables 
  CorrectCount = 0;  // integer - number of questions answered correctly
  WrongCount = 0;    // integer - number of questions answered incorrecttly
  UnAnswCount = 0;   // integer - number of questions unanswered
  QuestionTmRemain = 0;// integer - amount of time left the user has to answer a question
  AnswerTmRemain = 0;  // integer - amount of time left to show the displayed answer
  CurQuestionIndex = 0; // Integer - index of current question in question array
  CurQuestion = 0;   // Integer - Current Question index or pointer to object?????

  // Hide the Instruction and Start Buttons and show the stop button
  $("#InstructBTN").hide();
  $("#StartBTN").hide();
  $("#StopBTN").show();

  // Clear the score display
  $("#ScoreAreaDIV").hide();

  // clear and reset the Question and Answer fields
  $("#QuestionID").empty();
  $("#AnswerID").empty();
  $("#QuestionID").show();
  $("#AnswerID").show();

  // Turn on the User Message display
  $("#UserMessageID").show();
  
  // Start the question interval timer 
  QuestionTmRemain = MaxQuestionInt;
  $("#DispTimerID").text(QuestionTmRemain + " Seconds");

  clearInterval(QuestionIntId);
  $("#TimerDIV").show();
  QuestionIntId = setInterval(DecrQuestionTmr, OneSecond);

  if(DebugOn) console.log ("Started the Question Timer");

  // Show the first question
  CurQuestion = 0;
  DisplayQuestion(CurQuestion);

});  // function StartBTN click

//*********************************************************************************
//  Debug function to display the question array
function ConsoleQuestionArray () {

  for (var i = 0; i<QuestArray.length; i++){
    console.log (QuestArray[i]);
  }
}

//*********************************************************************************
// Initialize the text portion of the display

$("#TimerDIV").hide();
$("#ScoreAreaDIV").hide();
$("#DisplayAreaDIV").hide();
$("#UserMessageID").hide();

// Hide the stop button to begin 
$("#StopBTN").hide();

if (DebugOn) ConsoleQuestionArray();
//*********************************************************************************
});  // $(document).ready(function())
