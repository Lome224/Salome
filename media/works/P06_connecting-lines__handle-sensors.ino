// Connecting Lines (2025) - handle sensors
// Adafruit Circuit Playground reading four capacitive touch pads wired to the
// train handles. Raw values are printed over serial (9600 baud) as one
// comma-separated line every 100 ms, read by TouchDesigner and forwarded to
// Max/MSP over OSC. A timer marks a "reset" every 60 seconds, added for the
// New York version after the sensors drifted or stopped responding during
// long exhibition days.

#include <Adafruit_CircuitPlayground.h>

// --- Timer ---
unsigned long previousMillis = 0;   // time of the last reset
const long interval = 60000;        // 60 s x 1000 ms

// Raw readings from the four capacitive sensors
int rawSensor0;  // pad A (pin 9)
int rawSensor1;  // pad B (pin 2)
int rawSensor2;  // pad C (pin 12)
int rawSensor3;  // pad D (pin 0)

// Capacitive input pins
int capacitancePin0 = 9;
int capacitancePin1 = 2;
int capacitancePin2 = 12;
int capacitancePin3 = 0;

void setup() {
  Serial.begin(9600);          // serial link to TouchDesigner
  CircuitPlayground.begin();
  Serial.println("--- CircuitPlayground Started ---");
  previousMillis = millis();   // start the timer
}

void loop() {
  // 1. Timer: once a minute, mark a reset so the receiving side can recalibrate
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    Serial.println();
    Serial.println(">>> 60 seconds have passed. Performing 'reset' logic now.");
    Serial.println();
  }

  // 2. Read all four sensors
  rawSensor0 = CircuitPlayground.readCap(capacitancePin0);
  rawSensor1 = CircuitPlayground.readCap(capacitancePin1);
  rawSensor2 = CircuitPlayground.readCap(capacitancePin2);
  rawSensor3 = CircuitPlayground.readCap(capacitancePin3);

  // 3. Send them as one comma-separated line
  Serial.print(rawSensor0);
  Serial.print(",");
  Serial.print(rawSensor1);
  Serial.print(",");
  Serial.print(rawSensor2);
  Serial.print(",");
  Serial.print(rawSensor3);
  Serial.println();

  // 4. Wait 100 ms so the stream stays readable
  delay(100);
}
