require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js":[function(require,module,exports){
function classnames() {
	var args = arguments, classes = [];
	for (var i = 0; i < args.length; i++) {
		if (args[i] && 'string' === typeof args[i]) {
			classes.push(args[i]);
		} else if ('object' === typeof args[i]) {
			classes = classes.concat(Object.keys(args[i]).filter(function(cls) {
				return args[i][cls];
			}));
		}
	}
	return classes.join(' ') || undefined;
}

module.exports = classnames;

},{}],"/Users/andrewblowe/Projects/usaid/react-select/src/CustomMenuMixin.js":[function(require,module,exports){
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

},{"react":false}],"/Users/andrewblowe/Projects/usaid/react-select/src/Value.js":[function(require,module,exports){
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

},{"classnames":"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js","react":false,"underscore":false}],"react-select":[function(require,module,exports){
"use strict";

var _ = require("underscore"),
    React = require("react/addons"),
    Input = require("react-input-autosize"),
    classes = require("classnames"),
    Value = require("./Value"),
    CustomMenuMixin = require("./CustomMenuMixin.js");

var requestId = 0;


var Select = React.createClass({

  displayName: "Select",

  statics: {
    CustomMenuMixin: CustomMenuMixin
  },

  propTypes: {
    value: React.PropTypes.any, // initial field value
    multi: React.PropTypes.bool, // multi-value input
    disabled: React.PropTypes.bool, // whether the Select is disabled or not
    options: React.PropTypes.array, // array of options
    delimiter: React.PropTypes.string, // delimiter to use to join multiple values
    asyncOptions: React.PropTypes.func, // function to call to get options
    autoload: React.PropTypes.bool, // whether to auto-load the default async options set
    placeholder: React.PropTypes.string, // field placeholder, displayed when there's no value
    noResultsText: React.PropTypes.string, // placeholder displayed when there are no matching search results
    clearable: React.PropTypes.bool, // should it be possible to reset value
    clearValueText: React.PropTypes.string, // title for the "clear" control
    clearAllText: React.PropTypes.string, // title for the "clear" control when multi: true
    searchable: React.PropTypes.bool, // whether to enable searching feature or not
    searchPromptText: React.PropTypes.string, // label to prompt for search input
    name: React.PropTypes.string, // field name, for hidden <input /> tag
    onChange: React.PropTypes.func, // onChange handler: function(newValue) {}
    className: React.PropTypes.string, // className for the outer element
    filterOption: React.PropTypes.func, // method to filter a single option: function(option, filterString)
    filterOptions: React.PropTypes.func, // method to filter the options array: function([options], filterString, [values])
    matchPos: React.PropTypes.string, // (any|start) match the start or entire string when filtering
    matchProp: React.PropTypes.string, // (any|label|value) which option property to filter on
    accessibleLabel: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      value: undefined,
      options: [],
      disabled: false,
      delimiter: ",",
      asyncOptions: undefined,
      autoload: true,
      placeholder: "Select...",
      noResultsText: "No results found",
      clearable: true,
      clearValueText: "Clear value",
      clearAllText: "Clear all",
      searchable: true,
      searchPromptText: "Type to search",
      name: undefined,
      onChange: undefined,
      className: undefined,
      matchPos: "any",
      matchProp: "any",
      accessibleLabel: "Choose a value"
    };
  },

  getInitialState: function () {
    return {
      /*
       * set by getStateFromValue on componentWillMount:
       * - value
       * - values
       * - filteredOptions
       * - inputValue
       * - placeholder
       * - focusedOption
      */
      options: this.props.options,
      isFocused: false,
      isOpen: false,
      isLoading: false,
      alertMessage: ""
    };
  },

  componentWillMount: function () {
    this._optionsCache = {};
    this._optionsFilterString = "";
    this.setState(this.getStateFromValue(this.props.value));

    if (this.props.asyncOptions && this.props.autoload) {
      this.autoloadAsyncOptions();
    }
  },

  componentWillUnmount: function () {
    clearTimeout(this._blurTimeout);
    clearTimeout(this._focusTimeout);
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.value !== this.state.value) {
      this.setState(this.getStateFromValue(newProps.value, newProps.options));
    }
    if (JSON.stringify(newProps.options) !== JSON.stringify(this.props.options)) {
      this.setState({
        options: newProps.options,
        filteredOptions: this.filterOptions(newProps.options)
      });
    }
  },

  componentDidUpdate: function () {
    if (this._focusAfterUpdate) {
      clearTimeout(this._blurTimeout);
      this._focusTimeout = setTimeout((function () {
        this.getInputNode().focus();
        this._focusAfterUpdate = false;
      }).bind(this), 50);
    }

    if (this._focusedOptionReveal) {
      if (this.refs.focused && this.refs.menu) {
        var focusedDOM = this.refs.focused.getDOMNode();
        var menuDOM = this.refs.menu.getDOMNode();
        var focusedRect = focusedDOM.getBoundingClientRect();
        var menuRect = menuDOM.getBoundingClientRect();

        if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
          menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
        }
      }

      this._focusedOptionReveal = false;
    }

    if (this.state.alertMessage !== "") {
      var that = this;
      setTimeout(function () {
        that.setState({
          alertMessage: ""
        });
      }, 500);
    }
  },

  getStateFromValue: function (value, options) {
    if (!options) {
      options = this.state.options;
    }

    // reset internal filter string
    this._optionsFilterString = "";

    var values = this.initValuesArray(value, options),
        filteredOptions = this.filterOptions(options, values);

    return {
      value: values.map(function (v) {
        return v.value;
      }).join(this.props.delimiter),
      values: values,
      inputValue: "",
      filteredOptions: filteredOptions,
      placeholder: !this.props.multi && values.length ? values[0].label : this.props.placeholder,
      focusedOption: !this.props.multi && values.length ? values[0] : filteredOptions[0]
    };
  },

  initValuesArray: function (values, options) {
    if (!Array.isArray(values)) {
      if ("string" === typeof values) {
        values = values.split(this.props.delimiter);
      } else {
        values = values ? [values] : [];
      }
    }

    return values.map((function (val) {
      return "string" === typeof val ? val = _.findWhere(options, { value: val }) || { value: val, label: val } : val;
    }).bind(this));
  },

  setValue: function (value) {
    this._focusAfterUpdate = true;
    var newState = this.getStateFromValue(value);
    newState.isOpen = false;
    this.fireChangeEvent(newState);
    this.setState(newState);
  },

  selectValue: function (value) {
    // this[this.props.multi ? 'addValue' : 'setValue'](value);
    if (!this.props.multi) {
      this.setValue(value);
    } else if (value) {
      this.addValue(value);
    }
    this.setState({ alertMessage: value.label + " selected" });
  },

  addValue: function (value) {
    this.setValue(this.state.values.concat(value));
  },

  popValue: function () {
    this.setValue(_.initial(this.state.values));
  },

  removeValue: function (value) {
    this.setValue(_.without(this.state.values, value));
    this.setState({ alertMessage: value.label + " removed" });
  },

  clearValue: function (event) {
    // if the event was triggered by a mousedown and not the primary
    // button, ignore it.
    if (event && event.type == "mousedown" && event.button !== 0) {
      return;
    }
    this.setValue(null);
  },

  resetValue: function () {
    this.setValue(this.state.value);
  },

  getInputNode: function () {
    var input = this.refs.input;
    return this.props.searchable ? input : input.getDOMNode();
  },

  fireChangeEvent: function (newState) {
    if (newState.value !== this.state.value && this.props.onChange) {
      this.props.onChange(newState.value, newState.values);
    }
  },

  handleMouseDown: function (event) {
    // if the event was triggered by a mousedown and not the primary
    // if (event && event.type == 'mousedown' && event.button !== 0) {
    // button, or if the component is disabled, ignore it.
    if (this.props.disabled || event.type == "mousedown" && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.handleMouseDownImplementation();
  },
  handleMouseDownImplementation: function () {
    if (this.state.isFocused) {
      this.setState({
        isOpen: true
        //alertMessage: this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused."
      });
    } else {
      this._openAfterFocus = true;
      this.getInputNode().focus(); //is this actually needed? Had to manually set focus state for a keyboard nav fix.
      this.setState({ isFocused: true });
    }
  },

  handleInputFocus: function () {
    var openMenu = this.state.isOpen || this._openAfterFocus;
    this.setState({
      isFocused: true,
      isOpen: openMenu,
      alertMessage: openMenu ? this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused." : ""
    });
    this._openAfterFocus = false;
  },

  handleInputBlur: function (event) {
    this._blurTimeout = setTimeout((function () {
      if (this._focusAfterUpdate) return;
      this.setState({
        isOpen: false,
        isFocused: false
      });
    }).bind(this), 50);
  },

  handleKeyDown: function (event) {
    if (this.state.disabled) return;

    switch (event.keyCode) {

      case 8:
        // backspace
        if (!this.state.inputValue) {
          this.popValue();
        }
        return;
        break;

      case 9:
        // tab
        if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
          return;
        }
        this.selectFocusedOption();
        break;

      case 13:
        // enter
        this.selectFocusedOption();

        break;

      case 27:
        // escape
        if (this.state.isOpen) {
          this.resetValue();
        } else {
          this.clearValue();
        }
        break;

      case 38:
        // up
        this.focusPreviousOption();
        break;

      case 40:
        // down
        this.focusNextOption();
        break;

      case 32:
        //space to open drop down

        if (this.state.isOpen !== true) {
          this.handleMouseDownImplementation();
          this.setState({
            isOpen: true,
            alertMessage: this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused."
          });
        } else return;
        break;

      default:
        return;
    }

    //prevent default action of whatever key was pressed
    event.preventDefault();
  },

  //This function handles keyboard text input for filtering options
  handleInputChange: function (event) {
    // assign an internal variable because we need to use
    // the latest value before setState() has completed.
    this._optionsFilterString = event.target.value;
    var that = this;
    var filteredOptions = this.filterOptions(this.state.options);
    var focusedOption = _.contains(filteredOptions, this.state.focusedOption) ? this.state.focusedOption : filteredOptions[0];

    if (this.props.asyncOptions) {
      this.setState({
        isLoading: true,
        inputValue: event.target.value,
        focusedOption: focusedOption,
        alertMessage: filteredOptions.length + " options available. " + focusedOption.label + " currently focused."
      });
      this.loadAsyncOptions(event.target.value, {
        isLoading: false,
        isOpen: true
      });
    } else {
      this.setState({
        isOpen: true,
        alertMessage: filteredOptions.length + " options available. " + focusedOption.label + " currently focused.",
        inputValue: event.target.value,
        filteredOptions: filteredOptions,
        focusedOption: focusedOption
      });
    }
  },

  autoloadAsyncOptions: function () {
    this.loadAsyncOptions("", {}, function () {});
  },

  loadAsyncOptions: function (input, state) {
    for (var i = 0; i <= input.length; i++) {
      var cacheKey = input.slice(0, i);
      if (this._optionsCache[cacheKey] && (input === cacheKey || this._optionsCache[cacheKey].complete)) {
        var options = this._optionsCache[cacheKey].options;
        this.setState(_.extend({
          options: options,
          filteredOptions: this.filterOptions(options)
        }, state));
        return;
      }
    }

    var thisRequestId = this._currentRequestId = requestId++;

    this.props.asyncOptions(input, (function (err, data) {
      this._optionsCache[input] = data;

      if (thisRequestId !== this._currentRequestId) {
        return;
      }

      this.setState(_.extend({
        options: data.options,
        filteredOptions: this.filterOptions(data.options)
      }, state));
    }).bind(this));
  },

  filterOptions: function (options, values) {
    if (!this.props.searchable) {
      return options;
    }

    var filterValue = this._optionsFilterString;
    var exclude = (values || this.state.values).map(function (i) {
      return i.value;
    });
    if (this.props.filterOptions) {
      return this.props.filterOptions.call(this, options, filterValue, exclude);
    } else {
      var filterOption = function (op) {
        if (this.props.multi && _.contains(exclude, op.value)) return false;
        if (this.props.filterOption) return this.props.filterOption.call(this, op, filterValue);
        return !filterValue || this.props.matchPos === "start" ? this.props.matchProp !== "label" && op.value.toLowerCase().substr(0, filterValue.length) === filterValue || this.props.matchProp !== "value" && op.label.toLowerCase().substr(0, filterValue.length) === filterValue : this.props.matchProp !== "label" && op.value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 || this.props.matchProp !== "value" && op.label.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
      };
      return _.filter(options, filterOption, this);
    }
  },

  selectFocusedOption: function () {
    return this.selectValue(this.state.focusedOption);
  },

  focusOption: function (op) {
    this.setState({
      focusedOption: op
    });
  },

  focusNextOption: function () {
    this.focusAdjacentOption("next");
  },

  focusPreviousOption: function () {
    this.focusAdjacentOption("previous");
  },

  focusAdjacentOption: function (dir) {
    this._focusedOptionReveal = true;

    var ops = this.state.filteredOptions;

    if (!this.state.isOpen) {
      this.handleMouseDownImplementation();
      this.setState({
        isOpen: true,
        alertMessage: ops.length + " options available. " + this.state.focusedOption.label + " currently focused.",
        inputValue: "",
        focusedOption: this.state.focusedOption || ops[dir === "next" ? 0 : ops.length - 1]
      });
      return;
    }

    if (!ops.length) {
      return;
    }

    var focusedIndex = -1;

    for (var i = 0; i < ops.length; i++) {
      if (this.state.focusedOption === ops[i]) {
        focusedIndex = i;
        break;
      }
    }

    var focusedOption = ops[0];

    if (dir === "next" && focusedIndex > -1 && focusedIndex < ops.length - 1) {
      focusedOption = ops[focusedIndex + 1];
    } else if (dir === "previous") {
      if (focusedIndex > 0) {
        focusedOption = ops[focusedIndex - 1];
      } else {
        focusedOption = ops[ops.length - 1];
      }
    }

    this.setState({
      focusedOption: focusedOption,
      inputValue: focusedOption.label,
      alertMessage: focusedOption.label + " currently focused. Press enter to select."
    });
  },

  unfocusOption: function (op) {
    if (this.state.focusedOption === op) {
      this.setState({
        focusedOption: null
      });
    }
  },

  swapFocus: function (list, oldFocusIndex, newFocusIndex) {
    if (!list) {
      return;
    }

    if (!list[oldFocusIndex] || !list[newFocusIndex]) {
      return;
    }

    if (!newFocusIndex && newFocusIndex !== 0 || oldFocusIndex === newFocusIndex) {
      return;
    }

    var oldFocusReplacement = React.addons.cloneWithProps(list[oldFocusIndex], {
      key: list[oldFocusIndex].key,
      ref: null
    });

    var newFocusReplacement = React.addons.cloneWithProps(list[newFocusIndex], {
      key: list[newFocusIndex].key,
      ref: "focused"
    });

    //cloneWithProps appends classes, but does not replace them, which is what I want here
    oldFocusReplacement.props.className = "Select-option";
    newFocusReplacement.props.className = "Select-option is-focused";

    this.cachedFocusedItemIndex = newFocusIndex;

    this.cachedMenu.splice(oldFocusIndex, 1, oldFocusReplacement);
    this.cachedMenu.splice(newFocusIndex, 1, newFocusReplacement);
  },

  cachedFocusedItemIndex: 0,
  cachedListItemsIndexLookup: {},
  cachedMenu: [],
  cachedFiltered: [],

  buildMenu: function () {
    var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;

    if (this.cachedFiltered == this.state.filteredOptions) {
      this.swapFocus(this.cachedMenu, this.cachedFocusedItemIndex, this.cachedListItemsIndexLookup[focusedValue]);
      return this.cachedMenu;
    }

    this.cachedListItemsIndexLookup = {};

    var ops = _.map(this.state.filteredOptions, function (op, index) {
      var isFocused = focusedValue === op.value;

      var optionClass = classes({
        "Select-option": true,
        "is-focused": isFocused
      });

      var ref = isFocused ? "focused" : null;

      var mouseEnter = this.focusOption.bind(this, op),
          mouseLeave = this.unfocusOption.bind(this, op),
          mouseDown = this.selectValue.bind(this, op);

      this.cachedListItemsIndexLookup[op.value] = index;
      var checkMark = "";
      if (isFocused) {
        this.cachedFocusedItem = index;
        checkMark = " Selected";
      }

      return React.createElement(
        "a",
        { role: "listitem", "aria-label": op.label + checkMark, ref: ref, key: "option-" + op.value, className: optionClass, onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, onMouseDown: mouseDown, onClick: mouseDown },
        op.label
      );
    }, this);

    return ops.length ? ops : React.createElement(
      "div",
      { className: "Select-noresults" },
      this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText
    );
  },

  buildCustomMenu: function () {
    if (!this.props.children) {
      return;
    }

    var child = this.props.children;

    return React.addons.cloneWithProps(child, {
      onSelectItem: this.selectValue,
      options: this.props.options,
      filtered: this.state.filteredOptions,
      inputValue: this.state.inputValue,
      focussedItem: this.state.focusedOption,
      onFocusItem: this.focusOption,
      onUnfocusItem: this.unfocusOption
    });
  },
  switchFocus: function () {
    this.getInputNode().focus();
  },

  render: function () {
    var selectClass = classes("Select", this.props.className, {
      "is-multi": this.props.multi,
      "is-searchable": this.props.searchable,
      "is-open": this.state.isOpen,
      "is-focused": this.state.isFocused,
      "is-loading": this.state.isLoading,
      "is-disabled": this.props.disabled,
      "has-value": this.state.value
    });

    var value = [];

    if (this.props.multi) {
      this.state.values.forEach(function (val) {
        var props = _.extend({
          key: val.value,
          onRemove: this.removeValue.bind(this, val)
        }, val);
        value.push(React.createElement(Value, props));
      }, this);
    }

    if (this.props.disabled || !this.state.inputValue && (!this.props.multi || !value.length)) {
      value.push(React.createElement(
        "div",
        { "aria-hidden": "true", className: "Select-placeholder", key: "placeholder" },
        this.state.placeholder
      ));
    }

    var loading = this.state.isLoading ? React.createElement("span", { className: "Select-loading", "aria-hidden": "true" }) : null;
    var clear = this.props.clearable && this.state.value && !this.props.disabled ? React.createElement("span", { role: "button", className: "Select-clear", title: this.props.multi ? this.props.clearAllText : this.props.clearValueText, "aria-label": this.props.multi ? this.props.clearAllText : this.props.clearValueText, onMouseDown: this.clearValue, onClick: this.clearValue, dangerouslySetInnerHTML: { __html: "&times;" } }) : null;
    var builtMenu = this.props.buildCustomMenu ? this.props.buildCustomMenu(this.selectValue, this.state.filteredOptions, this.state.focusedOption, this.focusOption, this.unfocusOption) : this.buildMenu();
    // var builtMenu = this.props.children ? this.buildCustomMenu() : this.buildMenu();

    this.cachedFiltered = this.state.filteredOptions;
    this.cachedMenu = builtMenu;

    var menu = this.state.isOpen ? React.createElement(
      "div",
      { id: "Select-menu", ref: "menu", className: "Select-menu" },
      builtMenu
    ) : null;

    var hideVisuallyStyles = {
      position: "absolute",
      left: "-999999px",
      top: "auto",
      overflow: "hidden",
      height: "1px",
      width: "1px"
    };

    var moveInputFocusForMulti = "";
    var summaryLabelMainInput,
        hideMainInput = false;
    var currentSelectionText = this.state.placeholder;
    //handle multi select aria notification order differently because of the remove buttons
    if (this.props.multi) {
      var valueList = this.state.values;
      if (valueList.length > 1) {
        currentSelectionText = "";
        valueList.forEach(function (val, index) {
          currentSelectionText += String(val.label);
          if (index < valueList.length - 1) currentSelectionText += ", ";
        });
        currentSelectionText += " currently selected.";
      } else if (valueList.length === 1) {
        currentSelectionText = valueList[0].label + " currently selected.";
      }

      moveInputFocusForMulti = React.createElement("input", {
        style: hideVisuallyStyles,
        "aria-label": currentSelectionText + ", " + this.props.accessibleLabel + ", Combobox. Press down arrow key to open select options or start typing for options to be filtered. Use up and down arrow keys to navigate options. Press enter to select an option.",
        onFocus: this.switchFocus, minWidth: "5" });
      summaryLabelMainInput = "";
      hideMainInput = true;
    } else {
      summaryLabelMainInput = currentSelectionText + ", " + this.props.accessibleLabel + ", Combobox. Press down arrow key to open select options or start typing for options to be filtered. Use up and down arrow keys to navigate options. Press enter to select an option.";
    }

    var commonProps = {
      ref: "input",
      className: "Select-input",
      tabIndex: this.props.tabIndex || 0,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur
    };

    var input;

    if (this.props.searchable && !this.props.disabled) {
      input = React.createElement(Input, React.__spread({
        "aria-hidden": hideMainInput,
        "aria-label": summaryLabelMainInput,
        value: this.state.inputValue,
        onChange: this.handleInputChange,
        minWidth: "5"
      }, commonProps));
    } else {
      var summaryLabelNonSearchable = currentSelectionText + ", " + this.props.accessibleLabel + ", Combobox. Press down arrow key to open select options. Use up and down arrow keys to navigate options. Press enter to select an option. Typing will not filter options, this is a non-searchable combobox.";
      input = React.createElement(
        "div",
        React.__spread({
          "aria-label": summaryLabelNonSearchable
        }, commonProps),
        " "
      );
    }

    return React.createElement(
      "div",
      { ref: "wrapper", className: selectClass },
      React.createElement("input", { type: "hidden", ref: "value", name: this.props.name, value: this.state.value, disabled: this.props.disabled }),
      React.createElement(
        "div",
        { className: "Select-control", ref: "control", onKeyDown: this.handleKeyDown, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
        moveInputFocusForMulti,
        value,
        input,
        React.createElement("span", { className: "Select-arrow" }),
        loading,
        clear
      ),
      menu,
      React.createElement(
        "div",
        { tabIndex: "-1", style: hideVisuallyStyles, id: "alert-options", role: "alert", "aria-label": "End of select" },
        this.state.alertMessage
      )
    );
  }

});


module.exports = Select;

},{"./CustomMenuMixin.js":"/Users/andrewblowe/Projects/usaid/react-select/src/CustomMenuMixin.js","./Value":"/Users/andrewblowe/Projects/usaid/react-select/src/Value.js","classnames":"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js","react-input-autosize":false,"react/addons":false,"underscore":false}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL0N1c3RvbU1lbnVNaXhpbi5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL1ZhbHVlLmpzIiwiL1VzZXJzL2FuZHJld2Jsb3dlL1Byb2plY3RzL3VzYWlkL3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksZUFBZSxHQUFHO0FBQ3BCLFdBQVMsRUFBRTtBQUNULGdCQUFZLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFdBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUN4RCxZQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDekQsY0FBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNsQyxnQkFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNwQyxlQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2pDLGlCQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0dBQ3BDOztBQUVELGNBQVksRUFBRTtBQUNa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LEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGNsYXNzbmFtZXMoKSB7XG5cdHZhciBhcmdzID0gYXJndW1lbnRzLCBjbGFzc2VzID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChhcmdzW2ldICYmICdzdHJpbmcnID09PSB0eXBlb2YgYXJnc1tpXSkge1xuXHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZ3NbaV0pO1xuXHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmdzW2ldKSB7XG5cdFx0XHRjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoT2JqZWN0LmtleXMoYXJnc1tpXSkuZmlsdGVyKGZ1bmN0aW9uKGNscykge1xuXHRcdFx0XHRyZXR1cm4gYXJnc1tpXVtjbHNdO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzbmFtZXM7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ3VzdG9tTWVudU1peGluID0ge1xuICBwcm9wVHlwZXM6IHtcbiAgICBvblNlbGVjdEl0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLFxuICAgIGZpbHRlcmVkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpbnB1dFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZvY3Vzc2VkSXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBkZWZhdWx0UHJvcHM6IHtcbiAgICBvblNlbGVjdEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHt9LFxuICAgIG9wdGlvbnM6IFtdLFxuICAgIGZpbHRlcmVkOiBbXSxcbiAgICBpbnB1dFZhbHVlOiBudWxsLFxuICAgIGZvY3Vzc2VkSXRlbTogbnVsbCxcbiAgICBvbkZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge30sXG4gICAgb25VbmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge31cbiAgfSxcblxuICBzZWxlY3RJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdEl0ZW0oaXRlbSk7XG4gIH0sXG5cbiAgZm9jdXNJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vbkZvY3VzSXRlbShpdGVtKTtcbiAgfSxcblxuICB1bmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHJvcHMub25VbmZvY3VzSXRlbShpdGVtKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b21NZW51TWl4aW47IiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0Y2xhc3NlcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIE9wdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XG5cdGRpc3BsYXlOYW1lOiAnVmFsdWUnLFxuXHRcblx0cHJvcFR5cGVzOiB7XG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXHRcblx0YmxvY2tFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LWl0ZW1cIiByb2xlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblJlbW92ZX0gYXJpYS1sYWJlbD17XCJSZW1vdmUgXCIgKyB0aGlzLnByb3BzLmxhYmVsfT5cblx0XHRcdFx0PHNwYW4gIGNsYXNzTmFtZT1cIlNlbGVjdC1pdGVtLWljb25cIiBvbk1vdXNlRG93bj17dGhpcy5ibG9ja0V2ZW50fSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uUmVtb3ZlfSBvblRvdWNoRW5kPXt0aGlzLnByb3BzLm9uUmVtb3ZlfT4mdGltZXM7PC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtaXRlbS1sYWJlbFwiPnt0aGlzLnByb3BzLmxhYmVsfTwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblx0XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblx0UmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKSxcblx0SW5wdXQgPSByZXF1aXJlKCdyZWFjdC1pbnB1dC1hdXRvc2l6ZScpLFxuXHRjbGFzc2VzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpLFxuXHRWYWx1ZSA9IHJlcXVpcmUoJy4vVmFsdWUnKSxcblx0Q3VzdG9tTWVudU1peGluID0gcmVxdWlyZSgnLi9DdXN0b21NZW51TWl4aW4uanMnKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cblxudmFyIFNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1NlbGVjdCcsXG5cblx0c3RhdGljczoge1xuXHRcdEN1c3RvbU1lbnVNaXhpbjogQ3VzdG9tTWVudU1peGluXG5cdH0sXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgICAgICAgIC8vIGluaXRpYWwgZmllbGQgdmFsdWVcblx0XHRtdWx0aTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gbXVsdGktdmFsdWUgaW5wdXRcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGRpc2FibGVkIG9yIG5vdFxuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSwgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXG5cdFx0ZGVsaW1pdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIGRlbGltaXRlciB0byB1c2UgdG8gam9pbiBtdWx0aXBsZSB2YWx1ZXNcblx0XHRhc3luY09wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gZnVuY3Rpb24gdG8gY2FsbCB0byBnZXQgb3B0aW9uc1xuXHRcdGF1dG9sb2FkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyB3aGV0aGVyIHRvIGF1dG8tbG9hZCB0aGUgZGVmYXVsdCBhc3luYyBvcHRpb25zIHNldFxuXHRcdHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxuXHRcdG5vUmVzdWx0c1RleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAvLyBwbGFjZWhvbGRlciBkaXNwbGF5ZWQgd2hlbiB0aGVyZSBhcmUgbm8gbWF0Y2hpbmcgc2VhcmNoIHJlc3VsdHNcblx0XHRjbGVhcmFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gc2hvdWxkIGl0IGJlIHBvc3NpYmxlIHRvIHJlc2V0IHZhbHVlXG5cdFx0Y2xlYXJWYWx1ZVRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2xcblx0XHRjbGVhckFsbFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbCB3aGVuIG11bHRpOiB0cnVlXG5cdFx0c2VhcmNoYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIHNlYXJjaGluZyBmZWF0dXJlIG9yIG5vdFxuXHRcdHNlYXJjaFByb21wdFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAvLyBsYWJlbCB0byBwcm9tcHQgZm9yIHNlYXJjaCBpbnB1dFxuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAvLyBmaWVsZCBuYW1lLCBmb3IgaGlkZGVuIDxpbnB1dCAvPiB0YWdcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgLy8gb25DaGFuZ2UgaGFuZGxlcjogZnVuY3Rpb24obmV3VmFsdWUpIHt9XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIGNsYXNzTmFtZSBmb3IgdGhlIG91dGVyIGVsZW1lbnRcblx0XHRmaWx0ZXJPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gbWV0aG9kIHRvIGZpbHRlciBhIHNpbmdsZSBvcHRpb246IGZ1bmN0aW9uKG9wdGlvbiwgZmlsdGVyU3RyaW5nKVxuXHRcdGZpbHRlck9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAvLyBtZXRob2QgdG8gZmlsdGVyIHRoZSBvcHRpb25zIGFycmF5OiBmdW5jdGlvbihbb3B0aW9uc10sIGZpbHRlclN0cmluZywgW3ZhbHVlc10pXG5cdFx0bWF0Y2hQb3M6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIChhbnl8c3RhcnQpIG1hdGNoIHRoZSBzdGFydCBvciBlbnRpcmUgc3RyaW5nIHdoZW4gZmlsdGVyaW5nXG5cdFx0bWF0Y2hQcm9wOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIChhbnl8bGFiZWx8dmFsdWUpIHdoaWNoIG9wdGlvbiBwcm9wZXJ0eSB0byBmaWx0ZXIgb25cblx0XHRhY2Nlc3NpYmxlTGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxuXHRcdFx0b3B0aW9uczogW10sXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRkZWxpbWl0ZXI6ICcsJyxcblx0XHRcdGFzeW5jT3B0aW9uczogdW5kZWZpbmVkLFxuXHRcdFx0YXV0b2xvYWQ6IHRydWUsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ1NlbGVjdC4uLicsXG5cdFx0XHRub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG5cdFx0XHRjbGVhcmFibGU6IHRydWUsXG5cdFx0XHRjbGVhclZhbHVlVGV4dDogJ0NsZWFyIHZhbHVlJyxcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlLFxuXHRcdFx0c2VhcmNoUHJvbXB0VGV4dDogJ1R5cGUgdG8gc2VhcmNoJyxcblx0XHRcdG5hbWU6IHVuZGVmaW5lZCxcblx0XHRcdG9uQ2hhbmdlOiB1bmRlZmluZWQsXG5cdFx0XHRjbGFzc05hbWU6IHVuZGVmaW5lZCxcblx0XHRcdG1hdGNoUG9zOiAnYW55Jyxcblx0XHRcdG1hdGNoUHJvcDogJ2FueScsXG5cdFx0XHRhY2Nlc3NpYmxlTGFiZWw6IFwiQ2hvb3NlIGEgdmFsdWVcIlxuXHRcdH07XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Lypcblx0XHRcdCAqIHNldCBieSBnZXRTdGF0ZUZyb21WYWx1ZSBvbiBjb21wb25lbnRXaWxsTW91bnQ6XG5cdFx0XHQgKiAtIHZhbHVlXG5cdFx0XHQgKiAtIHZhbHVlc1xuXHRcdFx0ICogLSBmaWx0ZXJlZE9wdGlvbnNcblx0XHRcdCAqIC0gaW5wdXRWYWx1ZVxuXHRcdFx0ICogLSBwbGFjZWhvbGRlclxuXHRcdFx0ICogLSBmb2N1c2VkT3B0aW9uXG5cdFx0XHQqL1xuXHRcdFx0b3B0aW9uczogdGhpcy5wcm9wcy5vcHRpb25zLFxuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZSxcblx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0YWxlcnRNZXNzYWdlOiBcIlwiXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX29wdGlvbnNDYWNoZSA9IHt9O1xuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSAnJztcblx0XHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUodGhpcy5wcm9wcy52YWx1ZSkpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuYXN5bmNPcHRpb25zICYmIHRoaXMucHJvcHMuYXV0b2xvYWQpIHtcblx0XHRcdHRoaXMuYXV0b2xvYWRBc3luY09wdGlvbnMoKTtcblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9ibHVyVGltZW91dCk7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzVGltZW91dCk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpIHtcblx0XHRpZiAobmV3UHJvcHMudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWUpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21WYWx1ZShuZXdQcm9wcy52YWx1ZSwgbmV3UHJvcHMub3B0aW9ucykpO1xuXHRcdH1cblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMub3B0aW9ucykgIT09IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMub3B0aW9ucykpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRvcHRpb25zOiBuZXdQcm9wcy5vcHRpb25zLFxuXHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IHRoaXMuZmlsdGVyT3B0aW9ucyhuZXdQcm9wcy5vcHRpb25zKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl9ibHVyVGltZW91dCk7XG5cdFx0XHR0aGlzLl9mb2N1c1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmdldElucHV0Tm9kZSgpLmZvY3VzKCk7XG5cdFx0XHRcdHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUgPSBmYWxzZTtcblx0XHRcdH0uYmluZCh0aGlzKSwgNTApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsKSB7XG5cdFx0XHRpZiAodGhpcy5yZWZzLmZvY3VzZWQgJiYgdGhpcy5yZWZzLm1lbnUpIHtcblx0XHRcdFx0dmFyIGZvY3VzZWRET00gPSB0aGlzLnJlZnMuZm9jdXNlZC5nZXRET01Ob2RlKCk7XG5cdFx0XHRcdHZhciBtZW51RE9NID0gdGhpcy5yZWZzLm1lbnUuZ2V0RE9NTm9kZSgpO1xuXHRcdFx0XHR2YXIgZm9jdXNlZFJlY3QgPSBmb2N1c2VkRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHR2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRcdGlmIChmb2N1c2VkUmVjdC5ib3R0b20gPiBtZW51UmVjdC5ib3R0b20gfHxcblx0XHRcdFx0XHRmb2N1c2VkUmVjdC50b3AgPCBtZW51UmVjdC50b3ApIHtcblx0XHRcdFx0XHRtZW51RE9NLnNjcm9sbFRvcCA9IChmb2N1c2VkRE9NLm9mZnNldFRvcCArIGZvY3VzZWRET00uY2xpZW50SGVpZ2h0IC0gbWVudURPTS5vZmZzZXRIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZih0aGlzLnN0YXRlLmFsZXJ0TWVzc2FnZSAhPT0gXCJcIikge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0YWxlcnRNZXNzYWdlOiBcIlwiXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgNTAwKTtcblx0XHRcdFxuXHRcdH1cblx0fSxcblxuXHRnZXRTdGF0ZUZyb21WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcblxuXHRcdGlmICghb3B0aW9ucykge1xuXHRcdFx0b3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucztcblx0XHR9XG5cblx0XHQvLyByZXNldCBpbnRlcm5hbCBmaWx0ZXIgc3RyaW5nXG5cdFx0dGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZyA9ICcnO1xuXG5cdFx0dmFyIHZhbHVlcyA9IHRoaXMuaW5pdFZhbHVlc0FycmF5KHZhbHVlLCBvcHRpb25zKSxcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyhvcHRpb25zLCB2YWx1ZXMpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB2YWx1ZXMubWFwKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHYudmFsdWU7IH0pLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpLFxuXHRcdFx0dmFsdWVzOiB2YWx1ZXMsXG5cdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdGZpbHRlcmVkT3B0aW9uczogZmlsdGVyZWRPcHRpb25zLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0ubGFiZWwgOiB0aGlzLnByb3BzLnBsYWNlaG9sZGVyLFxuXHRcdFx0Zm9jdXNlZE9wdGlvbjogIXRoaXMucHJvcHMubXVsdGkgJiYgdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1swXSA6IGZpbHRlcmVkT3B0aW9uc1swXVxuXHRcdH07XG5cblx0fSxcblxuXHRpbml0VmFsdWVzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlcywgb3B0aW9ucykge1xuXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcblx0XHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlcykge1xuXHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQodGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsdWVzID0gdmFsdWVzID8gW3ZhbHVlc10gOiBbXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbih2YWwpIHtcblx0XHRcdHJldHVybiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWwpID8gdmFsID0gXy5maW5kV2hlcmUob3B0aW9ucywgeyB2YWx1ZTogdmFsIH0pIHx8IHsgdmFsdWU6IHZhbCwgbGFiZWw6IHZhbCB9IDogdmFsO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0fSxcblxuXHRzZXRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gdHJ1ZTtcblx0XHR2YXIgbmV3U3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVZhbHVlKHZhbHVlKTtcblx0XHRuZXdTdGF0ZS5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmZpcmVDaGFuZ2VFdmVudChuZXdTdGF0ZSk7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cblx0c2VsZWN0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0Ly8gdGhpc1t0aGlzLnByb3BzLm11bHRpID8gJ2FkZFZhbHVlJyA6ICdzZXRWYWx1ZSddKHZhbHVlKTtcblx0XHRpZiAoIXRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuYWRkVmFsdWUodmFsdWUpO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHthbGVydE1lc3NhZ2U6IHZhbHVlLmxhYmVsICsgXCIgc2VsZWN0ZWRcIn0pO1xuXHRcdFxuXHR9LFxuXG5cdGFkZFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZXMuY29uY2F0KHZhbHVlKSk7XG5cdH0sXG5cblx0cG9wVmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUoXy5pbml0aWFsKHRoaXMuc3RhdGUudmFsdWVzKSk7XG5cdH0sXG5cblx0cmVtb3ZlVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZShfLndpdGhvdXQodGhpcy5zdGF0ZS52YWx1ZXMsIHZhbHVlKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7YWxlcnRNZXNzYWdlOiB2YWx1ZS5sYWJlbCArIFwiIHJlbW92ZWRcIn0pO1xuXHR9LFxuXG5cdGNsZWFyVmFsdWU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxuXHRcdGlmIChldmVudCAmJiBldmVudC50eXBlID09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnNldFZhbHVlKG51bGwpO1xuXHR9LFxuXG5cdHJlc2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZSk7XG5cdH0sXG5cblx0Z2V0SW5wdXROb2RlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGlucHV0ID0gdGhpcy5yZWZzLmlucHV0O1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnNlYXJjaGFibGUgPyBpbnB1dCA6IGlucHV0LmdldERPTU5vZGUoKTtcblx0fSxcblxuXHRmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG5cdFx0aWYgKG5ld1N0YXRlLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlICYmIHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UobmV3U3RhdGUudmFsdWUsIG5ld1N0YXRlLnZhbHVlcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG5cdFx0Ly8gaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0Ly8gYnV0dG9uLCBvciBpZiB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLCBpZ25vcmUgaXQuXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbigpO1xuXHRcdFxuXHR9LFxuXHRoYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNGb2N1c2VkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlXG5cdFx0XHRcdC8vYWxlcnRNZXNzYWdlOiB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggKyBcIiBvcHRpb25zIGF2YWlsYWJsZS4gXCIgKyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24ubGFiZWwgKyBcIiBjdXJyZW50bHkgZm9jdXNlZC5cIlxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0SW5wdXROb2RlKCkuZm9jdXMoKTsgLy9pcyB0aGlzIGFjdHVhbGx5IG5lZWRlZD8gSGFkIHRvIG1hbnVhbGx5IHNldCBmb2N1cyBzdGF0ZSBmb3IgYSBrZXlib2FyZCBuYXYgZml4LiBcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2lzRm9jdXNlZDogdHJ1ZX0pO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3Blbk1lbnUgPSB0aGlzLnN0YXRlLmlzT3BlbiB8fCB0aGlzLl9vcGVuQWZ0ZXJGb2N1c1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNGb2N1c2VkOiB0cnVlLFxuXHRcdFx0aXNPcGVuOiBvcGVuTWVudSxcblx0XHRcdGFsZXJ0TWVzc2FnZTogKG9wZW5NZW51KSA/IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiIDogXCJcIlxuXHRcdH0pO1xuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRCbHVyOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSByZXR1cm47XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpLCA1MCk7XG5cdH0sXG5cblx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdGlmKHRoaXMuc3RhdGUuZGlzYWJsZWQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblxuXHRcdFx0Y2FzZSA4OiAvLyBiYWNrc3BhY2Vcblx0XHRcdFx0aWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIHtcblx0XHRcdFx0XHR0aGlzLnBvcFZhbHVlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgOTogLy8gdGFiXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCAhdGhpcy5zdGF0ZS5pc09wZW4gfHwgIXRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbikge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDEzOiAvLyBlbnRlclxuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcblx0XHRcdFx0XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAyNzogLy8gZXNjYXBlXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0XHRcdHRoaXMucmVzZXRWYWx1ZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuY2xlYXJWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAzODogLy8gdXBcblx0XHRcdFx0dGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA0MDogLy8gZG93blxuXHRcdFx0XHR0aGlzLmZvY3VzTmV4dE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzI6IC8vc3BhY2UgdG8gb3BlbiBkcm9wIGRvd25cblxuXHRcdFx0XHRpZih0aGlzLnN0YXRlLmlzT3BlbiAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHRoaXMuaGFuZGxlTW91c2VEb3duSW1wbGVtZW50YXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0XHRcdGFsZXJ0TWVzc2FnZTogdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLmxhYmVsICsgXCIgY3VycmVudGx5IGZvY3VzZWQuXCJcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdFx0ZGVmYXVsdDogcmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHQvL3ByZXZlbnQgZGVmYXVsdCBhY3Rpb24gb2Ygd2hhdGV2ZXIga2V5IHdhcyBwcmVzc2VkXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHR9LFxuXG5cdC8vVGhpcyBmdW5jdGlvbiBoYW5kbGVzIGtleWJvYXJkIHRleHQgaW5wdXQgZm9yIGZpbHRlcmluZyBvcHRpb25zXG5cdGhhbmRsZUlucHV0Q2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdC8vIGFzc2lnbiBhbiBpbnRlcm5hbCB2YXJpYWJsZSBiZWNhdXNlIHdlIG5lZWQgdG8gdXNlXG5cdFx0Ly8gdGhlIGxhdGVzdCB2YWx1ZSBiZWZvcmUgc2V0U3RhdGUoKSBoYXMgY29tcGxldGVkLlxuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSBldmVudC50YXJnZXQudmFsdWU7XG5cdFx0dmFyIHRoYXQgPSB0aGlzOyBcblx0XHR2YXIgZmlsdGVyZWRPcHRpb25zID0gdGhpcy5maWx0ZXJPcHRpb25zKHRoaXMuc3RhdGUub3B0aW9ucyk7XG5cdFx0dmFyIGZvY3VzZWRPcHRpb24gPSBfLmNvbnRhaW5zKGZpbHRlcmVkT3B0aW9ucywgdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSA/IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA6IGZpbHRlcmVkT3B0aW9uc1swXTtcblxuXHRcdGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzTG9hZGluZzogdHJ1ZSxcblx0XHRcdFx0aW5wdXRWYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiBmb2N1c2VkT3B0aW9uLFxuXHRcdFx0XHRhbGVydE1lc3NhZ2U6IGZpbHRlcmVkT3B0aW9ucy5sZW5ndGggKyBcIiBvcHRpb25zIGF2YWlsYWJsZS4gXCIgKyBmb2N1c2VkT3B0aW9uLmxhYmVsICsgXCIgY3VycmVudGx5IGZvY3VzZWQuXCJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5sb2FkQXN5bmNPcHRpb25zKGV2ZW50LnRhcmdldC52YWx1ZSwge1xuXHRcdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0XHRpc09wZW46IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0XHRhbGVydE1lc3NhZ2U6IGZpbHRlcmVkT3B0aW9ucy5sZW5ndGggKyBcIiBvcHRpb25zIGF2YWlsYWJsZS4gXCIgKyBmb2N1c2VkT3B0aW9uLmxhYmVsICsgXCIgY3VycmVudGx5IGZvY3VzZWQuXCIsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IGZvY3VzZWRPcHRpb25cblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9LFxuXG5cdGF1dG9sb2FkQXN5bmNPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmxvYWRBc3luY09wdGlvbnMoJycsIHt9LCBmdW5jdGlvbigpIHt9KTtcblx0fSxcblxuXHRsb2FkQXN5bmNPcHRpb25zOiBmdW5jdGlvbihpbnB1dCwgc3RhdGUpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgY2FjaGVLZXkgPSBpbnB1dC5zbGljZSgwLCBpKTtcblx0XHRcdGlmICh0aGlzLl9vcHRpb25zQ2FjaGVbY2FjaGVLZXldICYmIChpbnB1dCA9PT0gY2FjaGVLZXkgfHwgdGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XS5jb21wbGV0ZSkpIHtcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zQ2FjaGVbY2FjaGVLZXldLm9wdGlvbnM7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoXy5leHRlbmQoe1xuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMob3B0aW9ucylcblx0XHRcdFx0fSwgc3RhdGUpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciB0aGlzUmVxdWVzdElkID0gdGhpcy5fY3VycmVudFJlcXVlc3RJZCA9IHJlcXVlc3RJZCsrO1xuXG5cdFx0dGhpcy5wcm9wcy5hc3luY09wdGlvbnMoaW5wdXQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuXG5cdFx0XHR0aGlzLl9vcHRpb25zQ2FjaGVbaW5wdXRdID0gZGF0YTtcblxuXHRcdFx0aWYgKHRoaXNSZXF1ZXN0SWQgIT09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNldFN0YXRlKF8uZXh0ZW5kKHtcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zLFxuXHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IHRoaXMuZmlsdGVyT3B0aW9ucyhkYXRhLm9wdGlvbnMpXG5cdFx0XHR9LCBzdGF0ZSkpO1xuXG5cdFx0fS5iaW5kKHRoaXMpKTtcblxuXHR9LFxuXG5cdGZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMsIHZhbHVlcykge1xuXHRcdGlmICghdGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG5cdFx0XHRyZXR1cm4gb3B0aW9ucztcblx0XHR9XG5cblx0XHR2YXIgZmlsdGVyVmFsdWUgPSB0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nO1xuXHRcdHZhciBleGNsdWRlID0gKHZhbHVlcyB8fCB0aGlzLnN0YXRlLnZhbHVlcykubWFwKGZ1bmN0aW9uKGkpIHtcblx0XHRcdHJldHVybiBpLnZhbHVlO1xuXHRcdH0pO1xuXHRcdGlmICh0aGlzLnByb3BzLmZpbHRlck9wdGlvbnMpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3BzLmZpbHRlck9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zLCBmaWx0ZXJWYWx1ZSwgZXhjbHVkZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBmaWx0ZXJPcHRpb24gPSBmdW5jdGlvbihvcCkge1xuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSAmJiBfLmNvbnRhaW5zKGV4Y2x1ZGUsIG9wLnZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb24pIHJldHVybiB0aGlzLnByb3BzLmZpbHRlck9wdGlvbi5jYWxsKHRoaXMsIG9wLCBmaWx0ZXJWYWx1ZSk7XG5cdFx0XHRcdHJldHVybiAhZmlsdGVyVmFsdWUgfHwgKHRoaXMucHJvcHMubWF0Y2hQb3MgPT09ICdzdGFydCcpID8gKFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiBvcC52YWx1ZS50b0xvd2VyQ2FzZSgpLnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSkgfHxcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgb3AubGFiZWwudG9Mb3dlckNhc2UoKS5zdWJzdHIoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpXG5cdFx0XHRcdCkgOiAoXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIG9wLnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB8fFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBvcC5sYWJlbC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMClcblx0XHRcdFx0KTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIob3B0aW9ucywgZmlsdGVyT3B0aW9uLCB0aGlzKTtcblx0XHR9XG5cdH0sXG5cblx0c2VsZWN0Rm9jdXNlZE9wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuc2VsZWN0VmFsdWUodGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKTtcblx0fSxcblxuXHRmb2N1c09wdGlvbjogZnVuY3Rpb24ob3ApIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGZvY3VzZWRPcHRpb246IG9wXG5cdFx0fSk7XG5cdH0sXG5cblx0Zm9jdXNOZXh0T3B0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ25leHQnKTtcblx0fSxcblxuXHRmb2N1c1ByZXZpb3VzT3B0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ3ByZXZpb3VzJyk7XG5cdH0sXG5cblx0Zm9jdXNBZGphY2VudE9wdGlvbjogZnVuY3Rpb24oZGlyKSB7XG5cdFx0dGhpcy5fZm9jdXNlZE9wdGlvblJldmVhbCA9IHRydWU7XG5cblx0XHR2YXIgb3BzID0gdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnM7XG5cblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bkltcGxlbWVudGF0aW9uKCk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0XHRhbGVydE1lc3NhZ2U6IG9wcy5sZW5ndGggKyBcIiBvcHRpb25zIGF2YWlsYWJsZS4gXCIgKyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24ubGFiZWwgKyBcIiBjdXJyZW50bHkgZm9jdXNlZC5cIixcblx0XHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiB8fCBvcHNbZGlyID09PSAnbmV4dCcgPyAwIDogb3BzLmxlbmd0aCAtIDFdXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIW9wcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZm9jdXNlZEluZGV4ID0gLTE7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA9PT0gb3BzW2ldKSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IGk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBmb2N1c2VkT3B0aW9uID0gb3BzWzBdO1xuXG5cdFx0aWYgKGRpciA9PT0gJ25leHQnICYmIGZvY3VzZWRJbmRleCA+IC0xICYmIGZvY3VzZWRJbmRleCA8IG9wcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRmb2N1c2VkT3B0aW9uID0gb3BzW2ZvY3VzZWRJbmRleCArIDFdO1xuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAncHJldmlvdXMnKSB7XG5cdFx0XHRpZiAoZm9jdXNlZEluZGV4ID4gMCkge1xuXHRcdFx0XHRmb2N1c2VkT3B0aW9uID0gb3BzW2ZvY3VzZWRJbmRleCAtIDFdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tvcHMubGVuZ3RoIC0gMV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBmb2N1c2VkT3B0aW9uLFxuXHRcdFx0aW5wdXRWYWx1ZTogZm9jdXNlZE9wdGlvbi5sYWJlbCxcblx0XHRcdGFsZXJ0TWVzc2FnZTogZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLiBQcmVzcyBlbnRlciB0byBzZWxlY3QuXCJcblx0XHR9KTtcblxuXHR9LFxuXG5cdHVuZm9jdXNPcHRpb246IGZ1bmN0aW9uKG9wKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA9PT0gb3ApIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiBudWxsXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cbiAgc3dhcEZvY3VzOiBmdW5jdGlvbiAobGlzdCwgb2xkRm9jdXNJbmRleCwgbmV3Rm9jdXNJbmRleCkge1xuICAgIGlmKCFsaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIWxpc3Rbb2xkRm9jdXNJbmRleF0gfHwgIWxpc3RbbmV3Rm9jdXNJbmRleF0pIHtcbiAgICBcdHJldHVybjtcbiAgICB9XG5cbiAgICBpZigoIW5ld0ZvY3VzSW5kZXggJiYgbmV3Rm9jdXNJbmRleCAhPT0gMCkgfHwgb2xkRm9jdXNJbmRleCA9PT0gbmV3Rm9jdXNJbmRleCkge1xuICAgIFx0cmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBvbGRGb2N1c1JlcGxhY2VtZW50ID0gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKFxuICAgICAgbGlzdFtvbGRGb2N1c0luZGV4XSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBsaXN0W29sZEZvY3VzSW5kZXhdLmtleSxcbiAgICAgICAgcmVmOiBudWxsXG4gICAgICB9XG4gICAgKTtcblxuICAgIHZhciBuZXdGb2N1c1JlcGxhY2VtZW50ID0gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKFxuICAgICAgbGlzdFtuZXdGb2N1c0luZGV4XSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBsaXN0W25ld0ZvY3VzSW5kZXhdLmtleSxcbiAgICAgICAgcmVmOiBcImZvY3VzZWRcIlxuICAgICAgfVxuICAgICk7XG5cbiAgICAvL2Nsb25lV2l0aFByb3BzIGFwcGVuZHMgY2xhc3NlcywgYnV0IGRvZXMgbm90IHJlcGxhY2UgdGhlbSwgd2hpY2ggaXMgd2hhdCBJIHdhbnQgaGVyZVxuICAgIG9sZEZvY3VzUmVwbGFjZW1lbnQucHJvcHMuY2xhc3NOYW1lID0gXCJTZWxlY3Qtb3B0aW9uXCI7XG4gICAgbmV3Rm9jdXNSZXBsYWNlbWVudC5wcm9wcy5jbGFzc05hbWUgPSBcIlNlbGVjdC1vcHRpb24gaXMtZm9jdXNlZFwiO1xuXG4gICAgdGhpcy5jYWNoZWRGb2N1c2VkSXRlbUluZGV4ID0gbmV3Rm9jdXNJbmRleDtcblxuICAgIHRoaXMuY2FjaGVkTWVudS5zcGxpY2Uob2xkRm9jdXNJbmRleCwgMSwgb2xkRm9jdXNSZXBsYWNlbWVudCk7XG4gICAgdGhpcy5jYWNoZWRNZW51LnNwbGljZShuZXdGb2N1c0luZGV4LCAxLCBuZXdGb2N1c1JlcGxhY2VtZW50KTtcbiAgfSxcblxuICBjYWNoZWRGb2N1c2VkSXRlbUluZGV4OiAwLFxuICBjYWNoZWRMaXN0SXRlbXNJbmRleExvb2t1cDoge30sXG4gIGNhY2hlZE1lbnU6IFtdLFxuICBjYWNoZWRGaWx0ZXJlZDogW10sXG5cbiAgYnVpbGRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZvY3VzZWRWYWx1ZSA9IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA/IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi52YWx1ZSA6IG51bGw7XG5cbiAgICBpZih0aGlzLmNhY2hlZEZpbHRlcmVkID09IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zKVxuICAgIHtcbiAgICAgIHRoaXMuc3dhcEZvY3VzKHRoaXMuY2FjaGVkTWVudSwgdGhpcy5jYWNoZWRGb2N1c2VkSXRlbUluZGV4LCB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwW2ZvY3VzZWRWYWx1ZV0pO1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkTWVudTtcbiAgICB9XG5cbiAgICB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwID0ge307XG5cblx0XHR2YXIgb3BzID0gXy5tYXAodGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMsIGZ1bmN0aW9uKG9wLCBpbmRleCkge1xuXG5cdFx0XHR2YXIgaXNGb2N1c2VkID0gZm9jdXNlZFZhbHVlID09PSBvcC52YWx1ZTtcblxuXHRcdFx0dmFyIG9wdGlvbkNsYXNzID0gY2xhc3Nlcyh7XG5cdFx0XHRcdCdTZWxlY3Qtb3B0aW9uJzogdHJ1ZSxcblx0XHRcdFx0J2lzLWZvY3VzZWQnOiBpc0ZvY3VzZWRcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgcmVmID0gaXNGb2N1c2VkID8gJ2ZvY3VzZWQnIDogbnVsbDtcblxuXHRcdFx0dmFyIG1vdXNlRW50ZXIgPSB0aGlzLmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZUxlYXZlID0gdGhpcy51bmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZURvd24gPSB0aGlzLnNlbGVjdFZhbHVlLmJpbmQodGhpcywgb3ApO1xuXG4gICAgICB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwW29wLnZhbHVlXSA9IGluZGV4O1xuICAgICAgdmFyIGNoZWNrTWFyayA9IFwiXCI7XG4gICAgICBpZihpc0ZvY3VzZWQpXG4gICAgICB7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9jdXNlZEl0ZW0gPSBpbmRleDtcbiAgICAgICAgY2hlY2tNYXJrID0gXCIgU2VsZWN0ZWRcIjtcbiAgICAgIH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIDxhIHJvbGU9XCJsaXN0aXRlbVwiIGFyaWEtbGFiZWw9e29wLmxhYmVsICsgY2hlY2tNYXJrfSByZWY9e3JlZn0ga2V5PXsnb3B0aW9uLScgKyBvcC52YWx1ZX0gY2xhc3NOYW1lPXtvcHRpb25DbGFzc30gb25Nb3VzZUVudGVyPXttb3VzZUVudGVyfSBvbk1vdXNlTGVhdmU9e21vdXNlTGVhdmV9IG9uTW91c2VEb3duPXttb3VzZURvd259IG9uQ2xpY2s9e21vdXNlRG93bn0+e29wLmxhYmVsfTwvYT47XG5cdFx0XHRcblx0XHR9LCB0aGlzKTtcblxuXHRcdHJldHVybiBvcHMubGVuZ3RoID8gb3BzIDogKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3Qtbm9yZXN1bHRzXCI+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyAmJiAhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlID8gdGhpcy5wcm9wcy5zZWFyY2hQcm9tcHRUZXh0IDogdGhpcy5wcm9wcy5ub1Jlc3VsdHNUZXh0fVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblxuXHR9LFxuXG5cdGJ1aWxkQ3VzdG9tTWVudTogZnVuY3Rpb24oKSB7ICAgIFxuXHQgICAgaWYoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHtcblx0ICAgIFx0cmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgXHR2YXIgY2hpbGQgPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXG5cdCAgXHRyZXR1cm4gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKGNoaWxkLCB7XG5cdFx0ICAgIG9uU2VsZWN0SXRlbTogdGhpcy5zZWxlY3RWYWx1ZSxcblx0XHQgICAgb3B0aW9uczogdGhpcy5wcm9wcy5vcHRpb25zLFxuXHRcdCAgICBmaWx0ZXJlZDogdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMsXG5cdFx0ICAgIGlucHV0VmFsdWU6IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSxcblx0XHQgICAgZm9jdXNzZWRJdGVtOiB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24sXG5cdFx0ICAgIG9uRm9jdXNJdGVtOiB0aGlzLmZvY3VzT3B0aW9uLFxuXHRcdCAgICBvblVuZm9jdXNJdGVtOiB0aGlzLnVuZm9jdXNPcHRpb25cblx0ICBcdH0pO1xuXHR9LFxuXHRzd2l0Y2hGb2N1czogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5nZXRJbnB1dE5vZGUoKS5mb2N1cygpO1xuXHR9LFxuXHRcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBzZWxlY3RDbGFzcyA9IGNsYXNzZXMoJ1NlbGVjdCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lLCB7XG5cdFx0XHQnaXMtbXVsdGknOiB0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0J2lzLXNlYXJjaGFibGUnOiB0aGlzLnByb3BzLnNlYXJjaGFibGUsXG5cdFx0XHQnaXMtb3Blbic6IHRoaXMuc3RhdGUuaXNPcGVuLFxuXHRcdFx0J2lzLWZvY3VzZWQnOiB0aGlzLnN0YXRlLmlzRm9jdXNlZCxcblx0XHRcdCdpcy1sb2FkaW5nJzogdGhpcy5zdGF0ZS5pc0xvYWRpbmcsXG5cdFx0XHQnaXMtZGlzYWJsZWQnIDogdGhpcy5wcm9wcy5kaXNhYmxlZCxcblx0XHRcdCdoYXMtdmFsdWUnOiB0aGlzLnN0YXRlLnZhbHVlXG5cdFx0fSk7XG5cblx0XHR2YXIgdmFsdWUgPSBbXTtcblxuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR0aGlzLnN0YXRlLnZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHR2YXIgcHJvcHMgPSBfLmV4dGVuZCh7XG5cdFx0XHRcdFx0a2V5OiB2YWwudmFsdWUsXG5cdFx0XHRcdFx0b25SZW1vdmU6IHRoaXMucmVtb3ZlVmFsdWUuYmluZCh0aGlzLCB2YWwpXG5cdFx0XHRcdH0sIHZhbCk7XG5cdFx0XHRcdHZhbHVlLnB1c2goPFZhbHVlIHsuLi5wcm9wc30gLz4pO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUgJiYgKCF0aGlzLnByb3BzLm11bHRpIHx8ICF2YWx1ZS5sZW5ndGgpKSkge1xuXHRcdFx0dmFsdWUucHVzaCg8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzTmFtZT1cIlNlbGVjdC1wbGFjZWhvbGRlclwiIGtleT1cInBsYWNlaG9sZGVyXCI+e3RoaXMuc3RhdGUucGxhY2Vob2xkZXJ9PC9kaXY+KTtcblx0XHR9XG5cblx0XHR2YXIgbG9hZGluZyA9IHRoaXMuc3RhdGUuaXNMb2FkaW5nID8gPHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWxvYWRpbmdcIiBhcmlhLWhpZGRlbj1cInRydWVcIiAvPiA6IG51bGw7XG5cdFx0dmFyIGNsZWFyID0gdGhpcy5wcm9wcy5jbGVhcmFibGUgJiYgdGhpcy5zdGF0ZS52YWx1ZSAmJiAhdGhpcy5wcm9wcy5kaXNhYmxlZCA/IDxzcGFuIHJvbGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJTZWxlY3QtY2xlYXJcIiB0aXRsZT17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH0gYXJpYS1sYWJlbD17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH0gb25Nb3VzZURvd249e3RoaXMuY2xlYXJWYWx1ZX0gb25DbGljaz17dGhpcy5jbGVhclZhbHVlfSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6ICcmdGltZXM7JyB9fSAvPiA6IG51bGw7XG5cdFx0dmFyIGJ1aWx0TWVudSA9IHRoaXMucHJvcHMuYnVpbGRDdXN0b21NZW51ID8gdGhpcy5wcm9wcy5idWlsZEN1c3RvbU1lbnUodGhpcy5zZWxlY3RWYWx1ZSwgdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMsIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiwgdGhpcy5mb2N1c09wdGlvbiwgdGhpcy51bmZvY3VzT3B0aW9uKSA6IHRoaXMuYnVpbGRNZW51KCk7XG5cdFx0Ly8gdmFyIGJ1aWx0TWVudSA9IHRoaXMucHJvcHMuY2hpbGRyZW4gPyB0aGlzLmJ1aWxkQ3VzdG9tTWVudSgpIDogdGhpcy5idWlsZE1lbnUoKTtcblxuXHQgICAgdGhpcy5jYWNoZWRGaWx0ZXJlZCA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuXHQgICAgdGhpcy5jYWNoZWRNZW51ID0gYnVpbHRNZW51O1xuXG5cdFx0dmFyIG1lbnUgPSB0aGlzLnN0YXRlLmlzT3BlbiA/IDxkaXYgaWQ9XCJTZWxlY3QtbWVudVwiIHJlZj1cIm1lbnVcIiBjbGFzc05hbWU9XCJTZWxlY3QtbWVudVwiPntidWlsdE1lbnV9PC9kaXY+IDogbnVsbDtcblxuXHRcdHZhciBoaWRlVmlzdWFsbHlTdHlsZXMgPSB7XG5cdFx0ICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0ICAgIGxlZnQ6IFwiLTk5OTk5OXB4XCIsXG5cdFx0ICAgIHRvcDogXCJhdXRvXCIsXG5cdFx0ICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuXHRcdCAgICBoZWlnaHQ6IFwiMXB4XCIsXG5cdFx0ICAgIHdpZHRoOiBcIjFweFwiXG5cdFx0fTtcblxuXHRcdHZhciBtb3ZlSW5wdXRGb2N1c0Zvck11bHRpID0gXCJcIjtcblx0XHR2YXIgc3VtbWFyeUxhYmVsTWFpbklucHV0LCBoaWRlTWFpbklucHV0ID0gZmFsc2U7XG5cdFx0dmFyIGN1cnJlbnRTZWxlY3Rpb25UZXh0ID0gdGhpcy5zdGF0ZS5wbGFjZWhvbGRlcjtcblx0XHQvL2hhbmRsZSBtdWx0aSBzZWxlY3QgYXJpYSBub3RpZmljYXRpb24gb3JkZXIgZGlmZmVyZW50bHkgYmVjYXVzZSBvZiB0aGUgcmVtb3ZlIGJ1dHRvbnNcblx0XHRpZih0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR2YXIgdmFsdWVMaXN0ID0gdGhpcy5zdGF0ZS52YWx1ZXM7IFxuXHRcdFx0aWYodmFsdWVMaXN0Lmxlbmd0aCA+IDEpXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ID0gXCJcIlxuXHRcdFx0XHR2YWx1ZUxpc3QuZm9yRWFjaChmdW5jdGlvbih2YWwsIGluZGV4KSB7XG5cdFx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gU3RyaW5nKHZhbC5sYWJlbCk7XG5cdFx0XHRcdFx0aWYoaW5kZXggPCAodmFsdWVMaXN0Lmxlbmd0aCAtIDEpKVxuXHRcdFx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gXCIsIFwiO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gXCIgY3VycmVudGx5IHNlbGVjdGVkLlwiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWx1ZUxpc3QubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ID0gdmFsdWVMaXN0WzBdLmxhYmVsICsgXCIgY3VycmVudGx5IHNlbGVjdGVkLlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRtb3ZlSW5wdXRGb2N1c0Zvck11bHRpID0gPGlucHV0IFxuXHRcdFx0XHRcdFx0c3R5bGU9e2hpZGVWaXN1YWxseVN0eWxlc31cblx0XHRcdFx0XHRcdGFyaWEtbGFiZWw9e2N1cnJlbnRTZWxlY3Rpb25UZXh0ICsgXCIsIFwiICsgdGhpcy5wcm9wcy5hY2Nlc3NpYmxlTGFiZWwgKyBcIiwgQ29tYm9ib3guIFByZXNzIGRvd24gYXJyb3cga2V5IHRvIG9wZW4gc2VsZWN0IG9wdGlvbnMgb3Igc3RhcnQgdHlwaW5nIGZvciBvcHRpb25zIHRvIGJlIGZpbHRlcmVkLiBVc2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZSBvcHRpb25zLiBQcmVzcyBlbnRlciB0byBzZWxlY3QgYW4gb3B0aW9uLlwifVxuXHRcdFx0XHRcdFx0b25Gb2N1cz17dGhpcy5zd2l0Y2hGb2N1c30gbWluV2lkdGg9XCI1XCIgLz47XG5cdFx0XHRzdW1tYXJ5TGFiZWxNYWluSW5wdXQgPSBcIlwiO1xuXHRcdFx0aGlkZU1haW5JbnB1dCA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c3VtbWFyeUxhYmVsTWFpbklucHV0ID0gY3VycmVudFNlbGVjdGlvblRleHQgKyBcIiwgXCIgKyB0aGlzLnByb3BzLmFjY2Vzc2libGVMYWJlbCArIFwiLCBDb21ib2JveC4gUHJlc3MgZG93biBhcnJvdyBrZXkgdG8gb3BlbiBzZWxlY3Qgb3B0aW9ucyBvciBzdGFydCB0eXBpbmcgZm9yIG9wdGlvbnMgdG8gYmUgZmlsdGVyZWQuIFVzZSB1cCBhbmQgZG93biBhcnJvdyBrZXlzIHRvIG5hdmlnYXRlIG9wdGlvbnMuIFByZXNzIGVudGVyIHRvIHNlbGVjdCBhbiBvcHRpb24uXCI7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbW1vblByb3BzID0ge1xuXHRcdFx0cmVmOiAnaW5wdXQnLFxuXHRcdFx0Y2xhc3NOYW1lOiAnU2VsZWN0LWlucHV0Jyxcblx0XHRcdHRhYkluZGV4OiB0aGlzLnByb3BzLnRhYkluZGV4IHx8IDAsXG5cdFx0XHRvbkZvY3VzOiB0aGlzLmhhbmRsZUlucHV0Rm9jdXMsXG5cdFx0XHRvbkJsdXI6IHRoaXMuaGFuZGxlSW5wdXRCbHVyXG5cdFx0fTtcblxuXHRcdHZhciBpbnB1dDtcblxuXHRcdGlmICh0aGlzLnByb3BzLnNlYXJjaGFibGUgJiYgIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcblx0XHRcdGlucHV0ID0gPElucHV0IFxuXHRcdFx0XHRhcmlhLWhpZGRlbj17aGlkZU1haW5JbnB1dH1cblx0XHRcdFx0YXJpYS1sYWJlbD17c3VtbWFyeUxhYmVsTWFpbklucHV0fVxuXHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfSBcblx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuaGFuZGxlSW5wdXRDaGFuZ2V9IFxuXHRcdFx0XHRtaW5XaWR0aD1cIjVcIiBcblx0XHRcdFx0ey4uLmNvbW1vblByb3BzfSAvPjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHN1bW1hcnlMYWJlbE5vblNlYXJjaGFibGUgPSBjdXJyZW50U2VsZWN0aW9uVGV4dCArIFwiLCBcIiArIHRoaXMucHJvcHMuYWNjZXNzaWJsZUxhYmVsICsgXCIsIENvbWJvYm94LiBQcmVzcyBkb3duIGFycm93IGtleSB0byBvcGVuIHNlbGVjdCBvcHRpb25zLiBVc2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZSBvcHRpb25zLiBQcmVzcyBlbnRlciB0byBzZWxlY3QgYW4gb3B0aW9uLiBUeXBpbmcgd2lsbCBub3QgZmlsdGVyIG9wdGlvbnMsIHRoaXMgaXMgYSBub24tc2VhcmNoYWJsZSBjb21ib2JveC5cIjtcblx0XHRcdGlucHV0ID0gPGRpdiBcblx0XHRcdFx0YXJpYS1sYWJlbD17c3VtbWFyeUxhYmVsTm9uU2VhcmNoYWJsZX1cblx0XHRcdFx0ey4uLmNvbW1vblByb3BzfT4mbmJzcDtcblx0XHRcdFx0PC9kaXY+O1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IHJlZj1cIndyYXBwZXJcIiBjbGFzc05hbWU9e3NlbGVjdENsYXNzfT5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJoaWRkZW5cIiByZWY9XCJ2YWx1ZVwiIG5hbWU9e3RoaXMucHJvcHMubmFtZX0gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC1jb250cm9sXCIgcmVmPVwiY29udHJvbFwiIG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufSBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259IG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlTW91c2VEb3dufT5cblx0XHRcdFx0XHR7bW92ZUlucHV0Rm9jdXNGb3JNdWx0aX1cblx0XHRcdFx0XHR7dmFsdWV9XG5cdFx0XHRcdFx0e2lucHV0fVxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1hcnJvd1wiIC8+XG5cdFx0XHRcdFx0e2xvYWRpbmd9XG5cdFx0XHRcdFx0e2NsZWFyfVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHR7bWVudX1cblx0XHRcdFx0PGRpdiB0YWJJbmRleD1cIi0xXCIgc3R5bGU9e2hpZGVWaXN1YWxseVN0eWxlc30gaWQ9XCJhbGVydC1vcHRpb25zXCIgcm9sZT1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkVuZCBvZiBzZWxlY3RcIj57dGhpcy5zdGF0ZS5hbGVydE1lc3NhZ2V9PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXG5cdFx0KTtcblxuXHR9XG5cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0O1xuIl19
