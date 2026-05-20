import { Group, Rect, Text } from "react-konva";

const IdeaNode = ({ node, onDragEnd, onClick, onDoubleClick, isSelected }) => {
  const colors = {
    idea: "#8b5cf6",

    problem: "#ef4444",

    feature: "#3b82f6",

    user: "#10b981",
  };

  return (
    <Group
      x={node.position.x}
      y={node.position.y}
      draggable
      onDragEnd={(e) =>
        onDragEnd(node._id, {
          x: e.target.x(),

          y: e.target.y(),
        })
      }
      onClick={(e) => {
        e.cancelBubble = true;

        onClick(node._id);
      }}
      onDblClick={(e) => {
        e.cancelBubble = true;

        onDoubleClick(node);
      }}
    >
      {/* Main Card */}

      <Rect
        width={240}
        height={110}
        fill="#18181b"
        stroke={isSelected ? "#ffffff" : colors[node.type] || "#8b5cf6"}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={22}
        shadowBlur={20}
        shadowOpacity={0.12}
      />

      {/* Type Indicator */}

      <Rect
        x={14}
        y={14}
        width={10}
        height={10}
        fill={colors[node.type] || "#8b5cf6"}
        cornerRadius={999}
      />

      {/* Node Type */}

      <Text
        text={node.type?.toUpperCase() || "IDEA"}
        x={32}
        y={10}
        fill="#a1a1aa"
        fontSize={11}
        letterSpacing={1}
      />

      {/* Main Content */}

      <Text
        text={node.text}
        x={18}
        y={40}
        fill="#fafafa"
        fontSize={17}
        width={200}
        lineHeight={1.4}
      />
    </Group>
  );
};

export default IdeaNode;
