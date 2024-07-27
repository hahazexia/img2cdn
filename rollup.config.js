const babel = require('@rollup/plugin-babel').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

module.exports = {
  input: './extension.js', // 插件的入口文件
  output: {
    dir: 'dist', // 输出目录
    format: 'cjs', // 输出格式为 CommonJS
    entryFileNames: 'extension.js' // 入口文件的输出名称
  },
  plugins: [
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 转换 CommonJS 模块
    json(), // 支持导入 JSON 文件
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              esmodules: false, // 编译成 ES5
            },
          },
        ],
      ],
    }),
  ],
};