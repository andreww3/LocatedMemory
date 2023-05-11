const jsPsych = initJsPsych();

// INSTRUCTIONS =========================================================

// TRIAL ================================================================

var textbox = {
  type: jsPsychMolFreeRecall,
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