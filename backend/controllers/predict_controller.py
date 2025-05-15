from fastapi import UploadFile
from model.detector import detect_bill
import tempfile
import shutil

async def predict_bill(file: UploadFile):
    # verificamos la entrada o llegada de la imagen
    print(f"Recibido archivo: {file.file}")
    print(f"Recibido archivo: {file.filename}")
    
    # Guardar la imagen en un archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    print(f"Recibido archivo: {temp_path}",temp.name)
    
    # Ejecutar la detección

    prediction = detect_bill(temp_path)
    #retornar la detección
    return prediction
