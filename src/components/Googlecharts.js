import React, {useEffect, useState} from 'react'
import { Chart } from "react-google-charts";
import "./styles.css"

function Googlecharts(){
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [showBar, setShowBar] = useState(false)
    const [barPlotData, setBarPlotData] = useState(false)
    const [barLabel, setBarLabel] = useState("Generate Bar Plot")
    const [pieLabel, setPieLabel] = useState("Generate Budget Plot")
    const[budget, setBudget] = useState(false)
    const[lowestPrice, setLowestPrice] = useState()
    const[lowestTitle, setLowestTitle] = useState()
    const[budgetCost, setBudgetCost] = useState()
    const[pieData, setPieData] = useState()
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
        req.open("GET", `walmart-products/${formattedEntry}/${userPages}`);
        req.send();
    }
    const refreshPage = () => {
        setData()
    }
    const generateBarPlot = () =>{
        if(barLabel=="Generate Bar Plot"){
            var i = 0;
            var j = 0;
            const chartData = [
                ["Product Title", "Price "],
            ];
            console.log(data["Inventory"].length)
            while(i<data["Inventory"].length){
                while(j<data["Inventory"][i].length){
                    var productTitle = data["Inventory"][i][j]["Product Title"]
                    var productPrice = parseFloat(data["Inventory"][i][j]["Product Price"].replace("$", ""))
                    console.log(productTitle)
                    chartData.push([productTitle, productPrice])
                    j+=1
                }
                i+=1
                j = 0;
            }
            setBarPlotData(chartData)
            setBarLabel("Hide Bar Plot")
            setShowBar(true)
        }else{
            setBarLabel("Generate Bar Plot")
            setShowBar(false)
        }
    }
    const generatePiePlot = () => {
        if(pieLabel == "Generate Budget Plot"){
            setBudget(true)
            setPieLabel("Hide Budget Plot")
        }else{
            setBudget(false)
            setPieLabel("Generate Budget Plot")
            setPieData()
        }
    }
    const piePlotData = () => {
        var priceBudget = document.getElementById("filter-budget").value;
        var product = ""
        var lowest = 10000
        var i = 0
        var j = 0
        while(i<data["Inventory"].length){
            while(j<data["Inventory"][i].length){
                if(!data["Inventory"][i][j]["monthly_payment"]){
                    var productPrice = parseFloat(data["Inventory"][i][j]["Product Price"].replace("$", "").replace(",", ""))
                    if (productPrice < lowest && productPrice < priceBudget){
                        lowest = productPrice
                        product = data["Inventory"][i][j]
                    }
                }
                j+=1
            }
            i+=1
            j = 0;
        }
        console.log(lowest)
        console.log(product["Product Title"])
        console.log(priceBudget)
        var percent = 100 * (lowest / parseFloat(priceBudget))
        const pieChartData = [
            ["Item", "Price"],
            [product["Product Title"], percent],
            ["Budget Left", 100 - percent]
        ];
        setLowestPrice(lowest)
        setBudget(false)
        setBudgetCost(parseFloat(priceBudget))
        setLowestTitle(product["Product Title"])
        setPieData(pieChartData)
    }   
    const options = {
        title: "Walmart Product Prices",
        chartArea: { width: "50%" },
        hAxis: {
          title: "Price $",
          minValue: 0,
        },
        vAxis: {
            textPosition: 'none',
          },
    };
    const pieOptions = {
        title: "",
        is3D: true,
    };
    return(
        <div>
            {!data && <div>
                <h1>Enter the product you wish to visualize!</h1>
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
            {data &&<div>
                <h1>Visualize Product Data with Google charts</h1>   
                <button class="btn" type="button" onClick={generateBarPlot}>{barLabel}</button>
                <button class="btn" type="button" onClick={generatePiePlot}>{pieLabel}</button>
                {budget && <div style={{padding: "3px"}}>
                <input type="text" placeholder="Enter your budget" class="inputfield" id='filter-budget'></input>
                <button class="btn" type="button" onClick={piePlotData}>Submit</button>
                 </div>}
                {showBar&&<Chart
                    chartType="BarChart"
                    width="100%"
                    height="600px"
                    data={barPlotData}
                    options={options}/>}
                {pieData && 
                <div>
                    <h3>Budget: ${budgetCost}</h3>
                    <h3>{lowestTitle}</h3>
                    <h3>Product Price: ${lowestPrice}</h3>
                    <h3>Saved: ${(budgetCost-lowestPrice).toFixed(2)}</h3>
                    <Chart
                        chartType="PieChart"
                        data={pieData}
                        options={pieOptions}
                        width={"100%"}
                        height={"400px"}
                    />
                </div>
                }
            </div>}
        </div>
    )
}

export default Googlecharts;
