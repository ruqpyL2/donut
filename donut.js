// Define array of transportation modes with MET property
//Key = mode type, value = [MET,mph,intensityLevel,verb]
//intensityLevel = 1 for moderate intensity, 2 for vigorous
var transportationMode = new Array();
transportationMode["walkMod"]=[3.5,3,1,"walking"];
transportationMode["walkBrisk"]=[5,4,2,"walking"];
transportationMode["run"]=[8.3,5,2,"running"];
transportationMode["bikeLeisure"]=[8,9,1,"riding a bike"];
transportationMode["bikeMod"]=[5.8,13,2,"riding a bike"];
transportationMode["bikeFast"]=[10,15,2,"riding a bike"];
transportationMode["unicycle"]=[5,7,2,"unicycling"]; 
transportationMode["skateboard"]=[5,9,2,"skating"]; 
transportationMode["skating"]=[7.5,9,2,"skating"];
transportationMode["wheelchairMod"]=[3.2,2,1,"going"];
transportationMode["wheelchairBrisk"]=[6,4,2,"going"];
transportationMode["wheelchairPushMod"]=[3,2,1,"going"];
transportationMode["wheelchairPushBrisk"]=[6,4,2,"going"];

// Kale-Donut selector switch changes up some visual features
function switchFood(element){
  var kaleDonutSwitch = document.getElementById("donutsOrKale");
  if (kaleDonutSwitch.checked == true){
    for(var i = 0; i < element.length; i++){
       element[i].style.backgroundColor = "#69b73d";
    element[i].style.color = "#FFFFFF";}
} else {
    for(var i = 0; i < element.length; i++){
        element[i].style.backgroundColor = "#ff748c";
    element[i].style.color = "#000000";}
      } 
}

//This
function calculateAll() {
  // This calls up the values from the form and makes sure the input is numerical, greater than 0
    var inputDistance = document.getElementById("userDistance").value;
    if (inputDistance<=0 || isNaN(inputDistance)) {
    document.getElementById("calcResults").innerHTML = "<p class=\"error\">Please enter a distance greater than 0.</p>";
    return;
    }
    var inputWeight = document.getElementById("userWeight").value;
    if (inputWeight<=0 || isNaN(inputWeight)) {
    document.getElementById("calcResults").innerHTML = "<p class=\"error\">Please enter a valid weight.</p>";
    return;
    }
    var selectedMode = document.getElementById("travelMode").value;
    var fuelEff = document.getElementById("userFuel").value;
    if (fuelEff<=0 || isNaN(fuelEff)) {
    document.getElementById("calcResults").innerHTML = "<p class=\"error\">Please enter a fuel efficiency greater than 0.</p>";
    return;
    }
    transData = transportationMode[selectedMode];
  // Calculate the transit time for the user's selected transportation mode   // time (min) = distance / mph * 60
    var transitTime = Math.round(inputDistance / transData[1] * 60);  
  // Calculate exercise time (150 min moderate or 75 min intense or combo thereof weekly, so we weight intense by 2 and calculate against 150) - scaled to daily
    var exercisePercent = Math.round(100*(transitTime * transData[2]) / 150 * 7);
  // Calculate the calories and convert to food
  // Calories = MET * weight (lb) / 2.2 x 3.5 / 200 X time
  // Donuts = Calories / 250; Raw Kale = Calories / 8; Steamed kale = Calories / 36
    var calories = transData[0] * inputWeight * transitTime * 0.0079;
    var donuts = (calories / 250).toFixed(1);
    var kale = (calories / 36).toFixed(1);
  // Calculate lbs CO2 and tree-days
  // Tree-days = mileage x 18.9 lb CO2 / fuelEff /0.13 lb CO2
    var treeDays = ((inputDistance * 18.9) / (fuelEff * 0.13)).toFixed(1);
  // Write to page
	document.getElementById("calcResults").innerHTML = 
    "<h2>By "+transData[3]+" for "+transitTime+" minutes each way, you'll earn:</h2>";
  // Output donuts or kale depending on what's checked
  var checkBox = document.getElementById("donutsOrKale");
  if (checkBox.checked == true){
       document.getElementById("calcFoodNo").innerHTML = kale;
       document.getElementById("foodEmoji").innerHTML = 
       "<img src=\"img/kale.png\" alt=\"kale emoji\" height=\"80px\"/></div>";
       document.getElementById("calcFoodFlavorText").innerHTML = 
    "cups kale*!<p class=\"footnote\">*(steamed)</p>";
    } else {
       document.getElementById("calcFoodNo").innerHTML = donuts;
       document.getElementById("foodEmoji").innerHTML = 
       "<img src=\"img/donut.png\" alt=\"kale emoji\" height=\"80px\"/></div>";
       document.getElementById("calcFoodFlavorText").innerHTML = 
    "donuts!";
  } 
    document.getElementById("calcTreesNo").innerHTML = treeDays;
    document.getElementById("calcTreesFlavorText").innerHTML = 
    "tree-days<sup>*</sup>!<p class=\"footnote\"> </p><p class=\"footnote\">*tree-day = CO<sub>2</sub> absorbed by a tree in one day</p>";
    document.getElementById("calcExerciseNo").innerHTML = exercisePercent+"%";
    document.getElementById("calcExerciseFlavorText").innerHTML = 
    "your exercise RDA*!<p class=\"footnote\">*recommended daily allowance</p>";

}
function resetCalc() {
    setTimeout(function(){ calculateAll(); switchFood(document.getElementsByTagName('button'));}, 50);
}


switchFood(document.getElementsByTagName('button'))
calculateAll()