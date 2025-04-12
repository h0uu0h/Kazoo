import "react";
import { Layout, Flex, Progress } from "antd";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";
import styles from "./Navbar.module.css";
import musicIcon from "../../src/icon/music.svg";
import settingIcon from "../../src/icon/setting.svg";
import uploadIcon from "../../src/icon/upload.svg";
import volumeIcon from "../../src/icon/volume.svg";
import playIcon from "../../src/icon/play.svg";

const { Header } = Layout;

const Navbar = () => {
    // 示例歌曲数据
    const currentSong = {
        name: "Example Song Name",
        progress: 30, // 进度百分比
    };

    return (
        <Header
            style={{
                position: "fixed",
                zIndex: 2,
                width: "100%",
                background: "#000000",
                color: "#fff",
                boxShadow: "0 2px 100px rgba(255, 255, 255, 0.1)",
                padding: "0",
            }}>
            <Flex
                align="center"
                justify="space-between"
                style={{ height: "100%", padding: "0 24px" }}>
                {/* 左侧：Logo和歌曲名称 */}
                <Flex align="center" gap={16}>
                    <Flex align="center" gap={8}>
                        <a
                            href="https://ant-design.antgroup.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            <img
                                src={viteLogo}
                                className={styles.navbarLogo}
                                alt="eye1 logo"
                                style={{}}
                            />
                        </a>
                        <a
                            href="https://react.dev"
                            target="_blank"
                            rel="noopener noreferrer">
                            <img
                                src={reactLogo}
                                className={styles.navbarLogo}
                                alt="eye2 logo"
                                style={{}}
                            />
                        </a>
                        {/* <img
                            src={reactLogo}
                            alt="Logo"
                            style={{ height: 24 }}
                        />
                        <img src={viteLogo} alt="Logo" style={{ height: 24 }} /> */}
                    </Flex>
                    <div
                        style={{
                            fontWeight: 500,
                            fontSize: 16,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 200,
                            fontFamily: "'Open Sans', sans-serif",
                            fontStyle: "italic",
                            fontVariationSettings: `"wght" 800`,
                            textDecoration: "underline"
                        }}>
                        {currentSong.name}
                    </div>
                </Flex>

                {/* 中间：歌曲进度条 */}
                <Flex
                    align="center"
                    gap={16}
                    style={{
                        flex: 1,
                        maxWidth: 600,
                        padding: "0 24px",
                    }}>
                    {/* 播放按钮 */}
                    <button className={styles.playButton}>
                        <img width="100%" height="100%" src={playIcon}></img>
                    </button>

                    {/* 进度条 */}
                    <div style={{ flex: 1 }}>
                        <Progress
                            percent={currentSong.progress}
                            showInfo={false}
                            strokeColor="#fff"
                            trailColor="#555"
                        />
                    </div>

                    {/* 音量按钮 */}
                    <button className={styles.volumnButton}>
                        <img width="100%" height="100%" src={volumeIcon}></img>
                    </button>
                </Flex>

                {/* 右侧：三个按钮 */}
                <Flex align="center" gap={16}>
                    {" "}
                    {/* 减小gap值让按钮更紧凑 */}
                    <button className={styles.iconButton}>
                        <img src={musicIcon} className={styles.icon} />
                    </button>
                    <button className={styles.iconButton}>
                        <img src={uploadIcon} className={styles.icon} />
                    </button>
                    <button className={styles.iconButton}>
                        <img src={settingIcon} className={styles.icon} />
                    </button>
                </Flex>
            </Flex>
        </Header>
    );
};

export default Navbar;
