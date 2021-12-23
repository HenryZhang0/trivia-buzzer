const io = require("socket.io")();

const { makeid } = require("./utils");


const fs = require('fs'); 

let state = {};

fs.readFile('db.json', 'utf-8', (err, data) => {
  if (err) {throw err}
  state = JSON.parse(data.toString());
});
 
const clientRooms = {};
let playerNames = {}

let roomCodes = {}

class State {
  constructor(room) {
      this.room = room
      this.players = {}
      this.buzzes = {}

      this.addPlayer = (id, playerName) => {
          this.players[id] = playerName;
      } 
      this.buzz = (id, time) => {
          this.buzzes[id] = time;
      }
      this.clearBuzz = () => {
          this.buzzes = {};
      }
  }
   
}

io.on("connection", (client) => { 
  client.on("hi", ()=>{
    console.log('socket connected ',client.id);
  })
  client.on("disconnect", () => {
    room = roomCodes[client.id]
    if(!room)
      return
    console.log(client.id,' disconnect from room ', room)
    state[room] = state[room].filter(player => {
      if(player.id == client.id)
        return false
      return true
    }) 
    delete roomCodes[client.id];
    emitGameState(room, state[room]) 
  })
  client.on("kickPlayer", id => {
    room = roomCodes[id]
    if(!room)
      return
    console.log(id,' kicked from room ', room)
    state[room] = state[room].filter(player => {
      if(player.id == id)
        return false
      return true
    }) 

    emitGameState(room, state[room]) 
    io.sockets.sockets.forEach((socket) => {
      if(socket.id === id) {
          socket.emit('youbeenkicked')
          socket.leave(room)        
      }
    });
    delete roomCodes[id]
  })

  client.on("new-room", (code, name)=>{
    id = String(client.id)
    state[code] = [ 
      {
        id:String(id),
        name: name,
        time: false,
        team: 0,
        points: 0 
      }
    ]
    client.join(code)
    roomCodes[id] = code;
    client.emit('enter-room',code,state)
    emitGameState(code, state[code])
  })

  client.on('join-room', (code,name, callback) =>{
    exists = false
    if(state[code]){
      exists = true
    }
    callback({
      status: exists
    })
    if(!exists)
      return
    client.join(code)
    state[code] = [...state[code],{
      id:String(client.id),
      name: name,
      time: false,
      team: 0,
      points: 0
    }]
    roomCodes[client.id] = code;
    client.emit('enter-room',code,state)
    emitGameState(code, state[code])
  })
  client.on('buzz', (code,time) => {
    state[code] = state[code].map((player) =>
      player.id === String(client.id) ? { ...player, time: time } : player
    )
    console.log(state)
    emitGameState(code, state[code])
  })
  client.on('changeTeam', (code) => {
    state[code] = state[code].map((player) =>
      player.id === String(client.id) ? { ...player, team: !player.team? 1:0 } : player
    )
    //console.log(state) 
    emitGameState(code, state[code])
      
  }) 
  client.on('reset', (code) => {
    state[code] = state[code].map((player) => {
      return { ...player, time: false }
    })
    //console.log(state) 
    io.sockets.in(code).emit("resetBuzzer")
    emitGameState(code, state[code])
  })
  client.on('changebg', (code,link) => {
    io.sockets.in(code).emit("changebg",link)
  })
  function emitGameState(room, gameState) {
    // Send this event to everyone in the room.
    io.sockets.in(room).emit("gameState", gameState);
    console.log('emitting');
  }

  
});








//io.listen(process.env.PORT || 3000);
io.listen(4000);
