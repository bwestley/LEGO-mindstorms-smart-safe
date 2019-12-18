#!/usr/bin/env python3
# Setup output
import os
from ev3dev2.sound import Sound
os.system('setfont Lat7-Terminus12x6')
print("\n" * 20)
print("LEGO MINDSTORMS SMART SAFE")
print("Programmed by Brendan Westley")
print("importing modules...")
Sound().speak("importing modules. please wait")

# Import modules

modules = [
    "import sys",
    "import time",
    "import logging",
    "import json",
    "from agt import AlexaGadget",
    "import access", # Handles motor function
    "from ev3dev2.led import Leds",
    "from ev3dev2.motor import OUTPUT_A, OUTPUT_B, OUTPUT_C, MoveTank, SpeedPercent, MediumMotor",
    "from ev3dev2.display import Display"
]
names = [
    "importing sys",
    "importing time",
    "importing logging",
    "importing json",
    "importing AlexaGadget",
    "importing access",
    "importing Leds",
    "importing ev3dev2.motor",
    "importing ev3dev2.display"
]

# Import modules while displaying each name to the screen
for i in range(len(modules)):
    print(names[i]+"...")
    exec(modules[i])

# Set the logging level to INFO to see messages from AlexaGadget
print("setting up logger...")
logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(message)s')
logging.getLogger().addHandler(logging.StreamHandler(sys.stderr))
logger = logging.getLogger(__name__)

verbs = {
    "0": "shutdown",
    "1": "reboot",
    "2": "operation mode set to disable",
    "3": "operation mode set to display",
    "4": "operation mode set to no display"
}

class MindstormsGadget(AlexaGadget):
    """
    A Mindstorms gadget that operates a lego safe.
    """

    def __init__(self, passwordFile):
        """
        Performs Alexa Gadget initialization routines and ev3dev resource allocation.
        """
        super().__init__()

        # Ev3dev initialization
        self.leds = Leds()
        self.sound = Sound()
        self.safe = access.Safe()
        self.passwordFile = passwordFile
        with open(passwordFile, "r") as f:
            self.password = f.read().strip()

    def on_connected(self, device_addr):
        """
        Gadget connected to the paired Echo device.
        :param device_addr: the address of the device we connected to
        """
        self.leds.set_color("LEFT", "GREEN")
        self.leds.set_color("RIGHT", "GREEN")
        logger.info("{} connected to Echo device".format(self.friendly_name))
        self.sound.speak("connected to echo device")

    def on_disconnected(self, device_addr):
        """
        Gadget disconnected from the paired Echo device.
        :param device_addr: the address of the device we disconnected from
        """
        self.leds.set_color("LEFT", "BLACK")
        self.leds.set_color("RIGHT", "BLACK")
        logger.info("{} disconnected from Echo device".format(self.friendly_name))
        self.sound.speak("disconnected from echo device")

    def on_custom_smartsafe_gadget_control(self, directive):
        """
        Handles the Custom.Smartsafe.Gadget control directive.
        :param directive: the custom directive with the matching namespace and name
        """
        try:
            payload = json.loads(directive.payload.decode("utf-8"))
            print("Control payload: {}".format(payload), file=sys.stderr)
            control_type = payload["type"]

            # Handle the open command
            if control_type == "open":
                if payload["pass"] == self.password:
                    self.sound.play_tone(700, 0.3)
                    self.safe.open()
                else:
                    self.sound.play_tone(200, 0.5)

            # Handle the close command
            if control_type == "close":
                self.sound.play_tone(700, 0.3)
                self.safe.close()

            # Handle the change password command
            if control_type == "change_password":
                if payload["oldpass"] == self.password:
                    self.password = payload["newpass"]
                    with open(self.passwordFile, "w") as f:
                        f.write(self.password)
                    self.sound.play_tone(700, 0.3)
                else:
                    self.sound.play_tone(200, 0.5)

            # Handle the history command (not implemented)
            if control_type == "history":
                self.sound.speak("Warning: history " + payload["count"] + " not implemented.")

            # Handle the say command
            if control_type == "say":
                self.sound.speak(payload["text"])

            # Handle the control command (used for debugging)
            if control_type == "control":
                verb = payload["verb"]
                if payload["pass"] == self.password:
                    self.sound.play_tone(700, 0.3)
                    if verb in verbs:
                        self.sound.speak(verbs[verb])
                    else:
                        self.sound.speak("control verb " + verb + " not recognized.")
                    if verb == "0":
                        os.system("echo maker | sudo -S shutdown now")
                    elif verb == "1":
                        os.system("echo maker | sudo -S reboot now")
                    elif verb == "2":
                        os.system("/home/robot/alexa/smartSafe/_disable.sh")
                    elif verb == "3":
                        os.system("/home/robot/alexa/smartSafe/_display.sh")
                    elif verb == "4":
                        os.system("/home/robot/alexa/smartSafe/_nodisplay.sh")
                else:
                    self.sound.play_tone(200, 0.5)

        except KeyError:
            print("Missing expected parameters: {}".format(directive), file=sys.stderr)


if __name__ == '__main__':

    print("initializing gadget...")
    Sound().speak("initializing gadget")
    gadget = MindstormsGadget("password.txt")

    # Set LCD font and turn off blinking LEDs
    gadget.leds.set_color("LEFT", "BLACK")
    gadget.leds.set_color("RIGHT", "BLACK")

    # Startup sequence
    gadget.leds.set_color("LEFT", "GREEN")
    gadget.leds.set_color("RIGHT", "GREEN")

    # Gadget main entry point
    print("running")
    gadget.main()

    # Shutdown sequence
    print("shutdown")
    gadget.safe.stop()
    gadget.leds.set_color("LEFT", "BLACK")
    gadget.leds.set_color("RIGHT", "BLACK")
