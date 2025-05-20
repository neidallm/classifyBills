from ultralytics import YOLO

model = YOLO("model/bestv8_10.pt")

def detect_bill(image_path):
    print(f"Recibido archivo NEida: {image_path}")
    results = model(image_path)
    detections = results[0].boxes.cls.cpu().numpy()
    confidences = results[0].boxes.conf.cpu().numpy()   
    names = model.names
    labels = [names[int(cls)] for cls in detections]
    confidences = [float(conf) for conf in confidences]
    boxes = results[0].boxes.xyxy.cpu().numpy()  
    boxes = boxes.astype(int).tolist()  

    return labels, confidences


