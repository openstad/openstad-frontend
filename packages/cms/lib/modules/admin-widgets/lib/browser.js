module.exports = (self, options) => {
    self.pushAssets = () => {
        self.pushAsset('stylesheet', 'main', { when: 'always' });
    };
};
