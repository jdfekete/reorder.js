export function range(start, stop, step = 1) {
  if (arguments.length < 2) {
    stop = start;
    start = 0;
  }
  const range = [];
  let i = start;
  if (step < 0) {
    for (; i > stop; i += step) {
      range.push(i);
    }
  } else {
    for (; i < stop; i += step) {
      range.push(i);
    }
  }
  return range;
}
