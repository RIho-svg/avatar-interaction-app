export function extractPose(poseLandmarks) {
//   console.log("🟢 poseLandmarks:", poseLandmarks);

  const leftShoulder = poseLandmarks[11];
  const leftElbow = poseLandmarks[13];
  const rightShoulder = poseLandmarks[12];
  const rightElbow = poseLandmarks[14];

//   console.log("🟡 LeftShoulder y:", leftShoulder?.y);
//   console.log("🟡 LeftElbow y:", leftElbow?.y);

  const leftAngle = shoulderAngle(leftShoulder, leftElbow);
  const rightAngle = shoulderAngle(rightShoulder, rightElbow);

const torsoYaw =
  clamp(
    (rightShoulder.z - leftShoulder.z) * 2,
    -0.5,
    0.5
  );


  const leftWrist = poseLandmarks[15];
  const rightWrist = poseLandmarks[16];

  const leftElbowAngle = elbowAngle(
    leftShoulder,
    leftElbow,
    leftWrist
  );

  const rightElbowAngle = elbowAngle(
    rightShoulder,
    rightElbow,
    rightWrist
  );


//   console.log("🔵 leftAngle:", leftAngle, "rightAngle:", rightAngle);

return {
  leftShoulderPitch: clamp(leftAngle * 1.5, -0.5, 0.5),
  rightShoulderPitch: clamp(rightAngle * 1.5, -0.5, 0.5),
  torsoYaw,
  leftElbowFlex: clamp((Math.PI - leftElbowAngle), 0, 1),
  rightElbowFlex: clamp((Math.PI - rightElbowAngle), 0, 1),
};
}

function shoulderAngle(shoulder, elbow) {
  // 上下方向の角度（y差）
  return shoulder.y - elbow.y;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function elbowAngle(shoulder, elbow, wrist) {
  if (!shoulder || !elbow || !wrist) return 0;

  const v1 = {
    x: shoulder.x - elbow.x,
    y: shoulder.y - elbow.y,
  };

  const v2 = {
    x: wrist.x - elbow.x,
    y: wrist.y - elbow.y,
  };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);

  return Math.acos(dot / (mag1 * mag2)); // 0〜π
}
