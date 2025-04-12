import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

// 连接到 Flask 服务器
const socket = io("http://localhost:5000");

const CameraFeed = () => {
    const [streamError, setStreamError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // 监听图像加载错误
        const imgElement = imgRef.current;
        const handleError = () => setStreamError(true);

        if (imgElement) {
            imgElement.addEventListener("error", handleError);
        }

        // 监听 "fist_detected" 事件
        socket.on("left_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            leftPlayAudio();
        });

        socket.on("right_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            rightPlayAudio();
        });

        return () => {
            if (imgElement) {
                imgElement.removeEventListener("error", handleError);
            }
            socket.off("left_fist_detected");
            socket.off("right_fist_detected");
        };
    }, []);

    // 播放音频
    const leftPlayAudio = () => {
        const audio = new Audio("/blow.wav");
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };

    const rightPlayAudio = () => {
        const audio = new Audio("/fart.wav");
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };

    return (
        <div className="camera-wrapper">
            {/* 视频流图像 */}
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

            {/* 缺省图 - 当视频流加载失败时显示 */}
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
                        cursor: "pointer", // 鼠标悬停时显示手型
                    }}
                />
            )}
        </div>
    );
};

export default CameraFeed;