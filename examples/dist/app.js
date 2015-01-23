require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./examples/src/app.js":[function(require,module,exports){
var React = require('react'),
	Select = require('react-select'),
	MoreList = require('../../../react-more-list/more-list.jsx'),
	RxAcc = require('../../../react-accordion/accordion.jsx');

var Accordion = RxAcc.Accordion,
	Section = RxAcc.Section,
	Heading = RxAcc.Heading,
	Content = RxAcc.Content;

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
  	var sections = [];

  	for(var sectionTitle in itemMap)
  	{
  		var section = this.buildSection(itemMap[sectionTitle], sectionTitle);

  		sections.push(section)
  	}

  	return sections;
  },
  buildSection: function(sectionItems, sectionTitle) {
  	var moreList = this.buildMoreList(sectionItems);

  	return (
  		React.createElement(Section, null, 
  			React.createElement(Heading, null, sectionTitle, " (", sectionItems.length, ")"), 
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
		var itemMap = {};

		this.props.filtered.forEach(function(item) {
			if(itemMap[item.category] == undefined) {
				itemMap[item.category] = [];
			}

			itemMap[item.category].push(item);
		});

		var sections = this.buildSections(itemMap);

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

},{"../../../react-accordion/accordion.jsx":"/Users/stephensmith/Desktop/gitRepos/react-accordion/accordion.jsx","../../../react-more-list/more-list.jsx":"/Users/stephensmith/Desktop/gitRepos/react-more-list/more-list.jsx","./data/states":"/Users/stephensmith/Desktop/gitRepos/react-select/examples/src/data/states.js","react":false,"react-select":false}],"/Users/stephensmith/Desktop/gitRepos/react-accordion/accordion.jsx":[function(require,module,exports){
var React = require('react');

function isElementType(element, expectedType) {
  return getElementType(element) == expectedType;
}

function getElementType(element) {
  return element.type.displayName;
}

var ONE_OR_NONE = 0;
var ALWAYS_ONE = 1;
var MULTIPLE = 2;

var Accordion = React.createClass({displayName: "Accordion",
  propTypes: {
    expandMode: React.PropTypes.number,
    expandedSection: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      expandMode: ALWAYS_ONE,
      expandedSection: 0
    };
  },
  getInitialState: function() {
    expanded = {};
    expanded[this.props.expandedSection] = true;
    return { expanded: expanded };
  },
  expandSections: function(expandedSectionId, isExpanded) {
    var expanded = this.state.expanded;
    var expandMode = this.props.expandMode;

    if(expandMode === ALWAYS_ONE || expandMode === ONE_OR_NONE) {
      expanded = {};
    }

    expanded[expandedSectionId] = isExpanded;

    this.setState({ expanded: expanded });
    
    //supposedly React wraps the event, but it doesn't seem to be happening
    //so we need both of these here.
    event.stopPropagation();
    event.preventDefault();
    return false;
  },
  componentWillMount: function() {
    if(this.props.children === null || this.props.children.length === 0) {
      throw new Error("No elements found in Accordion");
    }

    var errors = "";

    var children = this.props.children;

    if(children.constructor !== Array) {
      children = [children];
    }
    
    children.forEach(function(child) {
      if(!isElementType(child, "Section")) {
        errors += "Found " + getElementType(child) + " element in Accordion. All elements should be 'Section'\r\n";
      }
    });

    if(errors !== "") {
      throw new Error(errors);
    }
  },
  render: function() {
    var children = this.props.children;

    if(children.constructor !== Array) {
      children = [children];
    }

    var sections = children.map(function (section, id) {
      return (
        React.createElement(Section, {clickHandler: this.expandSections, id: id, expanded: this.state.expanded[id], expandMode: this.props.expandMode}, 
        	section.props.children
        )
      );
    }, this);
    
    return (
      React.createElement("div", {className: "accordion"}, 
      	sections
      )
    );
  }
});

var Section = React.createClass({displayName: "Section",
  componentWillMount: function() {
    var errors = "";

    var id = this.props.id;

    if(this.props.children == null || this.props.children.constructor !== Array) {
      throw new Error("Too few elements in Section " + id + ". Expected 2: 'Heading' followed by 'Content'");
    }
    else if(this.props.children.length > 2) {
      throw new Error("Too many elements (" + this.props.children.length + ") in Section " + id + ". Expected 2: 'Heading' followed by 'Content'");
    }

    var expectedHeading = this.props.children[0];
    var expectedContent = this.props.children[1];

    if(!isElementType(expectedHeading, "Heading")) {
      errors += "First element in Section " + id + " was type " + getElementType(expectedHeading) + ", expected 'Heading'\r\n";
    }

    if(!isElementType(expectedContent, "Content")) {
      errors += "Second element in Section " + id + " was type " + getElementType(expectedContent) + ", expected 'Content'\r\n";
    }

    if(errors != "") {
      throw new Error(errors);
    }
  },
  render: function() {
  	var heading = this.props.children[0];
    var content = this.props.children[1];

    return (
      React.createElement("div", {className: "accordion-section"}, 
        React.createElement(Heading, {clickHandler: this.props.clickHandler, id: this.props.id, expanded: this.props.expanded, expandMode: this.props.expandMode}, heading.props.children), 
         this.props.expanded ? content : null
      )
    )
  
}
});

var Heading = React.createClass({displayName: "Heading",
  headingClicked: function () {
    var expanded = this.props.expanded;
    var id = this.props.id;
    var expandMode = this.props.expandMode;

    if(!expanded) {
      this.props.clickHandler(id, true);
      return;
    }
    
    if(expandMode == ALWAYS_ONE) {
      return;
    }

    this.props.clickHandler(id, false);
  },
  render: function() {
    return (
      React.createElement("div", {className: "accordion-heading", onMouseDown: this.headingClicked}, this.props.children)
    )
  }
});

var Content = React.createClass({displayName: "Content",
  render: function() {
    return (
      React.createElement("div", {className: "accordion-content"}, this.props.children)
    )
  }
});

module.exports.Accordion = Accordion;
module.exports.Section = Section;
module.exports.Heading = Heading;
module.exports.Content = Content;

module.exports.ONE_OR_NONE = ONE_OR_NONE;
module.exports.ALWAYS_ONE = ALWAYS_ONE;
module.exports.MULTIPLE = MULTIPLE;
},{"react":false}],"/Users/stephensmith/Desktop/gitRepos/react-more-list/more-list.jsx":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiLi4vcmVhY3QtYWNjb3JkaW9uL2FjY29yZGlvbi5qc3giLCIuLi9yZWFjdC1tb3JlLWxpc3QvbW9yZS1saXN0LmpzeCIsImV4YW1wbGVzL3NyYy9kYXRhL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0U2VsZWN0ID0gcmVxdWlyZSgncmVhY3Qtc2VsZWN0JyksXG5cdE1vcmVMaXN0ID0gcmVxdWlyZSgnLi4vLi4vLi4vcmVhY3QtbW9yZS1saXN0L21vcmUtbGlzdC5qc3gnKSxcblx0UnhBY2MgPSByZXF1aXJlKCcuLi8uLi8uLi9yZWFjdC1hY2NvcmRpb24vYWNjb3JkaW9uLmpzeCcpO1xuXG52YXIgQWNjb3JkaW9uID0gUnhBY2MuQWNjb3JkaW9uLFxuXHRTZWN0aW9uID0gUnhBY2MuU2VjdGlvbixcblx0SGVhZGluZyA9IFJ4QWNjLkhlYWRpbmcsXG5cdENvbnRlbnQgPSBSeEFjYy5Db250ZW50O1xuXG4vL3JlcXVpcmUoJy4vZXh0ZXJuYWwvbW9yZS1saXN0LXN0eWxlcy5jc3MnKTtcblxudmFyIFNUQVRFUyA9IHJlcXVpcmUoJy4vZGF0YS9zdGF0ZXMnKTtcblxuZnVuY3Rpb24gbG9nQ2hhbmdlKHZhbHVlKSB7XG5cdGNvbnNvbGUubG9nKCdTZWxlY3QgdmFsdWUgY2hhbmdlZDogJyArIHZhbHVlKTtcbn1cblxudmFyIENvdW50cnlTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ291bnRyeVNlbGVjdFwiLFxuXHRvbkNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnByb3BzLm9uU2VsZWN0KHRoaXMucHJvcHMudmFsdWUpO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSB0aGlzLnByb3BzLnZhbHVlID09PSB0aGlzLnByb3BzLnNlbGVjdGVkID8gJ2FjdGl2ZScgOiAnbGluayc7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtvbkNsaWNrOiB0aGlzLm9uQ2xpY2ssIGNsYXNzTmFtZTogY2xhc3NOYW1lfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdH1cbn0pO1xuIFxudmFyIFN0YXRlc0ZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlN0YXRlc0ZpZWxkXCIsXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvdW50cnk6ICdBVScsXG5cdFx0XHRzZWxlY3RWYWx1ZTogJ25ldy1zb3V0aC13YWxlcydcblx0XHR9XG5cdH0sXG5cdHN3aXRjaENvdW50cnk6IGZ1bmN0aW9uKG5ld0NvdW50cnkpIHtcblx0XHRjb25zb2xlLmxvZygnQ291bnRyeSBjaGFuZ2VkIHRvICcgKyBuZXdDb3VudHJ5KTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGNvdW50cnk6IG5ld0NvdW50cnksXG5cdFx0XHRzZWxlY3RWYWx1ZTogbnVsbFxuXHRcdH0pO1xuXHR9LFxuXHR1cGRhdGVWYWx1ZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcblx0XHRsb2dDaGFuZ2UoJ1N0YXRlIGNoYW5nZWQgdG8gJyArIG5ld1ZhbHVlKTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdFZhbHVlOiBuZXdWYWx1ZSB8fCBudWxsXG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wcyA9IFNUQVRFU1t0aGlzLnN0YXRlLmNvdW50cnldO1xuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgXCJTdGF0ZXM6XCIpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHtvcHRpb25zOiBvcHMsIHZhbHVlOiB0aGlzLnN0YXRlLnNlbGVjdFZhbHVlLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN3aXRjaGVyXCJ9LCBcblx0XHRcdFx0XHRcIkNvdW50cnk6XCIsIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ291bnRyeVNlbGVjdCwge3ZhbHVlOiBcIkFVXCIsIHNlbGVjdGVkOiB0aGlzLnN0YXRlLmNvdW50cnksIG9uU2VsZWN0OiB0aGlzLnN3aXRjaENvdW50cnl9LCBcIkF1c3RyYWxpYVwiKSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChDb3VudHJ5U2VsZWN0LCB7dmFsdWU6IFwiVVNcIiwgc2VsZWN0ZWQ6IHRoaXMuc3RhdGUuY291bnRyeSwgb25TZWxlY3Q6IHRoaXMuc3dpdGNoQ291bnRyeX0sIFwiVVNcIilcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuIFxudmFyIFJlbW90ZVNlbGVjdEZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJlbW90ZVNlbGVjdEZpZWxkXCIsXG5cdGxvYWRPcHRpb25zOiBmdW5jdGlvbihpbnB1dCwgY2FsbGJhY2spIHtcblx0XHRcblx0XHRpbnB1dCA9IGlucHV0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XG5cdFx0dmFyIHJ0biA9IHtcblx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0eyBsYWJlbDogJ09uZScsIHZhbHVlOiAnb25lJyB9LFxuXHRcdFx0XHR7IGxhYmVsOiAnVHdvJywgdmFsdWU6ICd0d28nIH0sXG5cdFx0XHRcdHsgbGFiZWw6ICdUaHJlZScsIHZhbHVlOiAndGhyZWUnIH1cblx0XHRcdF0sXG5cdFx0XHRjb21wbGV0ZTogdHJ1ZVxuXHRcdH07XG5cdFx0XG5cdFx0aWYgKGlucHV0LnNsaWNlKDAsMSkgPT09ICdhJykge1xuXHRcdFx0aWYgKGlucHV0LnNsaWNlKDAsMikgPT09ICdhYicpIHtcblx0XHRcdFx0cnRuID0ge1xuXHRcdFx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQicsIHZhbHVlOiAnYWInIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUJDJywgdmFsdWU6ICdhYmMnIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUJDRCcsIHZhbHVlOiAnYWJjZCcgfVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0Y29tcGxldGU6IHRydWVcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ0biA9IHtcblx0XHRcdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQScsIHZhbHVlOiAnYScgfSxcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQScsIHZhbHVlOiAnYWEnIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUInLCB2YWx1ZTogJ2FiJyB9XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRjb21wbGV0ZTogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFpbnB1dC5sZW5ndGgpIHtcblx0XHRcdHJ0bi5jb21wbGV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0XHRcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FsbGJhY2sobnVsbCwgcnRuKTtcblx0XHR9LCA1MDApO1xuXHRcdFxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7YXN5bmNPcHRpb25zOiB0aGlzLmxvYWRPcHRpb25zLCBjbGFzc05hbWU6IFwicmVtb3RlLWV4YW1wbGVcIn0pXG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBDdXN0b21MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkN1c3RvbUxpc3RcIixcblx0bWl4aW5zOiBbU2VsZWN0LkN1c3RvbU1lbnVNaXhpbl0sXG5cbiAgYnVpbGRTZWN0aW9uczogZnVuY3Rpb24oaXRlbU1hcCkge1xuICBcdHZhciBzZWN0aW9ucyA9IFtdO1xuXG4gIFx0Zm9yKHZhciBzZWN0aW9uVGl0bGUgaW4gaXRlbU1hcClcbiAgXHR7XG4gIFx0XHR2YXIgc2VjdGlvbiA9IHRoaXMuYnVpbGRTZWN0aW9uKGl0ZW1NYXBbc2VjdGlvblRpdGxlXSwgc2VjdGlvblRpdGxlKTtcblxuICBcdFx0c2VjdGlvbnMucHVzaChzZWN0aW9uKVxuICBcdH1cblxuICBcdHJldHVybiBzZWN0aW9ucztcbiAgfSxcbiAgYnVpbGRTZWN0aW9uOiBmdW5jdGlvbihzZWN0aW9uSXRlbXMsIHNlY3Rpb25UaXRsZSkge1xuICBcdHZhciBtb3JlTGlzdCA9IHRoaXMuYnVpbGRNb3JlTGlzdChzZWN0aW9uSXRlbXMpO1xuXG4gIFx0cmV0dXJuIChcbiAgXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VjdGlvbiwgbnVsbCwgXG4gIFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGVhZGluZywgbnVsbCwgc2VjdGlvblRpdGxlLCBcIiAoXCIsIHNlY3Rpb25JdGVtcy5sZW5ndGgsIFwiKVwiKSwgXG4gIFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udGVudCwgbnVsbCwgXG4gIFx0XHRcdFx0bW9yZUxpc3RcbiAgXHRcdFx0KVxuICBcdFx0KVxuICBcdClcbiAgfSxcbiAgYnVpbGRNb3JlTGlzdDogZnVuY3Rpb24obW9yZUxpc3RJdGVtcykge1xuXHRcdHZhciBsaXN0SXRlbXMgPSBtb3JlTGlzdEl0ZW1zLm1hcCh0aGlzLmJ1aWxkTGlzdEl0ZW0sIHRoaXMpO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9yZUxpc3QsIG51bGwsIFxuXHRcdFx0XHRsaXN0SXRlbXNcblx0XHRcdClcblx0XHQpXG4gIH0sXG4gIGJ1aWxkTGlzdEl0ZW06IGZ1bmN0aW9uKGxpc3RJdGVtKSB7XG5cdFx0XHR2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5mb2N1c3NlZEl0ZW0gJiYgdGhpcy5wcm9wcy5mb2N1c3NlZEl0ZW0udmFsdWUgPT09IGxpc3RJdGVtLnZhbHVlID8gXCJpcy1mb2N1c2VkXCIgOiBudWxsO1xuXG5cdFx0XHR2YXIgbW91c2VEb3duID0gdGhpcy5zZWxlY3RJdGVtLmJpbmQodGhpcywgbGlzdEl0ZW0pO1xuXHRcdFx0dmFyIG1vdXNlRW50ZXIgPSB0aGlzLmZvY3VzSXRlbS5iaW5kKHRoaXMsIGxpc3RJdGVtKTtcblx0XHRcdHZhciBtb3VzZUxlYXZlID0gdGhpcy51bmZvY3VzSXRlbS5iaW5kKHRoaXMsIGxpc3RJdGVtKTtcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWUsIG9uTW91c2VEb3duOiBtb3VzZURvd24sIG9uTW91c2VFbnRlcjogbW91c2VFbnRlciwgb25Nb3VzZUxlYXZlOiBtb3VzZUxlYXZlfSwgbGlzdEl0ZW0uaW5uZXJMYWJlbClcbiAgfSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaXRlbU1hcCA9IHt9O1xuXG5cdFx0dGhpcy5wcm9wcy5maWx0ZXJlZC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGlmKGl0ZW1NYXBbaXRlbS5jYXRlZ29yeV0gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGl0ZW1NYXBbaXRlbS5jYXRlZ29yeV0gPSBbXTtcblx0XHRcdH1cblxuXHRcdFx0aXRlbU1hcFtpdGVtLmNhdGVnb3J5XS5wdXNoKGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0dmFyIHNlY3Rpb25zID0gdGhpcy5idWlsZFNlY3Rpb25zKGl0ZW1NYXApO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWNjb3JkaW9uLCBudWxsLCBcblx0XHRcdFx0c2VjdGlvbnNcblx0XHRcdClcblx0XHQpXG5cdH1cbn0pO1xuXG52YXIgTXVsdGlTZWxlY3RGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNdWx0aVNlbGVjdEZpZWxkXCIsXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wcyA9IFtcblx0XHRcdHsgbGFiZWw6ICdJY2UgQ3JlYW06IENob2NvbGF0ZScsIHZhbHVlOiAnaWNfY2hvY29sYXRlJywgaW5uZXJMYWJlbDogJ0Nob2NvbGF0ZScsIGNhdGVnb3J5OiAnSWNlIENyZWFtJ30sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBWYW5pbGxhJywgdmFsdWU6ICdpY192YW5pbGxhJywgaW5uZXJMYWJlbDogJ1ZhbmlsbGEnLCBjYXRlZ29yeTogJ0ljZSBDcmVhbScgfSxcblx0XHRcdHsgbGFiZWw6ICdJY2UgQ3JlYW06IFN0cmF3YmVycnknLCB2YWx1ZTogJ2ljX3N0cmF3YmVycnknLCBpbm5lckxhYmVsOiAnU3RyYXdiZXJyeScsIGNhdGVnb3J5OiAnSWNlIENyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0ljZSBDcmVhbTogQ2FyYW1lbCcsIHZhbHVlOiAnaWNfY2FyYW1lbCcsIGlubmVyTGFiZWw6ICdDYXJhbWVsJywgY2F0ZWdvcnk6ICdJY2UgQ3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBDb29raWVzIGFuZCBDcmVhbScsIHZhbHVlOiAnaWNfY29va2llc2NyZWFtJywgaW5uZXJMYWJlbDogJ0Nvb2tpZXMgYW5kIENyZWFtJywgY2F0ZWdvcnk6ICdJY2UgQ3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBQZXBwZXJtaW50JywgdmFsdWU6ICdpY19wZXBwZXJtaW50JywgaW5uZXJMYWJlbDogJ1BlcHBlcm1pbnQnLCBjYXRlZ29yeTogJ0ljZSBDcmVhbScgfSxcblx0XHRcdHsgbGFiZWw6ICdJY2UgQ3JlYW06IFJvY2t5IFJvYWQnLCB2YWx1ZTogJ2ljX3JvY2t5cm9hZCcsIGlubmVyTGFiZWw6ICdSb2NreSBSb2FkJywgY2F0ZWdvcnk6ICdJY2UgQ3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnSWNlIENyZWFtOiBDb29raWUgRG91Z2gnLCB2YWx1ZTogJ2ljX2Nvb2tpZWRvdWdoJywgaW5uZXJMYWJlbDogJ0Nvb2tpZSBEb3VnaCcsIGNhdGVnb3J5OiAnSWNlIENyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IFZhbmlsbGEnLCB2YWx1ZTogJ2NfdmFuaWxsYScsIGlubmVyTGFiZWw6ICdWYW5pbGxhJywgY2F0ZWdvcnk6ICdDYWtlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IENob2NvbGF0ZScsIHZhbHVlOiAnY19jaG9jb2xhdGUnLCBpbm5lckxhYmVsOiAnQ2hvY29sYXRlJywgY2F0ZWdvcnk6ICdDYWtlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IEZ1bmZldHRpJywgdmFsdWU6ICdjX2Z1bmZldHRpJywgaW5uZXJMYWJlbDogJ0Z1bmZldHRpJywgY2F0ZWdvcnk6ICdDYWtlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IE1hcmJsZWQnLCB2YWx1ZTogJ2NfbWFyYmxlZCcsIGlubmVyTGFiZWw6ICdNYXJibGVkJywgY2F0ZWdvcnk6ICdDYWtlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nha2U6IFJlZCBWZWx2ZXQnLCB2YWx1ZTogJ2NfcmVkdmVsdmV0JywgaW5uZXJMYWJlbDogJ1JlZCBWZWx2ZXQnLCBjYXRlZ29yeTogJ0Nha2UnIH0sXG5cdFx0XHR7IGxhYmVsOiAnQ2FrZTogRGV2aWxcXCdzIEZvb2QnLCB2YWx1ZTogJ2NfZGV2aWxzZm9vZCcsIGlubmVyTGFiZWw6ICdEZXZpbFxcJ3MgRm9vZCcsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYWtlOiBBbmdlbCcsIHZhbHVlOiAnY19hbmdlbCcsIGlubmVyTGFiZWw6ICdBbmdlbCcsIGNhdGVnb3J5OiAnQ2FrZScgfSxcblx0XHRcdHsgbGFiZWw6ICdQaWU6IEFwcGxlJywgdmFsdWU6ICdwX2FwcGxlJywgaW5uZXJMYWJlbDogJ0FwcGxlJywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBDaGVycnknLCB2YWx1ZTogJ3BfY2hlcnJ5JywgaW5uZXJMYWJlbDogJ0NoZXJyeScsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogQ2hvY29sYXRlJywgdmFsdWU6ICdwX2Nob2NvbGF0ZScsIGlubmVyTGFiZWw6ICdDaG9jb2xhdGUnLCBjYXRlZ29yeTogJ1BpZScgfSxcblx0XHRcdHsgbGFiZWw6ICdQaWU6IFB1bXBraW4nLCB2YWx1ZTogJ3BfcHVtcGtpbicsIGlubmVyTGFiZWw6ICdQdW1wa2luJywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBCbHVlYmVycnknLCB2YWx1ZTogJ3BfYmx1ZWJlcnJ5JywgaW5uZXJMYWJlbDogJ0JsdWViZXJyeScsIGNhdGVnb3J5OiAnUGllJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BpZTogQmxhY2tiZXJyeScsIHZhbHVlOiAncF9ibGFja2JlcnJ5JywgaW5uZXJMYWJlbDogJ0JsYWNrYmVycnknLCBjYXRlZ29yeTogJ1BpZScgfSxcblx0XHRcdHsgbGFiZWw6ICdQaWU6IEZydWl0JywgdmFsdWU6ICdwX2ZydWl0JywgaW5uZXJMYWJlbDogJ0ZydWl0JywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBCYW5hbmEgQ3JlYW0nLCB2YWx1ZTogJ3BfYmFuYW5hY3JlYW0nLCBpbm5lckxhYmVsOiAnQmFuYW5hIENyZWFtJywgY2F0ZWdvcnk6ICdQaWUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGllOiBMZW1vbicsIHZhbHVlOiAncF9sZW1vbicsIGlubmVyTGFiZWw6ICdMZW1vbicsIGNhdGVnb3J5OiAnUGllJyB9XG5cdFx0XTtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCB0aGlzLnByb3BzLmxhYmVsKSwgXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge211bHRpOiB0cnVlLCBwbGFjZWhvbGRlcjogXCJTZWxlY3QgeW91ciBmYXZvdXJpdGUocylcIiwgb3B0aW9uczogb3BzLCBvbkNoYW5nZTogbG9nQ2hhbmdlfSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ3VzdG9tTGlzdCwgbnVsbClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxuXG5SZWFjdC5yZW5kZXIoXG5cdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0UmVhY3QuY3JlYXRlRWxlbWVudChTdGF0ZXNGaWVsZCwgbnVsbCksIFxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXVsdGlTZWxlY3RGaWVsZCwge2xhYmVsOiBcIk11bHRpc2VsZWN0OlwifSksIFxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVtb3RlU2VsZWN0RmllbGQsIHtsYWJlbDogXCJSZW1vdGUgT3B0aW9uczpcIn0pXG5cdCksXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGFtcGxlJylcbik7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnRUeXBlKGVsZW1lbnQsIGV4cGVjdGVkVHlwZSkge1xuICByZXR1cm4gZ2V0RWxlbWVudFR5cGUoZWxlbWVudCkgPT0gZXhwZWN0ZWRUeXBlO1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50VHlwZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LnR5cGUuZGlzcGxheU5hbWU7XG59XG5cbnZhciBPTkVfT1JfTk9ORSA9IDA7XG52YXIgQUxXQVlTX09ORSA9IDE7XG52YXIgTVVMVElQTEUgPSAyO1xuXG52YXIgQWNjb3JkaW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkFjY29yZGlvblwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBleHBhbmRNb2RlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIGV4cGFuZGVkU2VjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBleHBhbmRNb2RlOiBBTFdBWVNfT05FLFxuICAgICAgZXhwYW5kZWRTZWN0aW9uOiAwXG4gICAgfTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICBleHBhbmRlZCA9IHt9O1xuICAgIGV4cGFuZGVkW3RoaXMucHJvcHMuZXhwYW5kZWRTZWN0aW9uXSA9IHRydWU7XG4gICAgcmV0dXJuIHsgZXhwYW5kZWQ6IGV4cGFuZGVkIH07XG4gIH0sXG4gIGV4cGFuZFNlY3Rpb25zOiBmdW5jdGlvbihleHBhbmRlZFNlY3Rpb25JZCwgaXNFeHBhbmRlZCkge1xuICAgIHZhciBleHBhbmRlZCA9IHRoaXMuc3RhdGUuZXhwYW5kZWQ7XG4gICAgdmFyIGV4cGFuZE1vZGUgPSB0aGlzLnByb3BzLmV4cGFuZE1vZGU7XG5cbiAgICBpZihleHBhbmRNb2RlID09PSBBTFdBWVNfT05FIHx8IGV4cGFuZE1vZGUgPT09IE9ORV9PUl9OT05FKSB7XG4gICAgICBleHBhbmRlZCA9IHt9O1xuICAgIH1cblxuICAgIGV4cGFuZGVkW2V4cGFuZGVkU2VjdGlvbklkXSA9IGlzRXhwYW5kZWQ7XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZXhwYW5kZWQ6IGV4cGFuZGVkIH0pO1xuICAgIFxuICAgIC8vc3VwcG9zZWRseSBSZWFjdCB3cmFwcyB0aGUgZXZlbnQsIGJ1dCBpdCBkb2Vzbid0IHNlZW0gdG8gYmUgaGFwcGVuaW5nXG4gICAgLy9zbyB3ZSBuZWVkIGJvdGggb2YgdGhlc2UgaGVyZS5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnByb3BzLmNoaWxkcmVuID09PSBudWxsIHx8IHRoaXMucHJvcHMuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBlbGVtZW50cyBmb3VuZCBpbiBBY2NvcmRpb25cIik7XG4gICAgfVxuXG4gICAgdmFyIGVycm9ycyA9IFwiXCI7XG5cbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXG4gICAgaWYoY2hpbGRyZW4uY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgfVxuICAgIFxuICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmKCFpc0VsZW1lbnRUeXBlKGNoaWxkLCBcIlNlY3Rpb25cIikpIHtcbiAgICAgICAgZXJyb3JzICs9IFwiRm91bmQgXCIgKyBnZXRFbGVtZW50VHlwZShjaGlsZCkgKyBcIiBlbGVtZW50IGluIEFjY29yZGlvbi4gQWxsIGVsZW1lbnRzIHNob3VsZCBiZSAnU2VjdGlvbidcXHJcXG5cIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKGVycm9ycyAhPT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIGNoaWxkcmVuID0gW2NoaWxkcmVuXTtcbiAgICB9XG5cbiAgICB2YXIgc2VjdGlvbnMgPSBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKHNlY3Rpb24sIGlkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlY3Rpb24sIHtjbGlja0hhbmRsZXI6IHRoaXMuZXhwYW5kU2VjdGlvbnMsIGlkOiBpZCwgZXhwYW5kZWQ6IHRoaXMuc3RhdGUuZXhwYW5kZWRbaWRdLCBleHBhbmRNb2RlOiB0aGlzLnByb3BzLmV4cGFuZE1vZGV9LCBcbiAgICAgICAgXHRzZWN0aW9uLnByb3BzLmNoaWxkcmVuXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJhY2NvcmRpb25cIn0sIFxuICAgICAgXHRzZWN0aW9uc1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgU2VjdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTZWN0aW9uXCIsXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVycm9ycyA9IFwiXCI7XG5cbiAgICB2YXIgaWQgPSB0aGlzLnByb3BzLmlkO1xuXG4gICAgaWYodGhpcy5wcm9wcy5jaGlsZHJlbiA9PSBudWxsIHx8IHRoaXMucHJvcHMuY2hpbGRyZW4uY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gZmV3IGVsZW1lbnRzIGluIFNlY3Rpb24gXCIgKyBpZCArIFwiLiBFeHBlY3RlZCAyOiAnSGVhZGluZycgZm9sbG93ZWQgYnkgJ0NvbnRlbnQnXCIpO1xuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMucHJvcHMuY2hpbGRyZW4ubGVuZ3RoID4gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnkgZWxlbWVudHMgKFwiICsgdGhpcy5wcm9wcy5jaGlsZHJlbi5sZW5ndGggKyBcIikgaW4gU2VjdGlvbiBcIiArIGlkICsgXCIuIEV4cGVjdGVkIDI6ICdIZWFkaW5nJyBmb2xsb3dlZCBieSAnQ29udGVudCdcIik7XG4gICAgfVxuXG4gICAgdmFyIGV4cGVjdGVkSGVhZGluZyA9IHRoaXMucHJvcHMuY2hpbGRyZW5bMF07XG4gICAgdmFyIGV4cGVjdGVkQ29udGVudCA9IHRoaXMucHJvcHMuY2hpbGRyZW5bMV07XG5cbiAgICBpZighaXNFbGVtZW50VHlwZShleHBlY3RlZEhlYWRpbmcsIFwiSGVhZGluZ1wiKSkge1xuICAgICAgZXJyb3JzICs9IFwiRmlyc3QgZWxlbWVudCBpbiBTZWN0aW9uIFwiICsgaWQgKyBcIiB3YXMgdHlwZSBcIiArIGdldEVsZW1lbnRUeXBlKGV4cGVjdGVkSGVhZGluZykgKyBcIiwgZXhwZWN0ZWQgJ0hlYWRpbmcnXFxyXFxuXCI7XG4gICAgfVxuXG4gICAgaWYoIWlzRWxlbWVudFR5cGUoZXhwZWN0ZWRDb250ZW50LCBcIkNvbnRlbnRcIikpIHtcbiAgICAgIGVycm9ycyArPSBcIlNlY29uZCBlbGVtZW50IGluIFNlY3Rpb24gXCIgKyBpZCArIFwiIHdhcyB0eXBlIFwiICsgZ2V0RWxlbWVudFR5cGUoZXhwZWN0ZWRDb250ZW50KSArIFwiLCBleHBlY3RlZCAnQ29udGVudCdcXHJcXG5cIjtcbiAgICB9XG5cbiAgICBpZihlcnJvcnMgIT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICBcdHZhciBoZWFkaW5nID0gdGhpcy5wcm9wcy5jaGlsZHJlblswXTtcbiAgICB2YXIgY29udGVudCA9IHRoaXMucHJvcHMuY2hpbGRyZW5bMV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImFjY29yZGlvbi1zZWN0aW9uXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIZWFkaW5nLCB7Y2xpY2tIYW5kbGVyOiB0aGlzLnByb3BzLmNsaWNrSGFuZGxlciwgaWQ6IHRoaXMucHJvcHMuaWQsIGV4cGFuZGVkOiB0aGlzLnByb3BzLmV4cGFuZGVkLCBleHBhbmRNb2RlOiB0aGlzLnByb3BzLmV4cGFuZE1vZGV9LCBoZWFkaW5nLnByb3BzLmNoaWxkcmVuKSwgXG4gICAgICAgICB0aGlzLnByb3BzLmV4cGFuZGVkID8gY29udGVudCA6IG51bGxcbiAgICAgIClcbiAgICApXG4gIFxufVxufSk7XG5cbnZhciBIZWFkaW5nID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhlYWRpbmdcIixcbiAgaGVhZGluZ0NsaWNrZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXhwYW5kZWQgPSB0aGlzLnByb3BzLmV4cGFuZGVkO1xuICAgIHZhciBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgdmFyIGV4cGFuZE1vZGUgPSB0aGlzLnByb3BzLmV4cGFuZE1vZGU7XG5cbiAgICBpZighZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyKGlkLCB0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYoZXhwYW5kTW9kZSA9PSBBTFdBWVNfT05FKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5jbGlja0hhbmRsZXIoaWQsIGZhbHNlKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImFjY29yZGlvbi1oZWFkaW5nXCIsIG9uTW91c2VEb3duOiB0aGlzLmhlYWRpbmdDbGlja2VkfSwgdGhpcy5wcm9wcy5jaGlsZHJlbilcbiAgICApXG4gIH1cbn0pO1xuXG52YXIgQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb250ZW50XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJhY2NvcmRpb24tY29udGVudFwifSwgdGhpcy5wcm9wcy5jaGlsZHJlbilcbiAgICApXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cy5BY2NvcmRpb24gPSBBY2NvcmRpb247XG5tb2R1bGUuZXhwb3J0cy5TZWN0aW9uID0gU2VjdGlvbjtcbm1vZHVsZS5leHBvcnRzLkhlYWRpbmcgPSBIZWFkaW5nO1xubW9kdWxlLmV4cG9ydHMuQ29udGVudCA9IENvbnRlbnQ7XG5cbm1vZHVsZS5leHBvcnRzLk9ORV9PUl9OT05FID0gT05FX09SX05PTkU7XG5tb2R1bGUuZXhwb3J0cy5BTFdBWVNfT05FID0gQUxXQVlTX09ORTtcbm1vZHVsZS5leHBvcnRzLk1VTFRJUExFID0gTVVMVElQTEU7IiwidmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0L2FkZG9uc1wiKTtcblxuLyoqKioqKioqKioqKiogSGVscGVyIEZ1bmN0aW9ucyAqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIGlzRWxlbWVudFR5cGUoZWxlbWVudCwgZXhwZWN0ZWRUeXBlKSB7XG4gIHJldHVybiBnZXRFbGVtZW50VHlwZShlbGVtZW50KSA9PSBleHBlY3RlZFR5cGU7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRUeXBlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQudHlwZS5kaXNwbGF5TmFtZSB8fCBlbGVtZW50LnR5cGU7XG59XG5cbnZhciBNb3JlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNb3JlTGlzdFwiLFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMucHJvcHMuY2hpbGRyZW4gPT09IG51bGwgfHwgdGhpcy5wcm9wcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGVsZW1lbnRzIGZvdW5kIGluIE1vcmVMaXN0XCIpO1xuICAgIH1cblxuICAgIHZhciBlcnJvcnMgPSBcIlwiO1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgIGNoaWxkcmVuID0gW2NoaWxkcmVuXTtcbiAgICB9XG4gICAgXG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYoIWlzRWxlbWVudFR5cGUoY2hpbGQsIFwibGlcIikpIHtcbiAgICAgICAgZXJyb3JzICs9IFwiXFxyXFxuRm91bmQgXCIgKyBnZXRFbGVtZW50VHlwZShjaGlsZCkgKyBcIiBlbGVtZW50IGluIE1vcmVMaXN0LiBBbGwgZWxlbWVudHMgc2hvdWxkIGJlICdsaSdcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKGVycm9ycyAhPT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGl0ZW1zU2hvd246IHRoaXMucHJvcHMuaW5pdGlhbFNpemUgfTtcbiAgfSxcbiAgaW5jcmVhc2VJdGVtc1Nob3duOiBmdW5jdGlvbihldmVudCwgaW5jcmVtZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXRlbXNTaG93bjogdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgaW5jcmVtZW50fSk7XG5cbiAgICAvL3N1cHBvc2VkbHkgUmVhY3Qgd3JhcHMgdGhlIGV2ZW50LCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGJlIGhhcHBlbmluZ1xuICAgIC8vc28gd2UgbmVlZCBib3RoIG9mIHRoZXNlIGhlcmUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHByb3BUeXBlczoge1xuICAgIGluaXRpYWxTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG1vcmVTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIHRvbGVyYW5jZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBhbGxvd1Nob3dBbGw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHNob3dDb3VudDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdGlhbFNpemU6IDQsXG4gICAgICBtb3JlU2l6ZTogMjAsXG4gICAgICB0b2xlcmFuY2U6IDEsXG4gICAgICBhbGxvd1Nob3dBbGw6IGZhbHNlLFxuICAgICAgc2hvd0NvdW50OiB0cnVlXG4gICAgfTtcbiAgfSxcbiAgYWRkTW9yZUNvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuICAgIGlmKGNoaWxkcmVuLmxlbmd0aCA8PSB0aGlzLnN0YXRlLml0ZW1zU2hvd24gKyB0aGlzLnByb3BzLnRvbGVyYW5jZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHJlbWFpbmluZyA9IGNoaWxkcmVuLmxlbmd0aCAtIHRoaXMuc3RhdGUuaXRlbXNTaG93bjtcblxuICAgIGlmKHRoaXMucHJvcHMubW9yZVNpemUgPT09IDApXG4gICAge1xuICAgICAgdmFyIGNvdW50ID0gdGhpcy5wcm9wcy5zaG93Q291bnQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcIm1sLWNvdW50IG1sLW1vcmUtY291bnRcIn0sIHJlbWFpbmluZykgOiBudWxsO1xuICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtbW9yZVwiLCBvbk1vdXNlRG93bjogdGhpcy5pbmNyZWFzZUl0ZW1zU2hvd24uYmluZCh0aGlzLCBldmVudCwgcmVtYWluaW5nKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgICB9XG5cbiAgICB2YXIgdG9BZGQgPSByZW1haW5pbmcgPD0gdGhpcy5wcm9wcy5tb3JlU2l6ZSA/IHJlbWFpbmluZyA6IHRoaXMucHJvcHMubW9yZVNpemU7XG5cbiAgICB2YXIgZGlzcGxheWVkQ291bnQgPSB0aGlzLnByb3BzLmFsbG93U2hvd0FsbCA/IHRvQWRkIDogcmVtYWluaW5nO1xuICAgIGRpc3BsYXllZENvdW50ICs9IHJlbWFpbmluZyA+IGRpc3BsYXllZENvdW50ID8gXCIrXCIgOiBcIlwiO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1tb3JlLWNvdW50XCJ9LCBkaXNwbGF5ZWRDb3VudCkgOiBudWxsO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibWwtbGlzdC1pdGVtIG1sLWV4cGFuZGVyIG1sLW1vcmVcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHRvQWRkKX0sIFwiTW9yZS4uLiBcIiwgY291bnQpKTtcbiAgfSxcbiAgYWRkU2hvd0FsbENvbXBvbmVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYoIXRoaXMucHJvcHMuYWxsb3dTaG93QWxsIHx8IHRoaXMucHJvcHMubW9yZVNpemUgPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgICBcbiAgICBpZihjaGlsZHJlbi5sZW5ndGggPD0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duICsgdGhpcy5wcm9wcy5tb3JlU2l6ZSArIHRoaXMucHJvcHMudG9sZXJhbmNlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcmVtYWluaW5nID0gY2hpbGRyZW4ubGVuZ3RoIC0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIFxuICAgIHZhciBjb3VudCA9IHRoaXMucHJvcHMuc2hvd0NvdW50ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJtbC1jb3VudCBtbC1zaG93LWFsbC1jb3VudFwifSwgcmVtYWluaW5nKSA6IG51bGw7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJtbC1saXN0LWl0ZW0gbWwtZXhwYW5kZXIgbWwtc2hvdy1hbGxcIiwgb25Nb3VzZURvd246IHRoaXMuaW5jcmVhc2VJdGVtc1Nob3duLmJpbmQodGhpcywgZXZlbnQsIHJlbWFpbmluZyl9LCBcIlNob3cgQWxsLi4uIFwiLCBjb3VudCkpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKClcbiAge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICBpZihjaGlsZHJlbi5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgfVxuXG4gICAgdmFyIHNob3duSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5pdGVtc1Nob3duO1xuICAgIHNob3duSXRlbUNvdW50ICs9IHNob3duSXRlbUNvdW50ICsgdGhpcy5wcm9wcy50b2xlcmFuY2UgPj0gY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5wcm9wcy50b2xlcmFuY2UgOiAwO1xuXG4gICAgdmFyIGxpc3RJdGVtcyA9IGNoaWxkcmVuLnNsaWNlKDAsIHNob3duSXRlbUNvdW50KS5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJtbC1saXN0LWl0ZW0gbWwtZGF0YVwiXG5cbiAgICAgIGlmKGNoaWxkLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgKyBcIiBcIiArIGNoaWxkLnByb3BzLmNsYXNzTmFtZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFJlYWN0LmFkZG9ucy5jbG9uZVdpdGhQcm9wcyhjaGlsZCwgeyBjbGFzc05hbWU6IGNsYXNzTmFtZX0pXG4gICAgfSk7XG5cbiAgICBsaXN0SXRlbXMucHVzaCh0aGlzLmFkZE1vcmVDb21wb25lbnQoKSk7XG4gICAgbGlzdEl0ZW1zLnB1c2godGhpcy5hZGRTaG93QWxsQ29tcG9uZW50KCkpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcIm1sLWxpc3RcIn0sIFxuICAgICAgICBsaXN0SXRlbXNcbiAgICAgIClcbiAgICApXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vcmVMaXN0OyIsImV4cG9ydHMuQVUgPSBbXG5cdHsgdmFsdWU6ICdhdXN0cmFsaWFuLWNhcGl0YWwtdGVycml0b3J5JywgbGFiZWw6ICdBdXN0cmFsaWFuIENhcGl0YWwgVGVycml0b3J5JyB9LFxuXHR7IHZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJywgbGFiZWw6ICdOZXcgU291dGggV2FsZXMnIH0sXG5cdHsgdmFsdWU6ICd2aWN0b3JpYScsIGxhYmVsOiAnVmljdG9yaWEnIH0sXG5cdHsgdmFsdWU6ICdxdWVlbnNsYW5kJywgbGFiZWw6ICdRdWVlbnNsYW5kJyB9LFxuXHR7IHZhbHVlOiAnd2VzdGVybi1hdXN0cmFsaWEnLCBsYWJlbDogJ1dlc3Rlcm4gQXVzdHJhbGlhJyB9LFxuXHR7IHZhbHVlOiAnc291dGgtYXVzdHJhbGlhJywgbGFiZWw6ICdTb3V0aCBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScgfVxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIl19
