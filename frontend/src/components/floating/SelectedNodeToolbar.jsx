import { Pencil, Trash2 } from "lucide-react";

const SelectedNodeToolbar = ({ visible, position, onEdit, onDelete }) => {
  if (!visible) return null;

  return (
    <div
      className="
        absolute

        z-[9999]

        flex
        gap-2

        bg-zinc-900

        border
        border-zinc-700

        rounded-2xl

        px-3
        py-2

        shadow-2xl
      "
      style={{
        left: position.x,

        top: position.y,
      }}
    >
      <button
        onClick={onEdit}
        className="
          p-2

          rounded-xl

          hover:bg-zinc-800

          transition
        "
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={onDelete}
        className="
          p-2

          rounded-xl

          text-red-400

          hover:bg-red-500/20

          transition
        "
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default SelectedNodeToolbar;
