const jsPsych = initJsPsych();


// generate a timeline variable for stimuli
  // stimuli is an array of objects
  // each object has:
    // word: a stimulus (word audio file, filepath)
    // locus: a prompt (locus image, filepath)
    // data: an object containing the data to record for this stimulus (target/foil, locus, etc.)

var stimuli = [];

// WELCOME ==============================================================



// INSTRUCTIONS =========================================================

// TRIAL ================================================================

var trial = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('word'),
  choices: ['a', 'l'],
  prompt: `<img src="${jsPsych.timelineVariable('locus')}">`,
  data: jsPsych.timelineVariable('data'),
  response_ends_trial: true
};

var trial_timeline = {
  timeline: [trial],
  timeline_variables: stimuli,
  randomize_order: true
};

var preload = {
  type: jsPsychPreload,
  trials: [trial_timeline]
}


// ENDSCREEN ============================================================

// TIMELINE =============================================================

var timeline = [];

timeline.push(preload);
timeline.push(trial_timeline);

jsPsych.run(timeline);