# Create React App + WebAssembly (Rust)

[Langton's Ant](https://en.wikipedia.org/wiki/Langton%27s_ant) in a web app

## Usage

### `yarn start`

Start dev server then watch `.rs` and `.ts` and rebuild if files are changed.

### `yarn test`

Run `wasm-pack test --firefox --headless` and `react-scripts test`.

### `yarn build`

Compile `.rs` to `.wasm` using `wasm-pack` then build React app using `create-react-app`.