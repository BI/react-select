'use strict';

var React = require('react/addons');

var CustomMenuMixin = {
  propTypes: {
    onSelectItem: React.PropTypes.func,
    options: React.PropTypes.arrayOf(React.PropTypes.object),
    filtered: React.PropTypes.arrayOf(React.PropTypes.object),
    inputValue: React.PropTypes.string,
    focussedItem: React.PropTypes.object,
    onFocusItem: React.PropTypes.func,
    onUnfocusItem: React.PropTypes.func
  },

  defaultProps: {
    onSelectItem: function onSelectItem(item) {},
    options: [],
    filtered: [],
    inputValue: null,
    focussedItem: null,
    onFocusItem: function onFocusItem(item) {},
    onUnfocusItem: function onUnfocusItem(item) {}
  },

  selectItem: function selectItem(item) {
    this.props.onSelectItem(item);
  },

  focusItem: function focusItem(item) {
    this.props.onFocusItem(item);
  },

  unfocusItem: function unfocusItem(item) {
    this.props.onUnfocusItem(item);
  }
};

module.exports = CustomMenuMixin;