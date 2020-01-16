const express = require('express');
const app = express();
app.listen(3000, ()=>console.log('listeing at 3000'));

app.post('/location', (request, response)=>{
    console.log('i got a response');
    console.log(request.body);
    response.header("Access-Control-Allow-Origin", "*");
    response.json({
        status: "success",
        response: "here will have response from search"
    })
    
})

