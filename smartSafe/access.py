#!/usr/bin/env python3
import ev3dev2.motor as motor

# emulates motor functionality if true
TESTING = False

class Safe:

    def __init__(self, rotations=3.8, speed=20, port='outA'):
        if TESTING:
            self.motor = None
        else:
            self.motor = motor.MediumMotor(port)
        self.rotations = rotations
        self.speed = speed

    def open(self):
        if TESTING:
            print("OPEN")
        else:
            self.motor.on_for_rotations(self.speed, -self.rotations, True)
    
    def close(self):
        if TESTING:
            print("CLOSE")
        else:
            self.motor.on_for_rotations(self.speed, self.rotations, True)

    def stop(self):
        if TESTING:
            print("STOP")
        else:
            self.motor.off(brake=False)

# Test sequence if program is run independently (not imported)
if __name__ == "__main__":
    from time import sleep

    safe = Safe()
    i = 1
    try:
        while True:
            print("TEST", i)
            print("OPEN")
            safe.open()
            sleep(1)
            print("CLOSE")
            safe.close()
            sleep(1)
            i += 1
    except KeyboardInterrupt:
        print("STOP")
    finally:
        safe.stop()