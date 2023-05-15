var jsPsychMolFreeRecall = (function (jspsych) {
  'use strict';

  const info = {
      name: "mol-free-recall",
      parameters: {
          /** Question prompt. */
          prompt: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Prompt",
            default: undefined,
          },
          /** HTML-formatted string to display at top of the page above all of the questions. */
          preamble: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Preamble",
              default: null,
          },
      },
  };
  /**
   * 
   */
  class MolFreeRecallPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {

          // design html
          var html = "";

          // preamble div
          if (trial.preamble !== null) {
              html +=
                  '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble">' +
                      trial.preamble +
                      "</div>";
          }

          // form element
          html += '<form id="jspsych-survey-text-form" autocomplete="off">'
          
          // form element > question div
          if (typeof trial.prompt == "undefined") {
            trial.prompt = "";
          }
          html += '<div id="jspsych-survey-text-0" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
          html += '<p class="jspsych-survey-text">' + trial.prompt + "</p>";
          html += '<input type="text" id="free-recall-input" name="#jspsych-survey-text-response-0" size="60" autofocus required placeholder=""></input>'
          html += "</div>";

          
          // form element > submit button
          html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="Enter"></input>';

          html += "</form>";

          display_element.innerHTML = html;
          
          // backup in case autofocus doesn't work
          display_element.querySelector("#free-recall-input").focus();

          // event listener for submit
          display_element.querySelector("#jspsych-survey-text-form").addEventListener("submit", (e) => {
              e.preventDefault();

              // measure response time
              var endTime = performance.now();
              var response_time = Math.round(endTime - startTime);

              // create object to hold responses
              var q_element = document.getElementById("free-recall-input"); // input element
              var question_data = q_element.value;

              // save data
              var trialdata = {
                  rt: response_time,
                  response: question_data,
              };

              display_element.innerHTML = "";

              // next trial
              this.jsPsych.finishTrial(trialdata);
          });
          var startTime = performance.now();
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const question_data = {};
          let rt = 1000;
          for (const q of trial.questions) {
              const name = q.name ? q.name : `Q${trial.questions.indexOf(q)}`;
              const ans_words = q.rows == 1
                  ? this.jsPsych.randomization.sampleExponential(0.25)
                  : this.jsPsych.randomization.randomInt(1, 10) * q.rows;
              question_data[name] = this.jsPsych.randomization.randomWords({
                  exactly: ans_words,
                  join: " ",
              });
              rt += this.jsPsych.randomization.sampleExGaussian(2000, 400, 0.004, true);
          }
          const default_data = {
              response: question_data,
              rt: rt,
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          const answers = Object.entries(data.response).map((x) => {
              return x[1];
          });
          for (let i = 0; i < answers.length; i++) {
              this.jsPsych.pluginAPI.fillTextInput(display_element.querySelector(`#input-${i}`), answers[i], ((data.rt - 1000) / answers.length) * (i + 1));
          }
          this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#jspsych-survey-text-next"), data.rt);
      }
  }
  MolFreeRecallPlugin.info = info;

  return MolFreeRecallPlugin;

})(jsPsychModule);
