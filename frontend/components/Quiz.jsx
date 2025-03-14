import { useState, useEffect } from "react";
import { Card, Spin, Flex, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import styles from "./Quiz.module.css";
import { motion, AnimatePresence } from "framer-motion";
import FancyButton from "./FancyButton";

export default function QuizApp() {
    const currentURL = window.location.href;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentURL);
            message.success("リンクをクリップボードに正常にコピーしました。");
        } catch (error) {
            message.error("コピーは失敗しました、手動でコピーしてください。");
            console.error(error);
        }
    };

    const handleDownload = async () => {
        const result = getResult(); // 获取当前测试结果
        const imageUrl = downloadImages[result]; // 获取对应的图片路径

        if (!imageUrl) {
            message.error("未找到对应的图片");
            return;
        }

        // 创建一个隐藏的 <a> 标签用于下载
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${result}.png`; // 设置下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [questions, setQuestions] = useState([]);
    const [scores, setScores] = useState({
        運命の使者: 0,
        秘めた知者: 0,
        孤独な悪役: 0,
        癒しい天使: 0,
        面白味担当: 0,
        無愛想剣士: 0,
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        fetch("../src/assets/quiz.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    complete: (result) => {
                        const parsedQuestions = result.data.map((row) => {
                            let options = [
                                {
                                    text: row["A"],
                                    category: row["A_category"],
                                    point: parseInt(row["A_point"], 10),
                                },
                                {
                                    text: row["B"],
                                    category: row["B_category"],
                                    point: parseInt(row["B_point"], 10),
                                },
                                {
                                    text: row["C"],
                                    category: row["C_category"],
                                    point: parseInt(row["C_point"], 10),
                                },
                            ];
                            options = options.sort(() => Math.random() - 0.5);
                            return { question: row["title"], options };
                        });
                        setQuestions(parsedQuestions);
                    },
                });
            });
    }, []);

    const handleAnswer = (category, point) => {
        setScores((prevScores) => ({
            ...prevScores,
            [category]: prevScores[category] + point,
        }));

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowResult(true);
        }
    };

    const getResult = () => {
        // 找到分数最高的类别
        return Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );
    };

    // 图片映射
    const resultImages = {
        運命の使者: "../src/assets/images/1.png", // 图片路径
        秘めた知者: "../src/assets/images/2.png",
        孤独な悪役: "../src/assets/images/3.png",
        癒しい天使: "../src/assets/images/4.png",
        面白味担当: "../src/assets/images/5.png",
        無愛想剣士: "../src/assets/images/6.png",
    };
    const downloadImages = {
        運命の使者: "../src/assets/images/11.png", // 图片路径
        秘めた知者: "../src/assets/images/22.png",
        孤独な悪役: "../src/assets/images/33.png",
        癒しい天使: "../src/assets/images/44.png",
        面白味担当: "../src/assets/images/55.png",
        無愛想剣士: "../src/assets/images/66.png",
    };
    // 按钮颜色映射
    const btnColors = {
        運命の使者: ["#fd8700", "#f4c408"], // 图片路径
        秘めた知者: ["#b7a5f3", "#92dcff"],
        孤独な悪役: ["#9fa6ec", "#7ca4df"],
        癒しい天使: ["#fd631d", "#fd8700"],
        面白味担当: ["#fc4d88", "#ff749e"],
        無愛想剣士: ["#7497eb", "#8dbbf1"],
    };

    return (
        <div className={styles.container}>
            {questions.length === 0 ? (
                <Spin size="large" />
            ) : !showResult ? (
                <Card size="small" className={styles.quizCard}>
                    <Flex horizontal justify="space-between" align="center">
                        <img
                            className={styles.logo_img}
                            src="../src/assets/rhymoss.svg"
                        />
                        <p className={styles.wt2}>二次創作小説検索サイト</p>
                    </Flex>
                    <Flex vertical gap={16}>
                        <h2 className={styles.title}>
                            {questions[currentQuestion].question}
                        </h2>
                        <Flex vertical gap={12}>
                            {questions[currentQuestion].options.map(
                                (option, index) => (
                                    <button
                                        key={index}
                                        className={styles.optionButton}
                                        onClick={() =>
                                            handleAnswer(
                                                option.category,
                                                option.point
                                            )
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
                                    </button>
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
                        width: "100%",
                        padding: "4px",
                        background: "transparent",
                        display: "inline-block",
                    }}>
                    <Card size="small" className={styles.resultCard}>
                        <Flex horizontal justify="space-between" align="center">
                            <img
                                className={styles.logo_img}
                                src="../src/assets/rhymoss.svg"
                            />
                            <p className={styles.wt2}>二次創作小説検索サイト</p>
                        </Flex>
                        {/* 根据结果展示图片 */}
                        <img
                            src={resultImages[getResult()]} // 动态加载图片
                            alt={getResult()}
                            style={{
                                width: "100%",
                                // maxWidth: "400px",
                            }}
                        />
                    </Card>
                    <Flex gap={8} style={{ width: "100%" }}>
                        <FancyButton
                            onClick={handleDownload}
                            btnColor={btnColors[getResult()][0]}>
                            画像を作成
                        </FancyButton>
                        <FancyButton
                            onClick={handleCopy}
                            btnColor={btnColors[getResult()][1]}>
                            サイトをシェア
                        </FancyButton>
                    </Flex>
                    <Flex vertical>
                        <Flex
                            horizontal
                            justify="center"
                            align="center"
                            gap={4}>
                            <img
                                className={styles.logo_img}
                                src="../src/assets/rhymoss.svg"
                            />
                            <p className={styles.wt}>| Rhymoss.com</p>
                        </Flex>
                        <div className={styles.bottomText}>
                            <SearchOutlined style={{ color: "white" }} />
                            <p className={styles.wt3}>
                                Rhymossで好きな二次創作小説を読みましょう！
                            </p>
                        </div>
                    </Flex>
                </motion.Flex>
            )}
        </div>
    );
}
