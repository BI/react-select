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
        isOpen: true,
        alertMessage: this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused."
      });
    } else {
      this._openAfterFocus = true;
      this.getInputNode().focus();
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
      inputValue: focusedOption.label
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

    var currentSelectionText = this.state.placeholder;
    //for multi select can't use placeholder for current selection text
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
    }

    var hideVisuallyStyles = {
      position: "absolute",
      left: "-999999px",
      top: "auto",
      overflow: "hidden",
      height: "1px",
      width: "1px"
    };

    var commonProps = {
      ref: "input",
      className: "Select-input",
      tabIndex: this.props.tabIndex || 0,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur };
    var input;

    if (this.props.searchable && !this.props.disabled) {
      input = React.createElement(Input, React.__spread({
        "aria-label": currentSelectionText + ", " + this.props.accessibleLabel + ", Combobox. Press down arrow key to open select options or start typing for options to be filtered. Navigate the options using up and down arrow keys. Press enter to select an option.",
        value: this.state.inputValue,
        onChange: this.handleInputChange,
        minWidth: "5"
      }, commonProps));
    } else {
      input = React.createElement(
        "div",
        commonProps,
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
        value,
        input,
        React.createElement("span", { className: "Select-arrow" }),
        loading,
        clear
      ),
      menu,
      React.createElement(
        "div",
        { tabIndex: "-999", style: hideVisuallyStyles, id: "alert-options", role: "alert", "aria-label": "End of select" },
        this.state.alertMessage
      )
    );
  }

});


module.exports = Select;

},{"./CustomMenuMixin.js":"/Users/andrewblowe/Projects/usaid/react-select/src/CustomMenuMixin.js","./Value":"/Users/andrewblowe/Projects/usaid/react-select/src/Value.js","classnames":"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js","react-input-autosize":false,"react/addons":false,"underscore":false}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL0N1c3RvbU1lbnVNaXhpbi5qcyIsIi9Vc2Vycy9hbmRyZXdibG93ZS9Qcm9qZWN0cy91c2FpZC9yZWFjdC1zZWxlY3Qvc3JjL1ZhbHVlLmpzIiwiL1VzZXJzL2FuZHJld2Jsb3dlL1Byb2plY3RzL3VzYWlkL3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNmQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksZUFBZSxHQUFHO0FBQ3BCLFdBQVMsRUFBRTtBQUNULGdCQUFZLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2xDLFdBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUN4RCxZQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDekQsY0FBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNsQyxnQkFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNwQyxlQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2pDLGlCQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0dBQ3BDOztBQUVELGNBQVksRUFBRTtBQUNa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T0FJRDtNQUlMLElBQUk7TUFFTDs7VUFBSyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsQUFBQyxFQUFDLEVBQUUsRUFBQyxlQUFlLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxjQUFXLGVBQWU7UUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7T0FBTztLQUVySSxDQUdMO0dBRUY7O0NBRUQsQ0FBQyxDQUFDOzs7QUFHSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjbGFzc25hbWVzKCkge1xuXHR2YXIgYXJncyA9IGFyZ3VtZW50cywgY2xhc3NlcyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoYXJnc1tpXSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbaV0pIHtcblx0XHRcdGNsYXNzZXMucHVzaChhcmdzW2ldKTtcblx0XHR9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlb2YgYXJnc1tpXSkge1xuXHRcdFx0Y2xhc3NlcyA9IGNsYXNzZXMuY29uY2F0KE9iamVjdC5rZXlzKGFyZ3NbaV0pLmZpbHRlcihmdW5jdGlvbihjbHMpIHtcblx0XHRcdFx0cmV0dXJuIGFyZ3NbaV1bY2xzXTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpIHx8IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzc25hbWVzO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIEN1c3RvbU1lbnVNaXhpbiA9IHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgb25TZWxlY3RJdGVtOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KSxcbiAgICBmaWx0ZXJlZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCksXG4gICAgaW5wdXRWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmb2N1c3NlZEl0ZW06IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgb25Gb2N1c0l0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9uVW5mb2N1c0l0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZGVmYXVsdFByb3BzOiB7XG4gICAgb25TZWxlY3RJdGVtOiBmdW5jdGlvbihpdGVtKSB7fSxcbiAgICBvcHRpb25zOiBbXSxcbiAgICBmaWx0ZXJlZDogW10sXG4gICAgaW5wdXRWYWx1ZTogbnVsbCxcbiAgICBmb2N1c3NlZEl0ZW06IG51bGwsXG4gICAgb25Gb2N1c0l0ZW06IGZ1bmN0aW9uKGl0ZW0pIHt9LFxuICAgIG9uVW5mb2N1c0l0ZW06IGZ1bmN0aW9uKGl0ZW0pIHt9XG4gIH0sXG5cbiAgc2VsZWN0SXRlbTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3RJdGVtKGl0ZW0pO1xuICB9LFxuXG4gIGZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHJvcHMub25Gb2N1c0l0ZW0oaXRlbSk7XG4gIH0sXG5cbiAgdW5mb2N1c0l0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB0aGlzLnByb3BzLm9uVW5mb2N1c0l0ZW0oaXRlbSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ3VzdG9tTWVudU1peGluOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdGNsYXNzZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBPcHRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdFxuXHRkaXNwbGF5TmFtZTogJ1ZhbHVlJyxcblx0XG5cdHByb3BUeXBlczoge1xuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcblx0fSxcblx0XG5cdGJsb2NrRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0sXG5cdFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC1pdGVtXCIgcm9sZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25SZW1vdmV9IGFyaWEtbGFiZWw9e1wiUmVtb3ZlIFwiICsgdGhpcy5wcm9wcy5sYWJlbH0+XG5cdFx0XHRcdDxzcGFuICBjbGFzc05hbWU9XCJTZWxlY3QtaXRlbS1pY29uXCIgb25Nb3VzZURvd249e3RoaXMuYmxvY2tFdmVudH0gb25DbGljaz17dGhpcy5wcm9wcy5vblJlbW92ZX0gb25Ub3VjaEVuZD17dGhpcy5wcm9wcy5vblJlbW92ZX0+JnRpbWVzOzwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWl0ZW0tbGFiZWxcIj57dGhpcy5wcm9wcy5sYWJlbH08L3NwYW4+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG5cdFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uO1xuIiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyksXG5cdElucHV0ID0gcmVxdWlyZSgncmVhY3QtaW5wdXQtYXV0b3NpemUnKSxcblx0Y2xhc3NlcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKSxcblx0VmFsdWUgPSByZXF1aXJlKCcuL1ZhbHVlJyksXG5cdEN1c3RvbU1lbnVNaXhpbiA9IHJlcXVpcmUoJy4vQ3VzdG9tTWVudU1peGluLmpzJyk7XG5cbnZhciByZXF1ZXN0SWQgPSAwO1xuXG5cbnZhciBTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdTZWxlY3QnLFxuXG5cdHN0YXRpY3M6IHtcblx0XHRDdXN0b21NZW51TWl4aW46IEN1c3RvbU1lbnVNaXhpblxuXHR9LFxuXG5cdHByb3BUeXBlczoge1xuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXG5cdFx0bXVsdGk6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgIC8vIG11bHRpLXZhbHVlIGlucHV0XG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdGhlIFNlbGVjdCBpcyBkaXNhYmxlZCBvciBub3Rcblx0XHRvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksICAgICAgICAgICAgLy8gYXJyYXkgb2Ygb3B0aW9uc1xuXHRcdGRlbGltaXRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyBkZWxpbWl0ZXIgdG8gdXNlIHRvIGpvaW4gbXVsdGlwbGUgdmFsdWVzXG5cdFx0YXN5bmNPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIGZ1bmN0aW9uIHRvIGNhbGwgdG8gZ2V0IG9wdGlvbnNcblx0XHRhdXRvbG9hZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0byBhdXRvLWxvYWQgdGhlIGRlZmF1bHQgYXN5bmMgb3B0aW9ucyBzZXRcblx0XHRwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gZmllbGQgcGxhY2Vob2xkZXIsIGRpc3BsYXllZCB3aGVuIHRoZXJlJ3Mgbm8gdmFsdWVcblx0XHRub1Jlc3VsdHNUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4gdGhlcmUgYXJlIG5vIG1hdGNoaW5nIHNlYXJjaCByZXN1bHRzXG5cdFx0Y2xlYXJhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIHNob3VsZCBpdCBiZSBwb3NzaWJsZSB0byByZXNldCB2YWx1ZVxuXHRcdGNsZWFyVmFsdWVUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sXG5cdFx0Y2xlYXJBbGxUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2wgd2hlbiBtdWx0aTogdHJ1ZVxuXHRcdHNlYXJjaGFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAvLyB3aGV0aGVyIHRvIGVuYWJsZSBzZWFyY2hpbmcgZmVhdHVyZSBvciBub3Rcblx0XHRzZWFyY2hQcm9tcHRUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgLy8gbGFiZWwgdG8gcHJvbXB0IGZvciBzZWFyY2ggaW5wdXRcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgLy8gZmllbGQgbmFtZSwgZm9yIGhpZGRlbiA8aW5wdXQgLz4gdGFnXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgIC8vIG9uQ2hhbmdlIGhhbmRsZXI6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7fVxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyBjbGFzc05hbWUgZm9yIHRoZSBvdXRlciBlbGVtZW50XG5cdFx0ZmlsdGVyT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgYSBzaW5nbGUgb3B0aW9uOiBmdW5jdGlvbihvcHRpb24sIGZpbHRlclN0cmluZylcblx0XHRmaWx0ZXJPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gbWV0aG9kIHRvIGZpbHRlciB0aGUgb3B0aW9ucyBhcnJheTogZnVuY3Rpb24oW29wdGlvbnNdLCBmaWx0ZXJTdHJpbmcsIFt2YWx1ZXNdKVxuXHRcdG1hdGNoUG9zOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyAoYW55fHN0YXJ0KSBtYXRjaCB0aGUgc3RhcnQgb3IgZW50aXJlIHN0cmluZyB3aGVuIGZpbHRlcmluZ1xuXHRcdG1hdGNoUHJvcDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyAoYW55fGxhYmVsfHZhbHVlKSB3aGljaCBvcHRpb24gcHJvcGVydHkgdG8gZmlsdGVyIG9uXG5cdFx0YWNjZXNzaWJsZUxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdG9wdGlvbnM6IFtdLFxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLFxuXHRcdFx0ZGVsaW1pdGVyOiAnLCcsXG5cdFx0XHRhc3luY09wdGlvbnM6IHVuZGVmaW5lZCxcblx0XHRcdGF1dG9sb2FkOiB0cnVlLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICdTZWxlY3QuLi4nLFxuXHRcdFx0bm9SZXN1bHRzVGV4dDogJ05vIHJlc3VsdHMgZm91bmQnLFxuXHRcdFx0Y2xlYXJhYmxlOiB0cnVlLFxuXHRcdFx0Y2xlYXJWYWx1ZVRleHQ6ICdDbGVhciB2YWx1ZScsXG5cdFx0XHRjbGVhckFsbFRleHQ6ICdDbGVhciBhbGwnLFxuXHRcdFx0c2VhcmNoYWJsZTogdHJ1ZSxcblx0XHRcdHNlYXJjaFByb21wdFRleHQ6ICdUeXBlIHRvIHNlYXJjaCcsXG5cdFx0XHRuYW1lOiB1bmRlZmluZWQsXG5cdFx0XHRvbkNoYW5nZTogdW5kZWZpbmVkLFxuXHRcdFx0Y2xhc3NOYW1lOiB1bmRlZmluZWQsXG5cdFx0XHRtYXRjaFBvczogJ2FueScsXG5cdFx0XHRtYXRjaFByb3A6ICdhbnknLFxuXHRcdFx0YWNjZXNzaWJsZUxhYmVsOiBcIkNob29zZSBhIHZhbHVlXCJcblx0XHR9O1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBzZXQgYnkgZ2V0U3RhdGVGcm9tVmFsdWUgb24gY29tcG9uZW50V2lsbE1vdW50OlxuXHRcdFx0ICogLSB2YWx1ZVxuXHRcdFx0ICogLSB2YWx1ZXNcblx0XHRcdCAqIC0gZmlsdGVyZWRPcHRpb25zXG5cdFx0XHQgKiAtIGlucHV0VmFsdWVcblx0XHRcdCAqIC0gcGxhY2Vob2xkZXJcblx0XHRcdCAqIC0gZm9jdXNlZE9wdGlvblxuXHRcdFx0Ki9cblx0XHRcdG9wdGlvbnM6IHRoaXMucHJvcHMub3B0aW9ucyxcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdGFsZXJ0TWVzc2FnZTogXCJcIlxuXHRcdH07XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9vcHRpb25zQ2FjaGUgPSB7fTtcblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gJyc7XG5cdFx0dGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVZhbHVlKHRoaXMucHJvcHMudmFsdWUpKTtcblxuXHRcdGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyAmJiB0aGlzLnByb3BzLmF1dG9sb2FkKSB7XG5cdFx0XHR0aGlzLmF1dG9sb2FkQXN5bmNPcHRpb25zKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0XHRjbGVhclRpbWVvdXQodGhpcy5fYmx1clRpbWVvdXQpO1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9mb2N1c1RpbWVvdXQpO1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5ld1Byb3BzKSB7XG5cdFx0aWYgKG5ld1Byb3BzLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUobmV3UHJvcHMudmFsdWUsIG5ld1Byb3BzLm9wdGlvbnMpKTtcblx0XHR9XG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzLm9wdGlvbnMpICE9PSBKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLm9wdGlvbnMpKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0b3B0aW9uczogbmV3UHJvcHMub3B0aW9ucyxcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMobmV3UHJvcHMub3B0aW9ucylcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fYmx1clRpbWVvdXQpO1xuXHRcdFx0dGhpcy5fZm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5nZXRJbnB1dE5vZGUoKS5mb2N1cygpO1xuXHRcdFx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gZmFsc2U7XG5cdFx0XHR9LmJpbmQodGhpcyksIDUwKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fZm9jdXNlZE9wdGlvblJldmVhbCkge1xuXHRcdFx0aWYgKHRoaXMucmVmcy5mb2N1c2VkICYmIHRoaXMucmVmcy5tZW51KSB7XG5cdFx0XHRcdHZhciBmb2N1c2VkRE9NID0gdGhpcy5yZWZzLmZvY3VzZWQuZ2V0RE9NTm9kZSgpO1xuXHRcdFx0XHR2YXIgbWVudURPTSA9IHRoaXMucmVmcy5tZW51LmdldERPTU5vZGUoKTtcblx0XHRcdFx0dmFyIGZvY3VzZWRSZWN0ID0gZm9jdXNlZERPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0dmFyIG1lbnVSZWN0ID0gbWVudURPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdFx0XHRpZiAoZm9jdXNlZFJlY3QuYm90dG9tID4gbWVudVJlY3QuYm90dG9tIHx8XG5cdFx0XHRcdFx0Zm9jdXNlZFJlY3QudG9wIDwgbWVudVJlY3QudG9wKSB7XG5cdFx0XHRcdFx0bWVudURPTS5zY3JvbGxUb3AgPSAoZm9jdXNlZERPTS5vZmZzZXRUb3AgKyBmb2N1c2VkRE9NLmNsaWVudEhlaWdodCAtIG1lbnVET00ub2Zmc2V0SGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYodGhpcy5zdGF0ZS5hbGVydE1lc3NhZ2UgIT09IFwiXCIpIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoYXQuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdGFsZXJ0TWVzc2FnZTogXCJcIlxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcblx0XHR9XG5cdH0sXG5cblx0Z2V0U3RhdGVGcm9tVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG5cblx0XHRpZiAoIW9wdGlvbnMpIHtcblx0XHRcdG9wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG5cdFx0fVxuXG5cdFx0Ly8gcmVzZXQgaW50ZXJuYWwgZmlsdGVyIHN0cmluZ1xuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSAnJztcblxuXHRcdHZhciB2YWx1ZXMgPSB0aGlzLmluaXRWYWx1ZXNBcnJheSh2YWx1ZSwgb3B0aW9ucyksXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnMob3B0aW9ucywgdmFsdWVzKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdmFsdWVzLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiB2LnZhbHVlOyB9KS5qb2luKHRoaXMucHJvcHMuZGVsaW1pdGVyKSxcblx0XHRcdHZhbHVlczogdmFsdWVzLFxuXHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IGZpbHRlcmVkT3B0aW9ucyxcblx0XHRcdHBsYWNlaG9sZGVyOiAhdGhpcy5wcm9wcy5tdWx0aSAmJiB2YWx1ZXMubGVuZ3RoID8gdmFsdWVzWzBdLmxhYmVsIDogdGhpcy5wcm9wcy5wbGFjZWhvbGRlcixcblx0XHRcdGZvY3VzZWRPcHRpb246ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0gOiBmaWx0ZXJlZE9wdGlvbnNbMF1cblx0XHR9O1xuXG5cdH0sXG5cblx0aW5pdFZhbHVlc0FycmF5OiBmdW5jdGlvbih2YWx1ZXMsIG9wdGlvbnMpIHtcblxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG5cdFx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWx1ZXMpIHtcblx0XHRcdFx0dmFsdWVzID0gdmFsdWVzLnNwbGl0KHRoaXMucHJvcHMuZGVsaW1pdGVyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhbHVlcyA9IHZhbHVlcyA/IFt2YWx1ZXNdIDogW107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlcy5tYXAoZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRyZXR1cm4gKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsKSA/IHZhbCA9IF8uZmluZFdoZXJlKG9wdGlvbnMsIHsgdmFsdWU6IHZhbCB9KSB8fCB7IHZhbHVlOiB2YWwsIGxhYmVsOiB2YWwgfSA6IHZhbDtcblx0XHR9LmJpbmQodGhpcykpO1xuXG5cdH0sXG5cblx0c2V0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dGhpcy5fZm9jdXNBZnRlclVwZGF0ZSA9IHRydWU7XG5cdFx0dmFyIG5ld1N0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21WYWx1ZSh2YWx1ZSk7XG5cdFx0bmV3U3RhdGUuaXNPcGVuID0gZmFsc2U7XG5cdFx0dGhpcy5maXJlQ2hhbmdlRXZlbnQobmV3U3RhdGUpO1xuXHRcdHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuXHR9LFxuXG5cdHNlbGVjdFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdC8vIHRoaXNbdGhpcy5wcm9wcy5tdWx0aSA/ICdhZGRWYWx1ZScgOiAnc2V0VmFsdWUnXSh2YWx1ZSk7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmFkZFZhbHVlKHZhbHVlKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7YWxlcnRNZXNzYWdlOiB2YWx1ZS5sYWJlbCArIFwiIHNlbGVjdGVkXCJ9KTtcblx0XHRcblx0fSxcblxuXHRhZGRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzLnNldFZhbHVlKHRoaXMuc3RhdGUudmFsdWVzLmNvbmNhdCh2YWx1ZSkpO1xuXHR9LFxuXG5cdHBvcFZhbHVlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFZhbHVlKF8uaW5pdGlhbCh0aGlzLnN0YXRlLnZhbHVlcykpO1xuXHR9LFxuXG5cdHJlbW92ZVZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHRoaXMuc2V0VmFsdWUoXy53aXRob3V0KHRoaXMuc3RhdGUudmFsdWVzLCB2YWx1ZSkpO1xuXHR9LFxuXG5cdGNsZWFyVmFsdWU6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxuXHRcdGlmIChldmVudCAmJiBldmVudC50eXBlID09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnNldFZhbHVlKG51bGwpO1xuXHR9LFxuXG5cdHJlc2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZSk7XG5cdH0sXG5cblx0Z2V0SW5wdXROb2RlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGlucHV0ID0gdGhpcy5yZWZzLmlucHV0O1xuXHRcdHJldHVybiB0aGlzLnByb3BzLnNlYXJjaGFibGUgPyBpbnB1dCA6IGlucHV0LmdldERPTU5vZGUoKTtcblx0fSxcblxuXHRmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG5cdFx0aWYgKG5ld1N0YXRlLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlICYmIHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UobmV3U3RhdGUudmFsdWUsIG5ld1N0YXRlLnZhbHVlcyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG5cdFx0Ly8gaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cblx0XHQvLyBidXR0b24sIG9yIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGlnbm9yZSBpdC5cblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbigpO1xuXHRcdFxuXHR9LFxuXHRoYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNGb2N1c2VkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0XHRhbGVydE1lc3NhZ2U6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRJbnB1dE5vZGUoKS5mb2N1cygpO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3Blbk1lbnUgPSB0aGlzLnN0YXRlLmlzT3BlbiB8fCB0aGlzLl9vcGVuQWZ0ZXJGb2N1c1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNGb2N1c2VkOiB0cnVlLFxuXHRcdFx0aXNPcGVuOiBvcGVuTWVudSxcblx0XHRcdGFsZXJ0TWVzc2FnZTogKG9wZW5NZW51KSA/IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiIDogXCJcIlxuXHRcdH0pO1xuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRCbHVyOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSByZXR1cm47XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpLCA1MDApO1xuXHR9LFxuXG5cdGhhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cblx0XHRpZih0aGlzLnN0YXRlLmRpc2FibGVkKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0c3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG5cblx0XHRcdGNhc2UgODogLy8gYmFja3NwYWNlXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy5wb3BWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDk6IC8vIHRhYlxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgfHwgIXRoaXMuc3RhdGUuaXNPcGVuIHx8ICF0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxMzogLy8gZW50ZXJcblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAyNzogLy8gZXNjYXBlXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0XHRcdHRoaXMucmVzZXRWYWx1ZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuY2xlYXJWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAzODogLy8gdXBcblx0XHRcdFx0dGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA0MDogLy8gZG93blxuXHRcdFx0XHR0aGlzLmZvY3VzTmV4dE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzI6IC8vc3BhY2UgdG8gb3BlbiBkcm9wIGRvd25cblx0XHRcdFx0aWYodGhpcy5zdGF0ZS5pc09wZW4gIT09IHRydWUpIHtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bkltcGxlbWVudGF0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdFx0XHRhbGVydE1lc3NhZ2U6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXZhaWxhYmxlLiBcIiArIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGRlZmF1bHQ6IHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly9wcmV2ZW50IGRlZmF1bHQgYWN0aW9uIG9mIHdoYXRldmVyIGtleSB3YXMgcHJlc3NlZFxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0fSxcblxuXHQvL1RoaXMgZnVuY3Rpb24gaGFuZGxlcyBrZXlib2FyZCB0ZXh0IGlucHV0IGZvciBmaWx0ZXJpbmcgb3B0aW9uc1xuXHRoYW5kbGVJbnB1dENoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQvLyBhc3NpZ24gYW4gaW50ZXJuYWwgdmFyaWFibGUgYmVjYXVzZSB3ZSBuZWVkIHRvIHVzZVxuXHRcdC8vIHRoZSBsYXRlc3QgdmFsdWUgYmVmb3JlIHNldFN0YXRlKCkgaGFzIGNvbXBsZXRlZC5cblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXHRcdHZhciB0aGF0ID0gdGhpczsgXG5cdFx0dmFyIGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyh0aGlzLnN0YXRlLm9wdGlvbnMpO1xuXHRcdHZhciBmb2N1c2VkT3B0aW9uID0gXy5jb250YWlucyhmaWx0ZXJlZE9wdGlvbnMsIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbikgPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gOiBmaWx0ZXJlZE9wdGlvbnNbMF07XG5cblx0XHRpZiAodGhpcy5wcm9wcy5hc3luY09wdGlvbnMpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0xvYWRpbmc6IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogZm9jdXNlZE9wdGlvbixcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBmaWx0ZXJlZE9wdGlvbnMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMubG9hZEFzeW5jT3B0aW9ucyhldmVudC50YXJnZXQudmFsdWUsIHtcblx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0aXNPcGVuOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBmaWx0ZXJlZE9wdGlvbnMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgZm9jdXNlZE9wdGlvbi5sYWJlbCArIFwiIGN1cnJlbnRseSBmb2N1c2VkLlwiLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG5cdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogZmlsdGVyZWRPcHRpb25zLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiBmb2N1c2VkT3B0aW9uXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSxcblxuXHRhdXRvbG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5sb2FkQXN5bmNPcHRpb25zKCcnLCB7fSwgZnVuY3Rpb24oKSB7fSk7XG5cdH0sXG5cblx0bG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIHN0YXRlKSB7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBpbnB1dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGNhY2hlS2V5ID0gaW5wdXQuc2xpY2UoMCwgaSk7XG5cdFx0XHRpZiAodGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IHRoaXMuX29wdGlvbnNDYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XS5vcHRpb25zO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKF8uZXh0ZW5kKHtcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRpb25zLFxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zKG9wdGlvbnMpXG5cdFx0XHRcdH0sIHN0YXRlKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgdGhpc1JlcXVlc3RJZCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQgPSByZXF1ZXN0SWQrKztcblxuXHRcdHRoaXMucHJvcHMuYXN5bmNPcHRpb25zKGlucHV0LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcblxuXHRcdFx0dGhpcy5fb3B0aW9uc0NhY2hlW2lucHV0XSA9IGRhdGE7XG5cblx0XHRcdGlmICh0aGlzUmVxdWVzdElkICE9PSB0aGlzLl9jdXJyZW50UmVxdWVzdElkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zZXRTdGF0ZShfLmV4dGVuZCh7XG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEub3B0aW9ucyxcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMoZGF0YS5vcHRpb25zKVxuXHRcdFx0fSwgc3RhdGUpKTtcblxuXHRcdH0uYmluZCh0aGlzKSk7XG5cblx0fSxcblxuXHRmaWx0ZXJPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zLCB2YWx1ZXMpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0cmV0dXJuIG9wdGlvbnM7XG5cdFx0fVxuXG5cdFx0dmFyIGZpbHRlclZhbHVlID0gdGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZztcblx0XHR2YXIgZXhjbHVkZSA9ICh2YWx1ZXMgfHwgdGhpcy5zdGF0ZS52YWx1ZXMpLm1hcChmdW5jdGlvbihpKSB7XG5cdFx0XHRyZXR1cm4gaS52YWx1ZTtcblx0XHR9KTtcblx0XHRpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zLmNhbGwodGhpcywgb3B0aW9ucywgZmlsdGVyVmFsdWUsIGV4Y2x1ZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgZmlsdGVyT3B0aW9uID0gZnVuY3Rpb24ob3ApIHtcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMubXVsdGkgJiYgXy5jb250YWlucyhleGNsdWRlLCBvcC52YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uKSByZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb24uY2FsbCh0aGlzLCBvcCwgZmlsdGVyVmFsdWUpO1xuXHRcdFx0XHRyZXR1cm4gIWZpbHRlclZhbHVlIHx8ICh0aGlzLnByb3BzLm1hdGNoUG9zID09PSAnc3RhcnQnKSA/IChcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgb3AudmFsdWUudG9Mb3dlckNhc2UoKS5zdWJzdHIoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpIHx8XG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnICYmIG9wLmxhYmVsLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKVxuXHRcdFx0XHQpIDogKFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiBvcC52YWx1ZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMCkgfHxcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgb3AubGFiZWwudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDApXG5cdFx0XHRcdCk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIF8uZmlsdGVyKG9wdGlvbnMsIGZpbHRlck9wdGlvbiwgdGhpcyk7XG5cdFx0fVxuXHR9LFxuXG5cdHNlbGVjdEZvY3VzZWRPcHRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnNlbGVjdFZhbHVlKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbik7XG5cdH0sXG5cblx0Zm9jdXNPcHRpb246IGZ1bmN0aW9uKG9wKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBvcFxuXHRcdH0pO1xuXHR9LFxuXG5cdGZvY3VzTmV4dE9wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCduZXh0Jyk7XG5cdH0sXG5cblx0Zm9jdXNQcmV2aW91c09wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwcmV2aW91cycpO1xuXHR9LFxuXG5cdGZvY3VzQWRqYWNlbnRPcHRpb246IGZ1bmN0aW9uKGRpcikge1xuXHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSB0cnVlO1xuXG5cdFx0dmFyIG9wcyA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuXG5cdFx0aWYgKCF0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0YWxlcnRNZXNzYWdlOiBvcHMubGVuZ3RoICsgXCIgb3B0aW9ucyBhdmFpbGFibGUuIFwiICsgdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLmxhYmVsICsgXCIgY3VycmVudGx5IGZvY3VzZWQuXCIsXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gfHwgb3BzW2RpciA9PT0gJ25leHQnID8gMCA6IG9wcy5sZW5ndGggLSAxXVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFvcHMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZvY3VzZWRJbmRleCA9IC0xO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPT09IG9wc1tpXSkge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZm9jdXNlZE9wdGlvbiA9IG9wc1swXTtcblxuXHRcdGlmIChkaXIgPT09ICduZXh0JyAmJiBmb2N1c2VkSW5kZXggPiAtMSAmJiBmb2N1c2VkSW5kZXggPCBvcHMubGVuZ3RoIC0gMSkge1xuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tmb2N1c2VkSW5kZXggKyAxXTtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3ByZXZpb3VzJykge1xuXHRcdFx0aWYgKGZvY3VzZWRJbmRleCA+IDApIHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tmb2N1c2VkSW5kZXggLSAxXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRPcHRpb24gPSBvcHNbb3BzLmxlbmd0aCAtIDFdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZE9wdGlvbjogZm9jdXNlZE9wdGlvbixcblx0XHRcdGlucHV0VmFsdWU6IGZvY3VzZWRPcHRpb24ubGFiZWxcblx0XHR9KTtcblxuXHR9LFxuXG5cdHVuZm9jdXNPcHRpb246IGZ1bmN0aW9uKG9wKSB7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA9PT0gb3ApIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiBudWxsXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cbiAgc3dhcEZvY3VzOiBmdW5jdGlvbiAobGlzdCwgb2xkRm9jdXNJbmRleCwgbmV3Rm9jdXNJbmRleCkge1xuICAgIGlmKCFsaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIWxpc3Rbb2xkRm9jdXNJbmRleF0gfHwgIWxpc3RbbmV3Rm9jdXNJbmRleF0pIHtcbiAgICBcdHJldHVybjtcbiAgICB9XG5cbiAgICBpZigoIW5ld0ZvY3VzSW5kZXggJiYgbmV3Rm9jdXNJbmRleCAhPT0gMCkgfHwgb2xkRm9jdXNJbmRleCA9PT0gbmV3Rm9jdXNJbmRleCkge1xuICAgIFx0cmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBvbGRGb2N1c1JlcGxhY2VtZW50ID0gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKFxuICAgICAgbGlzdFtvbGRGb2N1c0luZGV4XSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBsaXN0W29sZEZvY3VzSW5kZXhdLmtleSxcbiAgICAgICAgcmVmOiBudWxsXG4gICAgICB9XG4gICAgKTtcblxuICAgIHZhciBuZXdGb2N1c1JlcGxhY2VtZW50ID0gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKFxuICAgICAgbGlzdFtuZXdGb2N1c0luZGV4XSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBsaXN0W25ld0ZvY3VzSW5kZXhdLmtleSxcbiAgICAgICAgcmVmOiBcImZvY3VzZWRcIlxuICAgICAgfVxuICAgICk7XG5cbiAgICAvL2Nsb25lV2l0aFByb3BzIGFwcGVuZHMgY2xhc3NlcywgYnV0IGRvZXMgbm90IHJlcGxhY2UgdGhlbSwgd2hpY2ggaXMgd2hhdCBJIHdhbnQgaGVyZVxuICAgIG9sZEZvY3VzUmVwbGFjZW1lbnQucHJvcHMuY2xhc3NOYW1lID0gXCJTZWxlY3Qtb3B0aW9uXCI7XG4gICAgbmV3Rm9jdXNSZXBsYWNlbWVudC5wcm9wcy5jbGFzc05hbWUgPSBcIlNlbGVjdC1vcHRpb24gaXMtZm9jdXNlZFwiO1xuXG4gICAgdGhpcy5jYWNoZWRGb2N1c2VkSXRlbUluZGV4ID0gbmV3Rm9jdXNJbmRleDtcblxuICAgIHRoaXMuY2FjaGVkTWVudS5zcGxpY2Uob2xkRm9jdXNJbmRleCwgMSwgb2xkRm9jdXNSZXBsYWNlbWVudCk7XG4gICAgdGhpcy5jYWNoZWRNZW51LnNwbGljZShuZXdGb2N1c0luZGV4LCAxLCBuZXdGb2N1c1JlcGxhY2VtZW50KTtcbiAgfSxcblxuICBjYWNoZWRGb2N1c2VkSXRlbUluZGV4OiAwLFxuICBjYWNoZWRMaXN0SXRlbXNJbmRleExvb2t1cDoge30sXG4gIGNhY2hlZE1lbnU6IFtdLFxuICBjYWNoZWRGaWx0ZXJlZDogW10sXG5cbiAgYnVpbGRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZvY3VzZWRWYWx1ZSA9IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA/IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbi52YWx1ZSA6IG51bGw7XG5cbiAgICBpZih0aGlzLmNhY2hlZEZpbHRlcmVkID09IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zKVxuICAgIHtcbiAgICAgIHRoaXMuc3dhcEZvY3VzKHRoaXMuY2FjaGVkTWVudSwgdGhpcy5jYWNoZWRGb2N1c2VkSXRlbUluZGV4LCB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwW2ZvY3VzZWRWYWx1ZV0pO1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkTWVudTtcbiAgICB9XG5cbiAgICB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwID0ge307XG5cblx0XHR2YXIgb3BzID0gXy5tYXAodGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMsIGZ1bmN0aW9uKG9wLCBpbmRleCkge1xuXG5cdFx0XHR2YXIgaXNGb2N1c2VkID0gZm9jdXNlZFZhbHVlID09PSBvcC52YWx1ZTtcblxuXHRcdFx0dmFyIG9wdGlvbkNsYXNzID0gY2xhc3Nlcyh7XG5cdFx0XHRcdCdTZWxlY3Qtb3B0aW9uJzogdHJ1ZSxcblx0XHRcdFx0J2lzLWZvY3VzZWQnOiBpc0ZvY3VzZWRcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgcmVmID0gaXNGb2N1c2VkID8gJ2ZvY3VzZWQnIDogbnVsbDtcblxuXHRcdFx0dmFyIG1vdXNlRW50ZXIgPSB0aGlzLmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZUxlYXZlID0gdGhpcy51bmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZURvd24gPSB0aGlzLnNlbGVjdFZhbHVlLmJpbmQodGhpcywgb3ApO1xuXG4gICAgICB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwW29wLnZhbHVlXSA9IGluZGV4O1xuICAgICAgdmFyIGNoZWNrTWFyayA9IFwiXCI7XG4gICAgICBpZihpc0ZvY3VzZWQpXG4gICAgICB7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9jdXNlZEl0ZW0gPSBpbmRleDtcbiAgICAgICAgY2hlY2tNYXJrID0gXCIgU2VsZWN0ZWRcIjtcbiAgICAgIH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIDxhIHJvbGU9XCJsaXN0aXRlbVwiIGFyaWEtbGFiZWw9e29wLmxhYmVsICsgY2hlY2tNYXJrfSByZWY9e3JlZn0ga2V5PXsnb3B0aW9uLScgKyBvcC52YWx1ZX0gY2xhc3NOYW1lPXtvcHRpb25DbGFzc30gb25Nb3VzZUVudGVyPXttb3VzZUVudGVyfSBvbk1vdXNlTGVhdmU9e21vdXNlTGVhdmV9IG9uTW91c2VEb3duPXttb3VzZURvd259IG9uQ2xpY2s9e21vdXNlRG93bn0+e29wLmxhYmVsfTwvYT47XG5cdFx0XHRcblx0XHR9LCB0aGlzKTtcblxuXHRcdHJldHVybiBvcHMubGVuZ3RoID8gb3BzIDogKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3Qtbm9yZXN1bHRzXCI+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyAmJiAhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlID8gdGhpcy5wcm9wcy5zZWFyY2hQcm9tcHRUZXh0IDogdGhpcy5wcm9wcy5ub1Jlc3VsdHNUZXh0fVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblxuXHR9LFxuXG5cdGJ1aWxkQ3VzdG9tTWVudTogZnVuY3Rpb24oKSB7ICAgIFxuICAgIGlmKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgXHRyZXR1cm47XG4gICAgfVxuXG4gIFx0dmFyIGNoaWxkID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuICBcdHJldHVybiBSZWFjdC5hZGRvbnMuY2xvbmVXaXRoUHJvcHMoY2hpbGQsIHtcblx0ICAgIG9uU2VsZWN0SXRlbTogdGhpcy5zZWxlY3RWYWx1ZSxcblx0ICAgIG9wdGlvbnM6IHRoaXMucHJvcHMub3B0aW9ucyxcblx0ICAgIGZpbHRlcmVkOiB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucyxcblx0ICAgIGlucHV0VmFsdWU6IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSxcblx0ICAgIGZvY3Vzc2VkSXRlbTogdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLFxuXHQgICAgb25Gb2N1c0l0ZW06IHRoaXMuZm9jdXNPcHRpb24sXG5cdCAgICBvblVuZm9jdXNJdGVtOiB0aGlzLnVuZm9jdXNPcHRpb25cbiAgXHR9KTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgc2VsZWN0Q2xhc3MgPSBjbGFzc2VzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J2lzLW11bHRpJzogdGhpcy5wcm9wcy5tdWx0aSxcblx0XHRcdCdpcy1zZWFyY2hhYmxlJzogdGhpcy5wcm9wcy5zZWFyY2hhYmxlLFxuXHRcdFx0J2lzLW9wZW4nOiB0aGlzLnN0YXRlLmlzT3Blbixcblx0XHRcdCdpcy1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQsXG5cdFx0XHQnaXMtbG9hZGluZyc6IHRoaXMuc3RhdGUuaXNMb2FkaW5nLFxuXHRcdFx0J2lzLWRpc2FibGVkJyA6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG5cdFx0XHQnaGFzLXZhbHVlJzogdGhpcy5zdGF0ZS52YWx1ZVxuXHRcdH0pO1xuXG5cdFx0dmFyIHZhbHVlID0gW107XG5cblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xuXHRcdFx0dGhpcy5zdGF0ZS52YWx1ZXMuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0dmFyIHByb3BzID0gXy5leHRlbmQoe1xuXHRcdFx0XHRcdGtleTogdmFsLnZhbHVlLFxuXHRcdFx0XHRcdG9uUmVtb3ZlOiB0aGlzLnJlbW92ZVZhbHVlLmJpbmQodGhpcywgdmFsKVxuXHRcdFx0XHR9LCB2YWwpO1xuXHRcdFx0XHR2YWx1ZS5wdXNoKDxWYWx1ZSB7Li4ucHJvcHN9IC8+KTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8ICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmICghdGhpcy5wcm9wcy5tdWx0aSB8fCAhdmFsdWUubGVuZ3RoKSkpIHtcblx0XHRcdHZhbHVlLnB1c2goPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzc05hbWU9XCJTZWxlY3QtcGxhY2Vob2xkZXJcIiBrZXk9XCJwbGFjZWhvbGRlclwiPnt0aGlzLnN0YXRlLnBsYWNlaG9sZGVyfTwvZGl2Pik7XG5cdFx0fVxuXG5cdFx0dmFyIGxvYWRpbmcgPSB0aGlzLnN0YXRlLmlzTG9hZGluZyA/IDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1sb2FkaW5nXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz4gOiBudWxsO1xuXHRcdHZhciBjbGVhciA9IHRoaXMucHJvcHMuY2xlYXJhYmxlICYmIHRoaXMuc3RhdGUudmFsdWUgJiYgIXRoaXMucHJvcHMuZGlzYWJsZWQgPyA8c3BhbiByb2xlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyXCIgdGl0bGU9e3RoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHR9IGFyaWEtbGFiZWw9e3RoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHR9IG9uTW91c2VEb3duPXt0aGlzLmNsZWFyVmFsdWV9IG9uQ2xpY2s9e3RoaXMuY2xlYXJWYWx1ZX0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiAnJnRpbWVzOycgfX0gLz4gOiBudWxsO1xuXHRcdHZhciBidWlsdE1lbnUgPSB0aGlzLnByb3BzLmJ1aWxkQ3VzdG9tTWVudSA/IHRoaXMucHJvcHMuYnVpbGRDdXN0b21NZW51KHRoaXMuc2VsZWN0VmFsdWUsIHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLCB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24sIHRoaXMuZm9jdXNPcHRpb24sIHRoaXMudW5mb2N1c09wdGlvbikgOiB0aGlzLmJ1aWxkTWVudSgpO1xuXHRcdC8vIHZhciBidWlsdE1lbnUgPSB0aGlzLnByb3BzLmNoaWxkcmVuID8gdGhpcy5idWlsZEN1c3RvbU1lbnUoKSA6IHRoaXMuYnVpbGRNZW51KCk7XG5cblx0ICAgIHRoaXMuY2FjaGVkRmlsdGVyZWQgPSB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucztcblx0ICAgIHRoaXMuY2FjaGVkTWVudSA9IGJ1aWx0TWVudTtcblxuXHRcdHZhciBtZW51ID0gdGhpcy5zdGF0ZS5pc09wZW4gPyA8ZGl2IGlkPVwiU2VsZWN0LW1lbnVcIiByZWY9XCJtZW51XCIgY2xhc3NOYW1lPVwiU2VsZWN0LW1lbnVcIj57YnVpbHRNZW51fTwvZGl2PiA6IG51bGw7XG5cblx0XHR2YXIgY3VycmVudFNlbGVjdGlvblRleHQgPSB0aGlzLnN0YXRlLnBsYWNlaG9sZGVyO1xuXHRcdC8vZm9yIG11bHRpIHNlbGVjdCBjYW4ndCB1c2UgcGxhY2Vob2xkZXIgZm9yIGN1cnJlbnQgc2VsZWN0aW9uIHRleHRcblx0XHRpZih0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR2YXIgdmFsdWVMaXN0ID0gdGhpcy5zdGF0ZS52YWx1ZXM7IFxuXHRcdFx0aWYodmFsdWVMaXN0Lmxlbmd0aCA+IDEpXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ID0gXCJcIlxuXHRcdFx0XHR2YWx1ZUxpc3QuZm9yRWFjaChmdW5jdGlvbih2YWwsIGluZGV4KSB7XG5cdFx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gU3RyaW5nKHZhbC5sYWJlbCk7XG5cdFx0XHRcdFx0aWYoaW5kZXggPCAodmFsdWVMaXN0Lmxlbmd0aCAtIDEpKVxuXHRcdFx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gXCIsIFwiO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y3VycmVudFNlbGVjdGlvblRleHQgKz0gXCIgY3VycmVudGx5IHNlbGVjdGVkLlwiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWx1ZUxpc3QubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdGN1cnJlbnRTZWxlY3Rpb25UZXh0ID0gdmFsdWVMaXN0WzBdLmxhYmVsICsgXCIgY3VycmVudGx5IHNlbGVjdGVkLlwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBoaWRlVmlzdWFsbHlTdHlsZXMgPSB7XG5cdFx0ICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0ICAgIGxlZnQ6IFwiLTk5OTk5OXB4XCIsXG5cdFx0ICAgIHRvcDogXCJhdXRvXCIsXG5cdFx0ICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuXHRcdCAgICBoZWlnaHQ6IFwiMXB4XCIsXG5cdFx0ICAgIHdpZHRoOiBcIjFweFwiXG5cdFx0fTtcblxuXHRcdHZhciBjb21tb25Qcm9wcyA9IHtcblx0XHRcdHJlZjogJ2lucHV0Jyxcblx0XHRcdGNsYXNzTmFtZTogJ1NlbGVjdC1pbnB1dCcsXG5cdFx0XHR0YWJJbmRleDogdGhpcy5wcm9wcy50YWJJbmRleCB8fCAwLFxuXHRcdFx0b25Gb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLFxuXHRcdFx0b25CbHVyOiB0aGlzLmhhbmRsZUlucHV0Qmx1cixcblx0XHR9O1xuXHRcdHZhciBpbnB1dDtcblxuXHRcdGlmICh0aGlzLnByb3BzLnNlYXJjaGFibGUgJiYgIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcblx0XHRcdGlucHV0ID0gPElucHV0IFxuXHRcdFx0XHRhcmlhLWxhYmVsPXtjdXJyZW50U2VsZWN0aW9uVGV4dCArIFwiLCBcIiArIHRoaXMucHJvcHMuYWNjZXNzaWJsZUxhYmVsICsgXCIsIENvbWJvYm94LiBQcmVzcyBkb3duIGFycm93IGtleSB0byBvcGVuIHNlbGVjdCBvcHRpb25zIG9yIHN0YXJ0IHR5cGluZyBmb3Igb3B0aW9ucyB0byBiZSBmaWx0ZXJlZC4gTmF2aWdhdGUgdGhlIG9wdGlvbnMgdXNpbmcgdXAgYW5kIGRvd24gYXJyb3cga2V5cy4gUHJlc3MgZW50ZXIgdG8gc2VsZWN0IGFuIG9wdGlvbi5cIn1cblx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUuaW5wdXRWYWx1ZX0gXG5cdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfSBcblx0XHRcdFx0bWluV2lkdGg9XCI1XCIgXG5cdFx0XHRcdHsuLi5jb21tb25Qcm9wc30gLz47XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlucHV0ID0gPGRpdiB7Li4uY29tbW9uUHJvcHN9PiZuYnNwOzwvZGl2Pjtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiByZWY9XCJ3cmFwcGVyXCIgY2xhc3NOYW1lPXtzZWxlY3RDbGFzc30+XG5cdFx0XHRcdDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgcmVmPVwidmFsdWVcIiBuYW1lPXt0aGlzLnByb3BzLm5hbWV9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0gLz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3QtY29udHJvbFwiIHJlZj1cImNvbnRyb2xcIiBvbktleURvd249e3RoaXMuaGFuZGxlS2V5RG93bn0gb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufSBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZU1vdXNlRG93bn0+XG5cdFx0XHRcdFx0e3ZhbHVlfVxuXHRcdFx0XHRcdHtpbnB1dH1cblxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1hcnJvd1wiIC8+XG5cdFx0XHRcdFx0e2xvYWRpbmd9XG5cdFx0XHRcdFx0e2NsZWFyfVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHR7bWVudX1cblx0XHRcdFx0PGRpdiB0YWJJbmRleD1cIi05OTlcIiBzdHlsZT17aGlkZVZpc3VhbGx5U3R5bGVzfSBpZD1cImFsZXJ0LW9wdGlvbnNcIiByb2xlPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiRW5kIG9mIHNlbGVjdFwiPnt0aGlzLnN0YXRlLmFsZXJ0TWVzc2FnZX08L2Rpdj5cblx0XHRcdDwvZGl2PlxuXG5cblx0XHQpO1xuXG5cdH1cblxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Q7XG4iXX0=
