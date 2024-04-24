import React, {useEffect, useState} from 'react'
import "./styles.css"
import SelectBox from './SelectBox'

function AiAssistant(){
    const [clear, setClear] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState(false)
    const [botText, setBotText] = useState("Prompt Chatbot")
    const [api, setApi] = useState(false)
    const [apiText, setApiText] = useState("Analyze API Data")
    var socket = new WebSocket("ws://localhost:8000/ws");
    var socketData = new WebSocket("ws://localhost:8000/ai");
    socket.onmessage = function(event) {
        var responses = document.getElementById("ai-field")
        console.log(event.data)
        var message = document.createElement('p')
        var title = document.createElement('p')
        message.style.textAlign = 'left'
        title.style.textAlign = 'left'
        title.style.fontWeight = 'bold'
        message.innerHTML = event.data
        title.innerHTML = "AI Assistant"
        responses.prepend(message)
        responses.prepend(title)
        setClear(true)
        setLoading(false)
    };
    socketData.onmessage = function(event) {
        var responses = document.getElementById("api-field")
        var message = document.createElement('p')
        var title = document.createElement('p')
        message.style.textAlign = 'left'
        title.style.textAlign = 'left'
        title.style.fontWeight = 'bold'
        message.innerHTML = event.data
        title.innerHTML = "AI Assistant"
        console.log(event.data)
        responses.prepend(message)
        responses.prepend(title)
        setLoading(false)
    }
    const deleteChild = () => {
        var responses = document.getElementById("ai-field")
        responses.textContent = '';
        setClear(false)
    }
    const sendPrompt = () => {
        var userPages  = document.querySelector('#ai-selector').value;
        setLoading(true)
        var userPrompt =  document.getElementById("ai-prompt").value
        console.log(userPrompt)
        console.log(userPages)
        socket.send(userPrompt)
        socket.send(userPages)
    }
    const chatbot = () => {
        if(botText=="Prompt Chatbot"){
            setBotText("Hide Chatbot")
            setSearch(true) 
            if(api==true){
                setApi(false)
                setApiText("Analyze API Data")
            }
        }
        if(botText=="Hide Chatbot"){
            setBotText("Prompt Chatbot")
            setSearch(false) 
        }
    }
    const apiBtn = () => {
        if(apiText=="Analyze API Data"){
            setApiText("Hide API Data")
            setApi(true)
            if(search==true){
                setSearch(false) 
                setBotText("Prompt Chatbot")
            }
        }
        if(apiText=="Hide API Data"){
            setApiText("Analyze API Data")
            setApi(false)
        }
    }
    const sendData = () => {
        setLoading(true)
        var state = document.getElementById("state-entry").value;
        var city = document.getElementById("city-entry").value;
        var userPrompt =  document.getElementById("api-prompt").value
        socketData.send(state)
        socketData.send(city)
        socketData.send(userPrompt)
    }
    return (
        <div>
            <h2>Model: llama3-70b</h2>
            <div style={{padding: "1.5px"}}>
                <button class="btn" type="button" onClick={chatbot}>{botText}</button>
                <button class="btn" type="button" onClick={apiBtn} >{apiText}</button>
            </div>
            {search && <div>
                <h3>Enter details about your ideal living conditions and the AI assistant will return suggested locations</h3>
                <div style={{padding: "1.5px"}}>
                    <select name="ai-selector" id="ai-selector">
                        <option value="Find Ideal Locations">Find Ideal Locations</option>
                        <option value="Learn about Locations">Learn about Locations</option>
                    </select>
                </div>
                <textarea id="ai-prompt" name="assistant" class='text-field 'rows="4" cols="50"></textarea>
                <div>
                    <button class="btn" type="button" onClick={sendPrompt}>Submit</button>
                    {clear && <button class="btn" type="button" onClick={deleteChild}>Clear</button>}
                </div>
                {loading && <h3>Generating Response...</h3>}
                <div id='ai-field' class="ai-field"></div>
            </div>}
            {api && <div>
                <input type="text" placeholder="Enter State Abbreviation" class="propertyInput" id='state-entry'></input>
                <input type="text" placeholder="Enter City" class="propertyInput" id='city-entry'></input>
                <div>
                    <h3>Enter preferences for price, sqft, and other housing details</h3>
                    <textarea id="api-prompt" name="assistant" class='text-field 'rows="4" cols="50"></textarea>
                </div>
                <button class="btn" type="button" onClick={sendData}>Submit</button>
                {loading && <h3>Generating Response...</h3>}
                <div id='api-field' class="ai-field"></div>
            </div>}
        </div>
    )
}

export default AiAssistant;