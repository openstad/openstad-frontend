module.exports = function (self, options) {
  self.addPermissions = function() {
    self.apos.permissions.add({
      value: 'export-idea-overview',
      label: 'Export: Ideas'
    });
  };

  self.addToAdminBar = function () {
    self.apos.adminBar.add(self.__meta.name, 'Export Ideas', 'export-idea-overview', {href: '/ideas/download'});
  };
};
