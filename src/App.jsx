import { useEffect, useRef, useState } from "react";
import Menu from './component/Menu';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(1);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(1);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  
  const [isRectangMode, setIsRectangMode] = useState(false);
  const [isRectang, setIsRectang] = useState(false);
  
  const [isPasteMode, setIsPasteMode] = useState(false);
  // const [isPaste, setIsPaste] = useState(false);
  
  const [startX, setStartX] = useState();
  const [startY, setStartY] = useState();
  const [endX, setEndX] = useState();
  const [endY, setEndY] = useState();
  
  // const [isCopyMode, setIsCopyMode] = useState(true);
  const[imageData, setImageData] = useState()
  const[saved, setSaved] = useState()
  const[savedTemp, setSavedTemp] = useState()



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctxRef.current = ctx;
  }, [lineColor, lineWidth, lineOpacity]);


  const onMouseDowning = () => {
    if(isDrawingMode) {
      return startDrawing;
    }
    if(isRectangMode) {
      return startRectang;
    }
    if(isPasteMode) {
      return endPaste;
    }
  }
  const onMouseUpping = () => {
    if(isDrawingMode) {
      return endDrawing;
    }
    if(isRectangMode) {
      return endRectang;
    }
  }
  const onMouseMoving = () => {
    if(isDrawingMode) {
      return draw;
    }
    if(isRectangMode) {
      return drawRectang;
    }
    if(isPasteMode) {
      return drawPaste;
    }
  }

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };
  
  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };
  
  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
    ctxRef.current.stroke();
  };

  const startRectang = (e) => {
    setIsRectang(true)
    setStartX(e.nativeEvent.offsetX)
    setStartY(e.nativeEvent.offsetY)
    setSavedTemp(ctxRef.current.getImageData(0, 0, 600, 400))
    setSaved(canvasRef.current.toDataURL())
  };

  const endRectang = (e) => {
    ctxRef.current.putImageData(savedTemp, 0, 0)
    setEndX(e.nativeEvent.offsetX)
    setEndY(e.nativeEvent.offsetY)
    setIsRectang(false)
  };

  const drawRectang = (e) => {
    if (!isRectang) {
      return;
    }
    const img = new Image()
    img.src = saved
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, 600, 400)
      ctxRef.current.drawImage(img, 0, 0, 600, 400)
      ctxRef.current.beginPath()
      if (!isDrawing) {
        ctxRef.current.strokeStyle = 'black';
        ctxRef.current.setLineDash([10, 20])
      }
      ctxRef.current.lineWidth = 1;
      ctxRef.current.rect(startX, startY, e.nativeEvent.offsetX - startX, e.nativeEvent.offsetY - startY);
      ctxRef.current.stroke();
      ctxRef.current.setLineDash([])
      ctxRef.current.strokeStyle = lineColor;
    }
  }

  const drawPaste = (e) => {
    const img = new Image()
    img.src = saved
    console.log('img in paste data', img)
    ctxRef.current.clearRect(0, 0, 600, 400)
    ctxRef.current.drawImage(img, 0, 0, 600, 400)
    ctxRef.current.putImageData(imageData, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  const endPaste = (e) => {
    setIsPasteMode(false)
    setIsDrawingMode(true)
  };

  useEffect(() => {
    if (isRectangMode && startX !== endX) {
      setImageData(ctxRef.current.getImageData(startX + 1, startY + 1, endX - startX - 2, endY - startY - 2))
      console.log('img data', imageData)
      // ctxRef.current.clearRect(startX, startY, endX - startX, endY - startY) // cut image from rectang
      // ctx.fillStyle = 'white';
      // ctx.fill()
    }
  },[endX])

  const downloadImage = (e) => {
    const link = e.currentTarget
    link.setAttribute('download', "picture.png")
    const picture = canvasRef.current.toDataURL('image/png')
    link.setAttribute('href', picture)
  }

  return (
    <div className="App">
      <h1>Paint Canvas App</h1>
        <Menu
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          isDrawingMode={isDrawingMode}
          setIsDrawingMode={setIsDrawingMode}
          setLineOpacity={setLineOpacity}
          isRectangMode={isRectangMode}
          setIsRectangMode={setIsRectangMode}
          downloadImage={downloadImage}
          // pasteCutImage={pasteCutImage}
          isPasteMode={isPasteMode}
          setIsPasteMode={setIsPasteMode}
        />
      <div className="draw-area">
        <div className="canvas__area">
          <canvas 
            onMouseDown={onMouseDowning()}
            onMouseUp={onMouseUpping()}
            onMouseMove={onMouseMoving()}
            ref={canvasRef}
            width={`600px`}
            height={`400px`}
          />
        </div>
      </div>
    </div>
  );
}

export default App;