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
    max_num_hands=4,  # 支持最多4只手
    min_detection_confidence=0.7,
    min_tracking_confidence=0.6,  # 降低追踪阈值，提升重连能力
)

# 摄像头初始化
cap = cv2.VideoCapture(0)


def distance(point1, point2):
    """计算两点之间的欧几里得距离"""
    return np.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)


def is_fist(hand_landmarks):
    """改进的握拳检测算法"""
    tips = [8, 12, 16, 20]  # 指尖关节点
    mcps = [5, 9, 13, 17]  # 掌指关节点

    total_distance = 0
    for tip, mcp in zip(tips, mcps):
        tip_point = hand_landmarks.landmark[tip]
        mcp_point = hand_landmarks.landmark[mcp]
        total_distance += distance(tip_point, mcp_point)

    return total_distance / 4 < 0.06  # 平均距离阈值


def generate_frames():
    """视频流生成器，包含多人手部追踪逻辑"""
    hand_states = {}  # {hand_id: (last_trigger_time, last_x, last_y)}
    hand_id_counter = 0  # 识别手部数量
    cooldown = 0.1  # 冷却时间（秒）
    tracking_threshold = 50  # 追踪匹配阈值（像素）

    # [LJC 0413] 初始化红蓝手字典：分别记录每一侧（左/右）已分配的手ID
    # 最多支持2红2蓝（旋律玩家），优先分配红色（节奏玩家）给握拳手
    red_hands = {"Left": None, "Right": None}  # 节奏玩家（双手均需要检测是否握拳）
    blue_hands = {
        "Left": None,
        "Right": None,
    }  # 旋律玩家（只需检测右手握拳，左手识别即可）
    hand_assignments = {}  # hand_id: 'red' or 'blue'

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
            for landmarks, handedness in zip(
                results.multi_hand_landmarks, results.multi_handedness
            ):
                # 首先识别左右手
                label = handedness.classification[0].label  # 'Left' or 'Right'
                # 获取手腕位置作为追踪点
                wrist = landmarks.landmark[0]
                cx = int(wrist.x * frame.shape[1])
                cy = int(wrist.y * frame.shape[0])

                # 手部匹配逻辑
                matched_id = None
                min_dist = float("inf")
                for hid, (last_time, last_x, last_y) in hand_states.items():
                    dist = np.sqrt((cx - last_x) ** 2 + (cy - last_y) ** 2)
                    if dist < tracking_threshold and dist < min_dist:
                        min_dist = dist
                        matched_id = hid

                # 分配或更新手部ID
                if matched_id is None:
                    hand_id = hand_id_counter
                    hand_id_counter += 1
                else:
                    hand_id = matched_id

                # ============================
                # 🌈 红蓝分类逻辑（每边最多两双手）
                # ============================
                if hand_id not in hand_assignments:
                    is_fist_detected = is_fist(landmarks)

                    if (blue_hands[label] is None) or (red_hands[label] is None):
                        if is_fist_detected and red_hands[label] is None:
                            # 握拳优先分配红色
                            hand_assignments[hand_id] = "red"
                            red_hands[label] = hand_id
                        elif blue_hands[label] is None:
                            # 张开优先分配蓝色
                            hand_assignments[hand_id] = "blue"
                            blue_hands[label] = hand_id
                        elif red_hands[label] is None:
                            # 如果红色该侧手为空，则补充
                            hand_assignments[hand_id] = "red"
                            red_hands[label] = hand_id
                        else:
                            # 第三只手同侧 → 忽略不分配
                            print(f"忽略第3只{label}手（ID {hand_id}）")
                            continue  # 跳过这只手

                # 记录当前手部位置
                current_hands[hand_id] = (cx, cy)

                # 绘制手部关键点
                # mp_drawing.draw_landmarks(frame, landmarks, mp_hands.HAND_CONNECTIONS)
                if hand_assignments.get(hand_id) == "red":
                    mp_drawing.draw_landmarks(
                        frame,
                        landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing.DrawingSpec(
                            color=(0, 0, 255), thickness=2, circle_radius=3
                        ),  # 红色
                        mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2),
                    )
                    role = hand_assignments[hand_id]
                elif hand_assignments.get(hand_id) == "blue":
                    mp_drawing.draw_landmarks(
                        frame,
                        landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing.DrawingSpec(
                            color=(255, 0, 0), thickness=2, circle_radius=3
                        ),  # 蓝色
                        mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2),
                    )
                    role = hand_assignments[hand_id] 

                # 握拳检测与事件触发
                if is_fist_detected:
                    now = time.time()
                    last_trigger = hand_states.get(hand_id, (0, 0, 0))[0]

                    if now - last_trigger > cooldown:
                        # [LJC 0413] 仅红手或蓝右手触发事件
                        # 发送SocketIO事件
                        if (role == "red"):
                            socketio.emit(f"{label}_fist_detected")
                            print(f"触发{role}手({label})事件 ID: {hand_id}")
                        elif(role == "blue" and label == "Right"):
                            socketio.emit(f"{label}_fist_detected_blue")
                            print(f"触发{role}手({label})事件 ID: {hand_id}")
                        # 更新状态（触发时间 + 当前位置）
                        hand_states[hand_id] = (now, cx, cy)
                else:
                    # 更新位置但保留最后触发时间
                    if hand_id in hand_states:
                        last_time, _, _ = hand_states[hand_id]
                    else:
                        last_time = 0
                    hand_states[hand_id] = (last_time, cx, cy)

                # 绘制手部ID（调试用）
                cv2.putText(
                    frame,
                    f"ID:{hand_id}",
                    (cx, cy - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 255),
                    1,
                )

        # 清理过期手部状态（2秒未更新）
        hand_states, hand_assignments, red_hands, blue_hands = cleanup_expired_hands(
            hand_states, hand_assignments, red_hands, blue_hands, current_hands
        )

        # 生成视频流
        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        yield (
            b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )


def cleanup_expired_hands(
    hand_states, hand_assignments, red_hands, blue_hands, current_hands, timeout=2
):
    """清理过期的手部信息并同步更新分配字典"""
    current_time = time.time()

    # 过滤过期手部状态
    valid_hand_states = {
        hid: (ts, x, y)
        for hid, (ts, x, y) in hand_states.items()
        # if (current_time - ts < timeout) or (hid in current_hands)
        if hid in current_hands
    }
    # valid_hand_states = {}
    # for hid, (ts, x, y) in hand_states.items():
    #     if (current_time - ts < timeout) or (hid in current_hands):
    #         valid_hand_states[hid] = (ts, x, y)

    # 过滤过期手部分配
    valid_hand_assignments = {
        hid: role for hid, role in hand_assignments.items() if hid in valid_hand_states
    }

    # 同步清除 red_hands 和 blue_hands 中已过期的 hand_id
    def clean_color_dict(color_dict):
        for side in list(color_dict.keys()):
            hand_id = color_dict[side]
            if hand_id is not None and hand_id not in valid_hand_assignments:
                color_dict[side] = None

    clean_color_dict(red_hands)
    clean_color_dict(blue_hands)

    return valid_hand_states, valid_hand_assignments, red_hands, blue_hands


@app.route("/video_feed")
def video_feed():
    """视频流路由"""
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
