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
},{"./data/states":"/Users/stephensmith/Desktop/gitRepos/react-select/examples/src/data/states.js","react":false,"react-select":false}],"/Users/stephensmith/Desktop/gitRepos/react-select/examples/src/data/states.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9zcmMvYXBwLmpzIiwiZXhhbXBsZXMvc3JjL2RhdGEvc3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuICBTZWxlY3QgPSByZXF1aXJlKCdyZWFjdC1zZWxlY3QnKTtcblxudmFyIFNUQVRFUyA9IHJlcXVpcmUoJy4vZGF0YS9zdGF0ZXMnKTtcblxuZnVuY3Rpb24gbG9nQ2hhbmdlKHZhbHVlKSB7XG4gIGNvbnNvbGUubG9nKCdTZWxlY3QgdmFsdWUgY2hhbmdlZDogJyArIHZhbHVlKTtcbn1cblxudmFyIENvdW50cnlTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ291bnRyeVNlbGVjdFwiLFxuICBvbkNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHRoaXMucHJvcHMudmFsdWUpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnByb3BzLnZhbHVlID09PSB0aGlzLnByb3BzLnNlbGVjdGVkID8gJ2FjdGl2ZScgOiAnbGluayc7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtvbkNsaWNrOiB0aGlzLm9uQ2xpY2ssIGNsYXNzTmFtZTogY2xhc3NOYW1lfSwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gIH1cbn0pO1xuIFxudmFyIFN0YXRlc0ZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlN0YXRlc0ZpZWxkXCIsXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgbGFiZWw6ICdTdGF0ZXM6JyxcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50cnk6ICdBVScsXG4gICAgICBzZWxlY3RWYWx1ZTogJ25ldy1zb3V0aC13YWxlcydcbiAgICB9O1xuICB9LFxuICBzd2l0Y2hDb3VudHJ5OiBmdW5jdGlvbihuZXdDb3VudHJ5KSB7XG4gICAgY29uc29sZS5sb2coJ0NvdW50cnkgY2hhbmdlZCB0byAnICsgbmV3Q291bnRyeSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb3VudHJ5OiBuZXdDb3VudHJ5LFxuICAgICAgc2VsZWN0VmFsdWU6IG51bGxcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgbG9nQ2hhbmdlKCdTdGF0ZSBjaGFuZ2VkIHRvICcgKyBuZXdWYWx1ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RWYWx1ZTogbmV3VmFsdWUgfHwgbnVsbFxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcHMgPSBTVEFURVNbdGhpcy5zdGF0ZS5jb3VudHJ5XTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHtvcHRpb25zOiBvcHMsIHZhbHVlOiB0aGlzLnN0YXRlLnNlbGVjdFZhbHVlLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZSwgc2VhcmNoYWJsZTogdGhpcy5wcm9wcy5zZWFyY2hhYmxlfSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3dpdGNoZXJcIn0sIFxuICAgICAgICAgIFwiQ291bnRyeTpcIiwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb3VudHJ5U2VsZWN0LCB7dmFsdWU6IFwiQVVcIiwgc2VsZWN0ZWQ6IHRoaXMuc3RhdGUuY291bnRyeSwgb25TZWxlY3Q6IHRoaXMuc3dpdGNoQ291bnRyeX0sIFwiQXVzdHJhbGlhXCIpLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvdW50cnlTZWxlY3QsIHt2YWx1ZTogXCJVU1wiLCBzZWxlY3RlZDogdGhpcy5zdGF0ZS5jb3VudHJ5LCBvblNlbGVjdDogdGhpcy5zd2l0Y2hDb3VudHJ5fSwgXCJVU1wiKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG4gXG52YXIgUmVtb3RlU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUmVtb3RlU2VsZWN0RmllbGRcIixcbiAgbG9hZE9wdGlvbnM6IGZ1bmN0aW9uKGlucHV0LCBjYWxsYmFjaykge1xuICAgIFxuICAgIGlucHV0ID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICBcbiAgICB2YXIgcnRuID0ge1xuICAgICAgb3B0aW9uczogW1xuICAgICAgICB7IGxhYmVsOiAnT25lJywgdmFsdWU6ICdvbmUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdUd28nLCB2YWx1ZTogJ3R3bycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1RocmVlJywgdmFsdWU6ICd0aHJlZScgfVxuICAgICAgXSxcbiAgICAgIGNvbXBsZXRlOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBpZiAoaW5wdXQuc2xpY2UoMCwxKSA9PT0gJ2EnKSB7XG4gICAgICBpZiAoaW5wdXQuc2xpY2UoMCwyKSA9PT0gJ2FiJykge1xuICAgICAgICBydG4gPSB7XG4gICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgeyBsYWJlbDogJ0FCJywgdmFsdWU6ICdhYicgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBQkMnLCB2YWx1ZTogJ2FiYycgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBQkNEJywgdmFsdWU6ICdhYmNkJyB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBjb21wbGV0ZTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuID0ge1xuICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBJywgdmFsdWU6ICdhJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0FBJywgdmFsdWU6ICdhYScgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdBQicsIHZhbHVlOiAnYWInIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGNvbXBsZXRlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlucHV0Lmxlbmd0aCkge1xuICAgICAgcnRuLmNvbXBsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBydG4pO1xuICAgIH0sIDUwMCk7XG4gICAgXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgbnVsbCwgdGhpcy5wcm9wcy5sYWJlbCksIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHthc3luY09wdGlvbnM6IHRoaXMubG9hZE9wdGlvbnMsIGNsYXNzTmFtZTogXCJyZW1vdGUtZXhhbXBsZVwifSlcbiAgICApO1xuICB9XG59KTtcblxuXG52YXIgTXVsdGlTZWxlY3RGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNdWx0aVNlbGVjdEZpZWxkXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wcyA9IFtcbiAgICAgIHsgbGFiZWw6ICdDaG9jb2xhdGUnLCB2YWx1ZTogJ2Nob2NvbGF0ZScgfSxcbiAgICAgIHsgbGFiZWw6ICdWYW5pbGxhJywgdmFsdWU6ICd2YW5pbGxhJyB9LFxuICAgICAgeyBsYWJlbDogJ1N0cmF3YmVycnknLCB2YWx1ZTogJ3N0cmF3YmVycnknIH0sXG4gICAgICB7IGxhYmVsOiAnQ2FyYW1lbCcsIHZhbHVlOiAnY2FyYW1lbCcgfSxcbiAgICAgIHsgbGFiZWw6ICdDb29raWVzIGFuZCBDcmVhbScsIHZhbHVlOiAnY29va2llc2NyZWFtJyB9LFxuICAgICAgeyBsYWJlbDogJ1BlcHBlcm1pbnQnLCB2YWx1ZTogJ3BlcHBlcm1pbnQnIH1cbiAgICBdO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIG51bGwsIHRoaXMucHJvcHMubGFiZWwpLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7bXVsdGk6IHRydWUsIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCB5b3VyIGZhdm91cml0ZShzKVwiLCBvcHRpb25zOiBvcHMsIG9uQ2hhbmdlOiBsb2dDaGFuZ2V9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5cblJlYWN0LnJlbmRlcihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN0YXRlc0ZpZWxkLCBudWxsKSwgXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdGF0ZXNGaWVsZCwge2xhYmVsOiBcIlN0YXRlcyAobm9uLXNlYXJjaGFibGUpOlwiLCBzZWFyY2hhYmxlOiBmYWxzZX0pLCBcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE11bHRpU2VsZWN0RmllbGQsIHtsYWJlbDogXCJNdWx0aXNlbGVjdDpcIn0pLCBcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlbW90ZVNlbGVjdEZpZWxkLCB7bGFiZWw6IFwiUmVtb3RlIE9wdGlvbnM6XCJ9KVxuICApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhhbXBsZScpXG4pOyIsImV4cG9ydHMuQVUgPSBbXG5cdHsgdmFsdWU6ICdhdXN0cmFsaWFuLWNhcGl0YWwtdGVycml0b3J5JywgbGFiZWw6ICdBdXN0cmFsaWFuIENhcGl0YWwgVGVycml0b3J5JyB9LFxuXHR7IHZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJywgbGFiZWw6ICdOZXcgU291dGggV2FsZXMnIH0sXG5cdHsgdmFsdWU6ICd2aWN0b3JpYScsIGxhYmVsOiAnVmljdG9yaWEnIH0sXG5cdHsgdmFsdWU6ICdxdWVlbnNsYW5kJywgbGFiZWw6ICdRdWVlbnNsYW5kJyB9LFxuXHR7IHZhbHVlOiAnd2VzdGVybi1hdXN0cmFsaWEnLCBsYWJlbDogJ1dlc3Rlcm4gQXVzdHJhbGlhJyB9LFxuXHR7IHZhbHVlOiAnc291dGgtYXVzdHJhbGlhJywgbGFiZWw6ICdTb3V0aCBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICd0YXNtYW5pYScsIGxhYmVsOiAnVGFzbWFuaWEnIH0sXG5cdHsgdmFsdWU6ICdub3J0aGVybi10ZXJyaXRvcnknLCBsYWJlbDogJ05vcnRoZXJuIFRlcnJpdG9yeScgfVxuXTtcblxuZXhwb3J0cy5VUyA9IFtcbiAgICB7IHZhbHVlOiAnQUwnLCBsYWJlbDogJ0FsYWJhbWEnIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIl19
