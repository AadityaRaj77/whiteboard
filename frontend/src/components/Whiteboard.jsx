import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { io } from "socket.io-client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { BACKEND_URL } from "../api";

const socket = io(BACKEND_URL);

function Whiteboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  let sessionId = searchParams.get("session");

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      setSearchParams({ session: newSessionId });
      sessionId = newSessionId;
    }
  }, []);

  const [tool, setTool] = useState("pencil");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const isDragging = useRef(false);
  const [color, setColor] = useState("#FFF000");
  const [stroke, setStroke] = useState(5);
  const stageRef = useRef();

  const emitWithSession = (event, data) => {
    socket.emit(event, { sessionId, data });
  };

  const saveToHistory = () => {
    setHistory((prev) => [
      ...prev,
      { lines: [...lines], rectangles: [...rectangles], circles: [...circles] },
    ]);
    setRedoStack([]);
  };

  const handleMouseDown = (e) => {
    if (tool === "rect" || tool === "circle") return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((l) => [
      ...l,
      { tool, points: [pos.x, pos.y], stroke: color, strokeWidth: stroke },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || isDragging.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((l) => {
      const updated = l.slice();
      const last = { ...updated[updated.length - 1] };
      last.points = [...last.points, point.x, point.y];
      updated[updated.length - 1] = last;
      emitWithSession("updateLines", updated);
      return updated;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    saveToHistory();
  };

  const addRect = () => {
    const newRects = [
      ...rectangles,
      {
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: 50,
        height: 50,
        fill: color,
      },
    ];
    setRectangles(newRects);
    emitWithSession("updateRectangles", newRects);
    saveToHistory();
  };

  const addCircle = () => {
    const newCircles = [
      ...circles,
      {
        x: Math.random() * 300,
        y: Math.random() * 200,
        radius: 25,
        fill: color,
      },
    ];
    setCircles(newCircles);
    emitWithSession("updateCircles", newCircles);
    saveToHistory();
  };

  useEffect(() => {
    if (!sessionId) return;
    socket.emit("joinSession", sessionId);

    socket.on("updateLines", (payload) => {
      if (payload.sessionId === sessionId) setLines(payload.data);
    });
    socket.on("updateRectangles", (payload) => {
      if (payload.sessionId === sessionId) setRectangles(payload.data);
    });
    socket.on("updateCircles", (payload) => {
      if (payload.sessionId === sessionId) setCircles(payload.data);
    });

    const onResize = () => {
      const stage = document.querySelector(".konvajs-content");
      if (stage) {
        stage.style.width = `${window.innerWidth}px`;
        stage.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      socket.off("updateLines");
      socket.off("updateRectangles");
      socket.off("updateCircles");
      window.removeEventListener("resize", onResize);
    };
  }, [sessionId]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastIdx = history.length - 1;
    const baseRects = JSON.stringify(history[lastIdx].rectangles);
    const baseCircs = JSON.stringify(history[lastIdx].circles);
    let cutIdx = lastIdx;
    while (cutIdx > 0) {
      const prev = history[cutIdx - 1];
      if (
        JSON.stringify(prev.rectangles) === baseRects &&
        JSON.stringify(prev.circles) === baseCircs
      )
        cutIdx--;
      else break;
    }
    const target =
      cutIdx > 0
        ? history[cutIdx - 1]
        : { lines: [], rectangles: [], circles: [] };
    setRedoStack((r) => [
      ...r,
      { lines: [...lines], rectangles: [...rectangles], circles: [...circles] },
    ]);
    setLines(target.lines);
    setRectangles(target.rectangles);
    setCircles(target.circles);
    setHistory((h) => (cutIdx > 0 ? h.slice(0, cutIdx) : []));
    socket.emit("updateLines", target.lines);
    socket.emit("updateRectangles", target.rectangles);
    socket.emit("updateCircles", target.circles);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const topIdx = redoStack.length - 1;
    const baseRects = JSON.stringify(redoStack[topIdx].rectangles);
    const baseCircs = JSON.stringify(redoStack[topIdx].circles);
    let startIdx = topIdx;
    while (startIdx > 0) {
      const prev = redoStack[startIdx - 1];
      if (
        JSON.stringify(prev.rectangles) === baseRects &&
        JSON.stringify(prev.circles) === baseCircs
      )
        startIdx--;
      else break;
    }
    const target = redoStack[topIdx];
    setHistory((h) => [
      ...h,
      { lines: [...lines], rectangles: [...rectangles], circles: [...circles] },
    ]);
    setLines(target.lines);
    setRectangles(target.rectangles);
    setCircles(target.circles);
    setRedoStack((r) => (startIdx > 0 ? r.slice(0, startIdx) : []));
    socket.emit("updateLines", target.lines);
    socket.emit("updateRectangles", target.rectangles);
    socket.emit("updateCircles", target.circles);
  };

  const saveDocument = () => {
    const data = { lines, rectangles, circles };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadDocument = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.lines && data.rectangles && data.circles) {
          setLines(data.lines);
          setRectangles(data.rectangles);
          setCircles(data.circles);
          socket.emit("updateLines", data.lines);
          socket.emit("updateRectangles", data.rectangles);
          socket.emit("updateCircles", data.circles);
          saveToHistory();
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  const exportAsImage = () => {
    const stage = stageRef.current;
    const pixelRatio = 2;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    const context = canvas.getContext("2d");
    context.scale(pixelRatio, pixelRatio);
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const dataURL = stage.toDataURL({ pixelRatio });
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      const finalDataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = finalDataURL;
      link.click();
    };
    image.src = dataURL;
  };

  const clearCanvas = () => {
    setLines([]);
    setRectangles([]);
    setCircles([]);
    setHistory([]);
    setRedoStack([]);
    socket.emit("updateLines", []);
    socket.emit("updateRectangles", []);
    socket.emit("updateCircles", []);
  };

  useEffect(() => {
    socket.on("updateRectangles", setRectangles);
    socket.on("updateCircles", setCircles);
    socket.on("updateLines", setLines);
    const onResize = () => {
      const stage = document.querySelector(".konvajs-content");
      stage.style.width = `${window.innerWidth}px`;
      stage.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener("resize", onResize);
    return () => {
      socket.off("updateRectangles");
      socket.off("updateCircles");
      socket.off("updateLines");
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="bg-amber-50 fixed top-0 left-0 z-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* All layers untouched */}
        <Layer>
          {lines.map((l, i) => (
            <Line
              key={i}
              points={l.points}
              stroke={l.stroke}
              strokeWidth={l.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                l.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
        <Layer>
          {rectangles.map((r, i) => (
            <Rect
              key={i}
              {...r}
              draggable
              onDragStart={() => {
                isDrawing.current = false;
                isDragging.current = true;
              }}
              onDragMove={() => socket.emit("updateRectangles", rectangles)}
              onDragEnd={(e) => {
                const newR = rectangles.slice();
                newR[i] = { ...newR[i], x: e.target.x(), y: e.target.y() };
                setRectangles(newR);
                emitWithSession("updateRectangles", newR);
                isDragging.current = false;
                saveToHistory();
              }}
              onDblClick={() => {
                const newR = rectangles.slice();
                newR.splice(i, 1);
                setRectangles(newR);
                emitWithSession("updateRectangles", newR);
                saveToHistory();
              }}
            />
          ))}
        </Layer>
        <Layer>
          {circles.map((c, i) => (
            <Circle
              key={i}
              {...c}
              draggable
              onDragStart={() => {
                isDrawing.current = false;
                isDragging.current = true;
              }}
              onDragMove={() => socket.emit("updateCircles", circles)}
              onDragEnd={(e) => {
                const newC = circles.slice();
                newC[i] = { ...newC[i], x: e.target.x(), y: e.target.y() };
                setCircles(newC);
                socket.emit("updateCircles", newC);
                isDragging.current = false;
                saveToHistory();
              }}
              onDblClick={() => {
                const newC = circles.slice();
                newC.splice(i, 1);
                setCircles(newC);
                emitWithSession("updateCircles", newC);
                saveToHistory();
              }}
            />
          ))}
        </Layer>
      </Stage>

      <div className="flex flex-wrap justify-center items-center absolute top-152 left-1/2 transform -translate-x-1/2 bg-amber-200 p-4 rounded-full gap-2 z-10 max-w-full">
        <div className="relative group">
          <button
            onClick={() => setTool("pencil")}
            className="tool-btn cursor-pointer size-16 p-3.5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/481/481874.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Pencil
          </span>
        </div>
        <div className="relative group">
          <button
            onClick={() => {
              setTool("rect");
              addRect();
            }}
            className="tool-btn cursor-pointer size-16 p-3.5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/3303/3303076.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Rectangle
          </span>
        </div>
        <div className="relative group">
          <button
            onClick={() => {
              setTool("circle");
              addCircle();
            }}
            className="tool-btn cursor-pointer size-16 p-3.5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/686/686700.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Circle
          </span>
        </div>
        <div className="relative group">
          <button
            onClick={() => setTool("eraser")}
            className="tool-btn cursor-pointer size-16 p-3.5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/4043/4043845.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Eraser
          </span>
        </div>
        <div className="relative group">
          <label className="cursor-pointer flex items-center gap-1 tool-btn size-16 p-3.5">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2206/2206009.png"
              className="invert"
            />
            <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              value={color}
              className="opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer"
            />
          </label>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Color Picker
          </span>
        </div>
        <div className="relative group">
          <input
            type="number"
            onChange={(e) => setStroke(+e.target.value)}
            value={stroke}
            className="tool-btn w-12 size-16"
          />
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Stroke Width
          </span>
        </div>
        <div className="relative group">
          <button
            className="tool-btn cursor-pointer size-16 p-3.5"
            onClick={handleUndo}
            disabled={!history.length}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/9693/9693669.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Undo
          </span>
        </div>

        {/* Redo */}
        <div className="relative group">
          <button
            onClick={handleRedo}
            disabled={!redoStack.length}
            className="tool-btn cursor-pointer size-16 p-3.5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/2990/2990009.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
            Redo
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-items-center absolute top-5 left-1/2 transform -translate-x-1/2 bg-amber-200 p-4 rounded-full space-x-2 z-10 max-w-full">
        <div className="relative group">
          <button
            onClick={saveDocument}
            className="tool-btn cursor-pointer size-12 p-3"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/15478/15478804.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-1 py-1 rounded">
            Export as JSON
          </span>
        </div>

        <div className="relative group">
          <label className="tool-btn cursor-pointer rounded-full w-12 h-12 flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/4013/4013427.png"
              className="invert"
            ></img>
            <input
              type="file"
              accept=".json"
              onChange={loadDocument}
              className="hidden"
            />
          </label>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-1 py-1 rounded">
            Import JSON
          </span>
        </div>

        <div className="relative group">
          <button
            onClick={exportAsImage}
            className="tool-btn cursor-pointer size-12 p-3"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/739/739249.png"
              className="invert"
            />
          </button>
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-1 py-1 rounded">
            Export as Image
          </span>
        </div>
      </div>
      <button
        onClick={clearCanvas}
        className="absolute top-36 sm:top-28 left-1/2 transform -translate-x-1/2 tool-btn cursor-pointer"
      >
        Clear Canvas
      </button>
    </div>
  );
}

export default Whiteboard;
