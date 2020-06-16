const cache_lifespan  = 15*60;   // set lifespan of 15 minutes;
const url             = require('url');

module.exports = (self, options) => {

  self.addRankingToIdeas = function (req) {
    let counter = 1;
    req.data.ideas =  req.data.ideas ? req.data.ideas
      .sort((ideaA, ideaB) => {
        return ideaB.yes - ideaA.yes;
      })
      .map((idea) => {
        idea.ranking = counter;
        idea.extraData.ranking = counter;
        counter++;
        return idea;
      }) : [];
  }

  /**
   * Determine if there is an active idea based upon the url query ?=ideaId of params /:ideaId
   */
  self.setActiveIdeaId = function (req) {
    const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
    if (ideaId) {
      if (!req.data.idea) {
        req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
      }
      req.data.ideaId = ideaId;
    }


  };
};
