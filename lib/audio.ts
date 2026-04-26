"use client";

// Sistema de Audio UI Generativo (Sin MP3s, puro Web Audio API)
class UISoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  init() {
    if (typeof window !== "undefined" && !this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.enabled = true;
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (!this.ctx || !this.enabled) return;
    
    // Resume context if suspended (browser policy)
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  boot() {
    this.playTone(150, "sawtooth", 0.8, 0.1);
    setTimeout(() => this.playTone(300, "square", 0.4, 0.05), 300);
    setTimeout(() => this.playTone(600, "sine", 0.8, 0.05), 600);
  }

  hover() {
    this.playTone(800, "sine", 0.1, 0.01);
  }

  click() {
    this.playTone(1200, "square", 0.15, 0.03);
    setTimeout(() => this.playTone(800, "sine", 0.1, 0.02), 50);
  }

  error() {
    this.playTone(200, "sawtooth", 0.4, 0.1);
    setTimeout(() => this.playTone(150, "sawtooth", 0.6, 0.1), 150);
  }
}

export const uiSound = new UISoundManager();
