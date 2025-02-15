// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useFrame, useGraph, useLoader } from "@react-three/fiber";
// import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
// import { SkeletonUtils } from "three-stdlib";
// import { useControls } from "leva";
// import * as THREE from "three";

// const corresponding = {
//   A: "viseme_PP",
//   B: "viseme_kk",
//   C: "viseme_I",
//   D: "viseme_AA",
//   E: "viseme_O",
//   F: "viseme_U",
//   G: "viseme_FF",
//   H: "viseme_TH",
//   X: "viseme_PP",
// };

// export function Avatar(props) {
//   const {
//     playAudio,
//     script,
//     headFollow,
//     smoothMorphTarget,
//     morphTargetSmoothing,
//   } = useControls({
//     playAudio: false,
//     headFollow: true,
//     smoothMorphTarget: true,
//     morphTargetSmoothing: 0.5,
//     script: {
//       value: "clara-intro",
//       options: ["clara-intro"],
//     },
//   });

//   // Use a persistent audio ref
//   const audioRef = useRef(new Audio(`/audios/${script}.mp3`));
//   // Reload audio when script changes
//   useEffect(() => {
//     audioRef.current.src = `/audios/${script}.mp3`;
//     audioRef.current.load();
//   }, [script]);

//   // Load lipsync JSON file and parse it
//   const jsonFile = useLoader(THREE.FileLoader, `/audios/${script}.json`);
//   const lipsync = useMemo(() => JSON.parse(jsonFile), [jsonFile]);

//   // Load model and animations
//   const { nodes, materials } = useGLTF("/models/67af9ec6b26aabcd80f25e07.glb");
//   const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
//   const { animations: talkingAnimation } = useFBX("/animations/Talking.fbx");
//   const { animations: listeningAnimation } = useFBX("/animations/Listening.fbx");

//   idleAnimation[0].name = "Idle";
//   talkingAnimation[0].name = "Talking";
//   listeningAnimation[0].name = "Listening";

//   const [animation, setAnimation] = useState("Idle");
//   const group = useRef();
//   const { actions } = useAnimations(
//     [idleAnimation[0], talkingAnimation[0], listeningAnimation[0]],
//     group
//   );

//   // Update audio and animation state when playAudio changes
//   useEffect(() => {
//     if (playAudio) {
//       audioRef.current
//         .play()
//         .catch((err) => console.error("Audio play error:", err));
//       // For this example, always switch to "Talking" when playing.
//       // (Adjust this logic if you want different behavior based on script.)
//       setAnimation("Talking");
//     } else {
//       audioRef.current.pause();
//       setAnimation("Idle");
//     }
//   }, [playAudio, script]);

//   // Handle animation transitions
//   useEffect(() => {
//     if (actions[animation]) {
//       actions[animation].reset().fadeIn(0.5).play();
//       return () => actions[animation].fadeOut(0.5);
//     }
//   }, [animation, actions]);

//   // Lip-sync update on every frame
//   useFrame(() => {
//     const currentTime = audioRef.current.currentTime;

//     // If audio isn't playing, ensure we remain idle.
//     if (audioRef.current.paused || audioRef.current.ended) {
//       return;
//     }

//     // Reset all viseme influences before applying a new one.
//     Object.keys(nodes.Wolf3D_Head.morphTargetDictionary).forEach((key) => {
//       const idx = nodes.Wolf3D_Head.morphTargetDictionary[key];
//       nodes.Wolf3D_Head.morphTargetInfluences[idx] = 0;
//     });
//     Object.keys(nodes.Wolf3D_Teeth.morphTargetDictionary).forEach((key) => {
//       const idx = nodes.Wolf3D_Teeth.morphTargetDictionary[key];
//       nodes.Wolf3D_Teeth.morphTargetInfluences[idx] = 0;
//     });

//     // Loop through each mouth cue and apply the corresponding viseme if in range.
//     for (let i = 0; i < lipsync.mouthCues.length; i++) {
//       const cue = lipsync.mouthCues[i];
//       if (currentTime >= cue.start && currentTime <= cue.end) {
//         const visemeKey = corresponding[cue.value];
//         if (
//           visemeKey &&
//           nodes.Wolf3D_Head.morphTargetDictionary[visemeKey] !== undefined
//         ) {
//           const headIdx = nodes.Wolf3D_Head.morphTargetDictionary[visemeKey];
//           const teethIdx = nodes.Wolf3D_Teeth.morphTargetDictionary[visemeKey];
//           if (!smoothMorphTarget) {
//             nodes.Wolf3D_Head.morphTargetInfluences[headIdx] = 1;
//             nodes.Wolf3D_Teeth.morphTargetInfluences[teethIdx] = 1;
//           } else {
//             nodes.Wolf3D_Head.morphTargetInfluences[headIdx] = THREE.MathUtils.lerp(
//               nodes.Wolf3D_Head.morphTargetInfluences[headIdx],
//               1,
//               morphTargetSmoothing
//             );
//             nodes.Wolf3D_Teeth.morphTargetInfluences[teethIdx] = THREE.MathUtils.lerp(
//               nodes.Wolf3D_Teeth.morphTargetInfluences[teethIdx],
//               1,
//               morphTargetSmoothing
//             );
//           }
//         }
//         break; // Exit after applying the first matching cue
//       }
//     }
//   });

//   // Make the head follow the camera if enabled
//   useFrame((state) => {
//     if (headFollow && group.current) {
//       const head = group.current.getObjectByName("Wolf3D_Head");
//       if (head) {
//         head.lookAt(state.camera.position);
//       }
//     }
//   });

//   return (
//     <group {...props} dispose={null} ref={group}>
//       <primitive object={nodes.Hips} />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Hair.geometry}
//         material={materials.Wolf3D_Hair}
//         skeleton={nodes.Wolf3D_Hair.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Glasses.geometry}
//         material={materials.Wolf3D_Glasses}
//         skeleton={nodes.Wolf3D_Glasses.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Body.geometry}
//         material={materials.Wolf3D_Body}
//         skeleton={nodes.Wolf3D_Body.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
//         material={materials.Wolf3D_Outfit_Bottom}
//         skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
//         material={materials.Wolf3D_Outfit_Footwear}
//         skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
//       />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Outfit_Top.geometry}
//         material={materials.Wolf3D_Outfit_Top}
//         skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
//       />
//       <skinnedMesh
//         name="EyeLeft"
//         geometry={nodes.EyeLeft.geometry}
//         material={materials.Wolf3D_Eye}
//         skeleton={nodes.EyeLeft.skeleton}
//         morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
//         morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="EyeRight"
//         geometry={nodes.EyeRight.geometry}
//         material={materials.Wolf3D_Eye}
//         skeleton={nodes.EyeRight.skeleton}
//         morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
//         morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="Wolf3D_Head"
//         geometry={nodes.Wolf3D_Head.geometry}
//         material={materials.Wolf3D_Skin}
//         skeleton={nodes.Wolf3D_Head.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
//       />
//       <skinnedMesh
//         name="Wolf3D_Teeth"
//         geometry={nodes.Wolf3D_Teeth.geometry}
//         material={materials.Wolf3D_Teeth}
//         skeleton={nodes.Wolf3D_Teeth.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
//       />
//     </group>
//   );
// }

// useGLTF.preload("/models/67af9ec6b26aabcd80f25e07.glb");

import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const facialExpressions = {
  neutral: {},
  happy: { mouthSmile: 1 },
  sad: { mouthFrown: 1 },
  angry: { browDownLeft: 1, browDownRight: 1 },
  surprised: { mouthOpen: 1 },
};

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/67af9ec6b26aabcd80f25e07.glb");
  const { message, onMessagePlayed } = useChat();
  const [lipsync, setLipsync] = useState();
  const [animation, setAnimation] = useState("Idle");
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();
  const group = useRef();

  // Load animations
  const { animations: idleAnim } = useFBX("/animations/Idle.fbx");
  const { animations: talkingAnim } = useFBX("/animations/Talking.fbx");
  const { animations: listeningAnim } = useFBX("/animations/Listening.fbx");
  idleAnim[0].name = "Idle";
  talkingAnim[0].name = "Talking";
  listeningAnim[0].name = "Listening";

  const { actions } = useAnimations(
    [idleAnim[0], talkingAnim[0], listeningAnim[0]],
    group
  );

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    
    const audio = new Audio(message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message]);

  useFrame(() => {
    // Apply facial expressions
    Object.keys(nodes.Wolf3D_Head.morphTargetDictionary).forEach((key) => {
      const idx = nodes.Wolf3D_Head.morphTargetDictionary[key];
      nodes.Wolf3D_Head.morphTargetInfluences[idx] = 
        facialExpressions[facialExpression][key] || 0;
    });

    // Handle lipsync
    if (audio && lipsync) {
      const currentTime = audio.currentTime;
      for (const cue of lipsync.mouthCues) {
        if (currentTime >= cue.start && currentTime <= cue.end) {
          const viseme = corresponding[cue.value];
          const idx = nodes.Wolf3D_Head.morphTargetDictionary[viseme];
          nodes.Wolf3D_Head.morphTargetInfluences[idx] = 1;
          break;
        }
      }
    }
  });

  // Animation handling
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation, actions]);

//   return (
//     <group {...props} ref={group} dispose={null}>
//       <primitive object={nodes.Hips} />
//       <skinnedMesh
//         geometry={nodes.Wolf3D_Head.geometry}
//         material={materials.Wolf3D_Skin}
//         skeleton={nodes.Wolf3D_Head.skeleton}
//         morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
//         morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
//       />
//       {/* Add other skinned meshes */}
//     </group>
//   );


  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );

}

  useGLTF.preload("/models/67af9ec6b26aabcd80f25e07.glb");

useGLTF.preload("/models/67af9ec6b26aabcd80f25e07.glb");
