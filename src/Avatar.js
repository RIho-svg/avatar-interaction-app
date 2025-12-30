import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";


export default function Avatar({ expression, calibration, avatarUrl }) {
    const { scene } = useGLTF(
    avatarUrl ||
        "https://models.readyplayer.me/690d9cf7d9d72e80a596583d.glb?morphTargets=ARKit"
    );

  const armBaseRotation = useRef({});
  const shoulderBase = useRef({});
  const neckBase = useRef({});

    const MOUTH_BASE_OFFSET = 0.3;
    const BROW_BASE_OFFSET = -0.2;
    const EYE_BASE_OFFSET = 0;


// useEffect(() => {
//   scene.traverse((child) => {
//     console.log(
//       child.name,
//       child.type,
//       child.isMesh ? "Mesh" : "",
//       child.isBone ? "Bone" : ""
//     );
//   });
// }, [scene]);


  useEffect(() => {
//   console.log("🧠 expression:", expression);
    scene.traverse((child) => {
  if (!child.morphTargetDictionary) return;
//   console.log(child.name, child.morphTargetDictionary);
});


    scene.traverse((child) => {
        if (
            child.name === "Spine" ||
            child.name === "Spine1" ||
            child.name === "Spine2"
            ) {
            if (!shoulderBase.current[child.name]) {
                shoulderBase.current[child.name] = child.rotation.y;
            }

            const yaw = delta(
                expression.torsoYaw,
                calibration?.torsoYaw
            );

            const weight =
                child.name === "Spine"
                ? 0.4
                : child.name === "Spine1"
                ? 0.1
                : 0.4;

            child.rotation.y = THREE.MathUtils.lerp(
                child.rotation.y,
                shoulderBase.current[child.name] + yaw * weight,
                0.3
            );

            return;
            }


        if (child.name === "LeftArm") {
        if (!shoulderBase.current.left) {
            shoulderBase.current.left = child.rotation.x;
        }

        const d =
            delta(
            expression.rightShoulderPitch,
            calibration?.rightShoulderPitch
            );

        child.rotation.x = THREE.MathUtils.lerp(
            child.rotation.x,
            shoulderBase.current.left - d * 3,
            0.3
        );

        }

        if (child.name === "RightArm") {
        if (!shoulderBase.current.right) {
            shoulderBase.current.right = child.rotation.x;
        }

        const d =
            delta(
            expression.leftShoulderPitch,
            calibration?.leftShoulderPitch
            );

        child.rotation.x = THREE.MathUtils.lerp(
            child.rotation.x,
            shoulderBase.current.right - d * 3,
            0.3
        );
        }

        if (child.name === "LeftForeArm") {
        if (!armBaseRotation.current.leftForeArm) {
            armBaseRotation.current.leftForeArm = child.rotation.x;
        }

        const d = delta(
            expression.leftElbowFlex,
            calibration?.leftElbowFlex
        );

        const target =
            armBaseRotation.current.leftForeArm - d * 1.5;

        child.rotation.x = THREE.MathUtils.lerp(
            child.rotation.x,
            target,
            0.1
        );

        return;
        }

        if (child.name === "RightForeArm") {
        if (!armBaseRotation.current.rightForeArm) {
            armBaseRotation.current.rightForeArm = child.rotation.x;
        }

        const d = delta(
            expression.rightElbowFlex,
            calibration?.rightElbowFlex
        );

        const target =
            armBaseRotation.current.rightForeArm - d * 1.5;

        child.rotation.x = THREE.MathUtils.lerp(
            child.rotation.x,
            target,
            0.1
        );
        return;
        }


        if (child.name === "Neck" || child.name === "Head") {
            if (!neckBase.current.base) {
                neckBase.current.base = {
                x: child.rotation.x,
                y: child.rotation.y,
                };
            }

            const yaw = delta(
                expression.headYaw,
                calibration?.headYaw
            );

            const pitch = delta(
                expression.headPitch,
                calibration?.headPitch
            );

            // 左右は鏡合わせ（-yaw）
            child.rotation.y =
                neckBase.current.base.y - yaw * 2;

            // 上下
            child.rotation.x =
                neckBase.current.base.x + pitch * 3 - 0.2;
            
            return;
        }

        if (!child.isMesh) return;
        if (!child.morphTargetDictionary) return;

        const d = child.morphTargetDictionary;
        const i = child.morphTargetInfluences;

        // ===== mouth =====
        if (d.mouthSmileLeft !== undefined) {
        i[d.mouthSmileLeft] = apply(
            expression.mouthSmileLeft,
            calibration?.mouthSmileLeft,
            1
        );
        }

        if (d.mouthSmileRight !== undefined) {
        i[d.mouthSmileRight] = apply(
            expression.mouthSmileRight,
            calibration?.mouthSmileRight,
            1
        );
        }

        if (d.jawOpen !== undefined) {
        i[d.jawOpen] = apply(
            expression.mouthOpen,
            calibration?.mouthOpen,
            1
        );
        }

        if (d.mouthFrownLeft !== undefined) {
        i[d.mouthFrownLeft] = apply(
            expression.mouthFrownLeft,
            calibration?.mouthFrownLeft,
            5,
            MOUTH_BASE_OFFSET
        );
        }

        if (d.mouthFrownRight !== undefined) {
        i[d.mouthFrownRight] = apply(
            expression.mouthFrownRight,
            calibration?.mouthFrownRight,
            5,
            MOUTH_BASE_OFFSET
        );
        }

        // ===== brow =====
        // if (d.browOuterUpLeft !== undefined) {
        // i[d.browOuterUpLeft] = apply(
        //     expression.browUpLeft,
        //     calibration?.browUpLeft,
        //     1,
        //     BROW_BASE_OFFSET
        // );
        // }

        // if (d.browOuterUpRight !== undefined) {
        // i[d.browOuterUpRight] = apply(
        //     expression.browUpRight,
        //     calibration?.browUpRight,
        //     1,
        //     BROW_BASE_OFFSET
        // );
        // }

        if (d.browInnerUp !== undefined) {
        i[d.browInnerUp] = apply(
            expression.browInnerUp,
            calibration?.browInnerUp,
            5
        );
        }

        // if (d.browDownLeft !== undefined) {
        // i[d.browDownLeft] = apply(
        //     expression.browDownLeft,
        //     calibration?.browDownLeft
        // );
        // }

        // if (d.browDownRight !== undefined) {
        // i[d.browDownRight] = apply(
        //     expression.browDownRight,
        //     calibration?.browDownRight
        // );
        // }

        // // ===== eyes =====
        if (d.eyeBlinkLeft !== undefined) {
        i[d.eyeBlinkLeft] = apply(
            1 - expression.eyeOpenLeft,
            1 - calibration?.eyeOpenLeft
        );
        }

        if (d.eyeBlinkRight !== undefined) {
        i[d.eyeBlinkRight] = apply(
            1 - expression.eyeOpenRight,
            1 - calibration?.eyeOpenRight
        );
        }

        if (d.eyeWideLeft !== undefined) {
        i[d.eyeWideLeft] = apply(
            expression.eyeWideLeft,
            calibration?.eyeWideLeft,
            1,
            EYE_BASE_OFFSET
        );
        }

        if (d.eyeWideRight !== undefined) {
        i[d.eyeWideRight] = apply(
            expression.eyeWideRight,
            calibration?.eyeWideRight,
            1,
            EYE_BASE_OFFSET
        );
        }

        if (d.eyeSquintLeft !== undefined) {
        i[d.eyeSquintLeft] = apply(
            expression.eyeSquintLeft,
            calibration?.eyeSquintLeft,
            30
        );
        }

        if (d.eyeSquintRight !== undefined) {
        i[d.eyeSquintRight] = apply(
            expression.eyeSquintRight,
            calibration?.eyeSquintRight,
            30
        );
        }

        // ===== cheek =====
        if (d.cheekPuff !== undefined) {
        i[d.cheekPuff] = apply(
            expression.cheekPuff,
            calibration?.cheekPuff
        );
        }

        if (d.cheekSquintLeft !== undefined) {
        i[d.cheekSquintLeft] = apply(
            expression.cheekSquintLeft,
            calibration?.cheekSquintLeft
        );
        }

        if (d.cheekSquintRight !== undefined) {
        i[d.cheekSquintRight] = apply(
            expression.cheekSquintRight,
            calibration?.cheekSquintRight
        );
        }

    });
  }, [scene, expression, calibration]);

  return <primitive object={scene} position={[0, -1.5, 0]} />;
}

function delta(value, base) {
  if (value == null || base == null) return 0;
  return value - base;
}

function apply(value, base, gain = 1, offset = 0) {
  if (value == null) return 0;
  const d = value - (base ?? value);
  const v = d * gain + offset;
  return Math.min(Math.max(v, 0), 1);
}