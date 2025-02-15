import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <div className="h-screen">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      {/* <h1 className="text-3xl font-bold underline">
        TESTING
      </h1> */}
    </div>
  );
}

export default App;
