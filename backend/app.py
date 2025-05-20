from fastapi import FastAPI, File, UploadFile
from controllers.predict_controller import predict_bill
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI()

# Configura CORS
origins = [
    "http://localhost:3000",  # Frontend en el puerto 3000
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir los orígenes definidos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir cualquier método (GET, POST, etc.)
    allow_headers=["*"],  # Permitir cualquier encabezado
)

@app.get("/")
def read_root():
    return {"message": "¡API funcionando correctamente!"}

#devuelve la predccion
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    print(f"Recibido archivo: {file.read()}")
    result = await predict_bill(file)
    return {"prediction": result}
    
