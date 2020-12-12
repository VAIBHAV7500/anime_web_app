
const player = require('./player');

const onLoad = (wss) => {
  let disc;
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      const body = JSON.parse(message);
      //player
      if(body.type === "sessions"){
        player.updateSession(body);
      }else if(body.type === "discussion"){
        // disc = setInterval(()=>{
        //   const data = player.getDiscussion(body);
        //   data.type = "discussion";
        //   ws.send(JSON.stringify(data));
        // },3*1000);
          player.getDiscussion(body).then((data)=>{
            const body = {
              type: "discussion",
              messages: data
            }
            ws.send(JSON.stringify(body));
          });
      }else if(body.type === "sender"){
        player.newMessage(body);
      }
    });

  });

  wss.on('disconnect',()=>{
    console.log('Disconnect');  
    if(disc){
      clearInterval(disc);
    }
  });
}

module.exports = {
  onLoad,
}