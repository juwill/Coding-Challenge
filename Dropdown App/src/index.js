import React from "react";
import ReactDOM from "react-dom";
import Dropdown from "./Dropdown";

//default locations list for testing, application locations data will be overwritten by actual data from MockAPI upon initial page load
import team from './locations.json'
import './App.scss';



//class taking in a value and handleFieldClick function, returning a button
const Field = ({ value, handleFieldClick }) => {
	return <button className="Field" onClick={handleFieldClick}>{value ? value : 'Select a location'}<div className="imgDiv"></div></button>
};



//simulate user ID
//use value 1 for admin rights, use any other value for normal user access

class MyApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			itemsToShow: 5,
			options: team.map((item) => ({
				value: item.value,
				label: item.label
			})),
			selectedValue: '',
			showDropdown: false,
			filterValue: '',
			adminActivated: false,
			debounceTimeOut: 500,
			MockAPIAddress: 'http://localhost:3005'
		};
		this.handleOptionClick = this.handleOptionClick.bind(this);
		this.handleFieldClick = this.handleFieldClick.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
		this.handleAddMissingFilter = this.handleAddMissingFilter.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.toggleAdmin = this.toggleAdmin.bind(this);
		this.setDebounceTimeout = this.setDebounceTimeout.bind(this);
		this.addEntryToJson = this.addEntryToJson.bind(this);
	}


	// update selected option
	// close dropdown
	handleOptionClick(value) {
		//set value of selectedValue in state as input value
		this.setState({ selectedValue: value });
		//reverses showDropDown boolean
		this.setState({ showDropdown: !this.state.showDropdown });
	};

	//closes dropdown when a click is detected outside of the dropdown div
	handleOutsideClick() {
		this.setState({ showDropdown: false });
	}

	// opens dropdown
	handleFieldClick() {
		//reverses showDropDown boolean
		this.setState({ showDropdown: !this.state.showDropdown });
	};

	//fetch array of countries from mock API localhost server during initializing, replaces default
	//locations array declared in state
	componentDidMount() {
		fetch(this.state.MockAPIAddress)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					options: responseJson.map((item) => ({
						value: item.value,
						label: item.label
					})
					)
				})
			})
	}
	//update locations JSON object in app and push data to server to update JSON file
	addEntryToJson(options) {
		fetch(this.state.MockAPIAddress+'/addEntry', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		})
	}


	//updates filterValue
	handleFilterChange(value) {
		//set value of filterValue in state as input value
		this.setState({ filterValue: value })
	}

	//toggle admin boolean
	toggleAdmin() {
		this.setState({ adminActivated: !this.state.adminActivated })
	}

	//set debounce timeout in milliseconds
	setDebounceTimeout(timeOut) {
		this.setState({ debounceTimeOut: timeOut })
	}


	//should update JSON file with missing option upon adding a missing option
	handleAddMissingFilter(filterValue) {
		console.log('add missing value and select', filterValue);

		// insert map entry into options List
		const newOptions = [...this.state.options, {
			label: filterValue,
			value: filterValue,
		}];

		//insert mock api post update here

		//updates options as with value newOptions
		this.setState({ options: newOptions });
		this.addEntryToJson(newOptions);
		// set new option as selected value
		this.setState({ selectedValue: filterValue });
		// clear filter value
		this.setState({ filterValue: '' });
		// close dropdown
		this.setState({ showDropdown: !this.state.showDropdown });
	}

	// {/* returns button with Field declaration options, selectedValue & handleFieldClick as function */}
	render() {
		return <>
			{/* underlay to detect clicks out of dropdown element */}
			<div className="pageDiv" onClick={this.handleOutsideClick}></div>
			<div className="wrapperDiv">

				{/* button to simulate admin on/off */}
				<button className="activateAdmin" onClick={this.toggleAdmin}>Toggle Admin</button>
				{/* admin functions status */}
				<div>Admin Functions: {this.state.adminActivated ? <span>ON</span> : <span>OFF </span>}</div>
				{/* displays selected location by user */}
				<br />

				{/* shows selected location */}
				<div>Selected location: {this.state.selectedValue}</div>
				<br />

				{/* shows max number of items to display in dropdown */}
				<span>Max items: </span>
				{/* updates the itemsToShow value */}
				<input className="testingInputFields" value={this.state.itemsToShow} min="1" type="number" onChange={(e) => { this.setState({ itemsToShow: e.target.value }); console.log(this.state.itemsToShow) }}></input>
				<br /><br />

				{/* shows debounceTimeout in milliseconds */}
				<span>Timeout is:  </span>
				{/* Input to change debounceTimeout with user input */}
				<input className="testingInputFields" value={this.state.debounceTimeOut} min="0" type="number" onChange={(e) => { this.setDebounceTimeout(e.target.value) }}></input>

				{/* button to toggle dropdown list, toggles showDropDown boolean to determine if dropdown should be shown or not */}
				<br /><br />
				<Field value={this.state.selectedValue} handleFieldClick={this.handleFieldClick} />
				{/* if shopDropDown is true, dropdown element is shown. Otherwise, hide it */}
				{this.state.showDropdown &&
					<Dropdown
						itemsToShow={this.state.itemsToShow}
						options={this.state.options}
						filterValue={this.state.filterValue}
						handleFilterChange={this.handleFilterChange}
						handleOptionClick={this.handleOptionClick}
						handleAddMissingFilter={this.handleAddMissingFilter}
						adminActivated={this.state.adminActivated}
						debounceTimeout={this.state.debounceTimeOut} />
				}
			</div>


		</>;
	}
}

ReactDOM.render(


	<MyApp></MyApp>,

	document.getElementById('root')
);