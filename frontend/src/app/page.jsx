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
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (recognition) {
      setVoiceRecognitionActive(true);
      recognitionInst = new recognition();
      recognitionInst.continuous = true;
      recognitionInst.lang = "es-ES";
      recognitionInst.stop();
      if (typeof recognitionInst.start === 'function') {
        recognitionInst.onresult = voiceHandle;

        recognitionInst.onend = () => {
          if (voiceRecognitionActive) {
            recognitionInst.start();
          }
        };
        recognitionInst.start();
      } else {
        alert('La función start no está disponible en este navegador.');
      }
    } else {
      alert('La funcionalidad de reconocimiento de voz no es compatible con este navegador.');
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

  // const speakText = (text) => {
  //   const synth = window.speechSynthesis;
  //   synth.cancel();
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   synth.speak(utterance);
  // };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-419'; // Español Latinoamericano
    synth.speak(utterance);
  };
  

  return (
    <div style={{ textAlign: 'center' }}>
        <h1 className='black'>Detector de Denominación de Billetes y Monedas Bolivianas</h1>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='pred-video'
        />
        </div>
    
    </div>
      <p>
      {prediction && <label className='pred-text'>Predicción: {prediction}</label>}
      </p>
      <p>
      {confianza && <label className='pred-text'>Nivel de Confianza: {confianza}</label>}
      </p>
      <button className="icon-button" onClick={imageCapture} disabled={voiceRecognitionActive}>
        <FaCamera className="icon" size={35} />
      </button>
      <button className="icon-button" onClick={() => recognitionVocice()} disabled={voiceRecognitionActive}>
        <FaMicrophone className="icon" size={35} />
      </button>
      <button className="icon-button" onClick={() => setVoiceRecognitionActive(false)} disabled={!voiceRecognitionActive}>
        <FaStop className="icon" size={35} />
      </button>
    </div>
  );
};

export default Home;
