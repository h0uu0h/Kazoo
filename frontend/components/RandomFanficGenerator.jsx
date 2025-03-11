import { useState } from "react";
import styles from "./RandomFanficGenerator.module.css"; // 引入 CSS 模块
import { Input, Typography, Flex } from "antd";

const RandomFanficGenerator = () => {
    const [cp1, setCp1] = useState("");
    const [cp2, setCp2] = useState("");
    const [result, setResult] = useState(null);

    const personalities = [
        "腹黑",
        "傲娇",
        "温柔",
        "冷酷",
        "呆萌",
        "热血",
        "神秘",
        "搞笑",
    ];
    const identities = [
        "学生",
        "总裁",
        "医生",
        "杀手",
        "魔法师",
        "明星",
        "艺术家",
        "科学家",
    ];
    const abilities = [
        "读心术",
        "时间停止",
        "隐身",
        "治愈",
        "预知未来",
        "操控元素",
    ];
    const appearances = [
        "银发",
        "异色瞳",
        "泪痣",
        "疤痕",
        "高挑",
        "娇小",
        "肌肉发达",
    ];
    const relationships = [
        "青梅竹马",
        "敌对关系",
        "师生恋",
        "上下级",
        "契约关系",
        "灵魂伴侣",
    ];
    const events = [
        "一起做饭但差点把厨房炸了",
        "在图书馆偶遇并争夺同一本书",
        "下雨天共用一把伞，结果两人都淋湿了",
        "因为误会而冷战，最后在雨中相拥和解",
        "在摩天轮顶端告白",
        "一起探索神秘古堡，发现隐藏的宝藏",
    ];
    const locations = [
        "咖啡馆",
        "学校天台",
        "公园长椅",
        "海边",
        "摩天轮",
        "废弃工厂",
    ];

    const generateFanfic = () => {
        if (!cp1 || !cp2) {
            alert("请输入 CP 的名字！");
            return;
        }

        const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const result = {
            cp1: {
                name: cp1,
                personality: random(personalities),
                identity: random(identities),
                ability: random(abilities),
                appearance: random(appearances),
            },
            cp2: {
                name: cp2,
                personality: random(personalities),
                identity: random(identities),
                ability: random(abilities),
                appearance: random(appearances),
            },
            relationship: random(relationships),
            event: random(events),
            location: random(locations),
        };

        setResult(result);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>同人文随机事件生成器</h1>
            <Flex vertical gap={16}>
                <div>
                    <Typography.Title level={5}>角色1</Typography.Title>
                    <Input
                        value={cp1}
                        onChange={(e) => setCp1(e.target.value)}
                        defaultValue="Hello, antd!"
                    />
                </div>

                <div>
                    <Typography.Title level={5}>角色2</Typography.Title>
                    <Input
                        value={cp2}
                        onChange={(e) => setCp2(e.target.value)}
                        defaultValue="🔥🔥🔥"
                    />
                </div>
            </Flex>
            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    CP1 名字：
                    <input
                        type="text"
                        value={cp1}
                        onChange={(e) => setCp1(e.target.value)}
                        className={styles.input}
                    />
                </label>
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    CP2 名字：
                    <input
                        type="text"
                        value={cp2}
                        onChange={(e) => setCp2(e.target.value)}
                        className={styles.input}
                    />
                </label>
            </div>
            <button onClick={generateFanfic} className={styles.button}>
                生成随机事件
            </button>

            {result && (
                <div className={styles.resultContainer}>
                    <h2 className={styles.resultTitle}>生成结果</h2>
                    <h3 className={styles.subTitle}>
                        {result.cp1.name} 的属性：
                    </h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            性格：{result.cp1.personality}
                        </li>
                        <li className={styles.listItem}>
                            身份：{result.cp1.identity}
                        </li>
                        <li className={styles.listItem}>
                            能力：{result.cp1.ability}
                        </li>
                        <li className={styles.listItem}>
                            外貌：{result.cp1.appearance}
                        </li>
                    </ul>
                    <h3 className={styles.subTitle}>
                        {result.cp2.name} 的属性：
                    </h3>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            性格：{result.cp2.personality}
                        </li>
                        <li className={styles.listItem}>
                            身份：{result.cp2.identity}
                        </li>
                        <li className={styles.listItem}>
                            能力：{result.cp2.ability}
                        </li>
                        <li className={styles.listItem}>
                            外貌：{result.cp2.appearance}
                        </li>
                    </ul>
                    <h3 className={styles.subTitle}>
                        CP 关系：{result.relationship}
                    </h3>
                    <h3 className={styles.subTitle}>事件：{result.event}</h3>
                    <h3 className={styles.subTitle}>地点：{result.location}</h3>
                </div>
            )}
        </div>
    );
};

export default RandomFanficGenerator;
