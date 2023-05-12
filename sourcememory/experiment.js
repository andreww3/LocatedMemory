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
  type: jsPsychMolAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('word'),
  choices: ['a', 'l'],
  prompt: () => {
    var html_img = `<img src="${jsPsych.timelineVariable('locus')}">`;

    var html_button = `<input id="dont-recall-button" class="jspsych-btn" type="button" value="Don't recall this item" />`; // added event listener in the custom mol plugin

    var html = `<div>${html_img}</div> ${html_button}`;
    return html;
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

var debrief = {
  type: jsPsychInstructions,
  pages: [
  "That's all folks!"
  ],
  show_clickable_nav: true
}

// TIMELINE =============================================================

var timeline = [];

timeline.push(instructions);
timeline.push(preload);
timeline.push(trial_timeline);
timeline.push(debrief);

jsPsych.run(timeline);