// 状態データの型定義
export class HUDState {
    roll: number;
    pitch: number;
    airspeed: number;
    altitude: number;
}

export function renderHUD(ctx: CanvasRenderingContext2D, state: HUDState) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 画面のクリア
    ctx.clearRect(0, 0, width, height);

    // グリーンスタイル
    ctx.strokeStyle = '#00ff00';
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.lineWidth = 2;

    // 1. 中央ボアサイト（固定マーク）
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY); ctx.lineTo(centerX - 5, centerY);
    ctx.lineTo(centerX, centerY + 5);
    ctx.lineTo(centerX + 5, centerY);  ctx.lineTo(centerX + 20, centerY);
    ctx.stroke();

    // 2. 姿勢連動レイヤー（ピッチラダー）
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-state.roll * Math.PI / 180);

    const pixelsPerDegree = 4;
    for (let i = -90; i <= 90; i += 5) {
        const y = (state.pitch - i) * pixelsPerDegree;
        if (Math.abs(y) > height / 2 - 50) continue;

        if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(-80, y); ctx.lineTo(-20, y);
            ctx.moveTo(20, y);  ctx.lineTo(80, y);
            ctx.stroke();
        } else if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(-50, y); ctx.lineTo(-15, y); ctx.lineTo(-15, y + 8);
            ctx.moveTo(50, y);  ctx.lineTo(15, y);  ctx.lineTo(15, y + 8);
            ctx.stroke();
            ctx.fillText(`${i}`, -70, y + 4);
            ctx.fillText(`${i}`, 55, y + 4);
        } else {
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(-50, y); ctx.lineTo(-15, y); ctx.lineTo(-15, y - 8);
            ctx.moveTo(50, y);  ctx.lineTo(15, y);  ctx.lineTo(15, y - 8);
            ctx.stroke();
            ctx.restore();
            ctx.fillText(`${i}`, -70, y + 4);
            ctx.fillText(`${i}`, 55, y + 4);
        }
    }
    ctx.restore();

    // 3. 速度メーターテープ（左側固定）
    ctx.save();
    ctx.beginPath(); ctx.rect(30, 80, 60, 340); ctx.clip();
    for (let v = Math.floor((state.airspeed - 150) / 10) * 10; v <= state.airspeed + 150; v += 10) {
        if (v < 0) continue;
        const y = centerY + (state.airspeed - v) * 1.5;
        ctx.beginPath();
        if (v % 50 === 0) {
            ctx.moveTo(70, y); ctx.lineTo(85, y);
            ctx.fillText(`${v}`, 35, y + 4);
        } else {
            ctx.moveTo(75, y); ctx.lineTo(85, y);
        }
        ctx.stroke();
    }
    ctx.restore();
    ctx.strokeRect(30, centerY - 15, 60, 30); // 現在値の窓

    // 4. 高度メーターテープ（右側固定）
    ctx.save();
    ctx.beginPath(); ctx.rect(width - 90, 80, 60, 340); ctx.clip();
    for (let a = Math.floor((state.altitude - 1500) / 100) * 100; a <= state.altitude + 1500; a += 100) {
        if (a < 0) continue;
        const y = centerY + (state.altitude - a) * 0.15;
        ctx.beginPath();
        if (a % 500 === 0) {
            ctx.moveTo(width - 85, y); ctx.lineTo(width - 70, y);
            ctx.fillText(`${a}`, width - 65, y + 4);
        } else {
            ctx.moveTo(width - 85, y); ctx.lineTo(width - 75, y);
        }
        ctx.stroke();
    }
    ctx.restore();
    ctx.strokeRect(width - 90, centerY - 15, 60, 30); // 現在値の窓
}