const {name} = require('./package');
const fs = require('fs').promises;
const postcss = require('postcss');

const prefersReducedMotionValues = [
  'no-preference',
  'reduce'
];

function matchTargetProperty (atRule, value) {
  const regExp = new RegExp('prefers-reduced-motion:\\s?' + value, 'g');

  return atRule.params.match(regExp);
}

function containsConditionalGroupRules (rule) {
  return ['media', 'supports', 'document'].includes(rule.name);
}

function isParentTypeRoot (rule) {
  return !!(rule.parent && rule.parent.type === 'root');
}

function hasNodes (rule) {
  return !!(rule.nodes && rule.nodes.length > 0);
}

async function writeFilePromise (filePath, data) {
  let fileHandle = null;

  try {
    fileHandle = await fs.writeFile(filePath, data);
  } finally {

  }
}

module.exports = postcss.plugin(name, function (opts) {
  const {value, exportTo} = opts || {};

  return function (root, result) {
    if (!prefersReducedMotionValues.indexOf(value)) {
      result.warn('invalid prefer-reduced-motion value.');
    }
    if (!exportTo) {
      result.warn('must set "exportTo" option.');
    }
    const valuesToKeep = prefersReducedMotionValues.filter((v) => {
      return v !== value;
    });

    /**
     * export file
     */
    const exportFileRoot = root.clone();
    exportFileRoot.walkRules((exportRule, i) => {
      if (isParentTypeRoot(exportRule)) {
        exportRule.remove();
        exportRule.removeAll();
      }
    });
    exportFileRoot.walkAtRules(exportAtRule => {
      if (valuesToKeep) {
        valuesToKeep.forEach((v) => {
          if (matchTargetProperty(exportAtRule, v)) {
            exportAtRule.remove();
            exportAtRule.removeAll();
          }
        });
      }
      if (matchTargetProperty(exportAtRule, value) && hasNodes(exportAtRule)) {
        exportAtRule.after(exportAtRule.nodes);
        exportAtRule.remove();
        exportAtRule.removeAll();
      } else {
        if (hasNodes(exportAtRule) && !containsConditionalGroupRules(exportAtRule)) {
          exportAtRule.remove();
          exportAtRule.removeAll();
        }
      }
    });
    writeFilePromise(exportTo, exportFileRoot).catch(console.error);

    /**
     * output file
     */
    root.walkAtRules(atRule => {
      if (matchTargetProperty(atRule, value)) {
        atRule.remove();
        atRule.removeAll();
      }
    });
  };
});
