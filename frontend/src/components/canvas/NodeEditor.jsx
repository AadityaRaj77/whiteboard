import { useEffect, useState } from "react";

import { useEditingStore } from "../../store/useEditingStore";

import { useBoardStore } from "../../store/useBoardStore";

import api from "../../services/api";

const NodeEditor = () => {
  const { editingNode, clearEditingNode } = useEditingStore();

  const { updateNode } = useBoardStore();

  const [text, setText] = useState("");

  useEffect(() => {
    if (editingNode) {
      setText(editingNode.text);
    }
  }, [editingNode]);

  if (!editingNode) return null;

  const save = async () => {
    try {
      updateNode(
        editingNode._id,

        { text },
      );

      await api.put(
        `/node/${editingNode._id}`,

        { text },
      );
    } catch (err) {
      console.error(err);
    } finally {
      clearEditingNode();
    }
  };

  return (
    <textarea
      autoFocus
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          save();
        }

        if (e.key === "Escape") {
          clearEditingNode();
        }
      }}
      className="
        absolute

        z-[9999]

        bg-zinc-900

        border
        border-violet-500

        rounded-2xl

        p-4

        text-white

        outline-none

        resize-none

        shadow-2xl
      "
      style={{
        left: editingNode.position.x,

        top: editingNode.position.y,

        width: 240,

        height: 110,
      }}
    />
  );
};

export default NodeEditor;
