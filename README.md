# Proyecto Detección de Denominación de Billetes y Monedas Bolivianas

Este repositorio contiene código fuente para backend implementado con Python, carpeta con notebooks del entrenamiento de los modelos YOLO, estos no son relevantes para el levantameinto de la aplicación con la API son una muestra de los entrenamientos y por ultimo contiene el frontend desarrollada con Next.js

## Backend

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Uvicorn (servidor ASGI)
- Las librerías listadas en `requirements.txt`
  
### Pasos para iniciar el backend
1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/neidallm/classifyBills.git
2. Accede a la carpeta del backend:
   ```bash
   cd classifyBills/backend

4. Crea un entorno virtual (opcional pero recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate

5. Instala las dependencias:
   ```bash
   pip install -r requirements.txt

6. Iniciar el servidor
   ```bash
   uvicorn app:app --reload
7. El backend estará disponible en:

   ```bash
   http://localhost:8000


## Frontend

### Requisitos Previos

Navegador moderno con soporte para:

- Acceso a la cámara (navigator.mediaDevices.getUserMedia)

- Acceso al micrófono

- Síntesis de voz (speechSynthesis)

- Fetch API para enviar imágenes al backend

### Pasos para iniciar el Frontend

1. Accede a la carpeta del backend:
   ```bash
   cd classifyBills/frontendkend
2. Instalar las dependencias (usa npm o yarn):
    ```bash
   npm install
   # o
   yarn install

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev

4. Abrir en el navegador:
   Visita http://localhost:3000

¡Listo! Ahora deberías tener el backend, el modelo y el frontend funcionando. No dudes en explorar y modificar el código según tus necesidades. 
