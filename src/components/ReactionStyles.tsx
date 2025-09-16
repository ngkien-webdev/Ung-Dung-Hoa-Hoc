
import React from 'react';

const ReactionStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      .reaction-container {
        position: relative;
        padding: 1.5rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.05));
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .fullscreen-reaction {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
        border-radius: 0;
        padding: 2rem;
        background: hsl(var(--background));
      }
      
      .molecule-3d-container {
        position: relative;
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 1rem 0;
        transition: all 0.3s ease;
        transform-style: preserve-3d;
      }
      
      .molecule {
        position: relative;
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.8s ease-in-out;
      }
      
      .molecule.slow {
        transition-duration: 1.5s;
      }
      
      .molecule.medium {
        transition-duration: 1s;
      }
      
      .molecule.fast {
        transition-duration: 0.5s;
      }
      
      .reaction-3d {
        transform-style: preserve-3d;
      }
      
      .molecule-label {
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.875rem;
        color: var(--text-muted, #666);
        opacity: 0.8;
        text-align: center;
        background-color: rgba(var(--primary-rgb), 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }
      
      .atom {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 -2px 5px rgba(0, 0, 0, 0.2), inset 0 2px 2px rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
        transform-style: preserve-3d;
        z-index: 5;
      }
      
      .atom:hover {
        transform: scale(1.15);
        z-index: 10;
      }
      
      .atom:hover + .atom-tooltip {
        opacity: 1;
        transform: translate(-50%, -120%);
      }
      
      .atom-tooltip {
        position: absolute;
        left: 50%;
        top: 0;
        padding: 0.25rem 0.5rem;
        background-color: hsl(var(--foreground));
        color: hsl(var(--background));
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        pointer-events: none;
        transform: translate(-50%, -100%);
        opacity: 0;
        transition: all 0.2s ease;
        z-index: 20;
      }
      
      .bond {
        position: absolute;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 1px;
        transform-origin: left center;
        transition: all 0.3s ease;
      }
      
      .bond-hot {
        box-shadow: 0 0 5px 2px rgba(255, 100, 50, 0.3);
        animation: bondPulse 1s infinite alternate;
      }
      
      .reaction-arrow {
        font-size: 2rem;
        color: hsl(var(--foreground));
        transition: all 0.3s ease;
      }
      
      .temperature-high .atom {
        animation: atomPulsate 0.8s infinite alternate;
      }
      
      .temperature-medium .atom {
        animation: atomPulsate 2s infinite alternate;
      }
      
      .temperature-high .reaction-arrow {
        color: rgba(255, 100, 50, 0.8);
        text-shadow: 0 0 5px rgba(255, 100, 50, 0.5);
      }
      
      .temperature-slider-hot .slider-thumb {
        background-color: rgba(255, 100, 50, 0.8) !important;
        box-shadow: 0 0 10px rgba(255, 100, 50, 0.5) !important;
      }
      
      .temperature-slider-hot .slider-track {
        background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(255, 100, 50, 0.5)) !important;
      }
      
      @keyframes atomPulsate {
        0% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        100% {
          transform: scale(1.1);
          box-shadow: 0 0 15px 5px rgba(var(--primary-rgb), 0.4);
        }
      }
      
      @keyframes bondPulse {
        0% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }
      
      .atom-pulse-slow {
        animation: atomPulse 3s infinite alternate;
      }
      
      .atom-pulse-medium {
        animation: atomPulse 1.5s infinite alternate;
      }
      
      .atom-pulse-fast {
        animation: atomPulse 0.8s infinite alternate;
      }
      
      @keyframes atomPulse {
        0% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        100% {
          transform: scale(1.15);
          box-shadow: 0 0 12px 6px rgba(var(--primary-rgb), 0.5);
        }
      }
      
      .speed-slow .molecule-3d-container {
        transition-duration: 1.5s;
      }
      
      .speed-medium .molecule-3d-container {
        transition-duration: 1s;
      }
      
      .speed-fast .molecule-3d-container {
        transition-duration: 0.5s;
      }
      
      /* Enhanced 3D Effects */
      .reaction-3d {
        transform-style: preserve-3d;
        transition: transform 0.8s ease;
      }
      
      .reaction-3d:hover {
        z-index: 10;
      }
      
      .molecule:hover .atom {
        animation: atomHighlight 1.5s infinite alternate;
      }
      
      @keyframes atomHighlight {
        0% {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        100% {
          box-shadow: 0 0 15px 5px rgba(var(--primary-rgb), 0.5);
        }
      }
      
      .product-atom {
        transition: all 0.5s ease;
      }
      
      .temperature-high .product-atom {
        box-shadow: 0 0 15px 8px rgba(var(--primary-rgb), 0.2);
      }
      
      /* Nâng cấp hiệu ứng 3D */
      .enhanced-3d {
        perspective: 1200px;
      }
      
      .enhanced-3d .molecule {
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
      
      .enhanced-3d .atom {
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
      
      .enhanced-3d .bond {
        transform-style: preserve-3d;
      }
      
      /* Các hiệu ứng đẹp mới cho các nguyên tử */
      .atom.glow-effect {
        box-shadow: 0 0 15px 8px rgba(var(--primary-rgb), 0.4);
        transition: all 0.5s ease;
      }
      
      .atom.shadow-effect {
        filter: drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.6));
      }
      
      /* Hiệu ứng đổ bóng cho bộ Slide */
      .slider-controls {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 0.5rem;
        backdrop-filter: blur(5px);
        background: rgba(255, 255, 255, 0.05);
      }
      
      /* Hiệu ứng chuyển đổi giữa các trạng thái phản ứng */
      .reaction-transition {
        animation: reactionTransition 2s ease-in-out;
      }
      
      @keyframes reactionTransition {
        0% {
          opacity: 0.5;
          transform: scale(0.9);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Hiệu ứng cho chế độ VR/AR */
      .vr-mode {
        perspective: 2000px;
      }
      
      .vr-mode .molecule-3d-container {
        transform: scale(1.2);
      }
      
      .vr-mode .molecule {
        transform: rotateX(20deg) rotateY(30deg);
      }
      
      /* Hiệu ứng đặc biệt cho chế độ hợp tác */
      .collaboration-highlight {
        animation: collaborationPulse 1.5s infinite alternate;
      }
      
      @keyframes collaborationPulse {
        0% {
          box-shadow: 0 0 5px 2px rgba(var(--primary-rgb), 0.3);
        }
        100% {
          box-shadow: 0 0 15px 5px rgba(var(--primary-rgb), 0.6);
        }
      }
      
      /* Hiệu ứng nổi bật cho chế độ biểu diễn */
      .presentation-mode .atom {
        animation: presentationPulse 2s infinite alternate;
      }
      
      @keyframes presentationPulse {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.2);
        }
      }
      
      /* Hiệu ứng khi phản ứng đang hoạt động */
      .reaction-active .bond {
        animation: bondActive 1s infinite alternate;
      }
      
      @keyframes bondActive {
        0% {
          height: 2px;
          opacity: 0.7;
        }
        100% {
          height: 3px;
          opacity: 1;
        }
      }
      `
    }} />
  );
};

export default ReactionStyles;
