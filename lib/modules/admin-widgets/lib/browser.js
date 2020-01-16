module.exports = (self, options) => {
    const superPushAssets = self.pushAssets;

    self.pushAssets = () => {
        superPushAssets();
        self.pushAsset('stylesheet', 'main', { when: 'always' });
    };
};
