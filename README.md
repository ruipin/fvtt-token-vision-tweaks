# FVTT Token Vision Tweaks
Module for Foundry VTT that provides some tweaks for Token Vision, to allow trading quality for performance, or vice-versa.


## Features

* Allows configuration of the ray deduplication tolerance, both globally or per-scene. This option can be used to massively improve vision on large open maps at a cost of performance.

* Allows configuration of the ray cast density for Token sight, both globally or per-scene. This option can be used to slightly improve vision on large open maps at a cost of performance, although in most cases increasing the 'Ray De-duplication Tolerance' is much more effective.

* Allows setting the maximum token vision distance, regardless of illumination settings, both globally or per-scene. This can be used to e.g. limit view distance when Global Illumination is turned on, or improve performance on very large open maps by limiting how far away tokens need to render sight.

* Allows configuration of Foundry's 'Exact Vision Threshold', both globally or per-scene. This is the number of walls in the map at which vision becomes approximate.


## Installation
1. Copy this link and use it in Foundry's Module Manager to install the Module

    > https://github.com/ruipin/fvtt-token-vision-tweaks/releases/latest/download/module.json

2. Enable the Module in your World's Module Settings

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. While this is not a hard dependency, it is recommended to install it for the best experience and compatibility with other modules.