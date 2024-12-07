// import React, { useState, useRef } from 'react';

// const VoiceRecorder = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioRef = useRef(null);

//   const startRecording = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         mediaRecorderRef.current = new MediaRecorder(stream,{mimeType:'audio/wav'});
//         mediaRecorderRef.current.ondataavailable = (event) => {
//             console.log(event.data)
//           const url = URL.createObjectURL(event.data);
//           console.log(url)
//           setAudioUrl(url);
//         };
//         mediaRecorderRef.current.start();
//         setIsRecording(true);
//       })
//       .catch(err => console.error('Error accessing audio media:', err));
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//   };

//   return (
//     <div>
//       <button onClick={isRecording ? stopRecording : startRecording}>
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//       {audioUrl && (
//         <div>
//           <audio ref={audioRef} controls src={audioUrl} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VoiceRecorder;

import React, { useRef, useState } from 'react';
const VoiceRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      );
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(
          chunks.current, { type: 'audio/webm' }
        );
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  return (
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
export default VoiceRecorder;