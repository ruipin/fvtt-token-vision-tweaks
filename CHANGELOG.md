# 1.3.1.2 (2020-11-15)

* No code changes.
* Explicitly announce compatibility with Foundry 0.7.7.

# 1.3.1 (2020-10-22)

* Allow changing Foundry's 'Exact Vision Threshold'. Higher values give more accurate vision, at a cost of performance.

# 1.3.0 (2020-10-22)

* Add support for Foundry 0.7.5.
* Remove support for Foundry 0.6.x.
* Remove options that applied only to 0.6.x and are no longer relevant for 0.7.5.
* Add an option to change the Ray De-duplication Tolerance. This essentially replaces the "Aggressive Culling Fix" in the previous version of the module, and can be used to massively improve vision accuracy in large open maps.
* Remove the option for GM Fog-of-War to only update when player-controlled tokens are moved. This option was useful, but would take a lot of effort to update for 0.7.5.

# 1.2.2 (2020-08-05)

* Use libWrapper instead of a custom wrapper library.

# 1.2.1 (2020-07-29)

* Updated wrapper library, in order to improve compatibility with more modules.

# 1.2.0 (2020-07-29)

* Code cleanup.
* Massively increased compatibility with other modules.
* Added Fog-of-War memory leak hotfix.
*Fixed bug where 'Only Player-Visible Tokens Update GM Fog of War' wouldn't turn on in some cases.

# 1.1.0 (2020-07-28)

* Added 'Only Player-Visible Tokens Update GM Fog of War' setting

# 1.0.0 (2020-07-27)

* First release.