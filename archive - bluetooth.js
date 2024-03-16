// Buttons: on click redirect to indicated page 
function redirectToPage(pageUrl) {
  window.location.href = pageUrl;
}



// CONNECT TO BLUETOOTH PROCEDURE
const connectButton = document.getElementById('connectBleButton');
const bleStateContainer = document.getElementById('bleState');

// Connect Button (search for BLE Devices only if BLE is available)
connectButton.addEventListener('click', (event) => {
  if (isWebBluetoothEnabled()){
    connectToDevice();
  }

  // Then immediately activate installation
  activateInstallation();
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


// // Disconnect Button
// restartButton.addEventListener('click', disconnectDevice, () => writeOnCharacteristic(0));
// function disconnectDevice() {
//   console.log("Disconnect Device.");
//   if (bleServer && bleServer.connected) {
//       if (sensorCharacteristicFound) {
//           sensorCharacteristicFound.stopNotifications()
//               .then(() => {
//                   console.log("Notifications Stopped");
//                   return bleServer.disconnect();
//               })
//               .then(() => {
//                   console.log("Device Disconnected");
//                   bleStateContainer.innerHTML = "Device Disconnected";
//                   bleStateContainer.style.color = "#d13a30";

//               })
//               .catch(error => {
//                   console.log("An error occurred:", error);
//               });
//       } else {
//           console.log("No characteristic found to disconnect.");
//       }
//   } else {
//       // Throw an error if Bluetooth is not connected
//       console.error("Installation is not connected.");
//       window.alert("Installation is not connected.")
//   }
// }