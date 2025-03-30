import { useRef, useEffect } from "react";
import io from "socket.io-client";

// 连接到 Flask 服务器
const socket = io("http://localhost:5000");

const CameraFeed = () => {
    // const [fistDetectedL, setFistDetectedL] = useState(false);
    // const [fistDetectedR, setFistDetectedR] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // 监听 "fist_detected" 事件
        socket.on("left_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            // setFistDetectedL(true);
            leftPlayAudio();
        });
        return () => {
            socket.off("fist_detected");
        };
    }, []);
    useEffect(() => {
        // 监听 "fist_detected" 事件
        socket.on("right_fist_detected", () => {
            console.log("前端收到握拳事件，播放音频！");
            // setFistDetectedR(true);
            rightPlayAudio();
        });
        return () => {
            socket.off("fist_detected");
        };
    }, []);

    // 播放音频
    const leftPlayAudio = () => {
        const audio = new Audio("../public/blow.wav"); // 确保前端 public 目录有音频文件
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };
    const rightPlayAudio = () => {
        const audio = new Audio("../public/fart.wav"); // 确保前端 public 目录有音频文件
        audio.play().catch((error) => console.error("音频播放失败：", error));
    };

    return (
        <div className="camera-wrapper">
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
                    display: "block",
                }}
            />
        </div>
    );
};

export default CameraFeed;
