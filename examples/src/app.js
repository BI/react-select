var React = require('react'),
	Select = require('react-select'),
	MoreList = require('../../../react-more-list/more-list.jsx');

//require('./external/more-list-styles.css');

var STATES = require('./data/states');

function logChange(value) {
	console.log('Select value changed: ' + value);
}

var CountrySelect = React.createClass({
	onClick: function() {
		this.props.onSelect(this.props.value);
	},
	render: function() {
		var className = this.props.value === this.props.selected ? 'active' : 'link';
		return <span onClick={this.onClick} className={className}>{this.props.children}</span>;
	}
});
 
var StatesField = React.createClass({
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
			<div>
				<label>States:</label>
				<Select options={ops} value={this.state.selectValue} onChange={this.updateValue} />
				<div className="switcher">
					Country:
					<CountrySelect value="AU" selected={this.state.country} onSelect={this.switchCountry}>Australia</CountrySelect>
					<CountrySelect value="US" selected={this.state.country} onSelect={this.switchCountry}>US</CountrySelect>
				</div>
			</div>
		);
	}
});
 
var RemoteSelectField = React.createClass({
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
		return <div>
			<label>{this.props.label}</label>
			<Select asyncOptions={this.loadOptions} className="remote-example" />
		</div>;
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

		return <li className={className} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>{item.label}</li>
	}, this)

	return (
		<MoreList>
			{listItems}
		</MoreList>
	)
}

var MultiSelectField = React.createClass({
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
		return <div>
			<label>{this.props.label}</label>
			<Select multi={true} placeholder="Select your favourite(s)" buildCustomMenu={testRender} options={ops} onChange={logChange} />
		</div>;
	}
});


React.render(
	<div>
		<StatesField />
		<MultiSelectField label="Multiselect:"/>
		<RemoteSelectField label="Remote Options:"/>
	</div>,
	document.getElementById('example')
);
