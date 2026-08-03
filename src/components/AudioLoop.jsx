import { useRef, useEffect } from "react";

export default function AudioLoop() {
  const audioLoop = useRef(null);

  useEffect(() => {
    const startAudio = () => {
      if (audioLoop.current) {
        audioLoop.current.play().catch(() => {});

        // remove listener after audio starts
        window.removeEventListener("click", startAudio);
        window.removeEventListener("touchstart", startAudio);
      }
    };

    // listen for FIRST interaction
    window.addEventListener("click", startAudio);
    window.addEventListener("touchstart", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, []);

  return (
    <p>Audio</p>
    // <div>
        // <audio ref={audioLoop} src='assets/audio/relax.mp3' loop />
    // </div>
  );
}

