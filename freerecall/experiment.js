const jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: () => {
    $.post('submit',{"content": jsPsych.data.get().csv()});
    setTimeout(() => {window.location.href = `https://melbourneuni.au1.qualtrics.com/jfe/form/SV_a67L4g0MxQNXkVM?id=${subjectID}`;},1000);
  }
});

const total_minutes = 15;
const total_time = total_minutes * 60000 + 1000;
const prac_minutes = 1;
const prac_time = prac_minutes * 60000 + 1000;
const num_last_messages = 5;
var start_time;
var timer_ticks;

// INSTRUCTIONS =========================================================

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

var pin1 = generatePinTrial(7385);
var pin2 = generatePinTrial(8309);

var instructions = {
  type: jsPsychInstructions,
  pages: ['Listen to instructions from the experimenter. When instructed, click Next to continue.'],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next"
};

// TRIAL ================================================================

var timer_start = {
  type: jsPsychCallFunction,
  func: () => {
    // shows timer, records start time, calculates time remaining
    document.querySelector('#countdown-timer-div').style.display = 'block';
    start_time = Date.now();
    timer_ticks = setInterval(() => {
      var time_remaining = (total_time - (Date.now() - start_time)) / 1000;
      var time_remaining_minutes = Math.max(Math.floor(time_remaining / 60), 0);
      var time_remaining_seconds = Math.max(Math.floor(time_remaining % 60), 0);
      document.getElementById("countdown-timer").innerHTML = `${time_remaining_minutes.toString().padStart(2, '0')}:${time_remaining_seconds.toString().padStart(2, '0')}`;
    }, 100)
  }
}

var textbox = {
  type: jsPsychMolFreeRecall,
  prompt: "",
  data: {section: 'test'},
  preamble: () => {
    var previous_responses = jsPsych.data.get().last(num_last_messages).filter({section: 'test'}).select('response').values;
    return `<div class="chat">
    <div>
    <p>${previous_responses.join("</p><p>")}</p>
    </div>
    </div>`
  }
};

var freeRecallTimeline = {
  timeline: [textbox],
  loop_function: () => {
    if(Date.now() - start_time < total_time){
      return true;
    } else {
      return false;
    }
  }
};

// PRACTICE =============================================================

var prac_timer_start = {
  type: jsPsychCallFunction,
  func: () => {
    // shows timer, records start time, calculates time remaining
    document.querySelector('#countdown-timer-div').style.display = 'block';
    start_time = Date.now();
    timer_ticks = setInterval(() => {
      var time_remaining = (prac_time - (Date.now() - start_time)) / 1000;
      var time_remaining_minutes = Math.max(Math.floor(time_remaining / 60), 0);
      var time_remaining_seconds = Math.max(Math.floor(time_remaining % 60), 0);
      document.getElementById("countdown-timer").innerHTML = `${time_remaining_minutes.toString().padStart(2, '0')}:${time_remaining_seconds.toString().padStart(2, '0')}`;
    }, 100)
  }
}

var practiceTextbox = {
  type: jsPsychMolFreeRecall,
  prompt: "",
  data: {section: 'practice'},
  preamble: () => {
    var previous_responses = jsPsych.data.get().last(num_last_messages).select('response').values;
    return `<div class="chat">
    <div>
    <p>${previous_responses.join("</p><p>")}</p>
    </div>
    </div>`
  }
};

var practiceTimeline = {
  timeline: [practiceTextbox],
  loop_function: () => {
    if(Date.now() - start_time < prac_time){
      return true;
    } else {
      return false;
    }
  }
};

var pracEnd = {
  type: jsPsychInstructions,
  pages: ['You have finished the practice round. When instructed, click Next to continue.'],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next",
  on_start: () => {
    clearInterval(timer_ticks);
    document.querySelector('#countdown-timer-div').style.display = 'none';
  }
};

// ENDSCREEN ============================================================

var debrief = {
  type: jsPsychInstructions,
  pages: ["All done! Once you click Next, you will be redirected to the next task."],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Next",
  on_start: () => {
    clearInterval(timer_ticks);
    document.querySelector('#countdown-timer-div').style.display = 'none';
  }
};

// TIMELINE =============================================================

var timeline = [];

timeline.push(pin1);
timeline.push(instructions);
timeline.push(prac_timer_start);
timeline.push(practiceTimeline);
timeline.push(pracEnd);
timeline.push(pin2);
timeline.push(timer_start);
timeline.push(freeRecallTimeline);
timeline.push(debrief);

jsPsych.data.addProperties({subject: subjectID});

jsPsych.run(timeline);