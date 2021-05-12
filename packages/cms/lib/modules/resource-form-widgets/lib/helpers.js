module.exports = async function(self, options) {
  /**
   * Checks when form should be visible
   * @param widget
   * @param activeResource
   * @param isOwnerOrAdmin
   * @param openstadUser
   * @returns {boolean}
   */
  self.showForm = (widget, activeResource, isOwnerOrAdmin, openstadUser) => {
    if (widget.formVisibility === 'always') {
      return true;
    }
    if (widget.formVisibility === 'user' && activeResource && isOwnerOrAdmin) {
      return true;
    }
    else if (widget.formVisibility === 'user' && !activeResource && openstadUser && openstadUser.id) {
      return true;
    }

    return false;
  }
  /**
   * Format value by resource to save correct data in api.
   * @param {string} resource
   * @param {string} fieldValue
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
  self.reformatUserEmailFieldValue = (fieldValue) => {
    return fieldValue ? fieldValue.replace(/submittedData\.|extraData\./, '') : '';
  }
}
