require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./examples/src/app.js":[function(require,module,exports){
var React = require('react'),
	Select = require('react-select'),
	MoreList = require('../../../react-more-list/more-list.jsx');

//require('./external/more-list-styles.css');

var STATES = require('./data/states');

function logChange(value) {
	console.log('Select value changed: ' + value);
}

var CountrySelect = React.createClass({displayName: "CountrySelect",
	onClick: function() {
		this.props.onSelect(this.props.value);
	},
	render: function() {
		var className = this.props.value === this.props.selected ? 'active' : 'link';
		return React.createElement("span", {onClick: this.onClick, className: className}, this.props.children);
	}
});
 
var StatesField = React.createClass({displayName: "StatesField",
	getInitialState: function() {
		return {
			country: 'AU',
			selectValue: 'new-south-wales'
		}
	},
	switchCountry: function(newCountry) {
		console.log('Country changed to ' + newCountry);
		this.setState({
			country: newCountry,
			selectValue: null
		});
	},
	updateValue: function(newValue) {
		logChange('State changed to ' + newValue);
		this.setState({
			selectValue: newValue || null
		});
	},
	render: function() {
		var ops = STATES[this.state.country];
		return (
			React.createElement("div", null, 
				React.createElement("label", null, "States:"), 
				React.createElement(Select, {options: ops, value: this.state.selectValue, onChange: this.updateValue}), 
				React.createElement("div", {className: "switcher"}, 
					"Country:", 
					React.createElement(CountrySelect, {value: "AU", selected: this.state.country, onSelect: this.switchCountry}, "Australia"), 
					React.createElement(CountrySelect, {value: "US", selected: this.state.country, onSelect: this.switchCountry}, "US")
				)
			)
		);
	}
});
 
var RemoteSelectField = React.createClass({displayName: "RemoteSelectField",
	loadOptions: function(input, callback) {
		
		input = input.toLowerCase();
		
		var rtn = {
			options: [
				{ label: 'One', value: 'one' },
				{ label: 'Two', value: 'two' },
				{ label: 'Three', value: 'three' }
			],
			complete: true
		};
		
		if (input.slice(0,1) === 'a') {
			if (input.slice(0,2) === 'ab') {
				rtn = {
					options: [
						{ label: 'AB', value: 'ab' },
						{ label: 'ABC', value: 'abc' },
						{ label: 'ABCD', value: 'abcd' }
					],
					complete: true
				};
			} else {
				rtn = {
					options: [
						{ label: 'A', value: 'a' },
						{ label: 'AA', value: 'aa' },
						{ label: 'AB', value: 'ab' }
					],
					complete: false
				};
			}
		} else if (!input.length) {
			rtn.complete = false;
		}
		
		setTimeout(function() {
			callback(null, rtn);
		}, 500);
		
	},
	render: function() {
		return React.createElement("div", null, 
			React.createElement("label", null, this.props.label), 
			React.createElement(Select, {asyncOptions: this.loadOptions, className: "remote-example"})
		);
	}
});

//Binding straight to callback throws a warning
function mouseDownHandler(onMouseDown_callback, item) {
	onMouseDown_callback(item);
}

function mouseEnterHandler(onMouseEnter_callback, item) {
	onMouseEnter_callback(item);
}

function mouseLeaveHandler(onMouseLeave_callback, item) {
	onMouseLeave_callback(item);
}

function testRender(onMouseDown_callback, filtered, focussed, focus_callback, unfocus_callback) {
	var listItems = filtered.map(function(item) {
		var className = focussed && focussed.value === item.value ? "is-focused" : null;

		var mouseDown = mouseDownHandler.bind(this, onMouseDown_callback, item);
		var mouseEnter = mouseEnterHandler.bind(this, focus_callback, item);
		var mouseLeave = mouseLeaveHandler.bind(this, unfocus_callback, item);

		return React.createElement("li", {className: className, onMouseDown: mouseDown, onMouseEnter: mouseEnter, onMouseLeave: mouseLeave}, item.label)
	}, this)

	return (
		React.createElement(MoreList, null, 
			listItems
		)
	)
}

var MultiSelectField = React.createClass({displayName: "MultiSelectField",
	render: function() {
		var ops = [
			{ label: 'Chocolate', value: 'chocolate' },
			{ label: 'Vanilla', value: 'vanilla' },
			{ label: 'Strawberry', value: 'strawberry' },
			{ label: 'Caramel', value: 'caramel' },
			{ label: 'Cookies and Cream', value: 'cookiescream' },
			{ label: 'Peppermint', value: 'peppermint' },
			{ label: 'Rocky Road', value: 'rockyroad' },
			{ label: 'Cookie Dough', value: 'cookiedough' }
		];
		return React.createElement("div", null, 
			React.createElement("label", null, this.props.label), 
			React.createElement(Select, {multi: true, placeholder: "Select your favourite(s)", buildCustomMenu: testRender, options: ops, onChange: logChange})
		);
	}
});


React.render(
	React.createElement("div", null, 
		React.createElement(StatesField, null), 
		React.createElement(MultiSelectField, {label: "Multiselect:"}), 
		React.createElement(RemoteSelectField, {label: "Remote Options:"})
	),
	document.getElementById('example')
);

},{"../../../react-more-list/more-list.jsx":"/Users/stephensmith/Desktop/gitRepos/react-more-list/more-list.jsx","./data/states":"/Users/stephensmith/Desktop/gitRepos/react-select/examples/src/data/states.js","react":false,"react-select":false}],"/Users/stephensmith/Desktop/gitRepos/react-more-list/more-list.jsx":[function(require,module,exports){
var React = require("react/addons");

/************* Helper Functions **************/
function isElementType(element, expectedType) {
  return getElementType(element) == expectedType;
}

function getElementType(element) {
  return element.type.displayName || element.type;
}

var MoreList = React.createClass({displayName: "MoreList",
  componentWillMount: function() {
    if(this.props.children === null || this.props.children.length === 0) {
      throw new Error("No elements found in MoreList");
    }

    var errors = "";
    var children = this.props.children;

    if(children.constructor !== Array) {
      children = [children];
    }
    
    children.forEach(function(child) {
      if(!isElementType(child, "li")) {
        errors += "\r\nFound " + getElementType(child) + " element in MoreList. All elements should be 'li'";
      }
    });

    if(errors !== "") {
      throw new Error(errors);
    }
  },
  getInitialState: function() {
    return { itemsShown: this.props.initialSize };
  },
  increaseItemsShown: function(event, increment) {
    this.setState({itemsShown: this.state.itemsShown + increment});

    //supposedly React wraps the event, but it doesn't seem to be happening
    //so we need both of these here.
    event.stopPropagation();
    event.preventDefault();
    return false;
  },
  propTypes: {
    initialSize: React.PropTypes.number,
    moreSize: React.PropTypes.number,
    tolerance: React.PropTypes.number,
    allowShowAll: React.PropTypes.bool,
    showCount: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      initialSize: 4,
      moreSize: 20,
      tolerance: 1,
      allowShowAll: false,
      showCount: true
    };
  },
  addMoreComponent: function() {
    var children = this.props.children;

    if(children.length <= this.state.itemsShown + this.props.tolerance) {
      return null;
    }

    var remaining = children.length - this.state.itemsShown;

    if(this.props.moreSize === 0)
    {
      var count = this.props.showCount ? React.createElement("span", {className: "ml-count ml-more-count"}, remaining) : null;
      return (React.createElement("li", {className: "ml-list-item ml-expander ml-more", onMouseDown: this.increaseItemsShown.bind(this, event, remaining)}, "More... ", count));
    }

    var toAdd = remaining <= this.props.moreSize ? remaining : this.props.moreSize;

    var displayedCount = this.props.allowShowAll ? toAdd : remaining;
    displayedCount += remaining > displayedCount ? "+" : "";
    
    var count = this.props.showCount ? React.createElement("span", {className: "ml-count ml-more-count"}, displayedCount) : null;
    return (React.createElement("li", {className: "ml-list-item ml-expander ml-more", onMouseDown: this.increaseItemsShown.bind(this, event, toAdd)}, "More... ", count));
  },
  addShowAllComponent: function() {
    if(!this.props.allowShowAll || this.props.moreSize == 0) {
      return null;
    }

    var children = this.props.children;
    
    if(children.length <= this.state.itemsShown + this.props.moreSize + this.props.tolerance) {
      return null;
    }

    var remaining = children.length - this.state.itemsShown;
    
    var count = this.props.showCount ? React.createElement("span", {className: "ml-count ml-show-all-count"}, remaining) : null;
    return (React.createElement("li", {className: "ml-list-item ml-expander ml-show-all", onMouseDown: this.increaseItemsShown.bind(this, event, remaining)}, "Show All... ", count));
  },
  render: function()
  {
    var children = this.props.children;

    if(children.constructor !== Array) {
    children = [children];
    }

    var shownItemCount = this.state.itemsShown;
    shownItemCount += shownItemCount + this.props.tolerance >= children.length ? this.props.tolerance : 0;

    var listItems = children.slice(0, shownItemCount).map(function (child) {
      var className = "ml-list-item ml-data"

      if(child.props.className) {
        className = className + " " + child.props.className;
      }

      return React.addons.cloneWithProps(child, { className: className})
    });

    listItems.push(this.addMoreComponent());
    listItems.push(this.addShowAllComponent());

    return (
      React.createElement("ul", {className: "ml-list"}, 
        listItems
      )
    )
  }
});

module.exports = MoreList;
},{"react/addons":false}],"/Users/stephensmith/Desktop/gitRepos/react-select/examples/src/data/states.js":[function(require,module,exports){
exports.AU = [
	{ value: 'australian-capital-territory', label: 'Australian Capital Territory' },
	{ value: 'new-south-wales', label: 'New South Wales' },
	{ value: 'victoria', label: 'Victoria' },
	{ value: 'queensland', label: 'Queensland' },
	{ value: 'western-australia', label: 'Western Australia' },
	{ value: 'south-australia', label: 'South Australia' },
	{ value: 'tasmania', label: 'Tasmania' },
	{ value: 'northern-territory', label: 'Northern Territory' }
];

exports.US = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AS', label: 'American Samoa' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FM', label: 'Federated States Of Micronesia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'GU', label: 'Guam' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MH', label: 'Marshall Islands' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'MP', label: 'Northern Mariana Islands' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PW', label: 'Palau' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'PR', label: 'Puerto Rico' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VI', label: 'Virgin Islands' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

},{}]},{},["./examples/src/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiLi4vcmVhY3QtbW9yZS1saXN0L21vcmUtbGlzdC5qc3giLCJleGFtcGxlcy9zcmMvZGF0YS9zdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0U2VsZWN0ID0gcmVxdWlyZSgncmVhY3Qtc2VsZWN0JyksXG5cdE1vcmVMaXN0ID0gcmVxdWlyZSgnLi4vLi4vLi4vcmVhY3QtbW9yZS1saXN0L21vcmUtbGlzdC5qc3gnKTtcblxuLy9yZXF1aXJlKCcuL2V4dGVybmFsL21vcmUtbGlzdC1zdHlsZXMuY3NzJyk7XG5cbnZhciBTVEFURVMgPSByZXF1aXJlKCcuL2RhdGEvc3RhdGVzJyk7XG5cbmZ1bmN0aW9uIGxvZ0NoYW5nZSh2YWx1ZSkge1xuXHRjb25zb2xlLmxvZygnU2VsZWN0IHZhbHVlIGNoYW5nZWQ6ICcgKyB2YWx1ZSk7XG59XG5cbnZhciBDb3VudHJ5U2VsZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvdW50cnlTZWxlY3RcIixcblx0b25DbGljazogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wcm9wcy5vblNlbGVjdCh0aGlzLnByb3BzLnZhbHVlKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy52YWx1ZSA9PT0gdGhpcy5wcm9wcy5zZWxlY3RlZCA/ICdhY3RpdmUnIDogJ2xpbmsnO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7b25DbGljazogdGhpcy5vbkNsaWNrLCBjbGFzc05hbWU6IGNsYXNzTmFtZX0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXHR9XG59KTtcbiBcbnZhciBTdGF0ZXNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTdGF0ZXNGaWVsZFwiLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjb3VudHJ5OiAnQVUnLFxuXHRcdFx0c2VsZWN0VmFsdWU6ICduZXctc291dGgtd2FsZXMnXG5cdFx0fVxuXHR9LFxuXHRzd2l0Y2hDb3VudHJ5OiBmdW5jdGlvbihuZXdDb3VudHJ5KSB7XG5cdFx0Y29uc29sZS5sb2coJ0NvdW50cnkgY2hhbmdlZCB0byAnICsgbmV3Q291bnRyeSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRjb3VudHJ5OiBuZXdDb3VudHJ5LFxuXHRcdFx0c2VsZWN0VmFsdWU6IG51bGxcblx0XHR9KTtcblx0fSxcblx0dXBkYXRlVmFsdWU6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG5cdFx0bG9nQ2hhbmdlKCdTdGF0ZSBjaGFuZ2VkIHRvICcgKyBuZXdWYWx1ZSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RWYWx1ZTogbmV3VmFsdWUgfHwgbnVsbFxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvcHMgPSBTVEFURVNbdGhpcy5zdGF0ZS5jb3VudHJ5XTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIFwiU3RhdGVzOlwiKSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7b3B0aW9uczogb3BzLCB2YWx1ZTogdGhpcy5zdGF0ZS5zZWxlY3RWYWx1ZSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzd2l0Y2hlclwifSwgXG5cdFx0XHRcdFx0XCJDb3VudHJ5OlwiLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvdW50cnlTZWxlY3QsIHt2YWx1ZTogXCJBVVwiLCBzZWxlY3RlZDogdGhpcy5zdGF0ZS5jb3VudHJ5LCBvblNlbGVjdDogdGhpcy5zd2l0Y2hDb3VudHJ5fSwgXCJBdXN0cmFsaWFcIiksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ291bnRyeVNlbGVjdCwge3ZhbHVlOiBcIlVTXCIsIHNlbGVjdGVkOiB0aGlzLnN0YXRlLmNvdW50cnksIG9uU2VsZWN0OiB0aGlzLnN3aXRjaENvdW50cnl9LCBcIlVTXCIpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcbiBcbnZhciBSZW1vdGVTZWxlY3RGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJSZW1vdGVTZWxlY3RGaWVsZFwiLFxuXHRsb2FkT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIGNhbGxiYWNrKSB7XG5cdFx0XG5cdFx0aW5wdXQgPSBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuXHRcdFxuXHRcdHZhciBydG4gPSB7XG5cdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdHsgbGFiZWw6ICdPbmUnLCB2YWx1ZTogJ29uZScgfSxcblx0XHRcdFx0eyBsYWJlbDogJ1R3bycsIHZhbHVlOiAndHdvJyB9LFxuXHRcdFx0XHR7IGxhYmVsOiAnVGhyZWUnLCB2YWx1ZTogJ3RocmVlJyB9XG5cdFx0XHRdLFxuXHRcdFx0Y29tcGxldGU6IHRydWVcblx0XHR9O1xuXHRcdFxuXHRcdGlmIChpbnB1dC5zbGljZSgwLDEpID09PSAnYScpIHtcblx0XHRcdGlmIChpbnB1dC5zbGljZSgwLDIpID09PSAnYWInKSB7XG5cdFx0XHRcdHJ0biA9IHtcblx0XHRcdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUInLCB2YWx1ZTogJ2FiJyB9LFxuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0FCQycsIHZhbHVlOiAnYWJjJyB9LFxuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0FCQ0QnLCB2YWx1ZTogJ2FiY2QnIH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdGNvbXBsZXRlOiB0cnVlXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydG4gPSB7XG5cdFx0XHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0EnLCB2YWx1ZTogJ2EnIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUEnLCB2YWx1ZTogJ2FhJyB9LFxuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0FCJywgdmFsdWU6ICdhYicgfVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0Y29tcGxldGU6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICghaW5wdXQubGVuZ3RoKSB7XG5cdFx0XHRydG4uY29tcGxldGUgPSBmYWxzZTtcblx0XHR9XG5cdFx0XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGNhbGxiYWNrKG51bGwsIHJ0bik7XG5cdFx0fSwgNTAwKTtcblx0XHRcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCB0aGlzLnByb3BzLmxhYmVsKSwgXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge2FzeW5jT3B0aW9uczogdGhpcy5sb2FkT3B0aW9ucywgY2xhc3NOYW1lOiBcInJlbW90ZS1leGFtcGxlXCJ9KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG4vL0JpbmRpbmcgc3RyYWlnaHQgdG8gY2FsbGJhY2sgdGhyb3dzIGEgd2FybmluZ1xuZnVuY3Rpb24gbW91c2VEb3duSGFuZGxlcihvbk1vdXNlRG93bl9jYWxsYmFjaywgaXRlbSkge1xuXHRvbk1vdXNlRG93bl9jYWxsYmFjayhpdGVtKTtcbn1cblxuZnVuY3Rpb24gbW91c2VFbnRlckhhbmRsZXIob25Nb3VzZUVudGVyX2NhbGxiYWNrLCBpdGVtKSB7XG5cdG9uTW91c2VFbnRlcl9jYWxsYmFjayhpdGVtKTtcbn1cblxuZnVuY3Rpb24gbW91c2VMZWF2ZUhhbmRsZXIob25Nb3VzZUxlYXZlX2NhbGxiYWNrLCBpdGVtKSB7XG5cdG9uTW91c2VMZWF2ZV9jYWxsYmFjayhpdGVtKTtcbn1cblxuZnVuY3Rpb24gdGVzdFJlbmRlcihvbk1vdXNlRG93bl9jYWxsYmFjaywgZmlsdGVyZWQsIGZvY3Vzc2VkLCBmb2N1c19jYWxsYmFjaywgdW5mb2N1c19jYWxsYmFjaykge1xuXHR2YXIgbGlzdEl0ZW1zID0gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gZm9jdXNzZWQgJiYgZm9jdXNzZWQudmFsdWUgPT09IGl0ZW0udmFsdWUgPyBcImlzLWZvY3VzZWRcIiA6IG51bGw7XG5cblx0XHR2YXIgbW91c2VEb3duID0gbW91c2VEb3duSGFuZGxlci5iaW5kKHRoaXMsIG9uTW91c2VEb3duX2NhbGxiYWNrLCBpdGVtKTtcblx0XHR2YXIgbW91c2VFbnRlciA9IG1vdXNlRW50ZXJIYW5kbGVyLmJpbmQodGhpcywgZm9jdXNfY2FsbGJhY2ssIGl0ZW0pO1xuXHRcdHZhciBtb3VzZUxlYXZlID0gbW91c2VMZWF2ZUhhbmRsZXIuYmluZCh0aGlzLCB1bmZvY3VzX2NhbGxiYWNrLCBpdGVtKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lLCBvbk1vdXNlRG93bjogbW91c2VEb3duLCBvbk1vdXNlRW50ZXI6IG1vdXNlRW50ZXIsIG9uTW91c2VMZWF2ZTogbW91c2VMZWF2ZX0sIGl0ZW0ubGFiZWwpXG5cdH0sIHRoaXMpXG5cblx0cmV0dXJuIChcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KE1vcmVMaXN0LCBudWxsLCBcblx0XHRcdGxpc3RJdGVtc1xuXHRcdClcblx0KVxufVxuXG52YXIgTXVsdGlTZWxlY3RGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNdWx0aVNlbGVjdEZpZWxkXCIsXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wcyA9IFtcblx0XHRcdHsgbGFiZWw6ICdDaG9jb2xhdGUnLCB2YWx1ZTogJ2Nob2NvbGF0ZScgfSxcblx0XHRcdHsgbGFiZWw6ICdWYW5pbGxhJywgdmFsdWU6ICd2YW5pbGxhJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1N0cmF3YmVycnknLCB2YWx1ZTogJ3N0cmF3YmVycnknIH0sXG5cdFx0XHR7IGxhYmVsOiAnQ2FyYW1lbCcsIHZhbHVlOiAnY2FyYW1lbCcgfSxcblx0XHRcdHsgbGFiZWw6ICdDb29raWVzIGFuZCBDcmVhbScsIHZhbHVlOiAnY29va2llc2NyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BlcHBlcm1pbnQnLCB2YWx1ZTogJ3BlcHBlcm1pbnQnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUm9ja3kgUm9hZCcsIHZhbHVlOiAncm9ja3lyb2FkJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nvb2tpZSBEb3VnaCcsIHZhbHVlOiAnY29va2llZG91Z2gnIH1cblx0XHRdO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7bXVsdGk6IHRydWUsIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCB5b3VyIGZhdm91cml0ZShzKVwiLCBidWlsZEN1c3RvbU1lbnU6IHRlc3RSZW5kZXIsIG9wdGlvbnM6IG9wcywgb25DaGFuZ2U6IGxvZ0NoYW5nZX0pXG5cdFx0KTtcblx0fVxufSk7XG5cblxuUmVhY3QucmVuZGVyKFxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3RhdGVzRmllbGQsIG51bGwpLCBcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KE11bHRpU2VsZWN0RmllbGQsIHtsYWJlbDogXCJNdWx0aXNlbGVjdDpcIn0pLCBcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFJlbW90ZVNlbGVjdEZpZWxkLCB7bGFiZWw6IFwiUmVtb3RlIE9wdGlvbnM6XCJ9KVxuXHQpLFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhhbXBsZScpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0L2FkZG9uc1wiKTtcblxuLyoqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIGlzRWxlbWVudFR5cGUoZWxlbWVudCwgZXhwZWN0ZWRUeXBlKSB7XG4gIHJldHVybiBnZXRFbGVtZW50VHlwZShlbGVtZW50KSA9PSBleHBlY3RlZFR5cGU7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRUeXBlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQudHlwZS5kaXNwbGF5TmFtZSB8fCBlbGVtZW50LnR5cGU7XG59XG5cbnZhciBNb3JlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNb3JlTGlzdFwiLFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMucHJvcHMuY2hpbGRyZW4gPT09IG51bGwgfHwgdGhpcy5wcm9wcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGVsZW1lbnRzIGZvdW5kIGluIE1vcmVMaXN0XCIpO1xuICAgIH1cblxuICAgIHZhciBlcnJvcnMgPSBcIlwiO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIGNoaWxkcmVuID0gW2NoaWxkcmVuXTtcbiAgICB9XG4gICAgXG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYoIWlzRWxlbWVudFR5cGUoY2hpbGQsIFwibGlcIikpIHtcbiAgICAgICAgZXJyb3JzICs9IFwiXFxyXFxuRm91bmQgXCIgKyBnZXRFbGVtZW50VHlwZShjaGlsZCkgKyBcIiBlbGVtZW50IGluIE1vcmVMaXN0LiBBbGwgZWxlbWVudHMgc2hvdWxkIGJlICdsaSdcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKGVycm9ycyAhPT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGl0ZW1zU2hvd246IHRoaXMucHJvcHMuaW5pdGlhbFNpemUgfTtcbiAgfSxcbiAgaW5jcmVhc2VJdGVtc1Nob3duOiBmdW5jdGlvbihldmVudCwgaW5jcmVtZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXRlbXNTaG93bjogdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgaW5jcmVtZW50fSk7XG5cbiAgICAvL3N1cHBvc2VkbHkgUmVhY3Qgd3JhcHMgdGhlIGV2ZW50LCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGJlIGhhcHBlbmluZ1xuICAgIC8vc28gd2UgbmVlZCBib3RoIG9mIHRoZXNlIGhlcmUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHByb3BUeXBlczoge1xuICAgIGluaXRpYWxTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG1vcmVTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHRvbGVyYW5jZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBhbGxvd1Nob3dBbGw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHNob3dDb3VudDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdGlhbFNpemU6IDQsXG4gICAgICBtb3JlU2l6ZTogMjAsXG4gICAgICB0b2xlcmFuY2U6IDEsXG4gICAgICBhbGxvd1Nob3dBbGw6IGZhbHNlLFxuICAgICAgc2hvd0NvdW50OiB0cnVlXG4gICAgfTtcbiAgfSxcbiAgYWRkTW9yZUNvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuICAgIGlmKGNoaWxkcmVuLmxlbmd0aCA8PSB0aGlzLnN0YXRlLml0ZW1zU2hvd24gKyB0aGlzLnByb3BzLnRvbGVyYW5jZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHJlbWFpbmluZyA9IGNoaWxkcmVuLmxlbmd0aCAtIHRoaXMuc3RhdGUuaXRlbXNTaG93bjtcblxuICAgIGlmKHRoaXMucHJvcHMubW9yZVNpemUgPT09IDApXG4gICAge1xuICAgICAgdmFyIGNvdW50ID0gdGhpcy5wcm9wcy5zaG93Q291bnQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm1sLWNvdW50IG1sLW1vcmUtY291bnRcIn0sIHJlbWFpbmluZykgOiBudWxsO1xuICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtbW9yZVwiLCBvbk1vdXNlRG93bjogdGhpcy5pbmNyZWFzZUl0ZW1zU2hvd24uYmluZCh0aGlzLCBldmVudCwgcmVtYWluaW5nKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgICB9XG5cbiAgICB2YXIgdG9BZGQgPSByZW1haW5pbmcgPD0gdGhpcy5wcm9wcy5tb3JlU2l6ZSA/IHJlbWFpbmluZyA6IHRoaXMucHJvcHMubW9yZVNpemU7XG5cbiAgICB2YXIgZGlzcGxheWVkQ291bnQgPSB0aGlzLnByb3BzLmFsbG93U2hvd0FsbCA/IHRvQWRkIDogcmVtYWluaW5nO1xuICAgIGRpc3BsYXllZENvdW50ICs9IHJlbWFpbmluZyA+IGRpc3BsYXllZENvdW50ID8gXCIrXCIgOiBcIlwiO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1tb3JlLWNvdW50XCJ9LCBkaXNwbGF5ZWRDb3VudCkgOiBudWxsO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibWwtbGlzdC1pdGVtIG1sLWV4cGFuZGVyIG1sLW1vcmVcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHRvQWRkKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgfSxcbiAgYWRkU2hvd0FsbENvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYoIXRoaXMucHJvcHMuYWxsb3dTaG93QWxsIHx8IHRoaXMucHJvcHMubW9yZVNpemUgPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgICBcbiAgICBpZihjaGlsZHJlbi5sZW5ndGggPD0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgdGhpcy5wcm9wcy5tb3JlU2l6ZSArIHRoaXMucHJvcHMudG9sZXJhbmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcmVtYWluaW5nID0gY2hpbGRyZW4ubGVuZ3RoIC0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1zaG93LWFsbC1jb3VudFwifSwgcmVtYWluaW5nKSA6IG51bGw7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtc2hvdy1hbGxcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHJlbWFpbmluZyl9LCBcIlNob3cgQWxsLi4uIFwiLCBjb3VudCkpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKClcbiAge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgfVxuXG4gICAgdmFyIHNob3duSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIHNob3duSXRlbUNvdW50ICs9IHNob3duSXRlbUNvdW50ICsgdGhpcy5wcm9wcy50b2xlcmFuY2UgPj0gY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5wcm9wcy50b2xlcmFuY2UgOiAwO1xuXG4gICAgdmFyIGxpc3RJdGVtcyA9IGNoaWxkcmVuLnNsaWNlKDAsIHNob3duSXRlbUNvdW50KS5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJtbC1saXN0LWl0ZW0gbWwtZGF0YVwiXG5cbiAgICAgIGlmKGNoaWxkLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgKyBcIiBcIiArIGNoaWxkLnByb3BzLmNsYXNzTmFtZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZX0pXG4gICAgfSk7XG5cbiAgICBsaXN0SXRlbXMucHVzaCh0aGlzLmFkZE1vcmVDb21wb25lbnQoKSk7XG4gICAgbGlzdEl0ZW1zLnB1c2godGhpcy5hZGRTaG93QWxsQ29tcG9uZW50KCkpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcIm1sLWxpc3RcIn0sIFxuICAgICAgICBsaXN0SXRlbXNcbiAgICAgIClcbiAgICApXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vcmVMaXN0OyIsImV4cG9ydHMuQVUgPSBbXG5cdHsgdmFsdWU6ICdhdXN0cmFsaWFuLWNhcGl0YWwtdGVycml0b3J5JywgbGFiZWw6ICdBdXN0cmFsaWFuIENhcGl0YWwgVGVycml0b3J5JyB9LFxuXHR7IHZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJywgbGFiZWw6ICdOZXcgU291dGggV2FsZXMnIH0sXG5cdHsgdmFsdWU6ICd2aWN0b3JpYScsIGxhYmVsOiAnVmljdG9yaWEnIH0sXG5cdHsgdmFsdWU6ICdxdWVlbnNsYW5kJywgbGFiZWw6ICdRdWVlbnNsYW5kJyB9LFxuXHR7IHZhbHVlOiAnd2VzdGVybi1hdXN0cmFsaWEnLCBsYWJlbDogJ1dlc3Rlcm4gQXVzdHJhbGlhJyB9LFxuXHR7IHZhbHVlOiAnc291dGgtYXVzdHJhbGlhJywgbGFiZWw6ICdTb3V0aCBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScgfVxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIl19
