const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const getPosterImageUrl = function (idea, googleMapsApiKey){
      return idea.imageUrl ? idea.imageUrl : idea.location && idea.location && idea.location.coordinates ? 'https://maps.googleapis.com/maps/api/streetview?'+
                           'size=800x600&'+
                           `location=${idea.location.coordinates[0]},${idea.location.coordinates[1]}&`+
                           'heading=151.78&pitch=-0.76&key=' + googleMapsApiKey
                         : null;

}

const enrichIdeas = (ideas, googleMapsApiKey) => {
  return ideas.map((idea) => {
    if (idea.location && idea.location.trim) {
      var newLocation = idea.location.trim().replace('POINT(', '').replace(')', '').split(' ');

      idea.location = newLocation[0] && newLocation[1] ? {
        lat : parseFloat( newLocation[0] ),
        lng : parseFloat( newLocation[1] )
      } : false;
    }

    idea.posterImageUrl = getPosterImageUrl(idea, googleMapsApiKey)
    return idea;
  });
};

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Ideas map',
  addFields: [
  ],
};
