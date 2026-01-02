import { useEffect, useState, useRef } from "react";
import FaceTracker from "./FaceTracker";
import Avatar from "./Avatar";
import { Canvas } from "@react-three/fiber";
import "./App.css";

function App() {
  const [step, setStep] = useState("title");
  const [expression, setExpression] = useState({});
  const [calibration, setCalibration] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const expressionRef = useRef({});

  useEffect(() => {
    if (step !== "calibrating") return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const timer = setTimeout(() => {
      // ★ ここで「3秒後の最新表情・姿勢」を確実に取得
      setCalibration(expressionRef.current);
      console.log("🎯 calibrated:", expressionRef.current);
      setStep("calibrated");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "calibrated") return;

    const timer = setTimeout(() => {
      setStep("avatar");
    }, 1000); // 1秒表示

    return () => clearTimeout(timer);
  }, [step]);

  // expression が更新されるたびに ref に保存
  useEffect(() => {
    expressionRef.current = expression;
  }, [expression]);

  return (
    <div className="app-root">
      <FaceTracker onUpdate={setExpression} />

      {/* ===== タイトル画面 ===== */}
      {step === "title" && (
        <div className="overlay">
          <h1 className="title">真似っこアバター</h1>
          <p>本アプリは、表情・姿勢推定のためにカメラを使用します。<br />
             映像データは端末内でのみ処理され、外部へ送信・保存されることはありません。
          </p>
          <button
            className="primary-btn"
            onClick={() => setStep("avatarSelect")}
          >
            アバターを作成して遊ぶ
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              setAvatarUrl(
                "https://models.readyplayer.me/690d9cf7d9d72e80a596583d.glb?morphTargets=ARKit"
              );
              setStep("prepareCalibration");
            }}
          >
            デフォルトのアバターで遊ぶ
          </button>

        </div>
      )}

      {/* ===== アバター読み込み画面 ===== */}
      {step === "avatarSelect" && (
        <div className="overlay">
          <h2>アバター読み込み</h2>

          <p>
            <a
              href="https://readyplayer.me/avatar"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2f00ffff", textDecoration: "underline" }}
            >
              Ready Player Me
            </a>
            でアバターを作成し、そのURLをペーストしてください
          </p>

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://models.readyplayer.me/xxxx.glb"
            style={{
              width: "60%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <button
            className="primary-btn"
            onClick={() => {
              if (!inputUrl) return;

              const url =
                inputUrl.includes("?")
                  ? inputUrl + "&morphTargets=ARKit"
                  : inputUrl + "?morphTargets=ARKit";

              setAvatarUrl(url);
              setStep("prepareCalibration");
            }}
          >
            決定
          </button>
            <button className="secondary-btn" onClick={() => setStep("title")}>
              タイトルにもどる
            </button>
        </div>
      )}


      {/* ===== キャリブレーション準備 ===== */}
      {step === "prepareCalibration" && (
        <div className="overlay">
          <h2>表情・姿勢のキャリブレーション</h2>
          <p>腕を下ろし体を正面に向け、自然な表情で画面を見てください<br />（ボタンを押してから3秒後にキャリブレーションを行います）</p>
          <button className="primary-btn" onClick={() => setStep("calibrating")}>
            キャリブレーションを開始する
          </button>
          <button className="secondary-btn" onClick={() => setStep("title")}>
             タイトルにもどる
          </button>
        </div>
      )}

      {/* ===== キャリブレーション中 ===== */}
      {step === "calibrating" && (
        <div className="overlay">
          <h2>キャリブレーションまで</h2>
          <div className="countdown">{countdown}</div>
        </div>
      )}


      {/* ===== キャリブレーション完了 ===== */}
      {step === "calibrated" && (
        <div className="overlay">
          <h2>キャリブレーション完了</h2>
        </div>
      )}

      {/* ===== アバター画面 ===== */}
      {step === "avatar" && (
        <Canvas camera={{ position: [0, 0, 20], fov: 2.5 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 2, 2]} intensity={1.2} />
          <Avatar
            avatarUrl={avatarUrl}
            expression={expression}
            calibration={calibration}
          />
        </Canvas>
      )}
    </div>
  );
}

export default App;
