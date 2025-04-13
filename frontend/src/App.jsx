import "./App.css";
import CameraFeed from "../components/CameraFeed/index";
import Navbar from "../components/Navbar/index";
import ToneControlPanel from "../components/CameraFeed/TonControlPanel";
import { useEffect, useState } from "react";
import audioEngine from "./utils/audioEngine";

// import CameraControlPanel from "../components/CameraControlPanel/index";
function App() {
    const [brightness, setBrightness] = useState(1.0);
    const [noiseLevel, setNoiseLevel] = useState(0.02);
    const [flutterAmount, setFlutterAmount] = useState(0.01);

    useEffect(() => {
        audioEngine.setToneParams({ brightness, noiseLevel, flutterAmount });
    }, [brightness, noiseLevel, flutterAmount]);

    return (
        <>
            <Navbar />
            <div className="app-container">
                {/* 摄像头组件 */}
                {/* <div className="camera-wrapper"> */}
                <CameraFeed />
                {/* </div> */}

                {/* 覆盖内容区域 */}
                <div className="content-overlay">
                    <div
                        className="content-container"
                        style={{
                            top: "64px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        {/* <CameraControlPanel /> */}
                        <ToneControlPanel
                            brightness={brightness}
                            setBrightness={setBrightness}
                            noiseLevel={noiseLevel}
                            setNoiseLevel={setNoiseLevel}
                            flutterAmount={flutterAmount}
                            setFlutterAmount={setFlutterAmount}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
