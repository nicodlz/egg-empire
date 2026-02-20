let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}

/**
 * Chicken "bawk" sound — synthesized, no file needed
 */
export function playChicken() {
	try {
		const c = getCtx();
		const now = c.currentTime;

		// Main squawk — frequency modulated sine
		const osc1 = c.createOscillator();
		osc1.type = 'sawtooth';
		osc1.frequency.setValueAtTime(600, now);
		osc1.frequency.exponentialRampToValueAtTime(900, now + 0.04);
		osc1.frequency.exponentialRampToValueAtTime(500, now + 0.1);
		osc1.frequency.exponentialRampToValueAtTime(700, now + 0.15);
		osc1.frequency.exponentialRampToValueAtTime(400, now + 0.25);

		const gain1 = c.createGain();
		gain1.gain.setValueAtTime(0, now);
		gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
		gain1.gain.setValueAtTime(0.12, now + 0.08);
		gain1.gain.linearRampToValueAtTime(0.08, now + 0.12);
		gain1.gain.linearRampToValueAtTime(0.1, now + 0.15);
		gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

		// Filter to soften it
		const filter = c.createBiquadFilter();
		filter.type = 'bandpass';
		filter.frequency.value = 700;
		filter.Q.value = 2;

		osc1.connect(filter).connect(gain1).connect(c.destination);
		osc1.start(now);
		osc1.stop(now + 0.3);

		// Second chirp for "bawk bawk" feel
		const osc2 = c.createOscillator();
		osc2.type = 'sawtooth';
		osc2.frequency.setValueAtTime(550, now + 0.15);
		osc2.frequency.exponentialRampToValueAtTime(800, now + 0.19);
		osc2.frequency.exponentialRampToValueAtTime(350, now + 0.35);

		const gain2 = c.createGain();
		gain2.gain.setValueAtTime(0, now + 0.15);
		gain2.gain.linearRampToValueAtTime(0.08, now + 0.17);
		gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

		const filter2 = c.createBiquadFilter();
		filter2.type = 'bandpass';
		filter2.frequency.value = 600;
		filter2.Q.value = 2;

		osc2.connect(filter2).connect(gain2).connect(c.destination);
		osc2.start(now + 0.15);
		osc2.stop(now + 0.4);
	} catch {
		// Silent fail
	}
}
