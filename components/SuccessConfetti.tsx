import React, { useState, useRef, useEffect } from "react";
// import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function SuccessConfetti() {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const confetiRef = useRef(null);

  useEffect(() => {
    if (confetiRef.current) {
      setHeight(confetiRef.current.client);
      setWidth(confetiRef.current.clientWidth);
    }
  }, []);

  return (
    <div className="App">
      <div className="confettie-wrap" ref={confetiRef}>
        <h3>Confettie Effect </h3>
        <Confetti numberOfPieces={150} width={width} height={height} />
      </div>
    </div>
  );
}
