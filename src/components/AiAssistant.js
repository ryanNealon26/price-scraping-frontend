import React, {useEffect, useState} from 'react'
import "./styles.css"

function AiAssistant(){
    var socket = new WebSocket("ws://localhost:8000/ws");
    socket.onmessage = function(event) {
        console.log(event.data)
    };
    const sendPrompt = () => {
        var userPrompt =  document.getElementById("ai-prompt").value
        console.log(userPrompt)
        socket.send(userPrompt)
    }
    return (
        <div>
            <h2>GPT Turbo Model 3.5</h2>
            <h3>Enter details about your ideal living conditions and the AI assistant will return suggested locations</h3>
            <textarea id="ai-prompt" name="assistant" rows="4" cols="50"></textarea>
            <div>
                <button class="btn" type="button" onClick={sendPrompt}>Submit</button>
            </div>
        </div>
    )
}

export default AiAssistant;