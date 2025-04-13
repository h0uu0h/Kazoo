from flask import Flask, Response
from flask_socketio import SocketIO
import cv2
import mediapipe as mp
import numpy as np
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# 初始化MediaPipe Hands配置
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(
    max_num_hands=4,        # 支持最多4只手
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# 摄像头初始化
cap = cv2.VideoCapture(0)

def distance(point1, point2):
    """计算两点之间的欧几里得距离"""
    return np.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

def is_fist(hand_landmarks):
    """改进的握拳检测算法"""
    tips = [8, 12, 16, 20]  # 指尖关节点
    mcps = [5, 9, 13, 17]   # 掌指关节点
    
    total_distance = 0
    for tip, mcp in zip(tips, mcps):
        tip_point = hand_landmarks.landmark[tip]
        mcp_point = hand_landmarks.landmark[mcp]
        total_distance += distance(tip_point, mcp_point)
        
    return total_distance / 4 < 0.06  # 平均距离阈值

def generate_frames():
    """视频流生成器，包含多人手部追踪逻辑"""
    hand_states = {}    # {hand_id: (last_trigger_time, last_x, last_y, hand_type)}
    hand_id_counter = 0
    cooldown = 0.1      # 冷却时间（秒）
    tracking_threshold = 50  # 追踪匹配阈值（像素）

    while True:
        success, frame = cap.read()
        if not success:
            break

        # 图像预处理
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        current_hands = {}
        if results.multi_hand_landmarks:
            for landmarks, handedness in zip(results.multi_hand_landmarks,
                                            results.multi_handedness):
                # 获取手腕位置作为追踪点
                wrist = landmarks.landmark[0]
                cx = int(wrist.x * frame.shape[1])
                cy = int(wrist.y * frame.shape[0])
                
                # 确定手部类型（左/右）
                hand_type = "left" if "Left" in handedness.classification[0].label else "right"
                
                # 手部匹配逻辑
                matched_id = None
                min_dist = float('inf')
                for hid, (last_time, last_x, last_y, last_type) in hand_states.items():
                    dist = np.sqrt((cx - last_x)**2 + (cy - last_y)**2)
                    if dist < tracking_threshold and dist < min_dist and hand_type == last_type:
                        min_dist = dist
                        matched_id = hid

                # 分配或更新手部ID
                if matched_id is None:
                    hand_id = hand_id_counter
                    hand_id_counter += 1
                else:
                    hand_id = matched_id

                # 记录当前手部位置和类型
                current_hands[hand_id] = (cx, cy, hand_type)
                
                # 绘制手部关键点
                mp_drawing.draw_landmarks(
                    frame, landmarks, mp_hands.HAND_CONNECTIONS)
                
                # 如果是左手，发送位置信息
                if hand_type == "left":
                    # 标准化y位置 (0-1范围，1表示屏幕顶部)
                    normalized_y = wrist.y
                    # 频率将由前端根据设置的范围计算
                    socketio.emit('left_hand_position', {
                        'y': normalized_y,
                        'rawY': wrist.y  # 发送原始Y值，让前端计算频率
                    })

                # 握拳检测与事件触发
                if is_fist(landmarks):
                    now = time.time()
                    last_trigger = hand_states.get(hand_id, (0, 0, 0, ''))[0]
                    
                    if now - last_trigger > cooldown:
                        # 发送SocketIO事件
                        socketio.emit(f'{hand_type}_fist_detected')
                        print(f"触发{hand_type}手事件 ID: {hand_id}")
                        
                        # 更新状态（触发时间 + 当前位置 + 手类型）
                        hand_states[hand_id] = (now, cx, cy, hand_type)
                else:
                    # 更新位置但保留最后触发时间
                    if hand_id in hand_states:
                        last_time, _, _, last_type = hand_states[hand_id]
                        hand_states[hand_id] = (last_time, cx, cy, last_type)

        # 清理过期手部状态（2秒未更新）
        current_time = time.time()
        hand_states = {
            hid: state for hid, state in hand_states.items()
            if (current_time - state[0] < 2) or (hid in current_hands)
        }

        # 生成视频流
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """视频流路由"""
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)