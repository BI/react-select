"use strict";

var _ = require("underscore"),
    React = require("react"),
    classes = require("classnames");

var Option = React.createClass({

  displayName: "Value",

  propTypes: {
    label: React.PropTypes.string.isRequired
  },

  blockEvent: function (event) {
    event.stopPropagation();
  },

  render: function () {
    return React.createElement(
      "div",
      { className: "Select-item", role: "button", onClick: this.props.onRemove, "aria-label": "Remove " + this.props.label },
      React.createElement(
        "span",
        { className: "Select-item-icon", onMouseDown: this.blockEvent, onClick: this.props.onRemove, onTouchEnd: this.props.onRemove },
        "×"
      ),
      React.createElement(
        "span",
        { className: "Select-item-label" },
        this.props.label
      )
    );
  }

});

module.exports = Option;