'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, Pause, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (base64Audio: string | null) => void;
}

export default function AudioRecorder({ onAudioRecorded }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);

        // Base64 ga aylantirish
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          onAudioRecorded(base64Data);
        };

        // Stream treklarni to'xtatish
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      setErrorMessage("Mikrofonga ruxsat berilmadi yoki qurilmada mikrofon yo'q.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingDuration(0);
    onAudioRecorded(null);
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] border border-slate-700/80 rounded-2xl flex items-center justify-center gap-3 transition-all text-slate-200 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-100">Ovozli xabar qoldirish</p>
            <p className="text-xs text-slate-400">Yozishga vaqt bo'lmasa, bosing va gapiring (1 daqiqagacha)</p>
          </div>
        </button>
      )}

      {isRecording && (
        <div className="w-full p-4 bg-rose-950/30 border border-rose-500/40 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <p className="text-sm font-semibold text-rose-300">Ovoz yozilmoqda...</p>
              <p className="text-xs text-rose-400/80 font-mono">{formatTime(recordingDuration)} / 1:00</p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>To'xtatish</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="w-full p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md hover:bg-emerald-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-semibold text-emerald-300">Ovoz yozildi</p>
              <p className="text-[11px] text-slate-400">Davomiyligi: {formatTime(recordingDuration)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={deleteRecording}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="O'chirish va qayta yozish"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
