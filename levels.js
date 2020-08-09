import { Fence } from './fence.js';

export function buildLevel(game, level) {
  let fences = [];
  level.forEach((row, rowIndex) => {
    row.forEach((fence, fenceIndex) => {
      if (fence === 1) {
        let position = {
          x: 100 * fenceIndex,
          y: 50 * rowIndex,
        };
        fences.push(new Fence(game, position));
      }
    });
  });

  return fences;
}

export const level1 = [
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [0, 1, 1, 0, 0, 1, 1, 0],
];
