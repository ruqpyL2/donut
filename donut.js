// Define array of transportation modes with MET property
//Key = mode type, value = [MET,mph,verb]
var transportationMode = new Array();
transportationMode["walkMod"]=[3.5,3,"walking"];
transportationMode["walkBrisk"]=[5,4,"walking"];
transportationMode["run"]=[8.3,5,"running"];
transportationMode["bikeLeisure"]=[8,9,"riding a bike"];
transportationMode["bikeMod"]=[5.8,13,"riding a bike"];
transportationMode["bikeFast"]=[10,15,"riding a bike"];
transportationMode["unicycle"]=[5,7,"unicycling"]; 
transportationMode["skateboard"]=[5,9,"skating"]; 
transportationMode["skating"]=[7.5,9,"skating"];

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
    var transitTime = inputDistance / transData[1] * 60;
  // Calculate the calories and convert to donuts
  // Calories = MET * weight (lb) / 2.2 x 3.5 / 200 X time
  // Donuts = Calories / 250
    var calories = transData[0] * inputWeight * transitTime * 0.0079;
    var donuts = (calories / 250).toFixed(1);
  // Calculate lbs CO2 and tree-days
  // Tree-days = mileage x 18.9 lb CO2 / fuelEff /0.13 lb CO2
    var treeDays = ((inputDistance * 18.9) / (fuelEff * 0.13)).toFixed(1);
  // Write to page
	document.getElementById("calcResults").innerHTML = 
    "<p>By "+transData[2]+"  for "+Math.round(transitTime/2)+" minutes each way on your next trip:</p><h3>You can eat "+donuts+" donuts and save "+treeDays+" tree-days<sup>*</sup> worth of CO<sub>2</sub>!</h3>";
}
function resetCalc() {
    setTimeout(function(){ calculateAll(); }, 50);
}

calculateAll()