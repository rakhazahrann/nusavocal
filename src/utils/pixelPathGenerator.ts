// src/utils/pixelPathGenerator.ts

/**
 * Menghasilkan path SVG yang kotak-kotak (Pixelated) namun mengikuti kurva mulus (S-curve).
 * Ini akan mengembalikan string "M x y L x y..." yang membentuk tangga-tangga kecil
 * sehingga tampak seperti jalan berbelok yang natural, namun tetap berkesan pixel art.
 */
export const generatePixelPath = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  pixelSize: number = 4
): string => {
  // 1. Tentukan control points untuk kurva Bezier (S-Curve)
  // Karena map biasanya vertikal (atas ke bawah atau bawah ke atas),
  // kita buat kurvanya melengkung lebih halus secara vertikal.
  const midY = (y0 + y1) / 2;
  const cp1x = x0;
  const cp1y = midY;
  const cp2x = x1;
  const cp2y = midY;

  // Fungsi untuk mendapatkan titik pada kurva bezier (t = 0 sampai 1)
  const getBezierPoint = (t: number) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let x = uuu * x0; // (1-t)^3 * P0
    x += 3 * uu * t * cp1x; // 3(1-t)^2 * t * P1
    x += 3 * u * tt * cp2x; // 3(1-t) * t^2 * P2
    x += ttt * x1; // t^3 * P3

    let y = uuu * y0;
    y += 3 * uu * t * cp1y;
    y += 3 * u * tt * cp2y;
    y += ttt * y1;

    return { x, y };
  };

  // 2. Tentukan jumlah langkah (sampling) berdasarkan estimasi jarak
  const distance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  // Sampling yang rapat agar kita tidak melewatkan pixel
  const steps = Math.ceil(distance * 2); 

  let path = "";
  let prevSnapX = -1;
  let prevSnapY = -1;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt = getBezierPoint(t);
    
    // 3. Grid Snap: Bulatkan koordinat titik kurva ke kelipatan pixelSize terdekat
    const snapX = Math.round(pt.x / pixelSize) * pixelSize;
    const snapY = Math.round(pt.y / pixelSize) * pixelSize;

    if (i === 0) {
      path += `M ${snapX} ${snapY} `;
      prevSnapX = snapX;
      prevSnapY = snapY;
    } else {
      // 4. Jika titik snap berpindah, buat langkah garis kotak (staircase)
      if (snapX !== prevSnapX || snapY !== prevSnapY) {
         // Agar pinggiran piksel lebih terasa, belokan tidak dibuat miring (diagonal),
         // melainkan gerak L tegak lurus (horizontal lalu vertikal)
         if (snapX !== prevSnapX && snapY !== prevSnapY) {
             path += `L ${snapX} ${prevSnapY} `; 
         }
         path += `L ${snapX} ${snapY} `;
         prevSnapX = snapX;
         prevSnapY = snapY;
      }
    }
  }

  return path;
};