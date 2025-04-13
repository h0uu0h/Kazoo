import { Layout, Flex, Drawer } from "antd";
import reactLogo from "/eye2.svg";
import viteLogo from "/eye1.svg";
import styles from "./Navbar.module.css";
import musicIcon from "../../src/icon/music.svg";
import settingIcon from "../../src/icon/setting.svg";
import uploadIcon from "../../src/icon/upload.svg";
import MusicControl from "./MusicControl";
import ToneControlPanel from "../CameraFeed/ToneControlPanel";
import { useState, useEffect } from "react";
import audioEngine from "../../src/utils/audioEngine";
import { CloseOutlined } from "@ant-design/icons"; // 从Ant Design引入关闭图标

const { Header } = Layout;

const Navbar = () => {
    // 示例歌曲数据
    const currentSong = {
        name: "Anhe Bridge",
        src: "/src/assets/music/Anhe Bridge.mp3",
    };

    // 控制右侧抽屉的显示状态
    const [open, setOpen] = useState(false);

    // 音色控制参数状态
    const [brightness, setBrightness] = useState(1.0);
    const [noiseLevel, setNoiseLevel] = useState(0.02);
    const [flutterAmount, setFlutterAmount] = useState(0.01);
    const [minFrequency, setMinFrequency] = useState(110);
    const [maxFrequency, setMaxFrequency] = useState(880);
    const [playInterval, setPlayInterval] = useState(0.1);

    useEffect(() => {
        audioEngine.setToneParams({
            brightness,
            noiseLevel,
            flutterAmount,
            minFrequency,
            maxFrequency,
            playInterval,
        });
    }, [
        brightness,
        noiseLevel,
        flutterAmount,
        minFrequency,
        maxFrequency,
        playInterval,
    ]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
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
                                textDecoration: "underline",
                            }}>
                            {currentSong.name}
                        </div>
                    </Flex>

                    {/* 中间：音乐控制组件 */}
                    <MusicControl audioSrc={currentSong.src} />

                    {/* 右侧：三个按钮 */}
                    <Flex align="center" gap={16}>
                        <button className={styles.iconButton}>
                            <img
                                src={musicIcon}
                                className={styles.icon}
                                alt="Music"
                            />
                        </button>
                        <button className={styles.iconButton}>
                            <img
                                src={uploadIcon}
                                className={styles.icon}
                                alt="Upload"
                            />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={showDrawer}>
                            <img
                                src={settingIcon}
                                className={styles.icon}
                                alt="Settings"
                            />
                        </button>
                    </Flex>
                </Flex>
            </Header>

            {/* 右侧抽屉菜单 */}
            <Drawer
                title="音色控制面板"
                placement="right"
                onClose={onClose}
                open={open}
                width={350}
                mask={false}
                closeIcon={
                    <CloseOutlined style={{ color: "#fff", fontSize: 18 }} />
                }
                // 或者使用自定义SVG：
                // closeIcon={<img src={customCloseIcon} alt="close" style={{ width: 18 }} />}
                style={{ background: "#000", color: "#fff" }}>
                <ToneControlPanel
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
                />
            </Drawer>
        </>
    );
};

export default Navbar;
