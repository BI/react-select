"use strict";

var React = require("react");

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
    onSelectItem: function (item) {},
    options: [],
    filtered: [],
    inputValue: null,
    focussedItem: null,
    onFocusItem: function (item) {},
    onUnfocusItem: function (item) {}
  },

  selectItem: function (item) {
    this.props.onSelectItem(item);
  },

  focusItem: function (item) {
    this.props.onFocusItem(item);
  },

  unfocusItem: function (item) {
    this.props.onUnfocusItem(item);
  }
};

module.exports = CustomMenuMixin;