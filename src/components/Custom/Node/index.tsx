import { Handle, HandleProps, NodeProps, Position } from "reactflow";
import "./index.css";

export interface CustomNodeData {
  children?: React.ReactNode;
  handles?: HandleProps[];
}

const defaultHandles: HandleProps[] = [
  {
    type: "target",
    position: Position.Top,
  },
  {
    type: "source",
    position: Position.Bottom,
  },
];

export function CustomNode({
  data: { children = <p>Custom Node</p>, handles = defaultHandles },
  id,
  ...props
}: NodeProps<CustomNodeData>) {
  return (
    <div className="customNode">
      {handles &&
        handles.map((handle, index) => {
          return (
            <Handle
              id={id + "-" + index}
              {...handle}
              key={id + "-" + index}
            ></Handle>
          );
        })}
      <main>{children}</main>
    </div>
  );
}
