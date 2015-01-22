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

var CustomList = React.createClass({displayName: "CustomList",
	mixins: [Select.CustomMenuMixin],

  buildSections: function(itemMap) {
  	var sections = itemMap.map(this.buildSection, this);

  	return section;
  },
  buildSection: function(sectionItems, sectionTitle) {
  	var moreList = this.buildMoreList(sectionItems);

  	return (
  		React.createElement(Section, null, 
  			React.createElement(Heading, null, sectionTitle), 
  			React.createElement(Content, null, 
  				moreList
  			)
  		)
  	)
  },
  buildMoreList: function(moreListItems) {
		var listItems = moreListItems.map(this.buildListItem, this);

		return (
			React.createElement(MoreList, null, 
				listItems
			)
		)
  },
  buildListItem: function(listItem) {
			var className = this.props.focussedItem && this.props.focussedItem.value === listItem.value ? "is-focused" : null;

			var mouseDown = this.selectItem.bind(this, listItem);
			var mouseEnter = this.focusItem.bind(this, listItem);
			var mouseLeave = this.unfocusItem.bind(this, listItem);

			return React.createElement("li", {className: className, onMouseDown: mouseDown, onMouseEnter: mouseEnter, onMouseLeave: mouseLeave}, listItem.innerLabel)
  },
	render: function() {
		var sectionMap = {};
		
		var sections = sectionMap.map(buildSections, this);

		return (
			React.createElement(Accordion, null, 
				sections
			)
		)
	}
});

var MultiSelectField = React.createClass({displayName: "MultiSelectField",
	render: function() {
		var ops = [
			{ label: 'Ice Cream: Chocolate', value: 'ic_chocolate', innerLabel: 'Chocolate', category: 'Ice Cream'},
			{ label: 'Ice Cream: Vanilla', value: 'ic_vanilla', innerLabel: 'Vanilla', category: 'Ice Cream' },
			{ label: 'Ice Cream: Strawberry', value: 'ic_strawberry', innerLabel: 'Strawberry', category: 'Ice Cream' },
			{ label: 'Ice Cream: Caramel', value: 'ic_caramel', innerLabel: 'Caramel', category: 'Ice Cream' },
			{ label: 'Ice Cream: Cookies and Cream', value: 'ic_cookiescream', innerLabel: 'Cookies and Cream', category: 'Ice Cream' },
			{ label: 'Ice Cream: Peppermint', value: 'ic_peppermint', innerLabel: 'Peppermint', category: 'Ice Cream' },
			{ label: 'Ice Cream: Rocky Road', value: 'ic_rockyroad', innerLabel: 'Rocky Road', category: 'Ice Cream' },
			{ label: 'Ice Cream: Cookie Dough', value: 'ic_cookiedough', innerLabel: 'Cookie Dough', category: 'Ice Cream' },
			{ label: 'Cake: Vanilla', value: 'c_vanilla', innerLabel: 'Vanilla', category: 'Cake' },
			{ label: 'Cake: Chocolate', value: 'c_chocolate', innerLabel: 'Chocolate', category: 'Cake' },
			{ label: 'Cake: Funfetti', value: 'c_funfetti', innerLabel: 'Funfetti', category: 'Cake' },
			{ label: 'Cake: Marbled', value: 'c_marbled', innerLabel: 'Marbled', category: 'Cake' },
			{ label: 'Cake: Red Velvet', value: 'c_redvelvet', innerLabel: 'Red Velvet', category: 'Cake' },
			{ label: 'Cake: Devil\'s Food', value: 'c_devilsfood', innerLabel: 'Devil\'s Food', category: 'Cake' },
			{ label: 'Cake: Angel', value: 'c_angel', innerLabel: 'Angel', category: 'Cake' },
			{ label: 'Pie: Apple', value: 'p_apple', innerLabel: 'Apple', category: 'Pie' },
			{ label: 'Pie: Cherry', value: 'p_cherry', innerLabel: 'Cherry', category: 'Pie' },
			{ label: 'Pie: Chocolate', value: 'p_chocolate', innerLabel: 'Chocolate', category: 'Pie' },
			{ label: 'Pie: Pumpkin', value: 'p_pumpkin', innerLabel: 'Pumpkin', category: 'Pie' },
			{ label: 'Pie: Blueberry', value: 'p_blueberry', innerLabel: 'Blueberry', category: 'Pie' },
			{ label: 'Pie: Blackberry', value: 'p_blackberry', innerLabel: 'Blackberry', category: 'Pie' },
			{ label: 'Pie: Fruit', value: 'p_fruit', innerLabel: 'Fruit', category: 'Pie' },
			{ label: 'Pie: Banana Cream', value: 'p_bananacream', innerLabel: 'Banana Cream', category: 'Pie' },
			{ label: 'Pie: Lemon', value: 'p_lemon', innerLabel: 'Lemon', category: 'Pie' }
		];
		return React.createElement("div", null, 
			React.createElement("label", null, this.props.label), 
			React.createElement(Select, {multi: true, placeholder: "Select your favourite(s)", options: ops, onChange: logChange}, 
				React.createElement(CustomList, null)
			)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiLi4vcmVhY3QtbW9yZS1saXN0L21vcmUtbGlzdC5qc3giLCJleGFtcGxlcy9zcmMvZGF0YS9zdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFNlbGVjdCA9IHJlcXVpcmUoJ3JlYWN0LXNlbGVjdCcpLFxuXHRNb3JlTGlzdCA9IHJlcXVpcmUoJy4uLy4uLy4uL3JlYWN0LW1vcmUtbGlzdC9tb3JlLWxpc3QuanN4Jyk7XG5cbi8vcmVxdWlyZSgnLi9leHRlcm5hbC9tb3JlLWxpc3Qtc3R5bGVzLmNzcycpO1xuXG52YXIgU1RBVEVTID0gcmVxdWlyZSgnLi9kYXRhL3N0YXRlcycpO1xuXG5mdW5jdGlvbiBsb2dDaGFuZ2UodmFsdWUpIHtcblx0Y29uc29sZS5sb2coJ1NlbGVjdCB2YWx1ZSBjaGFuZ2VkOiAnICsgdmFsdWUpO1xufVxuXG52YXIgQ291bnRyeVNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb3VudHJ5U2VsZWN0XCIsXG5cdG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMudmFsdWUgPT09IHRoaXMucHJvcHMuc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICdsaW5rJztcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge29uQ2xpY2s6IHRoaXMub25DbGljaywgY2xhc3NOYW1lOiBjbGFzc05hbWV9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0fVxufSk7XG4gXG52YXIgU3RhdGVzRmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU3RhdGVzRmllbGRcIixcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y291bnRyeTogJ0FVJyxcblx0XHRcdHNlbGVjdFZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJ1xuXHRcdH1cblx0fSxcblx0c3dpdGNoQ291bnRyeTogZnVuY3Rpb24obmV3Q291bnRyeSkge1xuXHRcdGNvbnNvbGUubG9nKCdDb3VudHJ5IGNoYW5nZWQgdG8gJyArIG5ld0NvdW50cnkpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y291bnRyeTogbmV3Q291bnRyeSxcblx0XHRcdHNlbGVjdFZhbHVlOiBudWxsXG5cdFx0fSk7XG5cdH0sXG5cdHVwZGF0ZVZhbHVlOiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuXHRcdGxvZ0NoYW5nZSgnU3RhdGUgY2hhbmdlZCB0byAnICsgbmV3VmFsdWUpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0c2VsZWN0VmFsdWU6IG5ld1ZhbHVlIHx8IG51bGxcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3BzID0gU1RBVEVTW3RoaXMuc3RhdGUuY291bnRyeV07XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCBcIlN0YXRlczpcIiksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge29wdGlvbnM6IG9wcywgdmFsdWU6IHRoaXMuc3RhdGUuc2VsZWN0VmFsdWUsIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3dpdGNoZXJcIn0sIFxuXHRcdFx0XHRcdFwiQ291bnRyeTpcIiwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChDb3VudHJ5U2VsZWN0LCB7dmFsdWU6IFwiQVVcIiwgc2VsZWN0ZWQ6IHRoaXMuc3RhdGUuY291bnRyeSwgb25TZWxlY3Q6IHRoaXMuc3dpdGNoQ291bnRyeX0sIFwiQXVzdHJhbGlhXCIpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvdW50cnlTZWxlY3QsIHt2YWx1ZTogXCJVU1wiLCBzZWxlY3RlZDogdGhpcy5zdGF0ZS5jb3VudHJ5LCBvblNlbGVjdDogdGhpcy5zd2l0Y2hDb3VudHJ5fSwgXCJVU1wiKVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG4gXG52YXIgUmVtb3RlU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUmVtb3RlU2VsZWN0RmllbGRcIixcblx0bG9hZE9wdGlvbnM6IGZ1bmN0aW9uKGlucHV0LCBjYWxsYmFjaykge1xuXHRcdFxuXHRcdGlucHV0ID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcblx0XHRcblx0XHR2YXIgcnRuID0ge1xuXHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHR7IGxhYmVsOiAnT25lJywgdmFsdWU6ICdvbmUnIH0sXG5cdFx0XHRcdHsgbGFiZWw6ICdUd28nLCB2YWx1ZTogJ3R3bycgfSxcblx0XHRcdFx0eyBsYWJlbDogJ1RocmVlJywgdmFsdWU6ICd0aHJlZScgfVxuXHRcdFx0XSxcblx0XHRcdGNvbXBsZXRlOiB0cnVlXG5cdFx0fTtcblx0XHRcblx0XHRpZiAoaW5wdXQuc2xpY2UoMCwxKSA9PT0gJ2EnKSB7XG5cdFx0XHRpZiAoaW5wdXQuc2xpY2UoMCwyKSA9PT0gJ2FiJykge1xuXHRcdFx0XHRydG4gPSB7XG5cdFx0XHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0FCJywgdmFsdWU6ICdhYicgfSxcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQkMnLCB2YWx1ZTogJ2FiYycgfSxcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQkNEJywgdmFsdWU6ICdhYmNkJyB9XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRjb21wbGV0ZTogdHJ1ZVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cnRuID0ge1xuXHRcdFx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBJywgdmFsdWU6ICdhJyB9LFxuXHRcdFx0XHRcdFx0eyBsYWJlbDogJ0FBJywgdmFsdWU6ICdhYScgfSxcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQicsIHZhbHVlOiAnYWInIH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdGNvbXBsZXRlOiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIWlucHV0Lmxlbmd0aCkge1xuXHRcdFx0cnRuLmNvbXBsZXRlID0gZmFsc2U7XG5cdFx0fVxuXHRcdFxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRjYWxsYmFjayhudWxsLCBydG4pO1xuXHRcdH0sIDUwMCk7XG5cdFx0XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5sYWJlbCksIFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHthc3luY09wdGlvbnM6IHRoaXMubG9hZE9wdGlvbnMsIGNsYXNzTmFtZTogXCJyZW1vdGUtZXhhbXBsZVwifSlcblx0XHQpO1xuXHR9XG59KTtcblxudmFyIEN1c3RvbUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ3VzdG9tTGlzdFwiLFxuXHRtaXhpbnM6IFtTZWxlY3QuQ3VzdG9tTWVudU1peGluXSxcblxuICBidWlsZFNlY3Rpb25zOiBmdW5jdGlvbihpdGVtTWFwKSB7XG4gIFx0dmFyIHNlY3Rpb25zID0gaXRlbU1hcC5tYXAodGhpcy5idWlsZFNlY3Rpb24sIHRoaXMpO1xuXG4gIFx0cmV0dXJuIHNlY3Rpb247XG4gIH0sXG4gIGJ1aWxkU2VjdGlvbjogZnVuY3Rpb24oc2VjdGlvbkl0ZW1zLCBzZWN0aW9uVGl0bGUpIHtcbiAgXHR2YXIgbW9yZUxpc3QgPSB0aGlzLmJ1aWxkTW9yZUxpc3Qoc2VjdGlvbkl0ZW1zKTtcblxuICBcdHJldHVybiAoXG4gIFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNlY3Rpb24sIG51bGwsIFxuICBcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEhlYWRpbmcsIG51bGwsIHNlY3Rpb25UaXRsZSksIFxuICBcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRlbnQsIG51bGwsIFxuICBcdFx0XHRcdG1vcmVMaXN0XG4gIFx0XHRcdClcbiAgXHRcdClcbiAgXHQpXG4gIH0sXG4gIGJ1aWxkTW9yZUxpc3Q6IGZ1bmN0aW9uKG1vcmVMaXN0SXRlbXMpIHtcblx0XHR2YXIgbGlzdEl0ZW1zID0gbW9yZUxpc3RJdGVtcy5tYXAodGhpcy5idWlsZExpc3RJdGVtLCB0aGlzKTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KE1vcmVMaXN0LCBudWxsLCBcblx0XHRcdFx0bGlzdEl0ZW1zXG5cdFx0XHQpXG5cdFx0KVxuICB9LFxuICBidWlsZExpc3RJdGVtOiBmdW5jdGlvbihsaXN0SXRlbSkge1xuXHRcdFx0dmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuZm9jdXNzZWRJdGVtICYmIHRoaXMucHJvcHMuZm9jdXNzZWRJdGVtLnZhbHVlID09PSBsaXN0SXRlbS52YWx1ZSA/IFwiaXMtZm9jdXNlZFwiIDogbnVsbDtcblxuXHRcdFx0dmFyIG1vdXNlRG93biA9IHRoaXMuc2VsZWN0SXRlbS5iaW5kKHRoaXMsIGxpc3RJdGVtKTtcblx0XHRcdHZhciBtb3VzZUVudGVyID0gdGhpcy5mb2N1c0l0ZW0uYmluZCh0aGlzLCBsaXN0SXRlbSk7XG5cdFx0XHR2YXIgbW91c2VMZWF2ZSA9IHRoaXMudW5mb2N1c0l0ZW0uYmluZCh0aGlzLCBsaXN0SXRlbSk7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lLCBvbk1vdXNlRG93bjogbW91c2VEb3duLCBvbk1vdXNlRW50ZXI6IG1vdXNlRW50ZXIsIG9uTW91c2VMZWF2ZTogbW91c2VMZWF2ZX0sIGxpc3RJdGVtLmlubmVyTGFiZWwpXG4gIH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlY3Rpb25NYXAgPSB7fTtcblx0XHRcblx0XHR2YXIgc2VjdGlvbnMgPSBzZWN0aW9uTWFwLm1hcChidWlsZFNlY3Rpb25zLCB0aGlzKTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEFjY29yZGlvbiwgbnVsbCwgXG5cdFx0XHRcdHNlY3Rpb25zXG5cdFx0XHQpXG5cdFx0KVxuXHR9XG59KTtcblxudmFyIE11bHRpU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTXVsdGlTZWxlY3RGaWVsZFwiLFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvcHMgPSBbXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBDaG9jb2xhdGUnLCB2YWx1ZTogJ2ljX2Nob2NvbGF0ZScsIGlubmVyTGFiZWw6ICdDaG9jb2xhdGUnLCBjYXRlZ29yeTogJ0ljZSBDcmVhbSd9LFxuXHRcdFx0eyBsYWJlbDogJ0ljZSBDcmVhbTogVmFuaWxsYScsIHZhbHVlOiAnaWNfdmFuaWxsYScsIGlubmVyTGFiZWw6ICdWYW5pbGxhJywgY2F0ZWdvcnk6ICdJY2UgQ3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBTdHJhd2JlcnJ5JywgdmFsdWU6ICdpY19zdHJhd2JlcnJ5JywgaW5uZXJMYWJlbDogJ1N0cmF3YmVycnknLCBjYXRlZ29yeTogJ0ljZSBDcmVhbScgfSxcblx0XHRcdHsgbGFiZWw6ICdJY2UgQ3JlYW06IENhcmFtZWwnLCB2YWx1ZTogJ2ljX2NhcmFtZWwnLCBpbm5lckxhYmVsOiAnQ2FyYW1lbCcsIGNhdGVnb3J5OiAnSWNlIENyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0ljZSBDcmVhbTogQ29va2llcyBhbmQgQ3JlYW0nLCB2YWx1ZTogJ2ljX2Nvb2tpZXNjcmVhbScsIGlubmVyTGFiZWw6ICdDb29raWVzIGFuZCBDcmVhbScsIGNhdGVnb3J5OiAnSWNlIENyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0ljZSBDcmVhbTogUGVwcGVybWludCcsIHZhbHVlOiAnaWNfcGVwcGVybWludCcsIGlubmVyTGFiZWw6ICdQZXBwZXJtaW50JywgY2F0ZWdvcnk6ICdJY2UgQ3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBSb2NreSBSb2FkJywgdmFsdWU6ICdpY19yb2NreXJvYWQnLCBpbm5lckxhYmVsOiAnUm9ja3kgUm9hZCcsIGNhdGVnb3J5OiAnSWNlIENyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0ljZSBDcmVhbTogQ29va2llIERvdWdoJywgdmFsdWU6ICdpY19jb29raWVkb3VnaCcsIGlubmVyTGFiZWw6ICdDb29raWUgRG91Z2gnLCBjYXRlZ29yeTogJ0ljZSBDcmVhbScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBWYW5pbGxhJywgdmFsdWU6ICdjX3ZhbmlsbGEnLCBpbm5lckxhYmVsOiAnVmFuaWxsYScsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBDaG9jb2xhdGUnLCB2YWx1ZTogJ2NfY2hvY29sYXRlJywgaW5uZXJMYWJlbDogJ0Nob2NvbGF0ZScsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBGdW5mZXR0aScsIHZhbHVlOiAnY19mdW5mZXR0aScsIGlubmVyTGFiZWw6ICdGdW5mZXR0aScsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBNYXJibGVkJywgdmFsdWU6ICdjX21hcmJsZWQnLCBpbm5lckxhYmVsOiAnTWFyYmxlZCcsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBSZWQgVmVsdmV0JywgdmFsdWU6ICdjX3JlZHZlbHZldCcsIGlubmVyTGFiZWw6ICdSZWQgVmVsdmV0JywgY2F0ZWdvcnk6ICdDYWtlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IERldmlsXFwncyBGb29kJywgdmFsdWU6ICdjX2Rldmlsc2Zvb2QnLCBpbm5lckxhYmVsOiAnRGV2aWxcXCdzIEZvb2QnLCBjYXRlZ29yeTogJ0Nha2UnIH0sXG5cdFx0XHR7IGxhYmVsOiAnQ2FrZTogQW5nZWwnLCB2YWx1ZTogJ2NfYW5nZWwnLCBpbm5lckxhYmVsOiAnQW5nZWwnLCBjYXRlZ29yeTogJ0Nha2UnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBBcHBsZScsIHZhbHVlOiAncF9hcHBsZScsIGlubmVyTGFiZWw6ICdBcHBsZScsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogQ2hlcnJ5JywgdmFsdWU6ICdwX2NoZXJyeScsIGlubmVyTGFiZWw6ICdDaGVycnknLCBjYXRlZ29yeTogJ1BpZScgfSxcblx0XHRcdHsgbGFiZWw6ICdQaWU6IENob2NvbGF0ZScsIHZhbHVlOiAncF9jaG9jb2xhdGUnLCBpbm5lckxhYmVsOiAnQ2hvY29sYXRlJywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBQdW1wa2luJywgdmFsdWU6ICdwX3B1bXBraW4nLCBpbm5lckxhYmVsOiAnUHVtcGtpbicsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogQmx1ZWJlcnJ5JywgdmFsdWU6ICdwX2JsdWViZXJyeScsIGlubmVyTGFiZWw6ICdCbHVlYmVycnknLCBjYXRlZ29yeTogJ1BpZScgfSxcblx0XHRcdHsgbGFiZWw6ICdQaWU6IEJsYWNrYmVycnknLCB2YWx1ZTogJ3BfYmxhY2tiZXJyeScsIGlubmVyTGFiZWw6ICdCbGFja2JlcnJ5JywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBGcnVpdCcsIHZhbHVlOiAncF9mcnVpdCcsIGlubmVyTGFiZWw6ICdGcnVpdCcsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogQmFuYW5hIENyZWFtJywgdmFsdWU6ICdwX2JhbmFuYWNyZWFtJywgaW5uZXJMYWJlbDogJ0JhbmFuYSBDcmVhbScsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogTGVtb24nLCB2YWx1ZTogJ3BfbGVtb24nLCBpbm5lckxhYmVsOiAnTGVtb24nLCBjYXRlZ29yeTogJ1BpZScgfVxuXHRcdF07XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5sYWJlbCksIFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHttdWx0aTogdHJ1ZSwgcGxhY2Vob2xkZXI6IFwiU2VsZWN0IHlvdXIgZmF2b3VyaXRlKHMpXCIsIG9wdGlvbnM6IG9wcywgb25DaGFuZ2U6IGxvZ0NoYW5nZX0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEN1c3RvbUxpc3QsIG51bGwpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cblxuUmVhY3QucmVuZGVyKFxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3RhdGVzRmllbGQsIG51bGwpLCBcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KE11bHRpU2VsZWN0RmllbGQsIHtsYWJlbDogXCJNdWx0aXNlbGVjdDpcIn0pLCBcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFJlbW90ZVNlbGVjdEZpZWxkLCB7bGFiZWw6IFwiUmVtb3RlIE9wdGlvbnM6XCJ9KVxuXHQpLFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhhbXBsZScpXG4pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0L2FkZG9uc1wiKTtcblxuLyoqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIGlzRWxlbWVudFR5cGUoZWxlbWVudCwgZXhwZWN0ZWRUeXBlKSB7XG4gIHJldHVybiBnZXRFbGVtZW50VHlwZShlbGVtZW50KSA9PSBleHBlY3RlZFR5cGU7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRUeXBlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQudHlwZS5kaXNwbGF5TmFtZSB8fCBlbGVtZW50LnR5cGU7XG59XG5cbnZhciBNb3JlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNb3JlTGlzdFwiLFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMucHJvcHMuY2hpbGRyZW4gPT09IG51bGwgfHwgdGhpcy5wcm9wcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGVsZW1lbnRzIGZvdW5kIGluIE1vcmVMaXN0XCIpO1xuICAgIH1cblxuICAgIHZhciBlcnJvcnMgPSBcIlwiO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIGNoaWxkcmVuID0gW2NoaWxkcmVuXTtcbiAgICB9XG4gICAgXG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYoIWlzRWxlbWVudFR5cGUoY2hpbGQsIFwibGlcIikpIHtcbiAgICAgICAgZXJyb3JzICs9IFwiXFxyXFxuRm91bmQgXCIgKyBnZXRFbGVtZW50VHlwZShjaGlsZCkgKyBcIiBlbGVtZW50IGluIE1vcmVMaXN0LiBBbGwgZWxlbWVudHMgc2hvdWxkIGJlICdsaSdcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKGVycm9ycyAhPT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGl0ZW1zU2hvd246IHRoaXMucHJvcHMuaW5pdGlhbFNpemUgfTtcbiAgfSxcbiAgaW5jcmVhc2VJdGVtc1Nob3duOiBmdW5jdGlvbihldmVudCwgaW5jcmVtZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXRlbXNTaG93bjogdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgaW5jcmVtZW50fSk7XG5cbiAgICAvL3N1cHBvc2VkbHkgUmVhY3Qgd3JhcHMgdGhlIGV2ZW50LCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGJlIGhhcHBlbmluZ1xuICAgIC8vc28gd2UgbmVlZCBib3RoIG9mIHRoZXNlIGhlcmUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHByb3BUeXBlczoge1xuICAgIGluaXRpYWxTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG1vcmVTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHRvbGVyYW5jZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBhbGxvd1Nob3dBbGw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHNob3dDb3VudDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdGlhbFNpemU6IDQsXG4gICAgICBtb3JlU2l6ZTogMjAsXG4gICAgICB0b2xlcmFuY2U6IDEsXG4gICAgICBhbGxvd1Nob3dBbGw6IGZhbHNlLFxuICAgICAgc2hvd0NvdW50OiB0cnVlXG4gICAgfTtcbiAgfSxcbiAgYWRkTW9yZUNvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuICAgIGlmKGNoaWxkcmVuLmxlbmd0aCA8PSB0aGlzLnN0YXRlLml0ZW1zU2hvd24gKyB0aGlzLnByb3BzLnRvbGVyYW5jZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHJlbWFpbmluZyA9IGNoaWxkcmVuLmxlbmd0aCAtIHRoaXMuc3RhdGUuaXRlbXNTaG93bjtcblxuICAgIGlmKHRoaXMucHJvcHMubW9yZVNpemUgPT09IDApXG4gICAge1xuICAgICAgdmFyIGNvdW50ID0gdGhpcy5wcm9wcy5zaG93Q291bnQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm1sLWNvdW50IG1sLW1vcmUtY291bnRcIn0sIHJlbWFpbmluZykgOiBudWxsO1xuICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtbW9yZVwiLCBvbk1vdXNlRG93bjogdGhpcy5pbmNyZWFzZUl0ZW1zU2hvd24uYmluZCh0aGlzLCBldmVudCwgcmVtYWluaW5nKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgICB9XG5cbiAgICB2YXIgdG9BZGQgPSByZW1haW5pbmcgPD0gdGhpcy5wcm9wcy5tb3JlU2l6ZSA/IHJlbWFpbmluZyA6IHRoaXMucHJvcHMubW9yZVNpemU7XG5cbiAgICB2YXIgZGlzcGxheWVkQ291bnQgPSB0aGlzLnByb3BzLmFsbG93U2hvd0FsbCA/IHRvQWRkIDogcmVtYWluaW5nO1xuICAgIGRpc3BsYXllZENvdW50ICs9IHJlbWFpbmluZyA+IGRpc3BsYXllZENvdW50ID8gXCIrXCIgOiBcIlwiO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1tb3JlLWNvdW50XCJ9LCBkaXNwbGF5ZWRDb3VudCkgOiBudWxsO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibWwtbGlzdC1pdGVtIG1sLWV4cGFuZGVyIG1sLW1vcmVcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHRvQWRkKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgfSxcbiAgYWRkU2hvd0FsbENvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYoIXRoaXMucHJvcHMuYWxsb3dTaG93QWxsIHx8IHRoaXMucHJvcHMubW9yZVNpemUgPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgICBcbiAgICBpZihjaGlsZHJlbi5sZW5ndGggPD0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgdGhpcy5wcm9wcy5tb3JlU2l6ZSArIHRoaXMucHJvcHMudG9sZXJhbmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcmVtYWluaW5nID0gY2hpbGRyZW4ubGVuZ3RoIC0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1zaG93LWFsbC1jb3VudFwifSwgcmVtYWluaW5nKSA6IG51bGw7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtc2hvdy1hbGxcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHJlbWFpbmluZyl9LCBcIlNob3cgQWxsLi4uIFwiLCBjb3VudCkpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKClcbiAge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgfVxuXG4gICAgdmFyIHNob3duSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIHNob3duSXRlbUNvdW50ICs9IHNob3duSXRlbUNvdW50ICsgdGhpcy5wcm9wcy50b2xlcmFuY2UgPj0gY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5wcm9wcy50b2xlcmFuY2UgOiAwO1xuXG4gICAgdmFyIGxpc3RJdGVtcyA9IGNoaWxkcmVuLnNsaWNlKDAsIHNob3duSXRlbUNvdW50KS5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJtbC1saXN0LWl0ZW0gbWwtZGF0YVwiXG5cbiAgICAgIGlmKGNoaWxkLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgKyBcIiBcIiArIGNoaWxkLnByb3BzLmNsYXNzTmFtZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZX0pXG4gICAgfSk7XG5cbiAgICBsaXN0SXRlbXMucHVzaCh0aGlzLmFkZE1vcmVDb21wb25lbnQoKSk7XG4gICAgbGlzdEl0ZW1zLnB1c2godGhpcy5hZGRTaG93QWxsQ29tcG9uZW50KCkpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcIm1sLWxpc3RcIn0sIFxuICAgICAgICBsaXN0SXRlbXNcbiAgICAgIClcbiAgICApXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vcmVMaXN0OyIsImV4cG9ydHMuQVUgPSBbXG5cdHsgdmFsdWU6ICdhdXN0cmFsaWFuLWNhcGl0YWwtdGVycml0b3J5JywgbGFiZWw6ICdBdXN0cmFsaWFuIENhcGl0YWwgVGVycml0b3J5JyB9LFxuXHR7IHZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJywgbGFiZWw6ICdOZXcgU291dGggV2FsZXMnIH0sXG5cdHsgdmFsdWU6ICd2aWN0b3JpYScsIGxhYmVsOiAnVmljdG9yaWEnIH0sXG5cdHsgdmFsdWU6ICdxdWVlbnNsYW5kJywgbGFiZWw6ICdRdWVlbnNsYW5kJyB9LFxuXHR7IHZhbHVlOiAnd2VzdGVybi1hdXN0cmFsaWEnLCBsYWJlbDogJ1dlc3Rlcm4gQXVzdHJhbGlhJyB9LFxuXHR7IHZhbHVlOiAnc291dGgtYXVzdHJhbGlhJywgbGFiZWw6ICdTb3V0aCBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScgfVxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIl19
