from flask import Flask, Response
from flask_socketio import SocketIO
import cv2
import mediapipe as mp
import numpy as np
import time  # 导入时间模块

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# 初始化 MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7, min_tracking_confidence=0.7)

# 摄像头初始化
cap = cv2.VideoCapture(0)

def distance(point1, point2):
    return np.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

def is_fist(hand_landmarks):
    tips = [8, 12, 16, 20]
    mcps = [5, 9, 13, 17]
    total_distance = 0
    for tip, mcp in zip(tips, mcps):
        tip_point = hand_landmarks.landmark[tip]
        mcp_point = hand_landmarks.landmark[mcp]
        total_distance += distance(tip_point, mcp_point)
    avg_distance = total_distance / 4
    return avg_distance < 0.06  # 调整阈值以提高稳定性

def generate_frames():
    left_fist_detected = False
    right_fist_detected = False
    last_right_trigger = 0
    last_left_trigger = 0
    cooldown = 0.5  # 冷却时间设为0.5秒

    while True:
        current_time = time.time()
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks and results.multi_handedness:
            for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                hand_label = results.multi_handedness[idx].classification[0].label
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                if is_fist(hand_landmarks):
                    if hand_label == "Left":
                        if not left_fist_detected and (current_time - last_left_trigger) > cooldown:
                            left_fist_detected = True
                            last_left_trigger = current_time
                            print("左手握拳触发")
                            socketio.emit('left_fist_detected')
                    elif hand_label == "Right":
                        if not right_fist_detected and (current_time - last_right_trigger) > cooldown:
                            right_fist_detected = True
                            last_right_trigger = current_time
                            print("右手握拳触发")
                            socketio.emit('right_fist_detected')
                else:
                    if hand_label == "Left":
                        left_fist_detected = False
                    elif hand_label == "Right":
                        right_fist_detected = False

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)