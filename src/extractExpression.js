export function extractExpression(landmarks) {
  // ===== Mouth =====
  const mouthLeft = landmarks[61];
  const mouthRight = landmarks[291];
  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];

  // ===== Brows =====
  const browLeft = landmarks[70];
  const browRight = landmarks[300];
  const browInnerLeft = landmarks[105];
  const browInnerRight = landmarks[334];
  const eyeLeftTop = landmarks[159];
  const eyeRightTop = landmarks[386];

  // ===== Eyes =====
  const eyeLeftBottom = landmarks[145];
  const eyeRightBottom = landmarks[374];

  // ===== Cheek =====
  const cheekLeft = landmarks[205];
  const cheekRight = landmarks[425];

  // ===== Head =====
  const nose = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  const headYaw = clamp((nose.x - eyeCenterX) * 4, -1, 1);
  const headPitch = clamp((nose.y - eyeCenterY) * 3, -1, 1);

  // ===== 基本距離 =====
  const mouthOpen = distance(mouthTop, mouthBottom);

  const mouthSmileLeft = mouthTop.y - mouthLeft.y;
  const mouthSmileRight = mouthTop.y - mouthRight.y;

  const mouthFrownLeft = mouthLeft.y - mouthTop.y;
  const mouthFrownRight = mouthRight.y - mouthTop.y;

  const browOuterUpLeft = eyeLeftTop.y - browLeft.y;
  const browOuterUpRight = eyeRightTop.y - browRight.y;

  const browInnerUp =
    ((eyeLeftTop.y - browInnerLeft.y) +
      (eyeRightTop.y - browInnerRight.y)) /
    2;

  const browDownLeft = browLeft.y - eyeLeftTop.y;
  const browDownRight = browRight.y - eyeRightTop.y;

  const eyeLeftOpen = distance(eyeLeftTop, eyeLeftBottom);
  const eyeRightOpen = distance(eyeRightTop, eyeRightBottom);

  const cheekPuff = distance(cheekLeft, cheekRight);

  return {
    // mouth
    mouthOpen: clamp(mouthOpen * 20, 0, 1),
    mouthSmileLeft: clamp(mouthSmileLeft * 40, 0, 1),
    mouthSmileRight: clamp(mouthSmileRight * 40, 0, 1),
    mouthFrownLeft: clamp(mouthFrownLeft * 40, 0, 1),
    mouthFrownRight: clamp(mouthFrownRight * 40, 0, 1),

    // brow
    browOuterUpLeft: clamp(browOuterUpLeft * 5, 0, 1),
    browOuterUpRight: clamp(browOuterUpRight * 5, 0, 1),
    browInnerUp: clamp(browInnerUp * 5, 0, 1),
    browDownLeft: clamp(browDownLeft * 5, 0, 1),
    browDownRight: clamp(browDownRight * 5, 0, 1),

    // eyes
    eyeOpenLeft: clamp(eyeLeftOpen * 5, 0, 1),
    eyeOpenRight: clamp(eyeRightOpen * 5, 0, 1),
    eyeWideLeft: clamp(eyeLeftOpen * 5, 0, 1),
    eyeWideRight: clamp(eyeRightOpen * 5, 0, 1),
    eyeSquintLeft: clamp(1 - eyeLeftOpen * 5, 0, 1),
    eyeSquintRight: clamp(1 - eyeRightOpen * 5, 0, 1),

    // cheek
    cheekPuff: clamp((cheekPuff - 0.08) * 5, 0, 1),
    cheekSquintLeft: clamp(mouthSmileLeft * 20, 0, 1),
    cheekSquintRight: clamp(mouthSmileRight * 20, 0, 1),

    // head
    headYaw,
    headPitch,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
