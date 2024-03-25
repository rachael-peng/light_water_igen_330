// Buttons: on click redirect to indicated page 
function redirectToPage(pageUrl) {
    window.location.href = pageUrl;
}

// INSTALLATION CONTROL 
// Define BLE device specs 
var deviceName ='ESP32';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';

// Global Variables
var bleServer;
var bleServiceFound;
// Music
var music = document.getElementById('music');

// CONNECT TO BLUETOOTH PROCEDURE
const connectButton = document.getElementById('connectBleButton');
const bleStateContainer = document.getElementById('bleState');

// Connect Button + Activate installation 
connectButton.addEventListener('click', (event) => {
  if (isWebBluetoothEnabled()){
    connectToDevice();
  }
});

// searches for esp32 BLE Device, its Service and Characteristics.
function connectToDevice(){
  navigator.bluetooth.requestDevice({
    filters: [{name: deviceName}],
    optionalServices: [bleService]
})
.then(device => {
  console.log('Device Selected:', device.name);
  bleStateContainer.innerHTML = 'Connected to Installation ' + device.name;
  bleStateContainer.style.color = "#24af37";
  // device.addEventListener('gattservicedisconnected', onDisconnected);
  return device.gatt.connect();
})
.then(gattServer =>{
  bleServer = gattServer;
  console.log("Connected to GATT Server");
  return bleServer.getPrimaryService(bleService);
})
.then(service => {
  bleServiceFound = service;
  console.log("Service discovered:", service.uuid);
})
}

// Check if BLE is available in browser - print message in console
function isWebBluetoothEnabled() {
  if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser!");
       bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser/device!";
       return false
  }
  console.log('Web Bluetooth API supported in this browser.');
  return true
}

// ACTIVATE INSTALATION
const activateButton = document.getElementById('activateInstallationButton');
activateButton.addEventListener('click', (event) => { 
  activateInstallation(installationState);

  document.getElementById('page3').classList.add('hidden');
  document.getElementById('page4').classList.remove('hidden');
});

// Activate Installation
function activateInstallation(installationStateParam) {
  music.pause(); // first pause previous music

  if (installationStateParam === "good") {
    writeOnCharacteristic(3);
    var musicSource = 'greatWaterAudio.mp3';
    music.src = musicSource;
    music.play();
  }
  else if (installationStateParam === "middle") {
    writeOnCharacteristic(2);
    music.src = 'fineWaterAudio.mp3';
    music.play();
  }
  else if (installationStateParam === "bad") {
    writeOnCharacteristic(1);
    music.src = 'badWaterAudio.mp3';
    music.play();
  }
  else {
    writeOnCharacteristic(0);
  }
}

// What value to write to ESP32
function writeOnCharacteristic(value){
  if (bleServer && bleServer.connected) {
      bleServiceFound.getCharacteristic(ledCharacteristic)
      .then(characteristic => {
          console.log("Found the LED characteristic: ", characteristic.uuid);
          const data = new Uint8Array([value]);
          return characteristic.writeValue(data);
      })
      .then(() => {
          console.log("Value written to LEDcharacteristic:", value);
      })
      .catch(error => {
          console.error("Error writing to the LED characteristic: ", error);
      });
  } else {
      console.error ("Bluetooth is not connected. Cannot write to characteristic.")
      window.alert("Bluetooth is not connected. Cannot write to characteristic. \n Connect to BLE first!")
  }
}


// /// Turn off all lights and motors
// function deactivateInstallation() {
//   // Store in local storage that the button has been clicked
//   localStorage.setItem("deactivateClicked", true);
//   document.getElementById('floatingButton').style.display = 'none';

//   writeOnCharacteristic(0);
// }


// // ALWAYS RUN AT BEGINNING
// // Determine visibility of deactivate button
// document.addEventListener("DOMContentLoaded", function() {
//   if (localStorage.getItem("deactivateClicked") === "true") {
//     document.getElementById("floatingButton").style.display = "none";
// }});

// // If on sensor or global data selection page: 
// if (window.location.pathname.endsWith("AI.html")) {
//   // Make "deactivate" button unclicked
//   localStorage.setItem("deactivateClicked", false);
// }




// GLOBAL DATA PAGES
function displayCountryData(linkID) {
  // Store the ID of water catalogue sample clicked 
  storedCountryID = linkID;
  console.log("Stored country ID:", storedCountryID);
  
  // Move to next page
  document.getElementById('page2').classList.add('hidden');
  document.getElementById('page3').classList.remove('hidden');

  // Get data based on ID of country selected
  getCountryData(storedCountryID);
  updateCountryStatsName(storedCountryID);
  updateCountryShapeFlagImage(storedCountryID);
  updateCircleBackgroundOutline();

}

// COUNTRY STATISTICS/DATA 
function getCountryData(countryID) {
  // CANADA
  if (countryID === "Canada") {
    drinkingWaterInUse2000 = 98.2;
    drinkingWaterInUse2022 = 99;
    sanitation2000 = 77.4;
    sanitation2022 = 83.9;
    installationState = "good";
  }

  // US
  else if (countryID === "US") {
    drinkingWaterInUse2000 = "N/A";
    drinkingWaterInUse2022 = 97.5;
    sanitation2000 = 96.5;
    sanitation2022 = 97;
    installationState = "good";
  }

  // MEXICO
  else if (countryID === "Mexico") {
    drinkingWaterInUse2000 = 39.6;
    drinkingWaterInUse2022 = 43;
    sanitation2000 = 17.6;
    sanitation2022 = 62.5;
    installationState = "bad";
  }

  // FRANCE
  else if (countryID === "France") {
    drinkingWaterInUse2000 = 97.4;
    drinkingWaterInUse2022 = 99.7;
    sanitation2000 = 88.8;
    sanitation2022 = 89.7;
    installationState = "good";
  }

  // RUSSIA
  else if (countryID === "Russia") {
    drinkingWaterInUse2000 = 74.7;
    drinkingWaterInUse2022 = 76.2;
    sanitation2000 = 55.4;
    sanitation2022 = 61.2;
    installationState = "middle";
  }

  // MADAGASCAR
  else if (countryID === "Madagascar") {
    drinkingWaterInUse2000 = 6.9;
    drinkingWaterInUse2022 = 22.2;
    sanitation2000 = 3.2;
    sanitation2022 = 12.3;
    installationState = "bad";
  }

  // TANZANIA
  else if (countryID === "Tanzania") {
    drinkingWaterInUse2000 = 1.4;
    drinkingWaterInUse2022 = 11.3;
    sanitation2000 = 5.8;
    sanitation2022 = 25.1;
    installationState = "bad";
  }

  // JAPAN
  else if (countryID === "Japan") {
    drinkingWaterInUse2000 = 97.8;
    drinkingWaterInUse2022 = 98.7;
    sanitation2000 = 96.4;
    sanitation2022 = 99.1;
    installationState = "good";
  }

  // PHILLIPINES
  else if (countryID === "Phillipines") {
    drinkingWaterInUse2000 = 40.6;
    drinkingWaterInUse2022 = 47.9;
    sanitation2000 = 45.5;
    sanitation2022 = 62.7;
    installationState = "bad";
  }

  // INDONESIA
  else if (countryID === "Indonesia") {
    drinkingWaterInUse2000 = 23.5;
    drinkingWaterInUse2022 = 30.3;
    sanitation2000 = "N/A";
    sanitation2022 = "N/A";
    installationState = "bad";
  }
}

// COUNTRY DISPLAY
function updateCountryStatsName(countryID) {
  document.getElementById("countryNameDisplay").innerHTML = countryID;
  document.getElementById("drinking2000").innerHTML = drinkingWaterInUse2000;
  document.getElementById("drinking2022").innerHTML = drinkingWaterInUse2022;
  document.getElementById("sanitation2000").innerHTML = sanitation2000;
  document.getElementById("sanitation2022").innerHTML = sanitation2022;
}

function updateCountryShapeFlagImage(countryID) {
  var imageCountryShapeElement = document.getElementById('dynamicCountryShapeImage');
  var imageCountryFlagElement = document.getElementById('dynamicCountryFlagImage');
  // Define the image sources based on the variable value
  var countryShapeImageSources = {
      "Canada": 'Graphics/global/country shape/Canada map.png',
      "US": 'Graphics/global/country shape/us map.png',
      "Mexico": 'Graphics/global/country shape/mexico map.png',
      "Japan": 'Graphics/global/country shape/japan map.png',
      "France": 'Graphics/global/country shape/france map.jpg',
      "Tanzania": 'Graphics/global/country shape/tanzania map.jpg',
      "Madagascar": 'Graphics/global/country shape/madagascar map.jpg',
      "Phillipines": 'Graphics/global/country shape/phillipines map.png',
      "Russia": 'Graphics/global/country shape/russia map.jpg',
      "Indonesia": 'Graphics/global/country shape/indonesia map.jpg'
  };

  var countryFlagImageSources = {
      "Canada": 'Graphics/global/country flag/Canada flag.png',
      "US": 'Graphics/global/country flag/us flag.png',
      "Mexico": 'Graphics/global/country flag/mexico flag.png',
      "Japan": 'Graphics/global/country flag/japan flag.png',
      "France": 'Graphics/global/country flag/france flag.png',
      "Tanzania": 'Graphics/global/country flag/Tanzania flag.png',
      "Madagascar": 'Graphics/global/country flag/madagascar flag.png',
      "Phillipines": 'Graphics/global/country flag/phillipines flag.png',
      "Russia": 'Graphics/global/country flag/russia flag.png',
      "Indonesia": 'Graphics/global/country flag/indonesia flag.png'
  }

  // Set the src attribute of the image element based on the variable value
  imageCountryShapeElement.src = countryShapeImageSources[countryID];
  imageCountryFlagElement.src = countryFlagImageSources[countryID];
}

function updateCircleBackgroundOutline() {
  var circleOutline1 = document.getElementById("drinkingWater2000Circle");
  var circleOutline2 = document.getElementById("drinkingWater2022Circle");
  var circleOutline3 = document.getElementById("sanitation2000Circle");
  var circleOutline4 = document.getElementById("sanitation2022Circle");

  // Update outline colour and level of background water
  // drinking water in use 2000
  if (drinkingWaterInUse2000 >= 75) {
    circleOutline1.style.borderColor = "#00fff3"; // cyan
    circleOutline1.style.backgroundPositionY = "0px";
  }
  else if (drinkingWaterInUse2000 < 50) {
    circleOutline1.style.borderColor = "red"; // red
    circleOutline1.style.backgroundPositionY = '150px';
  }
  else if (50 <= drinkingWaterInUse2000 && drinkingWaterInUse2000 < 75) {
    circleOutline1.style.borderColor = "#e0a238"; // yellow-brown
    circleOutline1.style.backgroundPositionY = "65px";
  }
  else {
    circleOutline1.style.borderColor = "white";
    circleOutline1.style.backgroundImage = 'none';
  }

  // drinking water in use 2022
  if (drinkingWaterInUse2022 >= 75) {
    circleOutline2.style.borderColor = "#00fff3"; // cyan
    circleOutline2.style.backgroundPositionY = "0px";
  }
  else if (drinkingWaterInUse2022 < 50) {
    circleOutline2.style.borderColor = "red"; // red
    circleOutline2.style.backgroundPositionY = "180px";
  }
  else if (50 <= drinkingWaterInUse2000 && drinkingWaterInUse2000 < 75) {
    circleOutline2.style.borderColor = "#e0a238"; // yellow-brown
    circleOutline2.style.backgroundPositionY = "75px";
  }
  else {
    circleOutline2.style.borderColor = "white";
    circleOutline2.style.backgroundImage = 'none';
  }

  // sanitation 2000
  if (sanitation2000 >= 75) {
    circleOutline3.style.borderColor = "#00fff3"; // cyan
    circleOutline3.style.backgroundPositionY = "0px";
  }
  else if (sanitation2000 < 50) {
    circleOutline3.style.borderColor = "red"; // red
    circleOutline3.style.backgroundPositionY = "150px";
  }
  else if (50 <= drinkingWaterInUse2000 && drinkingWaterInUse2000 < 75) {
    circleOutline3.style.borderColor = "#e0a238"; // yellow-brown
    circleOutline3.style.backgroundPositionY = "65px";
  }
  else {
    circleOutline3.style.borderColor = "white";
    circleOutline3.style.backgroundImage = 'none';
  }

  // sanitation 2022
  if (sanitation2022 >= 75) {
    circleOutline4.style.borderColor = "#00fff3"; // cyan
    circleOutline4.style.backgroundPositionY = "0px";
  }
  else if (sanitation2022 < 50) {
    circleOutline4.style.borderColor = "red"; // red
    circleOutline4.style.backgroundPositionY = "180px";
  }
  else if (sanitation2022 >=50 && sanitation2022 < 75) {
    circleOutline4.style.borderColor = "#e0a238"; // yellow-brown
    circleOutline4.style.backgroundPositionY = "75px";
  }
  else {
    circleOutline4.style.borderColor = "white";
    circleOutline4.style.backgroundImage = 'none';
  }
  
}




// WATER SAMPLES PAGES
function displayWaterSample(linkId) {
  
  // Store the ID of water catalogue sample clicked 
  storedWaterId = linkId;
  console.log("Stored water sample ID:", storedWaterId); 

  // Move to the next page
  document.getElementById('page2').classList.add('hidden');
  document.getElementById('page3').classList.remove('hidden');

  // Get data based on ID of sample selected
  getWaterData(storedWaterId);

  // Update values displayed on webpage based on water sample data 
  // (turbidity, pH, mineral and ion values)
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

  updateWaterDisplayImg();
  updateEcoliDisplay();
  updatepHTurbidityDisplay();
  updateMineralIonDisplay();
}

// WATER SAMPLE DATA 
function getWaterData(waterID) {
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
      installationState = "middle";
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
    installationState = "good";
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
    installationState = "good";
  }
  // 4. Mystery - Dirt and Lemon
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
    installationState = "bad";
  }
  
  // 5. Wreck Beach
  // 6. Rainwater
  // 7. 
}

// WATER SAMPLE DATA AND GRAPHICS DISPLAY 
// Image of Water Sample in Container
function updateWaterDisplayImg() {
  // Updating water sample image displayed based on ID of sample clicked
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
}

// E.Coli Data
function updateEcoliDisplay() {
  // Update E.Coli symbol displayed and its caption
  var bacteriaElementBackground = document.getElementById('bacteriaBackground');
  var bacteriaElementMark = document.getElementById('bacteriaMark');
  var bacteriaElementCaption = document.getElementById('bacteriaCaption')

  // If there is E.Coli present = red X
  if (ecoliBacteriaIndicator === -1) {
    bacteriaElementBackground.classList.add("red-circle");
    bacteriaElementMark.src = 'Graphics/x.png'
    bacteriaElementCaption.textContent = "E.Coli bacteria detected!";
  }
  // No E.Coli = green checkmark
  else {
    bacteriaElementBackground.classList.add("green-circle");
    bacteriaElementMark.src = 'Graphics/checkmark.png'
  }
}

// pH and Turbidity Scale and Value Display, Sample Name Display
function updatepHTurbidityDisplay() {
  // Update value and arrow and name of sample
  var movingElementpH = document.getElementById('movingpH');
  var movingElementpHNum = document.getElementById('movingpHNum');
  var movingElementTur = document.getElementById('movingturbidity');
  var movingElementTurNum = document.getElementById('movingturbidityNum');
  var nameOfSample = document.getElementById('nameSample');

  // Sample by sample positioning
  // SPANISH BANKS
  if (storedWaterId === "spanishBanks") {
    movingElementpH.style.left = '235px';
    movingElementTur.style.left = '360px';
    movingElementpHNum.style.left = '230px';
    movingElementTurNum.style.left = '355px';

    nameOfSample.textContent = "Spanish Banks Beach Water Sample";
  }

  // TAP WATER
  else if (storedWaterId === "householdTap") {
    movingElementpH.style.left = '265px';
    movingElementTur.style.left = '620px';
    movingElementpHNum.style.left = '260px';
    movingElementTurNum.style.left = '615px';

    nameOfSample.textContent = "Household Tap Water Sample";
  }

  // MYSTERY 
  else if (storedWaterId === "dirtLemon") {
    movingElementpH.style.left = '180px';
    movingElementTur.style.left = '-20px';
    movingElementpHNum.style.left = '180px';
    movingElementTurNum.style.left = '-25px';

    nameOfSample.textContent = "Mystery Water Sample";
  }

  // VANCOUVER HARBOUR
  else if (storedWaterId === "vanHarbour") {
    movingElementpH.style.left = '270px';
    movingElementTur.style.left = '595px';
    movingElementpHNum.style.left = '265px';
    movingElementTurNum.style.left = '590px';

    nameOfSample.textContent = "Vancouver Harbour Water Sample";
  }
}

// Mineral and Ion Values 
  // if ...clour...
function updateMineralIonDisplay() {

}