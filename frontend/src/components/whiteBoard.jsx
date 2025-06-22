import React, { use, useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { Stage, Layer, Rect, Circle, Line } from "react-konva";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Whiteboard() {
  const [tool, setTool] = useState("pencil");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);

  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const isDragging = useRef(false);

  const [color, setColor] = useState("red");
  const [stroke, setStroke] = useState(5);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (
      !isDrawing.current ||
      isDragging.current ||
      tool === "rect" ||
      tool === "circle"
    ) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lastLine.stroke = color;
    lastLine.strokeWidth = stroke;
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());

    socket.emit("updateLines", lines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    socket.on("updateRectangles", (data) => {
      setRectangles(data);
    });

    socket.on("updateCircles", (data) => {
      setCircles(data);
    });

    socket.on("updateLines", (data) => {
      setLines(data);
    });

    window.addEventListener("resize", () => {
      const stage = document.querySelector(".konvajs-content");

      stage.style.width = `${window.innerWidth}px`;
      stage.style.height = `${window.innerHeight}px`;
    });
    return () => {
      socket.off("updateRectangles");
      socket.off("updateCircles");
      socket.off("updateLines");
    };
  }, []);

  const addRect = () => {
    const data = {
      x: Math.random() * 300,
      y: Math.random() * 200,
      width: 50,
      height: 50,
      fill: color,
    };
    setRectangles([...rectangles, data]);

    socket.emit("updateRectangles", rectangles);
  };

  const addCircle = () => {
    const data = {
      x: Math.random() * 300,
      y: Math.random() * 200,
      radius: 25,
      fill: color,
    };
    setCircles([...circles, data]);

    socket.emit("updateCircles", circles);
  };

  const changeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
  };

  const changeStroke = (e) => {
    const newColor = e.target.value;
    setStroke(newColor);
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
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke || color}
                strokeWidth={line.strokeWidth || stroke}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
          <Layer>
            {rectangles.map((rect, index) => (
              <Rect
                key={index}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.fill}
                stroke="black"
                strokeWidth={0}
                draggable
                onDblClick={() => {
                  const newRectangles = rectangles.slice();
                  newRectangles[index] = {};

                  setRectangles(newRectangles);
                  socket.emit("updateRectangles", newRectangles);
                }}
                onDragStart={() => {
                  isDrawing.current = false;
                  isDragging.current = true;
                }}
                onDragMove={(e) => {
                  socket.emit("updateRectangles", rectangles);
                }}
                onDragEnd={(e) => {
                  const newRectangles = rectangles.slice();
                  newRectangles[index] = {
                    ...newRectangles[index],
                    x: e.target.x(),
                    y: e.target.y(),
                  };
                  setRectangles(newRectangles);
                  socket.emit("updateRectangles", newRectangles);

                  isDragging.current = false;
                }}
              />
            ))}
          </Layer>

          <Layer>
            {circles.map((circle, index) => (
              <Circle
                key={index}
                x={circle.x}
                y={circle.y}
                radius={circle.radius}
                fill={circle.fill}
                stroke="black"
                strokeWidth={0}
                draggable
                onDblClick={() => {
                  const newCircles = circles.slice();
                  newCircles[index] = {};

                  setCircles(newCircles);
                  socket.emit("updateRectangles", newCircles);
                }}
                onDragStart={(e) => {
                  isDragging.current = true;
                  isDrawing.current = false;
                }}
                onDragMove={(e) => {
                  socket.emit("updateCircles", circles);
                }}
                onDragEnd={(e) => {
                  const newCircles = circles.slice();
                  newCircles[index] = {
                    ...newCircles[index],
                    x: e.target.x(),
                    y: e.target.y(),
                  };
                  setCircles(newCircles);
                  socket.emit("updateCircles", newCircles);

                  isDragging.current = false;
                }}
              />
            ))}
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
              addRect();
            }}
          >
            <img
              className="w-8 h-8 invert filter"
              src="https://img.icons8.com/ios-filled/50/rectangle.png"
              alt="rectangle"
            />
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setTool("circle");
              addCircle();
            }}
          >
            <img
              className="w-8 h-8 invert filter"
              src="https://img.icons8.com/forma-thin-filled/96/circled.png"
              alt="rectangle"
            />
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
          <input
            type="color"
            className="tool-btn"
            onChange={changeColor}
            value={color ?? "red"}
          />

          <input
            type="number"
            className="tool-btn"
            onChange={changeStroke}
            value={stroke ?? 5}
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
