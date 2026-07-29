const InsightCard = ({ title, items, onAddToBoard }) => {
  if (!items || items.length === 0) return null;

  return (
    <div
      className="
        bg-zinc-800/70

        border
        border-zinc-700

        rounded-2xl

        p-5
        mb-5
      "
    >
      <h3
        className="
          text-sm

          uppercase

          tracking-wide

          text-violet-400

          mb-4

          font-medium
        "
      >
        {title}
      </h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="
              border-b
              border-zinc-700/50

              pb-4
            "
          >
            <div
              className="
                text-sm

                leading-7

                text-zinc-300

                flex
                gap-3
              "
            >
              <div
                className="
                  w-1.5
                  h-1.5

                  rounded-full

                  bg-violet-400

                  mt-3

                  shrink-0
                "
              />

              <p>{item}</p>
            </div>

            {/* Add to Board */}

            <button
              onClick={() => onAddToBoard(item)}
              className="
                mt-3

                ml-5

                text-xs

                text-violet-400

                hover:text-violet-300

                transition
              "
            >
              + Add to board
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCard;
