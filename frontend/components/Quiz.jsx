import { useState } from "react";

const questions = [
    {
        id: 1,
        question: "React 是什么？",
        options: ["框架", "库", "语言"],
        answer: "库",
    },
    {
        id: 2,
        question: "useState 是用来做什么的？",
        options: ["管理状态", "路由跳转", "发送请求"],
        answer: "管理状态",
    },
    {
        id: 3,
        question: "React 的虚拟 DOM 是？",
        options: ["真实 DOM", "JavaScript 对象", "数据库"],
        answer: "JavaScript 对象",
    },
];

export default function Quiz() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (option) => {
        if (option === questions[currentIndex].answer) {
            setScore(score + 1);
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            {showResult ? (
                <div className="text-center">
                    <h2 className="text-xl font-bold">测试完成！</h2>
                    <p className="text-lg mt-2">
                        你的得分：{score} / {questions.length}
                    </p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
                    <h2 className="text-lg font-bold mb-4">
                        {questions[currentIndex].question}
                    </h2>
                    <div className="flex flex-col gap-2">
                        {questions[currentIndex].options.map(
                            (option, index) => (
                                <button
                                    key={index}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={() => handleAnswer(option)}>
                                    {option}
                                </button>
                            )
                        )}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        进度：{currentIndex + 1} / {questions.length}
                    </p>
                </div>
            )}
        </div>
    );
}
