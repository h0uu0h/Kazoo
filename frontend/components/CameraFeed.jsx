import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function CameraFeed() {
    const [hands, setHands] = useState([]);
    const [faces, setFaces] = useState([]);
    const imgRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.on("landmarks", (data) => {
            console.log("Received Data:", data);
            setHands(data.hands);
            setFaces(data.faces);
        });

        return () => socket.current.disconnect();
    }, []);

    const getScaledPoints = (points) => {
        if (!points || points.length === 0 || !imgRef.current) return [];
        const { width, height } = imgRef.current.getBoundingClientRect();
        return points.map(point => ({
            x: point.x * width,
            y: point.y * height
        }));
    };

    return (
        <div style={{ textAlign: "center", position: "relative" }}>
            <h2>Hand and Face Detection</h2>
            <div style={{ position: "relative" }}>
                <img
                    ref={imgRef}
                    src="http://127.0.0.1:5000/video_feed"
                    alt="Camera Stream"
                    style={{ width: "80%", border: "2px solid black" }}
                />
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "10%",
                        width: "80%",
                        height: "100%"
                    }}
                >
                    {/* 绘制手部 */}
                    {hands.map((hand, hi) => (
                        <g key={hi}>
                            {getScaledPoints(hand.points).map((point, pi) => (
                                <circle
                                    key={pi}
                                    cx={point.x}
                                    cy={point.y}
                                    r="3"
                                    fill="red"
                                />
                            ))}
                            <text
                                x={getScaledPoints(hand.points)[0]?.x}
                                y={getScaledPoints(hand.points)[0]?.y - 10}
                                fill="white"
                                fontSize="20"
                            >
                                {hand.label}
                            </text>
                        </g>
                    ))}

                    {/* 绘制面部 */}
                    {faces.map((face, fi) => (
                        <g key={fi}>
                            {getScaledPoints(face).map((point, pi) => (
                                <circle
                                    key={pi}
                                    cx={point.x}
                                    cy={point.y}
                                    r="1"
                                    fill="green"
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}

export default CameraFeed;