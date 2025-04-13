class AudioEngine {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.connect(this.audioCtx.destination);
        this.params = {
            brightness: 1.0,
            noiseLevel: 0.02,
            flutterAmount: 0.01,
            minFrequency: 110,    // A2 (低频限制)
            maxFrequency: 880,   // A5 (高频限制)
            playInterval: 0.1     // 播放最小间隔(秒)
        };
        this.lastPlayTime = 0;
    }

    setToneParams(params) {
        this.params = { ...this.params, ...params };
    }

    playKazooTone(frequency, duration = 0.5, volume = 0.12) {
        // 验证输入参数
        if (!isFinite(frequency) || !isFinite(duration) || !isFinite(volume)) {
            console.warn('Invalid audio parameters:', { frequency, duration, volume });
            return;
        }

        // 应用参数限制
        frequency = Math.max(20, Math.min(20000, frequency));
        duration = Math.max(0.01, Math.min(2, duration));
        volume = Math.max(0, Math.min(1, volume));

        // 检查播放间隔
        if (this.params.playInterval > 0.06) {
            const now = this.audioCtx.currentTime;
            if (now - this.lastPlayTime < this.params.playInterval) {
                return;
            }
            this.lastPlayTime = now;
        }
        this.resumeIfSuspended();
        const ctx = this.audioCtx;
        const { brightness, noiseLevel, flutterAmount } = this.params;

        // 1. 自定义波形
        const numHarmonics = 20;
        const real = new Float32Array(numHarmonics + 1);
        const imag = new Float32Array(numHarmonics + 1);
        real[0] = 0;
        for (let i = 1; i <= numHarmonics; i++) {
            if (i % 2 === 1) {
                real[i] = 1 / (i ** (1.0 + brightness));
            }
        }
        const kazooWave = ctx.createPeriodicWave(real, imag);

        const osc = ctx.createOscillator();
        osc.setPeriodicWave(kazooWave);
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, ctx.currentTime);
        oscGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.03);
        oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        // 2. 白噪音（受 noiseLevel 控制 + 低通滤波）
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(noiseLevel, ctx.currentTime + 0.03);
        noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1200;

        // 3. Flutter（震动模拟，根据 flutterAmount 控制）
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 6 + Math.random() * 2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = flutterAmount;
        lfo.connect(lfoGain).connect(oscGain.gain);

        // 路由连接
        osc.connect(oscGain).connect(this.masterGain);
        noise.connect(lowpass).connect(noiseGain).connect(this.masterGain);

        osc.start();
        noise.start();
        lfo.start();

        osc.stop(ctx.currentTime + duration);
        noise.stop(ctx.currentTime + duration);
        lfo.stop(ctx.currentTime + duration);
    }

    resumeIfSuspended() {
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
    }
}

export default new AudioEngine();
