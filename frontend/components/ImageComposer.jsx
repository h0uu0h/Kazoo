import { useRef } from "react";
import { Button, Card, Typography, Space, message } from "antd";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react"; // 引入二维码组件
import RandomFanficGenerator from "./RandomFanficGenerator";

const { Title, Paragraph } = Typography;

export default function ImageComposer() {
    const captureRef = useRef(null);
    const qrRef = useRef(null); // 绑定二维码 div
    const currentURL = window.location.href; // 获取当前 URL

    // 处理下载图片
    const handleDownload = async () => {
        if (!captureRef.current || !qrRef.current) return;

        try {
            // 先显示二维码
            qrRef.current.style.display = "block";

            // 生成截图
            const canvas = await html2canvas(captureRef.current, {
                useCORS: true,
                backgroundColor: "#fff",
                scale: 2,
            });

            // 隐藏二维码
            qrRef.current.style.display = "none";

            // 创建下载链接
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "拼接图片.png";
            link.click();
            message.success("图片已成功下载！");
        } catch (error) {
            message.error("图片下载失败，请重试！");
            console.error(error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* 可截图区域 */}
            <div
                ref={captureRef}
                style={{
                    padding: "10px",
                    background: "#f5f5f5",
                    display: "inline-block",
                }}>
                <Card style={{ width: 400, textAlign: "center" }}>
                    <Title level={3}>拼接图片示例</Title>
                    <Paragraph>
                        这是一个示例，使用 html2canvas 生成图片。
                    </Paragraph>
                </Card>

                {/* 这里是随机同人文生成器 */}
                <RandomFanficGenerator />

                {/* 生成二维码（默认隐藏） */}
                <div
                    ref={qrRef}
                    style={{
                        display: "none",
                        marginTop: "20px",
                        textAlign: "center",
                    }}>
                    <QRCodeCanvas value={currentURL} size={120} />
                    <Paragraph>扫描二维码查看本页面</Paragraph>
                </div>
            </div>

            {/* 下载按钮 */}
            <Space style={{ marginTop: "20px" }}>
                <Button type="primary" onClick={handleDownload}>
                    下载拼接图片
                </Button>
            </Space>
        </div>
    );
}
