import { useAIStore } from "../../store/useAIStore";

import InsightCard from "./InsightCard";

const AIPanel = () => {
  const { loading, critique, validation, expansion, plan } = useAIStore();

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
          <InsightCard title="Weaknesses" items={critique.weaknesses} />

          <InsightCard title="Risks" items={critique.risks} />

          <InsightCard title="Improvements" items={critique.improvements} />
        </>
      )}

      {/* Expansion */}

      {expansion && (
        <>
          <InsightCard title="Target Users" items={expansion.target_users} />

          <InsightCard title="Unique Angles" items={expansion.angles} />

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
              Refined Problem
            </h3>

            <p
              className="
                            text-sm
                            text-zinc-300
                            leading-7
                        "
            >
              {expansion.refined_problem}
            </p>
          </div>
        </>
      )}

      {/* Validation */}

      {validation && (
        <>
          <InsightCard title="Competitors" items={validation.competitors} />

          <InsightCard title="Market Gaps" items={validation.gaps} />

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
              Verdict
            </h3>

            <p
              className="
                            text-sm
                            text-zinc-300
                            leading-7
                        "
            >
              {validation.verdict}
            </p>
          </div>
        </>
      )}

      {/* Plan */}

      {plan && (
        <>
          <InsightCard title="Features" items={plan.features} />

          <InsightCard title="Tech Stack" items={plan.tech_stack} />

          <InsightCard title="Timeline" items={plan.timeline} />

          <InsightCard title="Pitch Points" items={plan.pitch_points} />
        </>
      )}
    </div>
  );
};

export default AIPanel;
