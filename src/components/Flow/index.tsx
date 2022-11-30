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
  Position,
  useReactFlow,
} from "reactflow";
import {
  CustomHandleProps,
  CustomNode,
  CustomNodeData,
} from "../../components/Custom/Node";

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "start",
    type: "customNode",
    connectable: true,
    deletable: false,
    data: {
      children: "Start",
      handles: [
        {
          id: "start-handle1",
          type: "source",
          position: Position.Bottom,
          isConnectable: true,
        },
      ],
    },
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
    (changes: NodeChange[]) => {
      return setNodes((nds) => {
        if (changes[0].type === "remove") {
          setEdges((eds) => {
            eds.pop();

            return eds;
          });

          nds[nds.length - 2].selectable = true;
          nds[nds.length - 2].deletable = true;
          nds[nds.length - 2].data.handles = nds[
            nds.length - 2
          ].data.handles?.map((handleNode) => {
            if (handleNode.type === "source") {
              handleNode.isConnectable = true;
            }
            return handleNode;
          });

          if (id > 1) {
            id = nds.length - 1;
          } else {
            id = 1;
          }
        }

        return applyNodeChanges(changes, nds);
      });
    },
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
    (_: React.MouseEvent, { nodeId, handleType }: OnConnectStartParams) => {
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
            id: `${id}`,
            type: "customNode",
            connectable: true,

            data: {
              children: `Node ${id}`,
              handles: [
                {
                  id: `${id}-handle1`,
                  type: "target",
                  position: Position.Top,
                  isConnectable: false,
                  style: { stroke: "#000" },
                },
                {
                  id: `${id}-handle2`,
                  type: "source",
                  position: Position.Bottom,
                  isConnectable: true,
                  style: { stroke: "#000" },
                },
              ] as CustomHandleProps[],
            },
            // we are removing the half of the node width (75) to center the new node
            position: project({
              x: event.clientX - left - 75,
              y: event.clientY - top,
            }),
          };

          setNodes((nds) => {
            const numId = Number(id) - 1;
            let newNodes: Node<CustomNodeData>[] = [];
            if (nds[numId].data.handles) {
              newNodes = nds.map((nd) => {
                nd.connectable = false;
                nd.selectable = false;
                nd.deletable = false;
                nd.data.handles = nd.data.handles?.map((handleNode) => {
                  handleNode.isConnectable = false;

                  return handleNode;
                });

                return nd;
              });
            }

            return newNodes.concat(newNode);
          });

          setEdges((eds) => {
            return eds.concat({
              id: `${connectingNodeId.current}-${id}`,
              source: connectingNodeId.current,
              target: id,
              deletable: false,
            } as Edge);
          });
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
