module.exports = function( helpers, role ) {
	role.action({
		'account:register' : {
			allow   : helpers.needsToCompleteRegistration,
			message : 'Registreren is onnodig als je bent ingelogd'
		},
		
		'idea:view'        : true,
		'idea:create'      : true,
		'idea:edit'        : helpers.mayMutateIdea,
		'idea:delete'      : helpers.mayMutateIdea,

		'argument:view'    : true,
		'argument:create'	 : true,
		'argument:edit'		 : helpers.mayMutateArgument,
		'argument:delete'	 : helpers.mayMutateArgument,

		'ideavote:create'	 : true,

		'image:upload'     : true,
		
		'arg:add'          : helpers.mayAddArgument,
		'arg:vote'         : {
			allow   : helpers.mayVoteArgument,
			message : 'Je kunt niet op reacties stemmen'
		},
		'arg:edit'         : helpers.mayMutateArgument,
		'arg:reply'        : helpers.mayReplyToArgument,
		'arg:delete'       : helpers.mayMutateArgument
	});
};

