// This configures the apostrophe-users module to add an admin-level
// group by default:

/**
 * Custom permissions:
 * - add-sections
 * -
 * -
 */

module.exports = {
    improve: 'apostrophe-users',
    groups: [
        {
            title: 'guest',
            permissions: []
        },
        {
            title: 'editor',
            permissions: [
                'admin-apostrophe-global',
                'edit',
                'private-locales',
                'edit-apostrophe-file',
                'edit-workflow-document',
                'guest',
                'admin-apostrophe-page',
                'add-sections',
                'admin-workflow-document',
            ],
            permissionsLocales: {
                guest: {},
                edit: {default: true, 'default-draft': true},
                'private-locales': {},
                'edit-apostrophe-page': {default: true, 'default-draft': true},
                'admin-apostrophe-global': {default: true, 'default-draft': true},
                'edit-apostrophe-file': {},
                'edit-workflow-document': {},
                'admin-workflow-document': {},
            }
        },
        {
            title: 'admin',
            permissions: ['admin']
        }
    ],
    construct: function (self, options) {

        self.ensureGroup = function (group, callback) {
            var criteria = {};
            var req = self.apos.tasks.getReq();

            if (group._id) {
                criteria._id = group._id;
            } else if (group.slug) {
                criteria.slug = group.slug;
            } else {
                criteria.title = group.title;
            }

            return self.apos.groups.find(req, criteria).joins(false).toObject(function (err, _group) {
                if (err) {
                    return callback(err);
                }
                if (_group) {
                    group._id = _group._id;
                    if (group.permissions) {
                        _group.permissions = group.permissions;
                    }

                    if (group.permissionsLocales) {
                        _group.permissionsLocales = group.permissionsLocales;
                    }

                    return self.apos.groups.update(req, _group, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, _group);
                    });
                }
                return self.apos.groups.insert(req, group, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, group);
                });
            });
        };
    }
};
