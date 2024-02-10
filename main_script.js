// Buttons: on click redirect to indicated page 
function redirectToPage(pageUrl) {
    window.location.href = pageUrl;
}

// WATER SAMPLES PAGE 2
// Store ID of which button (link) clicked
function storeLinkId(linkId) {
  storedWaterId = linkId;
  console.log("Stored water link ID:", storedWaterId); 

  document.getElementById('page2').classList.add('hidden');
  document.getElementById('page3').classList.remove('hidden');

  getWaterData(storedWaterId);

  document.getElementById("zincVal").innerHTML = measureZinc;
  document.getElementById("ironVal").innerHTML = measureIron;
  document.getElementById("naclVal").innerHTML = measureSodiumChloride;
  document.getElementById("hardnessVal").innerHTML = measureHardness;
  document.getElementById("copperVal").innerHTML = measureCopper;
  document.getElementById("leadVal").innerHTML = measureLead;
  document.getElementById("h2sVal").innerHTML = measureHydrogenSulfide;
  document.getElementById("fluorideVal").innerHTML = measureFluoride;
  document.getElementById("sulfateVal").innerHTML = measureSulfate;
  document.getElementById("nitrateVal").innerHTML = measureNitrate;
  document.getElementById("nitriteVal").innerHTML = measureNitrite;
  document.getElementById("manganeseVal").innerHTML = measureManganese;
  document.getElementById("mercuryVal").innerHTML = measureMercury;
  document.getElementById("phVal").innerHTML = pHVal;
  document.getElementById("turbidityVal").innerHTML = turbidityVal;

  var imageElement = document.getElementById('dynamicImage');
  
  // Define the image sources based on the variable value
  var imageSources = {
      "spanishBanks": 'Graphics/sensor/samples/spanish banks sample.png',
      "householdTap": 'Graphics/sensor/samples/tap water - pH.jpeg',
      'vanHarbour': 'Graphics/sensor/samples/harbour smaple.png',
      "dirtLemon": 'Graphics/sensor/samples/eng sample - turbidity.jpeg'
  };

  // Set the src attribute of the image element based on the variable value
  imageElement.src = imageSources[storedWaterId];

  var bacteriaElementBackground = document.getElementById('bacteriaBackground');
  var bacteriaElementMark = document.getElementById('bacteriaMark');
  var bacteriaElementCaption = document.getElementById('bacteriaCaption')

  // ECOLI
  if (ecoliBacteriaIndicator === -1) {
    bacteriaElementBackground.classList.add("red-circle");
    bacteriaElementMark.src = 'Graphics/x.png'
    bacteriaElementCaption.textContent = "E.Coli bacteria detected!";
  }
  else {
    bacteriaElementBackground.classList.add("green-circle");
    bacteriaElementMark.src = 'Graphics/checkmark.png'
  }

  var movingElementpH = document.getElementById('movingpH');
  var movingElementTur = document.getElementById('movingturbidity');
  var movingElementpHNum = document.getElementById('movingpHNum');
  var movingElementTurNum = document.getElementById('movingturbidityNum');
  var nameOfSample = document.getElementById('nameSample');

  if (storedWaterId === "spanishBanks") {
    movingElementpH.style.left = '235px';
    movingElementTur.style.left = '360px';
    movingElementpHNum.style.left = '230px';
    movingElementTurNum.style.left = '355px';

    nameOfSample.textContent = "Spanish Banks Beach Water Sample";
  }
  else if (storedWaterId === "householdTap") {
    movingElementpH.style.left = '265px';
    movingElementTur.style.left = '620px';
    movingElementpHNum.style.left = '260px';
    movingElementTurNum.style.left = '615px';

    nameOfSample.textContent = "Household Tap Water Sample";
  }
  else if (storedWaterId === "dirtLemon") {
    movingElementpH.style.left = '180px';
    movingElementTur.style.left = '-20px';
    movingElementpHNum.style.left = '180px';
    movingElementTurNum.style.left = '-25px';

    nameOfSample.textContent = "Mystery Water Sample";
  }
  else if (storedWaterId === "vanHarbour") {
    movingElementpH.style.left = '270px';
    movingElementTur.style.left = '595px';
    movingElementpHNum.style.left = '265px';
    movingElementTurNum.style.left = '590px';

    nameOfSample.textContent = "Vancouver Harbour Water Sample";
  }



  // MINERAL AND ION CONCENTRATION 
  // if ...clour...
}

// Provide the data of water sample
function getWaterData(waterID) {
  // DATA:
  // 1. Spanish Banks
  if (waterID === "spanishBanks") {
      pHVal = 5.87;
      turbidityVal = 0.41;
      ecoliBacteriaIndicator = 0;
      measureSodiumChloride  = 0;
      measureZinc = 0;
      measureMercury = 0;
      measureManganese = 0;
      measureCopper = 0;
      measureIron = 0;
      measureLead = 0;
      measureHydrogenSulfide = 0;
      measureFluoride = 0;
      measureHardness = 0;
      measureSulfate = 0;
      measureNitrate = 0;
      measureNitrite = 0;
  }
  
  // 2. Household Tap Water
  else if (waterID === "householdTap") {
    pHVal = 6.24;
    turbidityVal = 0;
    ecoliBacteriaIndicator = 0;
    measureSodiumChloride = 0;
    measureZinc = 0;
    measureMercury = 0;
    measureManganese = 0;
    measureCopper = 0;
    measureIron = 0;
    measureLead = 0;
    measureHydrogenSulfide = 0;
    measureFluoride = 0;
    measureHardness = 0;
    measureSulfate = 0;
    measureNitrate = 0;
    measureNitrite = 0;
  }
  
  // 3. Vancouver Harbour
  else if (waterID === "vanHarbour") {
    pHVal = 6.35;
    turbidityVal = 0.04;
    ecoliBacteriaIndicator = 0;
    measureSodiumChloride = 0;
    measureZinc = 0;
    measureMercury = 0;
    measureManganese = 0;
    measureCopper = 0;
    measureIron = 0;
    measureLead = 0;
    measureHydrogenSulfide = 0;
    measureFluoride = 0;
    measureHardness = 0;
    measureSulfate = 0;
    measureNitrate = 0;
    measureNitrite = 0;
  }
  
  // 4. DIRT AND LEMON
  else if (waterID === "dirtLemon") {
    pHVal = 4.49;
    turbidityVal = 1;
    ecoliBacteriaIndicator = -1;
    measureSodiumChloride = 0;
    measureZinc = 0;
    measureMercury = 0;
    measureManganese = 0;
    measureCopper = 0;
    measureIron = 0;
    measureLead = 0;
    measureHydrogenSulfide = 0;
    measureFluoride = 0;
    measureHardness = 0;
    measureSulfate = 0;
    measureNitrate = 0;
    measureNitrite  = 0;
  }
  
  // FALSE CREEK
  // WRECK BEACH
  // RAINWATER
}