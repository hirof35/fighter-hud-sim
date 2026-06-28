import './style.css';
import { renderHUD, HUDState } from './hud';

const canvas = document.getElementById('hudCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// スライダー要素の取得
const rollInput = document.getElementById('roll') as HTMLInputElement;
const pitchInput = document.getElementById('pitch') as HTMLInputElement;
const speedInput = document.getElementById('speed') as HTMLInputElement;
const altInput = document.getElementById('alt') as HTMLInputElement;

// 数値表示用ラベル要素の取得
const rollVal = document.getElementById('rollVal')!;
const pitchVal = document.getElementById('pitchVal')!;
const speedVal = document.getElementById('speedVal')!;
const altVal = document.getElementById('altVal')!;

// 現在の状態（初期値）
const state: HUDState = {
    roll: 0,
    pitch: 0,
    airspeed: 400,
    altitude: 5000
};

// 更新イベント関数
function update() {
    state.roll = parseFloat(rollInput.value);
    state.pitch = parseFloat(pitchInput.value);
    state.airspeed = parseFloat(speedInput.value);
    state.altitude = parseFloat(altInput.value);

    // テキスト表示を更新
    rollVal.textContent = rollInput.value;
    pitchVal.textContent = pitchInput.value;
    speedVal.textContent = speedInput.value;
    altVal.textContent = altInput.value;

    // HUDの再描画
    renderHUD(ctx, state);
}

// すべてのスライダーにイベントリスナーを登録
[rollInput, pitchInput, speedInput, altInput].forEach(input => {
    input.addEventListener('input', update);
});

// 初回描画
update();