import { useRef } from "react";

function CameraFeed() {
    const imgRef = useRef(null);

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
}

export default CameraFeed;
