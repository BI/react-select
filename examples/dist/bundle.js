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
var React = require('react');

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
    onSelectItem: function(item) {},
    options: [],
    filtered: [],
    inputValue: null,
    focussedItem: null,
    onFocusItem: function(item) {},
    onUnfocusItem: function(item) {}
  },

  selectItem: function(item) {
    this.props.onSelectItem(item);
  },

  focusItem: function(item) {
    this.props.onFocusItem(item);
  },

  unfocusItem: function(item) {
    this.props.onUnfocusItem(item);
  }
};

module.exports = CustomMenuMixin;
},{"react":false}],"/Users/andrewblowe/Projects/usaid/react-select/src/Value.js":[function(require,module,exports){
var _ = require('underscore'),
	React = require('react'),
	classes = require('classnames');

var Option = React.createClass({
	
	displayName: 'Value',
	
	propTypes: {
		label: React.PropTypes.string.isRequired
	},
	
	blockEvent: function(event) {
		event.stopPropagation();
	},
	
	render: function() {
		return (
			React.createElement("div", {className: "Select-item", role: "button", onClick: this.props.onRemove, "aria-label": "Remove " + this.props.label}, 
				React.createElement("span", {className: "Select-item-icon", onMouseDown: this.blockEvent, onClick: this.props.onRemove, onTouchEnd: this.props.onRemove}, "×"), 
				React.createElement("span", {className: "Select-item-label"}, this.props.label)
			)
		);
	}
	
});

module.exports = Option;

},{"classnames":"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js","react":false,"underscore":false}],"react-select":[function(require,module,exports){
var _ = require('underscore'),
	React = require('react/addons'),
	Input = require('react-input-autosize'),
	classes = require('classnames'),
	Value = require('./Value')
	CustomMenuMixin = require('./CustomMenuMixin.js');

var requestId = 0;

Select = React.createClass({
	
	displayName: 'AccessibleSelect',

	statics: {
		CustomMenuMixin: CustomMenuMixin
	},

	propTypes: {
		value: React.PropTypes.any,                // initial field value
		multi: React.PropTypes.bool,               // multi-value input
		options: React.PropTypes.array,            // array of options
		delimiter: React.PropTypes.string,         // delimiter to use to join multiple values
		asyncOptions: React.PropTypes.func,        // function to call to get options
		autoload: React.PropTypes.bool,            // whether to auto-load the default async options set
		placeholder: React.PropTypes.string,       // field placeholder, displayed when there's no value
		noResultsText: React.PropTypes.string,     // placeholder displayed when there are no matching search results
		clearable: React.PropTypes.bool,           // should it be possible to reset value
		clearValueText: React.PropTypes.string,    // title for the "clear" control
		clearAllText: React.PropTypes.string,      // title for the "clear" control when multi: true
		searchPromptText: React.PropTypes.string,  // label to prompt for search input
		name: React.PropTypes.string,              // field name, for hidden <input /> tag
		onChange: React.PropTypes.func,            // onChange handler: function(newValue) {}
		className: React.PropTypes.string,         // className for the outer element
		filterOption: React.PropTypes.func,        // method to filter a single option: function(option, filterString)
		filterOptions: React.PropTypes.func,       // method to filter the options array: function([options], filterString, [values])
		matchPos: React.PropTypes.string,          // (any|start) match the start or entire string when filtering
		matchProp: React.PropTypes.string         // (any|label|value) which option property to filter on
	},
	
	getDefaultProps: function() {
		return {
			value: undefined,
			options: [],
			delimiter: ',',
			asyncOptions: undefined,
			autoload: true,
			placeholder: 'Select...',
			noResultsText: 'No results found',
			clearable: true,
			clearValueText: 'Clear value',
			clearAllText: 'Clear all',
			searchPromptText: 'Type to search',
			name: undefined,
			onChange: undefined,
			className: undefined,
			matchPos: 'any',
			matchProp: 'any'
		};
	},
	
	getInitialState: function() {
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
			isLoading: false
		};
	},
	
	componentWillMount: function() {
		this._optionsCache = {};
		this._optionsFilterString = '';
		this.setState(this.getStateFromValue(this.props.value));
		
		if (this.props.asyncOptions && this.props.autoload) {
			this.autoloadAsyncOptions();
		}
	},
	
	componentWillUnmount: function() {
		clearTimeout(this._blurTimeout);
		clearTimeout(this._focusTimeout);
	},
	
	componentWillReceiveProps: function(newProps) {
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
	
	componentDidUpdate: function() {
		if (this._focusAfterUpdate) {
			clearTimeout(this._blurTimeout);
			this._focusTimeout = setTimeout(function() {
				this.refs.input.focus();
				this._focusAfterUpdate = false;
			}.bind(this), 50);
		}

		if (this._focusedOptionReveal) {
			if (this.refs.focused && this.refs.menu) {
				var focusedDOM = this.refs.focused.getDOMNode();
				var menuDOM = this.refs.menu.getDOMNode();
				var focusedRect = focusedDOM.getBoundingClientRect();
				var menuRect = menuDOM.getBoundingClientRect();

				if (focusedRect.bottom > menuRect.bottom ||
					focusedRect.top < menuRect.top) {
					menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
				}
			}

			this._focusedOptionReveal = false;
		}
	},
	
	getStateFromValue: function(value, options) {
		
		if (!options) {
			options = this.state.options;
		}
		
		// reset internal filter string
		this._optionsFilterString = '';
		
		var values = this.initValuesArray(value, options),
			filteredOptions = this.filterOptions(options, values);
		
		return {
			value: values.map(function(v) { return v.value; }).join(this.props.delimiter),
			values: values,
			inputValue: '',
			filteredOptions: filteredOptions,
			placeholder: !this.props.multi && values.length ? values[0].label : this.props.placeholder,
			focusedOption: !this.props.multi && values.length ? values[0] : filteredOptions[0]
		};
		
	},
	
	initValuesArray: function(values, options) {
		
		if (!Array.isArray(values)) {
			if ('string' === typeof values) {
				values = values.split(this.props.delimiter);
			} else {
				values = values ? [values] : [];
			}
		}
		
		return values.map(function(val) {
			return ('string' === typeof val) ? val = _.findWhere(options, { value: val }) || { value: val, label: val } : val;
		}.bind(this));
		
	},
	
	setValue: function(value) {
		this._focusAfterUpdate = true;
		var newState = this.getStateFromValue(value);
		newState.isOpen = false;
		this.fireChangeEvent(newState);
		this.setState(newState);
	},
	
	selectValue: function(value) {
		this[this.props.multi ? 'addValue' : 'setValue'](value);
	},
	
	addValue: function(value) {
		this.setValue(this.state.values.concat(value));
	},
	
	popValue: function() {
		this.setValue(_.initial(this.state.values));
	},
	
	removeValue: function(value) {
		this.setValue(_.without(this.state.values, value));
	},
	
	clearValue: function(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type == 'mousedown' && event.button !== 0) {
			return;
		}
		this.setValue(null);
	},
	
	resetValue: function() {
		this.setValue(this.state.value);
	},
	
	fireChangeEvent: function(newState) {
		if (newState.value !== this.state.value && this.props.onChange) {
			this.props.onChange(newState.value, newState.values);
		}
	},
	
	handleMouseDown: function(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type == 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.handleMouseDownImplementation();
		
	},
	handleMouseDownImplementation: function() {
		if (this.state.isFocused) {
			this.setState({
				isOpen: true
			});
		} else {
			this._openAfterFocus = true;
			this.refs.input.focus();
		}
	},
	
	handleInputFocus: function() {
		this.setState({
			isFocused: true,
			isOpen: this.state.isOpen || this._openAfterFocus
		});
		this._openAfterFocus = false;
	},
	
	handleInputBlur: function(event) {
		this._blurTimeout = setTimeout(function() {
			if (this._focusAfterUpdate) return;
			this.setState({
				isOpen: false,
				isFocused: false
			});
		}.bind(this), 50);
	},
	
	handleKeyDown: function(event) {
		switch (event.keyCode) {
			
			case 8: // backspace
				if (!this.state.inputValue) {
					this.popValue();
				}
				return;
			break;
			
			case 9: // tab
				if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
					return;
				}
				this.selectFocusedOption();
			break;
			
			case 13: // enter
				this.selectFocusedOption();
			break;
			
			case 27: // escape
				if (this.state.isOpen) {
					this.resetValue();
				} else {
					this.clearValue();
				}
			break;
			
			case 38: // up
				this.focusPreviousOption();
			break;
			
			case 40: // down
				this.focusNextOption();
			break;

			case 32: //space to open drop down
				if(this.state.isOpen !== true) {
					this.handleMouseDownImplementation();
					this.setState({isOpen: true})
				}
				else
					return;
			break;
			
			default: return;
		}
		
		//prevent default action of whatever key was pressed
		event.preventDefault();
		
	},
	
	handleInputChange: function(event) {
		
		// assign an internal variable because we need to use
		// the latest value before setState() has completed.
		this._optionsFilterString = event.target.value;
		
		if (this.props.asyncOptions) {
			this.setState({
				isLoading: true,
				inputValue: event.target.value
			});
			this.loadAsyncOptions(event.target.value, {
				isLoading: false,
				isOpen: true
			});
		} else {
			var filteredOptions = this.filterOptions(this.state.options);
			this.setState({
				isOpen: true,
				inputValue: event.target.value,
				filteredOptions: filteredOptions,
				focusedOption: _.contains(filteredOptions, this.state.focusedOption) ? this.state.focusedOption : filteredOptions[0]
			});
		}
		
	},
	
	autoloadAsyncOptions: function() {
		this.loadAsyncOptions('', {}, function() {});
	},
	
	loadAsyncOptions: function(input, state) {
		
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
		
		this.props.asyncOptions(input, function(err, data) {
			
			this._optionsCache[input] = data;
			
			if (thisRequestId !== this._currentRequestId) {
				return;
			}
			
			this.setState(_.extend({
				options: data.options,
				filteredOptions: this.filterOptions(data.options)
			}, state));
			
		}.bind(this));
		
	},
	
	filterOptions: function(options, values) {
		var filterValue = this._optionsFilterString;
		var exclude = (values || this.state.values).map(function(i) {
			return i.value;
		});
		if (this.props.filterOptions) {
			return this.props.filterOptions.call(this, options, filterValue, exclude);
		} else {
			var filterOption = function(op) {
				if (this.props.multi && _.contains(exclude, op.value)) return false;
				if (this.props.filterOption) return this.props.filterOption.call(this, op, filterValue);
				return !filterValue || (this.props.matchPos === 'start') ? (
					(this.props.matchProp !== 'label' && op.value.toLowerCase().substr(0, filterValue.length) === filterValue) ||
					(this.props.matchProp !== 'value' && op.label.toLowerCase().substr(0, filterValue.length) === filterValue)
				) : (
					(this.props.matchProp !== 'label' && op.value.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) ||
					(this.props.matchProp !== 'value' && op.label.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0)
				);
			};
			return _.filter(options, filterOption, this);
		}
	},
	
	selectFocusedOption: function() {
		return this.selectValue(this.state.focusedOption);
	},
	
	focusOption: function(op) {
		this.setState({
			focusedOption: op
		});
	},
	
	focusNextOption: function() {
		this.focusAdjacentOption('next');
	},
	
	focusPreviousOption: function() {
		this.focusAdjacentOption('previous');
	},
	
	focusAdjacentOption: function(dir) {
		this._focusedOptionReveal = true;
		
		var ops = this.state.filteredOptions;
		
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
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
		
		if (dir === 'next' && focusedIndex > -1 && focusedIndex < ops.length - 1) {
			focusedOption = ops[focusedIndex + 1];
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedOption = ops[focusedIndex - 1];
			} else {
				focusedOption = ops[ops.length - 1];
			}
		}
		
		this.setState({
			focusedOption: focusedOption
		});
		
	},
	
	unfocusOption: function(op) {
		if (this.state.focusedOption === op) {
			this.setState({
				focusedOption: null
			});
		}
	},

  swapFocus: function (list, oldFocusIndex, newFocusIndex) {
    if(!list) {
      return;
    }

    if(!list[oldFocusIndex] || !list[newFocusIndex]) {
    	return;
    }

    if((!newFocusIndex && newFocusIndex !== 0) || oldFocusIndex === newFocusIndex) {
    	return;
    }

    var oldFocusReplacement = React.addons.cloneWithProps(
      list[oldFocusIndex],
      {
        key: list[oldFocusIndex].key,
        ref: null
      }
    );

    var newFocusReplacement = React.addons.cloneWithProps(
      list[newFocusIndex],
      {
        key: list[newFocusIndex].key,
        ref: "focused"
      }
    );

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

    if(this.cachedFiltered == this.state.filteredOptions)
    {
      this.swapFocus(this.cachedMenu, this.cachedFocusedItemIndex, this.cachedListItemsIndexLookup[focusedValue]);
      return this.cachedMenu;
    }

    this.cachedListItemsIndexLookup = {};

		var ops = _.map(this.state.filteredOptions, function(op, index) {
			var isFocused = focusedValue === op.value;
			
			var optionClass = classes({
				'Select-option': true,
				'is-focused': isFocused
			});

			var ref = isFocused ? 'focused' : null;
			
			var mouseEnter = this.focusOption.bind(this, op),
				mouseLeave = this.unfocusOption.bind(this, op),
				mouseDown = this.selectValue.bind(this, op);

      this.cachedListItemsIndexLookup[op.value] = index;
      var checkMark = "";
      if(isFocused)
      {
        this.cachedFocusedItem = index;
        checkMark = " Selected";
      }
			
			return React.createElement("a", {role: "listitem", "aria-label": op.label + checkMark, ref: ref, key: 'option-' + op.value, className: optionClass, onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, onMouseDown: mouseDown, onClick: mouseDown}, op.label);
			
		}, this);
		
		return ops.length ? ops : (
			React.createElement("div", {className: "Select-noresults"}, 
				this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText
			)
		);
		
	},

	buildCustomMenu: function() {    
    if(!this.props.children) {
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
	
	render: function() {
		var selectClass = classes('Select', this.props.className, {
			'is-multi': this.props.multi,
			'is-open': this.state.isOpen,
			'is-focused': this.state.isFocused,
			'is-loading': this.state.isLoading,
			'has-value': this.state.value
		});
		
		var value = [];
		
		if (this.props.multi) {
			this.state.values.forEach(function(val) {
				props = _.extend({
					key: val.value,
					onRemove: this.removeValue.bind(this, val)
				}, val);
				value.push(React.createElement(Value, React.__spread({},  props)));
			}, this);
		}
		
		if (!this.state.inputValue && (!this.props.multi || !value.length)) {
			value.push(React.createElement("div", {"aria-hidden": "true", className: "Select-placeholder", key: "placeholder"}, this.state.placeholder));
		}

		var loading = this.state.isLoading ? React.createElement("span", {className: "Select-loading", "aria-hidden": "true"}) : null;
		var clear = this.props.clearable && this.state.value ? React.createElement("span", {role: "button", className: "Select-clear", title: this.props.multi ? this.props.clearAllText : this.props.clearValueText, "aria-label": this.props.multi ? this.props.clearAllText : this.props.clearValueText, onMouseDown: this.clearValue, onClick: this.clearValue, dangerouslySetInnerHTML: { __html: '&times;'}}) : null;
		
		var builtMenu = this.props.buildCustomMenu ? this.props.buildCustomMenu(this.selectValue, this.state.filteredOptions, this.state.focusedOption, this.focusOption, this.unfocusOption) : this.buildMenu();
		// var builtMenu = this.props.children ? this.buildCustomMenu() : this.buildMenu();

    this.cachedFiltered = this.state.filteredOptions;
    this.cachedMenu = builtMenu;

		var menu = this.state.isOpen ? React.createElement("div", {id: "Select-menu", ref: "menu", className: "Select-menu"}, builtMenu) : null;
		// var menu = 1 ? <ul id="Select-menu" ref="menu" className="Select-menu">{builtMenu}</ul> : null;

		return (
			React.createElement("div", {ref: "wrapper", className: selectClass}, 
				React.createElement("input", {type: "hidden", ref: "value", name: this.props.name, value: this.state.value}), 
				
				React.createElement("div", {className: "Select-control", ref: "control", onKeyDown: this.handleKeyDown, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown}, 
					value, 
					React.createElement(Input, {
						"aria-label": "Currently " + this.state.filteredOptions.length + " options are available. Press spacebar to open select options or start typing for options to be filtered.", 
						className: "Select-input", 
						tabIndex: this.props.tabIndex, ref: "input", 
						value: this.state.inputValue, 
						onFocus: this.handleInputFocus, 
						onBlur: this.handleInputBlur, 
						onChange: this.handleInputChange, 
						minWidth: "5"}), 
					React.createElement("span", {className: "Select-arrow"}), 
					loading, 
					clear
					
				), 
				React.createElement("div", {id: "alert-options", role: "alert"}, 
				
				menu
				)
			)
		);
		
	}
	
});


module.exports = Select;

},{"./CustomMenuMixin.js":"/Users/andrewblowe/Projects/usaid/react-select/src/CustomMenuMixin.js","./Value":"/Users/andrewblowe/Projects/usaid/react-select/src/Value.js","classnames":"/Users/andrewblowe/Projects/usaid/react-select/node_modules/classnames/index.js","react-input-autosize":false,"react/addons":false,"underscore":false}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsInNyYy9DdXN0b21NZW51TWl4aW4uanMiLCJzcmMvVmFsdWUuanMiLCJzcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGNsYXNzbmFtZXMoKSB7XG5cdHZhciBhcmdzID0gYXJndW1lbnRzLCBjbGFzc2VzID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChhcmdzW2ldICYmICdzdHJpbmcnID09PSB0eXBlb2YgYXJnc1tpXSkge1xuXHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZ3NbaV0pO1xuXHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmdzW2ldKSB7XG5cdFx0XHRjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoT2JqZWN0LmtleXMoYXJnc1tpXSkuZmlsdGVyKGZ1bmN0aW9uKGNscykge1xuXHRcdFx0XHRyZXR1cm4gYXJnc1tpXVtjbHNdO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzbmFtZXM7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ3VzdG9tTWVudU1peGluID0ge1xuICBwcm9wVHlwZXM6IHtcbiAgICBvblNlbGVjdEl0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLFxuICAgIGZpbHRlcmVkOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpbnB1dFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZvY3Vzc2VkSXRlbTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBkZWZhdWx0UHJvcHM6IHtcbiAgICBvblNlbGVjdEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHt9LFxuICAgIG9wdGlvbnM6IFtdLFxuICAgIGZpbHRlcmVkOiBbXSxcbiAgICBpbnB1dFZhbHVlOiBudWxsLFxuICAgIGZvY3Vzc2VkSXRlbTogbnVsbCxcbiAgICBvbkZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge30sXG4gICAgb25VbmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge31cbiAgfSxcblxuICBzZWxlY3RJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdEl0ZW0oaXRlbSk7XG4gIH0sXG5cbiAgZm9jdXNJdGVtOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdGhpcy5wcm9wcy5vbkZvY3VzSXRlbShpdGVtKTtcbiAgfSxcblxuICB1bmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMucHJvcHMub25VbmZvY3VzSXRlbShpdGVtKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b21NZW51TWl4aW47IiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0Y2xhc3NlcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIE9wdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XG5cdGRpc3BsYXlOYW1lOiAnVmFsdWUnLFxuXHRcblx0cHJvcFR5cGVzOiB7XG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXHRcblx0YmxvY2tFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJTZWxlY3QtaXRlbVwiLCByb2xlOiBcImJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLnByb3BzLm9uUmVtb3ZlLCBcImFyaWEtbGFiZWxcIjogXCJSZW1vdmUgXCIgKyB0aGlzLnByb3BzLmxhYmVsfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWl0ZW0taWNvblwiLCBvbk1vdXNlRG93bjogdGhpcy5ibG9ja0V2ZW50LCBvbkNsaWNrOiB0aGlzLnByb3BzLm9uUmVtb3ZlLCBvblRvdWNoRW5kOiB0aGlzLnByb3BzLm9uUmVtb3ZlfSwgXCLDl1wiKSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWl0ZW0tbGFiZWxcIn0sIHRoaXMucHJvcHMubGFiZWwpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxuXHRcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9wdGlvbjtcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXHRSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpLFxuXHRJbnB1dCA9IHJlcXVpcmUoJ3JlYWN0LWlucHV0LWF1dG9zaXplJyksXG5cdGNsYXNzZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyksXG5cdFZhbHVlID0gcmVxdWlyZSgnLi9WYWx1ZScpXG5cdEN1c3RvbU1lbnVNaXhpbiA9IHJlcXVpcmUoJy4vQ3VzdG9tTWVudU1peGluLmpzJyk7XG5cbnZhciByZXF1ZXN0SWQgPSAwO1xuXG5TZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdFxuXHRkaXNwbGF5TmFtZTogJ0FjY2Vzc2libGVTZWxlY3QnLFxuXG5cdHN0YXRpY3M6IHtcblx0XHRDdXN0b21NZW51TWl4aW46IEN1c3RvbU1lbnVNaXhpblxuXHR9LFxuXG5cdHByb3BUeXBlczoge1xuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXG5cdFx0bXVsdGk6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgIC8vIG11bHRpLXZhbHVlIGlucHV0XG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LCAgICAgICAgICAgIC8vIGFycmF5IG9mIG9wdGlvbnNcblx0XHRkZWxpbWl0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gZGVsaW1pdGVyIHRvIHVzZSB0byBqb2luIG11bHRpcGxlIHZhbHVlc1xuXHRcdGFzeW5jT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBmdW5jdGlvbiB0byBjYWxsIHRvIGdldCBvcHRpb25zXG5cdFx0YXV0b2xvYWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gYXV0by1sb2FkIHRoZSBkZWZhdWx0IGFzeW5jIG9wdGlvbnMgc2V0XG5cdFx0cGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgIC8vIGZpZWxkIHBsYWNlaG9sZGVyLCBkaXNwbGF5ZWQgd2hlbiB0aGVyZSdzIG5vIHZhbHVlXG5cdFx0bm9SZXN1bHRzVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGluZyBzZWFyY2ggcmVzdWx0c1xuXHRcdGNsZWFyYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyBzaG91bGQgaXQgYmUgcG9zc2libGUgdG8gcmVzZXQgdmFsdWVcblx0XHRjbGVhclZhbHVlVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbFxuXHRcdGNsZWFyQWxsVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sIHdoZW4gbXVsdGk6IHRydWVcblx0XHRzZWFyY2hQcm9tcHRUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgLy8gbGFiZWwgdG8gcHJvbXB0IGZvciBzZWFyY2ggaW5wdXRcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgLy8gZmllbGQgbmFtZSwgZm9yIGhpZGRlbiA8aW5wdXQgLz4gdGFnXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgIC8vIG9uQ2hhbmdlIGhhbmRsZXI6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7fVxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyBjbGFzc05hbWUgZm9yIHRoZSBvdXRlciBlbGVtZW50XG5cdFx0ZmlsdGVyT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgYSBzaW5nbGUgb3B0aW9uOiBmdW5jdGlvbihvcHRpb24sIGZpbHRlclN0cmluZylcblx0XHRmaWx0ZXJPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gbWV0aG9kIHRvIGZpbHRlciB0aGUgb3B0aW9ucyBhcnJheTogZnVuY3Rpb24oW29wdGlvbnNdLCBmaWx0ZXJTdHJpbmcsIFt2YWx1ZXNdKVxuXHRcdG1hdGNoUG9zOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyAoYW55fHN0YXJ0KSBtYXRjaCB0aGUgc3RhcnQgb3IgZW50aXJlIHN0cmluZyB3aGVuIGZpbHRlcmluZ1xuXHRcdG1hdGNoUHJvcDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyAgICAgICAgIC8vIChhbnl8bGFiZWx8dmFsdWUpIHdoaWNoIG9wdGlvbiBwcm9wZXJ0eSB0byBmaWx0ZXIgb25cblx0fSxcblx0XG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRvcHRpb25zOiBbXSxcblx0XHRcdGRlbGltaXRlcjogJywnLFxuXHRcdFx0YXN5bmNPcHRpb25zOiB1bmRlZmluZWQsXG5cdFx0XHRhdXRvbG9hZDogdHJ1ZSxcblx0XHRcdHBsYWNlaG9sZGVyOiAnU2VsZWN0Li4uJyxcblx0XHRcdG5vUmVzdWx0c1RleHQ6ICdObyByZXN1bHRzIGZvdW5kJyxcblx0XHRcdGNsZWFyYWJsZTogdHJ1ZSxcblx0XHRcdGNsZWFyVmFsdWVUZXh0OiAnQ2xlYXIgdmFsdWUnLFxuXHRcdFx0Y2xlYXJBbGxUZXh0OiAnQ2xlYXIgYWxsJyxcblx0XHRcdHNlYXJjaFByb21wdFRleHQ6ICdUeXBlIHRvIHNlYXJjaCcsXG5cdFx0XHRuYW1lOiB1bmRlZmluZWQsXG5cdFx0XHRvbkNoYW5nZTogdW5kZWZpbmVkLFxuXHRcdFx0Y2xhc3NOYW1lOiB1bmRlZmluZWQsXG5cdFx0XHRtYXRjaFBvczogJ2FueScsXG5cdFx0XHRtYXRjaFByb3A6ICdhbnknXG5cdFx0fTtcblx0fSxcblx0XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBzZXQgYnkgZ2V0U3RhdGVGcm9tVmFsdWUgb24gY29tcG9uZW50V2lsbE1vdW50OlxuXHRcdFx0ICogLSB2YWx1ZVxuXHRcdFx0ICogLSB2YWx1ZXNcblx0XHRcdCAqIC0gZmlsdGVyZWRPcHRpb25zXG5cdFx0XHQgKiAtIGlucHV0VmFsdWVcblx0XHRcdCAqIC0gcGxhY2Vob2xkZXJcblx0XHRcdCAqIC0gZm9jdXNlZE9wdGlvblxuXHRcdFx0Ki9cblx0XHRcdG9wdGlvbnM6IHRoaXMucHJvcHMub3B0aW9ucyxcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cdFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX29wdGlvbnNDYWNoZSA9IHt9O1xuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSAnJztcblx0XHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUodGhpcy5wcm9wcy52YWx1ZSkpO1xuXHRcdFxuXHRcdGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyAmJiB0aGlzLnByb3BzLmF1dG9sb2FkKSB7XG5cdFx0XHR0aGlzLmF1dG9sb2FkQXN5bmNPcHRpb25zKCk7XG5cdFx0fVxuXHR9LFxuXHRcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9ibHVyVGltZW91dCk7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzVGltZW91dCk7XG5cdH0sXG5cdFxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcykge1xuXHRcdGlmIChuZXdQcm9wcy52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVZhbHVlKG5ld1Byb3BzLnZhbHVlLCBuZXdQcm9wcy5vcHRpb25zKSk7XG5cdFx0fVxuXHRcdGlmIChKU09OLnN0cmluZ2lmeShuZXdQcm9wcy5vcHRpb25zKSAhPT0gSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5vcHRpb25zKSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdG9wdGlvbnM6IG5ld1Byb3BzLm9wdGlvbnMsXG5cdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zKG5ld1Byb3BzLm9wdGlvbnMpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fYmx1clRpbWVvdXQpO1xuXHRcdFx0dGhpcy5fZm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5yZWZzLmlucHV0LmZvY3VzKCk7XG5cdFx0XHRcdHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUgPSBmYWxzZTtcblx0XHRcdH0uYmluZCh0aGlzKSwgNTApO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsKSB7XG5cdFx0XHRpZiAodGhpcy5yZWZzLmZvY3VzZWQgJiYgdGhpcy5yZWZzLm1lbnUpIHtcblx0XHRcdFx0dmFyIGZvY3VzZWRET00gPSB0aGlzLnJlZnMuZm9jdXNlZC5nZXRET01Ob2RlKCk7XG5cdFx0XHRcdHZhciBtZW51RE9NID0gdGhpcy5yZWZzLm1lbnUuZ2V0RE9NTm9kZSgpO1xuXHRcdFx0XHR2YXIgZm9jdXNlZFJlY3QgPSBmb2N1c2VkRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHR2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0XHRcdGlmIChmb2N1c2VkUmVjdC5ib3R0b20gPiBtZW51UmVjdC5ib3R0b20gfHxcblx0XHRcdFx0XHRmb2N1c2VkUmVjdC50b3AgPCBtZW51UmVjdC50b3ApIHtcblx0XHRcdFx0XHRtZW51RE9NLnNjcm9sbFRvcCA9IChmb2N1c2VkRE9NLm9mZnNldFRvcCArIGZvY3VzZWRET00uY2xpZW50SGVpZ2h0IC0gbWVudURPTS5vZmZzZXRIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSBmYWxzZTtcblx0XHR9XG5cdH0sXG5cdFxuXHRnZXRTdGF0ZUZyb21WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcblx0XHRcblx0XHRpZiAoIW9wdGlvbnMpIHtcblx0XHRcdG9wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIHJlc2V0IGludGVybmFsIGZpbHRlciBzdHJpbmdcblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gJyc7XG5cdFx0XG5cdFx0dmFyIHZhbHVlcyA9IHRoaXMuaW5pdFZhbHVlc0FycmF5KHZhbHVlLCBvcHRpb25zKSxcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyhvcHRpb25zLCB2YWx1ZXMpO1xuXHRcdFxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdmFsdWVzLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiB2LnZhbHVlOyB9KS5qb2luKHRoaXMucHJvcHMuZGVsaW1pdGVyKSxcblx0XHRcdHZhbHVlczogdmFsdWVzLFxuXHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IGZpbHRlcmVkT3B0aW9ucyxcblx0XHRcdHBsYWNlaG9sZGVyOiAhdGhpcy5wcm9wcy5tdWx0aSAmJiB2YWx1ZXMubGVuZ3RoID8gdmFsdWVzWzBdLmxhYmVsIDogdGhpcy5wcm9wcy5wbGFjZWhvbGRlcixcblx0XHRcdGZvY3VzZWRPcHRpb246ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0gOiBmaWx0ZXJlZE9wdGlvbnNbMF1cblx0XHR9O1xuXHRcdFxuXHR9LFxuXHRcblx0aW5pdFZhbHVlc0FycmF5OiBmdW5jdGlvbih2YWx1ZXMsIG9wdGlvbnMpIHtcblx0XHRcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuXHRcdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWVzKSB7XG5cdFx0XHRcdHZhbHVlcyA9IHZhbHVlcy5zcGxpdCh0aGlzLnByb3BzLmRlbGltaXRlcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMgPyBbdmFsdWVzXSA6IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbih2YWwpIHtcblx0XHRcdHJldHVybiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWwpID8gdmFsID0gXy5maW5kV2hlcmUob3B0aW9ucywgeyB2YWx1ZTogdmFsIH0pIHx8IHsgdmFsdWU6IHZhbCwgbGFiZWw6IHZhbCB9IDogdmFsO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XG5cdH0sXG5cdFxuXHRzZXRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gdHJ1ZTtcblx0XHR2YXIgbmV3U3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVZhbHVlKHZhbHVlKTtcblx0XHRuZXdTdGF0ZS5pc09wZW4gPSBmYWxzZTtcblx0XHR0aGlzLmZpcmVDaGFuZ2VFdmVudChuZXdTdGF0ZSk7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cdFxuXHRzZWxlY3RWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzW3RoaXMucHJvcHMubXVsdGkgPyAnYWRkVmFsdWUnIDogJ3NldFZhbHVlJ10odmFsdWUpO1xuXHR9LFxuXHRcblx0YWRkVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLnN0YXRlLnZhbHVlcy5jb25jYXQodmFsdWUpKTtcblx0fSxcblx0XG5cdHBvcFZhbHVlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFZhbHVlKF8uaW5pdGlhbCh0aGlzLnN0YXRlLnZhbHVlcykpO1xuXHR9LFxuXHRcblx0cmVtb3ZlVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZShfLndpdGhvdXQodGhpcy5zdGF0ZS52YWx1ZXMsIHZhbHVlKSk7XG5cdH0sXG5cdFxuXHRjbGVhclZhbHVlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIGlnbm9yZSBpdC5cblx0XHRpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5zZXRWYWx1ZShudWxsKTtcblx0fSxcblx0XG5cdHJlc2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZSk7XG5cdH0sXG5cdFxuXHRmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG5cdFx0aWYgKG5ld1N0YXRlLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlICYmIHRoaXMucHJvcHMub25DaGFuZ2UpIHtcblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UobmV3U3RhdGUudmFsdWUsIG5ld1N0YXRlLnZhbHVlcyk7XG5cdFx0fVxuXHR9LFxuXHRcblx0aGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIGlnbm9yZSBpdC5cblx0XHRpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bkltcGxlbWVudGF0aW9uKCk7XG5cdFx0XG5cdH0sXG5cdGhhbmRsZU1vdXNlRG93bkltcGxlbWVudGF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5pc0ZvY3VzZWQpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9vcGVuQWZ0ZXJGb2N1cyA9IHRydWU7XG5cdFx0XHR0aGlzLnJlZnMuaW5wdXQuZm9jdXMoKTtcblx0XHR9XG5cdH0sXG5cdFxuXHRoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzRm9jdXNlZDogdHJ1ZSxcblx0XHRcdGlzT3BlbjogdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXNcblx0XHR9KTtcblx0XHR0aGlzLl9vcGVuQWZ0ZXJGb2N1cyA9IGZhbHNlO1xuXHR9LFxuXHRcblx0aGFuZGxlSW5wdXRCbHVyOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLl9mb2N1c0FmdGVyVXBkYXRlKSByZXR1cm47XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpLCA1MCk7XG5cdH0sXG5cdFxuXHRoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuXHRcdHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0XG5cdFx0XHRjYXNlIDg6IC8vIGJhY2tzcGFjZVxuXHRcdFx0XHRpZiAoIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMucG9wVmFsdWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdFx0Y2FzZSA5OiAvLyB0YWJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8ICF0aGlzLnN0YXRlLmlzT3BlbiB8fCAhdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgMTM6IC8vIGVudGVyXG5cdFx0XHRcdHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgMjc6IC8vIGVzY2FwZVxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdFx0XHR0aGlzLnJlc2V0VmFsdWUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmNsZWFyVmFsdWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgMzg6IC8vIHVwXG5cdFx0XHRcdHRoaXMuZm9jdXNQcmV2aW91c09wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgNDA6IC8vIGRvd25cblx0XHRcdFx0dGhpcy5mb2N1c05leHRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDMyOiAvL3NwYWNlIHRvIG9wZW4gZHJvcCBkb3duXG5cdFx0XHRcdGlmKHRoaXMuc3RhdGUuaXNPcGVuICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0dGhpcy5oYW5kbGVNb3VzZURvd25JbXBsZW1lbnRhdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe2lzT3BlbjogdHJ1ZX0pXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0XHRkZWZhdWx0OiByZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdC8vcHJldmVudCBkZWZhdWx0IGFjdGlvbiBvZiB3aGF0ZXZlciBrZXkgd2FzIHByZXNzZWRcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFxuXHR9LFxuXHRcblx0aGFuZGxlSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XG5cdFx0Ly8gYXNzaWduIGFuIGludGVybmFsIHZhcmlhYmxlIGJlY2F1c2Ugd2UgbmVlZCB0byB1c2Vcblx0XHQvLyB0aGUgbGF0ZXN0IHZhbHVlIGJlZm9yZSBzZXRTdGF0ZSgpIGhhcyBjb21wbGV0ZWQuXG5cdFx0dGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZyA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblx0XHRcblx0XHRpZiAodGhpcy5wcm9wcy5hc3luY09wdGlvbnMpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0xvYWRpbmc6IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmxvYWRBc3luY09wdGlvbnMoZXZlbnQudGFyZ2V0LnZhbHVlLCB7XG5cdFx0XHRcdGlzTG9hZGluZzogZmFsc2UsXG5cdFx0XHRcdGlzT3BlbjogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBmaWx0ZXJlZE9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnModGhpcy5zdGF0ZS5vcHRpb25zKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IF8uY29udGFpbnMoZmlsdGVyZWRPcHRpb25zLCB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24pID8gdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uIDogZmlsdGVyZWRPcHRpb25zWzBdXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0XG5cdH0sXG5cdFxuXHRhdXRvbG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5sb2FkQXN5bmNPcHRpb25zKCcnLCB7fSwgZnVuY3Rpb24oKSB7fSk7XG5cdH0sXG5cdFxuXHRsb2FkQXN5bmNPcHRpb25zOiBmdW5jdGlvbihpbnB1dCwgc3RhdGUpIHtcblx0XHRcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBpbnB1dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGNhY2hlS2V5ID0gaW5wdXQuc2xpY2UoMCwgaSk7XG5cdFx0XHRpZiAodGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IHRoaXMuX29wdGlvbnNDYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XG5cdFx0XHRcdHZhciBvcHRpb25zID0gdGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XS5vcHRpb25zO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKF8uZXh0ZW5kKHtcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRpb25zLFxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zKG9wdGlvbnMpXG5cdFx0XHRcdH0sIHN0YXRlKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0dmFyIHRoaXNSZXF1ZXN0SWQgPSB0aGlzLl9jdXJyZW50UmVxdWVzdElkID0gcmVxdWVzdElkKys7XG5cdFx0XG5cdFx0dGhpcy5wcm9wcy5hc3luY09wdGlvbnMoaW5wdXQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuXHRcdFx0XG5cdFx0XHR0aGlzLl9vcHRpb25zQ2FjaGVbaW5wdXRdID0gZGF0YTtcblx0XHRcdFxuXHRcdFx0aWYgKHRoaXNSZXF1ZXN0SWQgIT09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR0aGlzLnNldFN0YXRlKF8uZXh0ZW5kKHtcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zLFxuXHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IHRoaXMuZmlsdGVyT3B0aW9ucyhkYXRhLm9wdGlvbnMpXG5cdFx0XHR9LCBzdGF0ZSkpO1xuXHRcdFx0XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcblx0fSxcblx0XG5cdGZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMsIHZhbHVlcykge1xuXHRcdHZhciBmaWx0ZXJWYWx1ZSA9IHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmc7XG5cdFx0dmFyIGV4Y2x1ZGUgPSAodmFsdWVzIHx8IHRoaXMuc3RhdGUudmFsdWVzKS5tYXAoZnVuY3Rpb24oaSkge1xuXHRcdFx0cmV0dXJuIGkudmFsdWU7XG5cdFx0fSk7XG5cdFx0aWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucykge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucy5jYWxsKHRoaXMsIG9wdGlvbnMsIGZpbHRlclZhbHVlLCBleGNsdWRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGZpbHRlck9wdGlvbiA9IGZ1bmN0aW9uKG9wKSB7XG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLm11bHRpICYmIF8uY29udGFpbnMoZXhjbHVkZSwgb3AudmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmZpbHRlck9wdGlvbikgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uLmNhbGwodGhpcywgb3AsIGZpbHRlclZhbHVlKTtcblx0XHRcdFx0cmV0dXJuICFmaWx0ZXJWYWx1ZSB8fCAodGhpcy5wcm9wcy5tYXRjaFBvcyA9PT0gJ3N0YXJ0JykgPyAoXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIG9wLnZhbHVlLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKSB8fFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBvcC5sYWJlbC50b0xvd2VyQ2FzZSgpLnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSlcblx0XHRcdFx0KSA6IChcblx0XHRcdFx0XHQodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgb3AudmFsdWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCkpID49IDApIHx8XG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnICYmIG9wLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwKVxuXHRcdFx0XHQpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBfLmZpbHRlcihvcHRpb25zLCBmaWx0ZXJPcHRpb24sIHRoaXMpO1xuXHRcdH1cblx0fSxcblx0XG5cdHNlbGVjdEZvY3VzZWRPcHRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnNlbGVjdFZhbHVlKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbik7XG5cdH0sXG5cdFxuXHRmb2N1c09wdGlvbjogZnVuY3Rpb24ob3ApIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGZvY3VzZWRPcHRpb246IG9wXG5cdFx0fSk7XG5cdH0sXG5cdFxuXHRmb2N1c05leHRPcHRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignbmV4dCcpO1xuXHR9LFxuXHRcblx0Zm9jdXNQcmV2aW91c09wdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwcmV2aW91cycpO1xuXHR9LFxuXHRcblx0Zm9jdXNBZGphY2VudE9wdGlvbjogZnVuY3Rpb24oZGlyKSB7XG5cdFx0dGhpcy5fZm9jdXNlZE9wdGlvblJldmVhbCA9IHRydWU7XG5cdFx0XG5cdFx0dmFyIG9wcyA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuXHRcdFxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdFx0XHRmb2N1c2VkT3B0aW9uOiB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gfHwgb3BzW2RpciA9PT0gJ25leHQnID8gMCA6IG9wcy5sZW5ndGggLSAxXVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGlmICghb3BzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHR2YXIgZm9jdXNlZEluZGV4ID0gLTE7XG5cdFx0XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPT09IG9wc1tpXSkge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0dmFyIGZvY3VzZWRPcHRpb24gPSBvcHNbMF07XG5cdFx0XG5cdFx0aWYgKGRpciA9PT0gJ25leHQnICYmIGZvY3VzZWRJbmRleCA+IC0xICYmIGZvY3VzZWRJbmRleCA8IG9wcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRmb2N1c2VkT3B0aW9uID0gb3BzW2ZvY3VzZWRJbmRleCArIDFdO1xuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAncHJldmlvdXMnKSB7XG5cdFx0XHRpZiAoZm9jdXNlZEluZGV4ID4gMCkge1xuXHRcdFx0XHRmb2N1c2VkT3B0aW9uID0gb3BzW2ZvY3VzZWRJbmRleCAtIDFdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tvcHMubGVuZ3RoIC0gMV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZE9wdGlvbjogZm9jdXNlZE9wdGlvblxuXHRcdH0pO1xuXHRcdFxuXHR9LFxuXHRcblx0dW5mb2N1c09wdGlvbjogZnVuY3Rpb24ob3ApIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uID09PSBvcCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IG51bGxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuICBzd2FwRm9jdXM6IGZ1bmN0aW9uIChsaXN0LCBvbGRGb2N1c0luZGV4LCBuZXdGb2N1c0luZGV4KSB7XG4gICAgaWYoIWxpc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZighbGlzdFtvbGRGb2N1c0luZGV4XSB8fCAhbGlzdFtuZXdGb2N1c0luZGV4XSkge1xuICAgIFx0cmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCghbmV3Rm9jdXNJbmRleCAmJiBuZXdGb2N1c0luZGV4ICE9PSAwKSB8fCBvbGRGb2N1c0luZGV4ID09PSBuZXdGb2N1c0luZGV4KSB7XG4gICAgXHRyZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG9sZEZvY3VzUmVwbGFjZW1lbnQgPSBSZWFjdC5hZGRvbnMuY2xvbmVXaXRoUHJvcHMoXG4gICAgICBsaXN0W29sZEZvY3VzSW5kZXhdLFxuICAgICAge1xuICAgICAgICBrZXk6IGxpc3Rbb2xkRm9jdXNJbmRleF0ua2V5LFxuICAgICAgICByZWY6IG51bGxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdmFyIG5ld0ZvY3VzUmVwbGFjZW1lbnQgPSBSZWFjdC5hZGRvbnMuY2xvbmVXaXRoUHJvcHMoXG4gICAgICBsaXN0W25ld0ZvY3VzSW5kZXhdLFxuICAgICAge1xuICAgICAgICBrZXk6IGxpc3RbbmV3Rm9jdXNJbmRleF0ua2V5LFxuICAgICAgICByZWY6IFwiZm9jdXNlZFwiXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vY2xvbmVXaXRoUHJvcHMgYXBwZW5kcyBjbGFzc2VzLCBidXQgZG9lcyBub3QgcmVwbGFjZSB0aGVtLCB3aGljaCBpcyB3aGF0IEkgd2FudCBoZXJlXG4gICAgb2xkRm9jdXNSZXBsYWNlbWVudC5wcm9wcy5jbGFzc05hbWUgPSBcIlNlbGVjdC1vcHRpb25cIjtcbiAgICBuZXdGb2N1c1JlcGxhY2VtZW50LnByb3BzLmNsYXNzTmFtZSA9IFwiU2VsZWN0LW9wdGlvbiBpcy1mb2N1c2VkXCI7XG5cbiAgICB0aGlzLmNhY2hlZEZvY3VzZWRJdGVtSW5kZXggPSBuZXdGb2N1c0luZGV4O1xuXG4gICAgdGhpcy5jYWNoZWRNZW51LnNwbGljZShvbGRGb2N1c0luZGV4LCAxLCBvbGRGb2N1c1JlcGxhY2VtZW50KTtcbiAgICB0aGlzLmNhY2hlZE1lbnUuc3BsaWNlKG5ld0ZvY3VzSW5kZXgsIDEsIG5ld0ZvY3VzUmVwbGFjZW1lbnQpO1xuICB9LFxuXG4gIGNhY2hlZEZvY3VzZWRJdGVtSW5kZXg6IDAsXG4gIGNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwOiB7fSxcbiAgY2FjaGVkTWVudTogW10sXG4gIGNhY2hlZEZpbHRlcmVkOiBbXSxcblxuICBidWlsZE1lbnU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm9jdXNlZFZhbHVlID0gdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uID8gdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLnZhbHVlIDogbnVsbDtcblxuICAgIGlmKHRoaXMuY2FjaGVkRmlsdGVyZWQgPT0gdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMpXG4gICAge1xuICAgICAgdGhpcy5zd2FwRm9jdXModGhpcy5jYWNoZWRNZW51LCB0aGlzLmNhY2hlZEZvY3VzZWRJdGVtSW5kZXgsIHRoaXMuY2FjaGVkTGlzdEl0ZW1zSW5kZXhMb29rdXBbZm9jdXNlZFZhbHVlXSk7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZWRNZW51O1xuICAgIH1cblxuICAgIHRoaXMuY2FjaGVkTGlzdEl0ZW1zSW5kZXhMb29rdXAgPSB7fTtcblxuXHRcdHZhciBvcHMgPSBfLm1hcCh0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucywgZnVuY3Rpb24ob3AsIGluZGV4KSB7XG5cdFx0XHR2YXIgaXNGb2N1c2VkID0gZm9jdXNlZFZhbHVlID09PSBvcC52YWx1ZTtcblx0XHRcdFxuXHRcdFx0dmFyIG9wdGlvbkNsYXNzID0gY2xhc3Nlcyh7XG5cdFx0XHRcdCdTZWxlY3Qtb3B0aW9uJzogdHJ1ZSxcblx0XHRcdFx0J2lzLWZvY3VzZWQnOiBpc0ZvY3VzZWRcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgcmVmID0gaXNGb2N1c2VkID8gJ2ZvY3VzZWQnIDogbnVsbDtcblx0XHRcdFxuXHRcdFx0dmFyIG1vdXNlRW50ZXIgPSB0aGlzLmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZUxlYXZlID0gdGhpcy51bmZvY3VzT3B0aW9uLmJpbmQodGhpcywgb3ApLFxuXHRcdFx0XHRtb3VzZURvd24gPSB0aGlzLnNlbGVjdFZhbHVlLmJpbmQodGhpcywgb3ApO1xuXG4gICAgICB0aGlzLmNhY2hlZExpc3RJdGVtc0luZGV4TG9va3VwW29wLnZhbHVlXSA9IGluZGV4O1xuICAgICAgdmFyIGNoZWNrTWFyayA9IFwiXCI7XG4gICAgICBpZihpc0ZvY3VzZWQpXG4gICAgICB7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9jdXNlZEl0ZW0gPSBpbmRleDtcbiAgICAgICAgY2hlY2tNYXJrID0gXCIgU2VsZWN0ZWRcIjtcbiAgICAgIH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtyb2xlOiBcImxpc3RpdGVtXCIsIFwiYXJpYS1sYWJlbFwiOiBvcC5sYWJlbCArIGNoZWNrTWFyaywgcmVmOiByZWYsIGtleTogJ29wdGlvbi0nICsgb3AudmFsdWUsIGNsYXNzTmFtZTogb3B0aW9uQ2xhc3MsIG9uTW91c2VFbnRlcjogbW91c2VFbnRlciwgb25Nb3VzZUxlYXZlOiBtb3VzZUxlYXZlLCBvbk1vdXNlRG93bjogbW91c2VEb3duLCBvbkNsaWNrOiBtb3VzZURvd259LCBvcC5sYWJlbCk7XG5cdFx0XHRcblx0XHR9LCB0aGlzKTtcblx0XHRcblx0XHRyZXR1cm4gb3BzLmxlbmd0aCA/IG9wcyA6IChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJTZWxlY3Qtbm9yZXN1bHRzXCJ9LCBcblx0XHRcdFx0dGhpcy5wcm9wcy5hc3luY09wdGlvbnMgJiYgIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSA/IHRoaXMucHJvcHMuc2VhcmNoUHJvbXB0VGV4dCA6IHRoaXMucHJvcHMubm9SZXN1bHRzVGV4dFxuXHRcdFx0KVxuXHRcdCk7XG5cdFx0XG5cdH0sXG5cblx0YnVpbGRDdXN0b21NZW51OiBmdW5jdGlvbigpIHsgICAgXG4gICAgaWYoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHtcbiAgICBcdHJldHVybjtcbiAgICB9XG5cbiAgXHR2YXIgY2hpbGQgPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXG4gIFx0cmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwge1xuXHQgICAgb25TZWxlY3RJdGVtOiB0aGlzLnNlbGVjdFZhbHVlLFxuXHQgICAgb3B0aW9uczogdGhpcy5wcm9wcy5vcHRpb25zLFxuXHQgICAgZmlsdGVyZWQ6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLFxuXHQgICAgaW5wdXRWYWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlLFxuXHQgICAgZm9jdXNzZWRJdGVtOiB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24sXG5cdCAgICBvbkZvY3VzSXRlbTogdGhpcy5mb2N1c09wdGlvbixcblx0ICAgIG9uVW5mb2N1c0l0ZW06IHRoaXMudW5mb2N1c09wdGlvblxuICBcdH0pO1xuXHR9LFxuXHRcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZWN0Q2xhc3MgPSBjbGFzc2VzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J2lzLW11bHRpJzogdGhpcy5wcm9wcy5tdWx0aSxcblx0XHRcdCdpcy1vcGVuJzogdGhpcy5zdGF0ZS5pc09wZW4sXG5cdFx0XHQnaXMtZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxuXHRcdFx0J2lzLWxvYWRpbmcnOiB0aGlzLnN0YXRlLmlzTG9hZGluZyxcblx0XHRcdCdoYXMtdmFsdWUnOiB0aGlzLnN0YXRlLnZhbHVlXG5cdFx0fSk7XG5cdFx0XG5cdFx0dmFyIHZhbHVlID0gW107XG5cdFx0XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHRoaXMuc3RhdGUudmFsdWVzLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHByb3BzID0gXy5leHRlbmQoe1xuXHRcdFx0XHRcdGtleTogdmFsLnZhbHVlLFxuXHRcdFx0XHRcdG9uUmVtb3ZlOiB0aGlzLnJlbW92ZVZhbHVlLmJpbmQodGhpcywgdmFsKVxuXHRcdFx0XHR9LCB2YWwpO1xuXHRcdFx0XHR2YWx1ZS5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmFsdWUsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpKSk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUgJiYgKCF0aGlzLnByb3BzLm11bHRpIHx8ICF2YWx1ZS5sZW5ndGgpKSB7XG5cdFx0XHR2YWx1ZS5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIsIGNsYXNzTmFtZTogXCJTZWxlY3QtcGxhY2Vob2xkZXJcIiwga2V5OiBcInBsYWNlaG9sZGVyXCJ9LCB0aGlzLnN0YXRlLnBsYWNlaG9sZGVyKSk7XG5cdFx0fVxuXG5cdFx0dmFyIGxvYWRpbmcgPSB0aGlzLnN0YXRlLmlzTG9hZGluZyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWxvYWRpbmdcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pIDogbnVsbDtcblx0XHR2YXIgY2xlYXIgPSB0aGlzLnByb3BzLmNsZWFyYWJsZSAmJiB0aGlzLnN0YXRlLnZhbHVlID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge3JvbGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJTZWxlY3QtY2xlYXJcIiwgdGl0bGU6IHRoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHQsIFwiYXJpYS1sYWJlbFwiOiB0aGlzLnByb3BzLm11bHRpID8gdGhpcy5wcm9wcy5jbGVhckFsbFRleHQgOiB0aGlzLnByb3BzLmNsZWFyVmFsdWVUZXh0LCBvbk1vdXNlRG93bjogdGhpcy5jbGVhclZhbHVlLCBvbkNsaWNrOiB0aGlzLmNsZWFyVmFsdWUsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogJyZ0aW1lczsnfX0pIDogbnVsbDtcblx0XHRcblx0XHR2YXIgYnVpbHRNZW51ID0gdGhpcy5wcm9wcy5idWlsZEN1c3RvbU1lbnUgPyB0aGlzLnByb3BzLmJ1aWxkQ3VzdG9tTWVudSh0aGlzLnNlbGVjdFZhbHVlLCB0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucywgdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLCB0aGlzLmZvY3VzT3B0aW9uLCB0aGlzLnVuZm9jdXNPcHRpb24pIDogdGhpcy5idWlsZE1lbnUoKTtcblx0XHQvLyB2YXIgYnVpbHRNZW51ID0gdGhpcy5wcm9wcy5jaGlsZHJlbiA/IHRoaXMuYnVpbGRDdXN0b21NZW51KCkgOiB0aGlzLmJ1aWxkTWVudSgpO1xuXG4gICAgdGhpcy5jYWNoZWRGaWx0ZXJlZCA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuICAgIHRoaXMuY2FjaGVkTWVudSA9IGJ1aWx0TWVudTtcblxuXHRcdHZhciBtZW51ID0gdGhpcy5zdGF0ZS5pc09wZW4gPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtpZDogXCJTZWxlY3QtbWVudVwiLCByZWY6IFwibWVudVwiLCBjbGFzc05hbWU6IFwiU2VsZWN0LW1lbnVcIn0sIGJ1aWx0TWVudSkgOiBudWxsO1xuXHRcdC8vIHZhciBtZW51ID0gMSA/IDx1bCBpZD1cIlNlbGVjdC1tZW51XCIgcmVmPVwibWVudVwiIGNsYXNzTmFtZT1cIlNlbGVjdC1tZW51XCI+e2J1aWx0TWVudX08L3VsPiA6IG51bGw7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7cmVmOiBcIndyYXBwZXJcIiwgY2xhc3NOYW1lOiBzZWxlY3RDbGFzc30sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwiaGlkZGVuXCIsIHJlZjogXCJ2YWx1ZVwiLCBuYW1lOiB0aGlzLnByb3BzLm5hbWUsIHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlfSksIFxuXHRcdFx0XHRcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIlNlbGVjdC1jb250cm9sXCIsIHJlZjogXCJjb250cm9sXCIsIG9uS2V5RG93bjogdGhpcy5oYW5kbGVLZXlEb3duLCBvbk1vdXNlRG93bjogdGhpcy5oYW5kbGVNb3VzZURvd24sIG9uVG91Y2hFbmQ6IHRoaXMuaGFuZGxlTW91c2VEb3dufSwgXG5cdFx0XHRcdFx0dmFsdWUsIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHtcblx0XHRcdFx0XHRcdFwiYXJpYS1sYWJlbFwiOiBcIkN1cnJlbnRseSBcIiArIHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCArIFwiIG9wdGlvbnMgYXJlIGF2YWlsYWJsZS4gUHJlc3Mgc3BhY2ViYXIgdG8gb3BlbiBzZWxlY3Qgb3B0aW9ucyBvciBzdGFydCB0eXBpbmcgZm9yIG9wdGlvbnMgdG8gYmUgZmlsdGVyZWQuXCIsIFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lOiBcIlNlbGVjdC1pbnB1dFwiLCBcblx0XHRcdFx0XHRcdHRhYkluZGV4OiB0aGlzLnByb3BzLnRhYkluZGV4LCByZWY6IFwiaW5wdXRcIiwgXG5cdFx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlLCBcblx0XHRcdFx0XHRcdG9uRm9jdXM6IHRoaXMuaGFuZGxlSW5wdXRGb2N1cywgXG5cdFx0XHRcdFx0XHRvbkJsdXI6IHRoaXMuaGFuZGxlSW5wdXRCbHVyLCBcblx0XHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLCBcblx0XHRcdFx0XHRcdG1pbldpZHRoOiBcIjVcIn0pLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIlNlbGVjdC1hcnJvd1wifSksIFxuXHRcdFx0XHRcdGxvYWRpbmcsIFxuXHRcdFx0XHRcdGNsZWFyXG5cdFx0XHRcdFx0XG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtpZDogXCJhbGVydC1vcHRpb25zXCIsIHJvbGU6IFwiYWxlcnRcIn0sIFxuXHRcdFx0XHRcblx0XHRcdFx0bWVudVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0XHRcblx0fVxuXHRcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0O1xuIl19
