import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Home from "../components/Home";
import Quiz from "../components/Quiz";
// import RandomFanficGenerator from "../components/RandomFanficGenerator";
import ImageComposer from "../components/ImageComposer";
import Navbar from "../components/Navbar";

const { Content } = Layout;

function App() {
    return (
        <>
            <Layout>
                <Navbar />
                <Content style={{ padding: "0 50px", marginTop: 64 , width: "100%"}}>
                    <div
                        className="site-layout-content"
                        style={{ padding: 24, minHeight: "100vh" }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<Quiz />} />
                                <Route
                                    path="/RandomGenerator"
                                    element={<ImageComposer />}
                                />
                            </Routes>
                    </div>
                </Content>
            </Layout>
        </>
    );
}

export default App;
