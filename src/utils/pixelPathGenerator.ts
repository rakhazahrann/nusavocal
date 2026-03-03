// src/utils/pixelPathGenerator.ts

/**
 * Menggunakan Algoritma Bresenham untuk menghasilkan path SVG yang kotak-kotak (Pixelated).
 * Ini akan mengembalikan string "M x y L x y..." yang membentuk tangga-tangga kecil.
 */
export const generatePixelPath = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  pixelSize: number = 4 // Semakin besar, semakin "kelihatan" kotak-kotaknya
): string => {
  // 1. Grid Snap: Bulatkan koordinat ke kelipatan pixelSize terdekat
  let x = Math.round(x0 / pixelSize);
  let y = Math.round(y0 / pixelSize);
  const endX = Math.round(x1 / pixelSize);
  const endY = Math.round(y1 / pixelSize);

  // 2. Hitung jarak (Delta)
  const dx = Math.abs(endX - x);
  const dy = Math.abs(endY - y);
  
  // 3. Tentukan arah langkah (1 atau -1)
  const sx = x < endX ? 1 : -1;
  const sy = y < endY ? 1 : -1;
  
  // 4. Inisialisasi Error (untuk menentukan kapan harus belok)
  let err = dx - dy;

  let path = `M ${x * pixelSize} ${y * pixelSize} `;

  while (true) {
    // Tambahkan titik saat ini ke path
    // Kita gunakan "L" (Line) ke koordinat pixel asli
    path += `L ${x * pixelSize} ${y * pixelSize} `;

    if (x === endX && y === endY) break;

    const e2 = 2 * err;
    
    // Gerakan Horizontal
    if (e2 > -dy) {
      err -= dy;
      x += sx;
      // Opsional: Tambah titik sudut siku-siku biar lebih kotak
      path += `L ${x * pixelSize} ${y * pixelSize} `; 
    }
    
    // Gerakan Vertikal
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return path;
};