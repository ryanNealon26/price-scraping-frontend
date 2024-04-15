import React, {useEffect, useState} from 'react'
import "./styles.css"
import SelectBox from './SelectBox'

function RocketHomes(){
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
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
                </form>
                {loading && <h3>fetching listings...</h3>}
            </div>}
            {data && <div class="productHolder">
                <h3>Returned Lists can be found at https://www.walmart.com</h3>
                <h3>Number Of Listings Scraped {data["Property Data"].length}</h3>
                <button class="btn" onClick={refreshPage}>Search New</button>
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