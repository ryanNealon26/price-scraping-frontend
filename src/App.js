import './App.css';
import Search from './components/Search';
import Googlecharts from './components/Googlecharts';
import RocketHomes from './components/RocketHomes';
import React, {useEffect, useState} from 'react'
function App() {
  const[search, setSearch] = useState(true)
  const[charts, setCharts] = useState(true)
  const[rocketHomes, setRocketHomes] = useState(true)
  const[hideButton, setHideButton] = useState(true)
  const[returnHome, SetReturnHome] = useState("Price Scraping Service")
  const productSearch = () => {
    setSearch(false)
    setHideButton(false)
    SetReturnHome("Return Home")
  }
  const googleCharts = () => {
    setCharts(false)
    setHideButton(false)
    SetReturnHome("Return Home")
  }
  const RealEstate = () => {
    setRocketHomes(false)
    setHideButton(false)
    SetReturnHome("Return Home")
  }
  const refreshPage = () => {
    window.location.reload()
  }
  return (
    <div className="App">
      <div class="topnav">
        <button class="changeState" onClick={refreshPage}><h3>{returnHome}</h3></button>
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
      {hideButton && <div class="btn-holder">
         <button class='select-btn' onClick={RealEstate}>
          <h3>Search for ROCKET Homes Properties</h3>
        </button>
      </div>}
      {!search && <Search></Search>}
      {!charts &&  <Googlecharts></Googlecharts>}
      {!rocketHomes && <RocketHomes></RocketHomes>}
    </div>
  );
}

export default App;
