import React, {useEffect, useState} from 'react'
import "./styles.css"
function Search(){
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const[lowest, setHighest] = useState("Highest")
    const[budget, setBudget] = useState(false)
    const[isBudget, setisBudget] = useState(false)
    const[budgetText, setBudgetText] = useState("Filter Budget")
    const[temp, setTemp] = useState([])
    function apiResponse () {
        const apiData = JSON.parse(this.responseText);
        setData(apiData)
        setLoading(false)
    }
    const apiCall = () => {
        var userEntry = document.getElementById("product-entry").value;
        var userPages  = document.querySelector('#pageSelect').value;
        console.log(userEntry)
        if(userEntry==''){
            alert("Please Make Sure you have entered a product");
            return
        }
        setLoading(true)
        var formattedEntry = userEntry.replace("", "+");
        const req = new XMLHttpRequest();
        req.addEventListener("load", apiResponse);
        req.open("GET", `walmart-products/sorted/${formattedEntry}/${userPages}`);
        req.send();
    }
    const sortProducts = () => {
        if(lowest=="Highest"){
            setHighest("Lowest")
            data["Sorted Products"] = data["Sorted Products"].slice(0).reverse()
        }
        if(lowest=="Lowest"){
            setHighest("Highest")
            data["Sorted Products"] = data["Sorted Products"].slice(0).reverse()
        }
    }
    const refreshPage = () => {
        window.location.reload(false);
    }
    const filter = () =>{
        if(budget==false){
            setBudget(true)
            setBudgetText("Hide Filter")
        }else{
            setBudget(false)
            setBudgetText("Filter Budget")
        }
    }
    const filterBudget = () => {
        setLoading(true)
        var budget = document.getElementById("filter-budget").value;
        var counter = 0
        var budgetList = []
        if(budget=='' || isNaN(parseFloat(budget))){
            alert("Please Make Sure you have entered a integer, example 50 or 50.0");
            return;
        }
        while(counter < data["Sorted Products"].length){
            var productPrice = parseFloat(data["Sorted Products"][counter]["Product Price"].replace("$", ""))
            if(productPrice < budget){
                budgetList.push(data["Sorted Products"][counter])
            }
            counter+=1
        }
        setTemp(data["Sorted Products"])
        data["Sorted Products"] = budgetList
        setLoading(false)
        setBudget(false)
        setisBudget(true)
        setBudgetText("Filter")
    }
    const unFilter = () => {
        setisBudget(false)
        console.log(temp)
        data["Sorted Products"] = temp
    }
    return (
        <div>
            {!data && <div>
                <h1>Enter the product to search for.</h1>
                <h3>More Pages Scraped The Longer The Request Takes</h3>
                <form>
                    <select id="pageSelect">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <input type="text" placeholder="Search for products" class="inputfield" id='product-entry'></input>
                    {!loading && <button class="btn" type="button" onClick={apiCall}>Search</button>}
                    {loading && <button class="btn" type="button" onClick={refreshPage}>Cancel</button>}
                </form>
                {loading && <h3>fetching products...</h3>}
            </div>}
            {data && <div class="productHolder">
            <h3>Returned Products can be found at https://www.walmart.com</h3>
            <h3>Number of products scraped: {data["Sorted Products"].length}</h3>
            <button class="btn" onClick={refreshPage}>Search New</button>
            <button class="btn" onClick={sortProducts}>Sort {lowest}</button>
            {!isBudget && <button class="btn" onClick={filter}>{budgetText}</button>}
            {isBudget && <button class="btn" onClick={unFilter}>Unfilter</button>}
            {budget && <div>
                <input type="text" placeholder="Enter your budget" class="inputfield" id='filter-budget'></input>
                <button class="btn" type="button"  onClick={filterBudget}>Search</button>
            </div>}
            {loading && <h3>Sorting Products...</h3>}
                {data["Sorted Products"].map((product, index)=>(
                    <a target="_blank" href={product["Product Link"]} class="links">
                         <div alt={index} class="product">
                            <img class="productImage" src={product["Image Link"]}></img>
                            <h3 class="productText">{product["Product Price"]}</h3>
                            <p class="productText">{product["Product Title"]}</p>
                        </div>
                    </a>
                ))}
            </div>}
        </div>
    )
}
export default Search;