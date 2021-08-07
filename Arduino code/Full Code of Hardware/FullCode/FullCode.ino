


// defines variables for ultraSonic
#define echoPin A1
#define trigPin A2 
long duration; 
int distance; 

//defines variables for PIR
int sensor=4;
int sensor_value;

//defines variables for Servo motor
#include <Servo.h>
int pos_5 = 0;
int pos_8 = 0;
Servo servo_5;
Servo servo_8;

//defines variables for RFID
#include <SPI.h>
#include <MFRC522.h>
#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN);

//defines variables for ESP8266-01
#include "ESP8266.h"
const char *SSID     = "Universe";
const char *PASSWORD = "vinay0000";
SoftwareSerial mySerial(3, 2);
ESP8266 wifi(mySerial); 

//defines variables for Inductive Proximity Sensor
float a;

//defines variables for LCD
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);

//PIN for Button 
const int PIN_7 = 7;
 

void setup() {
  Serial.begin(9600);

//  pins for ultraSonic
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
//  pins for PIR sensor
  pinMode(sensor, INPUT);

//  pins for Servo motor
  servo_5.attach(5, 500, 2500);
  servo_8.attach(8, 500, 2500);
  

//  initilization for Rfid
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  

//  initilization for Wifi
  Serial.println(F("Connecting Wifi"));
  if (!wifi.init(SSID, PASSWORD))
  {
    Serial.println(F("Wifi Init failed. Check configuration."));
    while (true) ; // loop eternally
  }

//  initilization for Inductive Proximity Sensor
  pinMode(A0,INPUT);

// initilization for LCD
  lcd.init();
  lcd.init();
  lcd.backlight();
  displayText("Welcome to RBIGMS");
  Serial.println(F("Welcome to RBIGMS"));

  // initialize the pushbutton pin as an input:
  pinMode(PIN_7, INPUT);

  clockWiseServo(servo_5, pos_5, 0, 90);
  delay(2000);
}


void loop() {
  
  int isDustbinFull = ultraSonic();
  Serial.println(isDustbinFull);
  if(isDustbinFull <= 10){
    Serial.println("Dustbin is Full");
    displayText("Dustbin is Full");
    exit(0);
  }
  delay(1000);

  boolean isTrue = pirSensor();

  if(isTrue){
    clockWiseServo(servo_8, pos_8, 0, 180);
    delay(1000);
    
    displayText("Do you have RFID ?");
    Serial.println(F("Do you have RFID ?"));

    int IsAuthorized = checkRFID();
    
    delay(1000);

    int isMetal = InductiveProximitySensor();
    Serial.println(isMetal);
    Serial.println(pos_5);
    delay(2000);
    if(isMetal){
      clockWiseServo(servo_5, pos_5, 90, 180);
      delay(1000);
      antiClockWiseServo(servo_5, pos_5, 180, 90);
      
    }else{
      antiClockWiseServo(servo_5, pos_5, 90, 0);
      delay(1000);
      clockWiseServo(servo_5, pos_5, 0, 90);
      
    }
    if(IsAuthorized){
      apiCall();
      displayText("Point added in your account");
    }
    
    delay(2000);
    antiClockWiseServo(servo_8, pos_8, 180, 0);
    
    displayText("Welcome to RBIGMS ");
  }
}


int ultraSonic(){
  int starttime = millis();
  int endtime = starttime;
  while((endtime - starttime) <=1000){
    // Clears the trigPin condition
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    // Reads the echoPin, returns the sound wave travel time in microseconds
    duration = pulseIn(echoPin, HIGH);
    // Calculating the distance
    distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
    // Displays the distance on the Serial Monitor
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    endtime = millis();
  }
  
  return distance;
}


boolean pirSensor(){
  while(true){
    sensor_value = digitalRead(sensor); 
    if(sensor_value == 1){
        return true;
    }
    delay(500);
  }
}


int checkRFID(){
  int state_7 = 0;
  int RfidValue = 0;
  
  while(true){
    RfidValue = RfidReader();
    
    state_7 = 0;
    state_7 = digitalRead(PIN_7);
  if(RfidValue == 11){
    Serial.println(F("Valid ID"));
    return 1;
  }
  if(RfidValue == 22){
    Serial.println(F("Invalid ID"));
    return 0;
  }
  if(state_7 == 1){
    Serial.println(F("Don't have ID card"));
    displayText("Registred With us !");
    return 0;
  }
  delay(1000);
  }
  
}

int RfidReader(){
  // Look for new cards
  
  while(true){
     if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return 0;
  }
////   Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return 0;
  }
  //Show UID on serial monitor
  Serial.print(F("UID tag :"));
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  Serial.println();
  Serial.print("Message : ");
  content.toUpperCase();
  if(content.length() == 12){
    if (content.substring(1) == "CA A0 59 19") //change here the UID of the card/cards that you want to give access
  {
    Serial.println(F("Authorized access"));
    displayText("Authorized access: CA A0 59 19");
    delay(3000);
    return 11;
  }
   else{
      Serial.println(F(" Access denied"));
      displayText("Not Registred RFID");
      delay(3000);
      return 22;
    }
  }
 }
}

void apiCall(){
  Serial.println(F("Sending Request to Add point"));
  wifi.httpGet();
}

boolean InductiveProximitySensor(){
  int starttime = millis();
  int endtime = starttime;
  while((endtime - starttime) <=3000){
    a = analogRead(A0);
    if(a <= 100){
       return true;
    }
    endtime = millis();
  }
  return false;
}

void clockWiseServo(Servo &theServo, int &servoPostion, int fromAngel, int toAngle){
//  posOfSeptr = 0;
  for (servoPostion = fromAngel; servoPostion <= toAngle; servoPostion += 1) {
    theServo.write(servoPostion);
    delay(15);
  }
}

void antiClockWiseServo(Servo &theServo, int &servoPostion, int fromAngel, int toAngle){
//  posOfSeptr = 0;
  for (servoPostion = fromAngel; servoPostion >=toAngle; servoPostion -= 1) {
    theServo.write(servoPostion);
    delay(15);
  }
}


void displayText(String text){
  if(text.length() <= 0){
    return;
  }
  lcd.clear();
  String countText1 = "";
  String countText2 = "";
  for(int i=0; i<text.length(); i++){
    if(countText1.length() < 16){
      countText1 += text.charAt(i);
    }
    else if(i >= 15 && countText2.length() <= 16){
      countText2 += text.charAt(i);
    }
  }
  lcd.print(countText1);
  lcd.setCursor(0, 1); 
  lcd.print(countText2);
  delay(1000);
  
  String remainingText = text.substring(32, text.length());
  Serial.println(remainingText);
  displayText(remainingText);
}
