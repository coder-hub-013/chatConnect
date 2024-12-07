import React, { useState, useRef } from 'react';

const SomethingNew = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="App">
      <h1>Voice Recorder</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioURL && (
        <div>
          <h2>Playback</h2>
          <audio ref={audioRef} controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
};

export default SomethingNew;