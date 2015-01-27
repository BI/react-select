require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\node_modules\\classnames\\index.js":[function(require,module,exports){
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

},{}],"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\src\\CustomMenuMixin.js":[function(require,module,exports){
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
},{"react":false}],"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\src\\Value.js":[function(require,module,exports){
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
			React.createElement("div", {className: "Select-item"}, 
				React.createElement("span", {className: "Select-item-icon", onMouseDown: this.blockEvent, onClick: this.props.onRemove, onTouchEnd: this.props.onRemove}, "×"), 
				React.createElement("span", {className: "Select-item-label"}, this.props.label)
			)
		);
	}
	
});

module.exports = Option;

},{"classnames":"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\node_modules\\classnames\\index.js","react":false,"underscore":false}],"react-select":[function(require,module,exports){
var _ = require('underscore'),
	React = require('react/addons'),
	Input = require('react-input-autosize'),
	classes = require('classnames'),
	Value = require('./Value')
	CustomMenuMixin = require('./CustomMenuMixin.js');

var requestId = 0;

var Select = React.createClass({
	
	displayName: 'Select',

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
		if (event.type == 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
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
			
			default: return;
		}
		
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
	
	buildMenu: function() {
		
		var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;
		
		var ops = _.map(this.state.filteredOptions, function(op) {
			var isFocused = focusedValue === op.value;
			
			var optionClass = classes({
				'Select-option': true,
				'is-focused': isFocused
			});

			var ref = isFocused ? 'focused' : null;
			
			var mouseEnter = this.focusOption.bind(this, op),
				mouseLeave = this.unfocusOption.bind(this, op),
				mouseDown = this.selectValue.bind(this, op);
			
			return React.createElement("div", {ref: ref, key: 'option-' + op.value, className: optionClass, onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, onMouseDown: mouseDown, onClick: mouseDown}, op.label);
			
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
			value.push(React.createElement("div", {className: "Select-placeholder", key: "placeholder"}, this.state.placeholder));
		}

		var loading = this.state.isLoading ? React.createElement("span", {className: "Select-loading", "aria-hidden": "true"}) : null;
		var clear = this.props.clearable && this.state.value ? React.createElement("span", {className: "Select-clear", title: this.props.multi ? this.props.clearAllText : this.props.clearValueText, "aria-label": this.props.multi ? this.props.clearAllText : this.props.clearValueText, onMouseDown: this.clearValue, onClick: this.clearValue, dangerouslySetInnerHTML: { __html: '&times;'}}) : null;
		
		//var builtMenu = this.props.buildCustomMenu ? this.props.buildCustomMenu(this.selectValue, this.state.filteredOptions, this.state.focusedOption, this.focusOption, this.unfocusOption) : this.buildMenu();
		var builtMenu = this.props.children ? this.buildCustomMenu() : this.buildMenu();
		var menu = this.state.isOpen ? React.createElement("div", {ref: "menu", className: "Select-menu"}, builtMenu) : null;
		
		return (
			React.createElement("div", {ref: "wrapper", className: selectClass}, 
				React.createElement("input", {type: "hidden", ref: "value", name: this.props.name, value: this.state.value}), 
				React.createElement("div", {className: "Select-control", ref: "control", onKeyDown: this.handleKeyDown, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown}, 
					value, 
					React.createElement(Input, {className: "Select-input", tabIndex: this.props.tabIndex, ref: "input", value: this.state.inputValue, onFocus: this.handleInputFocus, onBlur: this.handleInputBlur, onChange: this.handleInputChange, minWidth: "5"}), 
					React.createElement("span", {className: "Select-arrow"}), 
					loading, 
					clear
				), 
				menu
			)
		);
		
	}
	
});

module.exports = Select;

},{"./CustomMenuMixin.js":"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\src\\CustomMenuMixin.js","./Value":"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\src\\Value.js","classnames":"C:\\Users\\sns12_000\\Documents\\GitHub\\react-select\\node_modules\\classnames\\index.js","react-input-autosize":false,"react/addons":false,"underscore":false}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwibm9kZV9tb2R1bGVzXFxjbGFzc25hbWVzXFxpbmRleC5qcyIsInNyY1xcQ3VzdG9tTWVudU1peGluLmpzIiwic3JjXFxWYWx1ZS5qcyIsInNyY1xcU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBjbGFzc25hbWVzKCkge1xuXHR2YXIgYXJncyA9IGFyZ3VtZW50cywgY2xhc3NlcyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoYXJnc1tpXSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbaV0pIHtcblx0XHRcdGNsYXNzZXMucHVzaChhcmdzW2ldKTtcblx0XHR9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlb2YgYXJnc1tpXSkge1xuXHRcdFx0Y2xhc3NlcyA9IGNsYXNzZXMuY29uY2F0KE9iamVjdC5rZXlzKGFyZ3NbaV0pLmZpbHRlcihmdW5jdGlvbihjbHMpIHtcblx0XHRcdFx0cmV0dXJuIGFyZ3NbaV1bY2xzXTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpIHx8IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzc25hbWVzO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBDdXN0b21NZW51TWl4aW4gPSB7XHJcbiAgcHJvcFR5cGVzOiB7XHJcbiAgICBvblNlbGVjdEl0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gICAgb3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCksXHJcbiAgICBmaWx0ZXJlZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCksXHJcbiAgICBpbnB1dFZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgZm9jdXNzZWRJdGVtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgb25Gb2N1c0l0ZW06IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gICAgb25VbmZvY3VzSXRlbTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcclxuICB9LFxyXG5cclxuICBkZWZhdWx0UHJvcHM6IHtcclxuICAgIG9uU2VsZWN0SXRlbTogZnVuY3Rpb24oaXRlbSkge30sXHJcbiAgICBvcHRpb25zOiBbXSxcclxuICAgIGZpbHRlcmVkOiBbXSxcclxuICAgIGlucHV0VmFsdWU6IG51bGwsXHJcbiAgICBmb2N1c3NlZEl0ZW06IG51bGwsXHJcbiAgICBvbkZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge30sXHJcbiAgICBvblVuZm9jdXNJdGVtOiBmdW5jdGlvbihpdGVtKSB7fVxyXG4gIH0sXHJcblxyXG4gIHNlbGVjdEl0ZW06IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHRoaXMucHJvcHMub25TZWxlY3RJdGVtKGl0ZW0pO1xyXG4gIH0sXHJcblxyXG4gIGZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdGhpcy5wcm9wcy5vbkZvY3VzSXRlbShpdGVtKTtcclxuICB9LFxyXG5cclxuICB1bmZvY3VzSXRlbTogZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdGhpcy5wcm9wcy5vblVuZm9jdXNJdGVtKGl0ZW0pO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3VzdG9tTWVudU1peGluOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxyXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcclxuXHRjbGFzc2VzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xyXG5cclxudmFyIE9wdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRcclxuXHRkaXNwbGF5TmFtZTogJ1ZhbHVlJyxcclxuXHRcclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcclxuXHR9LFxyXG5cdFxyXG5cdGJsb2NrRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWl0ZW1cIn0sIFxyXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWl0ZW0taWNvblwiLCBvbk1vdXNlRG93bjogdGhpcy5ibG9ja0V2ZW50LCBvbkNsaWNrOiB0aGlzLnByb3BzLm9uUmVtb3ZlLCBvblRvdWNoRW5kOiB0aGlzLnByb3BzLm9uUmVtb3ZlfSwgXCLDl1wiKSwgXHJcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJTZWxlY3QtaXRlbS1sYWJlbFwifSwgdGhpcy5wcm9wcy5sYWJlbClcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHR9XHJcblx0XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XHJcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxyXG5cdFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyksXHJcblx0SW5wdXQgPSByZXF1aXJlKCdyZWFjdC1pbnB1dC1hdXRvc2l6ZScpLFxyXG5cdGNsYXNzZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyksXHJcblx0VmFsdWUgPSByZXF1aXJlKCcuL1ZhbHVlJylcclxuXHRDdXN0b21NZW51TWl4aW4gPSByZXF1aXJlKCcuL0N1c3RvbU1lbnVNaXhpbi5qcycpO1xyXG5cclxudmFyIHJlcXVlc3RJZCA9IDA7XHJcblxyXG52YXIgU2VsZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdFxyXG5cdGRpc3BsYXlOYW1lOiAnU2VsZWN0JyxcclxuXHJcblx0c3RhdGljczoge1xyXG5cdFx0Q3VzdG9tTWVudU1peGluOiBDdXN0b21NZW51TWl4aW5cclxuXHR9LFxyXG5cclxuXHRwcm9wVHlwZXM6IHtcclxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXHJcblx0XHRtdWx0aTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gbXVsdGktdmFsdWUgaW5wdXRcclxuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSwgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXHJcblx0XHRkZWxpbWl0ZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gZGVsaW1pdGVyIHRvIHVzZSB0byBqb2luIG11bHRpcGxlIHZhbHVlc1xyXG5cdFx0YXN5bmNPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIGZ1bmN0aW9uIHRvIGNhbGwgdG8gZ2V0IG9wdGlvbnNcclxuXHRcdGF1dG9sb2FkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyB3aGV0aGVyIHRvIGF1dG8tbG9hZCB0aGUgZGVmYXVsdCBhc3luYyBvcHRpb25zIHNldFxyXG5cdFx0cGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgIC8vIGZpZWxkIHBsYWNlaG9sZGVyLCBkaXNwbGF5ZWQgd2hlbiB0aGVyZSdzIG5vIHZhbHVlXHJcblx0XHRub1Jlc3VsdHNUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4gdGhlcmUgYXJlIG5vIG1hdGNoaW5nIHNlYXJjaCByZXN1bHRzXHJcblx0XHRjbGVhcmFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gc2hvdWxkIGl0IGJlIHBvc3NpYmxlIHRvIHJlc2V0IHZhbHVlXHJcblx0XHRjbGVhclZhbHVlVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbFxyXG5cdFx0Y2xlYXJBbGxUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2wgd2hlbiBtdWx0aTogdHJ1ZVxyXG5cdFx0c2VhcmNoUHJvbXB0VGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgIC8vIGxhYmVsIHRvIHByb21wdCBmb3Igc2VhcmNoIGlucHV0XHJcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgLy8gZmllbGQgbmFtZSwgZm9yIGhpZGRlbiA8aW5wdXQgLz4gdGFnXHJcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgLy8gb25DaGFuZ2UgaGFuZGxlcjogZnVuY3Rpb24obmV3VmFsdWUpIHt9XHJcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gY2xhc3NOYW1lIGZvciB0aGUgb3V0ZXIgZWxlbWVudFxyXG5cdFx0ZmlsdGVyT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgYSBzaW5nbGUgb3B0aW9uOiBmdW5jdGlvbihvcHRpb24sIGZpbHRlclN0cmluZylcclxuXHRcdGZpbHRlck9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAvLyBtZXRob2QgdG8gZmlsdGVyIHRoZSBvcHRpb25zIGFycmF5OiBmdW5jdGlvbihbb3B0aW9uc10sIGZpbHRlclN0cmluZywgW3ZhbHVlc10pXHJcblx0XHRtYXRjaFBvczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgLy8gKGFueXxzdGFydCkgbWF0Y2ggdGhlIHN0YXJ0IG9yIGVudGlyZSBzdHJpbmcgd2hlbiBmaWx0ZXJpbmdcclxuXHRcdG1hdGNoUHJvcDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyAgICAgICAgIC8vIChhbnl8bGFiZWx8dmFsdWUpIHdoaWNoIG9wdGlvbiBwcm9wZXJ0eSB0byBmaWx0ZXIgb25cclxuXHR9LFxyXG5cdFxyXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxyXG5cdFx0XHRvcHRpb25zOiBbXSxcclxuXHRcdFx0ZGVsaW1pdGVyOiAnLCcsXHJcblx0XHRcdGFzeW5jT3B0aW9uczogdW5kZWZpbmVkLFxyXG5cdFx0XHRhdXRvbG9hZDogdHJ1ZSxcclxuXHRcdFx0cGxhY2Vob2xkZXI6ICdTZWxlY3QuLi4nLFxyXG5cdFx0XHRub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXHJcblx0XHRcdGNsZWFyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Y2xlYXJWYWx1ZVRleHQ6ICdDbGVhciB2YWx1ZScsXHJcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXHJcblx0XHRcdHNlYXJjaFByb21wdFRleHQ6ICdUeXBlIHRvIHNlYXJjaCcsXHJcblx0XHRcdG5hbWU6IHVuZGVmaW5lZCxcclxuXHRcdFx0b25DaGFuZ2U6IHVuZGVmaW5lZCxcclxuXHRcdFx0Y2xhc3NOYW1lOiB1bmRlZmluZWQsXHJcblx0XHRcdG1hdGNoUG9zOiAnYW55JyxcclxuXHRcdFx0bWF0Y2hQcm9wOiAnYW55J1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdFxyXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBzZXQgYnkgZ2V0U3RhdGVGcm9tVmFsdWUgb24gY29tcG9uZW50V2lsbE1vdW50OlxyXG5cdFx0XHQgKiAtIHZhbHVlXHJcblx0XHRcdCAqIC0gdmFsdWVzXHJcblx0XHRcdCAqIC0gZmlsdGVyZWRPcHRpb25zXHJcblx0XHRcdCAqIC0gaW5wdXRWYWx1ZVxyXG5cdFx0XHQgKiAtIHBsYWNlaG9sZGVyXHJcblx0XHRcdCAqIC0gZm9jdXNlZE9wdGlvblxyXG5cdFx0XHQqL1xyXG5cdFx0XHRvcHRpb25zOiB0aGlzLnByb3BzLm9wdGlvbnMsXHJcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXHJcblx0XHRcdGlzT3BlbjogZmFsc2UsXHJcblx0XHRcdGlzTG9hZGluZzogZmFsc2VcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5fb3B0aW9uc0NhY2hlID0ge307XHJcblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gJyc7XHJcblx0XHR0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUodGhpcy5wcm9wcy52YWx1ZSkpO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5wcm9wcy5hc3luY09wdGlvbnMgJiYgdGhpcy5wcm9wcy5hdXRvbG9hZCkge1xyXG5cdFx0XHR0aGlzLmF1dG9sb2FkQXN5bmNPcHRpb25zKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy5fYmx1clRpbWVvdXQpO1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzVGltZW91dCk7XHJcblx0fSxcclxuXHRcclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcykge1xyXG5cdFx0aWYgKG5ld1Byb3BzLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21WYWx1ZShuZXdQcm9wcy52YWx1ZSwgbmV3UHJvcHMub3B0aW9ucykpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzLm9wdGlvbnMpICE9PSBKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLm9wdGlvbnMpKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRcdG9wdGlvbnM6IG5ld1Byb3BzLm9wdGlvbnMsXHJcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMobmV3UHJvcHMub3B0aW9ucylcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUpIHtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX2JsdXJUaW1lb3V0KTtcclxuXHRcdFx0dGhpcy5fZm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLnJlZnMuaW5wdXQuZm9jdXMoKTtcclxuXHRcdFx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gZmFsc2U7XHJcblx0XHRcdH0uYmluZCh0aGlzKSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsKSB7XHJcblx0XHRcdGlmICh0aGlzLnJlZnMuZm9jdXNlZCAmJiB0aGlzLnJlZnMubWVudSkge1xyXG5cdFx0XHRcdHZhciBmb2N1c2VkRE9NID0gdGhpcy5yZWZzLmZvY3VzZWQuZ2V0RE9NTm9kZSgpO1xyXG5cdFx0XHRcdHZhciBtZW51RE9NID0gdGhpcy5yZWZzLm1lbnUuZ2V0RE9NTm9kZSgpO1xyXG5cdFx0XHRcdHZhciBmb2N1c2VkUmVjdCA9IGZvY3VzZWRET00uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRcdFx0dmFyIG1lbnVSZWN0ID0gbWVudURPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRcdFx0aWYgKGZvY3VzZWRSZWN0LmJvdHRvbSA+IG1lbnVSZWN0LmJvdHRvbSB8fFxyXG5cdFx0XHRcdFx0Zm9jdXNlZFJlY3QudG9wIDwgbWVudVJlY3QudG9wKSB7XHJcblx0XHRcdFx0XHRtZW51RE9NLnNjcm9sbFRvcCA9IChmb2N1c2VkRE9NLm9mZnNldFRvcCArIGZvY3VzZWRET00uY2xpZW50SGVpZ2h0IC0gbWVudURPTS5vZmZzZXRIZWlnaHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fZm9jdXNlZE9wdGlvblJldmVhbCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0U3RhdGVGcm9tVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XHJcblx0XHRcclxuXHRcdGlmICghb3B0aW9ucykge1xyXG5cdFx0XHRvcHRpb25zID0gdGhpcy5zdGF0ZS5vcHRpb25zO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyByZXNldCBpbnRlcm5hbCBmaWx0ZXIgc3RyaW5nXHJcblx0XHR0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gJyc7XHJcblx0XHRcclxuXHRcdHZhciB2YWx1ZXMgPSB0aGlzLmluaXRWYWx1ZXNBcnJheSh2YWx1ZSwgb3B0aW9ucyksXHJcblx0XHRcdGZpbHRlcmVkT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyhvcHRpb25zLCB2YWx1ZXMpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR2YWx1ZTogdmFsdWVzLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiB2LnZhbHVlOyB9KS5qb2luKHRoaXMucHJvcHMuZGVsaW1pdGVyKSxcclxuXHRcdFx0dmFsdWVzOiB2YWx1ZXMsXHJcblx0XHRcdGlucHV0VmFsdWU6ICcnLFxyXG5cdFx0XHRmaWx0ZXJlZE9wdGlvbnM6IGZpbHRlcmVkT3B0aW9ucyxcclxuXHRcdFx0cGxhY2Vob2xkZXI6ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0ubGFiZWwgOiB0aGlzLnByb3BzLnBsYWNlaG9sZGVyLFxyXG5cdFx0XHRmb2N1c2VkT3B0aW9uOiAhdGhpcy5wcm9wcy5tdWx0aSAmJiB2YWx1ZXMubGVuZ3RoID8gdmFsdWVzWzBdIDogZmlsdGVyZWRPcHRpb25zWzBdXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRpbml0VmFsdWVzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlcywgb3B0aW9ucykge1xyXG5cdFx0XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xyXG5cdFx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWx1ZXMpIHtcclxuXHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQodGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhbHVlcyA9IHZhbHVlcyA/IFt2YWx1ZXNdIDogW107XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHZhbHVlcy5tYXAoZnVuY3Rpb24odmFsKSB7XHJcblx0XHRcdHJldHVybiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWwpID8gdmFsID0gXy5maW5kV2hlcmUob3B0aW9ucywgeyB2YWx1ZTogdmFsIH0pIHx8IHsgdmFsdWU6IHZhbCwgbGFiZWw6IHZhbCB9IDogdmFsO1xyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFxyXG5cdH0sXHJcblx0XHJcblx0c2V0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR0aGlzLl9mb2N1c0FmdGVyVXBkYXRlID0gdHJ1ZTtcclxuXHRcdHZhciBuZXdTdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tVmFsdWUodmFsdWUpO1xyXG5cdFx0bmV3U3RhdGUuaXNPcGVuID0gZmFsc2U7XHJcblx0XHR0aGlzLmZpcmVDaGFuZ2VFdmVudChuZXdTdGF0ZSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcclxuXHR9LFxyXG5cdFxyXG5cdHNlbGVjdFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dGhpc1t0aGlzLnByb3BzLm11bHRpID8gJ2FkZFZhbHVlJyA6ICdzZXRWYWx1ZSddKHZhbHVlKTtcclxuXHR9LFxyXG5cdFxyXG5cdGFkZFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLnN0YXRlLnZhbHVlcy5jb25jYXQodmFsdWUpKTtcclxuXHR9LFxyXG5cdFxyXG5cdHBvcFZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VmFsdWUoXy5pbml0aWFsKHRoaXMuc3RhdGUudmFsdWVzKSk7XHJcblx0fSxcclxuXHRcclxuXHRyZW1vdmVWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHRoaXMuc2V0VmFsdWUoXy53aXRob3V0KHRoaXMuc3RhdGUudmFsdWVzLCB2YWx1ZSkpO1xyXG5cdH0sXHJcblx0XHJcblx0Y2xlYXJWYWx1ZTogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcclxuXHRcdC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxyXG5cdFx0aWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMuc2V0VmFsdWUobnVsbCk7XHJcblx0fSxcclxuXHRcclxuXHRyZXNldFZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZSk7XHJcblx0fSxcclxuXHRcclxuXHRmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XHJcblx0XHRpZiAobmV3U3RhdGUudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWUgJiYgdGhpcy5wcm9wcy5vbkNoYW5nZSkge1xyXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld1N0YXRlLnZhbHVlLCBuZXdTdGF0ZS52YWx1ZXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxyXG5cdFx0Ly8gYnV0dG9uLCBpZ25vcmUgaXQuXHJcblx0XHRpZiAoZXZlbnQudHlwZSA9PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNGb2N1c2VkKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRcdGlzT3BlbjogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5yZWZzLmlucHV0LmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRpc0ZvY3VzZWQ6IHRydWUsXHJcblx0XHRcdGlzT3BlbjogdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXNcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUlucHV0Qmx1cjogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2ZvY3VzQWZ0ZXJVcGRhdGUpIHJldHVybjtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0aXNPcGVuOiBmYWxzZSxcclxuXHRcdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0fS5iaW5kKHRoaXMpLCA1MCk7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHJcblx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHRcdFx0XHJcblx0XHRcdGNhc2UgODogLy8gYmFja3NwYWNlXHJcblx0XHRcdFx0aWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMucG9wVmFsdWUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0XHJcblx0XHRcdGNhc2UgOTogLy8gdGFiXHJcblx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5IHx8ICF0aGlzLnN0YXRlLmlzT3BlbiB8fCAhdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0XHJcblx0XHRcdGNhc2UgMTM6IC8vIGVudGVyXHJcblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcclxuXHRcdFx0Y2FzZSAyNzogLy8gZXNjYXBlXHJcblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUuaXNPcGVuKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlc2V0VmFsdWUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jbGVhclZhbHVlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0XHJcblx0XHRcdGNhc2UgMzg6IC8vIHVwXHJcblx0XHRcdFx0dGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcclxuXHRcdFx0Y2FzZSA0MDogLy8gZG93blxyXG5cdFx0XHRcdHRoaXMuZm9jdXNOZXh0T3B0aW9uKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcclxuXHRcdFx0ZGVmYXVsdDogcmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVJbnB1dENoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFxyXG5cdFx0Ly8gYXNzaWduIGFuIGludGVybmFsIHZhcmlhYmxlIGJlY2F1c2Ugd2UgbmVlZCB0byB1c2VcclxuXHRcdC8vIHRoZSBsYXRlc3QgdmFsdWUgYmVmb3JlIHNldFN0YXRlKCkgaGFzIGNvbXBsZXRlZC5cclxuXHRcdHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmcgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucykge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRpc0xvYWRpbmc6IHRydWUsXHJcblx0XHRcdFx0aW5wdXRWYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmxvYWRBc3luY09wdGlvbnMoZXZlbnQudGFyZ2V0LnZhbHVlLCB7XHJcblx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcclxuXHRcdFx0XHRpc09wZW46IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZmlsdGVyZWRPcHRpb25zID0gdGhpcy5maWx0ZXJPcHRpb25zKHRoaXMuc3RhdGUub3B0aW9ucyk7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcclxuXHRcdFx0XHRpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXHJcblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXHJcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogXy5jb250YWlucyhmaWx0ZXJlZE9wdGlvbnMsIHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbikgPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gOiBmaWx0ZXJlZE9wdGlvbnNbMF1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9LFxyXG5cdFxyXG5cdGF1dG9sb2FkQXN5bmNPcHRpb25zOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMubG9hZEFzeW5jT3B0aW9ucygnJywge30sIGZ1bmN0aW9uKCkge30pO1xyXG5cdH0sXHJcblx0XHJcblx0bG9hZEFzeW5jT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIHN0YXRlKSB7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGlucHV0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBjYWNoZUtleSA9IGlucHV0LnNsaWNlKDAsIGkpO1xyXG5cdFx0XHRpZiAodGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IHRoaXMuX29wdGlvbnNDYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XHJcblx0XHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zQ2FjaGVbY2FjaGVLZXldLm9wdGlvbnM7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZShfLmV4dGVuZCh7XHJcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRpb25zLFxyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMob3B0aW9ucylcclxuXHRcdFx0XHR9LCBzdGF0ZSkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgdGhpc1JlcXVlc3RJZCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQgPSByZXF1ZXN0SWQrKztcclxuXHRcdFxyXG5cdFx0dGhpcy5wcm9wcy5hc3luY09wdGlvbnMoaW5wdXQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5fb3B0aW9uc0NhY2hlW2lucHV0XSA9IGRhdGE7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpc1JlcXVlc3RJZCAhPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJZCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZShfLmV4dGVuZCh7XHJcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zLFxyXG5cdFx0XHRcdGZpbHRlcmVkT3B0aW9uczogdGhpcy5maWx0ZXJPcHRpb25zKGRhdGEub3B0aW9ucylcclxuXHRcdFx0fSwgc3RhdGUpKTtcclxuXHRcdFx0XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHRmaWx0ZXJPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zLCB2YWx1ZXMpIHtcclxuXHRcdHZhciBmaWx0ZXJWYWx1ZSA9IHRoaXMuX29wdGlvbnNGaWx0ZXJTdHJpbmc7XHJcblx0XHR2YXIgZXhjbHVkZSA9ICh2YWx1ZXMgfHwgdGhpcy5zdGF0ZS52YWx1ZXMpLm1hcChmdW5jdGlvbihpKSB7XHJcblx0XHRcdHJldHVybiBpLnZhbHVlO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByb3BzLmZpbHRlck9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zLCBmaWx0ZXJWYWx1ZSwgZXhjbHVkZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZmlsdGVyT3B0aW9uID0gZnVuY3Rpb24ob3ApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSAmJiBfLmNvbnRhaW5zKGV4Y2x1ZGUsIG9wLnZhbHVlKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmZpbHRlck9wdGlvbikgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uLmNhbGwodGhpcywgb3AsIGZpbHRlclZhbHVlKTtcclxuXHRcdFx0XHRyZXR1cm4gIWZpbHRlclZhbHVlIHx8ICh0aGlzLnByb3BzLm1hdGNoUG9zID09PSAnc3RhcnQnKSA/IChcclxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiBvcC52YWx1ZS50b0xvd2VyQ2FzZSgpLnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSkgfHxcclxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBvcC5sYWJlbC50b0xvd2VyQ2FzZSgpLnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSlcclxuXHRcdFx0XHQpIDogKFxyXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIG9wLnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB8fFxyXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnICYmIG9wLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKSA+PSAwKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBfLmZpbHRlcihvcHRpb25zLCBmaWx0ZXJPcHRpb24sIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0c2VsZWN0Rm9jdXNlZE9wdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZWxlY3RWYWx1ZSh0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24pO1xyXG5cdH0sXHJcblx0XHJcblx0Zm9jdXNPcHRpb246IGZ1bmN0aW9uKG9wKSB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0Zm9jdXNlZE9wdGlvbjogb3BcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0Zm9jdXNOZXh0T3B0aW9uOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignbmV4dCcpO1xyXG5cdH0sXHJcblx0XHJcblx0Zm9jdXNQcmV2aW91c09wdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ3ByZXZpb3VzJyk7XHJcblx0fSxcclxuXHRcclxuXHRmb2N1c0FkamFjZW50T3B0aW9uOiBmdW5jdGlvbihkaXIpIHtcclxuXHRcdHRoaXMuX2ZvY3VzZWRPcHRpb25SZXZlYWwgPSB0cnVlO1xyXG5cdFx0XHJcblx0XHR2YXIgb3BzID0gdGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnM7XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxyXG5cdFx0XHRcdGlucHV0VmFsdWU6ICcnLFxyXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiB8fCBvcHNbZGlyID09PSAnbmV4dCcgPyAwIDogb3BzLmxlbmd0aCAtIDFdXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghb3BzLmxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBmb2N1c2VkSW5kZXggPSAtMTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA9PT0gb3BzW2ldKSB7XHJcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZm9jdXNlZE9wdGlvbiA9IG9wc1swXTtcclxuXHRcdFxyXG5cdFx0aWYgKGRpciA9PT0gJ25leHQnICYmIGZvY3VzZWRJbmRleCA+IC0xICYmIGZvY3VzZWRJbmRleCA8IG9wcy5sZW5ndGggLSAxKSB7XHJcblx0XHRcdGZvY3VzZWRPcHRpb24gPSBvcHNbZm9jdXNlZEluZGV4ICsgMV07XHJcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3ByZXZpb3VzJykge1xyXG5cdFx0XHRpZiAoZm9jdXNlZEluZGV4ID4gMCkge1xyXG5cdFx0XHRcdGZvY3VzZWRPcHRpb24gPSBvcHNbZm9jdXNlZEluZGV4IC0gMV07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wc1tvcHMubGVuZ3RoIC0gMV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGZvY3VzZWRPcHRpb246IGZvY3VzZWRPcHRpb25cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0fSxcclxuXHRcclxuXHR1bmZvY3VzT3B0aW9uOiBmdW5jdGlvbihvcCkge1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiA9PT0gb3ApIHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogbnVsbFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGJ1aWxkTWVudTogZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdHZhciBmb2N1c2VkVmFsdWUgPSB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24udmFsdWUgOiBudWxsO1xyXG5cdFx0XHJcblx0XHR2YXIgb3BzID0gXy5tYXAodGhpcy5zdGF0ZS5maWx0ZXJlZE9wdGlvbnMsIGZ1bmN0aW9uKG9wKSB7XHJcblx0XHRcdHZhciBpc0ZvY3VzZWQgPSBmb2N1c2VkVmFsdWUgPT09IG9wLnZhbHVlO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG9wdGlvbkNsYXNzID0gY2xhc3Nlcyh7XHJcblx0XHRcdFx0J1NlbGVjdC1vcHRpb24nOiB0cnVlLFxyXG5cdFx0XHRcdCdpcy1mb2N1c2VkJzogaXNGb2N1c2VkXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIHJlZiA9IGlzRm9jdXNlZCA/ICdmb2N1c2VkJyA6IG51bGw7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgbW91c2VFbnRlciA9IHRoaXMuZm9jdXNPcHRpb24uYmluZCh0aGlzLCBvcCksXHJcblx0XHRcdFx0bW91c2VMZWF2ZSA9IHRoaXMudW5mb2N1c09wdGlvbi5iaW5kKHRoaXMsIG9wKSxcclxuXHRcdFx0XHRtb3VzZURvd24gPSB0aGlzLnNlbGVjdFZhbHVlLmJpbmQodGhpcywgb3ApO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge3JlZjogcmVmLCBrZXk6ICdvcHRpb24tJyArIG9wLnZhbHVlLCBjbGFzc05hbWU6IG9wdGlvbkNsYXNzLCBvbk1vdXNlRW50ZXI6IG1vdXNlRW50ZXIsIG9uTW91c2VMZWF2ZTogbW91c2VMZWF2ZSwgb25Nb3VzZURvd246IG1vdXNlRG93biwgb25DbGljazogbW91c2VEb3dufSwgb3AubGFiZWwpO1xyXG5cdFx0XHRcclxuXHRcdH0sIHRoaXMpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gb3BzLmxlbmd0aCA/IG9wcyA6IChcclxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIlNlbGVjdC1ub3Jlc3VsdHNcIn0sIFxyXG5cdFx0XHRcdHRoaXMucHJvcHMuYXN5bmNPcHRpb25zICYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWUgPyB0aGlzLnByb3BzLnNlYXJjaFByb21wdFRleHQgOiB0aGlzLnByb3BzLm5vUmVzdWx0c1RleHRcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdH0sXHJcblxyXG5cdGJ1aWxkQ3VzdG9tTWVudTogZnVuY3Rpb24oKSB7ICAgIFxyXG4gICAgaWYoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHtcclxuICAgIFx0cmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICBcdHZhciBjaGlsZCA9IHRoaXMucHJvcHMuY2hpbGRyZW47XHJcblxyXG4gIFx0cmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwge1xyXG5cdCAgICBvblNlbGVjdEl0ZW06IHRoaXMuc2VsZWN0VmFsdWUsXHJcblx0ICAgIG9wdGlvbnM6IHRoaXMucHJvcHMub3B0aW9ucyxcclxuXHQgICAgZmlsdGVyZWQ6IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLFxyXG5cdCAgICBpbnB1dFZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWUsXHJcblx0ICAgIGZvY3Vzc2VkSXRlbTogdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uLFxyXG5cdCAgICBvbkZvY3VzSXRlbTogdGhpcy5mb2N1c09wdGlvbixcclxuXHQgICAgb25VbmZvY3VzSXRlbTogdGhpcy51bmZvY3VzT3B0aW9uXHJcbiAgXHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VsZWN0Q2xhc3MgPSBjbGFzc2VzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xyXG5cdFx0XHQnaXMtbXVsdGknOiB0aGlzLnByb3BzLm11bHRpLFxyXG5cdFx0XHQnaXMtb3Blbic6IHRoaXMuc3RhdGUuaXNPcGVuLFxyXG5cdFx0XHQnaXMtZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxyXG5cdFx0XHQnaXMtbG9hZGluZyc6IHRoaXMuc3RhdGUuaXNMb2FkaW5nLFxyXG5cdFx0XHQnaGFzLXZhbHVlJzogdGhpcy5zdGF0ZS52YWx1ZVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHZhciB2YWx1ZSA9IFtdO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xyXG5cdFx0XHRcdHByb3BzID0gXy5leHRlbmQoe1xyXG5cdFx0XHRcdFx0a2V5OiB2YWwudmFsdWUsXHJcblx0XHRcdFx0XHRvblJlbW92ZTogdGhpcy5yZW1vdmVWYWx1ZS5iaW5kKHRoaXMsIHZhbClcclxuXHRcdFx0XHR9LCB2YWwpO1xyXG5cdFx0XHRcdHZhbHVlLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChWYWx1ZSwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpKTtcclxuXHRcdFx0fSwgdGhpcyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmICghdGhpcy5wcm9wcy5tdWx0aSB8fCAhdmFsdWUubGVuZ3RoKSkge1xyXG5cdFx0XHR2YWx1ZS5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJTZWxlY3QtcGxhY2Vob2xkZXJcIiwga2V5OiBcInBsYWNlaG9sZGVyXCJ9LCB0aGlzLnN0YXRlLnBsYWNlaG9sZGVyKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGxvYWRpbmcgPSB0aGlzLnN0YXRlLmlzTG9hZGluZyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWxvYWRpbmdcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pIDogbnVsbDtcclxuXHRcdHZhciBjbGVhciA9IHRoaXMucHJvcHMuY2xlYXJhYmxlICYmIHRoaXMuc3RhdGUudmFsdWUgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIlNlbGVjdC1jbGVhclwiLCB0aXRsZTogdGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dCwgXCJhcmlhLWxhYmVsXCI6IHRoaXMucHJvcHMubXVsdGkgPyB0aGlzLnByb3BzLmNsZWFyQWxsVGV4dCA6IHRoaXMucHJvcHMuY2xlYXJWYWx1ZVRleHQsIG9uTW91c2VEb3duOiB0aGlzLmNsZWFyVmFsdWUsIG9uQ2xpY2s6IHRoaXMuY2xlYXJWYWx1ZSwgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiAnJnRpbWVzOyd9fSkgOiBudWxsO1xyXG5cdFx0XHJcblx0XHQvL3ZhciBidWlsdE1lbnUgPSB0aGlzLnByb3BzLmJ1aWxkQ3VzdG9tTWVudSA/IHRoaXMucHJvcHMuYnVpbGRDdXN0b21NZW51KHRoaXMuc2VsZWN0VmFsdWUsIHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLCB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24sIHRoaXMuZm9jdXNPcHRpb24sIHRoaXMudW5mb2N1c09wdGlvbikgOiB0aGlzLmJ1aWxkTWVudSgpO1xyXG5cdFx0dmFyIGJ1aWx0TWVudSA9IHRoaXMucHJvcHMuY2hpbGRyZW4gPyB0aGlzLmJ1aWxkQ3VzdG9tTWVudSgpIDogdGhpcy5idWlsZE1lbnUoKTtcclxuXHRcdHZhciBtZW51ID0gdGhpcy5zdGF0ZS5pc09wZW4gPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtyZWY6IFwibWVudVwiLCBjbGFzc05hbWU6IFwiU2VsZWN0LW1lbnVcIn0sIGJ1aWx0TWVudSkgOiBudWxsO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtyZWY6IFwid3JhcHBlclwiLCBjbGFzc05hbWU6IHNlbGVjdENsYXNzfSwgXHJcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcImhpZGRlblwiLCByZWY6IFwidmFsdWVcIiwgbmFtZTogdGhpcy5wcm9wcy5uYW1lLCB2YWx1ZTogdGhpcy5zdGF0ZS52YWx1ZX0pLCBcclxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWNvbnRyb2xcIiwgcmVmOiBcImNvbnRyb2xcIiwgb25LZXlEb3duOiB0aGlzLmhhbmRsZUtleURvd24sIG9uTW91c2VEb3duOiB0aGlzLmhhbmRsZU1vdXNlRG93biwgb25Ub3VjaEVuZDogdGhpcy5oYW5kbGVNb3VzZURvd259LCBcclxuXHRcdFx0XHRcdHZhbHVlLCBcclxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHtjbGFzc05hbWU6IFwiU2VsZWN0LWlucHV0XCIsIHRhYkluZGV4OiB0aGlzLnByb3BzLnRhYkluZGV4LCByZWY6IFwiaW5wdXRcIiwgdmFsdWU6IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSwgb25Gb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLCBvbkJsdXI6IHRoaXMuaGFuZGxlSW5wdXRCbHVyLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVJbnB1dENoYW5nZSwgbWluV2lkdGg6IFwiNVwifSksIFxyXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJTZWxlY3QtYXJyb3dcIn0pLCBcclxuXHRcdFx0XHRcdGxvYWRpbmcsIFxyXG5cdFx0XHRcdFx0Y2xlYXJcclxuXHRcdFx0XHQpLCBcclxuXHRcdFx0XHRtZW51XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Q7XHJcbiJdfQ==
