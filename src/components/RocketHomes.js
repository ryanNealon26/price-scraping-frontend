import React, {useEffect, useState} from 'react'
import "./styles.css"
import SelectBox from './SelectBox'

function RocketHomes(){
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const[lowest, setHighest] = useState("Highest")
    const[budget, setBudget] = useState(false)
    const[budgetText, setBudgetText] = useState("Filter")
    const[temp, setTemp] = useState([])
    function apiResponse () {
        const apiData = JSON.parse(this.responseText);
        setData(apiData)
        setLoading(false)
    }
    const apiCall = () => {
        var state = document.getElementById("state-entry").value;
        var city = document.getElementById("city-entry").value;
        var userPages  = document.querySelector('#pageSelect').value;
        if(state=='' || city==''){
            alert("Please Make Sure You Fill out Both Fields");
            return
        }
        setLoading(true)
        var formattedEntry = city.replace(" ", "-");
        const req = new XMLHttpRequest();
        req.addEventListener("load", apiResponse);
        req.open("GET", `rocket-homes/${state}/${formattedEntry}/${userPages}`);
        req.send();
    }
    const sortProducts = () => {
        if(lowest=="Highest"){
            setHighest("Lowest")
            data["Property Data"] = data["Property Data"].slice(0).reverse()
        }
        if(lowest=="Lowest"){
            setHighest("Highest")
            data["Property Data"] = data["Property Data"].slice(0).reverse()
        }
    }
    const filter = () => {
        if(budgetText=="Filter"){
            setBudget(true)
            setBudgetText("Unfilter")
        }else{
            setBudget(false)
            setBudgetText("Filter")
            data["Property Data"] = temp
        }
    }

    const filterPrices = () => {
        var lowerBound = document.getElementById("lower-bound").value;
        var upperBound = document.getElementById("upper-bound").value;
        if(lowerBound == '' || upperBound == ''){
            alert("Please Make Sure You Fill out Both Fields");
            return
        }
        var lowerPrice = parseFloat(lowerBound.replace("$", "").replaceAll(",", ""))
        var upperPrice = parseFloat(upperBound.replace("$", "").replaceAll(",", ""))
        console.log(upperPrice)
        var filteredArray = []
        setTemp(data["Property Data"])
        for(let i = 0; i<data["Property Data"].length; i+=1){
            var price = parseInt(data["Property Data"][i]["Property Price"].replace("$", "").replaceAll(",", ""))
            if(price >= lowerPrice && price <= upperPrice){
                filteredArray.push(data["Property Data"][i])
            }
        }
        data["Property Data"] = filteredArray
        setBudget(false)
    }
    const refreshPage = () => {
        setData()
    }
    return(
        <div>
            {!data && <div>
                <h2>Enter the State Abbreviation and City To Search Properties In!</h2>
                <h3>More Pages Scraped The Longer The Request Takes</h3>
                <form>
                    <SelectBox></SelectBox>
                    <input type="text" placeholder="Enter State Abbreviation" class="propertyInput" id='state-entry'></input>
                    <input type="text" placeholder="Enter City" class="propertyInput" id='city-entry'></input>
                    {!loading && <button class="btn" type="button" onClick={apiCall}>Search</button>}
                    {loading && <button class="btn" type="button" onClick={refreshPage}>Cancel</button>}
                </form>
                {loading && <h3>fetching listings...</h3>}
            </div>}
            {data && <div class="productHolder">
                <h3>Returned Listings can be found at https://www.rockethomes.com/</h3>
                <h3>Number Of Listings Scraped {data["Property Data"].length}</h3>
                <button class="btn" onClick={refreshPage}>Search New</button>
                <button class="btn" onClick={sortProducts}>Sort {lowest}</button>
                <button class="btn" onClick={filter}>{budgetText} Listings</button>
                {budget && <div style={{padding: "3px"}}>
                <input type="text" placeholder="Enter Your Lower Bound" class="filterField" id='lower-bound'></input>
                <input type="text" placeholder="Enter Your Upper Bound" class="filterField" id='upper-bound'></input>
                <button class="btn" type="button" onClick={filterPrices}>Submit</button>
                 </div>}
                {data["Property Data"].map((property, index)=>(
                    <a target="_blank" href={property["Property Link"]} class="links">
                         <div alt={index} class="product">
                            <img class="productImage" src={property["Property Photo"]}></img>
                            <h3 class="productText">{property["Property Price"]}</h3>
                            <p class="productText">{property["Square Feet"]} || {property["Bedrooms"]} || {property["Bathrooms"]}</p>
                            <p class="productText">{property["Address"]}</p>
                        </div>
                    </a>
                ))}
            </div>}
        </div>
    )
}

export default RocketHomes;