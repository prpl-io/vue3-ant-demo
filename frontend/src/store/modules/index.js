import camelCase from 'lodash/camelCase';

const modulesCache = {};
const storeData = { modules: {} };

(function updateModules() {
    const requireModule = require.context(
        '.',
        true,
        /^((?!index|\.unit\.).)*\.js$/
    );

    requireModule.keys().forEach(fileName => {
        const moduleDefinition = requireModule(fileName);

        if (modulesCache[fileName] === moduleDefinition) {
            return;
        }

        modulesCache[fileName] = moduleDefinition;

        const modulePath = fileName
            .replace(/^\.\//, '')
            .replace(/\.\w+$/, '')
            .split(/\//)
            .map(camelCase);

        const { modules } = getNamespace(storeData, modulePath);

        modules[modulePath.pop()] = {
            namespaced: true,
            ...moduleDefinition
        };
    });

    if (module.hot) {
        module.hot.accept(requireModule.id, () => {
            updateModules();
            require('../').default.hotUpdate({
                modules: storeData.modules
            });
        });
    }
})();

function getNamespace(subtree, path) {
    if (path.length === 1) {
        return subtree;
    }

    const namespace = path.shift();
    subtree.modules[namespace] = {
        modules: {},
        namespaced: true,
        ...subtree.modules[namespace]
    };

    return getNamespace(subtree.modules[namespace], path);
}

export default storeData.modules;
