const jsPsych = initJsPsych();


// generate a timeline variable for stimuli
  // stimuli is an array of objects
  // each object has:
    // word: a stimulus (word audio file, filepath)
    // locus: a prompt (locus image, filepath)
    // data: an object containing the data to record for this stimulus (target/foil, locus, etc.)

var stimuli = [{word: 'audio/1.wav', locus: 'img/rbb.jpg'}];

// WELCOME ==============================================================



// INSTRUCTIONS =========================================================

var instructions = {
  type: jsPsychInstructions,
  pages: [
  'Welcome to the experiment. Click next to begin.',
  'This is the second page of instructions.',
  'This is the final page.'
  ],
  show_clickable_nav: true
}

// TRIAL ================================================================

var trial = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('word'),
  choices: ['a', 'l'],
  prompt: () => {
    return `<img src="${jsPsych.timelineVariable('locus')}">`
  },
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

timeline.push(instructions);
timeline.push(preload);
timeline.push(trial_timeline);

jsPsych.run(timeline);