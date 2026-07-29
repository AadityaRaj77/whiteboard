import { Line } from "react-konva";

const ConnectionLine = ({ from, to }) => {
  return (
    <Line
      points={[from.x, from.y, to.x, to.y]}
      stroke="#3f3f46"
      strokeWidth={2}
      lineCap="round"
      lineJoin="round"
      opacity={0.7}
    />
  );
};

export default ConnectionLine;
