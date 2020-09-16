# Model & Data permissions

Check if an [_action_](#actions) is allowed on a Model. Models in the API are Sequelize objects, based on [_roles_](#roles) a


#### define

Auth settings can be defined on Sequelize models and on attributes (fields) of these models.

```
Argument.auth = Argument.prototype.auth = {
	listableBy: 'all',
	viewableBy: 'all',
	createableBy: 'member',
	updatableBy: ['editor','owner'],
	deletableBy: ['editor','owner'],
}
```

And per field for defining who as access:
```
title: {
  type: DataTypes.STRING,
  auth: {
  	viewableBy : 'all',
  },
}
```

If auth is not defined on a field the auth of the model is used.

If no auth setting is found the role 'admin' is used as default.

#### actions
Five standard actions are recognized: list, view, create, update, delete.
**Note:** list is dubious and will probably may be removed

Extra actions can be defined in the auth; see  [_overrides_](#overrides).

#### roles
Roles are for now hardcoded. This is done in one file and can easily by upgraded to a more flexible and configurable solution.

For now the role model is:
```
{
  admin: ['admin', 'moderator', 'editor', 'member', 'anonymous', 'all'],
  moderator: ['moderator, editor', 'member', 'anonymous', 'all'],
  editor: ['editor', 'member', 'anonymous', 'all'],
  member: ['member', 'anonymous', 'all'],
  anonymous: ['anonymous', 'all'],
  all: ['all'],
  owner: null, // special
}
```

#### users
Any parsed user (see mixins) is supposed to have a field `role` that is one of the above roles.

If no user or role is found the role 'all' is checked.

## mixins

On each model three extra functions are added as mixins

### can
```can(action, user)```
Will check if the user has the role that is required for the action

can will dispatch the check to a function on the model for that action (i.e. a call to can('view', user) will call Model.canView(user)) if it exists.
This allows for specific implementations and for non-default actions; see [_overrides_](#overrides).

If that function is not defined the role is automagically checked on the Models settings.

### authorizeData
```authorizeData(data, action, user)```
filter the incoming data against the users action rights

### toAuthorizedJSON
```toJSON(user)```
Overwrites the default toJSON. Will return a JSON abject that contains only the fields that this user can view.

Add a viewableBy entry to the model nd/or field definition to make this work.

## middleware

For convenience these functions exist as express middleware.

```can(modelname, action)```
Will call the can function on the model with the content of `req.user` as the user.

```useReqUser```
Will add `req.user` as the user to all instances in `req.results`. This will then be used by `can` and `toJSON` to validate

```toAuthorizedJSON```
Will call the toViewableJSON function on all insances in `req.results` with the content of `req.user` as the user.
I think I will remove this middleware

## Overrides

The auth model allows for some functions to be overridden.

On a model new actions can be defined after which these can be used in the standard can functions. The example below allows for Argument.can('vote') to be used.

```
Argument.auth = Argument.prototype.auth = {
  canVote: function(user, self) {
    return Math.rand() > 0.5 ? true : false;
  }
}
```

On a field the function authorizeData is used by Model.authorizeData() and model.toAuthorizedJSON(). The OpenStad Ecosystem uses this for Idea.extraData.

```
title: {
  type: DataTypes.STRING,
  auth: {
    authorizeData: function(data, action, user, self) {
      return 5; // after authorization the value is always 5
    }
  },
}
```
