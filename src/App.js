import './App.css';
import Search from './components/Search';
import Googlecharts from './components/Googlecharts';
import React, {useEffect, useState} from 'react'
function App() {
  const[search, setSearch] = useState(true)
  const[charts, setCharts] = useState(true)
  const[hideButton, setHideButton] = useState(true)
  const productSearch = () => {
    setSearch(false)
    setHideButton(false)
  }
  const googleCharts = () => {
    setCharts(false)
    setHideButton(false)
  }
  return (
    <div className="App">
      <div class="topnav">
        <button class="changeState" ><h3>Price Scraping Service</h3></button>
      </div>
      {hideButton &&<h2>Navigate to either pull product prices or visualize product data</h2>}
      {hideButton && <div class="btn-holder">
        <button class='select-btn' onClick={productSearch}>
          <h3>Search for Walmart Products</h3>
        </button>
      </div>}
      {hideButton && <div class="btn-holder">
         <button class='select-btn' onClick={googleCharts}>
          <h3>Visualize Walmart Product Data</h3>
        </button>
      </div>}
      {!search && <Search></Search>}
      {!charts &&  <Googlecharts></Googlecharts>}
    </div>
  );
}

export default App;
