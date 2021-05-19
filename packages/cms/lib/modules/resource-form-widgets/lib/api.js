module.exports = async function(self, options) {
  /**
   * Sync data with api when user saves or commit
   * @param req
   * @param doc
   * @param options
   * @returns {Promise<void>}
   */
  self.syncConfirmationFields = async (req, doc, options) => {
    if ((doc.workflowLocale && doc.workflowLocale === 'default-draft') || (!doc.body || !doc.body.items)) {
      return;
    }

    doc.body.items.forEach((item) => {
      const items = self.getAreaItems(item);

      items.forEach(async (item) => {
        if (item.type === 'resource-form') {
          if (item.confirmationEnabledUser) {
            try {
              await self.addOrUpdateNotification(item, 'User');
            } catch (error) {
              console.error(
                'something went wrong when update admin confirmation settings to api',
                error.message
              );
            }
          } else {
            await self.disableNotificationRuleSet(`User-${item.formName}`);
          }

          if (item.confirmationEnabledAdmin) {
            try {
              await self.addOrUpdateNotification(item, 'Admin');
            } catch (error) {
              console.error(
                'something went wrong when update admin confirmation settings to api',
                error.message
              );
            }
          } else {
            await self.disableNotificationRuleSet(`Admin-${item.formName}`);
          }
        }
      })
    })
  }

  /**
   * Add or update confirmation data to the api
   * @param {object} item
   * @param {string} type 'User' or 'Admin'
   * @returns {Promise<void>}
   */
  self.addOrUpdateNotification = async (item, type) => {
    const formName = `${type}-${item.formName}`;

    const { ruleset, template, recipient } = await self.getNotificationByFormName(formName);

    const templateData = {
      label: formName,
      subject: item[`confirmationSubject${type}`],
      text: item[`confirmationEmailContent${type}`],
      templateFile: item[`confirmationTemplateName${type}`]
    }

    if (template) {
      templateData.id = template.id
    }

    const updatedTemplate = await self.apos.openstadApi.addOrUpdateNotificationTemplate(templateData);
    const ruleSetData = {
      notificationTemplateId: updatedTemplate.id,
      active: 1,
      label: formName,
      body: JSON.stringify({"and":[{"===":[{"var":"eventType"},"CREATE"]},{"===":[{"var":"resource"},item.resource]},{"===":[{"var":"instance.formName"}, item.formName]}]})
    }
    if (ruleset) {
      ruleSetData.id = ruleset.id
    }

    const updatedRuleSet = await self.apos.openstadApi.addOrUpdateNotificationRuleSet(ruleSetData);
    const recipientData = {
      notificationRulesetId: updatedRuleSet.id,
      emailType: type === 'User' ? 'field' : 'fixed',
      value: type === 'User' ? self.formatUserEmailFieldValue(item.resource, item[`confirmationEmailField${type}`]) :  item[`confirmationEmailField${type}`]
    }
    if (recipient) {
      recipientData.id = recipient.id
    }
    await self.apos.openstadApi.addOrUpdateNotificationRecipient(recipientData);
  }

  self.disableNotificationRuleSet = async (formName) => {
    const { ruleset } = await self.getNotificationByFormName(formName);

    await self.apos.openstadApi.addOrUpdateNotificationRuleSet({
      id: ruleset.id,
      active: 0
    });
  }

  /**
   * Delete ruleset, template and recipient
   * @param {string} formName
   * @returns {Promise<void>}
   */
  self.deleteNotificationByFormName = async (formName) => {
    const { ruleset, template, recipient } = await self.getNotificationByFormName(formName);
    try {
      const promises = [];
      if (ruleset.id) {
        promises.push(self.apos.openstadApi.deleteNotificationRuleSet(ruleset.id));
      }
      if (recipient.id) {
        promises.push(self.apos.openstadApi.deleteNotificationRecipient(ruleset.id));
      }
      if (template.id) {
        promises.push(self.apos.openstadApi.deleteNotificationTemplate(template.id));
      }
      await Promise.all(promises);
    } catch(error) {
      console.error(error);
    }
  }

  /**
   * Get confirmation data from the api
   * @param {string} formName
   * @returns {Promise<{template: object ruleset: object, recipient: object}>}
   */
  self.getNotificationByFormName = async (formName) => {
    const ruleset = await self.apos.openstadApi.getNotificationRuleSetByName(formName) || {};
    const template = ruleset.notification_template || {};
    const recipient = ruleset.notification_recipients ? ruleset.notification_recipients[0] : {};

    return {
      ruleset,
      template,
      recipient,
    }
  }

  /**
   * Delete confirmation data when widget is removed.
   * @param req
   * @param doc
   * @param options
   * @returns {Promise<void>}
   */
  self.deleteConfirmationFields = async (req, doc, options) => {
    if (doc.workflowLocale && doc.workflowLocale === 'default-draft') {
      return;
    }

    doc.body.items.forEach((item) => {
      const items = [].concat(...item.area1.items, ...item.area2.items, ...item.area3.items, ...item.area4.items);

      items.forEach(async (item) => {
        if (item.type === 'resource-form') {
          // Todo: delete template, ruleset and recipient
        }
      });
    });
  }

  /**
   * Collect all items from the four areas Apostrophe provide.
   * @param item
   * @returns {*[]}
   */
  self.getAreaItems = (item) => {
    return [].concat(
      ...(item.area1 && item.area1.items ? item.area1.items : []),
      ...(item.area2 && item.area2.items ? item.area2.items : []),
      ...(item.area3 && item.area3.items ? item.area3.items : []),
      ...(item.area4 && item.area4.items ? item.area4.items : [])
    );
  }
}
