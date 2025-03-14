import "react";
import { Layout, Menu, Flex } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";

const { Header } = Layout;

const Navbar = () => {
    return (
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
            <div
                style={{
                    float: "left",
                    color: "#000",
                    fontSize: "20px",
                    marginRight: "24px",
                }}>
                <Flex align="center" justify="center" gap={6}>
                    <a
                        href="https://ant-design.antgroup.com/components/flex-cn"
                        target="_blank">
                        <img
                            src={viteLogo}
                            className="logo navbar-logo"
                            alt="eye1 logo"
                        />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img
                            src={reactLogo}
                            className="logo navbar-logo"
                            alt="eye2 logo"
                        />
                    </a>
                </Flex>
            </div>
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <Link to="/">主页</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />}>
                    <Link to="/about">问答</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SettingOutlined />}>
                    <Link to="/RandomGenerator">随机生成器</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
