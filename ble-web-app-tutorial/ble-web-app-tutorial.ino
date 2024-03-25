/*
  Project Name:     Light Water - Installation Control
  Project Purpose:  Control Light Water installation lights and motion using bluetooth communication with web app.
  Name:             Rachael Peng

  Bluetooth communication components use some open source code, adapted to Light Water project:
    Rui Santos: Complete project details at https://RandomNerdTutorials.com/esp32-web-bluetooth/
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files.
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
*/

// Libraries for Bluetooth 
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Libraries for LED - Judith put your libraries here!
#include<FastLED.h>

// Libraries for Servos - Kai put your libraries here!
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Global variables for Bluetooth
BLEServer* pServer = NULL; // pServer = pointer to BLEServer object
bool deviceConnected = false; // track if BLE device is connected
bool oldDeviceConnected = false; // track previous connection status
// Establish characteristic to control 1. LEDs and 2. Servos board 
BLECharacteristic* pLedServoCharacteristic = NULL;  // pLedServoCharacteristic point to BLECharacteristic
uint32_t value = 0;

// Global variables for LED - Judith put your global variables here!
#define LED_PIN 23 //need to be change
#define LED_NUM 240
#define LNUM_LEDS 239
CRGB led[LED_NUM];

// Global variables for acrylic - Judith put your global variables here!
#define DIM_NUM_LEDS 120
#define DIM_PIN 22 // need another data pin for this acrylic
CRGB leds[DIM_NUM_LEDS];
#define BAD_DIM_BRIGHTNESS 200 // Define the brightness and speed parameters for each water quality level
#define BAD_DIM_SPEED 0.0005
#define FINE_DIM_BRIGHTNESS 100
#define FINE_DIM_SPEED 8
#define GREAT_DIM_BRIGHTNESS 50
#define GREAT_DIM_SPEED 25

// Global variables for Servos - Kai put your global variables here!
// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();
char waveSpeed;     // f = fast, m = medium, s = slow
int numMotors = 4;  // number of motors
// these values will have to be calibrated in final setup since they depend on how the motors are mounted and the load on them!
int pwmValsFast[] = {410, 250, 332};
int delayFast = 1200;
int pwmValsMed[] = {385, 280, 332};
int delayMed = 1800;
int pwmValsSlow[] = {360, 310, 332};
int delaySlow = 2400;

// Servo board connection pins - Kai put your ESP32 pins here!
// const int servoBoardControlPin = 2; // **pls adjust the number as you need, this is just a filler for now


// Following website used to generate UUIDs: https://www.uuidgenerator.net/
// UUID: unique digital identifer, distinct label that ensures every component in Bluetooth device has a unique name
//      Each service, characteristic, descriptor has a UUID
#define SERVICE_UUID        "19b10000-e8f2-537e-4f6c-d104768a1214"
#define LED_CHARACTERISTIC_UUID "19b10002-e8f2-537e-4f6c-d104768a1214"

// Functions
/// Check bluetooth connection state
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    // May not use
    // void onDisconnect(BLEServer* pServer) {
    //   deviceConnected = false;
    // }
};

/// Read value of characteristic when it changes, and turn LED on and off accordingly
class MyCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic* pLedServoCharacteristic) {
        std::string value = pLedServoCharacteristic->getValue();
        if (value.length() > 0) {
            Serial.print("Characteristic event, written: ");
            Serial.println(static_cast<int>(value[0])); // Print the integer value

            int receivedValue = static_cast<int>(value[0]);

            if (receivedValue == 3) { 
              // JUDITH: put code for "great water" led control here
              animateWaveGreat(); // Slower speed and higher gradient for great water quality
              dimBrightWaterQuality(GREAT_DIM_BRIGHTNESS, GREAT_DIM_SPEED, CRGB::Blue); //acrylic
              // END
              // KAI: put code for "great water" servo control here
              wave('s');
              // END
            } 
            else if (receivedValue == 2) {
              // JUDITH: put code for "middle water" led control here
              animateWaveFine(); // Medium speed and medium gradient for fine water quality
              dimBrightWaterQuality(FINE_DIM_BRIGHTNESS, FINE_DIM_SPEED, CRGB::Yellow); //acrylic
              // END
              // KAI: put code for "middle water" servo control here
              wave('m');
              // END
            }
            else if (receivedValue == 1) {
              // JUDITH: put code for "bad water" led control here
              animateWaveBad();  // Faster speed and lower gradient for bad water quality
              dimBrightWaterQuality(BAD_DIM_BRIGHTNESS, BAD_DIM_SPEED, CRGB::Red); //acrylic
              // END
              // KAI: put code for "bad water" servo control here
              wave('f');
              // END
            }
            else if (receivedValue == 0) {
              // FastLED.clear();
              
              for (int i = 0; i < numMotors, i++;) {
                pwm.setPWM(i, 0, 332);
              } 
              // digitalWrite(servoControlPin, LOW);
            }
        }
    }
    void wave (char spd) {
      int pwmVals[3];
      int del;
      if (spd == 'f'){
        del = delayFast; 
        for (int i = 0; i < 3; i++){
          pwmVals[i] = pwmValsFast[i];
        }
      }
      else if (spd == 'm'){
        del = delayMed; 
        for (int i = 0; i < 3; i++){
          pwmVals[i] = pwmValsMed[i];
        }
      }
      else if (spd == 's'){
        del = delaySlow; 
        for (int i = 0; i < 3; i++){
          pwmVals[i] = pwmValsSlow[i];
        }
      }
      for (int i = 0; i < 3; i++) {       // outer for loop iterates through 3 speed values for forward, back, stop
        for (int j = 0; j < 4; j++) {     // inner for loop iterates through each servo
          pwm.setPWM(j, 0, pwmVals[i]);
          Serial.println(j);
          Serial.println(pwmVals[i]);
          delay(del/numMotors);
        }
      }
    }
    
    void animateWaveBad(){
      FastLED.setBrightness(150);
      //product of 2 sine waves
      while (true){
        uint8_t sine1 = beatsin8(10, 0, LNUM_LEDS, 0, 0);
        uint8_t sine2 = beatsin8(50, 0, LNUM_LEDS, 0, 0);
        led[(sine1*sine2)/40] = CRGB(255, 10, 15);
        led[sine1] = CRGB(255, 10, 0);
        led[sine2] = CRGB(255, 10, 0);
        blur1d(led, LED_NUM, 40);
        fadeToBlackBy(led, LED_NUM, 8);
        FastLED.show();
      } 
    }
    
    void animateWaveFine(){
      FastLED.setBrightness(100);
      //product of 2 sine waves and and an extra wave
      while (true){
        uint8_t sine1 = beatsin8(5, 0, LNUM_LEDS, 0, 0);
        uint8_t sine2 = beatsin8(7, 0, LNUM_LEDS, 0, 0);
        uint8_t sine3 = beatsin8(12, 0, LNUM_LEDS, 0, 0);
        uint8_t sine4 = beatsin8(17, 0, LNUM_LEDS, 0, 0);
        led[(sine1*sine2)/60] = CRGB(255, 175, 0);
        led[(sine2*sine3)/60] = CRGB(255, 175, 0);
        led[sine2] = CRGB(255, 175, 0);
        led[sine3] = CRGB(255, 175, 0);
        blur1d(led, LED_NUM, 40);
        fadeToBlackBy(led, LED_NUM, 8);
        FastLED.show();
      }
    }
    
    void animateWaveGreat(){
      FastLED.setBrightness(50);
      //Two sine waves 180 degrees apart
      while (true){
        uint8_t sine1 = beatsin8(10, 0, LNUM_LEDS, 0, 0);
        uint8_t sine2 = beatsin8(10, 0, LNUM_LEDS, 0, 127);
        uint8_t sine3 = beatsin8(10, 0, LNUM_LEDS, 0, 254);
        led[sine1] = CRGB(100, 150, 255);
        led[sine2] = CRGB(100, 130, 255);
        led[sine3] = CRGB(100, 140, 255);
        blur1d(led, LED_NUM, 150);
        fadeToBlackBy(led, LED_NUM, 5);
        FastLED.show();
      }
    }

    void dimBrightWaterQuality(int brightness, int speed, CRGB color) {
      FastLED.setBrightness(255);
      while (true)  {
       // Dimming effect 
        for (int i = brightness; i >= 0; i--) {
          setAllLedsColor(color, i); // Set color with decreasing brightness
          FastLED.show();
          delay(speed);
        }
        // Brightening effect
        for (int i = 0; i <= brightness; i++) {
          setAllLedsColor(color, i); // Set color with increasing brightness
          FastLED.show();
          delay(speed);
        }
      }
    }
    
    void setAllLedsColor(CRGB color, int brightness) {
      for (int i = 0; i < DIM_NUM_LEDS; i++) {
        leds[i] = color;
        leds[i].fadeToBlackBy(255 - brightness); // Apply brightness level
      }
    }
};


void setup() {
  Serial.begin(115200);
  // pinMode(ledControlPin, OUTPUT); 
  // pinMode(servoBoardControlPin, OUTPUT);

  // Servo/Driver
  pwm.begin();
  pwm.setPWMFreq(50);

  // Create the BLE Device
  BLEDevice::init("ESP32");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic for LED Control
  pLedServoCharacteristic = pService->createCharacteristic(
                      LED_CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  // Register the callback for the ON button characteristic
  pLedServoCharacteristic->setCallbacks(new MyCharacteristicCallbacks());

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pLedServoCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection to notify...");

  //LED strip set up
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(led, LED_NUM);
  
  //acrylic set up
  FastLED.addLeds<WS2812B, DIM_PIN, GRB>(leds, DIM_NUM_LEDS);
}

void loop() {
    // disconnecting
    if (!deviceConnected && oldDeviceConnected) {
        Serial.println("Device disconnected.");
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.println("Start advertising");
        oldDeviceConnected = deviceConnected;
    }
    // connecting
    if (deviceConnected && !oldDeviceConnected) {
        // do stuff here on connecting
        oldDeviceConnected = deviceConnected;
        Serial.println("Device Connected");
    }
}
