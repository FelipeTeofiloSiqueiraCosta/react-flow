import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  FitViewOptions,
  Node,
  NodeChange,
  OnConnectStartParams,
  useReactFlow,
} from "reactflow";
import { CustomNode, CustomNodeData } from "../../components/Custom/Node";

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "node1",
    type: "customNode",
    data: {},
    position: { x: 5, y: 5 },
  },
];

const initialEdges: Edge[] = [
  // { id: 'e1-2', source: '1', target: '2' }
];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

let id = 1;
const getId = () => `${id++}`;

export function Flow() {
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { project } = useReactFlow();

  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge<any>[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId }: OnConnectStartParams) => {
      connectingNodeId.current = nodeId;
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = event.target as Element;
      const targetIsPane = target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        if (reactFlowWrapper.current != null) {
          let { top, left } = reactFlowWrapper.current.getBoundingClientRect();

          const id = getId();
          const newNode: Node = {
            id,
            // we are removing the half of the node width (75) to center the new node
            position: project({
              x: event.clientX - left - 75,
              y: event.clientY - top,
            }),
            data: { label: `Node ${id}` },
          };

          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({
              id,
              source: connectingNodeId.current,
              target: id,
            } as Edge)
          );
        }
      }
    },
    [project]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={(event) => {
          onConnectEnd(event);
        }}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
      ></ReactFlow>
    </div>
  );
}
