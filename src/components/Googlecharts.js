import React, {useEffect, useState} from 'react'
import { Chart } from "react-google-charts";
import "./styles.css"
import SelectBox from './SelectBox';

function Googlecharts(){
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [showBar, setShowBar] = useState(false)
    const [barPlotData, setBarPlotData] = useState(false)
    const [sortedData, setSortedData] = useState(false)
    const [barLabel, setBarLabel] = useState("Generate Bar Plot")
    const[sortedBar, setSortedBar] = useState(false)
    const [pieLabel, setPieLabel] = useState("Generate Budget Plot")
    const [sortLabel, setSortLabel] = useState("Sort Data")
    const[budget, setBudget] = useState(false)
    const[lowestTitle, setLowestTitle] = useState()
    const[productList, setProductList] = useState()
    const[budgetCost, setBudgetCost] = useState()
    const[productIndex, setProductIndex] = useState(1)
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
    const sortPlotData = () => {
        if(sortLabel=="Sort Data"){
            var data = barPlotData.slice()
            data.shift()
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < (data.length - i - 1); j++) {
                    if (data[j][1] < data[j + 1][1]) {
                        var temp = data[j]
                        data[j] = data[j + 1]
                        data[j + 1] = temp
                    }
                }
            }
            data.unshift(["Product Title", "Price"])
            console.log(data)
            setSortedData(data)
            setSortedBar(true)
            setSortLabel("Unsort Data")
        }else{
            console.log(barPlotData)
            setSortedBar(false)
            setSortLabel("Sort Data")
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
        var productList = []
        var i = 0
        var j = 0
        while(i<data["Inventory"].length){
            while(j<data["Inventory"][i].length){
                if(!data["Inventory"][i][j]["monthly_payment"]){
                    var productPrice = parseFloat(data["Inventory"][i][j]["Product Price"].replace("$", "").replace(",", ""))
                    if (productPrice < priceBudget){
                        product = data["Inventory"][i][j]
                        productList.unshift(product)
                    }
                }
                j+=1
            }
            i+=1
            j = 0;
        }
        if(productList.length==0){
            alert("Your budget was to low and no products were returned at that price.")
            return;
        }
        var percent = 100 * (parseFloat(product["Product Price"].replace("$", "").replace(",", "")) / parseFloat(priceBudget))
        const pieChartData = [
            ["Item", "Price"],
            [product["Product Title"], percent],
            ["Budget Left", 100 - percent]
        ];
        
        setBudget(false)
        setBudgetCost(parseFloat(priceBudget))
        setLowestTitle(product)
        setPieData(pieChartData)
        setProductList(productList)
    }
    const nextProduct = () => {
        setProductIndex(productIndex+1)
        if(productIndex==productList.length){
            setProductIndex(1)
            alert("No More Products fit under you budget")
            var productPrice = productList[0]["Product Price"].replace("$", "").replace(",", "")
            var percent = 100 * (productPrice / parseFloat(budgetCost))
            const pieChartData = [
                ["Item", "Price"],
                [productPrice, percent],
                ["Budget Left", 100 - percent]
            ];
            setLowestTitle(productList[0])
            setPieData(pieChartData)
        }else{
            console.log(productList.length)
            console.log(productIndex)
            var productPrice = productList[productIndex]["Product Price"].replace("$", "").replace(",", "")
            var percent = 100 * (productPrice / parseFloat(budgetCost))
            const pieChartData = [
                ["Item", "Price"],
                [productPrice, percent],
                ["Budget Left", 100 - percent]
            ];
            setLowestTitle(productList[productIndex])
            setPieData(pieChartData)
        }
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
                    <SelectBox></SelectBox>
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
                {showBar&& 
                <div style={{padding: "3px"}}>
                    <button class="btn" onClick={sortPlotData}>{sortLabel}</button>
                    {!sortedBar && <Chart
                    chartType="BarChart"
                    width="100%"
                    height="600px"
                    data={barPlotData}
                    options={options}/>}
                    {sortedBar && <Chart
                    chartType="BarChart"
                    width="100%"
                    height="600px"
                    data={sortedData}
                    options={options}/>}
                </div>}
                {pieData && 
                <div>
                    <h4>Budget: ${budgetCost}</h4>
                    <a target="_blank" href={lowestTitle["Product Link"]}>
                        <h4>{lowestTitle["Product Title"]}</h4>
                    </a>
                    <h4>Product Price: {lowestTitle["Product Price"]}</h4>
                    <h4>Saved: ${(budgetCost-parseFloat(lowestTitle["Product Price"].replace("$", "").replace(",", "")).toFixed(2))}</h4>
                    <button class="btn" onClick={nextProduct}>Next Product</button>
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
