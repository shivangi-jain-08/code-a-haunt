import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import Home from "./components/Home";
import LoginProvider from "./Context/LoginContext";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import { WindowWidthProvider } from "./Context/WindowWidthContext";

function App() {
  return (
    <div className="h-screen">
      {/* <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas> */}
      {/* <h1 className="text-3xl font-bold underline">
        TESTING
      </h1> */}
      <WindowWidthProvider>

     
      <LoginProvider>
        <BrowserRouter>
          

          
          <AllRoutes />

         
        </BrowserRouter>
      </LoginProvider>
      </WindowWidthProvider>
    </div>
  );
}

export default App;
