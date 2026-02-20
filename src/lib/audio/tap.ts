let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}

/**
 * Short satisfying tap/pop sound — no external file needed
 */
export function playTap() {
	try {
		const c = getCtx();
		const now = c.currentTime;

		// Short sine pop
		const osc = c.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(800, now);
		osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

		const gain = c.createGain();
		gain.gain.setValueAtTime(0.15, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

		osc.connect(gain).connect(c.destination);
		osc.start(now);
		osc.stop(now + 0.1);
	} catch {
		// Silent fail — audio not critical
	}
}
