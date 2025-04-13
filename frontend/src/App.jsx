import "./App.css";
import CameraFeed from "../components/CameraFeed/index";
import Navbar from "../components/Navbar/index";

function App() {
    return (
        <>
            <Navbar />
            <div className="app-container">
                <CameraFeed />
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
                        {/* <ToneControlPanel
                            brightness={brightness}
                            setBrightness={setBrightness}
                            noiseLevel={noiseLevel}
                            setNoiseLevel={setNoiseLevel}
                            flutterAmount={flutterAmount}
                            setFlutterAmount={setFlutterAmount}
                            minFrequency={minFrequency}
                            setMinFrequency={setMinFrequency}
                            maxFrequency={maxFrequency}
                            setMaxFrequency={setMaxFrequency}
                            playInterval={playInterval}
                            setPlayInterval={setPlayInterval}
                        /> */}
                    </div>
                </div>
            </div>
        </>
    );
}
export default App;
