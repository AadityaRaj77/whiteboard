import { motion } from "framer-motion";

const FloatingActionBar = ({
  visible,
  position,
  onCritique,
  onExpand,
  onValidate,
  onConvert,
}) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
                absolute
                z-50
                flex
                gap-2
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-2
                shadow-2xl
            "
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={onCritique}
        className="
                    px-3 py-2
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-500
                    text-sm
                "
      >
        Critique
      </button>

      <button
        onClick={onExpand}
        className="
                    px-3 py-2
                    rounded-xl
                    bg-zinc-800
                    hover:bg-zinc-700
                    text-sm
                "
      >
        Expand
      </button>

      <button
        onClick={onValidate}
        className="
                    px-3 py-2
                    rounded-xl
                    bg-zinc-800
                    hover:bg-zinc-700
                    text-sm
                "
      >
        Validate
      </button>

      <button
        onClick={onConvert}
        className="
                    px-3 py-2
                    rounded-xl
                    bg-zinc-800
                    hover:bg-zinc-700
                    text-sm
                "
      >
        Convert
      </button>
    </motion.div>
  );
};

export default FloatingActionBar;
