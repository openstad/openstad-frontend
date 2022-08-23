module.exports = function(self, options) {
  /**
   * Checks when form should be visible
   * @param widget
   * @param activeResource
   * @param isOwnerOrAdmin
   * @param openstadUser
   * @returns {boolean}
   */
  self.showForm = (widget, activeResource, isOwnerOrAdmin, openstadUser) => {
    const formVisibility = widget.formVisibility || 'user';
    
    if (formVisibility === 'always') {
      if (activeResource && !isOwnerOrAdmin) {
        return false;
      }
      return true;
    }

    if (formVisibility === 'user') {
      if ((activeResource && isOwnerOrAdmin) || (!activeResource && openstadUser && openstadUser.id)) {
        return true;
      }
    }

    return false;
  }
  /**
   * Format value by resource to save correct data in api.
   * @param {string} resource
   * @param {string} formatUserEmailFieldValue
   * @returns {string}
   */
  self.formatUserEmailFieldValue = (resource, fieldValue) => {
    if (resource === 'submission') {
      return `submittedData.${fieldValue}`;
    }

    return `extraData.${fieldValue}`;
  }

  /**
   * Format value by resource to show correct data in widget.
   * @param {string} fieldValue
   * @returns {string}
   */
  self.removeColumnNameFromEmailFieldValue = (fieldValue) => {
    return fieldValue ? fieldValue.replace(/submittedData\.|extraData\./, '') : '';
  }
}
