

// Buttons: on click redirect to indicated page 
function redirectToPage(pageUrl) {
    window.location.href = pageUrl;
}


// HTML elements --> JS variables
const connectButton = document.getElementById('connectBleButton');
const onButton = document.getElementById('onButton');
const bleStateContainer = document.getElementById('bleState');
const restartButton = document.getElementById('restartProcesses');

// Define BLE device specs 
var deviceName ='ESP32';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';
var sensorCharacteristic= '19b10001-e8f2-537e-4f6c-d104768a1214'

// Global Variables
var bleServer;
var bleServiceFound;

// Connect Button (search for BLE Devices only if BLE is available)
connectButton.addEventListener('click', (event) => {
  if (isWebBluetoothEnabled()){
    connectToDevice();
  }
});

// searches for  specific BLE Device, its Service and Characteristics.
function connectToDevice(){
  navigator.bluetooth.requestDevice({
    filters: [{name: deviceName}],
    optionalServices: [bleService]
})
.then(device => {
  console.log('Device Selected:', device.name);
  bleStateContainer.innerHTML = 'Connected to Installation ' + device.name;
  bleStateContainer.style.color = "#24af37";
  device.addEventListener('gattservicedisconnected', onDisconnected);
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

// Check if BLE is available in your Browser
function isWebBluetoothEnabled() {
  if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser!");
       bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser/device!";
       return false
  }
  console.log('Web Bluetooth API supported in this browser.');
  return true
}


// Disconnect Button
restartButton.addEventListener('click', disconnectDevice, () => writeOnCharacteristic(0));

// Write to the ESP32 LED Characteristic
onButton.addEventListener('click', () => writeOnCharacteristic(1));

if (bleServer && bleServer.connected) {
  bleServiceFound.getCharacteristic(ledCharacteristic)
   .then(characteristic => {
      console.log("Found the LED characteristic: ", characteristic.uuid);
      const data = new Uint8Array([value]);
      return characteristic.writeValue(data);
})
.then(() => {
  latestValueSent.innerHTML = value;
  console.log("Value written to LEDcharacteristic:", value);
})
} else {
  console.error ("Installation is not connected. Cannot write to characteristic.")
  window.alert("Installation is not connected. Cannot write to characteristic. \n Connect to BLE first!")
}

function disconnectDevice() {
  console.log("Disconnect Device.");
  if (bleServer && bleServer.connected) {
      if (sensorCharacteristicFound) {
          sensorCharacteristicFound.stopNotifications()
              .then(() => {
                  console.log("Notifications Stopped");
                  return bleServer.disconnect();
              })
              .then(() => {
                  console.log("Device Disconnected");
                  bleStateContainer.innerHTML = "Device Disconnected";
                  bleStateContainer.style.color = "#d13a30";

              })
              .catch(error => {
                  console.log("An error occurred:", error);
              });
      } else {
          console.log("No characteristic found to disconnect.");
      }
  } else {
      // Throw an error if Bluetooth is not connected
      console.error("Installation is not connected.");
      window.alert("Installation is not connected.")
  }
}