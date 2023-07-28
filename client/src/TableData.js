import { useContext } from 'react';
import StockContext from './config/StockContext';


const TableData = () => {
    const tableData = useContext(StockContext);
    console.log("tableData", tableData.stockData);
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Sr no.</th>
                    <th>Stock Symbol</th>
                    <th>Date</th>
                    <th>Volume</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                </tr>
            </thead>
           <tbody>
                { 
                    tableData?.stockData.stockData.map((stock, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{stock.symbol}</td>
                            <td>{stock.from}</td>
                            <td>{stock.volume}</td>
                            <td>{stock.open}</td>
                            <td>{stock.high}</td>
                            <td>{stock.low}</td>
                            <td>{stock.close}</td>
                        </tr>
                    )
                    // console.log("stock", tableData?.stockData.stockData)
                }
            </tbody>
        </table>
    )
}

export default TableData;