/* OPSMAP trafficLights.js - Dec. 2017 - CartONG */

/* OPSMAP_tlRules : Contains general rules for traffic lights.
 * To be extended through the config.tlRules Object in config.js
 */
var OPSMAP_tlRules = {
  "yesgreen": function(v) {
    if (v === "yes" || v === "Yes") {
      return "success";
    }
    else if (v === "no" || v === "No") {
      return "danger";
    }
    else {
      return "none";
    }
  },
  "nogreen": function(v) {
    if (v === "yes" || v === "Yes") {
      return "danger";
    }
    else if (v === "no" || v === "No") {
      return "success";
    }
    else {
      return "none";
    }
  },
  "nonered": function(v) {
    if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no") {
      return "danger";
    }
    else {
      return "success";
    }
  },
  "nonegreen": function(v) {
    if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no") {
      return "success";
    }
    else {
      return "danger";
    }
  }
};

/* OPSMAP_AddCustomTlRules(rulesObject) : adds/overrides trafficLights rules.
 * @params rulesObject Object : similar to OPSMAP_tlRules, gives a function for each listed rule.
 */
function OPSMAP_AddCustomTlRules(rulesObject) {
  $.each(rulesObject, function(k, v) {
    OPSMAP_tlRules[k] = v;
  })
}

/* getTrafficLight(tl, v) : gets the right file name for traffic lights (to be use in the path to image definition).
 * @params tl String : name of the traffic light (got from the "fields" dataset and used to find the tL rule).
 * @params v String : value to be tested with the relevant rule.
 */
function getTrafficLight(tl, v) {
  if (!OPSMAP_tlRules[tl]) {
    return "N/A";
  }
  return OPSMAP_tlRules[tl](v);
}
