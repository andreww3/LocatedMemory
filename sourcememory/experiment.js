const jsPsych = initJsPsych();


// generate a timeline variable for stimuli
  // stimuli is an array of objects
  // each object has:
    // audio: the stimulus (word audio file, filepath)
    // word: the word
    // locus: locus image (filepath)
    // data: an object containing the data to record for this stimulus (word, locus, target/foil, etc.)

var stimuli = [{audio: '1.wav', word: 'test', locus: 'img/rbb.jpg'}];
var audio_folder;

// WELCOME ==============================================================



// INSTRUCTIONS =========================================================

var experimenter = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 'Who presented your walk narrative?',
  choices: ['Will', 'Laura'], // Will = 0; Laura = 1
  on_finish: (data) => {
    audio_folder = data.response ? "laura" : "will";
  }
};


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
  stimulus: () => {
    var filepath = `audio/${audio_folder}/${jsPsych.timelineVariable('audio')}`;
    return filepath;
  },
  choices: ['a', 'l'],
  prompt: () => {
    var html_word = `${jsPsych.timelineVariable('word')}`;

    var html_img = `<img class="locus-img" src="${jsPsych.timelineVariable('locus')}">`;

    var html_keys = "<strong>Press 'A' for YES or 'L' for NO.</strong>";

    var html_button = `<input id="dont-recall-button" class="jspsych-btn" type="button" value="Don't recall this word" />`; // added event listener in the custom mol plugin

    var html = `<div>
      <p>${html_word}</p>
      ${html_img}
      </div>
      <p>${html_keys}</p>
      ${html_button}
    `;
    return html;
  },
  data: jsPsych.timelineVariable('data'),
  response_ends_trial: true
};

var reset_keys = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: 1000,
  prompt: "Place your fingers back on 'A' and 'L'",
  timeline: [
    {stimulus: '<p class="countdown">Get ready: 3</p>'},
    {stimulus: '<p class="countdown">Get ready: 2</p>'},
    {stimulus: '<p class="countdown">Get ready: 1</p>'}
  ]
};      

var reset_keys_timeline = {
  timeline: [reset_keys],
  conditional_function: () => {
    var data = jsPsych.data.get().last(1).values()[0];
    if (data.response == "norecall") {
      return true; // run if last response was "norecall" (button press)
    } else {
      return false;
    };
  }
};

var trial_timeline = {
  timeline: [trial, reset_keys_timeline],
  timeline_variables: stimuli,
  randomize_order: true
};

var preload = {
  type: jsPsychPreload,
  trials: [trial_timeline]
};


// ENDSCREEN ============================================================

var debrief = {
  type: jsPsychInstructions,
  pages: ["All done!"],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next"
}

// TIMELINE =============================================================

var timeline = [];

timeline.push(experimenter);
timeline.push(instructions);
timeline.push(preload);
timeline.push(trial_timeline);
timeline.push(debrief);

jsPsych.run(timeline);