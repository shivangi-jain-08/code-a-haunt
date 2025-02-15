// // import { Environment, OrbitControls, useTexture } from "@react-three/drei";
// // import { Avatar } from "./Avatar";
// // import { useThree } from "@react-three/fiber";

// // export const Experience = () => {

// //     const texture = useTexture("textures/therapist-bg.jpg");
// //     const viewport = useThree((state) => state.viewport);

// //   return (
// //     <>
// //       <OrbitControls />
// //     <Avatar position={[0, -3, 5]} scale={2} />
// //     <Environment preset="sunset" />
// //     <mesh>
// //         <planeGeometry args={[viewport.width, viewport.height]} />
// //         <meshBasicMaterial map={texture} />
// //     </mesh>
// //     </>
// //   );
// // };

// import {
//   CameraControls,
//   ContactShadows,
//   Environment,
//   Text,
// } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { useChat } from "../hooks/useChat";
// import { Avatar } from "./Avatar";

// const Dots = (props) => {
//   const { loading } = useChat();
//   const [loadingText, setLoadingText] = useState("");
//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setLoadingText((loadingText) => {
//           if (loadingText.length > 2) {
//             return ".";
//           }
//           return loadingText + ".";
//         });
//       }, 800);
//       return () => clearInterval(interval);
//     } else {
//       setLoadingText("");
//     }
//   }, [loading]);
//   if (!loading) return null;
//   return (
//     <group {...props}>
//       <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
//         {loadingText}
//         <meshBasicMaterial attach="material" color="black" />
//       </Text>
//     </group>
//   );
// };

// export const Experience = () => {
//   const cameraControls = useRef();
//   const { cameraZoomed } = useChat();

//   useEffect(() => {
//     cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
//   }, []);

//   useEffect(() => {
//     if (cameraZoomed) {
//       cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
//     } else {
//       cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
//     }
//   }, [cameraZoomed]);
//   return (
//     <>
//       <CameraControls ref={cameraControls} />
//       <Environment preset="sunset" />
//       {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
//       <Suspense>
//         <Dots position-y={1.75} position-x={-0.02} />
//       </Suspense>
//       <Avatar />
//       <ContactShadows opacity={0.7} />
//     </>
//   );
// };
import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import { useChat } from "../hooks/useChat";

const LoadingDots = ({ position }) => {
  const { loading } = useChat();
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <Text position={position} fontSize={0.2}>
      {dots}
      <meshBasicMaterial color="black" />
    </Text>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    cameraControls.current?.setLookAt(
      0,
      cameraZoomed ? 1.5 : 2,
      cameraZoomed ? 1.5 : 5,
      0,
      1.5,
      0,
      true
    );
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <LoadingDots position={[0, 2, 0]} />
        <Avatar position={[0, -1, 0]} scale={0.8} />
      </Suspense>
      <ContactShadows opacity={0.7} />
    </>
  );
};
