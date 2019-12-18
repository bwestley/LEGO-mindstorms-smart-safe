#!/usr/bin/env python3
from time import sleep
import os
from ev3dev2.button import Button

os.system('setfont Lat7-Terminus12x6')
btn = Button()

with open("status") as f:
    status = f.read().strip()

descriptions = {
    "off": "SmartSafe will not automatically start and will have to be manually started from SSH or Brickman.",
    "display": "SmartSafe will start automatically with 20 secounds of bootup and will break Brickman. To exit while running use SSH or say \"alexa open lego mindstorms\" then \"control 0 auth [your password]\"",
    "nodisplay": "SmartSafe will start automatically and will run in the background without displaying to the screen."
}

print("The current operation mode is", status)
print("[OK]")
sleep(1)
btn.wait_for_pressed("enter")
print("To change operation mode run _off.sh, _display.sh, or _nodisplay.sh")
print("[OK]")
sleep(1)
btn.wait_for_pressed("enter")
print("In this mode", descriptions[status])
print("[OK]")
sleep(1)
btn.wait_for_pressed("enter")