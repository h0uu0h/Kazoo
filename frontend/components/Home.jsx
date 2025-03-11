import "react";
import CameraFeed from "../components/CameraFeed";
import { useState, useEffect } from "react";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";
import { Button, Flex } from "antd";
import axios from "axios";


function Home() {
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
            <h1>这是主页</h1>
            <h1>O※ + React</h1>
            <Flex align="center" justify="center">
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

export default Home;
