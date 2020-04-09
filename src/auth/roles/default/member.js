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
		
		'article:view'     : true,
		'article:create'	 : true,
		'article:edit'		 : {
      allow: helpers.mayMutateArticle,
			resource : ['article'],
			message  : 'Je kunt dit artikel niet bewerken'
    },
		'article:delete'	 : {
      allow: helpers.mayMutateArticle,
			resource : ['article'],
			message  : 'Je kunt dit artikel niet verijderen'
    },

		'argument:view'    : true,
		'argument:create'	 : true,
		'argument:edit'		 : {
			allow    : helpers.mayMutateArgument,
			resource : ['argument', 'idea'],
			message  : 'Je kunt deze reactie niet bewerken'
		},
		'argument:delete'	 : {
			allow    : helpers.mayMutateArgument,
			resource : ['argument', 'idea'],
			message  : 'Je kunt deze reactie niet bewerken'
		},
		'argument:vote'    : {
			allow   : helpers.mayVoteArgument,
			message : 'Je kunt niet op reacties stemmen'
		},

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

