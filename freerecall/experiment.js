const jsPsych = initJsPsych({
  display_element: 'jspsych-target',
});

const total_minutes = 1;
const total_time = total_minutes * 60000 + 1000;
const num_last_messages = 5;
var start_time;
var timer_ticks;

// INSTRUCTIONS =========================================================

// TRIAL ================================================================

var timer_start = {
  type: jsPsychCallFunction,
  func: () => {
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
  preamble: () => {
    var previous_responses = jsPsych.data.get().last(num_last_messages).select('response').values;
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



// ENDSCREEN ============================================================

//clearInterval(timer_ticks);
//document.querySelector('#countdown-timer-div').style.display = 'none';

// TIMELINE =============================================================

var timeline = [];

timeline.push(timer_start);
timeline.push(freeRecallTimeline);

jsPsych.run(timeline);