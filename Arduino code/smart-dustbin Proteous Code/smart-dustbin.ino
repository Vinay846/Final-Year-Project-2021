#include <Servo.h>
#include <LiquidCrystal.h>

const int rs = 7, en = 6, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

int count = 0;
char c;
String cardId;

Servo servo_9;
Servo servo_8;
int posOfLid = 0;
int posOfSeptr = 0;


#define echoPin 10
#define trigPin 11
long duration;
int distance;

int currState;

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  
  servo_9.attach(9, 500, 2500);
  servo_8.attach(8, 500, 2500);
  
  pinMode(A0,INPUT);
  pinMode(12,OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  lcd.begin(16, 2);
  displayText("Welcome to smartDustbin...");
 
}

void loop() {
    currState = isDustbinFull();
    if(currState >= 50){
      displayText("Dustbin is full...");
      delay(1000);
      lcd.noDisplay();
      exit(0);
    }
    else{
      displayText("Please scan your card...");
      int isCardVaild = readTags();
      clockWiseServo(servo_9, posOfLid, 0, 180);
      int typeOfObj = infraredSensor();
//      1 => for metal & 0=> for Other obj
      if(typeOfObj == 1){
        displayText("Your Trash is metallic...");
        // rotate lid toward first garbage collector
        clockWiseServo(servo_8, posOfSeptr, 0, 90);
        if(isCardVaild == 1){
          displayText("You have earned 15.0 Points !");
        }else{
          displayText("Register yourself for Points!");
        }
        delay(2000);
        antiClockWiseServo(servo_8, posOfSeptr, 0, -90);
        
      }else{
        displayText("Your Trash is non-metallic...");
        // rotate lid toward second garbage collector
        antiClockWiseServo(servo_8, posOfSeptr, 0, -90);
        if(isCardVaild == 1){
          displayText("You have earned 10.0 Points !");
        }else{
          displayText("Register yourself for Points!");
        }
        delay(2000);
        clockWiseServo(servo_8, posOfSeptr, 0, 90);

      }
      antiClockWiseServo(servo_9, posOfLid, 0, -180);
      displayText("Thanks for using smart dustbin!");
    }
  
   
}


int readTags(){
  boolean flag = true;
  while(flag){
    while(Serial.available()>0)
  {
   c = Serial.read();
   count++;
   cardId += c;
   if(count == 12)  
    {
      lcd.clear();
      displayText(cardId);
      //break;
     
      if(cardId=="AB123456789A")
      {
        lcd.clear();
        displayText("Hello User...");
        digitalWrite(13, HIGH);
        return 1;
        
      }
      else
      {
      digitalWrite(13, LOW);
      lcd.clear();
      displayText("Your card is Invaild...");
      
      return 0;
      }
    }
  }
  count = 0;
  cardId="";
  delay(500);
  }
}

void clockWiseServo(Servo &theServo, int servoPostion, int fromAngel, int toAngle){
  for (servoPostion = fromAngel; servoPostion <= toAngle; servoPostion += 1) {
    theServo.write(servoPostion);
  }
}

void antiClockWiseServo(Servo &theServo, int servoPostion, int fromAngel, int toAngle){
  for (servoPostion = fromAngel; servoPostion >=toAngle; servoPostion -= 1) {
    theServo.write(servoPostion);
  }
}

int infraredSensor(){
  if(digitalRead(A0)==0)
  {
    digitalWrite(12,HIGH);
    return 1;
   }
 else{
    digitalWrite(12,LOW);
    return 0;
    }
}

int isDustbinFull(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
//  Serial.println("distance ");
//  Serial.println(distance);
//  Serial.println("cm ");
  return distance;
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
