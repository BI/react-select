require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./examples/src/app.js":[function(require,module,exports){
var React = require('react'),
  Select = require('react-select');

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

React.render(
  React.createElement("div", null, 
    React.createElement(StatesField, null), 
    React.createElement(StatesField, {label: "States (non-searchable):", searchable: false}), 
    React.createElement(MultiSelectField, {label: "Multiselect:"}), 
    React.createElement(RemoteSelectField, {label: "Remote Options:"})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiZXhhbXBsZXMvc3JjL2RhdGEvc3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcbiAgU2VsZWN0ID0gcmVxdWlyZSgncmVhY3Qtc2VsZWN0Jyk7XG5cbnZhciBTVEFURVMgPSByZXF1aXJlKCcuL2RhdGEvc3RhdGVzJyk7XG5cbmZ1bmN0aW9uIGxvZ0NoYW5nZSh2YWx1ZSkge1xuICBjb25zb2xlLmxvZygnU2VsZWN0IHZhbHVlIGNoYW5nZWQ6ICcgKyB2YWx1ZSk7XG59XG5cbnZhciBDb3VudHJ5U2VsZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvdW50cnlTZWxlY3RcIixcbiAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdCh0aGlzLnByb3BzLnZhbHVlKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy52YWx1ZSA9PT0gdGhpcy5wcm9wcy5zZWxlY3RlZCA/ICdhY3RpdmUnIDogJ2xpbmsnO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7b25DbGljazogdGhpcy5vbkNsaWNrLCBjbGFzc05hbWU6IGNsYXNzTmFtZX0sIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICB9XG59KTtcbiBcbnZhciBTdGF0ZXNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTdGF0ZXNGaWVsZFwiLFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICAgIGxhYmVsOiAnU3RhdGVzOicsXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb3VudHJ5OiAnQVUnLFxuICAgICAgc2VsZWN0VmFsdWU6ICduZXctc291dGgtd2FsZXMnXG4gICAgfTtcbiAgfSxcbiAgc3dpdGNoQ291bnRyeTogZnVuY3Rpb24obmV3Q291bnRyeSkge1xuICAgIGNvbnNvbGUubG9nKCdDb3VudHJ5IGNoYW5nZWQgdG8gJyArIG5ld0NvdW50cnkpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY291bnRyeTogbmV3Q291bnRyeSxcbiAgICAgIHNlbGVjdFZhbHVlOiBudWxsXG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgIGxvZ0NoYW5nZSgnU3RhdGUgY2hhbmdlZCB0byAnICsgbmV3VmFsdWUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0VmFsdWU6IG5ld1ZhbHVlIHx8IG51bGxcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3BzID0gU1RBVEVTW3RoaXMuc3RhdGUuY291bnRyeV07XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCB0aGlzLnByb3BzLmxhYmVsKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7b3B0aW9uczogb3BzLCB2YWx1ZTogdGhpcy5zdGF0ZS5zZWxlY3RWYWx1ZSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWUsIHNlYXJjaGFibGU6IHRoaXMucHJvcHMuc2VhcmNoYWJsZX0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN3aXRjaGVyXCJ9LCBcbiAgICAgICAgICBcIkNvdW50cnk6XCIsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ291bnRyeVNlbGVjdCwge3ZhbHVlOiBcIkFVXCIsIHNlbGVjdGVkOiB0aGlzLnN0YXRlLmNvdW50cnksIG9uU2VsZWN0OiB0aGlzLnN3aXRjaENvdW50cnl9LCBcIkF1c3RyYWxpYVwiKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb3VudHJ5U2VsZWN0LCB7dmFsdWU6IFwiVVNcIiwgc2VsZWN0ZWQ6IHRoaXMuc3RhdGUuY291bnRyeSwgb25TZWxlY3Q6IHRoaXMuc3dpdGNoQ291bnRyeX0sIFwiVVNcIilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuIFxudmFyIFJlbW90ZVNlbGVjdEZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJlbW90ZVNlbGVjdEZpZWxkXCIsXG4gIGxvYWRPcHRpb25zOiBmdW5jdGlvbihpbnB1dCwgY2FsbGJhY2spIHtcbiAgICBcbiAgICBpbnB1dCA9IGlucHV0LnRvTG93ZXJDYXNlKCk7XG4gICAgXG4gICAgdmFyIHJ0biA9IHtcbiAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgeyBsYWJlbDogJ09uZScsIHZhbHVlOiAnb25lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnVHdvJywgdmFsdWU6ICd0d28nIH0sXG4gICAgICAgIHsgbGFiZWw6ICdUaHJlZScsIHZhbHVlOiAndGhyZWUnIH1cbiAgICAgIF0sXG4gICAgICBjb21wbGV0ZTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgaWYgKGlucHV0LnNsaWNlKDAsMSkgPT09ICdhJykge1xuICAgICAgaWYgKGlucHV0LnNsaWNlKDAsMikgPT09ICdhYicpIHtcbiAgICAgICAgcnRuID0ge1xuICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBQicsIHZhbHVlOiAnYWInIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQUJDJywgdmFsdWU6ICdhYmMnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQUJDRCcsIHZhbHVlOiAnYWJjZCcgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY29tcGxldGU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJ0biA9IHtcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnQScsIHZhbHVlOiAnYScgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBQScsIHZhbHVlOiAnYWEnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQUInLCB2YWx1ZTogJ2FiJyB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBjb21wbGV0ZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpbnB1dC5sZW5ndGgpIHtcbiAgICAgIHJ0bi5jb21wbGV0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcnRuKTtcbiAgICB9LCA1MDApO1xuICAgIFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7YXN5bmNPcHRpb25zOiB0aGlzLmxvYWRPcHRpb25zLCBjbGFzc05hbWU6IFwicmVtb3RlLWV4YW1wbGVcIn0pXG4gICAgKTtcbiAgfVxufSk7XG5cblxudmFyIE11bHRpU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTXVsdGlTZWxlY3RGaWVsZFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcHMgPSBbXG4gICAgICB7IGxhYmVsOiAnQ2hvY29sYXRlJywgdmFsdWU6ICdjaG9jb2xhdGUnIH0sXG4gICAgICB7IGxhYmVsOiAnVmFuaWxsYScsIHZhbHVlOiAndmFuaWxsYScgfSxcbiAgICAgIHsgbGFiZWw6ICdTdHJhd2JlcnJ5JywgdmFsdWU6ICdzdHJhd2JlcnJ5JyB9LFxuICAgICAgeyBsYWJlbDogJ0NhcmFtZWwnLCB2YWx1ZTogJ2NhcmFtZWwnIH0sXG4gICAgICB7IGxhYmVsOiAnQ29va2llcyBhbmQgQ3JlYW0nLCB2YWx1ZTogJ2Nvb2tpZXNjcmVhbScgfSxcbiAgICAgIHsgbGFiZWw6ICdQZXBwZXJtaW50JywgdmFsdWU6ICdwZXBwZXJtaW50JyB9XG4gICAgXTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCBudWxsLCB0aGlzLnByb3BzLmxhYmVsKSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwge211bHRpOiB0cnVlLCBwbGFjZWhvbGRlcjogXCJTZWxlY3QgeW91ciBmYXZvdXJpdGUocylcIiwgb3B0aW9uczogb3BzLCBvbkNoYW5nZTogbG9nQ2hhbmdlfSlcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyKFxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3RhdGVzRmllbGQsIG51bGwpLCBcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN0YXRlc0ZpZWxkLCB7bGFiZWw6IFwiU3RhdGVzIChub24tc2VhcmNoYWJsZSk6XCIsIHNlYXJjaGFibGU6IGZhbHNlfSksIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXVsdGlTZWxlY3RGaWVsZCwge2xhYmVsOiBcIk11bHRpc2VsZWN0OlwifSksIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVtb3RlU2VsZWN0RmllbGQsIHtsYWJlbDogXCJSZW1vdGUgT3B0aW9uczpcIn0pXG4gICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGFtcGxlJylcbik7IiwiZXhwb3J0cy5BVSA9IFtcblx0eyB2YWx1ZTogJ2F1c3RyYWxpYW4tY2FwaXRhbC10ZXJyaXRvcnknLCBsYWJlbDogJ0F1c3RyYWxpYW4gQ2FwaXRhbCBUZXJyaXRvcnknIH0sXG5cdHsgdmFsdWU6ICduZXctc291dGgtd2FsZXMnLCBsYWJlbDogJ05ldyBTb3V0aCBXYWxlcycgfSxcblx0eyB2YWx1ZTogJ3ZpY3RvcmlhJywgbGFiZWw6ICdWaWN0b3JpYScgfSxcblx0eyB2YWx1ZTogJ3F1ZWVuc2xhbmQnLCBsYWJlbDogJ1F1ZWVuc2xhbmQnIH0sXG5cdHsgdmFsdWU6ICd3ZXN0ZXJuLWF1c3RyYWxpYScsIGxhYmVsOiAnV2VzdGVybiBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICdzb3V0aC1hdXN0cmFsaWEnLCBsYWJlbDogJ1NvdXRoIEF1c3RyYWxpYScgfSxcblx0eyB2YWx1ZTogJ3Rhc21hbmlhJywgbGFiZWw6ICdUYXNtYW5pYScgfSxcblx0eyB2YWx1ZTogJ25vcnRoZXJuLXRlcnJpdG9yeScsIGxhYmVsOiAnTm9ydGhlcm4gVGVycml0b3J5JyB9XG5dO1xuXG5leHBvcnRzLlVTID0gW1xuICAgIHsgdmFsdWU6ICdBTCcsIGxhYmVsOiAnQWxhYmFtYScgfSxcbiAgICB7IHZhbHVlOiAnQUsnLCBsYWJlbDogJ0FsYXNrYScgfSxcbiAgICB7IHZhbHVlOiAnQVMnLCBsYWJlbDogJ0FtZXJpY2FuIFNhbW9hJyB9LFxuICAgIHsgdmFsdWU6ICdBWicsIGxhYmVsOiAnQXJpem9uYScgfSxcbiAgICB7IHZhbHVlOiAnQVInLCBsYWJlbDogJ0Fya2Fuc2FzJyB9LFxuICAgIHsgdmFsdWU6ICdDQScsIGxhYmVsOiAnQ2FsaWZvcm5pYScgfSxcbiAgICB7IHZhbHVlOiAnQ08nLCBsYWJlbDogJ0NvbG9yYWRvJyB9LFxuICAgIHsgdmFsdWU6ICdDVCcsIGxhYmVsOiAnQ29ubmVjdGljdXQnIH0sXG4gICAgeyB2YWx1ZTogJ0RFJywgbGFiZWw6ICdEZWxhd2FyZScgfSxcbiAgICB7IHZhbHVlOiAnREMnLCBsYWJlbDogJ0Rpc3RyaWN0IE9mIENvbHVtYmlhJyB9LFxuICAgIHsgdmFsdWU6ICdGTScsIGxhYmVsOiAnRmVkZXJhdGVkIFN0YXRlcyBPZiBNaWNyb25lc2lhJyB9LFxuICAgIHsgdmFsdWU6ICdGTCcsIGxhYmVsOiAnRmxvcmlkYScgfSxcbiAgICB7IHZhbHVlOiAnR0EnLCBsYWJlbDogJ0dlb3JnaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0dVJywgbGFiZWw6ICdHdWFtJyB9LFxuICAgIHsgdmFsdWU6ICdISScsIGxhYmVsOiAnSGF3YWlpJyB9LFxuICAgIHsgdmFsdWU6ICdJRCcsIGxhYmVsOiAnSWRhaG8nIH0sXG4gICAgeyB2YWx1ZTogJ0lMJywgbGFiZWw6ICdJbGxpbm9pcycgfSxcbiAgICB7IHZhbHVlOiAnSU4nLCBsYWJlbDogJ0luZGlhbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0lBJywgbGFiZWw6ICdJb3dhJyB9LFxuICAgIHsgdmFsdWU6ICdLUycsIGxhYmVsOiAnS2Fuc2FzJyB9LFxuICAgIHsgdmFsdWU6ICdLWScsIGxhYmVsOiAnS2VudHVja3knIH0sXG4gICAgeyB2YWx1ZTogJ0xBJywgbGFiZWw6ICdMb3Vpc2lhbmEnIH0sXG4gICAgeyB2YWx1ZTogJ01FJywgbGFiZWw6ICdNYWluZScgfSxcbiAgICB7IHZhbHVlOiAnTUgnLCBsYWJlbDogJ01hcnNoYWxsIElzbGFuZHMnIH0sXG4gICAgeyB2YWx1ZTogJ01EJywgbGFiZWw6ICdNYXJ5bGFuZCcgfSxcbiAgICB7IHZhbHVlOiAnTUEnLCBsYWJlbDogJ01hc3NhY2h1c2V0dHMnIH0sXG4gICAgeyB2YWx1ZTogJ01JJywgbGFiZWw6ICdNaWNoaWdhbicgfSxcbiAgICB7IHZhbHVlOiAnTU4nLCBsYWJlbDogJ01pbm5lc290YScgfSxcbiAgICB7IHZhbHVlOiAnTVMnLCBsYWJlbDogJ01pc3Npc3NpcHBpJyB9LFxuICAgIHsgdmFsdWU6ICdNTycsIGxhYmVsOiAnTWlzc291cmknIH0sXG4gICAgeyB2YWx1ZTogJ01UJywgbGFiZWw6ICdNb250YW5hJyB9LFxuICAgIHsgdmFsdWU6ICdORScsIGxhYmVsOiAnTmVicmFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ05WJywgbGFiZWw6ICdOZXZhZGEnIH0sXG4gICAgeyB2YWx1ZTogJ05IJywgbGFiZWw6ICdOZXcgSGFtcHNoaXJlJyB9LFxuICAgIHsgdmFsdWU6ICdOSicsIGxhYmVsOiAnTmV3IEplcnNleScgfSxcbiAgICB7IHZhbHVlOiAnTk0nLCBsYWJlbDogJ05ldyBNZXhpY28nIH0sXG4gICAgeyB2YWx1ZTogJ05ZJywgbGFiZWw6ICdOZXcgWW9yaycgfSxcbiAgICB7IHZhbHVlOiAnTkMnLCBsYWJlbDogJ05vcnRoIENhcm9saW5hJyB9LFxuICAgIHsgdmFsdWU6ICdORCcsIGxhYmVsOiAnTm9ydGggRGFrb3RhJyB9LFxuICAgIHsgdmFsdWU6ICdNUCcsIGxhYmVsOiAnTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdPSCcsIGxhYmVsOiAnT2hpbycgfSxcbiAgICB7IHZhbHVlOiAnT0snLCBsYWJlbDogJ09rbGFob21hJyB9LFxuICAgIHsgdmFsdWU6ICdPUicsIGxhYmVsOiAnT3JlZ29uJyB9LFxuICAgIHsgdmFsdWU6ICdQVycsIGxhYmVsOiAnUGFsYXUnIH0sXG4gICAgeyB2YWx1ZTogJ1BBJywgbGFiZWw6ICdQZW5uc3lsdmFuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1BSJywgbGFiZWw6ICdQdWVydG8gUmljbycgfSxcbiAgICB7IHZhbHVlOiAnUkknLCBsYWJlbDogJ1Job2RlIElzbGFuZCcgfSxcbiAgICB7IHZhbHVlOiAnU0MnLCBsYWJlbDogJ1NvdXRoIENhcm9saW5hJyB9LFxuICAgIHsgdmFsdWU6ICdTRCcsIGxhYmVsOiAnU291dGggRGFrb3RhJyB9LFxuICAgIHsgdmFsdWU6ICdUTicsIGxhYmVsOiAnVGVubmVzc2VlJyB9LFxuICAgIHsgdmFsdWU6ICdUWCcsIGxhYmVsOiAnVGV4YXMnIH0sXG4gICAgeyB2YWx1ZTogJ1VUJywgbGFiZWw6ICdVdGFoJyB9LFxuICAgIHsgdmFsdWU6ICdWVCcsIGxhYmVsOiAnVmVybW9udCcgfSxcbiAgICB7IHZhbHVlOiAnVkknLCBsYWJlbDogJ1ZpcmdpbiBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdWQScsIGxhYmVsOiAnVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dBJywgbGFiZWw6ICdXYXNoaW5ndG9uJyB9LFxuICAgIHsgdmFsdWU6ICdXVicsIGxhYmVsOiAnV2VzdCBWaXJnaW5pYScgfSxcbiAgICB7IHZhbHVlOiAnV0knLCBsYWJlbDogJ1dpc2NvbnNpbicgfSxcbiAgICB7IHZhbHVlOiAnV1knLCBsYWJlbDogJ1d5b21pbmcnIH1cbl07XG4iXX0=
