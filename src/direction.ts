import { range, zipObj } from "ramda";

export const directionsJa = [
  "北",
  "北北東",
  "北東",
  "東北東",
  "東",
  "東南東",
  "南東",
  "南南東",
  "南",
  "南南西",
  "南西",
  "西南西",
  "西",
  "西北西",
  "北西",
  "北北西",
] as const;

export type Dir = typeof directionsJa[number];

const angleRange = 22.5; // 360 / dirs.length (=16)
const dirMap = zipObj(directionsJa, range(0, directionsJa.length)) as {
  [dir in Dir]: number;
};

export const dirAngle = (dir: string) => {
  const index = dirMap[dir as Dir];
  return index ? index * angleRange : null;
};
