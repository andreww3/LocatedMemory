const jsPsych = initJsPsych({
  on_finish: () => {
    $.post('submit',{"content": jsPsych.data.get().csv()});
    //setTimeout(() => {window.location.href = `https://melbourneuni.au1.qualtrics.com/jfe/form/SV_a67L4g0MxQNXkVM?id=${subjectID}`;},1000);
  }
});


// generate a timeline variable for stimuli
  // stimuli is an array of objects
  // each object has:
    // audio: the stimulus (word audio file, filepath)
    // word: the word
    // locus: locus image (filepath)
    // data: an object containing the data to record for this stimulus (word, locus, target/foil, etc.)

var locus_words_selected = {};
Object.keys(loci).forEach((i) => {
  var num_words = 8 + loci[i].length * 2;
  locus_words_selected[i] = jsPsych.randomization.sampleWithoutReplacement(locus_words[i], num_words);
});

var stimuli_data = [];
Object.keys(loci).forEach((i) => {
  // for each locus
  var words = locus_words_selected[i];
  var special_words_current_locus = special_words[i];

  i = Number(i);

  // add narrative words
  for (let w = 0; w < words.length; w++) {
    if (w < 8) {
      // target
      var data_obj = {
        word: words[w], 
        locus_orig: i, 
        locus_exp: i, 
        type: "target"
      };
    } else {
      // foil
      // Math.floor((w-8)/2) maps the index from `words` (w) to the index in `loci`
      var data_obj = {
        word: words[w], 
        locus_orig: i, 
        locus_exp: loci[i][Math.floor((w-8)/2)], 
        type: "foil"
      };
    }
    stimuli_data.push(data_obj); 
  }

  // add special words
  stimuli_data.push({word: special_words_current_locus.target[0], locus_orig: i, locus_exp: i, type: "specialTarget"});
  stimuli_data.push({word: special_words_current_locus.foil[0], locus_orig: loci_special_foils[i][0], locus_exp: i, type: "specialFoil"});
});

var stimuli = stimuli_data.map((data) => {
  var data_obj = {
    audio: `${words_ids[data.word][0]}.mp3`,
    word: data.word,
    locus: `img/${data.locus_exp}.JPG`,
    data: data
  };
  return data_obj;
});
//var stimuli = [{audio: '1.wav', word: 'test', locus: 'img/rbb.jpg'}];

var audio_folder;
var audio_files = Object.values(words_ids)
  .reduce((a,b) => b.concat(a))
  .map((x) => `${x}.mp3`);
var img_files = Object.keys(loci).map((x) => `img/${x}.JPG`);

var delay_word;

// WELCOME ==============================================================

function generatePinTrial(pin) {
  return {
    type: jsPsychCloze,
    text: `<p>Please do not move on until the experimenter has given you the PIN code to move on to the next page.</p><p>% ${pin} %</p>`,
    check_answers: true,
    allow_blanks: false,
    button_text: 'Next',
    //mistake_fn: () => { alert("Incorrect PIN. Please check again.") }
  };
};

var pin1 = generatePinTrial(3257);

// INSTRUCTIONS =========================================================

var experimenter = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<p>Who presented your walk narrative?</p>',
  choices: ['Will', 'Laura'], // Will = 0; Laura = 1
  on_finish: (data) => {
    audio_folder = data.response ? "laura" : "will";
  }
};


var instructions = {
  type: jsPsychInstructions,
  pages: ['Listen to instructions from the experimenter. When instructed, click Next to continue.'],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next"
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

    var html_keys = "<span style='float: left;'>A: NO</span><span style='float: right;'>L: YES</span>";

    var html_button = `<input id="dont-recall-button" class="jspsych-btn" type="button" value="Don't recall this word" />`; // added event listener in the custom mol plugin

    var html = `<div>
      <p id="visual-word" style="visibility:hidden;">${html_word}</p>
      ${html_img}
      </div>
      <div class="locus-keys">${html_keys}</div>
      ${html_button}
    `;
    return html;
  },
  data: jsPsych.timelineVariable('data'),
  response_ends_trial: true,
  on_load: () => {
    // make the word visible after a delay
    delay_word = setTimeout(() => {
      document.querySelector('#visual-word').style.visibility = 'visible';
    }, 3000);
  },
  on_finish: () => {
    clearTimeout(delay_word);
  },
  post_trial_gap: 500
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
    if (data.response == "norecall" || data.section == "break") {
      // run if last response was "norecall" (button press) OR last trial was a break
      return true;
    } else {
      return false;
    };
  }
};

var break_trial = {
  type: jsPsychInstructions,
  data: {section: 'break'},
  pages: ["Please take a short break. Whenever you're ready, click Next to continue."],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next"
};

var break_timeline = {
  timeline: [break_trial],
  conditional_function: () => {
    var data = jsPsych.data.get().last(1).values()[0];
    var timeline_node_id = data.internal_node_id;
    timeline_node_id = timeline_node_id.split('-');
    timeline_node_id = timeline_node_id[timeline_node_id.length - 1];
    if (['0.29','0.59','0.89','0.119','0.149'].includes(timeline_node_id)) {
      // run if last trial number is a multiple of 30
      return true;
    } else {
      return false;
    };
  }
};

var trial_timeline = {
  timeline: [trial, break_timeline, reset_keys_timeline],
  timeline_variables: stimuli,
  randomize_order: true
};

var preload = {
  type: jsPsychPreload,
  message: "<p>Please wait for the experiment to load.</p>",
  images: img_files,
  audio: () => {
    return audio_files.map((x) => `audio/${audio_folder}/${x}`);
  }
  //trials: [trial_timeline]
};


// ENDSCREEN ============================================================

var debrief = {
  type: jsPsychInstructions,
  pages: [
    "All done!",
    "The memory tasks for today are now complete. Thank you for participating. Please listen to the researchers for instructions on what to do next."
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next"
}

// TIMELINE =============================================================

var timeline = [];

timeline.push(experimenter);
timeline.push(instructions);
timeline.push(pin1);
timeline.push(preload);
timeline.push(trial_timeline);
timeline.push(debrief);

jsPsych.data.addProperties({subject: subjectID});

jsPsych.run(timeline);