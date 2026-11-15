// Sound from the grimoire area, always through the service locator (never the sound folder itself).
// Fire and forget: a missing sound service only warns.
import { call } from '../core/services.js';

export const snd = (name) => { call('sound.play', name); };
export const mood = (name, opts) => { call('sound.mood', name, opts); };
