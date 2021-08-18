exports.settings = {
  listItemIndent: 1,
  emphasis: '_',
  strong: '_',
  bullet: '*',
  incrementListMarker: false
};

exports.plugins = [
  'remark-preset-lint-travi',
  ['remark-toc', {tight: true}],
  ['remark-usage', {heading: 'example'}]
];
