// SPDX-License-Identifier: GPLv3-or-later
// Copyright © 2020 fvtt-token-vision-tweaks Rui Pinheiro

'use strict';

import {libWrapper} from './shim.js';

Hooks.once('ready', () => {
	const MODULE_NAME = "Token Vision Tweaks";
	const MODULE_ID = "token-vision-tweaks";

	const ORIGINAL_RAY_DENSITY = 6; // from SightLayer.computeSight
	const ORIGINAL_RAY_DEDUP_TOLERANCE = 50; // from SightLayer._castRays
	const ORIGINAL_EXACT_VISION_THRESHOLD = 500; // From SightLayer


	console.log(`Loading ${MODULE_NAME} module...`);


	//---------------------------
	// Settings
	const resetSight = function() {
		// Re-initialize vision sources in the scene
		canvas.initializeSources();
	};

	game.settings.register(MODULE_ID, 'ray-dedup-tolerance', {
		name: 'Ray De-duplication Tolerance',
		default: 0,
		type: Number,
		scope: 'world',
		scene: true,
		config: true,
		hint: `The tolerance used by Foundry when performing ray de-duplication. This option can be used to massively improve vision on large open maps at a cost of performance. The Foundry default is '${ORIGINAL_RAY_DEDUP_TOLERANCE}'.  Higher is better, but also slower. Disable this override with '0'.`,
		onChange: value => resetSight()
	});

	game.settings.register(MODULE_ID, 'ray-density', {
		name: 'Ray Density',
		default: 0,
		type: Number,
		scope: 'world',
		scene: true,
		config: true,
		hint: `The density in degrees to which to guarantee that rays are broadcast. This option can be used to slightly improve vision on large open maps at a cost of performance, although in most cases increasing the 'Ray De-duplication Tolerance' is much more effective. The Foundry default is '${ORIGINAL_RAY_DENSITY}'. Lower is better, but also slower. Disable this override with '0'.`,
		onChange: value => resetSight()
	});

	game.settings.register(MODULE_ID, 'max-radius', {
		name: 'Maximum Vision Distance (Grid Units)',
		default: 0,
		type: Number,
		scope: 'world',
		scene: true,
		config: true,
		hint: "Maximum token vision distance in grid units, regardless of illumination settings. This can be used to e.g. limit view distance when Global Illumination is turned on, or improve performance on very large open maps by limiting how far away tokens need to render sight. Disable this override with '0'.",
		onChange: value => resetSight()
	});

	game.settings.register(MODULE_ID, 'exact-vision-threshold', {
		name: 'Exact Vision Threshold',
		default: 0,
		type: Number,
		scope: 'world',
		scene: true,
		config: true,
		hint: `The number of walls starting at which vision becomes approximate. The Foundry default is '${ORIGINAL_EXACT_VISION_THRESHOLD}'.  Higher is better, but also slower. Disable this override with '0'.`,
		onChange: value => resetSight()
	});

	const getSetting = function(key) {
		let result = game.scenes.active.getFlag(MODULE_ID, key);

		if(result === null || result === undefined)
			result = game.settings.get(MODULE_ID, key);

		return result;
	};


	//---------------------------
	// Add settings to the SceneConfig dialog
	Hooks.on('renderSceneConfig', (app, html, data) => {
		const selector = html.find('header:contains(Vision)').nextAll('header')[0];
		console.log(selector);

		game.settings.settings.forEach(setting => {
			if(setting.module != MODULE_ID)
				return;

			if(!setting.scene)
				return;

			let value = app.object.getFlag(MODULE_ID, setting.key);
			if(value === undefined || value === null)
				value = "";

			$(`
				<div class="form-group">
					<label>${setting.name}</label>
					<input type="text" name="flags.${MODULE_ID}.${setting.key}" placeholder="${setting.type.name}" value="${value}" data-dtype="${setting.type.name}"/>
					<p class="notes">${setting.hint} Leave empty to use value set in the ${MODULE_NAME} module settings.</p>
				</div>
			`).insertBefore(selector);
		});
	});


	Hooks.on('updateScene', (entity, diff, options, user_id) => {
		if(!diff.flags)
			return;

		if(!diff.flags[MODULE_ID])
			return;

		resetSight();
	});




	//---------------------------
	// Hook the SightLayer computeSight method and implement the ray density / max radius module functionality
	libWrapper.register(MODULE_ID, 'SightLayer.computeSight', function(computeSight, ...args) {
		let options = args[2];

		// Modify exact vision threshold if necessary
		let exactVisionThreshold = getSetting('exact-vision-threshold');
		let previousExactVisionThreshold = SightLayer.EXACT_VISION_THRESHOLD;
		if(exactVisionThreshold != 0)
			SightLayer.EXACT_VISION_THRESHOLD = exactVisionThreshold;

		// Ray Density
		let rayDensity = getSetting('ray-density');

		if(rayDensity && rayDensity > 0)
			options.density = rayDensity;


		// Sight Radius
		let maxRadius = (getSetting('max-radius') * canvas.dimensions.size) / canvas.dimensions.distance;

		if(maxRadius && maxRadius > 0)
			args[1] = Math.min(args[1], maxRadius);

		// Call wrapped method
		const result = computeSight.apply(this, args);

		// Restore old exact vision threshold
		if(exactVisionThreshold != 0)
			SightLayer.EXACT_VISION_THRESHOLD = previousExactVisionThreshold;

		// Done
		return result;
	}, 'WRAPPER');


	//---------------------------
	// Hook the SightLayer _castRays method and implement the ray dedup tolerance functionality
	libWrapper.register(MODULE_ID, 'SightLayer._castRays', function(originalCastRays, ...args) {
		// We transparently wrap if the ray dedup tolerance patch is disabled
		const tol = getSetting('ray-dedup-tolerance');
		if(tol == 0)
			return originalCastRays(...args);

		// Grab the parameters
		const x = args[0];
		const y = args[1];
		const distance = args[2];
		const options  = args[3];
		const density = options.density ?? 4;
		const endpoints = options.endpoints;
		const limitAngle = options.limitAngle ?? false;
		const aMin = options.aMin;
		const aMax = options.aMax;


		// ---- Implementation copied from SightLayer._castRays of Foundry 0.7.5
		const rOffset = 0.02;

		// Enforce that all rays increase in angle from minimum towards maximum
		const rMin = limitAngle ? Ray.fromAngle(x, y, aMin, distance) : null;
		const rMax = limitAngle ? Ray.fromAngle(x, y, aMax, distance) : null;

		// Define de-duping cast function
		const cast = (ray) => { /* <= MODULE CUSTOMIZATION */
			let a = Math.round(ray.angle * tol) / tol;
			if ( angles.has(a) ) return;
			rays.push(ray);
			angles.add(a);
		};

		// Track rays and unique emission angles
		const angles = new Set();
		const rays = [];

		// First prioritize rays which are cast directly at wall endpoints
		for ( let e of endpoints ) {
			const ray = Ray.fromAngle(x, y, Math.atan2(e[1]-y, e[0]-x), distance);
			if ( limitAngle ) {
				ray.angle = this._adjustRayAngle(aMin, ray.angle);  // Standardize the angle
				if (!Number.between(ray.angle, aMin, aMax)) continue;
			}
			cast(ray);
		}

		// Next cast rays at any non-duplicate offset angles
		const nr = rays.length;
		for ( let i=0; i<nr; i++ ) {
			const r = rays[i];
			cast(r.shiftAngle(rOffset));
			cast(r.shiftAngle(-rOffset));
		}

		// Add additional limiting and central rays
		if ( limitAngle ) {
			const aCenter = aMin + ((aMax - aMin) / 2) + Math.PI;
			const rCenter = Ray.fromAngle(x, y, aCenter, 0);
			rCenter._isCenter = true;
			cast(rMin);
			cast(rCenter);
			cast(rMax);
		}

		// Add additional approximate rays to reach a desired radial density
		if ( !!density ) {
			const rDensity = toRadians(density);
			const nFill = Math.ceil((aMax - aMin) / rDensity);
			for ( let a of Array.fromRange(nFill) ) {
				cast(Ray.fromAngle(x, y, aMin + (a * rDensity), distance), 10);
			}
		}

		// Sort rays counter-clockwise (increasing radians)
		rays.sort((r1, r2) => r1.angle - r2.angle);
		return rays;
	});
});

