module.exports = function( helpers, role ) {
	role.action({
		'idea:vote': {
			allow: helpers.mayVoteIdea
		}
	});
};
