export const ANGLE_TICKS = [-120, -90, -60, -30, 0, 30, 60, 90, 120];

export function getSpeedTicks(scale: number): number[] {
  if (scale === 100) return [0, 1, 5, 10, 25, 50, 75, 90, 100];
  if (scale === 500) return [0, 5, 10, 50, 100, 250, 350, 450, 500];
  return [0, 5, 10, 50, 100, 250, 500, 750, 1000];
}

export function getSpeedAngle(speed: number, ticks: number[]): number {
  if (speed <= 0) return ANGLE_TICKS[0];
  if (speed >= ticks[ticks.length - 1]) return ANGLE_TICKS[ANGLE_TICKS.length - 1];

  for (let i = 0; i < ticks.length - 1; i++) {
    if (speed >= ticks[i] && speed <= ticks[i + 1]) {
      const range = ticks[i + 1] - ticks[i];
      const progress = (speed - ticks[i]) / range;
      const angleRange = ANGLE_TICKS[i + 1] - ANGLE_TICKS[i];
      return ANGLE_TICKS[i] + progress * angleRange;
    }
  }
  return ANGLE_TICKS[0];
}
