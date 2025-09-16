
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, VolumeX, Volume2, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReactionVideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
}

const ReactionVideoPlayer: React.FC<ReactionVideoPlayerProps> = ({ 
  videoUrl,
  title,
  description
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && value.length > 0) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current && value.length > 0) {
      videoRef.current.volume = value[0] / 100;
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={playerRef}
          className={`relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
        >
          <video 
            ref={videoRef}
            className="w-full aspect-video"
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play button overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="bg-primary/80 rounded-full p-4">
                <Play className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 opacity-100 hover:opacity-100">
            {/* Progress bar */}
            <div className="mb-2">
              <Slider
                value={[progress]} 
                min={0} 
                max={100} 
                step={0.1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipBackward}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipForward}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <div className="text-xs text-white">
                  {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'} / 
                  {videoRef.current ? formatTime(videoRef.current.duration || 0) : '0:00'}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume]} 
                      min={0} 
                      max={100}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactionVideoPlayer;
