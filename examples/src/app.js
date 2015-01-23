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

var CustomList = React.createClass({
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
  		<Section>
  			<Heading>{sectionTitle} ({sectionItems.length})</Heading>
  			<Content>
  				{moreList}
  			</Content>
  		</Section>
  	)
  },
  buildMoreList: function(moreListItems) {
		var listItems = moreListItems.map(this.buildListItem, this);

		return (
			<MoreList>
				{listItems}
			</MoreList>
		)
  },
  buildListItem: function(listItem) {
			var className = this.props.focussedItem && this.props.focussedItem.value === listItem.value ? "is-focused" : null;

			var mouseDown = this.selectItem.bind(this, listItem);
			var mouseEnter = this.focusItem.bind(this, listItem);
			var mouseLeave = this.unfocusItem.bind(this, listItem);

			return <li className={className} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>{listItem.innerLabel}</li>
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
			<Accordion>
				{sections}
			</Accordion>
		)
	}
});

var MultiSelectField = React.createClass({
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
		return <div>
			<label>{this.props.label}</label>
			<Select multi={true} placeholder="Select your favourite(s)" options={ops} onChange={logChange} >
				<CustomList />
			</Select>
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
