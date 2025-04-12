import "./App.css";
import CameraFeed from "../components/CameraFeed";
import Navbar from "../components/Navbar/index";
// import CameraControlPanel from "../components/CameraControlPanel/index";
function App() {
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
                    <div className="content-container">
                        {/* <CameraControlPanel /> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
