const babel = require('@rollup/plugin-babel').default;

module.exports = {
  input: './extension.js', // 插件的入口文件
  output: {
    file: 'dist/extension.js', // 输出的 ES5 JS 文件
    format: 'cjs', // 输出格式为 CommonJS
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 不编译 node_modules 中的文件
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