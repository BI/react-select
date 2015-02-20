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
      console.log("not focused");
      this._openAfterFocus = true;
      this.getInputNode().focus(); //is this actually needed? Had to manually call handleInputFocus for a keyboard nav fix.
      this.handleInputFocus();
    }
  },

  handleInputFocus: function () {
    console.log("HANDLE FOCUS");
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
    }).bind(this), 500);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL0N1c3RvbU1lbnVNaXhpbi5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL1ZhbHVlLmpzIiwiL1VzZXJzL2FuZHJld2Jsb3dlL1Byb2plY3RzL3VzYWlkL3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksZUFBZSxHQUFHO0FBQ3BCLFdBQVMsRUFBRTtBQUNULGdCQUFZLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFdBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUN4RCxZQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDekQsY0FBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNsQyxnQkFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNwQyxlQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2pDLGlCQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0dBQ3BDOztBQUVELGNBQVksRUFBRTtBQUNa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O0tBRW5JLENBR0w7R0FFRjs7Q0FFRCxDQUFDLENBQUM7OztBQUdILE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGNsYXNzbmFtZXMoKSB7XG5cdHZhciBhcmdzID0gYXJndW1lbnRzLCBjbGFzc2VzID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChhcmdzW2ldICYmICdzdHJpbmcnID09PSB0eXBlb2YgYXJnc1tpXSkge1xuXHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZ3NbaV0pO1xuXHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmdzW2ldKSB7XG5cdFx0XHRjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoT2JqZWN0LmtleXMoYXJnc1tpXSkuZmlsdGVyKGZ1bmN0aW9uKGNscykge1xuXHRcdFx0XHRyZXR1cm4gYXJnc1tpXVtjbHNdO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzbmFtZXM7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ3VzdG9tTWVudU1peGluID0ge1xuICBwcm9wVHlwZXM6IHtcbiAgICBvblNlbGVjdEl0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLFxuICAgIGZpbHRlcmVkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpbnB1dFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZvY3Vzc2VkSXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBkZWZhdWx0UHJvcHM6IHtcbiAgICBvblNlbGVjdEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHt9LFxuICAgIG9wdGlvbnM6IFtdLFxuICAgIGZpbHRlcmVkOiBbXSxcbiAgICBpbnB1dFZhbHVlOiBudWxsLFxuICAgIGZvY3Vzc2VkSXRlbTogbnVsbCxcbiAgICBvbkZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge30sXG4gICAgb25VbmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge31cbiAgfSxcblxuICBzZWxlY3RJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdEl0ZW0oaXRlbSk7XG4gIH0sXG5cbiAgZm9jdXNJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vbkZvY3VzSXRlbShpdGVtKTtcbiAgfSxcblxuICB1bmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHJvcHMub25VbmZvY3VzSXRlbShpdGVtKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b21NZW51TWl4aW47IiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0Y2xhc3NlcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIE9wdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XG5cdGRpc3BsYXlOYW1lOiAnVmFsdWUnLFxuXHRcblx0cHJvcFR5cGVzOiB7XG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXHRcblx0YmxvY2tFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LWl0ZW1cIiByb2xlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblJlbW92ZX0gYXJpYS1sYWJlbD17XCJSZW1vdmUgXCIgKyB0aGlzLnByb3BzLmxhYmVsfT5cblx0XHRcdFx0PHNwYW4gIGNsYXNzTmFtZT1cIlNlbGVjdC1pdGVtLWljb25cIiBvbk1vdXNlRG93bj17dGhpcy5ibG9ja0V2ZW50fSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uUmVtb3ZlfSBvblRvdWNoRW5kPXt0aGlzLnByb3BzLm9uUmVtb3ZlfT4mdGltZXM7PC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtaXRlbS1sYWJlbFwiPnt0aGlzLnByb3BzLmxhYmVsfTwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblx0XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblx0UmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKSxcblx0SW5wdXQgPSByZXF1aXJlKCdyZWFjdC1pbnB1dC1hdXRvc2l6ZScpLFxuXHRjbGFzc2VzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpLFxuXHRWYWx1ZSA9IHJlcXVpcmUoJy4vVmFsdWUnKSxcblx0Q3VzdG9tTWVudU1peGluID0gcmVxdWlyZSgnLi9DdXN0b21NZW51TWl4aW4uanMnKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cblxudmFyIFNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1NlbGVjdCcsXG5cblx0c3RhdGljczoge1xuXHRcdEN1c3RvbU1lbnVNaXhpbjogQ3VzdG9tTWVudU1peGluXG5cdH0sXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgICAgICAgIC8vIGluaXRpYWwgZmllbGQgdmFsdWVcblx0XHRtdWx0aTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gbXVsdGktdmFsdWUgaW5wdXRcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGRpc2FibGVkIG9yIG5vdFxuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSwgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXG5cdFx0ZGVsaW1pdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIGRlbGltaXRlciB0byB1c2UgdG8gam9pbiBtdWx0aXBsZSB2YWx1ZXNcblx0XHRhc3luY09wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gZnVuY3Rpb24gdG8gY2FsbCB0byBnZXQgb3B0aW9uc1xuXHRcdGF1dG9sb2FkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyB3aGV0aGVyIHRvIGF1dG8tbG9hZCB0aGUgZGVmYXVsdCBhc3luYyBvcHRpb25zIHNldFxuXHRcdHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxuXHRcdG5vUmVzdWx0c1RleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAvLyBwbGFjZWhvbGRlciBkaXNwbGF5ZWQgd2hlbiB0aGVyZSBhcmUgbm8gbWF0Y2hpbmcgc2VhcmNoIHJlc3VsdHNcblx0XHRjbGVhcmFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gc2hvdWxkIGl0IGJlIHBvc3NpYmxlIHRvIHJlc2V0IHZhbHVlXG5cdFx0Y2xlYXJWYWx1ZVRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2xcblx0XHRjbGVhckFsbFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbCB3aGVuIG11bHRpOiB0cnVlXG5cdFx0c2VhcmNoYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIHNlYXJjaGluZyBmZWF0dXJlIG9yIG5vdFxuXHRcdHNlYXJjaFByb21wdFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAvLyBsYWJlbCB0byBwcm9tcHQgZm9yIHNlYXJjaCBpbnB1dFxuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAvLyBmaWVsZCBuYW1lLCBmb3IgaGlkZGVuIDxpbnB1dCAvPiB0YWdcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgLy8gb25DaGFuZ2UgaGFuZGxlcjogZnVuY3Rpb24obmV3VmFsdWUpIHt9XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIGNsYXNzTmFtZSBmb3IgdGhlIG91dGVyIGVsZW1lbnRcblx0XHRmaWx0ZXJPcHRpb246IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gbWV0aG9kIHRvIGZpbHRlciBhIHNpbmdsZSBvcHRpb246IGZ1bmN0aW9uKG9wdGlvbiwgZmlsdGVyU3RyaW5nKVxuXHRcdGZpbHRlck9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAvLyBtZXRob2QgdG8gZmlsdGVyIHRoZSBvcHRpb25zIGFycmF5OiBmdW5jdGlvbihbb3B0aW9uc10sIGZpbHRlclN0cmluZywgW3ZhbHVlc10pXG5cdFx0bWF0Y2hQb3M6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIChhbnl8c3RhcnQpIG1hdGNoIHRoZSBzdGFydCBvciBlbnRpcmUgc3RyaW5nIHdoZW4gZmlsdGVyaW5nXG5cdFx0bWF0Y2hQcm9wOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIChhbnl8bGFiZWx8dmFsdWUpIHdoaWNoIG9wdGlvbiBwcm9wZXJ0eSB0byBmaWx0ZXIgb25cblx0XHRhY2Nlc3NpYmxlTGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxuXHRcdFx0b3B0aW9uczogW10sXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRkZWxpbWl0ZXI6ICcsJyxcblx0XHRcdGFzeW5jT3B0aW9uczogdW5kZWZpbmVkLFxuXHRcdFx0YXV0b2xvYWQ6IHRydWUsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ1NlbGVjdC4uLicsXG5cdFx0XHRub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG5cdFx0XHRjbGVhcmFibGU6IHRydWUsXG5cdFx0XHRjbGVhclZhbHVlVGV4dDogJ0NsZWFyIHZhbHVlJyxcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlLFxuXHRcdFx0c2VhcmNoUHJvbXB0VGV4dDogJ1R5cGUgdG8gc2VhcmNoJyxcblx0XHRcdG5hbWU6IHVuZGVmaW5lZCxcblx0XHRcdG9uQ2hhbmdlOiB1bmRlZmluZWQsXG5cdFx0XHRjbGFzc05hbWU6IHVuZGVmaW5lZCxcblx0XHRcdG1hdGNoUG9zOiAnYW55Jyxcblx0XHRcdG1hdGNoUHJvcDogJ2FueScsXG5cdFx0XHRhY2Nlc3NpYmxlTGFiZWw6IFwiQ2hvb3NlIGEgdmFsdWVcIlxuXHRcdH07XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Lypcblx0XHRcdCAqIHNldCBieSBnZXRTdGF0ZUZyb21WYWx1ZSBvbiBjb21wb25lbnRXaWxsTW91bnQ6XG5cdFx0XHQgKiAtIHZhbHVlXG5cdFx0XHQgKiAtIHZhbHVlc1xuXHRcdFx0ICogLSBmaWx0ZXJlZE9wdGlvbnNcblx0XHRcdCAqIC0gaW5wdXRWYWx1ZVxuXHRcdFx0ICogLSBwbGFjZWhvbGRlclxuXHRcdFx0ICogLSBmb2N1c2VkT3B0aW9uXG5cdFx0XHQqL1xuXHRcdFx0b3B0aW9uczogdGhpcy5wcm9wcy5vcHRpb25zLFxuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZSxcblx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0YWxlcnRNZXNzYWdlOiBcIlwiXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX29wdGlvbnNDYWNoZSA9IHt9O1xuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSAnJztcblx0XHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUodGhpcy5wcm9wcy52YWx1ZSkpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuYXN5bmNPcHRpb25zICYmIHRoaXMucHJvcHMuYXV0b2xvYWQpIHtcblx0XHRcdHRoaXMuYXV0b2xvYWRBc3luY09wdGlvbnMoKTtcblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9ibHVyVGltZW91dCk7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzVGltZW91dCk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpIHtcblx0XHRpZiAobmV3UHJvcHMudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWUpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21WYWx1ZShuZXdQcm9wcy52YWx1ZSwgbmV3UHJvcHMub3B0aW9ucykpO1xuXHRcdH1cblx0XHRpZiAoSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMub3B0aW9ucykgIT09IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMub3B0aW9ucykpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRvcHRpb25zOiBuZXdQcm9wcy5vcHRpb25zLFxuXHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IHRoaXMuZmlsdGVyT3B0aW9ucyhuZXdQcm9wcy5vcHRpb25zKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl9ibHVyVGltZW91dCk7XG5cdFx0XHR0aGlzLl9mb2N1c1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmdldElucHV0Tm9kZSgpLmZvY3VzKCk7XG5cdFx0XHRcdHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUgPSBmYWxzZTtcblx0XHRcdH0uYmluZCh0aGlzKSwgNTApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsKSB7XG5cdFx0XHRpZiAodGhpcy5yZWZzLmZvY3VzZWQgJiYgdGhpcy5yZWZzLm1lbnUpIHtcblx0XHRcdFx0dmFyIGZvY3VzZWRET00gPSB0aGlzLnJlZnMuZm9jdXNlZC5nZXRET01Ob2RlKCk7XG5cdFx0XHRcdHZhciBtZW51RE9NID0gdGhpcy5yZWZzLm1lbnUuZ2V0RE9NTm9kZSgpO1xuXHRcdFx0XHR2YXIgZm9jdXNlZFJlY3QgPSBmb2N1c2VkRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHR2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRcdGlmIChmb2N1c2VkUmVjdC5ib3R0b20gPiBtZW51UmVjdC5ib3R0b20gfHxcblx0XHRcdFx0XHRmb2N1c2VkUmVjdC50b3AgPCBtZW51UmVjdC50b3ApIHtcblx0XHRcdFx0XHRtZW51RE9NLnNjcm9sbFRvcCA9IChmb2N1c2VkRE9NLm9mZnNldFRvcCArIGZvY3VzZWRET00uY2xpZW50SGVpZ2h0IC0gbWVudURPTS5vZmZzZXRIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZih0aGlzLnN0YXRlLmFsZXJ0TWVzc2FnZSAhPT0gXCJcIikge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhhdC5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0YWxlcnRNZXNzYWdlOiBcIlwiXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgNTAwKTtcblx0XHRcdFxuXHRcdH1cblx0fSxcblxuXHRnZXRTdGF0ZUZyb21WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcblxuXHRcdGlmICghb3B0aW9ucykge1xuXHRcdFx0b3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucztcblx0XHR9XG5cblx0XHQvLyByZXNldCBpbnRlcm5hbCBmaWx0ZXIgc3RyaW5nXG5cdFx0dGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZyA9ICcnO1xuXG5cdFx0dmFyIHZhbHVlcyA9IHRoaXMuaW5pdFZhbHVlc0FycmF5KHZhbHVlLCBvcHRpb25zKSxcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyhvcHRpb25zLCB2YWx1ZXMpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB2YWx1ZXMubWFwKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHYudmFsdWU7IH0pLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpLFxuXHRcdFx0dmFsdWVzOiB2YWx1ZXMsXG5cdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdGZpbHRlcmVkT3B0aW9uczogZmlsdGVyZWRPcHRpb25zLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0ubGFiZWwgOiB0aGlzLnByb3BzLnBsYWNlaG9sZGVyLFxuXHRcdFx0Zm9jdXNlZE9wdGlvbjogIXRoaXMucHJvcHMubXVsdGkgJiYgdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1swXSA6IGZpbHRlcmVkT3B0aW9uc1swXVxuXHRcdH07XG5cblx0fSxcblxuXHRpbml0VmFsdWVzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlcywgb3B0aW9ucykge1xuXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcblx0XHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlcykge1xuXHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQodGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsdWVzID0gdmFsdWVzID8gW3ZhbHVlc10gOiBbXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbih2YWwpIHtcblx0XHRcdHJldHVybiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWwpID8gdmFsID0gXy5maW5kV2hlcmUob3B0aW9ucywgeyB2YWx1ZTogdmFsIH0pIHx8IHsgdmFsdWU6IHZhbCwgbGFiZWw6IHZhbCB9IDogdmFsO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0fSxcblxuXHRzZXRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gdHJ1ZTtcblx0XHR2YXIgbmV3U3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVZhbHVlKHZhbHVlKTtcblx0XHRuZXdTdGF0ZS5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmZpcmVDaGFuZ2VFdmVudChuZXdTdGF0ZSk7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cblx0c2VsZWN0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0Ly8gdGhpc1t0aGlzLnByb3BzLm11bHRpID8gJ2FkZFZhbHVlJyA6ICdzZXRWYWx1ZSddKHZhbHVlKTtcblx0XHRpZiAoIXRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuYWRkVmFsdWUodmFsdWUpO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHthbGVydE1lc3NhZ2U6IHZhbHVlLmxhYmVsICsgXCIgc2VsZWN0ZWRcIn0pO1xuXHRcdFxuXHR9LFxuXG5cdGFkZFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZXMuY29uY2F0KHZhbHVlKSk7XG5cdH0sXG5cblx0cG9wVmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUoXy5pbml0aWFsKHRoaXMuc3RhdGUudmFsdWVzKSk7XG5cdH0sXG5cblx0cmVtb3ZlVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZShfLndpdGhvdXQodGhpcy5zdGF0ZS52YWx1ZXMsIHZhbHVlKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7YWxlcnRNZXNzYWdlOiB2YWx1ZS5sYWJlbCArIFwiIHJlbW92ZWRcIn0pO1xuXHR9LFxuXG5cdGNsZWFyVmFsdWU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxuXHRcdGlmIChldmVudCAmJiBldmVudC50eXBlID09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnNldFZhbHVlKG51bGwpO1xuXHR9LFxuXG5cdHJlc2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZSk7XG5cdH0sXG5cblx0Z2V0SW5wdXROb2RlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGlucHV0ID0gdGhpcy5yZWZzLmlucHV0O1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnNlYXJjaGFibGUgPyBpbnB1dCA6IGlucHV0LmdldERPTU5vZGUoKTtcblx0fSxcblxuXHRmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG5cdFx0aWYgKG5ld1N0YXRlLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlICYmIHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UobmV3U3RhdGUudmFsdWUsIG5ld1N0YXRlLnZhbHVlcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG5cdFx0Ly8gaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0Ly8gYnV0dG9uLCBvciBpZiB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLCBpZ25vcmUgaXQuXG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbigpO1xuXHRcdFxuXHR9LFxuXHRoYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNGb2N1c2VkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlXG5cdFx0XHRcdC8vYWxlcnRNZXNzYWdlOiB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggKyBcIiBvcHRpb25zIGF2YWlsYWJsZS4gXCIgKyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24ubGFiZWwgKyBcIiBjdXJyZW50bHkgZm9jdXNlZC5cIlxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwibm90IGZvY3VzZWRcIilcblx0XHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0SW5wdXROb2RlKCkuZm9jdXMoKTsgLy9pcyB0aGlzIGFjdHVhbGx5IG5lZWRlZD8gSGFkIHRvIG1hbnVhbGx5IGNhbGwgaGFuZGxlSW5wdXRGb2N1cyBmb3IgYSBrZXlib2FyZCBuYXYgZml4LiBcblx0XHRcdHRoaXMuaGFuZGxlSW5wdXRGb2N1cygpO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbigpIHtcblx0XHRjb25zb2xlLmxvZyhcIkhBTkRMRSBGT0NVU1wiKTtcblx0XHR2YXIgb3Blbk1lbnUgPSB0aGlzLnN0YXRlLmlzT3BlbiB8fCB0aGlzLl9vcGVuQWZ0ZXJGb2N1c1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNGb2N1c2VkOiB0cnVlLFxuXHRcdFx0aXNPcGVuOiBvcGVuTWVudSxcblx0XHRcdGFsZXJ0TWVzc2FnZTogKG9wZW5NZW51KSA/IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiIDogXCJcIlxuXHRcdH0pO1xuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRCbHVyOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSByZXR1cm47XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpLCA1MDApO1xuXHR9LFxuXG5cdGhhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cblx0XHRpZih0aGlzLnN0YXRlLmRpc2FibGVkKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0c3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG5cblx0XHRcdGNhc2UgODogLy8gYmFja3NwYWNlXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy5wb3BWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDk6IC8vIHRhYlxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgfHwgIXRoaXMuc3RhdGUuaXNPcGVuIHx8ICF0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxMzogLy8gZW50ZXJcblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRcdFxuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMjc6IC8vIGVzY2FwZVxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdFx0XHR0aGlzLnJlc2V0VmFsdWUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmNsZWFyVmFsdWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzg6IC8vIHVwXG5cdFx0XHRcdHRoaXMuZm9jdXNQcmV2aW91c09wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNDA6IC8vIGRvd25cblx0XHRcdFx0dGhpcy5mb2N1c05leHRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDMyOiAvL3NwYWNlIHRvIG9wZW4gZHJvcCBkb3duXG5cblx0XHRcdFx0aWYodGhpcy5zdGF0ZS5pc09wZW4gIT09IHRydWUpIHtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bkltcGxlbWVudGF0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdFx0XHRhbGVydE1lc3NhZ2U6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGRlZmF1bHQ6IHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly9wcmV2ZW50IGRlZmF1bHQgYWN0aW9uIG9mIHdoYXRldmVyIGtleSB3YXMgcHJlc3NlZFxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fSxcblxuXHQvL1RoaXMgZnVuY3Rpb24gaGFuZGxlcyBrZXlib2FyZCB0ZXh0IGlucHV0IGZvciBmaWx0ZXJpbmcgb3B0aW9uc1xuXHRoYW5kbGVJbnB1dENoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBhc3NpZ24gYW4gaW50ZXJuYWwgdmFyaWFibGUgYmVjYXVzZSB3ZSBuZWVkIHRvIHVzZVxuXHRcdC8vIHRoZSBsYXRlc3QgdmFsdWUgYmVmb3JlIHNldFN0YXRlKCkgaGFzIGNvbXBsZXRlZC5cblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXHRcdHZhciB0aGF0ID0gdGhpczsgXG5cdFx0dmFyIGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyh0aGlzLnN0YXRlLm9wdGlvbnMpO1xuXHRcdHZhciBmb2N1c2VkT3B0aW9uID0gXy5jb250YWlucyhmaWx0ZXJlZE9wdGlvbnMsIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbikgPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gOiBmaWx0ZXJlZE9wdGlvbnNbMF07XG5cblx0XHRpZiAodGhpcy5wcm9wcy5hc3luY09wdGlvbnMpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0xvYWRpbmc6IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogZm9jdXNlZE9wdGlvbixcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBmaWx0ZXJlZE9wdGlvbnMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMubG9hZEFzeW5jT3B0aW9ucyhldmVudC50YXJnZXQudmFsdWUsIHtcblx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0aXNPcGVuOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBmaWx0ZXJlZE9wdGlvbnMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG5cdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogZmlsdGVyZWRPcHRpb25zLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiBmb2N1c2VkT3B0aW9uXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSxcblxuXHRhdXRvbG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5sb2FkQXN5bmNPcHRpb25zKCcnLCB7fSwgZnVuY3Rpb24oKSB7fSk7XG5cdH0sXG5cblx0bG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIHN0YXRlKSB7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBpbnB1dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGNhY2hlS2V5ID0gaW5wdXQuc2xpY2UoMCwgaSk7XG5cdFx0XHRpZiAodGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IHRoaXMuX29wdGlvbnNDYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XS5vcHRpb25zO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKF8uZXh0ZW5kKHtcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRpb25zLFxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zKG9wdGlvbnMpXG5cdFx0XHRcdH0sIHN0YXRlKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgdGhpc1JlcXVlc3RJZCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQgPSByZXF1ZXN0SWQrKztcblxuXHRcdHRoaXMucHJvcHMuYXN5bmNPcHRpb25zKGlucHV0LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcblxuXHRcdFx0dGhpcy5fb3B0aW9uc0NhY2hlW2lucHV0XSA9IGRhdGE7XG5cblx0XHRcdGlmICh0aGlzUmVxdWVzdElkICE9PSB0aGlzLl9jdXJyZW50UmVxdWVzdElkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zZXRTdGF0ZShfLmV4dGVuZCh7XG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEub3B0aW9ucyxcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMoZGF0YS5vcHRpb25zKVxuXHRcdFx0fSwgc3RhdGUpKTtcblxuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0fSxcblxuXHRmaWx0ZXJPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zLCB2YWx1ZXMpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XG5cdFx0fVxuXG5cdFx0dmFyIGZpbHRlclZhbHVlID0gdGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZztcblx0XHR2YXIgZXhjbHVkZSA9ICh2YWx1ZXMgfHwgdGhpcy5zdGF0ZS52YWx1ZXMpLm1hcChmdW5jdGlvbihpKSB7XG5cdFx0XHRyZXR1cm4gaS52YWx1ZTtcblx0XHR9KTtcblx0XHRpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zLmNhbGwodGhpcywgb3B0aW9ucywgZmlsdGVyVmFsdWUsIGV4Y2x1ZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgZmlsdGVyT3B0aW9uID0gZnVuY3Rpb24ob3ApIHtcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMubXVsdGkgJiYgXy5jb250YWlucyhleGNsdWRlLCBvcC52YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uKSByZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb24uY2FsbCh0aGlzLCBvcCwgZmlsdGVyVmFsdWUpO1xuXHRcdFx0XHRyZXR1cm4gIWZpbHRlclZhbHVlIHx8ICh0aGlzLnByb3BzLm1hdGNoUG9zID09PSAnc3RhcnQnKSA/IChcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgb3AudmFsdWUudG9Mb3dlckNhc2UoKS5zdWJzdHIoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpIHx8XG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnICYmIG9wLmxhYmVsLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKVxuXHRcdFx0XHQpIDogKFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiBvcC52YWx1ZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMCkgfHxcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgb3AubGFiZWwudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDApXG5cdFx0XHRcdCk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIF8uZmlsdGVyKG9wdGlvbnMsIGZpbHRlck9wdGlvbiwgdGhpcyk7XG5cdFx0fVxuXHR9LFxuXG5cdHNlbGVjdEZvY3VzZWRPcHRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnNlbGVjdFZhbHVlKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbik7XG5cdH0sXG5cblx0Zm9jdXNPcHRpb246IGZ1bmN0aW9uKG9wKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBvcFxuXHRcdH0pO1xuXHR9LFxuXG5cdGZvY3VzTmV4dE9wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCduZXh0Jyk7XG5cdH0sXG5cblx0Zm9jdXNQcmV2aW91c09wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwcmV2aW91cycpO1xuXHR9LFxuXG5cdGZvY3VzQWRqYWNlbnRPcHRpb246IGZ1bmN0aW9uKGRpcikge1xuXHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSB0cnVlO1xuXG5cdFx0dmFyIG9wcyA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuXG5cdFx0aWYgKCF0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0dGhpcy5oYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbigpO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBvcHMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLmxhYmVsICsgXCIgY3VycmVudGx5IGZvY3VzZWQuXCIsXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gfHwgb3BzW2RpciA9PT0gJ25leHQnID8gMCA6IG9wcy5sZW5ndGggLSAxXVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFvcHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZvY3VzZWRJbmRleCA9IC0xO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPT09IG9wc1tpXSkge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZm9jdXNlZE9wdGlvbiA9IG9wc1swXTtcblxuXHRcdGlmIChkaXIgPT09ICduZXh0JyAmJiBmb2N1c2VkSW5kZXggPiAtMSAmJiBmb2N1c2VkSW5kZXggPCBvcHMubGVuZ3RoIC0gMSkge1xuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tmb2N1c2VkSW5kZXggKyAxXTtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3ByZXZpb3VzJykge1xuXHRcdFx0aWYgKGZvY3VzZWRJbmRleCA+IDApIHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tmb2N1c2VkSW5kZXggLSAxXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRPcHRpb24gPSBvcHNbb3BzLmxlbmd0aCAtIDFdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZE9wdGlvbjogZm9jdXNlZE9wdGlvbixcblx0XHRcdGlucHV0VmFsdWU6IGZvY3VzZWRPcHRpb24ubGFiZWwsXG5cdFx0XHRhbGVydE1lc3NhZ2U6IGZvY3VzZWRPcHRpb24ubGFiZWwgKyBcIiBjdXJyZW50bHkgZm9jdXNlZC4gUHJlc3MgZW50ZXIgdG8gc2VsZWN0LlwiXG5cdFx0fSk7XG5cblx0fSxcblxuXHR1bmZvY3VzT3B0aW9uOiBmdW5jdGlvbihvcCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPT09IG9wKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogbnVsbFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG4gIHN3YXBGb2N1czogZnVuY3Rpb24gKGxpc3QsIG9sZEZvY3VzSW5kZXgsIG5ld0ZvY3VzSW5kZXgpIHtcbiAgICBpZighbGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCFsaXN0W29sZEZvY3VzSW5kZXhdIHx8ICFsaXN0W25ld0ZvY3VzSW5kZXhdKSB7XG4gICAgXHRyZXR1cm47XG4gICAgfVxuXG4gICAgaWYoKCFuZXdGb2N1c0luZGV4ICYmIG5ld0ZvY3VzSW5kZXggIT09IDApIHx8IG9sZEZvY3VzSW5kZXggPT09IG5ld0ZvY3VzSW5kZXgpIHtcbiAgICBcdHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgb2xkRm9jdXNSZXBsYWNlbWVudCA9IFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhcbiAgICAgIGxpc3Rbb2xkRm9jdXNJbmRleF0sXG4gICAgICB7XG4gICAgICAgIGtleTogbGlzdFtvbGRGb2N1c0luZGV4XS5rZXksXG4gICAgICAgIHJlZjogbnVsbFxuICAgICAgfVxuICAgICk7XG5cbiAgICB2YXIgbmV3Rm9jdXNSZXBsYWNlbWVudCA9IFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhcbiAgICAgIGxpc3RbbmV3Rm9jdXNJbmRleF0sXG4gICAgICB7XG4gICAgICAgIGtleTogbGlzdFtuZXdGb2N1c0luZGV4XS5rZXksXG4gICAgICAgIHJlZjogXCJmb2N1c2VkXCJcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy9jbG9uZVdpdGhQcm9wcyBhcHBlbmRzIGNsYXNzZXMsIGJ1dCBkb2VzIG5vdCByZXBsYWNlIHRoZW0sIHdoaWNoIGlzIHdoYXQgSSB3YW50IGhlcmVcbiAgICBvbGRGb2N1c1JlcGxhY2VtZW50LnByb3BzLmNsYXNzTmFtZSA9IFwiU2VsZWN0LW9wdGlvblwiO1xuICAgIG5ld0ZvY3VzUmVwbGFjZW1lbnQucHJvcHMuY2xhc3NOYW1lID0gXCJTZWxlY3Qtb3B0aW9uIGlzLWZvY3VzZWRcIjtcblxuICAgIHRoaXMuY2FjaGVkRm9jdXNlZEl0ZW1JbmRleCA9IG5ld0ZvY3VzSW5kZXg7XG5cbiAgICB0aGlzLmNhY2hlZE1lbnUuc3BsaWNlKG9sZEZvY3VzSW5kZXgsIDEsIG9sZEZvY3VzUmVwbGFjZW1lbnQpO1xuICAgIHRoaXMuY2FjaGVkTWVudS5zcGxpY2UobmV3Rm9jdXNJbmRleCwgMSwgbmV3Rm9jdXNSZXBsYWNlbWVudCk7XG4gIH0sXG5cbiAgY2FjaGVkRm9jdXNlZEl0ZW1JbmRleDogMCxcbiAgY2FjaGVkTGlzdEl0ZW1zSW5kZXhMb29rdXA6IHt9LFxuICBjYWNoZWRNZW51OiBbXSxcbiAgY2FjaGVkRmlsdGVyZWQ6IFtdLFxuXG4gIGJ1aWxkTWVudTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmb2N1c2VkVmFsdWUgPSB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24udmFsdWUgOiBudWxsO1xuXG4gICAgaWYodGhpcy5jYWNoZWRGaWx0ZXJlZCA9PSB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucylcbiAgICB7XG4gICAgICB0aGlzLnN3YXBGb2N1cyh0aGlzLmNhY2hlZE1lbnUsIHRoaXMuY2FjaGVkRm9jdXNlZEl0ZW1JbmRleCwgdGhpcy5jYWNoZWRMaXN0SXRlbXNJbmRleExvb2t1cFtmb2N1c2VkVmFsdWVdKTtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlZE1lbnU7XG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZWRMaXN0SXRlbXNJbmRleExvb2t1cCA9IHt9O1xuXG5cdFx0dmFyIG9wcyA9IF8ubWFwKHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLCBmdW5jdGlvbihvcCwgaW5kZXgpIHtcblxuXHRcdFx0dmFyIGlzRm9jdXNlZCA9IGZvY3VzZWRWYWx1ZSA9PT0gb3AudmFsdWU7XG5cblx0XHRcdHZhciBvcHRpb25DbGFzcyA9IGNsYXNzZXMoe1xuXHRcdFx0XHQnU2VsZWN0LW9wdGlvbic6IHRydWUsXG5cdFx0XHRcdCdpcy1mb2N1c2VkJzogaXNGb2N1c2VkXG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIHJlZiA9IGlzRm9jdXNlZCA/ICdmb2N1c2VkJyA6IG51bGw7XG5cblx0XHRcdHZhciBtb3VzZUVudGVyID0gdGhpcy5mb2N1c09wdGlvbi5iaW5kKHRoaXMsIG9wKSxcblx0XHRcdFx0bW91c2VMZWF2ZSA9IHRoaXMudW5mb2N1c09wdGlvbi5iaW5kKHRoaXMsIG9wKSxcblx0XHRcdFx0bW91c2VEb3duID0gdGhpcy5zZWxlY3RWYWx1ZS5iaW5kKHRoaXMsIG9wKTtcblxuICAgICAgdGhpcy5jYWNoZWRMaXN0SXRlbXNJbmRleExvb2t1cFtvcC52YWx1ZV0gPSBpbmRleDtcbiAgICAgIHZhciBjaGVja01hcmsgPSBcIlwiO1xuICAgICAgaWYoaXNGb2N1c2VkKVxuICAgICAge1xuICAgICAgICB0aGlzLmNhY2hlZEZvY3VzZWRJdGVtID0gaW5kZXg7XG4gICAgICAgIGNoZWNrTWFyayA9IFwiIFNlbGVjdGVkXCI7XG4gICAgICB9XG5cdFx0XHRcblx0XHRcdHJldHVybiA8YSByb2xlPVwibGlzdGl0ZW1cIiBhcmlhLWxhYmVsPXtvcC5sYWJlbCArIGNoZWNrTWFya30gcmVmPXtyZWZ9IGtleT17J29wdGlvbi0nICsgb3AudmFsdWV9IGNsYXNzTmFtZT17b3B0aW9uQ2xhc3N9IG9uTW91c2VFbnRlcj17bW91c2VFbnRlcn0gb25Nb3VzZUxlYXZlPXttb3VzZUxlYXZlfSBvbk1vdXNlRG93bj17bW91c2VEb3dufSBvbkNsaWNrPXttb3VzZURvd259PntvcC5sYWJlbH08L2E+O1xuXHRcdFx0XG5cdFx0fSwgdGhpcyk7XG5cblx0XHRyZXR1cm4gb3BzLmxlbmd0aCA/IG9wcyA6IChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LW5vcmVzdWx0c1wiPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5hc3luY09wdGlvbnMgJiYgIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSA/IHRoaXMucHJvcHMuc2VhcmNoUHJvbXB0VGV4dCA6IHRoaXMucHJvcHMubm9SZXN1bHRzVGV4dH1cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cblx0fSxcblxuXHRidWlsZEN1c3RvbU1lbnU6IGZ1bmN0aW9uKCkgeyAgICBcblx0ICAgIGlmKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG5cdCAgICBcdHJldHVybjtcblx0ICAgIH1cblxuXHQgIFx0dmFyIGNoaWxkID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuXHQgIFx0cmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwge1xuXHRcdCAgICBvblNlbGVjdEl0ZW06IHRoaXMuc2VsZWN0VmFsdWUsXG5cdFx0ICAgIG9wdGlvbnM6IHRoaXMucHJvcHMub3B0aW9ucyxcblx0XHQgICAgZmlsdGVyZWQ6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLFxuXHRcdCAgICBpbnB1dFZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWUsXG5cdFx0ICAgIGZvY3Vzc2VkSXRlbTogdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLFxuXHRcdCAgICBvbkZvY3VzSXRlbTogdGhpcy5mb2N1c09wdGlvbixcblx0XHQgICAgb25VbmZvY3VzSXRlbTogdGhpcy51bmZvY3VzT3B0aW9uXG5cdCAgXHR9KTtcblx0fSxcblx0c3dpdGNoRm9jdXM6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZ2V0SW5wdXROb2RlKCkuZm9jdXMoKTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgc2VsZWN0Q2xhc3MgPSBjbGFzc2VzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J2lzLW11bHRpJzogdGhpcy5wcm9wcy5tdWx0aSxcblx0XHRcdCdpcy1zZWFyY2hhYmxlJzogdGhpcy5wcm9wcy5zZWFyY2hhYmxlLFxuXHRcdFx0J2lzLW9wZW4nOiB0aGlzLnN0YXRlLmlzT3Blbixcblx0XHRcdCdpcy1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQsXG5cdFx0XHQnaXMtbG9hZGluZyc6IHRoaXMuc3RhdGUuaXNMb2FkaW5nLFxuXHRcdFx0J2lzLWRpc2FibGVkJyA6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG5cdFx0XHQnaGFzLXZhbHVlJzogdGhpcy5zdGF0ZS52YWx1ZVxuXHRcdH0pO1xuXG5cdFx0dmFyIHZhbHVlID0gW107XG5cblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xuXHRcdFx0dGhpcy5zdGF0ZS52YWx1ZXMuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0dmFyIHByb3BzID0gXy5leHRlbmQoe1xuXHRcdFx0XHRcdGtleTogdmFsLnZhbHVlLFxuXHRcdFx0XHRcdG9uUmVtb3ZlOiB0aGlzLnJlbW92ZVZhbHVlLmJpbmQodGhpcywgdmFsKVxuXHRcdFx0XHR9LCB2YWwpO1xuXHRcdFx0XHR2YWx1ZS5wdXNoKDxWYWx1ZSB7Li4ucHJvcHN9IC8+KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8ICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmICghdGhpcy5wcm9wcy5tdWx0aSB8fCAhdmFsdWUubGVuZ3RoKSkpIHtcblx0XHRcdHZhbHVlLnB1c2goPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzc05hbWU9XCJTZWxlY3QtcGxhY2Vob2xkZXJcIiBrZXk9XCJwbGFjZWhvbGRlclwiPnt0aGlzLnN0YXRlLnBsYWNlaG9sZGVyfTwvZGl2Pik7XG5cdFx0fVxuXG5cdFx0dmFyIGxvYWRpbmcgPSB0aGlzLnN0YXRlLmlzTG9hZGluZyA/IDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1sb2FkaW5nXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4gOiBudWxsO1xuXHRcdHZhciBjbGVhciA9IHRoaXMucHJvcHMuY2xlYXJhYmxlICYmIHRoaXMuc3RhdGUudmFsdWUgJiYgIXRoaXMucHJvcHMuZGlzYWJsZWQgPyA8c3BhbiByb2xlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyXCIgdGl0bGU9e3RoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHR9IGFyaWEtbGFiZWw9e3RoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHR9IG9uTW91c2VEb3duPXt0aGlzLmNsZWFyVmFsdWV9IG9uQ2xpY2s9e3RoaXMuY2xlYXJWYWx1ZX0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiAnJnRpbWVzOycgfX0gLz4gOiBudWxsO1xuXHRcdHZhciBidWlsdE1lbnUgPSB0aGlzLnByb3BzLmJ1aWxkQ3VzdG9tTWVudSA/IHRoaXMucHJvcHMuYnVpbGRDdXN0b21NZW51KHRoaXMuc2VsZWN0VmFsdWUsIHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLCB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24sIHRoaXMuZm9jdXNPcHRpb24sIHRoaXMudW5mb2N1c09wdGlvbikgOiB0aGlzLmJ1aWxkTWVudSgpO1xuXHRcdC8vIHZhciBidWlsdE1lbnUgPSB0aGlzLnByb3BzLmNoaWxkcmVuID8gdGhpcy5idWlsZEN1c3RvbU1lbnUoKSA6IHRoaXMuYnVpbGRNZW51KCk7XG5cblx0ICAgIHRoaXMuY2FjaGVkRmlsdGVyZWQgPSB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucztcblx0ICAgIHRoaXMuY2FjaGVkTWVudSA9IGJ1aWx0TWVudTtcblxuXHRcdHZhciBtZW51ID0gdGhpcy5zdGF0ZS5pc09wZW4gPyA8ZGl2IGlkPVwiU2VsZWN0LW1lbnVcIiByZWY9XCJtZW51XCIgY2xhc3NOYW1lPVwiU2VsZWN0LW1lbnVcIj57YnVpbHRNZW51fTwvZGl2PiA6IG51bGw7XG5cblx0XHR2YXIgaGlkZVZpc3VhbGx5U3R5bGVzID0ge1xuXHRcdCAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdCAgICBsZWZ0OiBcIi05OTk5OTlweFwiLFxuXHRcdCAgICB0b3A6IFwiYXV0b1wiLFxuXHRcdCAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcblx0XHQgICAgaGVpZ2h0OiBcIjFweFwiLFxuXHRcdCAgICB3aWR0aDogXCIxcHhcIlxuXHRcdH07XG5cblx0XHR2YXIgbW92ZUlucHV0Rm9jdXNGb3JNdWx0aSA9IFwiXCI7XG5cdFx0dmFyIHN1bW1hcnlMYWJlbE1haW5JbnB1dCwgaGlkZU1haW5JbnB1dCA9IGZhbHNlO1xuXHRcdHZhciBjdXJyZW50U2VsZWN0aW9uVGV4dCA9IHRoaXMuc3RhdGUucGxhY2Vob2xkZXI7XG5cdFx0Ly9oYW5kbGUgbXVsdGkgc2VsZWN0IGFyaWEgbm90aWZpY2F0aW9uIG9yZGVyIGRpZmZlcmVudGx5IGJlY2F1c2Ugb2YgdGhlIHJlbW92ZSBidXR0b25zXG5cdFx0aWYodGhpcy5wcm9wcy5tdWx0aSkge1xuXHRcdFx0dmFyIHZhbHVlTGlzdCA9IHRoaXMuc3RhdGUudmFsdWVzOyBcblx0XHRcdGlmKHZhbHVlTGlzdC5sZW5ndGggPiAxKVxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50U2VsZWN0aW9uVGV4dCA9IFwiXCJcblx0XHRcdFx0dmFsdWVMaXN0LmZvckVhY2goZnVuY3Rpb24odmFsLCBpbmRleCkge1xuXHRcdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ICs9IFN0cmluZyh2YWwubGFiZWwpO1xuXHRcdFx0XHRcdGlmKGluZGV4IDwgKHZhbHVlTGlzdC5sZW5ndGggLSAxKSlcblx0XHRcdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ICs9IFwiLCBcIjtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ICs9IFwiIGN1cnJlbnRseSBzZWxlY3RlZC5cIjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodmFsdWVMaXN0Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRjdXJyZW50U2VsZWN0aW9uVGV4dCA9IHZhbHVlTGlzdFswXS5sYWJlbCArIFwiIGN1cnJlbnRseSBzZWxlY3RlZC5cIjtcblx0XHRcdH1cblxuXHRcdFx0bW92ZUlucHV0Rm9jdXNGb3JNdWx0aSA9IDxpbnB1dCBcblx0XHRcdFx0XHRcdHN0eWxlPXtoaWRlVmlzdWFsbHlTdHlsZXN9XG5cdFx0XHRcdFx0XHRhcmlhLWxhYmVsPXtjdXJyZW50U2VsZWN0aW9uVGV4dCArIFwiLCBcIiArIHRoaXMucHJvcHMuYWNjZXNzaWJsZUxhYmVsICsgXCIsIENvbWJvYm94LiBQcmVzcyBkb3duIGFycm93IGtleSB0byBvcGVuIHNlbGVjdCBvcHRpb25zIG9yIHN0YXJ0IHR5cGluZyBmb3Igb3B0aW9ucyB0byBiZSBmaWx0ZXJlZC4gVXNlIHVwIGFuZCBkb3duIGFycm93IGtleXMgdG8gbmF2aWdhdGUgb3B0aW9ucy4gUHJlc3MgZW50ZXIgdG8gc2VsZWN0IGFuIG9wdGlvbi5cIn1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuc3dpdGNoRm9jdXN9IG1pbldpZHRoPVwiNVwiIC8+O1xuXHRcdFx0c3VtbWFyeUxhYmVsTWFpbklucHV0ID0gXCJcIjtcblx0XHRcdGhpZGVNYWluSW5wdXQgPSB0cnVlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHN1bW1hcnlMYWJlbE1haW5JbnB1dCA9IGN1cnJlbnRTZWxlY3Rpb25UZXh0ICsgXCIsIFwiICsgdGhpcy5wcm9wcy5hY2Nlc3NpYmxlTGFiZWwgKyBcIiwgQ29tYm9ib3guIFByZXNzIGRvd24gYXJyb3cga2V5IHRvIG9wZW4gc2VsZWN0IG9wdGlvbnMgb3Igc3RhcnQgdHlwaW5nIGZvciBvcHRpb25zIHRvIGJlIGZpbHRlcmVkLiBVc2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZSBvcHRpb25zLiBQcmVzcyBlbnRlciB0byBzZWxlY3QgYW4gb3B0aW9uLlwiO1xuXHRcdH1cblxuXHRcdHZhciBjb21tb25Qcm9wcyA9IHtcblx0XHRcdHJlZjogJ2lucHV0Jyxcblx0XHRcdGNsYXNzTmFtZTogJ1NlbGVjdC1pbnB1dCcsXG5cdFx0XHR0YWJJbmRleDogdGhpcy5wcm9wcy50YWJJbmRleCB8fCAwLFxuXHRcdFx0b25Gb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLFxuXHRcdFx0b25CbHVyOiB0aGlzLmhhbmRsZUlucHV0Qmx1clxuXHRcdH07XG5cblx0XHR2YXIgaW5wdXQ7XG5cblx0XHRpZiAodGhpcy5wcm9wcy5zZWFyY2hhYmxlICYmICF0aGlzLnByb3BzLmRpc2FibGVkKSB7XG5cdFx0XHRpbnB1dCA9IDxJbnB1dCBcblx0XHRcdFx0YXJpYS1oaWRkZW49e2hpZGVNYWluSW5wdXR9XG5cdFx0XHRcdGFyaWEtbGFiZWw9e3N1bW1hcnlMYWJlbE1haW5JbnB1dH1cblx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX0gXG5cdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfSBcblx0XHRcdFx0bWluV2lkdGg9XCI1XCIgXG5cdFx0XHRcdHsuLi5jb21tb25Qcm9wc30gLz47XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBzdW1tYXJ5TGFiZWxOb25TZWFyY2hhYmxlID0gY3VycmVudFNlbGVjdGlvblRleHQgKyBcIiwgXCIgKyB0aGlzLnByb3BzLmFjY2Vzc2libGVMYWJlbCArIFwiLCBDb21ib2JveC4gUHJlc3MgZG93biBhcnJvdyBrZXkgdG8gb3BlbiBzZWxlY3Qgb3B0aW9ucy4gVXNlIHVwIGFuZCBkb3duIGFycm93IGtleXMgdG8gbmF2aWdhdGUgb3B0aW9ucy4gUHJlc3MgZW50ZXIgdG8gc2VsZWN0IGFuIG9wdGlvbi4gVHlwaW5nIHdpbGwgbm90IGZpbHRlciBvcHRpb25zLCB0aGlzIGlzIGEgbm9uLXNlYXJjaGFibGUgY29tYm9ib3guXCI7XG5cdFx0XHRpbnB1dCA9IDxkaXYgXG5cdFx0XHRcdGFyaWEtbGFiZWw9e3N1bW1hcnlMYWJlbE5vblNlYXJjaGFibGV9XG5cdFx0XHRcdHsuLi5jb21tb25Qcm9wc30+Jm5ic3A7XG5cdFx0XHRcdDwvZGl2Pjtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiByZWY9XCJ3cmFwcGVyXCIgY2xhc3NOYW1lPXtzZWxlY3RDbGFzc30+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgcmVmPVwidmFsdWVcIiBuYW1lPXt0aGlzLnByb3BzLm5hbWV9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0gLz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3QtY29udHJvbFwiIHJlZj1cImNvbnRyb2xcIiBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn0gb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufSBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZU1vdXNlRG93bn0+XG5cdFx0XHRcdFx0e21vdmVJbnB1dEZvY3VzRm9yTXVsdGl9XG5cdFx0XHRcdFx0e3ZhbHVlfVxuXHRcdFx0XHRcdHtpbnB1dH1cblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3dcIiAvPlxuXHRcdFx0XHRcdHtsb2FkaW5nfVxuXHRcdFx0XHRcdHtjbGVhcn1cblx0XHRcdFx0XHRcblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0e21lbnV9XG5cdFx0XHRcdDxkaXYgdGFiSW5kZXg9XCItMVwiIHN0eWxlPXtoaWRlVmlzdWFsbHlTdHlsZXN9IGlkPVwiYWxlcnQtb3B0aW9uc1wiIHJvbGU9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJFbmQgb2Ygc2VsZWN0XCI+e3RoaXMuc3RhdGUuYWxlcnRNZXNzYWdlfTwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cblxuXHRcdCk7XG5cblx0fVxuXG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdDtcbiJdfQ==
