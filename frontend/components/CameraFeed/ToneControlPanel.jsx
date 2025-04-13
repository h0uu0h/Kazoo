/* eslint-disable react/prop-types */
import "react";
import styles from "./CameraFeed.module.css";

export default function ToneControlPanel({
    brightness,
    setBrightness,
    noiseLevel,
    setNoiseLevel,
    flutterAmount,
    setFlutterAmount,
    minFrequency,
    setMinFrequency,
    maxFrequency,
    setMaxFrequency,
    playInterval,
    setPlayInterval,
}) {
    return (
        <div
            style={{ zIndex: "99", padding: "1rem", fontFamily: "sans-serif" }}>
            <h3>🎛️ 卡祖笛音色控制台</h3>

            <label>音色亮度（高频）: {brightness.toFixed(2)}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="0.5"
                max="2"
                step="0.01"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
            />

            <br />

            <label>噪声强度: {noiseLevel.toFixed(2)}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
            />

            <br />

            <label>颤音幅度: {flutterAmount.toFixed(3)}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="0"
                max="0.05"
                step="0.001"
                value={flutterAmount}
                onChange={(e) => setFlutterAmount(parseFloat(e.target.value))}
            />
            <br />

            <label>最低频率(Hz): {minFrequency}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="55" // A1
                max="440" // A4
                step="1"
                value={minFrequency}
                onChange={(e) => setMinFrequency(parseInt(e.target.value))}
            />

            <br />

            <label>最高频率(Hz): {maxFrequency}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="220" // A3
                max="1760" // A6
                step="1"
                value={maxFrequency}
                onChange={(e) => setMaxFrequency(parseInt(e.target.value))}
            />

            <br />

            <label>播放间隔(秒): {playInterval.toFixed(2)}</label>
            <input
                className={styles.valueBar}
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={playInterval}
                onChange={(e) => setPlayInterval(parseFloat(e.target.value))}
            />
        </div>
    );
}
