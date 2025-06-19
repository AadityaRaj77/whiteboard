import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router'
import * as fabric from 'fabric'

function Whiteboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const canvaref = useRef(null)
    const [count, setCount] = useState(0)
    const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!canvaref.current) return;

    const canvas = new fabric.Canvas(canvaref.current, {
      selection: true,
      width: canvaref.current.offsetWidth,
      height: canvaref.current.offsetHeight,
    });
    fabricCanvasRef.current = canvas;
    console.log('Canvas initialized:', canvas);

    return () => canvas.dispose();
  }, []);

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    console.log('Adding to canvas:', canvas);
    if (canvas) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: '#ff0000',
        top: 100,
        left: 100,
      });
      canvas.add(circle);
      canvas.renderAll();
    }
  };

const enablePencil = (color = '#000000', width = 5) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = width;
};

const disablePencil = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  canvas.isDrawingMode = false;
};

const addTextbox = (
  text = "Type here…",
  {
    left = 100,
    top = 100,
    width = 200,
    fontSize = 20,
    fill = "#000000",
    fontFamily = "Arial",
    editable = true,
  } = {}
) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const textbox = new fabric.Textbox(text, {
    left,
    top,
    width,
    fontSize,
    fill,
    fontFamily,
    editable,
    cursorWidth: 2,
    cursorColor: fill,
    backgroundColor: "rgba(255,255,255,0.5)"
  });

  canvas.add(textbox);
  canvas.setActiveObject(textbox);   
  canvas.requestRenderAll();
};


let isErasing = false;

const eraserMouseDown = (event) => {
  const canvas = fabricCanvasRef.current;
  if (!isErasing || !canvas) return;

  const pointer = canvas.getPointer(event.e);

  const objs = canvas.getObjects();
  for (let i = objs.length - 1; i >= 0; i--) {
    if (objs[i].containsPoint(pointer)) {
      canvas.remove(objs[i]);
      canvas.requestRenderAll();
      break;
    }
  }
};

const enableEraser = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;
  canvas.isDrawingMode = false;
  isErasing = true;
  canvas.defaultCursor = 'crosshair';
  canvas.on('mouse:down', eraserMouseDown);
};

const disableEraser = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;
  isErasing = false;
  canvas.defaultCursor = 'default';
  canvas.off('mouse:down', eraserMouseDown);
};

//history stack 
const history = {
  states: [],
  index: -1,
};

// Call this after any canvas-modifying action:
const saveState = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  history.states = history.states.slice(0, history.index + 1);

  // Push current state
  history.states.push(canvas.toDatalessJSON());
  history.index++;
};

// Restore the canvas to a given history index
const restoreState = (i) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas || i < 0 || i >= history.states.length) return;

  canvas.off('object:modified'); // avoid recursive saveState
  canvas.loadFromJSON(history.states[i], () => {
    canvas.requestRenderAll();
    canvas.on('object:modified', saveState);
  });
  history.index = i;
};

// Initialize: after canvas creation
useEffect(() => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  // Save the initial empty state
  saveState();

  // Save whenever an object is added, modified, or removed
  canvas.on('object:added', saveState);
  canvas.on('object:modified', saveState);
  canvas.on('object:removed', saveState);

  // Key listener for Ctrl+Z and Ctrl+Y
  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (history.index > 0) restoreState(history.index - 1);
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
      e.preventDefault();
      if (history.index < history.states.length - 1) restoreState(history.index + 1);
    }
  };
  window.addEventListener('keydown', handleKey);

  return () => {
    window.removeEventListener('keydown', handleKey);
    if (canvas) {
      canvas.off('object:added', saveState);
      canvas.off('object:modified', saveState);
      canvas.off('object:removed', saveState);
    }
  };
}, []);

//Undo/Redo button
const undo = () => {
  if (history.index > 0) {
    restoreState(history.index - 1);
  }
};
const redo = () => {
  if (history.index < history.states.length - 1) {
    restoreState(history.index + 1);
  }
};
/*
useEffect(() => {
    async function fetchData() {
      const promise = await fetch("http://localhost:3001/whiteboard", { method: "GET", credentials: 'include' });
      const res = await promise.json();
      if (res.success) {
        setUser(res.user)
      } else {
          const navigate = useNavigate('/');
      }
    }
    fetchData()
  }, []);*/
  //const
  return (
    <>
      <div className="relative w-full h-screen bg-amber-100">
        <canvas
        ref={canvaref}
          style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}></canvas>
      </div>
      <div className="absolute flex bg-amber-300 top-150 p-4 ml-120 gap-4 justify-center rounded-full items-center">
        <button className="bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500" onClick={() => enablePencil('#00ff00', 10)} onDoubleClick={disablePencil}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/481/481874.png"
            className="w-8 h-8 filter invert"
          ></img>
        </button>
        <button className="bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500" onClick = {addCircle}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9051/9051443.png"
            className="w-8 h-8 filter invert"
          ></img>
        </button>
        <button className="bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500" onClick={() => addTextbox("New text", { fontSize: 24, fill: "#ff0000" })}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828487.png"
            className="w-8 h-8 filter invert"
          ></img>
        </button>
        <button className="bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500" onClick={enableEraser} onDoubleClick={disableEraser}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/4043/4043845.png"
            className="w-8 h-8 filter invert"
          ></img>
        </button>
        <button className="bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500" onClick={undo}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/3502/3502539.png"
            className="w-8 h-8 filter invert"
          ></img>
        </button>
      </div>
      <div className="absolute bg-amber-300 top-10 ml-4 p-4 gap-4 justify-center rounded-full items-center">
        <div className="text-white">
          <h1>Fill</h1>
        </div>
        <div>
          <h1>Thickness</h1>
        </div>
        <div>
          <h1>Typography</h1>
        </div>
      </div>
    </>
  );
}

export default Whiteboard;


