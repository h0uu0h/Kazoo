from flask import Flask, Response
import cv2
import mediapipe as mp
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import threading
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh

hands = mp_hands.Hands(static_image_mode=False, max_num_hands=4, min_detection_confidence=0.5)
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=2)

latest_data = {"hands": [], "faces": [], "frame": None}
lock = threading.Lock()

# **创建全局摄像头对象**
cap = cv2.VideoCapture(0)

def video_processing():
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_height, frame_width, _ = frame.shape

        # 手部检测
        hand_results = hands.process(rgb_frame)
        hands_data = []
        if hand_results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(hand_results.multi_hand_landmarks, hand_results.multi_handedness):
                points = [{"x": landmark.x, "y": landmark.y} for landmark in hand_landmarks.landmark]
                hands_data.append({"label": handedness.classification[0].label, "points": points})

        # 面部检测
        face_results = face_mesh.process(rgb_frame)
        faces_data = []
        if face_results.multi_face_landmarks:
            for face_landmarks in face_results.multi_face_landmarks:
                points = [{"x": landmark.x, "y": landmark.y} for landmark in face_landmarks.landmark]
                faces_data.append(points)

        # **共享数据**
        with lock:
            latest_data["hands"] = hands_data
            latest_data["faces"] = faces_data
            latest_data["frame"] = frame.copy()
        
        time.sleep(0.001)  # 降低CPU使用率

@socketio.on("connect")
def handle_connect():
    thread = threading.Thread(target=video_processing)
    thread.daemon = True
    thread.start()

    def send_data():
        while True:
            with lock:
                # print("Sending Data:", latest_data)
                socketio.emit("landmarks", {"hands": latest_data["hands"], "faces": latest_data["faces"]})
            time.sleep(0.033)  # ~30fps
            
    data_thread = threading.Thread(target=send_data)
    data_thread.daemon = True
    data_thread.start()

@app.route('/video_feed')
def video_feed():
    def generate():
        while True:
            with lock:
                if latest_data["frame"] is None:
                    continue
                frame = latest_data["frame"]
            _, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, debug=True)
