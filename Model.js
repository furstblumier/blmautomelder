//potencies for our spells
var fastF3B3 = 168;
var B4 = 260;
var Foul = 650;
var F1 = 1.8*180;
var F3P = 1.8*240;
var F4 = 1.8*300;
var baseRotationP = fastF3B3 * 2 + B4 + F1 + F4 * 6;

// Probability table corresponding to number of fire procs in a 3min fire rotation
var fireProbabilityInFire = [
  0.216, //0
  3*0.144, //1
  3*0.096, //2
  0.064 //3
];

function FoulValue(rotationLength) {
  return Foul * rotationLength/30 > Foul ? Foul : Foul * rotationLength/30;
}

// Average potency of a 3min thunder rotation with X fire procs
function GetThunderP(procNum, FoulP, cycle, skippedF4s, downgradedF4s) {
  return (6 * (baseRotationP + FoulP) + procNum * F3P + 2 * F4 - (skippedF4s + downgradedF4s) * F4 + downgradedF4s * F1) / cycle;
}

// Actual time taken by a 3min thunder rotation with X fire procs
function getThunderCycle(procNum, shortGcd, longGcd, casterTax, skippedF4s, downgradedF4s) {
  return (24 + procNum + downgradedF4s) * shortGcd + (44 - skippedF4s - downgradedF4s) * longGcd + 53 * casterTax - 2 * 30 / 0.85 + 60;
}

// Average potency of a 3min fire rotation with X fire procs
function GetFireP(procNum, FoulP, cycle) {
  return (6 * (baseRotationP + FoulP) + (3 + procNum) * F3P + 2 * F4) / cycle;
}

// Actual time taken by a 3min fire rotation with X fire procs
function getFireCycle(procNum, shortGcd, longGcd, casterTax) {
  return (27 + procNum) * shortGcd + 44 * longGcd + 53 * casterTax - 2 * 30 / 0.85 + 60;
}

function ThunderP(shortGcd , longGcd, casterTax, skippedF4s, downgradedF4s) {
  var FoulP = FoulValue(newR(avgThunderCycle(shortGcd, longGcd, casterTax, skippedF4s, downgradedF4s),false));
  var sumProbability = 0;
  var pascal = pasc((7+downgradedF4s))
  for(var i = 0; i < (7+downgradedF4s); i++) {
    var cycle = getThunderCycle(i, shortGcd, longGcd, casterTax, skippedF4s, downgradedF4s);
    sumProbability += pascal[pascal.length-1][i]*probFunction(i,downgradedF4s) * GetThunderP(i, FoulP, cycle, skippedF4s, downgradedF4s);
  }
  return sumProbability;
}

function FireP(shortGcd , longGcd, casterTax) {
  var FoulP = FoulValue(newR(avgFireCycle(shortGcd, longGcd, casterTax),true));
  var sumProbability = 0;
  for(var i = 0; i < fireProbabilityInFire.length; i++) {
    var cycle = getFireCycle(i, shortGcd, longGcd, casterTax);
    sumProbability += fireProbabilityInFire[i] * GetFireP(i, FoulP, cycle);
  }
  return sumProbability;
}

function avgThunderCycle(shortGcd, longGcd, casterTax, skippedF4s, downgradedF4s) {
  var sumCycle = 0;
  var pascal = pasc((7+downgradedF4s))
  for(var i = 0; i < 7+downgradedF4s; i++) {
    sumCycle += pascal[pascal.length - 1][i] * probFunction(i,downgradedF4s) * getThunderCycle(i, shortGcd, longGcd, casterTax, skippedF4s, downgradedF4s) / 6;
  }
  return sumCycle;
}  

function avgFireCycle (shortGcd, longGcd, casterTax) {
  var sumCycle = 0;
  for(var i = 0; i < fireProbabilityInFire.length; i++) {
    sumCycle += fireProbabilityInFire[i] * getFireCycle(i, shortGcd, longGcd, casterTax) / 6;
  }
  return sumCycle;
}

//returns the probability of getting X F3P procs naturally
function probFunction(numberOfProcs, numberOfDowngrades) {
    prob = Math.pow(2/5,numberOfProcs)*Math.pow(3/5,6-numberOfProcs+numberOfDowngrades)
    return prob
}

function SpsScalar(SpS) {
  var S = ((1000+Math.floor(130*(SpS-364)/2170))/1000/100);
  return S;
}

function newR(oldR, fireFlag) {
    var R = 30
    for (var n = 0; n < 15; n++) {
        var R = oldR * (1+(1+(fireFlag ? 1.32 : 2.619768906))/((fireFlag ? newHRCTimeFire(R) : newHRCTimeThunder(R))))
    }
    return R;
}

function procChance(numberOfEights, numberOfSevensOrSix) {
  var p = Math.pow((1/10*Math.pow(9/10,5)),numberOfSevensOrSix) * Math.pow((1-1/5*Math.pow(9/10,5)-Math.pow(9/10,8)),numberOfEights) * Math.pow(9/10,8)
  return p
}

function procPrimeChance(numberOfEights, numberOfSevens, numberOfSixs) {
  var p = Math.pow(Math.pow(9/10,6)+1/10*Math.pow(9/10,5),numberOfSixs) * Math.pow(1/10*Math.pow(9/10,5),numberOfSevens) * Math.pow(1 - (Math.pow(9/10,6)+1/5*Math.pow(9/10,5)),numberOfEights)
  return p
}

function newHRCTimeFire(R) {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('prob');
  var probability = ss.getRange("F2:F210").getValues();
  var probabilityArray = probability.join().split(',');
  var numberOfTicks = ss.getRange("D2:D210").getValues();
  var numberOfTicksArray = numberOfTicks.join().split(',');
  var sum = []
  for(var i = 0; i < probabilityArray.length; i++){
    sum.push(probabilityArray[i]*Math.ceil(3*numberOfTicksArray[i]/R))
  }
  var result = reduce(sum, summing);
  var newR = R * result;
  Utilities.sleep(100)
  return newR
}
     
function newHRCTimeThunder(R) {

  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('prob');
  var probability = ss.getRange("N2:N183").getValues();
  var probabilityArray = probability.join().split(',');
  var numberOfTicks = ss.getRange("L2:L183").getValues();
  var numberOfTicksArray = numberOfTicks.join().split(',');
  var sum = []
  for(var i = 0; i < probabilityArray.length; i++){
    sum.push(probabilityArray[i]*Math.ceil(3*numberOfTicksArray[i]/R))
  }
  var result = reduce(sum, summing);
  var newR = R * result;
  Utilities.sleep(100)
  return newR
}

function summing(accumulator, currentValue) {
  return accumulator + currentValue
}
 
function reduce(arr, callback, initialVal) {
    var accumulator = (initialVal === undefined) ? undefined : initialVal;
    for (var i = 0; i < arr.length; i++) {
        if (accumulator !== undefined)
            accumulator = callback.call(undefined, accumulator, arr[i], i, this);
        else
            accumulator = arr[i];
    }
    return accumulator;
}

//gives an array back of Pascal's triangle
function pasc(n){
var result = [];
    result[0] = [1];
    result[1] = [1,1];
for (var row = 2; row < n; row++){
    result[row] = [1];
    for (var col = 1; col <= row -1; col++){
        result[row][col] = result[row-1][col] + result[row-1][col-1];
        result[row].push(1);
    }
}
return result;
}