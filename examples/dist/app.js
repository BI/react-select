require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./examples/src/app.js":[function(require,module,exports){
var React = require('react'),
  Select = require('react-select');
  AccessibleSelect = Select.accessible;

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
  getDefaultProps: function () {
    return {
      searchable: true,
      label: 'States:',
    };
  },

  getInitialState: function() {
    return {
      country: 'AU',
      selectValue: 'new-south-wales'
    };
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
        React.createElement("label", null, this.props.label), 
        React.createElement(Select, {options: ops, value: this.state.selectValue, onChange: this.updateValue, searchable: this.props.searchable}), 
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


var MultiSelectField = React.createClass({displayName: "MultiSelectField",
  render: function() {
    var ops = [
      { label: 'Chocolate', value: 'chocolate' },
      { label: 'Vanilla', value: 'vanilla' },
      { label: 'Strawberry', value: 'strawberry' },
      { label: 'Caramel', value: 'caramel' },
      { label: 'Cookies and Cream', value: 'cookiescream' },
      { label: 'Peppermint', value: 'peppermint' }
    ];
    return React.createElement("div", null, 
      React.createElement("label", null, this.props.label), 
      React.createElement(Select, {multi: true, placeholder: "Select your favourite(s)", options: ops, onChange: logChange})
    );
  }
});

var AccessibleSelectField = React.createClass({displayName: "AccessibleSelectField",
  render: function() {
    var ops = [
      { label: 'Chocolate', value: 'chocolate' },
      { label: 'Vanilla', value: 'vanilla' },
      { label: 'Strawberry', value: 'strawberry' }
    ];
    return React.createElement("div", null, 
      React.createElement("label", null, this.props.label), 
      React.createElement(AccessibleSelect, {multi: true, placeholder: "Select...", options: ops, className: "accessible-example"})
    );
  }
});

React.render(
  React.createElement("div", null, 
    React.createElement(StatesField, null), 
    React.createElement(StatesField, {label: "States (non-searchable):", searchable: false}), 
    React.createElement(MultiSelectField, {label: "Multiselect:"}), 
    React.createElement(RemoteSelectField, {label: "Remote Options:"}), 
    React.createElement(AccessibleSelectField, {label: "Accessible Example"})
  ),
  document.getElementById('example')
);
},{"./data/states":"/Users/andrewblowe/Projects/usaid/react-select/examples/src/data/states.js","react":false,"react-select":false}],"/Users/andrewblowe/Projects/usaid/react-select/examples/src/data/states.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiZXhhbXBsZXMvc3JjL2RhdGEvc3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuICBTZWxlY3QgPSByZXF1aXJlKCdyZWFjdC1zZWxlY3QnKTtcbiAgQWNjZXNzaWJsZVNlbGVjdCA9IFNlbGVjdC5hY2Nlc3NpYmxlO1xuXG52YXIgU1RBVEVTID0gcmVxdWlyZSgnLi9kYXRhL3N0YXRlcycpO1xuXG5mdW5jdGlvbiBsb2dDaGFuZ2UodmFsdWUpIHtcbiAgY29uc29sZS5sb2coJ1NlbGVjdCB2YWx1ZSBjaGFuZ2VkOiAnICsgdmFsdWUpO1xufVxuXG52YXIgQ291bnRyeVNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb3VudHJ5U2VsZWN0XCIsXG4gIG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy52YWx1ZSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMudmFsdWUgPT09IHRoaXMucHJvcHMuc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICdsaW5rJztcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge29uQ2xpY2s6IHRoaXMub25DbGljaywgY2xhc3NOYW1lOiBjbGFzc05hbWV9LCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgfVxufSk7XG4gXG52YXIgU3RhdGVzRmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU3RhdGVzRmllbGRcIixcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICBsYWJlbDogJ1N0YXRlczonLFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnRyeTogJ0FVJyxcbiAgICAgIHNlbGVjdFZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJ1xuICAgIH07XG4gIH0sXG4gIHN3aXRjaENvdW50cnk6IGZ1bmN0aW9uKG5ld0NvdW50cnkpIHtcbiAgICBjb25zb2xlLmxvZygnQ291bnRyeSBjaGFuZ2VkIHRvICcgKyBuZXdDb3VudHJ5KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvdW50cnk6IG5ld0NvdW50cnksXG4gICAgICBzZWxlY3RWYWx1ZTogbnVsbFxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICBsb2dDaGFuZ2UoJ1N0YXRlIGNoYW5nZWQgdG8gJyArIG5ld1ZhbHVlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdFZhbHVlOiBuZXdWYWx1ZSB8fCBudWxsXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wcyA9IFNUQVRFU1t0aGlzLnN0YXRlLmNvdW50cnldO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5sYWJlbCksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge29wdGlvbnM6IG9wcywgdmFsdWU6IHRoaXMuc3RhdGUuc2VsZWN0VmFsdWUsIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlLCBzZWFyY2hhYmxlOiB0aGlzLnByb3BzLnNlYXJjaGFibGV9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzd2l0Y2hlclwifSwgXG4gICAgICAgICAgXCJDb3VudHJ5OlwiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvdW50cnlTZWxlY3QsIHt2YWx1ZTogXCJBVVwiLCBzZWxlY3RlZDogdGhpcy5zdGF0ZS5jb3VudHJ5LCBvblNlbGVjdDogdGhpcy5zd2l0Y2hDb3VudHJ5fSwgXCJBdXN0cmFsaWFcIiksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ291bnRyeVNlbGVjdCwge3ZhbHVlOiBcIlVTXCIsIHNlbGVjdGVkOiB0aGlzLnN0YXRlLmNvdW50cnksIG9uU2VsZWN0OiB0aGlzLnN3aXRjaENvdW50cnl9LCBcIlVTXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcbiBcbnZhciBSZW1vdGVTZWxlY3RGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJSZW1vdGVTZWxlY3RGaWVsZFwiLFxuICBsb2FkT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIGNhbGxiYWNrKSB7XG4gICAgXG4gICAgaW5wdXQgPSBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuICAgIFxuICAgIHZhciBydG4gPSB7XG4gICAgICBvcHRpb25zOiBbXG4gICAgICAgIHsgbGFiZWw6ICdPbmUnLCB2YWx1ZTogJ29uZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ1R3bycsIHZhbHVlOiAndHdvJyB9LFxuICAgICAgICB7IGxhYmVsOiAnVGhyZWUnLCB2YWx1ZTogJ3RocmVlJyB9XG4gICAgICBdLFxuICAgICAgY29tcGxldGU6IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGlmIChpbnB1dC5zbGljZSgwLDEpID09PSAnYScpIHtcbiAgICAgIGlmIChpbnB1dC5zbGljZSgwLDIpID09PSAnYWInKSB7XG4gICAgICAgIHJ0biA9IHtcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnQUInLCB2YWx1ZTogJ2FiJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0FCQycsIHZhbHVlOiAnYWJjJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0FCQ0QnLCB2YWx1ZTogJ2FiY2QnIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGNvbXBsZXRlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydG4gPSB7XG4gICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgeyBsYWJlbDogJ0EnLCB2YWx1ZTogJ2EnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQUEnLCB2YWx1ZTogJ2FhJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0FCJywgdmFsdWU6ICdhYicgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY29tcGxldGU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaW5wdXQubGVuZ3RoKSB7XG4gICAgICBydG4uY29tcGxldGUgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJ0bik7XG4gICAgfSwgNTAwKTtcbiAgICBcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCB0aGlzLnByb3BzLmxhYmVsKSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge2FzeW5jT3B0aW9uczogdGhpcy5sb2FkT3B0aW9ucywgY2xhc3NOYW1lOiBcInJlbW90ZS1leGFtcGxlXCJ9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5cbnZhciBNdWx0aVNlbGVjdEZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk11bHRpU2VsZWN0RmllbGRcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3BzID0gW1xuICAgICAgeyBsYWJlbDogJ0Nob2NvbGF0ZScsIHZhbHVlOiAnY2hvY29sYXRlJyB9LFxuICAgICAgeyBsYWJlbDogJ1ZhbmlsbGEnLCB2YWx1ZTogJ3ZhbmlsbGEnIH0sXG4gICAgICB7IGxhYmVsOiAnU3RyYXdiZXJyeScsIHZhbHVlOiAnc3RyYXdiZXJyeScgfSxcbiAgICAgIHsgbGFiZWw6ICdDYXJhbWVsJywgdmFsdWU6ICdjYXJhbWVsJyB9LFxuICAgICAgeyBsYWJlbDogJ0Nvb2tpZXMgYW5kIENyZWFtJywgdmFsdWU6ICdjb29raWVzY3JlYW0nIH0sXG4gICAgICB7IGxhYmVsOiAnUGVwcGVybWludCcsIHZhbHVlOiAncGVwcGVybWludCcgfVxuICAgIF07XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5sYWJlbCksIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHttdWx0aTogdHJ1ZSwgcGxhY2Vob2xkZXI6IFwiU2VsZWN0IHlvdXIgZmF2b3VyaXRlKHMpXCIsIG9wdGlvbnM6IG9wcywgb25DaGFuZ2U6IGxvZ0NoYW5nZX0pXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBBY2Nlc3NpYmxlU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQWNjZXNzaWJsZVNlbGVjdEZpZWxkXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wcyA9IFtcbiAgICAgIHsgbGFiZWw6ICdDaG9jb2xhdGUnLCB2YWx1ZTogJ2Nob2NvbGF0ZScgfSxcbiAgICAgIHsgbGFiZWw6ICdWYW5pbGxhJywgdmFsdWU6ICd2YW5pbGxhJyB9LFxuICAgICAgeyBsYWJlbDogJ1N0cmF3YmVycnknLCB2YWx1ZTogJ3N0cmF3YmVycnknIH1cbiAgICBdO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWNjZXNzaWJsZVNlbGVjdCwge211bHRpOiB0cnVlLCBwbGFjZWhvbGRlcjogXCJTZWxlY3QuLi5cIiwgb3B0aW9uczogb3BzLCBjbGFzc05hbWU6IFwiYWNjZXNzaWJsZS1leGFtcGxlXCJ9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdGF0ZXNGaWVsZCwgbnVsbCksIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3RhdGVzRmllbGQsIHtsYWJlbDogXCJTdGF0ZXMgKG5vbi1zZWFyY2hhYmxlKTpcIiwgc2VhcmNoYWJsZTogZmFsc2V9KSwgXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChNdWx0aVNlbGVjdEZpZWxkLCB7bGFiZWw6IFwiTXVsdGlzZWxlY3Q6XCJ9KSwgXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZW1vdGVTZWxlY3RGaWVsZCwge2xhYmVsOiBcIlJlbW90ZSBPcHRpb25zOlwifSksIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWNjZXNzaWJsZVNlbGVjdEZpZWxkLCB7bGFiZWw6IFwiQWNjZXNzaWJsZSBFeGFtcGxlXCJ9KVxuICApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhhbXBsZScpXG4pOyIsImV4cG9ydHMuQVUgPSBbXG5cdHsgdmFsdWU6ICdhdXN0cmFsaWFuLWNhcGl0YWwtdGVycml0b3J5JywgbGFiZWw6ICdBdXN0cmFsaWFuIENhcGl0YWwgVGVycml0b3J5JyB9LFxuXHR7IHZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJywgbGFiZWw6ICdOZXcgU291dGggV2FsZXMnIH0sXG5cdHsgdmFsdWU6ICd2aWN0b3JpYScsIGxhYmVsOiAnVmljdG9yaWEnIH0sXG5cdHsgdmFsdWU6ICdxdWVlbnNsYW5kJywgbGFiZWw6ICdRdWVlbnNsYW5kJyB9LFxuXHR7IHZhbHVlOiAnd2VzdGVybi1hdXN0cmFsaWEnLCBsYWJlbDogJ1dlc3Rlcm4gQXVzdHJhbGlhJyB9LFxuXHR7IHZhbHVlOiAnc291dGgtYXVzdHJhbGlhJywgbGFiZWw6ICdTb3V0aCBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScgfVxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIl19
