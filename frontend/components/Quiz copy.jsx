import { useState, useEffect, useRef } from "react";
import { Card, Button, Typography, Spin, Flex, message } from "antd";
import Papa from "papaparse";
import styles from "./Quiz.module.css";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react"; // 引入二维码组件

const { Title, Paragraph } = Typography;

export default function QuizApp() {
    const captureRef = useRef(null);
    const qrRef = useRef(null); // 绑定二维码 div
    const currentURL = window.location.href; // 获取当前 URL
    // 处理复制链接
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentURL);
            message.success("链接已成功复制到剪贴板");
        } catch (error) {
            message.error("复制失败，请手动复制");
            console.error(error);
        }
    };
    // 处理下载图片
    const handleDownload = async () => {
        if (!captureRef.current) return;

        try {
            qrRef.current.style.display = "block";

            const canvas = await html2canvas(captureRef.current, {
                useCORS: true, // 允许跨域图片
                backgroundColor: "#fff", // 设置背景色
                scale: 2, // 提高分辨率
            });

            qrRef.current.style.display = "none";

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png"); // 转换为 PNG
            link.download = "拼接图片.png"; // 下载文件名
            link.click();
            message.success("图片已成功下载！");
        } catch (error) {
            message.error("图片下载失败，请重试！");
            console.error(error);
        }
    };

    // 处理答题
    const [questions, setQuestions] = useState([]);
    const [scores, setScores] = useState({
        命运之子: 0,
        隐秘智者: 0,
        孤独反派: 0,
        治愈天使: 0,
        搞笑担当: 0,
        冷面剑客: 0,
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch("../src/assets/quiz.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    complete: (result) => {
                        const parsedQuestions = result.data.map((row) => {
                            let options = [
                                { text: row["A"], category: row["A_category"] },
                                { text: row["B"], category: row["B_category"] },
                                { text: row["C"], category: row["C_category"] },
                            ];
                            options = options.sort(() => Math.random() - 0.5);
                            return { question: row["title"], options };
                        });
                        setQuestions(parsedQuestions);
                    },
                });
            });

        fetch("../src/assets/result.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    complete: (result) => {
                        const parsedResults = result.data.map((row) => ({
                            point: parseInt(row["point"], 10),
                            title: row["title"],
                            dna: row["dna"],
                            desc: row["desc"],
                            novel_role: row["novel_role"],
                            suitable_story: row["suitable_story"],
                            reality: row["reality"],
                            quote: row["quote"],
                            bgm: row["bgm"],
                        }));
                        setResults(parsedResults);
                    },
                });
            });
    }, []);

    const handleAnswer = (category) => {
        setScores((prevScores) => ({
            ...prevScores,
            [category]: prevScores[category] + 3,
        }));

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowResult(true);
        }
    };

    const getResult = () => {
        let highestCategory = Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );
        return results.find((r) => r.title.includes(highestCategory));
    };

    return (
        <div className={styles.container}>
            {questions.length === 0 || results.length === 0 ? (
                <Spin size="large" />
            ) : !showResult ? (
                <Card className={styles.quizCard}>
                    <Flex vertical gap={16}>
                        <Title level={3} className={styles.title}>
                            {questions[currentQuestion].question}
                        </Title>
                        <Flex vertical gap={12}>
                            {questions[currentQuestion].options.map(
                                (option, index) => (
                                    <Button
                                        key={index}
                                        className={styles.optionButton}
                                        shape="round"
                                        // color="default"
                                        variant="solid"
                                        style={{
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                            height: "auto",
                                        }}
                                        onClick={() =>
                                            handleAnswer(option.category)
                                        }>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={currentQuestion}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ textAlign: "center" }}>
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                                . {option.text}
                                            </motion.span>
                                        </AnimatePresence>
                                    </Button>
                                )
                            )}
                        </Flex>
                    </Flex>
                </Card>
            ) : (
                <motion.Flex
                    key={showResult}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    vertical
                    gap={16}
                    style={{
                        padding: "10px",
                        background: "transparent",
                        display: "inline-block",
                    }}>
                    <Card className={styles.resultCard} ref={captureRef}>
                        <Title level={2} className={styles.title}>
                            你的结果：{getResult()?.title}
                        </Title>
                        <Paragraph className={styles.wt}>
                            {getResult()?.dna}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            {getResult()?.desc}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            {getResult()?.novel_role}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            适合你的剧情: {getResult()?.suitable_story}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            现实中的你: {getResult()?.reality}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            你的小说金句: {getResult()?.quote}
                        </Paragraph>
                        <Paragraph className={styles.wt}>
                            适合你的BGM: {getResult()?.bgm}
                        </Paragraph>
                        {/* 生成二维码（默认隐藏） */}
                        <div
                            ref={qrRef}
                            style={{
                                display: "none",
                                marginTop: "20px",
                                textAlign: "center",
                            }}>
                            <QRCodeCanvas value={currentURL} size={120} />
                            <Paragraph>扫描二维码测试你的同人文人设</Paragraph>
                        </div>
                    </Card>
                    <Flex gap={16} style={{ width: "100%" }}>
                        <button
                            className={styles.fancyBtn}
                            onClick={handleDownload}>
                            生成海报
                        </button>
                        <button
                            className={styles.fancyBtn}
                            onClick={handleCopy}>
                            复制链接
                        </button>
                    </Flex>
                </motion.Flex>
            )}
            <Card className={styles.resultCard}>
                <Title level={4} className={styles.title}>当前分数</Title>
                {Object.entries(scores).map(([category, score]) => (
                    <Paragraph key={category} className={styles.wt}>
                        {category}: {score} 分
                    </Paragraph>
                ))}
            </Card>
        </div>
    );
}
