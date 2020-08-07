// const { text } = require("express");

const socket = io('/')

const videoGrid = document.getElementById('video_grid')
console.log(videoGrid)
const myVideo = document.createElement('video');
console.log(myVideo)
myVideo.muted = true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
}); 


// This line used to access the vidoe and audio from ch

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream;
    addVidoeStream(myVideo,stream)
    peer.on('call',call=>{
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (userVideoStream) =>{
          addVidoeStream(video,userVideoStream)
        });
    })
    

    socket.on('user-connected',(userId)=>{
        connecToNewUser(userId,stream);
    })
    
    let msg = $('input');
    console.log('dsd',msg)
    
    $('html').keydown((e)=>{
        if(e.which == 13 && msg.val().length !==0){
    console.log(msg.val())
    
            socket.emit('message' , msg.val())
            msg.val('')
        }
    })
    
    
    socket.on('createMessage',message=>{
        $('.messages').append(`<li class='message'><b>User</b> <br />${message}</li>`)
        console.log(message);
    })

})


peer.on('open',id =>{
    socket.emit('join-room',ROOM_ID,id);
})





const connecToNewUser = (userId,stream) =>{
    var call = peer.call(userId, stream);
    const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    addVidoeStream(video,userVideoStream)
  });

}

//this function load a metadata to video element and play the video

const addVidoeStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadmetadata',()=>{
        video.play()
    })

    videoGrid.append(video)
}

//  muuted buuton 

const muteButton = () =>{
    console.log(myVideoStream)
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        // setUnmuteButton();
    }else{
        // setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled =  true;
    }

}

const playStop = () =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
    }else{
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}