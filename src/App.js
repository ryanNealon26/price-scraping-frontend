import './App.css';
import Search from './components/Search';
import Googlecharts from './components/Googlecharts';
import RocketHomes from './components/RocketHomes';
import AiAssistant from './components/AiAssistant';
import React, {useEffect, useState} from 'react'
function App() {
  const[search, setSearch] = useState(true)
  const[charts, setCharts] = useState(true)
  const[rocketHomes, setRocketHomes] = useState(true)
  const[hideButton, setHideButton] = useState(true)
  const[assistant, setAssistant] = useState(true)
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
  const aiAssistant = () => {
    setAssistant(false)
    setHideButton(false)
    SetReturnHome("Return Home")
  }
  return (
    <div className="App">
      <div class="topnav">
        <button class="changeState" onClick={refreshPage}><h3>{returnHome}</h3></button>
      </div>
      {hideButton &&
      <div>
          <h2>Navigate to either pull product and real estate data</h2>
        <div class="btn-holder">
          <button class='select-btn' onClick={productSearch}>
            <h3>Search for Walmart Products</h3>
          </button>
        </div>
        <div class="btn-holder">
          <button class='select-btn' onClick={googleCharts}>
            <h3>Visualize Walmart Product Data</h3>
          </button>
        </div>
        <div class="btn-holder">
          <button class='select-btn' onClick={RealEstate}>
            <h3>Search for Real Estate Listings</h3>
          </button>
        </div>
        <div class="btn-holder">
          <button class='select-btn' onClick={aiAssistant}>
            <h3>Real Estate AI Assistant</h3>
          </button>
        </div>
      </div>}
      {!search && <Search></Search>}
      {!charts &&  <Googlecharts></Googlecharts>}
      {!rocketHomes && <RocketHomes></RocketHomes>}
      {!assistant && <AiAssistant></AiAssistant>}
    </div>
  );
}

export default App;
