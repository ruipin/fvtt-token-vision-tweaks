'use strict';

(function() {
	const MODULE_NAME = "Token Vision Tweaks";
	const MODULE_ID = "token-vision-tweaks";

	const ORIGINAL_RAY_DENSITY = 6; // from SightLayer.computeSight

	console.log(`Loading ${MODULE_NAME} module...`);


	let resetSight = function() {
		// Re-initialize all tokens in the scene
		// TODO: Only re-initialize the controlled tokens?
		canvas.sight.initializeTokens();
	};



	Hooks.on('ready', () => {
		game.settings.register(MODULE_ID, 'fix-aggressive-wall-culling', {
			name: 'Fix Aggressive Wall Culling',
			default: false,
			type: Boolean,
			scope: 'world',
			scene: false,
			config: true,
			hint: "Foundry VTT 0.6.5 (and likely 0.7.0) starts culling walls at 50 grid spaces distance from a token, no matter how far it can see. This seems to be a bug, and can cause vision to phase through walls on large open maps. Checking this option will disable this aggressive culling behavior, massively improving vision on such maps, though possibly at cost of performance.",
			onChange: value => resetSight()
		});

		game.settings.register(MODULE_ID, 'ray-density', {
			name: 'Ray Density',
			default: 0,
			type: Number,
			scope: 'world',
			scene: true,
			config: true,
			hint: `The density in degrees to which to guarantee that rays are broadcast. This can be used to trade performance for quality, or vice-versa. For example, wide open maps with few walls might look better with a higher ray density, while small maps with lots of walls might perform better with a lower ray density without a noticeable quality change. Lower is better, but also slower. The Foundry default is '${ORIGINAL_RAY_DENSITY}'. Disable this override with '0'.`,
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
	});


	//---------------------------
	// Add settings to the SceneConfig dialog
	Hooks.on('renderSceneConfig', (app, html, data) => {
		let selector = html.find('h3:contains(Vision)').nextAll('hr')[0];

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
					<input type="text" name="${setting.key}" placeholder="${setting.type.name}" value="${value}" data-dtype="${setting.type.name}"/>
					<p class="notes">${setting.hint} Leave empty to use value set in the ${MODULE_NAME} module settings.</p>
				</div>
			`).insertBefore(selector);
		});
	});

	Hooks.on('preUpdateScene', (entity, diff, options, user_id) => {
		game.settings.settings.forEach(setting => {
			if(setting.module != MODULE_ID)
				return;

			if(!setting.scene)
				return;

			if(!(setting.key in diff))
				return;

			let value = diff[setting.key];
			if(value == "null")
				value = null;

			entity.setFlag(MODULE_ID, setting.key, value);
		});
	});


	Hooks.on('updateScene', (entity, diff, options, user_id) => {
		if(!diff.flags)
			return;

		if(!diff.flags[MODULE_ID])
			return;

		resetSight();
	});


	let getSetting = function(key) {
		try {
			let result = game.scenes.active.getFlag(MODULE_ID, key);

			if(result === null || result === undefined)
				result = game.settings.get(MODULE_ID, key);

			return result;
		}
		catch {
			return null;
		}
	};


	//---------------------------
	// Hook the SightLayer computeSight method and implement the main module functionality
	SightLayer.computeSight = (function () {
		const computeSight = SightLayer.computeSight;

		return function(origin, radius, options={}) {
			// Ray Density
			let rayDensity = getSetting('ray-density');

			if(rayDensity && rayDensity > 0 && rayDensity != ORIGINAL_RAY_DENSITY)
				options.density = rayDensity;


			// Sight Radius
			let maxRadius = (getSetting('max-radius') * canvas.dimensions.size) / canvas.dimensions.distance;

			if(maxRadius && maxRadius > 0)
				radius = Math.min(radius, maxRadius);


			// Disable aggressive wall culling
			if(getSetting('fix-aggressive-wall-culling')) {
				if('cullMin' in options)
					options.cullMax = Math.max(options.cullMax, options.cullMin);
			}


			// Call wrapped method
			return computeSight.call(this, origin, radius, options);
		};
	})();
})();

