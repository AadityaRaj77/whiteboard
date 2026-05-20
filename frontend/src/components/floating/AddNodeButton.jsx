import { Plus } from "lucide-react";

import { useUIStore } from "../../store/useUIStore";

const AddNodeButton = () => {
  const { creatingNode, setCreatingNode } = useUIStore();

  return (
    <button
      onClick={() => setCreatingNode(!creatingNode)}
      className={`
        absolute

        bottom-6
        right-[420px]

        z-50

        w-14
        h-14

        rounded-2xl

        flex
        items-center
        justify-center

        shadow-2xl

        transition

        ${creatingNode ? "bg-violet-500" : "bg-zinc-800 hover:bg-zinc-700"}
      `}
    >
      <Plus size={24} />
    </button>
  );
};

export default AddNodeButton;
