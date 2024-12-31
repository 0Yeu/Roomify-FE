/* eslint-disable import/prefer-default-export */
// @ts-ignore
export const transformOrigin = ({ x, y }, ...transformations) => {
  'worklet';

  return [
    { translateX: x },
    { translateY: y },
    ...transformations,
    { translateX: x * -1 },
    { translateY: y * -1 },
  ];
};
