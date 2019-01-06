const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//init nextmo
const nexmo = new Nexmo({
  apiKey: '275b87fb',
  apiSecret: 'DbbyQHBlxNTLyWi9'
}, {debug: true});

const app = express();

//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Public folder
app.use(express.static(__dirname + '/public'))

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route
app.get('/', (req, res) => {
  res.render('index');
});

//post
app.post('/', (req, res) => {
//  res.send(req.body);
  //console.log(req.body);+
const number = req.body.number;
const text = req.body.text;

nexmo.message.sendSms(
  '525566965347', number, text, {type: 'unicode'},
  (err, responseData) => {
    if(err) {
      console.log(err);
    } else {
      console.dir(responseData);
      //Get data from response
      const data = {
        id: responseData.messages[0]['message-id'],
        number: responseData.messages[0]['to']
      }

      //Emit to the client
      io.emit('smsStatus', data);
    }
  }
)

});


const port = 3000;

const server = app.listen(port, () => {
  console.log('servidor corriendo en el puerto 3000');
});

//Conectare con socket io

const io = socketio(server);
io.on('connection', (socket) => {
  console.log('connected');
  io.on('disconnect', () => {
    console.log('disconnect');
  })
})
