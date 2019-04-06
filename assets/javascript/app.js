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

// Clear the Question and Answer Sections
$("#QuestionID", "#AnswerID", "#UserMessageID").empty();

// Display the question
CurQuestion = QuestArray[CurQuesNum];
$("#QuestionID").text("Q"+(CurQuesNum+1)+": " + CurQuestion.QText);

// Dynamically display the Answers
// Create a pointer to the Answer Div
var NewAnswerDiv = $("#AnswerID");

for (var i = 0; i < CurQuestion.AText.length; i++) {
 
  var NewAnswer = $("<div>").text(CurQuestion.AText[i]);
  NewAnswer.attr("class", "AnswClass");
  NewAnswer.attr("isansw", i);
  NewAnswer.attr("id", "AnswID"+i);

  // if this is the correct answer then send true to MyClickFunction() 
  if (i === CurQuestion.CorrectAnswer) {
    NewAnswer.attr("onclick", "MyClickFunction("+true+")");
  }
  else {
    NewAnswer.attr("onclick", "MyClickFunction("+false+")");
  }
  NewAnswerDiv.append(NewAnswer);
  console.log ("Answer: " + CurQuestion.AText[i]);
}
$("#UserMessageID").text("Click on the best answer");

} // function DisplayQuestion()

//********************************************************************
//  Function to display the final results
function DisplayResults () {

  $("#CorrectID").text("Correct: " + CorrectCount);
  $("#WrongID").text("Wrong: " + WrongCount);
  $("#UnAnswID").text("Unanswered: " + UnAnswCount);

  $("#QuestionID").empty();
  $("#AnswerID").empty();
  $("#UserMessageID").text("Press the Start button to play again");

  $("#QuestionID").hide();
  $("#AnswerID").hide();
 
  // Enable the Instruction and Start Buttons
  $("#InstructBTN").show();
  $("#StartBTN").show();

} // Display Results 

//***************************************************************
//Function for decrimenting the question timer
function DecrQuestionTmr() {

if(DebugOn) console.log ("In DecrQuestionTmr()");
  //  Decrease the timer by one.
  QuestionTmRemain--;

  //  Show the time remaining on screen.
  $("#DispTimerID").html("<h2>" + "Time Remaining: " + QuestionTmRemain + "</h2>");

  //  Once number hits zero...
  if (QuestionTmRemain === 0) {

    //  stop/clear the Question Interval
    clearInterval(QuestionIntId);

    UnAnswCount++;

    // Display to user that time is up
    $("#UserMessageID").text("Time's Up!!");

   // Display the correct answer 
   for (var i = 0; i < CurQuestion.AText.length; i++) {
      // if this is not the correct answer then clear that answer 
      if (i != CurQuestion.CorrectAnswer) {
      $("#AnswID"+i).hide();
      }
   }

    // start the Answer Interval Timer
    AnswerTmRemain = MaxAnswerInt;
    clearInterval(AnswerIntId);
    AnswerIntId = setInterval(DecrAnswerTmr, OneSecond);

  }
} // function DecrQuestionTmr()

//***************************************************************
//Function for decrimenting the answer timer
function DecrAnswerTmr() {
if(DebugOn) console.log ("In DecrAnswerTmr()");

  //  Decrease the timer by one.
  AnswerTmRemain--;

  //  Once number hits zero...
  if (AnswerTmRemain === 0) {

    //  stop/clear the Answer Interval
    clearInterval(AnswerIntId);

    // Clear the Answer screen
    $("#AnswerID").empty();

    // Display the next question
    CurQuestionIndex++;
    if (CurQuestionIndex < QuestArray.length) {
      DisplayQuestion(CurQuestionIndex);

      // Start the Question Interval Timer
      QuestionTmRemain = MaxQuestionInt;
      $("#DispTimerID").html("<h2>" + "Time Remaining: " + QuestionTmRemain + "</h2>");
      
      clearInterval(QuestionIntId);
      QuestionIntId = setInterval(DecrQuestionTmr, OneSecond);

    }
    else {  // All the questions have been asked. 
      // Stop all the timers 
      clearInterval(QuestionIntId);
      clearInterval(AnswerIntId);
      $("#StopBTN").hide();

      // Display the final results page
      DisplayResults();
    }
  
  }
} // function DecrQuestionTmr()

//***************************************************************
//Function for managing the click of an answer
function MyClickFunction(IsCorrect) {
   
   if (DebugOn) console.log ("in MyClickFunction() Answer Pressed: " + IsCorrect );

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
  
  // Display the correct answer 
  for (var i = 0; i < CurQuestion.AText.length; i++) {
    // if this is not the correct answer then clear that answer 
    if (i != CurQuestion.CorrectAnswer) {
      $("#AnswID"+i).hide();
    }
  }

  // start the Answer Interval Timer
  AnswerTmRemain = MaxAnswerInt;
  clearInterval(AnswerIntId);
  AnswerIntId = setInterval(DecrAnswerTmr, OneSecond);

 } // MyClickFunction()


//*******************************************************************
// Use the ready() function to wait for the DOM (document object model) to be loaded
//*******************************************************************
$(document).ready(function() {
  if (DebugOn) console.log ("Start of document.ready");

//****************************************************************************
//Function for the Instruction Button
$("#InstructBTN").on("click", function() {
  alert("Instructions:\n\nThis trivia quiz comes from The Book of General Ignorance by John Lloyd & John Mitchinson. Once each question is posted, you will have a limited amount of time to click on your answer. \n\nPress the 'Start' button to begin. \n\nGood Luck!");
});

//****************************************************************************
//Function for the Stop Button
$("#StopBTN").on("click", function() {
  // stop both of the interval timers
  clearInterval(QuestionIntId);
  clearInterval(AnswerIntId);

  $("#StopBTN").hide();
  $("#StartBTN").show();
  $("#InstructBTN").show();

  DisplayResults();

if(DebugOn) console.log ("Stopped the Timers");
  
});

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


  // Hide the Instruction and Start Buttons
  $("#InstructBTN").hide();
  $("#StartBTN").hide();
  $("#StopBTN").show();

  $("#QuestionID").show();
  $("#AnswerID").show();
  $("#UserMessageID").show();
  
  // Clear the display
  $("#CorrectID").empty();
  $("#WrongID").empty();
  $("#UnAnswID").empty();

  // Start the question interval timer 
  QuestionTmRemain = MaxQuestionInt;
  $("#DispTimerID").html("<h2>" + "Time Remaining: " + QuestionTmRemain + "</h2>");

  clearInterval(QuestionIntId);
  QuestionIntId = setInterval(DecrQuestionTmr, OneSecond);

  if(DebugOn) console.log ("Started the Question Timer");

  // Show the first question
  CurQuestion = 0;
  DisplayQuestion(CurQuestion);
});  // function StartBTN click


//*********************************************************************************
//  Debug function
function ConsoleQuestionArray () {

  for (var i = 0; i<QuestArray.length; i++){
    console.log (QuestArray[i]);
  }
}

// Initialize the text portion of the display
   if (DebugOn) ConsoleQuestionArray();

// Hide the stop button to begin 
   $("#StopBTN").hide();

//*********************************************************************************
});  // $(document).ready(function())
