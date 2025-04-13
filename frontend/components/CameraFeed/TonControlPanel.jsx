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
        </div>
    );
}
