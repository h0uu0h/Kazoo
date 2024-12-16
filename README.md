# 手部与面部检测项目

## 项目简介
本项目使用 **Flask** 和 **React** 框架，结合 **MediaPipe** 提供的手部与面部网格检测功能，构建一个实时检测系统。系统通过摄像头捕捉画面，实时检测手部关键点和面部网格，并将结果以视频流的形式显示在 React 前端。

---

## 功能特性
1. **实时手部检测**：通过 MediaPipe 的 Hand 模块检测手部关键点，并区分左右手。
2. **实时面部网格检测**：使用 MediaPipe 的 Face Mesh 模块，绘制面部关键点和网格。
3. **React 集成**：前端基于 React 实现，通过 Flask 提供视频流 API 显示检测结果。

---

## 环境依赖
- Python 3.8+
- Flask
- React
- OpenCV
- MediaPipe
- Flask-CORS

---
![效果](https://github.com/h0uu0h/Kazoo/blob/main/test.gif)
