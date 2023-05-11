const jsPsych = initJsPsych();

// INSTRUCTIONS =========================================================

// TRIAL ================================================================

var textbox = {
  type: jsPsychMolFreeRecall,
  prompt: "",
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