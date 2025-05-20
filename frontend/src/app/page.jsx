'use client';
import { useEffect, useRef , useState , } from 'react';
import { FaCamera, FaMicrophone, FaStop } from 'react-icons/fa';

const Home = () => {
  const videoRef = useRef();
  const [prediction, setPrediction] = useState('Detectando');
  const [confianza, setConfianza] = useState('Calculando...');
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);


  let recognitionInst = '';

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
      }
    };
    startCamera();
  }, []);

  const recognitionVocice = () => {
      if (prediction != 'Detectando') {
              speakText( prediction == 'No Detectado' ? 'No Detectado':`${prediction} con un ${confianza} % de confianza.`);
      }else{
              speakText( 'No se ha realizado ninguna detección.');
      }

  };

  const voiceHandle = (event) => {
    const results = event.results;
    const lastResult = results[results.length - 1];
    const command = lastResult[0].transcript.toLowerCase().trim();
   
      if (command == 'reconocer billete' || command == 'reconocer moneda') {
        setVoiceRecognitionActive(true);
        imageCapture();
      } else if (command === 'parar') {
        console.log('servicio detenido...');
        setVoiceRecognitionActive(false);
        recognitionInst.stop();
      }
  };

  const imageCapture = async () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (window.innerWidth < window.innerHeight) {
      canvas.width = video.videoHeight;
      canvas.height = video.videoWidth;
      ctx.translate(canvas.width, 0);
      ctx.rotate(Math.PI / 2);
    } else {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgBlob = await new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('No se pudo crear el blob desde el canvas');
          return resolve(null);
        }
        resolve(blob);
      }, 'image/jpeg');
    });

    if (!imgBlob) {
      console.error('La imagen no fue capturada correctamente.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imgBlob, 'captured_image.jpg');

    // Para verificar que se agregó el archivo
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1],formData.get('file'),imgBlob); 
    }

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      setPrediction(result.prediction[0].length == 0? 'No Detectado': result.prediction[0][0]); 
      setConfianza(result.prediction[1].length == 0? 'No Detectado': result.prediction[1][0].toFixed(2)); 
      speakText( result.prediction[0].length == 0? 'No Detectado':`${result.prediction[0][0]} con un ${ result.prediction[1][0].toFixed(2)} % de confianza.`);
    
    } catch (error) {
      console.error('Error al enviar la imagen:', error);
    }

  };

  

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-419'; 
    synth.speak(utterance);
  };
  

  return (
    
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-[700px]  shadow-md border border-gray-300 rounded-lg">
        <h1 className="text-center font-bold text-lg mb-4">
          Detección de denominación de <br /> Billetes y Monedas Bolivianas
        </h1>

        <div className=" rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-150 object-cover"
          />
        </div>

        <div className="text-center text-sm">
          <p className="mb-1">
            <strong>Detección:</strong> {prediction}
          </p>
          <p className="mb-3">
            <strong>Porcentaje de Confianza:</strong> {confianza}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-2">
          <button  onClick={imageCapture} disabled={voiceRecognitionActive}>
            <FaCamera size={30} />
          </button>
          <button  onClick={() => recognitionVocice()}  disabled={voiceRecognitionActive}>
            <FaMicrophone size={30} />
          </button>
        </div>
      </div>
    </div>

  );
};

export default Home;
