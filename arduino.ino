#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// Replace with your Wi-Fi credentials
const char* ssid = "Man's no";
const char* password = "i see dead people";

// ThingSpeak settings
const char* thingspeakHost = "api.thingspeak.com";
const String channelID = "2969501"; // Replace with your ThingSpeak channel ID
const String readAPIKey = "BMMBKGTACM56XLYV"; // Replace with your ThingSpeak read API key

// GPIO pin connected to relay module
const int relayPin = D8;  // or use GPIO5

// Battery thresholds
const int BATTERY_FULL = 100;  // Disconnect power at this level
const int BATTERY_LOW = 10;    // Reconnect power at this level

// Variables
int batteryPercentage = 0;
bool isCharging = false;
unsigned long lastFetchTime = 0;
const unsigned long fetchInterval = 3000; // Fetch data every 3 seconds (minimum recommended for ThingSpeak)

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  
  // Initially turn off the relay
  digitalWrite(relayPin, LOW);
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Fetch data from ThingSpeak as frequently as possible
  unsigned long currentTime = millis();
  if (currentTime - lastFetchTime >= fetchInterval) {
    lastFetchTime = currentTime;
    fetchBatteryData();
    
    // Immediately control relay based on new data
    controlRelay();
  }
  
  // Small delay to prevent excessive CPU usage
  delay(100);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  
  // Wait for connection with timeout
  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 20) {
    delay(500);
    Serial.print(".");
    timeout++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }
}

void fetchBatteryData() {
  WiFiClient client;
  HTTPClient http;
  
  // Construct the URL to fetch the latest data from ThingSpeak
  String url = "http://" + String(thingspeakHost) + "/channels/" + channelID + 
               "/feeds/last.json?api_key=" + readAPIKey;
  
  Serial.print("Fetching data... ");
  
  if (http.begin(client, url)) {
    int httpCode = http.GET();
    
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        
        // Parse JSON response
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, payload);
        
        if (!error) {
          // Extract battery percentage (field1) and charging status (field2)
          if (doc.containsKey("field1")) {
            batteryPercentage = doc["field1"].as<int>();
            Serial.print("Battery: ");
            Serial.print(batteryPercentage);
            Serial.print("% | ");
          }
          
          if (doc.containsKey("field2")) {
            isCharging = (doc["field2"].as<int>() == 1);
            Serial.print("Charging: ");
            Serial.println(isCharging ? "Yes" : "No");
          }
        } else {
          Serial.print("JSON parsing failed: ");
          Serial.println(error.c_str());
        }
      } else {
        Serial.print("HTTP error: ");
        Serial.println(httpCode);
      }
    } else {
      Serial.print("HTTP request failed: ");
      Serial.println(http.errorToString(httpCode).c_str());
    }
    
    http.end();
  } else {
    Serial.println("Unable to connect to ThingSpeak");
  }
}

void controlRelay() {
  // Smart Plug logic:
  // - Turn OFF relay (disconnect power) when battery is full (100% or above)
  // - Turn ON relay (connect power) when battery is low (10% or below)
  // - Keep previous state for battery levels between 10% and 100%
  
  if (batteryPercentage == BATTERY_FULL && isCharging) {
    // Battery is full and charging - disconnect power
    digitalWrite(relayPin, HIGH);
    Serial.println(digitalRead(relayPin));
    Serial.println(batteryPercentage);

    Serial.println("Battery FULL - Power disconnected");
    
  } 
  else if (batteryPercentage <= BATTERY_LOW && !isCharging) {
    // Battery is low and not charging - connect power
    digitalWrite(relayPin, LOW);
    Serial.println("Battery LOW - Power connected");
  }
  
  // Print current relay state
  Serial.print("Relay state: ");
  Serial.println(digitalRead(relayPin) == HIGH ? "ON" : "OFF");
}