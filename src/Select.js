var _ = require('underscore'),
	React = require('react/addons'),
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
		value: React.PropTypes.any,                // initial field value
		multi: React.PropTypes.bool,               // multi-value input
		disabled: React.PropTypes.bool,            // whether the Select is disabled or not
		options: React.PropTypes.array,            // array of options
		delimiter: React.PropTypes.string,         // delimiter to use to join multiple values
		asyncOptions: React.PropTypes.func,        // function to call to get options
		autoload: React.PropTypes.bool,            // whether to auto-load the default async options set
		placeholder: React.PropTypes.string,       // field placeholder, displayed when there's no value
		noResultsText: React.PropTypes.string,     // placeholder displayed when there are no matching search results
		clearable: React.PropTypes.bool,           // should it be possible to reset value
		clearValueText: React.PropTypes.string,    // title for the "clear" control
		clearAllText: React.PropTypes.string,      // title for the "clear" control when multi: true
		searchable: React.PropTypes.bool,          // whether to enable searching feature or not
		searchPromptText: React.PropTypes.string,  // label to prompt for search input
		name: React.PropTypes.string,              // field name, for hidden <input /> tag
		onChange: React.PropTypes.func,            // onChange handler: function(newValue) {}
		className: React.PropTypes.string,         // className for the outer element
		filterOption: React.PropTypes.func,        // method to filter a single option: function(option, filterString)
		filterOptions: React.PropTypes.func,       // method to filter the options array: function([options], filterString, [values])
		matchPos: React.PropTypes.string,          // (any|start) match the start or entire string when filtering
		matchProp: React.PropTypes.string,         // (any|label|value) which option property to filter on
		accessibleLabel: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			value: undefined,
			options: [],
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
			accessibleLabel: "Choose a value"
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
			isLoading: false,
			alertMessage: ""
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
				this.getInputNode().focus();
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

		if(this.state.alertMessage !== "") {
			var that = this;
			setTimeout(function() {
				that.setState({
					alertMessage: ""
				});
			}, 500);
			
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
		// this[this.props.multi ? 'addValue' : 'setValue'](value);
		if (!this.props.multi) {
			this.setValue(value);
		} else if (value) {
			this.addValue(value);
		}
		this.setState({alertMessage: value.label + " selected"});
		
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

	getInputNode: function () {
		var input = this.refs.input;
		return this.props.searchable ? input : input.getDOMNode();
	},

	fireChangeEvent: function(newState) {
		if (newState.value !== this.state.value && this.props.onChange) {
			this.props.onChange(newState.value, newState.values);
		}
	},

	handleMouseDown: function(event) {
		// if the event was triggered by a mousedown and not the primary
		// if (event && event.type == 'mousedown' && event.button !== 0) {

		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type == 'mousedown' && event.button !== 0)) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.handleMouseDownImplementation();
		
	},
	handleMouseDownImplementation: function() {
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

	handleInputFocus: function() {
		var openMenu = this.state.isOpen || this._openAfterFocus
		this.setState({
			isFocused: true,
			isOpen: openMenu,
			alertMessage: (openMenu) ? this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused." : ""
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
		}.bind(this), 500);
	},

	handleKeyDown: function(event) {

		if(this.state.disabled)
			return;

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
					this.setState({
						isOpen: true,
						alertMessage: this.state.filteredOptions.length + " options available. " + this.state.focusedOption.label + " currently focused."
					})
				}
				else
					return;
			break;
			
			default: return;
		}
		
		//prevent default action of whatever key was pressed
		event.preventDefault();

	},

	//This function handles keyboard text input for filtering options
	handleInputChange: function(event) {
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
		if (!this.props.searchable) {
			return options;
		}

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
				alertMessage: ops.length + " options available. " + this.state.focusedOption.label + " currently focused.",
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
			focusedOption: focusedOption,
			inputValue: focusedOption.label
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
			
			return <a role="listitem" aria-label={op.label + checkMark} ref={ref} key={'option-' + op.value} className={optionClass} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onClick={mouseDown}>{op.label}</a>;
			
		}, this);

		return ops.length ? ops : (
			<div className="Select-noresults">
				{this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText}
			</div>
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
			'is-searchable': this.props.searchable,
			'is-open': this.state.isOpen,
			'is-focused': this.state.isFocused,
			'is-loading': this.state.isLoading,
			'is-disabled' : this.props.disabled,
			'has-value': this.state.value
		});

		var value = [];

		if (this.props.multi) {
			this.state.values.forEach(function(val) {
				var props = _.extend({
					key: val.value,
					onRemove: this.removeValue.bind(this, val)
				}, val);
				value.push(<Value {...props} />);
			}, this);
		}

		if (this.props.disabled || (!this.state.inputValue && (!this.props.multi || !value.length))) {
			value.push(<div aria-hidden="true" className="Select-placeholder" key="placeholder">{this.state.placeholder}</div>);
		}

		var loading = this.state.isLoading ? <span className="Select-loading" aria-hidden="true" /> : null;
		var clear = this.props.clearable && this.state.value && !this.props.disabled ? <span role="button" className="Select-clear" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText} aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText} onMouseDown={this.clearValue} onClick={this.clearValue} dangerouslySetInnerHTML={{ __html: '&times;' }} /> : null;
		var builtMenu = this.props.buildCustomMenu ? this.props.buildCustomMenu(this.selectValue, this.state.filteredOptions, this.state.focusedOption, this.focusOption, this.unfocusOption) : this.buildMenu();
		// var builtMenu = this.props.children ? this.buildCustomMenu() : this.buildMenu();

	    this.cachedFiltered = this.state.filteredOptions;
	    this.cachedMenu = builtMenu;

		var menu = this.state.isOpen ? <div id="Select-menu" ref="menu" className="Select-menu">{builtMenu}</div> : null;

		var currentSelectionText = this.state.placeholder;
		//for multi select can't use placeholder for current selection text
		if(this.props.multi) {
			var valueList = this.state.values; 
			if(valueList.length > 1)
			{
				currentSelectionText = ""
				valueList.forEach(function(val, index) {
					currentSelectionText += String(val.label);
					if(index < (valueList.length - 1))
						currentSelectionText += ", ";
				});
				currentSelectionText += " currently selected.";
			}
			else if(valueList.length === 1) {
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
			ref: 'input',
			className: 'Select-input',
			tabIndex: this.props.tabIndex || 0,
			onFocus: this.handleInputFocus,
			onBlur: this.handleInputBlur,
		};
		var input;

		if (this.props.searchable && !this.props.disabled) {
			input = <Input 
				aria-label={currentSelectionText + ", " + this.props.accessibleLabel + ", Combobox. Press down arrow key to open select options or start typing for options to be filtered. Navigate the options using up and down arrow keys. Press enter to select an option."}
				value={this.state.inputValue} 
				onChange={this.handleInputChange} 
				minWidth="5" 
				{...commonProps} />;
		} else {
			input = <div {...commonProps}>&nbsp;</div>;
		}

		return (
			<div ref="wrapper" className={selectClass}>
				<input type="hidden" ref="value" name={this.props.name} value={this.state.value} disabled={this.props.disabled} />
				<div className="Select-control" ref="control" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
					{value}
					{input}

					<span className="Select-arrow" />
					{loading}
					{clear}
					
				</div>

				{menu}
				<div tabIndex="-999" style={hideVisuallyStyles} id="alert-options" role="alert" aria-label="End of select">{this.state.alertMessage}</div>
			</div>


		);

	}

});


module.exports = Select;
