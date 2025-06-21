import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { Stage, Layer, Rect, Line } from "react-konva";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Whiteboard() {
  const [tool, setTool] = useState("pencil");
  const [isDrawing, setIsDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [lines, setLines] = useState([]);

  const normalizeRect = (rect) => {
    const { x, y, width, height, ...rest } = rect;
    const normX = width < 0 ? x + width : x;
    const normY = height < 0 ? y + height : y;
    const normW = Math.abs(width);
    const normH = Math.abs(height);
    return { x: normX, y: normY, width: normW, height: normH, ...rest };
  };

  useEffect(() => {
    socket.on("draw-rect", (rect) => {
      setRectangles((prev) => [...prev, rect]);
    });
    socket.on("draw-line", (line) => {
      setLines((prev) => [...prev, line]);
    });

    socket.on("update-rect", (rects) => {
      setRectangles(rects);
    });
    return () => {
      socket.off("draw-rect");
      socket.off("draw-line");
      socket.off("update-rect");
    };
  }, []);

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    if (e.target !== stage) return;

    const { x, y } = stage.getPointerPosition();

    if (tool === "rect") {
      const tempRect = {
        x,
        y,
        width: 0,
        height: 0,
        id: Date.now().toString(),
        fill: "red",
        stroke: "green",
      };
      setNewRect(tempRect);
      setIsDrawing(true);
    } else if (tool === "pencil" || "eraser") {
      const newLine = { id: Date.now().toString(), tool, points: [x, y] };
      setLines((prev) => [...prev, newLine]);
      socket.emit("draw-line", newLine);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();

    if (tool === "rect" && newRect) {
      setNewRect({ ...newRect, width: x - newRect.x, height: y - newRect.y });
    } else if (tool === "pencil" || "eraser") {
      setLines((prev) => {
        const last = prev[prev.length - 1];
        const updatedLine = { ...last, points: [...last.points, x, y] };
        const newArr = [...prev.slice(0, -1), updatedLine];
        socket.emit("draw-line", updatedLine);
        return newArr;
      });
    }
  };

  const handleMouseUp = () => {
    if (tool === "rect" && newRect) {
      const finalized = normalizeRect(newRect);
      setRectangles((prev) => [...prev, finalized]);
      socket.emit("draw-rect", finalized);
      setNewRect(null);
    }
    setIsDrawing(false);
  };

  return (
    <div className="w-screen h-screen relative">
      <div className="z-0">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          className="bg-amber-100 fixed top-0 left-0 pointer-events-auto"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {lines.map((line) => (
              <Line
                key={line.id}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}

            {rectangles.map((rect) => (
              <Rect
                key={rect.id}
                {...rect}
                draggable
                onDragStart={() => setIsDrawing(true)}
                onDragEnd={(e) => {
                  setIsDrawing(false);
                  const updated = rectangles.map((r) =>
                    r.id === rect.id
                      ? { ...r, x: e.target.x(), y: e.target.y() }
                      : r
                  );
                  setRectangles(updated);
                  socket.emit("update-rect", updated);
                }}
              />
            ))}
            {newRect && <Rect {...normalizeRect(newRect)} />}
          </Layer>
        </Stage>
      </div>
      <div className="absolute flex flex-col-reverse h-fit items-center z-10 left-1/2 transform -translate-x-1/2 top-4">
        <div className="bg-amber-200 p-4 rounded-full mb-10">
          <button
            className="tool-btn"
            onClick={() => {
              setTool("pencil");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-8 h-8 filter invert"
            >
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setTool("rect");
            }}
          >
            <svg
              className="w-8 h-8 filter invert"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M315.4 15.5C309.7 5.9 299.2 0 288 0s-21.7 5.9-27.4 15.5l-96 160c-5.9 9.9-6.1 22.2-.4 32.2s16.3 16.2 27.8 16.2l192 0c11.5 0 22.2-6.2 27.8-16.2s5.5-22.3-.4-32.2l-96-160zM288 312l0 144c0 22.1 17.9 40 40 40l144 0c22.1 0 40-17.9 40-40l0-144c0-22.1-17.9-40-40-40l-144 0c-22.1 0-40 17.9-40 40zM128 512a128 128 0 1 0 0-256 128 128 0 1 0 0 256z" />
            </svg>
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setTool("eraser");
            }}
          >
            <svg
              className="w-8 h-8 filter invert"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7L288 480l9.4 0L512 480c17.7 0 32-14.3 32-32s-14.3-32-32-32l-124.1 0L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416l-9.4 0-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
