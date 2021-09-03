// Example of a widget manager with a play method
apos.define('decision-tree-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      console.log('decision-tree', data);
      const element = $widget.find('.osc-decision-tree')[0];
      OpenStadComponents['decision-tree'].DecisionTree.renderElement(
        element,
        data
      );
    };
  },
});
