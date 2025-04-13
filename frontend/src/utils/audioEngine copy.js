class AudioEngine {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.audioCtx.destination);

        this.customWave = null;
        this.generateCustomWave(); // 生成默认自定义波形
        // this.generateKazooWave();
    }

    resumeIfSuspended() {
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
    }

    /**
     * 生成一个柔和的合成器波形（低频强，高频快速衰减）
     */
    generateCustomWave() {
        const numHarmonics = 10;
        const real = new Float32Array(numHarmonics + 1);
        const imag = new Float32Array(numHarmonics + 1);

        real[0] = 0; // 忽略直流分量
        for (let i = 1; i <= numHarmonics; i++) {
            // real[i] =  10*i; // 高频衰减，例如 1, 1/2, 1/3, ..., 1/10
            // real[i] = 1;      // 方波风格（所有谐波等权）
            real[i] = Math.pow(0.7, i);  // 高频更快速衰减，更“软”
            imag[i] = 0;     // 简化处理，仅使用实部
        }

        this.customWave = this.audioCtx.createPeriodicWave(real, imag, { disableNormalization: false });
    }
    generateKazooWave() {
        const numHarmonics = 30;
        const real = new Float32Array(numHarmonics + 1);
        const imag = new Float32Array(numHarmonics + 1);

        real[0] = 0; // DC 分量

        for (let i = 1; i <= numHarmonics; i++) {
            if (i % 2 === 1) {
                // 奇次谐波，逐渐衰减
                real[i] = 1 / i;
            }

            // 为了模拟毛刺感，加入高频尖锐谐波
            if (i > 10 && i % 3 === 0) {
                real[i] += 0.2;
            }
        }

        this.customWave = this.audioCtx.createPeriodicWave(real, imag, {
            disableNormalization: false,
        });
    }
    playKazooTone(frequency, duration = 0.5, volume = 0.12) {
        this.resumeIfSuspended();
        const ctx = this.audioCtx;

        // 1. 平滑自定义波形（更自然的谐波，去毛刺）
        const numHarmonics = 20;
        const real = new Float32Array(numHarmonics + 1);
        const imag = new Float32Array(numHarmonics + 1);
        real[0] = 0;
        for (let i = 1; i <= numHarmonics; i++) {
            if (i % 2 === 1) {
                real[i] = 1 / (i ** 1.3);  // 平滑一点的衰减曲线
            }
        }
        const kazooWave = ctx.createPeriodicWave(real, imag);

        const osc = ctx.createOscillator();
        osc.setPeriodicWave(kazooWave);
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, ctx.currentTime);
        oscGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.03); // 平滑起音
        oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);  // 平滑收尾

        // 2. 柔化白噪（低通滤波器处理）
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.03);
        noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1200; // 滤掉毛刺高频

        // 3. 可选轻 flutter（更轻柔的自然感）
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 6 + Math.random() * 2; // 轻颤音
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.01;
        lfo.connect(lfoGain).connect(oscGain.gain);

        // 路由连接
        osc.connect(oscGain).connect(this.masterGain);
        noise.connect(lowpass).connect(noiseGain).connect(this.masterGain);

        // 启动
        osc.start();
        noise.start();
        lfo.start();

        osc.stop(ctx.currentTime + duration);
        noise.stop(ctx.currentTime + duration);
        lfo.stop(ctx.currentTime + duration);
    }



    /**
     * 播放一个特定频率的音调，使用自定义波形
     */
    playTone(frequency, duration = 0.3, volume = 0.1) {
        this.resumeIfSuspended();

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.setPeriodicWave(this.customWave);
        oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    /**
     * 如果你要切换其他自定义波形，可以添加类似 generateBrightWave() 等
     */
}

const audioEngine = new AudioEngine();
export default audioEngine;
