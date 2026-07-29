import { useAIStore } from "../../store/useAIStore";

import InsightCard from "./InsightCard";

import api from "../../services/api";

import { useBoardStore } from "../../store/useBoardStore";

const BOARD_ID = "6a0d48401f78b58d10bd0c96";

const AIPanel = () => {
  const { loading, critique, validation, expansion, plan } = useAIStore();

  const { addNode } = useBoardStore();

  // ------------------------------
  // Add AI Insight To Board
  // ------------------------------

  const handleAddToBoard = async (text) => {
    try {
      const payload = {
        boardId: BOARD_ID,

        text,

        type: "idea",

        position: {
          x: 300 + Math.random() * 400,

          y: 200 + Math.random() * 400,
        },
      };

      const res = await api.post("/node", payload);

      addNode(res.data.node);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="
        w-[380px]

        border-l
        border-zinc-800

        bg-zinc-900

        p-5

        overflow-y-auto
      "
    >
      {/* Header */}

      <div className="mb-8">
        <h2
          className="
            text-2xl
            font-semibold
            mb-2
          "
        >
          AI Insights
        </h2>

        <p
          className="
            text-sm
            text-zinc-400
            leading-6
          "
        >
          Strategic feedback and execution guidance for your selected ideas.
        </p>
      </div>

      {/* Loading */}

      {loading && (
        <div
          className="
            text-zinc-400

            animate-pulse
          "
        >
          Thinking deeply...
        </div>
      )}

      {/* Critique */}

      {critique && (
        <>
          <InsightCard
            title="Weaknesses"
            items={critique.weaknesses}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Risks"
            items={critique.risks}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Improvements"
            items={critique.improvements}
            onAddToBoard={handleAddToBoard}
          />
        </>
      )}

      {/* Expansion */}

      {expansion && (
        <>
          <InsightCard
            title="Target Users"
            items={expansion.target_users}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Unique Angles"
            items={expansion.angles}
            onAddToBoard={handleAddToBoard}
          />
        </>
      )}

      {/* Validation */}

      {validation && (
        <>
          <InsightCard
            title="Competitors"
            items={validation.competitors}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Market Gaps"
            items={validation.gaps}
            onAddToBoard={handleAddToBoard}
          />
        </>
      )}

      {/* Plan */}

      {plan && (
        <>
          <InsightCard
            title="Features"
            items={plan.features}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Tech Stack"
            items={plan.tech_stack}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Timeline"
            items={plan.timeline}
            onAddToBoard={handleAddToBoard}
          />

          <InsightCard
            title="Pitch Points"
            items={plan.pitch_points}
            onAddToBoard={handleAddToBoard}
          />
        </>
      )}
    </div>
  );
};

export default AIPanel;
