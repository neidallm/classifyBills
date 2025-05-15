from ultralytics import YOLO

# Carga tu modelo (ajusta el path si es necesario)
model = YOLO("model/best9s_20.pt")

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
    # Filtrar etiquetas y confidencias por encima de un umbral (opcional)

    return labels, confidences


