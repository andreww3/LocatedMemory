const jsPsych = initJsPsych();

// INSTRUCTIONS =========================================================

// TRIAL ================================================================

var textbox = {
  type: jsPsychSurveyText,
  questions: [{prompt: "Enter text: ", required: true}],
  preamble: "Preamble"
};

var freeRecallTimeline = {
  timeline: [textbox],
  loop_function: function(data) {
    return true;
  }
};

// TIMELINE =============================================================

var timeline = [];

timeline.push(freeRecallTimeline);

jsPsych.run(timeline);