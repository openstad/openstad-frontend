module.exports = function( helpers, role ) {
	role.action({
		'account:register' : {
			allow   : helpers.needsToCompleteRegistration,
			message : 'Registreren is onnodig als je bent ingelogd'
		},
		'index:view'       : true,
		'ideas:admin'      : true,
		'idea:admin'      : true,
		'idea:view'        : true,
		'idea:create'      : true,
		'idea:edit'        : true,
		'idea:delete'      : true,
		'argument:view'    : true,
		'argument:create'	 : true,
		'argument:edit'		 : true,
		'argument:delete'	 : true,
		'argument:vote'    : true,
		'ideavote:create'	 : true,
		'image:upload'     : true,
		'arg:add'          : true,
		'arg:vote'         : true,
		'arg:edit'         : true,
		'arg:reply'        : true,
		'arg:delete'       : true,
		'newslettersignup:list'     : true,
		'newslettersignup:view'	 	  : true,
	});
};
