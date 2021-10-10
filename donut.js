//Define properties of transport modes. 
//intensity = 1 for moderate intensity, 2 for vigorous
var mode = {
    walkMod: {MET: 3.5, mph: 3, intensity: 1, verb: 'walking'},
    walkBrisk: {MET: 5, mph: 4, intensity: 2, verb: 'walking'},
    run: {MET: 8.3, mph: 5, intensity: 2, verb: 'running'},
    bikeLeisure: {MET: 8, mph: 9, intensity: 1, verb: 'riding a bike'},
    bikeMod: {MET: 5.8, mph: 13, intensity: 2, verb: 'riding a bike'},
    bikeFast: {MET: 10, mph: 15, intensity: 2, verb: 'riding a bike'},
    unicycle: {MET: 5, mph: 7, intensity: 2, verb: 'unicycling'},
    skateboard: {MET: 5, mph: 9, intensity: 2, verb: 'skating'},
    skating: {MET: 7.5, mph: 9, intensity: 2, verb: 'skating'},
    wheelchairMod: {MET: 3.2, mph: 2, intensity: 1, verb: 'going'},
    wheelchairBrisk: {MET: 6, mph: 4, intensity: 2, verb: 'going'},
    wheelchairPushMod: {MET: 3, mph: 2, intensity: 1, verb: 'going'},
    wheelchairPushBrisk: {MET: 6, mph: 4, intensity: 2, verb: 'going'}
}
var userOutput = {};
    
/* SWITCH FOOD feature
Kale-Donut selector switch changes up some visual features (button color) */
function switchFood(element){
    var kaleSelected = document.getElementById('donutsOrKale');
    if (kaleSelected.checked == true){
        for(var i = 0; i < element.length; i++){
        element[i].style.backgroundColor = '#69b73d';
        element[i].style.color = '#FFFFFF';
        }
    }
    else {
    for(var i = 0; i < element.length; i++){
        element[i].style.backgroundColor = '#ff748c';
        element[i].style.color = '#000000';
        }
    }
}

// MAIN calculation
function calculateAll() {
    var userInput = collectUserInput();
    var passedCheck = errorCheck(userInput);
    if(passedCheck){
        document.getElementById('userDistanceAlert').style.visibility = "hidden";
        document.getElementById('userWeightAlert').style.visibility = "hidden";
        document.getElementById('userFuelAlert').style.visibility = "hidden";
        var userOutput = calcAndWriteToPage(userInput);
    }
}

function collectUserInput() {
    var userInput = {};
    userInput.Distance = document.getElementById('userDistance').value;
    userInput.Weight = document.getElementById('userWeight').value;
    userInput.selectedMode = document.getElementById('travelMode').value;
    userInput.fuelEff = document.getElementById('userFuel').value;
    return userInput;
}

//Make sure all input is numerical and greater than 0, and hide calcs when calc isn't valid
function errorCheck(userInput) {
    var passedCheck = true;
    if (userInput.Distance<=0 || isNaN(userInput.Distance)) {
    document.getElementById('userDistanceAlert').style.visibility = 'visible';
    passedCheck = false;
    }
    if (userInput.Weight<=0 || isNaN(userInput.Weight)) {
    document.getElementById('userWeightAlert').style.visibility = 'visible';
    passedCheck = false;
    }
    if (userInput.fuelEff<=0 || isNaN(userInput.fuelEff)) {
    document.getElementById('userFuelAlert').style.visibility = 'visible';
    passedCheck = false;
    }
    if (!passedCheck) {
    document.getElementById('calcResults').innerHTML = '<h2>Oops...let\'s check those numbers and try again!</h2>';
    document.getElementById('calcFoodNo').innerHTML = '...';
    document.getElementById('calcTreesNo').innerHTML = '...';
    document.getElementById('calcExerciseNo').innerHTML = '...';
    }
    return passedCheck;
}
function calcAndWriteToPage(input) {
    userOutput.transitMinutes = Math.round(input.Distance / mode[input.selectedMode].mph * 60); 
    // Recommended time is 150 min moderate or 75 min intense or combo thereof weekly, so we weight intense by 2 and calculate against 150) - scaled to daily
    userOutput.exercisePercent = Math.round(100*(userOutput.transitMinutes * mode[input.selectedMode].intensity) / 150 * 7);   
    // MET is in kcal/kg*h, so multiply by (1-kg/2.2-lb)(1-hr/60-min)
    userOutput.calories = mode[input.selectedMode].MET * input.Weight * userOutput.transitMinutes * 0.0076; 
    userOutput.donuts = (userOutput.calories / 250).toFixed(1);
    userOutput.kale = (userOutput.calories / 36).toFixed(1);
    // 1-gal released 18.9-lb CO2; tree absorbs 0.13-lb per day
    userOutput.treeDays = ((input.Distance * 18.9) / (input.fuelEff * 0.13)).toFixed(1);
    userOutput.verb = mode[input.selectedMode].verb;
    //Collective action modules
    //686,619 VT daily in Pasadena in 2013, assume 10% of trips change
    //54.7k households in Pasadena last census
    userOutput.treesPerHousehold = (686619*0.1*userOutput.treeDays)/54700;
    // PM 2.5+10 is 41.9mg/mile for a sedan...operation time only, not even a full LCA!
    // Convert mg to lb = 1/453592
    userOutput.lbsPMperDay = 41.9*input.Distance*686619*0.1/453592;
    userOutput.PMofYouinDays = (input.Weight/userOutput.lbsPMperDay).toFixed(0);
    document.getElementById('calcResults').innerHTML = 
    '<h2>By '+userOutput.verb+' for '+userOutput.transitMinutes/2+' minutes each way, you\'ll earn:</h2>';
  // Output donuts or kale depending on what's checked
    var kaleSelected = document.getElementById('donutsOrKale');
    if (kaleSelected.checked){
       document.getElementById('calcFoodNo').innerHTML = userOutput.kale;
       document.getElementById('foodEmoji').innerHTML = 
       '<img src=\"img/kale.png\" alt=\"kale emoji\" height=\"80px\"/></div>';
       document.getElementById('calcFoodFlavorText').innerHTML = 
    'cups kale*!<p class=\"footnote\">*(steamed)</p>';
    } 
    else {
       document.getElementById('calcFoodNo').innerHTML = userOutput.donuts;
       document.getElementById('foodEmoji').innerHTML = 
       '<img src=\"img/donut.png\" alt=\"donut emoji\" height=\"80px\"/></div>';
       document.getElementById('calcFoodFlavorText').innerHTML = 
    'donuts!';
  } 
    document.getElementById('calcTreesNo').innerHTML = userOutput.treeDays;
    document.getElementById('calcTreesFlavorText').innerHTML = 
    'tree-days<sup>*</sup>!<p class=\"footnote\"> </p><p class=\"footnote\">*tree-day = CO<sub>2</sub> absorbed by a tree in one day</p>';
    document.getElementById('calcExerciseNo').innerHTML = userOutput.exercisePercent+'%';
    document.getElementById('calcExerciseFlavorText').innerHTML = 
    'your exercise RDA*!<p class=\"footnote\">*recommended daily allowance</p>';
    document.getElementById('calcCollectiveTreesResult').innerHTML = 'It would be as powerful as planting <strong>'+userOutput.treesPerHousehold.toFixed(0)+' trees</strong> in front of every house and apartment!';
    document.getElementById('forestResult').innerHTML = '<img src=\"img/tree.png\" alt=\"tree emoji\" height=\"30px\"/>'.repeat(userOutput.treesPerHousehold.toFixed(0));
    document.getElementById('calcCollectivePMResult').innerHTML = 'We\'d also avoid creating <strong>'+userOutput.lbsPMperDay.toFixed(0)+' lbs</strong> of air pollution particles every day.'
    document.getElementById('PMResult').innerHTML = '<img src=\"img/facemask.png\" alt=\"medical mask emoji\" height=\"30px\"/>'.repeat(userOutput.lbsPMperDay.toFixed(0));
    document.getElementById('calcCollectivePMFlavorText').innerHTML = '<p>If we did this <strong>'+userOutput.PMofYouinDays+' days</strong> in a row, the particles avoided would <strong>weigh as much as you do!</strong></p>';
    return userOutput;
}

// Delete user's input and return to default
function resetCalc() {
    setTimeout(function(){ calculateAll(); switchFood(document.getElementsByTagName('button'));}, 50);
}


/* Not ready yet
// If user wants to send results to email
function sendResults() {
    userOutput.userEmail = document.getElementById('userEmail').value;
    userOutput.userDestination = document.getElementById('userDestination').value;
    if (!userOutput.userEmail || !userOutput.userEmail.includes('@' && '.')) {
        document.getElementById('userEmailAlert').innerHTML = '<p class=\"error\">Please enter a valid email address.</p>';
    return;
    }
    else {
        /*
        document.getElementById('userEmailAlert').innerHTML = '';
        fetch('https://us-central1-total-fiber-240203.cloudfunctions.net/function-1', {
            method: 'post',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userOutput)
        }).then(res=>res.json())
        .then(res => console.log(res));
        console.log(userOutput);
    } 
    
}

//function confirmSend){}
//Pop up or confirmation text

//To clear user's email
function clearEmail() {
    userOutput.userEmail = null;
    userOutput.userDestination = null;  
}

*/
switchFood(document.getElementsByTagName('button'));
calculateAll();
