exports.options = [
  {
    value: 'createdtime,desc',
  //  label: 'Newest first',
    label: 'Nieuwste eerst'
  },
  {
    value: 'createdtime,asc',
//    label: 'Oldest first',
    label: 'Oudste eerst'
  },
  {
    value: 'random',
//    label: 'Random',
    label: 'Willekeurig'
  },
  {
    value: 'likes,desc',
    //label: 'Most liked',
    label: 'Meeste likes'
  },
  {
    value: 'likes,asc',
  //  label: 'Least liked',
    label: 'Minste likes'
  },
  {
    value: 'ranking,asc',
    label: 'Ranglijst'
  },
  {
    value: 'budget,desc',
//    label: 'Highest amount',
    label: 'Hoogste bedrag'
  },
  {
    value: 'budget,asc',
//    label: 'Lowest amount',
    label: 'Laagste bedrag'
  },
];


//new resource-overview-widget dont using sorting on the client, but via the api
//above client options will be phased out
exports.apiOptions = [
  {
    value: 'createdate_desc',
  //  label: 'Newest first',
    label: 'Nieuwste eerst'
  },
  {
    value: 'createdate_asc',
//    label: 'Oldest first',
    label: 'Oudste eerst'
  },
  {
    value: 'random',
//    label: 'Random',
    label: 'Willekeurig'
  },
  {
    value: 'votes_desc',
    //label: 'Most liked',
    label: 'Meeste likes'
  },
  {
    value: 'votes_asc',
  //  label: 'Least liked',
    label: 'Minste likes'
  },
/*  {
    value: 'ranking,asc',
    label: 'Ranglijst'
  },*/
  {
    value: 'budget_desc',
//    label: 'Highest amount',
    label: 'Hoogste bedrag'
  },
  {
    value: 'budget_asc',
//    label: 'Lowest amount',
    label: 'Laagste bedrag'
  },
];

exports.ideasOnMapOptions = [
  {
    value: 'createdtime,desc',
    label: 'Nieuwste eerst'
  },
  {
    value: 'createdtime,asc',
    label: 'Oudste eerst'
  },
  {
    value: 'title',
    label: 'Titel'
  },
  {
    value: 'random',
    label: 'Willekeurig'
  },
  {
    value: 'likes,desc',
    label: 'Meeste likes'
  },
  {
    value: 'likes,asc',
    label: 'Minste likes'
  },
  {
    value: 'args,desc',
    label: 'Meeste reacties'
  },
  {
    value: 'args,asc',
    label: 'Minste reacties'
  },
  {
    value: 'ranking,asc',
    label: 'Ranglijst'
  },
];
