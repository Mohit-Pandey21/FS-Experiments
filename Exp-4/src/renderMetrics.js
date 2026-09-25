let counts = {};
const listeners = new Set();

export function recordRender(id) {
  counts = {
    ...counts,
    [id]: (counts[id] || 0) + 1
  };
  listeners.forEach((listener) => listener());
}

export function resetRenderCounts() {
  counts = {};
  listeners.forEach((listener) => listener());
}

export function getRenderCounts() {
  return counts;
}

export function subscribeToRenderCounts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
