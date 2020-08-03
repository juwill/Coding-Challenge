import React, { useState } from "react";
import './App.scss';
import {debounce} from 'lodash';
import {_} from 'lodash';

//EmptyState, activated when option is not found
//takes in filterValue & handleAddMissingFilter function
//button onClick adds missing search option to list 
//if admin is detected (adminActivated is true, select&add option is activated.)
const EmptyState = ({ filterValue, handleAddMissingFilter, adminActivated }) =>
	<div className="EmptyState"><span>"{filterValue}" not found</span>
		{adminActivated ?
			<button onClick={e => handleAddMissingFilter(filterValue)}>Add & Select
 	</button> : <div></div>
		}
	</div>;


//DropDownFilter 
//takes in filter value & handleFilterChange function
//drop down search box, calls handleFilterChange method upon input box change
const DropdownFilter =({ value, handleFilterChange,setSearchTerm,searchTerm }) => {
	return <input className="DropdownFilter"
		placeholder="Search a location"
		value={searchTerm}
		onChange={(e)=>{handleFilterChange(e.target.value);setSearchTerm(e.target.value)}} 
		/>
};

//DropdownOptions
//takes in label, option value & handleClick function
const DropdownOption = ({ label, value, handleClick }) => {
	return <button
		className="DropdownOption"
		onClick={e => handleClick(value)}>{label}</button>
};




//Dropdown
//takes in itemsToShow, options(From JSON), filterValue, handleOptionClick, handleFilterChange & handleAddMissingFilter function
function Dropdown({
	itemsToShow,
	options,
	filterValue,
	handleOptionClick,
	handleFilterChange,
	handleAddMissingFilter,
	adminActivated,
	debounceTimeout
}) {
	const [display, setDisplay] = useState(itemsToShow);
	const [displayingAll, setDisplayAll] = useState(false);
	const [searchTerm, setSearchTerm]= useState("");

	// updates options to contain only entries matching filter value
	const matchingOptions = options.filter(
		option => new RegExp(filterValue, 'ig').test(option.value));

	// click function to stop propagation of onClick in "show more" button to rest of div
	const showAllOptions = (e) => {
		e.stopPropagation();
	}

	//debounce function to delay searchFilter update only X milliseconds after user stops typing
	function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


	return (
		// dropdown bar
		<div className="Dropdown" onClick={(e) => { setDisplayAll(false); setDisplay(itemsToShow) }}>

			{/* search bar */}
			<div className="SearchBar">
				<DropdownFilter value={searchTerm} handleFilterChange={debounce(handleFilterChange,debounceTimeout)} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
			</div>
			{/* list of entries */}
			<div className="listWrapperDiv">
				{
					matchingOptions.length
						?
						matchingOptions.slice(0, display).map(option => <DropdownOption key={option.value} handleClick={handleOptionClick} {...option} />)
						:
						<EmptyState filterValue={filterValue} handleAddMissingFilter={handleAddMissingFilter} adminActivated={adminActivated} />
				}
				{!displayingAll && matchingOptions.length ?
				// showMore button to show the rest of the entries
					<div className="showMore" onClick={(e) => { showAllOptions(e); setDisplayAll(true); setDisplay(options.length)}}>
						{matchingOptions.length - itemsToShow > 1 ? <span>{matchingOptions.length - itemsToShow} more...</span>
							: <span></span>}
					</div>
					: <span></span>
				}
			</div>
	</div>
	)
}

export default Dropdown;