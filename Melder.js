function meldCombinations(statArray,maxValue,numberOfMelds) {
    statArray = statArray.toString();
    statArray = statArray.split(',');
    for (var i = 0; i<statArray.length; i++) {
      statArray[i] = parseInt(statArray[i],10);
    }
    //statArray is in the form [DH,CRIT,DET,SPS]
    var oneMeldResult = []
    var loopArray = []
    //meld 1, skip the melds that would overcap
    for (var i=0; i<statArray.length; i++) {
        var loopArray = statArray.slice()
        if (loopArray[i] == maxValue) { continue }
            loopArray[i] = loopArray[i] + 40
        if (loopArray[i] > maxValue) {
           loopArray[i] = maxValue
       }
      oneMeldResult.push(loopArray)
    }
    //Logger.log(oneMeldResult)
    if(numberOfMelds == 1) { return oneMeldResult }
    var twoMeldResult = []
    //meld 2, skip the melds that would overcap
    for (var n=0; n<oneMeldResult.length; n++) {
      for (var i=0; i<oneMeldResult[n].length; i++) {
        var loopArray = oneMeldResult[n].slice()
        if (loopArray[i] == maxValue) { continue }
        loopArray[i] = loopArray[i] + 40
        if (loopArray[i] > maxValue) {
          loopArray[i] = maxValue
        }
        twoMeldResult.push(loopArray)
      }
    }
    //we have to filter out the the melds that occur twice since we don't care if someone melds DH > crit or Crit > DH. Expected list: 6 or 3
    var result = uniqBy(twoMeldResult, JSON.stringify)
    return result
  }

function spsRange(spsArray, maxArray) {
    var meldArray = [2,2,2,2,2,2,1,1,1,1,1,1]
    var min = 364 + reduce(spsArray,summing);
    for (var i = 0; i<spsArray.length; i++) {
      if (spsArray[i] == maxArray[i]) {continue}
      spsArray[i] += meldArray[i]*40
      if (spsArray[i] > maxArray[i]) {
        spsArray[i] = maxArray[i]
      }
    }
    var max = 364 + reduce(spsArray, summing);
    return [min, max]
  }
  
  function getValidSets(min, max) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    SpreadsheetApp.setActiveSheet(sheet.getSheetByName('testGear'))
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues()
    var result = []
    for (var i = 0; i<1024; i++) {
      var spsArray = []
      var maxArray = []
      var set = dectobin(i).toString();
      if (set.length < 10) {
        do {
          set = "0" + set
        }
        while (set.length < 10)
      }
      Logger.log(set)
      for (var n = 0; n<set.length; n++) {
        if (set.charAt(n) == "0") {
          spsArray.push(values[(n*4)+1][6])
          maxArray.push(values[(n*4)+2][6])
        }
        if (set.charAt(n) == "1") {
          spsArray.push(values[(n*4)+3][6])
          maxArray.push(values[(n*4)+4][6])
        }
      }
      set += "01"
      spsArray.push(values[41][6])
      maxArray.push(values[42][6])
      spsArray.push(values[43][6])
      maxArray.push(values[44][6])
      Logger.log(spsArray)
      var spsMinMax = spsRange(spsArray, maxArray)
      if ((min < spsMinMax[0] && spsMinMax[0] < max) || (min < spsMinMax[1] && spsMinMax[1] < max)) {
        result.push(set)
      }
    }
    return result
  }
  
  function getValidMelds(ids, min, max) {
    var ids = ["111110010101"]
    var min = 1400
    var max = 1500
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    SpreadsheetApp.setActiveSheet(sheet.getSheetByName('possibleMelds'))
    var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues()
    var result = [[]]
    for (var i = 0; i < ids.length; i++) {
      for (var n = 0; n < 34012224; n++) {
        var statArray = []
        var meld = dectosex(n).toString();
        if (meld.length < 12) {
          do {
            meld = "0" + meld
          }
          while (meld.length < 12)
        }
        meld = meld.split("").reverse().join("");
        for (var k = 0; k<meld.length; k++) {
          if (k < 6) {
            if (ids[i].charAt(k) == "0") {
              switch (meld.charAt(k)) {
                case "0":
                  statArray.push(values[(k*12)+1].slice(1))
                  break;
                case "1":
                  statArray.push(values[(k*12)+2].slice(1))
                  break;
                case "2":
                  statArray.push(values[(k*12)+3].slice(1))
                  break;
                case "3":
                  statArray.push(values[(k*12)+4].slice(1))
                  break;
                case "4":
                  statArray.push(values[(k*12)+5].slice(1))
                  break;
                case "5":
                  statArray.push(values[(k*12)+6].slice(1))
                  break;
              }
            }
            if (ids[i].charAt(k) == "1") {
              switch (meld.charAt(k)) {
                case "0":
                  statArray.push(values[(k*12)+7].slice(1))
                  break;
                case "1":
                  statArray.push(values[(k*12)+8].slice(1))
                  break;
                case "2":
                  statArray.push(values[(k*12)+9].slice(1))
                  break;
                case "3":
                  statArray.push(values[(k*12)+10].slice(1))
                  break;
                case "4":
                  statArray.push(values[(k*12)+11].slice(1))
                  break;
                case "5":
                  statArray.push(values[(k*12)+12].slice(1))
                  break;
              }
            }
          }
          if (k > 5) {
            if (ids[i].charAt(k) == "0") {
              switch (meld.charAt(k)) {
                case "0":
                  statArray.push(values[(k*6)+1].slice(1))
                  break;
                case "1":
                  statArray.push(values[(k*6)+2].slice(1))
                  break;
                case "2":
                  statArray.push(values[(k*6)+3].slice(1))
                  break;
              }
            }
            if (ids[i].charAt(k) == "1") {
              switch (meld.charAt(k)) {
                case "0":
                  statArray.push(values[(k*6)+4].slice(1))
                  break;
                case "1":
                  statArray.push(values[(k*6)+5].slice(1))
                  break;
                case "2":
                  statArray.push(values[(k*6)+6].slice(1))
                  break;
              }
            }
          }
        }
        var statSum = statArray[0]
        //Mooncat INT base
        statSum[0] += 384;
        //Mooncat base substats
        for (var k = 1; k < statSum.length; k++) {
          statSum[k] += 364;
        }
        //Det is dumb
        statSum[3] -= 72;
          
        for (var k = 1; k < statArray.length; k++) {
          for (var l = 0; l < statArray[k].length; l++) {
            statSum[l] += statArray[k][l]
          }
        }
        if (statSum[4] < max && statSum [4] > min) {
            result[i].push(statSum)
        }
          result[i] = uniqBy(result[i], JSON.stringify)
      }
      result.push(ids[i])
    }
    return result.length
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
  
  function summing(accumulator, currentValue) {
    return accumulator + currentValue
  }
  
  function uniqBy(a, key) {
      var seen = {};
      return a.filter(function(item) {
          var k = key(item);
          return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      })
  }
  
  function dectobin(dec){
      return (dec >>> 0).toString(2);
  }
  
  function dectosex(dec){
      return (dec >>> 0).toString(6);
  }