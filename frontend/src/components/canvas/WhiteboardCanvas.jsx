import { Stage, Layer } from "react-konva";

import { useEffect, useRef, useState } from "react";

import FloatingActionBar from "../floating/FloatingActionBar";
import SelectedNodeToolbar from "../floating/SelectedNodeToolbar";
import AddNodeButton from "../floating/AddNodeButton";

import IdeaNode from "./IdeaNode";
import NodeEditor from "./NodeEditor";
import ConnectionLine from "./ConnectionLine";

import { useBoardStore } from "../../store/useBoardStore";
import { useSelectionStore } from "../../store/useSelectionStore";
import { useAIStore } from "../../store/useAIStore";
import { useEditingStore } from "../../store/useEditingStore";
import { useUIStore } from "../../store/useUIStore";

import api from "../../services/api";

const BOARD_ID = "6a0d48401f78b58d10bd0c96";

const WhiteboardCanvas = () => {
  const stageRef = useRef();

  // ------------------------------
  // Stage State
  // ------------------------------

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth - 460,

    height: window.innerHeight,
  });

  const [stageScale, setStageScale] = useState(1);

  const [stagePosition, setStagePosition] = useState({
    x: 0,

    y: 0,
  });

  const [barPosition, setBarPosition] = useState({
    x: 0,

    y: 0,
  });

  // ------------------------------
  // Stores
  // ------------------------------

  const {
    nodes,

    setNodes,

    updateNode,

    addNode,
  } = useBoardStore();

  const {
    selectedNodeIds,

    setSelectedNodeIds,
  } = useSelectionStore();

  const {
    setLoading,

    setCritique,

    setExpansion,

    setValidation,

    setPlan,

    clearResults,
  } = useAIStore();

  const { setEditingNode } = useEditingStore();

  const {
    creatingNode,

    setCreatingNode,
  } = useUIStore();

  // ------------------------------
  // Resize
  // ------------------------------

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth - 460,

        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ------------------------------
  // Fetch Board
  // ------------------------------

  useEffect(() => {
    async function fetchBoard() {
      try {
        const res = await api.get(`/board/${BOARD_ID}`);

        setNodes(res.data.nodes);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBoard();
  }, []);

  // ------------------------------
  // Keyboard Shortcuts
  // ------------------------------

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedNodeIds.length > 0) {
        handleDeleteNode();
      }

      if (e.key.toLowerCase() === "n") {
        setCreatingNode(true);
      }

      if (e.key === "Escape") {
        setSelectedNodeIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeIds, nodes]);

  // ------------------------------
  // Zoom
  // ------------------------------

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;

    const stage = stageRef.current;

    const oldScale = stageScale;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,

      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);

    setStagePosition({
      x: pointer.x - mousePointTo.x * newScale,

      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // ------------------------------
  // Drag Node
  // ------------------------------

  const handleDragEnd = async (id, position) => {
    updateNode(id, {
      position,
    });

    try {
      await api.put(`/node/${id}`, { position });
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // Select Node
  // ------------------------------

  const handleSelect = (id) => {
    let updated;

    if (selectedNodeIds.includes(id)) {
      updated = [];
    } else {
      updated = [id];
    }

    setSelectedNodeIds(updated);

    const node = nodes.find((n) => n._id === id);

    if (node) {
      setBarPosition({
        x: node.position.x + 40,

        y: node.position.y + 125,
      });
    }
  };

  // ------------------------------
  // Create Node
  // ------------------------------

  const handleStageClick = async () => {
    if (!creatingNode) return;

    const pointer = stageRef.current.getPointerPosition();

    const payload = {
      boardId: BOARD_ID,

      text: "Untitled Idea",

      type: "idea",

      position: {
        x: pointer.x,

        y: pointer.y,
      },
    };

    try {
      const res = await api.post("/node", payload);

      addNode(res.data.node);

      setCreatingNode(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // Edit Node
  // ------------------------------

  const handleDoubleClickNode = (node) => {
    setEditingNode(node);
  };

  // ------------------------------
  // Delete Node
  // ------------------------------

  const handleDeleteNode = async () => {
    if (selectedNodeIds.length === 0) return;

    const nodeId = selectedNodeIds[0];

    try {
      await api.delete(`/node/${nodeId}`);

      setNodes(nodes.filter((node) => node._id !== nodeId));

      setSelectedNodeIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // Clear Canvas
  // ------------------------------

  const handleClearCanvas = async () => {
    try {
      await Promise.all(nodes.map((node) => api.delete(`/node/${node._id}`)));

      setNodes([]);

      setSelectedNodeIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------
  // AI Actions
  // ------------------------------

  const runAIAction = async (type) => {
    try {
      setLoading(true);

      clearResults();

      const res = await api.post(
        `/ai/${type}`,

        {
          nodeIds: selectedNodeIds,
        },
      );

      const result = res.data.result;

      if (type === "critique") {
        setCritique(result);
      }

      if (type === "expand") {
        setExpansion(result);
      }

      if (type === "validate") {
        setValidation(result);
      }

      if (type === "convert") {
        setPlan(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      flex-1
      bg-zinc-950
      relative
      overflow-hidden
    "
    >
      {/* Grid */}

      <div
        className="
          absolute
          inset-0

          opacity-[0.03]

          pointer-events-none

          bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)]

          [background-size:24px_24px]
        "
      />

      {/* Clear */}

      <button
        onClick={handleClearCanvas}
        className="
          absolute
          top-6
          right-[420px]

          z-50

          px-4
          py-2

          rounded-2xl

          bg-red-500/20
          text-red-400

          hover:bg-red-500/30

          transition
        "
      >
        Clear Canvas
      </button>

      {/* Stage */}

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={stageScale}
        scaleY={stageScale}
        onDragEnd={(e) => {
          setStagePosition({
            x: e.target.x(),

            y: e.target.y(),
          });
        }}
        onWheel={handleWheel}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Connections */}

          {nodes.length > 1 &&
            nodes.slice(1).map((node, index) => (
              <ConnectionLine
                key={node._id}
                from={{
                  x: nodes[index].position.x + 120,

                  y: nodes[index].position.y + 55,
                }}
                to={{
                  x: node.position.x + 120,

                  y: node.position.y + 55,
                }}
              />
            ))}

          {/* Nodes */}

          {nodes.map((node) => (
            <IdeaNode
              key={node._id}
              node={node}
              onDragEnd={handleDragEnd}
              onClick={handleSelect}
              onDoubleClick={handleDoubleClickNode}
              isSelected={selectedNodeIds.includes(node._id)}
            />
          ))}
        </Layer>
      </Stage>

      {/* AI Actions */}

      <FloatingActionBar
        visible={selectedNodeIds.length > 0}
        position={barPosition}
        onCritique={() => runAIAction("critique")}
        onExpand={() => runAIAction("expand")}
        onValidate={() => runAIAction("validate")}
        onConvert={() => runAIAction("convert")}
      />

      {/* Edit/Delete */}

      <SelectedNodeToolbar
        visible={selectedNodeIds.length === 1}
        position={barPosition}
        onEdit={() => {
          const node = nodes.find((n) => n._id === selectedNodeIds[0]);

          if (node) {
            setEditingNode(node);
          }
        }}
        onDelete={handleDeleteNode}
      />

      {/* Add Node */}

      <AddNodeButton />

      {/* Editor */}

      <NodeEditor />
    </div>
  );
};

export default WhiteboardCanvas;
