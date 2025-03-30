from flask import Flask, Response
import cv2
import mediapipe as mp
import pyautogui
import numpy as np

app = Flask(__name__)

# MediaPipe 手部检测
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7, min_tracking_confidence=0.7)

# 获取屏幕大小
screen_width, screen_height = pyautogui.size()
cap = cv2.VideoCapture(0)

# 映射摄像头坐标到屏幕坐标
def map_to_screen(cam_x, cam_y, frame_width, frame_height):
    screen_x = np.interp(cam_x, [0, frame_width], [0, screen_width])
    screen_y = np.interp(cam_y, [0, frame_height], [0, screen_height])
    return int(screen_x), int(screen_y)

# 生成视频流
def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)  # 水平翻转，使其符合镜像视角
        frame_height, frame_width, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 进行手部检测
        results = hands.process(rgb_frame)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # 获取食指指尖位置
                wrist = hand_landmarks.landmark[0]
                wrist_x,wrist_y = int(wrist.x*frame_width),int(wrist.y * frame_height)
                index_finger = hand_landmarks.landmark[8]
                x, y = int(index_finger.x * frame_width), int(index_finger.y * frame_height)

                # 鼠标移动
                screen_x, screen_y = map_to_screen(wrist_x, wrist_y, frame_width, frame_height)
                pyautogui.moveTo(screen_x, screen_y)

                # 获取拇指位置，判断是否点击
                thumb_tip = hand_landmarks.landmark[4]
                thumb_x, thumb_y = int(thumb_tip.x * frame_width), int(thumb_tip.y * frame_height)

                # 计算食指与拇指的距离
                distance = np.sqrt((thumb_x - x) ** 2 + (thumb_y - y) ** 2)

                # 如果两者靠近（点击手势），执行鼠标点击
                if distance < 30:
                    pyautogui.click()

        # 转换成JPEG格式
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# 路由返回视频流
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
