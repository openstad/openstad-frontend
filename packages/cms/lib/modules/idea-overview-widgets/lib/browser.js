module.exports = (self, options) => {
    const superPushAssets = self.pushAssets;

    self.pushAssets = () => {
        superPushAssets();
        self.pushAsset('stylesheet', 'main', { when: 'always' });
        self.pushAsset('stylesheet', 'tile', { when: 'always' });
        self.pushAsset('stylesheet', 'grid', { when: 'always' });
        self.pushAsset('stylesheet', 'vote-creator', { when: 'always' });
        self.pushAsset('stylesheet', 'gridder', { when: 'always' });
        self.pushAsset('stylesheet', 'nr-of-votes', { when: 'always' });
        self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
        self.pushAsset('script', 'tabs', { when: 'always' });
      //  self.pushAsset('script', 'fotorama', { when: 'always' });
        self.pushAsset('script', 'vote', { when: 'always' });
        self.pushAsset('script', 'main', { when: 'always' });
    };
};
