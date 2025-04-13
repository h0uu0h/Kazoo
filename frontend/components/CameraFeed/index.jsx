import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import audioEngine from "../../src/utils/audioEngine";

const socket = io("http://localhost:5000");

let audioCtx = null; // 👈 全局 AudioContext

const CameraFeed = () => {
    const [streamError, setStreamError] = useState(false);
    const imgRef = useRef(null);
    const [isAudioReady, setIsAudioReady] = useState(false);

    // 用户点击页面后启用 AudioContext
    const initAudioContext = () => {
        if (!audioCtx) {
            audioEngine.resumeIfSuspended();
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            setIsAudioReady(true);
            console.log("✅ AudioContext 已激活");
        }
    };

    useEffect(() => {
        const imgElement = imgRef.current;
        const handleError = () => setStreamError(true);

        if (imgElement) {
            imgElement.addEventListener("error", handleError);
        }
        // 监听 "fist_detected" 事件
        socket.on("Left_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            leftPlayAudio();
        });

        socket.on("Right_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            rightPlayAudio();
        });
        // ✅ 监听左手的位置频率事件
        socket.on("left_hand_position", ({ y }) => {
            if (isAudioReady) {
                // 从audioEngine获取当前频率范围设置
                const minFreq = audioEngine.params.minFrequency || 110;
                const maxFreq = audioEngine.params.maxFrequency || 880;

                // 计算频率 (y值越高，频率越高)
                const frequency = minFreq + (maxFreq - minFreq) * (1 - y);

                // 确保频率有效
                if (
                    isFinite(frequency) &&
                    frequency > 20 &&
                    frequency < 20000
                ) {
                    audioEngine.playKazooTone(frequency);
                } else {
                    console.warn("Invalid frequency calculated:", frequency);
                }
            }
        });

        return () => {
            if (imgElement) {
                imgElement.removeEventListener("error", handleError);
            }
            socket.off("Left_fist_detected");
            socket.off("Right_fist_detected");
            socket.off("left_hand_position");
        };
    }, [isAudioReady]);
    const leftPlayAudio = () => {
        const audio = new Audio("/blow.wav");
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };

    const rightPlayAudio = () => {
        const audio = new Audio("/fart.wav");
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };
    return (
        <div className="camera-wrapper" onClick={initAudioContext}>
            <img
                ref={imgRef}
                src="http://127.0.0.1:5000/video_feed"
                alt="Camera Stream"
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    objectFit: "cover",
                    display: streamError ? "none" : "block",
                }}
            />

            {streamError && (
                <img
                    src="../src/bg.png"
                    alt="Default Camera"
                    onClick={() => window.location.reload()}
                    style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        objectFit: "cover",
                        cursor: "pointer",
                    }}
                />
            )}

            {!isAudioReady && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.6)",
                        padding: "10px 20px",
                        borderRadius: "12px",
                        color: "white",
                        cursor: "pointer",
                    }}>
                    🔊 点击页面启用声音
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
