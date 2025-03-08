import { useState, useEffect } from "react";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";
import axios from "axios";
import "./App.css";
import { Button, Flex } from "antd";
import { Routes, Route, Link } from "react-router-dom";
import CameraFeed from "./CameraFeed";

function Home() {
    return <h1>这是主页</h1>;
}

function About() {
    return <h1>这是关于页面</h1>;
}
function App() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios
            .get("/api/hello")
            .then((response) => setMessage(response.data.message))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <>
            <div>
                <nav>
                    <Link to="/">主页</Link> | <Link to="/about">关于</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
            <Flex align="center" justify="center" >
                <a
                    href="https://ant-design.antgroup.com/components/flex-cn"
                    target="_blank">
                    <img src={viteLogo} className="logo" alt="eye1 logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="eye2 logo"
                    />
                </a>
            </Flex>
            <h1>O※ + React</h1>
            <CameraFeed />
            <p>{message}</p>
            <div className="card">
                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
            </div>
        </>
    );
}

export default App;
