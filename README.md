# Operation Blackout

## Overview

Operation Blackout is a 2D top-down tactical shooter built using HTML5 Canvas and JavaScript. The player navigates through a procedurally generated facility consisting of multiple interconnected rooms populated with hostile enemies.

The objective is to eliminate all enemies before the player's health reaches zero or the mission timer expires. The game emphasizes tactical movement, aiming, room-clearing combat, and enemy AI behavior.

---

## Features

### Procedurally Generated Map

* Multi-room facility generated at runtime.
* Each room contains walls, doors, and enemy units.
* Different room layouts are created for every run.

### Player Mechanics

* WASD movement.
* Mouse-based aiming.
* Directional weapon system.
* Health system with real-time HUD updates.

### Combat System

* Projectile-based shooting.
* Bullet-wall collision handling.
* Bullet ricochet mechanics.
* Enemy damage and elimination system.

### Enemy AI

Enemies operate using a finite state machine:

Idle → Alert → Chase → Attack → Death

* Idle enemies patrol their assigned rooms.
* Enemies become alert when the player is detected.
* Alert enemies transition to chase mode.
* Chase enemies pursue the player.
* Attack enemies fire projectiles at the player.

### Vision System

* Directional player vision cone.
* Limited visibility creates tactical gameplay.
* Areas outside the player's field of view are obscured.

### Game States

* Pause and resume functionality.
* Game Over screen.
* Victory screen.
* Restart without page reload.

### User Interface

* Real-time health display.
* Score tracking.
* Mission timer.
* Current game mode indicator.

---

## Controls

| Key        | Action                 |
| ---------- | ---------------------- |
| W          | Move Up                |
| A          | Move Left              |
| S          | Move Down              |
| D          | Move Right             |
| Mouse      | Aim                    |
| Left Click | Shoot                  |
| P          | Pause / Resume         |
| R          | Restart After Win/Loss |

---

## Objective

Eliminate all hostile enemies within the facility before:

* Health reaches zero, or
* Mission timer expires.

Successfully clearing all enemies results in mission completion and a victory screen displaying the final score.

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* HTML5 Canvas API

---

## Future Improvements

* Advanced raycast visibility system.
* Additional enemy archetypes.
* Dynamic difficulty scaling.
* Loot and upgrade systems.
* Enhanced visual effects and animations.
