import { Lightbulb, User, Sparkles } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-20 border-r border-zinc-800 bg-zinc-900 flex flex-col items-center py-6 gap-6">
      <button className="p-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition">
        <Lightbulb size={20} />
      </button>

      <button className="p-3 rounded-2xl hover:bg-zinc-800 transition">
        <User size={20} />
      </button>

      <button className="p-3 rounded-2xl hover:bg-zinc-800 transition">
        <Sparkles size={20} />
      </button>
    </div>
  );
};

export default Sidebar;
