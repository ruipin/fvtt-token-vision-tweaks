# FVTT Token Vision Tweaks
Module for Foundry VTT that provides some tweaks for Token Vision, to allow trading quality for performance, or vice-versa. Also provides a fix for a vision issue present in large open maps which may cause tokens to be able to see through distant walls, as well as a Fog-of-War memory leak.


## Features



* Allows configuration of the ray deduplication tolerance, both globally or per-scene. This option can be used to massively improve vision on large open maps at a cost of performance.

* Allows configuration of the ray cast density for Token sight, both globally or per-scene. This option can be used to slightly improve vision on large open maps at a cost of performance, although in most cases increasing the 'Ray De-duplication Tolerance' is much more effective.

* Allows setting the maximum token vision distance, regardless of illumination settings, both globally or per-scene. This can be used to e.g. limit view distance when Global Illumination is turned on, or improve performance on very large open maps by limiting how far away tokens need to render sight.


## Installation
1. Copy this link and use it in Foundry's Module Manager to install the Module

    > https://github.com/ruipin/fvtt-token-vision-tweaks/releases/latest/download/module.json

2. Enable the Module in your World's Module Settings

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. While this is not a hard dependency, it is recommended to install it for the best experience and compatibility with other modules.


## Examples

##### Default Foundry VTT 0.6.5
![Default](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/vanilla.jpg)

##### 'Fix Aggressive Wall Culling' enabled
![Fix enabled](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/fix_on.jpg)

##### 'Fix Aggressive Wall Culling' enabled, ray density increased to '0.2'
![Fix enabled, density increased](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/fix_on__density_increased.jpg)