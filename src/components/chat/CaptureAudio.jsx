import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { Button } from "@mui/material";
import WaveSurfer from "wavesurfer.js";

const CaptureAudio = ({ setShowVoiceComponent }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuhration, setRecordingDuration] = useState(0);
  const [currPlaybackTime, setCurrPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(0);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) {
      handleStartRecording();
    }
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrPlaybackTime(0);
    setTotalDuration(0);
    setIsPlaying(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveform.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        console.error("Error accesing microphone", err);
      });
  };

  const hanldeStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        audioChunks.push(e.data);
      });

      mediaRecorderRef.current.addEventListener("stop", (e) => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRecordedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = () => {};

  const formatTime = (time) => {
    if (!isNaN(time)) return "00 : 00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")} : ${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // const startRec = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //   const mediaRecorder = new MediaRecorder(stream);
  //   mediaRecorder.ondataavailable = (e) => {};
  // };

  // const stopRec = async () => {};

  return (
    <div style={{ display: "flex", color: "white" }}>
      <DeleteIcon
        style={{ cursor: "pointer" }}
        onClick={() => setShowVoiceComponent(false)}
      />

      <div>
        {isRecording ? (
          <div>
            Recording <span>{recordingDuhration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && !isPlaying ? (
              <PlayCircleFilledWhiteIcon onClick={handlePlayRecording} />
            ) : (
              <PauseCircleIcon onClick={handlePauseRecording} />
            )}
          </div>
        )}

        <div ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />

        <div>
          {!isRecording ? (
            <KeyboardVoiceIcon onClick={handleStartRecording} />
          ) : (
            <PauseCircleIcon onClick={hanldeStopRecording} />
          )}
        </div>

        <Button onClick={sendRecording}>Send</Button>
      </div>
    </div>
  );
};

export default CaptureAudio;
