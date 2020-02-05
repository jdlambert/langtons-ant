import React from 'react';

export function useCrate() {
  const [wasm, setWasm] = React.useState();

  React.useEffect(() => {
    (async () => {
      const mod = await import('../crate');
      setWasm(mod);
    })();
  }, []);

  return wasm;
}

// Like useEffect, but doesn't fire if any of the dependencies is falsey
// Reminder: that's `undefined`, `null`, `NaN`, `0`, `""` and, of course, `false`
export function useTakeEffect(
  fn: () => void | (() => void),
  deps: React.DependencyList,
) {
  React.useEffect(() => {
    if (deps.some((d) => !d)) return;
    const destructor = fn();
    return () => {
      destructor && destructor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}