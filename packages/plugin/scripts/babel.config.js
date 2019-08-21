const presets = [
  [
    "@babel/env",
    {
      targets: {
        node: true
      },
      useBuiltIns: "usage"
    }
  ]
];

const plugins = ["@babel/plugin-proposal-class-properties"];

module.exports = { presets, plugins };
