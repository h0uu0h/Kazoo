import "./App.css";
import CameraFeed from "../components/CameraFeed";
function App() {
    return (
        <div className="app-container">
            {/* 摄像头组件 */}
            {/* <div className="camera-wrapper"> */}
                <CameraFeed />
            {/* </div> */}

            {/* 覆盖内容区域 */}
            <div className="content-overlay">
                <div className="content-container">
                    {/* 这里放你的其他内容 */}
                    {/* 例如：<ControlsPanel /> */}
                </div>
            </div>
        </div>
    );
}

export default App;
