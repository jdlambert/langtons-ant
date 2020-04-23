# Create React App + WebAssembly (Rust)

[Langton's Ant](https://en.wikipedia.org/wiki/Langton%27s_ant) in a web app

## Usage

### `yarn start`

Starts dev server then watch `.rs` and `.ts` and rebuild if files are changed.

### `yarn test`

Runs `wasm-pack test --firefox --headless` and `react-scripts test`.

### `yarn build`

Compiles `.rs` to `.wasm` using `wasm-pack`, then builds React app using `create-react-app`.