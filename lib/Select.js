'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    Input = require('react-input-autosize'),
    classes = require('classnames'),
    Value = require('./Value'),
    CustomMenuMixin = require('./CustomMenuMixin.js');

var requestId = 0;

var Select = React.createClass({

	displayName: 'Select',

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
		onFocus: React.PropTypes.func, // onFocus handler: function(event) {}
		onBlur: React.PropTypes.func, // onBlur handler: function(event) {}
		className: React.PropTypes.string, // className for the outer element
		filterOption: React.PropTypes.func, // method to filter a single option: function(option, filterString)
		filterOptions: React.PropTypes.func, // method to filter the options array: function([options], filterString, [values])
		matchPos: React.PropTypes.string, // (any|start) match the start or entire string when filtering
		matchProp: React.PropTypes.string, // (any|label|value) which option property to filter on
		accessibleLabel: React.PropTypes.string, // (aria label for screen reader)
		nullNotAllowed: React.PropTypes.bool, // use when the select must always have a value selected
		inputProps: React.PropTypes.object, // custom attributes for the Input (in the Select-control) e.g: {'data-foo': 'bar'}

		/*
  * Allow user to make option label clickable. When this handler is defined we should
  * wrap label into <a>label</a> tag.
  *
  * onOptionLabelClick handler: function (value, event) {}
  *
  */
		onOptionLabelClick: React.PropTypes.func },

	getDefaultProps: function getDefaultProps() {
		return {
			value: undefined,
			options: undefined,
			disabled: false,
			delimiter: ',',
			asyncOptions: undefined,
			autoload: true,
			placeholder: 'Select...',
			noResultsText: 'No results found',
			clearable: true,
			clearValueText: 'Clear value',
			clearAllText: 'Clear all',
			searchable: true,
			searchPromptText: 'Type to search',
			name: undefined,
			onChange: undefined,
			className: undefined,
			matchPos: 'any',
			matchProp: 'any',
			accessibleLabel: 'Choose a value',
			nullNotAllowed: false,
			inputProps: {},

			onOptionLabelClick: undefined };
	},

	getInitialState: function getInitialState() {
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
			alertMessage: '' };
	},

	componentWillMount: function componentWillMount() {
		this._optionsCache = {};
		this._optionsFilterString = '';

		var value = this.props.value;

		if (this.props.nullNotAllowed && !this.props.value) {
			value = this.props.options[0].value;
		}

		var state = this.getStateFromValue(value);

		this.setState(state);

		if (this.props.asyncOptions && this.props.autoload) {
			this.autoloadAsyncOptions();
		}

		this._closeMenuIfClickedOutside = (function (event) {
			if (!this.state.isOpen) {
				return;
			}
			var menuElem = this.refs.selectMenuContainer.getDOMNode();
			var controlElem = this.refs.control.getDOMNode();

			var eventOccuredOutsideMenu = this.clickedOutsideElement(menuElem, event);
			var eventOccuredOutsideControl = this.clickedOutsideElement(controlElem, event);

			// Hide dropdown menu if click occurred outside of menu
			if (eventOccuredOutsideMenu && eventOccuredOutsideControl) {
				this.setState({
					isOpen: false
				}, this._unbindCloseMenuIfClickedOutside);
			}
		}).bind(this);

		this._bindCloseMenuIfClickedOutside = function () {
			document.addEventListener('click', this._closeMenuIfClickedOutside);
		};

		this._unbindCloseMenuIfClickedOutside = function () {
			document.removeEventListener('click', this._closeMenuIfClickedOutside);
		};
	},

	componentWillUnmount: function componentWillUnmount() {
		clearTimeout(this._blurTimeout);
		clearTimeout(this._focusTimeout);

		if (this.state.isOpen) {
			this._unbindCloseMenuIfClickedOutside();
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(newProps) {
		if (JSON.stringify(newProps.options) !== JSON.stringify(this.props.options)) {
			this.setState({
				options: newProps.options,
				filteredOptions: this.filterOptions(newProps.options)
			});
		}
		if (newProps.value !== this.state.value) {
			this.setState(this.getStateFromValue(newProps.value, newProps.options));
		}
	},

	componentDidUpdate: function componentDidUpdate() {
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

		if (this.state.alertMessage !== '') {
			var that = this;
			setTimeout(function () {
				that.setState({
					alertMessage: ''
				});
			}, 500);
		}
	},

	clickedOutsideElement: function clickedOutsideElement(element, event) {
		var eventTarget = event.target ? event.target : event.srcElement;
		while (eventTarget != null) {
			if (eventTarget === element) {
				return false;
			}eventTarget = eventTarget.offsetParent;
		}
		return true;
	},

	getStateFromValue: function getStateFromValue(value, options) {
		if (!options) {
			options = this.state.options;
		}

		// reset internal filter string
		this._optionsFilterString = '';

		var values = this.initValuesArray(value, options),
		    filteredOptions = this.filterOptions(options, values);

		return {
			value: values.map(function (v) {
				return v.value;
			}).join(this.props.delimiter),
			values: values,
			inputValue: '',
			filteredOptions: filteredOptions,
			placeholder: !this.props.multi && values.length ? values[0].label : this.props.placeholder,
			focusedOption: !this.props.multi && values.length ? values[0] : filteredOptions[0]
		};
	},

	initValuesArray: function initValuesArray(values, options) {
		if (!Array.isArray(values)) {
			if (typeof values === 'string') {
				values = values.split(this.props.delimiter);
			} else {
				values = values ? [values] : [];
			}
		}

		return values.map(function (val) {
			if (typeof val === 'string') {
				for (var key in options) {
					if (options.hasOwnProperty(key) && options[key] && options[key].value === val) {
						return options[key];
					}
				}
				return { value: val, label: val };
			} else {
				return val;
			}
		});
	},

	setValue: function setValue(value) {
		this._focusAfterUpdate = true;
		var newState = this.getStateFromValue(value);
		newState.isOpen = false;
		this.fireChangeEvent(newState);
		this.setState(newState);
	},

	selectValue: function selectValue(value) {
		if (!this.props.multi) {
			this.setValue(value);
		} else if (value) {
			this.addValue(value);
		}

		this._unbindCloseMenuIfClickedOutside();
		this.setState({ alertMessage: value.label + ' selected' });
	},

	addValue: function addValue(value) {
		this.setValue(this.state.values.concat(value));
	},

	popValue: function popValue() {
		this.setValue(this.state.values.slice(0, this.state.values.length - 1));
	},

	removeValue: function removeValue(valueToRemove) {
		this.setValue(this.state.values.filter(function (value) {
			return value !== valueToRemove;
		}));

		this.setState({ alertMessage: valueToRemove.label + ' removed' });
	},

	clearValue: function clearValue(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}

		this.setValue(null);
	},

	resetValue: function resetValue() {
		this.setValue(this.state.value);
	},

	getInputNode: function getInputNode() {
		var input = this.refs.input;
		return this.props.searchable ? input : input.getDOMNode();
	},

	fireChangeEvent: function fireChangeEvent(newState) {
		if (newState.value !== this.state.value && this.props.onChange) {
			this.props.onChange(newState.value, newState.values);
		}
	},

	handleMouseDown: function handleMouseDown(event) {
		// if the event was triggered by a mousedown and not the primary
		// if (event && event.type == 'mousedown' && event.button !== 0) {
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}

		event.stopPropagation();
		event.preventDefault();
		this.handleMouseDownImplementation();
	},
	handleMouseDownImplementation: function handleMouseDownImplementation() {
		if (this.state.isFocused) {
			this.setState({
				isOpen: true
			}, this._bindCloseMenuIfClickedOutside);
		} else {
			this._openAfterFocus = true;
			this.getInputNode().focus(); //is this actually needed? Had to manually set focus state for a keyboard nav fix.
			this.setState({ isFocused: true });
		}
	},

	handleInputFocus: function handleInputFocus(event) {
		var newIsOpen = this.state.isOpen || this._openAfterFocus;

		var alertMessage = newIsOpen && !(this.state.focusedOption === null || this.state.focusedOption === undefined) ? this.state.filteredOptions.length + ' options available. ' + this.state.focusedOption.label + ' currently focused.' : '';

		this.setState({
			isFocused: true,
			alertMessage: alertMessage,
			isOpen: newIsOpen }, function () {
			if (newIsOpen) {
				this._bindCloseMenuIfClickedOutside();
			} else {
				this._unbindCloseMenuIfClickedOutside();
			}
		});
		this._openAfterFocus = false;

		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	},

	handleInputBlur: function handleInputBlur(event) {
		this._blurTimeout = setTimeout((function () {
			if (this._focusAfterUpdate) return;
			this.setState({
				isFocused: false
			});
		}).bind(this), 50);

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	},

	handleKeyDown: function handleKeyDown(event) {
		if (this.state.disabled) {
			return;
		}switch (event.keyCode) {

			case 8:
				// backspace
				if (!this.props.nullNotAllowed && !this.state.inputValue) {
					this.popValue();
				}
				return;

			case 9:
				// tab
				if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
					return;
				}
				this.selectFocusedOption();
				break;

			case 13:
				// enter, but only if the menu is open
				if (!this.state.isOpen) {
					return;
				}

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

			default:
				return;
		}

		//prevent default action of whatever key was pressed
		event.preventDefault();
	},

	// Ensures that the currently focused option is available in filteredOptions.
	// If not, returns the first available option.
	_getNewFocusedOption: function _getNewFocusedOption(filteredOptions) {
		for (var key in filteredOptions) {
			if (filteredOptions.hasOwnProperty(key) && filteredOptions[key] === this.state.focusedOption) {
				return filteredOptions[key];
			}
		}
		return filteredOptions[0];
	},

	//This function handles keyboard text input for filtering options
	handleInputChange: function handleInputChange(event) {
		// assign an internal variable because we need to use
		// the latest value before setState() has completed.
		this._optionsFilterString = event.target.value;

		var filteredOptions = this.filterOptions(this.state.options);
		var alertMessage = !(this.state.focusedOption === null || this.state.focusedOption === undefined) ? filteredOptions.length + ' options available. ' + this.state.focusedOption.label + ' currently focused.' : '';

		if (this.props.asyncOptions) {
			this.setState({
				isLoading: true,
				inputValue: event.target.value,
				focusedOption: focusedOption,
				alertMessage: alertMessage
			});
			this.loadAsyncOptions(event.target.value, {
				isLoading: false,
				isOpen: true
			}, this._bindCloseMenuIfClickedOutside);
		} else {
			this.setState({
				isOpen: true,
				alertMessage: alertMessage,
				inputValue: event.target.value,
				filteredOptions: filteredOptions,
				focusedOption: this._getNewFocusedOption(filteredOptions)
			}, this._bindCloseMenuIfClickedOutside);
		}
	},

	autoloadAsyncOptions: function autoloadAsyncOptions() {
		var self = this;
		this.loadAsyncOptions('', {}, function () {
			// update with fetched
			self.setValue(self.props.value);
		});
	},

	loadAsyncOptions: function loadAsyncOptions(input, state, callback) {
		var thisRequestId = this._currentRequestId = requestId++;

		for (var i = 0; i <= input.length; i++) {
			var cacheKey = input.slice(0, i);
			if (this._optionsCache[cacheKey] && (input === cacheKey || this._optionsCache[cacheKey].complete)) {
				var options = this._optionsCache[cacheKey].options;
				var filteredOptions = this.filterOptions(options);

				var newState = {
					options: options,
					filteredOptions: filteredOptions,
					focusedOption: this._getNewFocusedOption(filteredOptions)
				};
				for (var key in state) {
					if (state.hasOwnProperty(key)) {
						newState[key] = state[key];
					}
				}
				this.setState(newState);
				if (callback) callback({});
				return;
			}
		}

		this.props.asyncOptions(input, (function (err, data) {

			if (err) throw err;

			this._optionsCache[input] = data;

			if (thisRequestId !== this._currentRequestId) {
				return;
			}
			var filteredOptions = this.filterOptions(data.options);

			var newState = {
				options: data.options,
				filteredOptions: filteredOptions,
				focusedOption: this._getNewFocusedOption(filteredOptions)
			};
			for (var key in state) {
				if (state.hasOwnProperty(key)) {
					newState[key] = state[key];
				}
			}
			this.setState(newState);

			if (callback) callback({});
		}).bind(this));
	},

	filterOptions: function filterOptions(options, values) {
		if (!this.props.searchable) {
			return options;
		}

		var filterValue = this._optionsFilterString;
		var exclude = (values || this.state.values).map(function (i) {
			return i.value;
		});

		if (this.props.filterOptions) {
			return this.props.filterOptions.call(this, options, filterValue, exclude);
		}

		var filterOption = function filterOption(op) {
			if (this.props.multi && exclude.indexOf(op.value) > -1) {
				return false;
			}if (this.props.filterOption) {
				return this.props.filterOption.call(this, op, filterValue);
			}var valueTest = String(op.value),
			    labelTest = String(op.label);
			return !filterValue || this.props.matchPos === 'start' ? this.props.matchProp !== 'label' && valueTest.toLowerCase().substr(0, filterValue.length) === filterValue || this.props.matchProp !== 'value' && labelTest.toLowerCase().substr(0, filterValue.length) === filterValue : this.props.matchProp !== 'label' && valueTest.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 || this.props.matchProp !== 'value' && labelTest.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
		};

		return (options || []).filter(filterOption, this);
	},

	selectFocusedOption: function selectFocusedOption() {
		return this.selectValue(this.state.focusedOption);
	},

	focusOption: function focusOption(op) {
		this.setState({
			focusedOption: op
		});
	},

	focusNextOption: function focusNextOption() {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption: function focusPreviousOption() {
		this.focusAdjacentOption('previous');
	},

	focusAdjacentOption: function focusAdjacentOption(dir) {
		this._focusedOptionReveal = true;

		var ops = this.state.filteredOptions;
		var alertMessage = !(this.state.focusedOption === null || this.state.focusedOption === undefined) ? ops.length + ' options available. ' + this.state.focusedOption.label + ' currently focused.' : '';

		if (!this.state.isOpen && !this.props.asyncOptions) {
			this.handleMouseDownImplementation();
			this.setState({
				isOpen: true,
				alertMessage: alertMessage,
				inputValue: '',
				focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
			}, this._bindCloseMenuIfClickedOutside);
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

		//select is open and navigation options for the next conditions
		if (this.props.asyncOptions && !this.state.isOpen) {
			this.handleMouseDownImplementation();
			this.setState({
				isOpen: true,
				alertMessage: alertMessage,
				inputValue: '',
				focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
			});
		} else if (this.props.multi) //multi select
			this.setState({
				focusedOption: focusedOption,
				inputValue: focusedOption.label,
				value: focusedOption.value,
				placeholder: focusedOption.label,
				alertMessage: focusedOption.label + ' currently focused. Press enter to select.'
			});else if (this.props.searchable) //normal select, update input value, but not value
			this.setState({
				focusedOption: focusedOption,
				inputValue: focusedOption.label,
				placeholder: focusedOption.label,
				alertMessage: focusedOption.label + ' currently focused. Press enter to select.'
			});else //non searchable so dont update input value, instead update value
			this.setState({
				focusedOption: focusedOption,
				value: focusedOption.value,
				placeholder: focusedOption.label,
				alertMessage: focusedOption.label + ' currently focused. Press enter to select.'
			});
	},

	unfocusOption: function unfocusOption(op) {
		if (this.state.focusedOption === op) {
			this.setState({
				focusedOption: null
			});
		}
	},

	swapFocus: function swapFocus(list, oldFocusIndex, newFocusIndex) {
		if (!list) {
			return;
		}

		if (!list[oldFocusIndex] || !list[newFocusIndex]) {
			return;
		}

		if (!newFocusIndex && newFocusIndex !== 0 || oldFocusIndex === newFocusIndex) {
			return;
		}

		var oldFocusReplacement = React.cloneElement(list[oldFocusIndex], {
			key: list[oldFocusIndex].key,
			ref: null,
			className: 'Select-option' });

		var newFocusReplacement = React.cloneElement(list[newFocusIndex], {
			key: list[newFocusIndex].key,
			ref: 'focused',
			className: 'Select-option is-focused' });

		this.cachedFocusedItemIndex = newFocusIndex;

		this.cachedMenu.splice(oldFocusIndex, 1, oldFocusReplacement);
		this.cachedMenu.splice(newFocusIndex, 1, newFocusReplacement);
	},

	//Needed to cache item focusing
	cachedFocusedItemIndex: 0,
	cachedListItemsIndexLookup: {},
	cachedMenu: [],
	cachedFiltered: [],

	buildMenu: function buildMenu() {
		var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;

		if (this.cachedFiltered == this.state.filteredOptions) {
			this.swapFocus(this.cachedMenu, this.cachedFocusedItemIndex, this.cachedListItemsIndexLookup[focusedValue]);
			return this.cachedMenu;
		}

		this.cachedListItemsIndexLookup = {};

		if (this.state.filteredOptions.length > 0) {
			focusedValue = focusedValue == null ? this.state.filteredOptions[0] : focusedValue;
		}

		var ops = Object.keys(this.state.filteredOptions).map(function (key, index) {
			var op = this.state.filteredOptions[key];
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
			var checkMark = '';
			if (isFocused) {
				this.cachedFocusedItem = index;
				checkMark = ' Selected';
			}

			return React.createElement(
				'a',
				{
					role: 'listitem',
					'aria-label': op.label + checkMark,
					ref: ref,
					key: 'option-' + op.value,
					className: optionClass,
					onMouseEnter: mouseEnter,
					onMouseLeave: mouseLeave,
					onMouseDown: mouseDown,
					onClick: mouseDown },
				op.label
			);
		}, this);

		return ops.length ? ops : React.createElement(
			'div',
			{ className: 'Select-noresults' },
			this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText
		);
	},

	handleOptionLabelClick: function handleOptionLabelClick(value, event) {
		var handler = this.props.onOptionLabelClick;

		if (handler) {
			handler(value, event);
		}
	},

	buildCustomMenu: function buildCustomMenu() {
		if (!this.props.children) {
			return;
		}

		var child = this.props.children;

		return React.cloneElement(child, {
			onSelectItem: this.selectValue,
			options: this.props.options,
			filtered: this.state.filteredOptions,
			inputValue: this.state.inputValue,
			focussedItem: this.state.focusedOption,
			onFocusItem: this.focusOption,
			onUnfocusItem: this.unfocusOption
		});
	},

	switchFocus: function switchFocus() {
		this.getInputNode().focus();
	},

	render: function render() {
		var selectClass = classes('Select', this.props.className, {
			'is-multi': this.props.multi,
			'is-searchable': this.props.searchable,
			'is-open': this.state.isOpen,
			'is-focused': this.state.isFocused,
			'is-loading': this.state.isLoading,
			'is-disabled': this.props.disabled,
			'has-value': this.state.value
		});

		var value = [];

		if (this.props.multi) {
			this.state.values.forEach(function (val) {
				var props = {
					key: val.value,
					optionLabelClick: !!this.props.onOptionLabelClick,
					onOptionLabelClick: this.handleOptionLabelClick.bind(this, val),
					onRemove: this.removeValue.bind(this, val)
				};

				for (var key in val) {
					if (val.hasOwnProperty(key)) {
						props[key] = val[key];
					}
				}

				value.push(React.createElement(Value, props));
			}, this);
		}

		if (this.props.disabled || !this.state.inputValue && (!this.props.multi || !value.length)) {
			value.push(React.createElement(
				'div',
				{ 'aria-hidden': 'true', className: 'Select-placeholder', key: 'placeholder' },
				this.state.placeholder
			));
		}

		var loading = this.state.isLoading ? React.createElement('span', { className: 'Select-loading', 'aria-hidden': 'true' }) : null;
		var clear = !this.props.nullNotAllowed && this.props.clearable && this.state.value && !this.props.disabled ? React.createElement('span', { role: 'button', className: 'Select-clear', title: this.props.multi ? this.props.clearAllText : this.props.clearValueText, 'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText, onMouseDown: this.clearValue, onClick: this.clearValue, dangerouslySetInnerHTML: { __html: '&times;' } }) : null;

		var builtMenu = this.props.children ? this.buildCustomMenu() : this.buildMenu();

		this.cachedFiltered = this.state.filteredOptions;
		this.cachedMenu = builtMenu;

		var menu;
		var menuProps;
		if (this.state.isOpen) {
			menuProps = {
				ref: 'menu',
				className: 'Select-menu'
			};
			if (this.props.multi) {
				menuProps.onMouseDown = this.handleMouseDown;
			}
			menu = React.createElement(
				'div',
				{ ref: 'selectMenuContainer', className: 'Select-menu-outer' },
				React.createElement(
					'div',
					menuProps,
					builtMenu
				)
			);
		}

		var hideVisuallyStyles = {
			position: 'absolute',
			left: '-999999px',
			top: 'auto',
			overflow: 'hidden',
			height: '1px',
			width: '1px'
		};

		var moveInputFocusForMulti = '';
		var summaryLabelMainInput,
		    hideMainInput = false;
		var currentSelectionText = this.state.placeholder;
		//handle multi select aria notification order differently because of the remove buttons
		if (this.props.multi) {
			var valueList = this.state.values;
			if (valueList.length > 1) {
				currentSelectionText = '';
				valueList.forEach(function (val, index) {
					currentSelectionText += String(val.label);
					if (index < valueList.length - 1) currentSelectionText += ', ';
				});
				currentSelectionText += ' currently selected.';
			} else if (valueList.length === 1) {
				currentSelectionText = valueList[0].label + ' currently selected.';
			}

			moveInputFocusForMulti = React.createElement('input', {
				style: hideVisuallyStyles,
				'aria-label': currentSelectionText + ', ' + this.props.accessibleLabel + ', Combobox. Press down arrow key to open select options or start typing for options to be filtered. Use up and down arrow keys to navigate options. Press enter to select an option.',
				onFocus: this.switchFocus, minWidth: '5' });
			summaryLabelMainInput = '';
			hideMainInput = true;
		} else {
			summaryLabelMainInput = currentSelectionText + ', ' + this.props.accessibleLabel + ', Combobox. Press down arrow key to open select options or start typing for options to be filtered. Use up and down arrow keys to navigate options. Press enter to select an option.';
		}

		var input;
		var inputProps = {
			ref: 'input',
			className: 'Select-input',
			tabIndex: this.props.tabIndex || 0,
			onFocus: this.handleInputFocus,
			onBlur: this.handleInputBlur
		};
		for (var key in this.props.inputProps) {
			if (this.props.inputProps.hasOwnProperty(key)) {
				inputProps[key] = this.props.inputProps[key];
			}
		}

		if (this.props.searchable && !this.props.disabled) {
			input = React.createElement(Input, _extends({
				'aria-hidden': hideMainInput,
				'aria-label': summaryLabelMainInput,
				value: this.state.inputValue,
				onChange: this.handleInputChange,
				minWidth: '5'
			}, inputProps));
		} else {
			var summaryLabelNonSearchable = currentSelectionText + ', ' + this.props.accessibleLabel + ', Combobox. Press down arrow key to open select options. Use up and down arrow keys to navigate options. Press enter to select an option. Typing will not filter options, this is a non-searchable combobox.';
			input = React.createElement(
				'div',
				_extends({
					'aria-label': summaryLabelNonSearchable
				}, inputProps),
				' '
			);
		}

		return React.createElement(
			'div',
			{ ref: 'wrapper', className: selectClass },
			React.createElement('input', { type: 'hidden', ref: 'value', name: this.props.name, value: this.state.value, disabled: this.props.disabled }),
			React.createElement(
				'div',
				{ className: 'Select-control', ref: 'control', onKeyDown: this.handleKeyDown, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
				moveInputFocusForMulti,
				value,
				input,
				React.createElement('span', { className: 'Select-arrow' }),
				loading,
				clear
			),
			menu,
			React.createElement(
				'div',
				{ tabIndex: '-1', style: hideVisuallyStyles, id: 'alert-options', role: 'alert', 'aria-label': 'End of select' },
				this.state.alertMessage
			)
		);
	}

});

module.exports = Select;