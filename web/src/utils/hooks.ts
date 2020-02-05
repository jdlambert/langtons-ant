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