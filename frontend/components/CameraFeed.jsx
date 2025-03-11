import "react";

function CameraFeed() {
    return (
        <div style={{ textAlign: "center" }}>
            <h2>Hand and Face Detection</h2>
            <img
                src="http://127.0.0.1:5000/video_feed"
                alt="Camera Stream"
                style={{ width: "80%", border: "2px solid black" }}
            />
        </div>
    );
}

export default CameraFeed;
