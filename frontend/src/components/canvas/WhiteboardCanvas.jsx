import { Stage, Layer } from "react-konva";

import { useEffect, useRef, useState } from "react";
import FloatingActionBar from "../floating/FloatingActionBar";
import IdeaNode from "./IdeaNode";
import SelectedNodeToolbar from "../floating/SelectedNodeToolbar";

import { useBoardStore } from "../../store/useBoardStore";
import { useSelectionStore } from "../../store/useSelectionStore";
import { useAIStore } from "../../store/useAIStore";
import NodeEditor from "./NodeEditor";

import { useEditingStore } from "../../store/useEditingStore";

import api from "../../services/api";
import AddNodeButton from "../floating/AddNodeButton";

import { useUIStore } from "../../store/useUIStore";

const WhiteboardCanvas = () => {
  const stageRef = useRef();

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth - 460,
    height: window.innerHeight,
  });
  const [barPosition, setBarPosition] = useState({
    x: 0,
    y: 0,
  });
  const {
    setLoading,
    setCritique,
    setExpansion,
    setValidation,
    setPlan,
    clearResults,
  } = useAIStore();
  const { creatingNode, setCreatingNode } = useUIStore();
  const { nodes, setNodes, updateNode, addNode } = useBoardStore();

  const { selectedNodeIds, setSelectedNodeIds } = useSelectionStore();
  const { setEditingNode } = useEditingStore();

  // Resize Handling
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

  // Fetch Board
  useEffect(() => {
    async function fetchBoard() {
      const res = await api.get("/board/6a0d48401f78b58d10bd0c96");

      setNodes(res.data.nodes);
    }

    fetchBoard();
  }, []);

  const handleDragEnd = async (id, position) => {
    updateNode(id, { position });

    await api.put(`/node/${id}`, {
      position,
    });
  };

  // Selection
  const handleSelect = (id) => {
    let updated;

    if (selectedNodeIds.includes(id)) {
      updated = selectedNodeIds.filter((nodeId) => nodeId !== id);
    } else {
      updated = [...selectedNodeIds, id];
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

  const handleStageClick = async (e) => {
    if (!creatingNode) return;

    const pointer = stageRef.current.getPointerPosition();

    const payload = {
      boardId: "6a0d48401f78b58d10bd0c96",

      text: "Untitled Idea",

      type: "idea",

      position: {
        x: pointer.x,
        y: pointer.y,
      },
    };

    const res = await api.post("/node", payload);

    addNode(res.data.node);

    setCreatingNode(false);
  };
  const runAIAction = async (type) => {
    try {
      setLoading(true);

      clearResults();

      const res = await api.post(`/ai/${type}`, {
        nodeIds: selectedNodeIds,
      });

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
  const handleDoubleClickNode = (node) => {
    setEditingNode(node);
  };

  const handleDeleteNode = async () => {
    if (selectedNodeIds.length === 0) return;

    const nodeId = selectedNodeIds[0];

    await api.delete(`/node/${nodeId}`);

    setNodes(nodes.filter((node) => node._id !== nodeId));

    setSelectedNodeIds([]);
  };

  const handleClearCanvas = async () => {
    await Promise.all(nodes.map((node) => api.delete(`/node/${node._id}`)));

    setNodes([]);

    setSelectedNodeIds([]);
  };

  return (
    <div className="flex-1 bg-zinc-950 relative">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onDblClick={handleStageClick}
        onClick={handleStageClick}
      >
        <Layer>
          {nodes.map((node) => (
            <IdeaNode
              key={node._id}
              node={node}
              onDragEnd={handleDragEnd}
              onClick={handleSelect}
              onDoubleClick={handleStageClick}
              isSelected={selectedNodeIds.includes(node._id)}
            />
          ))}
        </Layer>
      </Stage>
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
      <FloatingActionBar
        visible={selectedNodeIds.length > 0}
        position={barPosition}
        onCritique={() => runAIAction("critique")}
        onExpand={() => runAIAction("expand")}
        onValidate={() => runAIAction("validate")}
        onConvert={() => runAIAction("convert")}
      />
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
      <AddNodeButton />
      <NodeEditor />
    </div>
  );
};

export default WhiteboardCanvas;
