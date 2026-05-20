import Sidebar from "../components/layout/Sidebar";
import WhiteboardCanvas from "../components/canvas/WhiteboardCanvas";
import AIPanel from "../components/ai/AIPanel";

const Board = () => {
  return (
    <div className="h-screen flex bg-zinc-950 text-white overflow-hidden">
      <Sidebar />

      <WhiteboardCanvas />

      <AIPanel />
    </div>
  );
};

export default Board;
