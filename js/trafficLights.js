var OPSMAP_tlRules = {
    "yesgreen" : function(v){
        if (v === "yes" || v === "Yes"){
            return "success";
        }
        else if (v === "no" || v === "No"){
            return "danger";
        }
        else {
            return "none";
        }
    },
    "nogreen" : function(v){
        if (v === "yes" || v === "Yes"){
            return "danger";
        }
        else if (v === "no" || v === "No"){
            return "success";
        }
        else {
            return "none";
        }
    },
    "nonered" : function(v){
        if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no"){
            return "danger";
        }
        else {
            return "success";
        }        
    },
    "nonegreen" : function(v){
        if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no"){
            return "success";
        }
        else {
            return "danger";
        }        
    }
}

var toBeAddedToRules = {
    "percentagegreen" : function(v){
        if (v === "more_75%" || v === "more 75%" || v === "More than 75%"){
            return "success";
        }
        else if (v === "btw_50%_75%" || v === "btw 50% 75%" || v === "Between 50% and 75%"){
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "percentagered" : function(v){
        if (v === "more_75%" || v === "more 75%" || v === "More than 75%"){
            return "danger";
        }
        else if (v === "btw_50%_75%" || v === "btw 50% 75%" || v === "btw 25% 50%" || v === "btw_25%_50%" || v === "Between 50% and 75%" || v === "Between 25% and 50%"){
            return "warning";
        }
        else {
            return "success";
        }
    },
    "distance" : function(v){
        var Vn = parseInt(v);
        if (Vn > 30){
            return "danger";
        }
        else if (Vn <= 30 && Vn > 20){
            return "warning";
        }
        else if (Vn <= 20 && Vn > 10){
            return "mid";
        }
        else {
            return "success";
        }       
    },
    "distanceWater" : function(v){
        var Vn = parseInt(v);
        if (Vn > 10){
            return "danger";
        }
        else if (Vn <= 10 && Vn > 5){
            return "warning";
        }
        else {
            return "success";
        }
    },
    "waterDays" : function(v){
        var Vn = parseInt(v);
        if (Vn < 4) {
            return "danger";
        }
        else if (Vn >= 5 && Vn < 7){
            return "warning";
        }
        else {
            return "success";
        }
    },
    "wasteDisposal" : function(v){
        if (v === "daily" || v === "weekly"){
            return "success";
        }
        else if (v === "monthly"){
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "foodDist" : function(v){
        if (v === "daily" || v === "twice daily"){
            return "success";
        }
        else if (v === "weekly"){
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "nonegreendnk" : function(v){
        if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no"){
            return "success";
        }
        else if (v === "dnk"){
            return "unknown";
        }
        else {
            return "danger";
        }
    },
    "yesgreenManagement" : function(v){
        if (v === "no_management"){
            return "danger";
        }
        else {
            return "success";
        }
    },
    "forcered" : function(v){
        return "danger";
    },
    "committes" : function(v){
        var array = v.split(' ');
        if (array.indexOf('womens') === -1 || v === "none"){
            return "danger";
        } else {
            return "success";
        }        
    }    
}

/* OPSMAP_AddCustomTlRules(rulesObject) : adds/overrides trafficLights rules
 * @params rulesObject Object : similar to OPSMAP_tlRules, gives a function for each listed rule.
 */
function OPSMAP_AddCustomTlRules(rulesObject){
    $.each(rulesObject, function(k, v){
        OPSMAP_tlRules[k] = v;
    })
};

OPSMAP_AddCustomTlRules(toBeAddedToRules);
console.log(OPSMAP_tlRules);