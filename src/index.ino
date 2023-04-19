#include <Arduino.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "DHT.h"
#include <Adafruit_Sensor.h>

#include <DHT_U.h>
// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

#define DHTPIN 5      // DHT data pin
#define DHTTYPE DHT11 // DHT 11 sensor
DHT dht(DHTPIN, DHTTYPE);

// Insert your network credentials
#define WIFI_SSID "sv"
#define WIFI_PASSWORD "20198327"

// Insert Firebase project API Key
#define API_KEY "AIzaSyBrbO30q3ttwcHCiNmnZ8nUFC_AGlQwfM4"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://esp-firebase-demo-e5255-default-rtdb.asia-southeast1.firebasedatabase.app/"

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

void setup()
{
    Serial.begin(115200);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {

        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    /* Assign the api key (required) */
    config.api_key = API_KEY;

    /* Assign the RTDB URL (required) */
    config.database_url = DATABASE_URL;

    /* Sign up */
    if (Firebase.signUp(&config, &auth, "", ""))
    {
        Serial.println("ok");
        signupOK = true;
    }
    else
    {
        Serial.printf("%s\n", config.signer.signupError.message.c_str());
    }

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    // Đồng bộ thời gian
    timeClient.begin();
    while (!timeClient.update())
    {
        timeClient.forceUpdate();
    }
    dht.begin();
}

void loop()
{
    float Humidity = dht.readHumidity();
    float Temperature = dht.readTemperature();
    // Lấy giá trị thời gian hiện tại
    timeClient.update();
    String formattedTime = timeClient.getFormattedTime();

    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0))
    {
        sendDataPrevMillis = millis();
        // Write an Int number on the database path test/int
        if (Firebase.RTDB.setFloat(&fbdo, "test/Humidity", Humidity))
        {
            Serial.println("PASSED");
        }
        else
        {
            Serial.println("FAILED");
            Serial.println("REASON: " + fbdo.errorReason());
        }
        count++;

        // Write an Float number on the database path test/float
        if (Firebase.RTDB.setFloat(&fbdo, "test/Temperature", Temperature))
        {
            Serial.println("Temperature: ");
        }
        else
        {
            Serial.println("FAILED");
            Serial.println("REASON: " + fbdo.errorReason());
        }
        if (Firebase.RTDB.setString(&fbdo, "test/Time", formattedTime))
        {
            Serial.println("formattedTime: ");
        }
        else
        {
            Serial.println("FAILED");
            Serial.println("REASON: " + fbdo.errorReason());
        }
    }
}