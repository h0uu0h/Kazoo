import { Layout, Flex } from "antd";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";
import styles from "./Navbar.module.css";
import musicIcon from "../../src/icon/music.svg";
import settingIcon from "../../src/icon/setting.svg";
import uploadIcon from "../../src/icon/upload.svg";
import MusicControl from "./MusicControl";

const { Header } = Layout;

const Navbar = () => {
    // 示例歌曲数据
    const currentSong = {
        name: "Anhe Bridge",
        src: "/src/assets/music/Anhe Bridge.mp3",
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
                            />
                        </a>
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

                {/* 中间：音乐控制组件 */}
                <MusicControl audioSrc={currentSong.src} />

                {/* 右侧：三个按钮 */}
                <Flex align="center" gap={16}>
                    <button className={styles.iconButton}>
                        <img src={musicIcon} className={styles.icon} alt="Music" />
                    </button>
                    <button className={styles.iconButton}>
                        <img src={uploadIcon} className={styles.icon} alt="Upload" />
                    </button>
                    <button className={styles.iconButton}>
                        <img src={settingIcon} className={styles.icon} alt="Settings" />
                    </button>
                </Flex>
            </Flex>
        </Header>
    );
};

export default Navbar;