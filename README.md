# FVTT Token Vision Tweaks
Module for Foundry VTT that provides some tweaks for Token Vision, to allow trading quality for performance, or vice-versa. Also provides a fix for a vision issue present in large open maps which may cause tokens to be able to see through distant walls.


## Features


* Foundry VTT 0.6.5 (and likely 0.7.0) starts culling walls at 50 grid spaces distance from a token, no matter how far it can see. This seems to be a bug, and can cause vision to phase through walls on large open maps. Checking this option will disable this aggressive culling behavior, massively improving vision on such maps, though possibly at cost of performance.

* Allows configuration of the ray cast density for Token sight, both globally or per-scene. This can be used to trade performance for quality, or vice-versa. For example, wide open maps with few walls might look better with a higher ray density, while small maps with lots of walls might perform better with a lower ray density without a noticeable quality change.

* Allows setting the maximum token vision distance, regardless of illumination settings, both globally or per-scene. This can be used to e.g. limit view distance when Global Illumination is turned on, or improve performance on very large open maps by limiting how far away tokens need to render sight.


## Installation
1. Copy this link and use it in Foundry's Module Manager to install the Module

    > https://github.com/ruipin/fvtt-token-vision-tweaks/releases/latest/download/module.json

2. Enable the Module in your World's Module Settings


### Examples

##### Default Foundry VTT 0.6.5
![Default](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/vanilla.jpg)

##### 'Fix Aggressive Wall Culling' enabled
![Fix enabled](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/fix_on.jpg)

##### 'Fix Aggressive Wall Culling' enabled, ray density increased to '0.2'
![Fix enabled, density increased](https://raw.githubusercontent.com/ruipin/fvtt-token-vision-tweaks/8ac463e6a6ac6b00a2e6cdac4f4a04090cfb65aa/fix_on__density_increased.jpg)