import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "./style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockContext from './config/StockContext';
import { useContext } from 'react';
import TableData from './TableData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOnline from './custom_hooks/useOnline';

function App() {
	const [symbol, setSymbol] = useState('');
	const [date, setDate] = useState('');
	const [tableData, setTableData] = useState(useContext(StockContext));
	const [symbolError, setSymbolError] = useState(false);
	const [dateError, setDateError] = useState(false);
	const [formValid, setFormValid] = useState(false);
	console.log(tableData);
	console.log("formValid", formValid);

	//Disable button status update code start//
	useEffect(() => {
		if (date !== '' && symbol !== '') {
			setFormValid(true);
		}
		else {
			setFormValid(false);
		}
	}, [date, symbol])
	//disable button status update code end//
	const isOnline = useOnline();

	//update respective state variable of user inputs code start//
	const handleSymbolChange = (event) => {
		setSymbol(event.target.value);
		setSymbolError(false);
	};

	const handleDateChange = (date) => {
		setDate(date);
		setDateError(false);
		console.log("date", date);
	};
	//update state variable of user input code end//

	//check user inputs when user leaves input field code start//
	const validatesymbol = (e) => {
		if (e.target.value.trim() === "") {
			setSymbolError(true);
		}
	}
	const validateDate = (e) => {
		if (e.target.value.trim() === "") {
			setDateError(true);
		}
	}
	//check user inputs when user leaves input field code end//

	//disable the dates on weeke
	const isDisabledDate = (date) => {
		const selectedDate = moment(date);
		const isWeekend = selectedDate.isoWeekday() === 6 || selectedDate.isoWeekday() === 7;
		const isFutureDate = selectedDate.isAfter(moment(), 'day');
		return isWeekend || isFutureDate
	};

	//submit user inputs as json object and returns a response object code start//
	const handleSubmit = (event) => {
		event.preventDefault();
		sendFormData();
	};

	const sendFormData = () => {
		const apiUrl = 'http://localhost:5000/api/fetchStockData';
		const formData = {
			stockSymbol: symbol.toUpperCase().trim(),
			date: moment(date).format('YYYY-MM-DD'),
		};

		axios
			.post(apiUrl, formData)
			.then((response) => {
				tableData.stockData.push(response.data);
				console.log(response.data);
				setSymbol('');
				setDate('');
				toast.success('Request is successful', {
					position: toast.POSITION.TOP_RIGHT,
				});
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status >= 400 && error.response.status < 500) {
						toast.error('Error in fetching data, enter valid details', {
							position: toast.POSITION.TOP_RIGHT,
						});
					} else if (error.response.status >= 500) {
						toast.error('Internal server error. Please try again later.', {
							position: toast.POSITION.TOP_RIGHT,
						});
					}
				} else if (error.request) {
					toast.error('Network error. Please check your internet connection.', {
						position: toast.POSITION.TOP_RIGHT,
					});
				} else {
					toast.error('Unknown error occurred. Please try again later.', {
						position: toast.POSITION.TOP_RIGHT,
					});
				}
			});
	};
		//submit user inputs as json object and returns a response object code end//


	return (
		<StockContext.Provider value={{ stockData: tableData, modifier: setTableData }}>
			<div className="container-fluid">
				<div className="row p-4">
					<div className="col-sm-4">
						<h1>Stock Trade Statistics</h1>
						<form onSubmit={handleSubmit}>
							<div className="mb-3 mt-3 ">
								<label htmlFor="symbol">Stock Symbol</label>
								<input
									type="text" className="form-control custom_input" id="symbol" placeholder="Enter valid stock symbol" name="symbol"
									value={symbol} onChange={handleSymbolChange} onBlur={validatesymbol} />
								{symbolError && <div className="text-danger">
									*This field cannot be empty
								</div>}
							</div>
							<div className="mb-3">
								<label htmlFor="date">Date</label><br />
								<DatePicker
									selected={date}
									className="form-control custom_input"
									id="date"
									onChange={handleDateChange}
									placeholder="Enter date"
									filterDate={(date) => !isDisabledDate(date)}
									minDate = {moment().subtract(2, 'years').toDate()}
									maxDate = {moment().subtract(2, 'days').toDate()}
									onBlur={validateDate}
								/>
								{dateError && <div className="text-danger">
									*This field cannot be empty
								</div>}
							</div>
							<button type="submit" disabled={!formValid || !isOnline} className="btn btn-sm btn-primary mb-2">Submit</button>
							{!formValid && <span className="text-danger mx-2">**All fields are mandatory</span>}
						</form>
						{tableData.stockData.length !== 0 &&
							<button className="btn btn-sm btn-danger" onClick={() => setTableData({ stockData: [] })}>Clear table data</button>}
							{!isOnline && 
							<div className="text-danger">
								<h3>Seems like low or no internet connection....</h3>
							</div>}
					</div>
					{(tableData?.stockData.length !== 0) &&

						<div className="col-sm-8">
							<TableData />
						</div>
					}
				</div>
			</div>
			<ToastContainer />
		</StockContext.Provider>
	);
}

export default App;