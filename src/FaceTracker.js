import { FaceMesh } from "@mediapipe/face_mesh";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { useEffect, useRef } from "react";
import { extractExpression } from "./extractExpression";
import { extractPose } from "./extractPose";

export default function FaceTracker({ onUpdate }) {
  const videoRef = useRef();

  useEffect(() => {
    /* ========= FaceMesh ========= */
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];
      const expression = extractExpression(landmarks);

      onUpdate((prev) => ({
        ...prev,
        ...expression,
      }));
    });

    /* ========= Pose ========= */
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!results.poseLandmarks) return;

      const poseData = extractPose(results.poseLandmarks);

      onUpdate((prev) => ({
        ...prev,
        ...poseData,
      }));
    });

    /* ========= Camera ========= */
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        const image = videoRef.current;
        await faceMesh.send({ image });
        await pose.send({ image });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, [onUpdate]);

  return (
    <video
      ref={videoRef}
      style={{ display: "none" }}
      autoPlay
      playsInline
    />
  );
}
