# Photoshop Bulk Sprite Animation Exporter:
Pbsae is a script for Photoshop which will export sprite animations via Photoshop's frame animation timeline.

## Formatting for detection:
Pbsae will autodetect valid animations It can export. Valid animations can be broken down into 2 different types of animations.

* **_Full Animations_** : An animation that doesn't have multiple peices that are exported seperately.
* **_Split Animations_** : An animation that has mutliple peices that are exported seperately and stictched together later inside engine.

To format **Full Animations** for detection, it is as simple as putting any layers containing frame data that you want to be visible in the export, into a group in Photoshop. It is critical that you do not have other sub-groups inside of the Root group. A Full animation is detected by just having layers in a group labeled what you want the exported frames to be called, ex) "running", "jumping", etc. 

To format **Split Animations** for detection you simply treat each peice as a *Full Animation* and have all peices nested inside of a single Root group. Pbsae will format the exported frames as you're root folder name followed by a underscore and then the nested Full Animation name. ex) If you have a animation called "running" and you have it split up into "arms" and "legs" you will make a "running" Group, and then have you're "arms" and "legs" animations in groups labeled just that, inside of the group called "running". These two peices will be exported as "running_arms" and "running_legs".

#### Examples can be found in the "Testdoc.psd"

## Exporting
 
If you have formated you're folders correctly, then you can run the script and you will be propted with a simple window of which animations you want to export. Simple check off any you want and it will export them all to the directory inside of the script.

## TODO

* **Canvas Cropping for unsynced animations**
* **Add more to UI: File path, Canvas Crop, etc.**
* **Support Multi document exports**
* **Bug fixes and Error Catching**
