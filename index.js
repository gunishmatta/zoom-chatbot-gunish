require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Welcome to test Bot")
})

app.get('/authorize', (req, res) => {
    res.redirect('https://zoom.us/launch/chat?jid=robot_' + process.env.zoom_bot_jid)
})

app.get('/zoomverify/verifyzoom.html', (req, res) => {
    res.send(process.env.zoom_verification_token)
})

app.post('/unsplash', (req, res) => {
    console.log(req.body)
    res.send('Chat received')
})

app.post('/deauthorize',(req,res)=>{
    if(req.headers.authorization===process.env.zoom_verification_token)
    {
        res.status(200)
        res.send()
        request({
            url:'https://api.zoom.us/oauth/data/compliance',
            method:'POST',
            json:true,
            body:{
                'client_id':req.body.payload.client_id,
                'user_id': req.body.payload.user_id,
                'account_id': req.body.payload.account_id,
                'deauthorization_event_received': req.body.payload,
                'compliance_completed': true
            },
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64'),
                'cache-control': 'no-cache'
            }
        },(error,httpResponse,body)=>{
            if (error) {
                console.log(error)
              } else {
                console.log(body)
              }
        })
    }
    else {
        res.status(401)
        res.send('Unauthorized request to Unsplash Chatbot for Zoom.')
      }
})

app.listen(port,()=>console.log("Serving the bot"))