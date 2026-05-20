import { Group, Rect, Text } from "react-konva";

const IdeaNode = ({ node, onDragEnd, onClick, onDoubleClick, isSelected }) => {
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
      <Rect
        width={240}
        height={110}
        fill="#18181b"
        stroke={isSelected ? "#8b5cf6" : "#3f3f46"}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={22}
        shadowBlur={20}
        shadowOpacity={0.12}
      />

      <Text
        text={node.text}
        fill="#fafafa"
        fontSize={17}
        width={200}
        padding={20}
      />
    </Group>
  );
};

export default IdeaNode;
