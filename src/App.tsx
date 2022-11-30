import { ReactFlowProvider } from "reactflow";
import "./App.css";
import { Flow } from "./components/Flow";

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
