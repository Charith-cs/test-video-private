import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import styled from "styled-components";
import { mobile } from '../responsive';

const Container = styled.div`
    display:none;
    ${mobile({ display: 'block' })}
`;
const Title = styled.h2`
    text-align: center;
`;
const Title2 = styled.h4`
    text-align: center;
`;
const VideoContainer = styled.div`
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
`;
const VideoOwn = styled.video`
    width: 300px;
    height: 200px;
    border: 1px solid black;
    object-fit: cover;
    border-radius: 10px;
`;
const VideoOther = styled.video`
    width: 300px;
    height: 200px;
    border: 1px solid blue;
    object-fit: cover;
    border-radius: 10px;
`;
const InputContainer = styled.div`
    display: flex;
    margin-top: 20px;
    align-items: center;
    justify-content: center;
`;
const Input = styled.input`
    padding: 10px;
    border-radius: 10px;
`;
const Button = styled.button`
    padding: 8px;
    border-radius: 10px;
    background-color: darkblue;
    color: white;
    font-size: 18px;
    font-weight: 600;
`;

const Video = () => {

    const peer = new Peer();
    //const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const currentUserVideoRef = useRef(null);
    const otherUserVideoRef = useRef(null);
    const [peerId, setPeerId] = useState(null);
    const [idValue, setIdValue] = useState('');

    useEffect(() => {  
        peer.on('open', (id) => {
            setPeerId(id);
        });
        return () => {
            peer.disconnect();
        };
    }, []);

    const call = () => {
        currentUserVideoRef.current.muted = true;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                const call = peer.call(idValue, stream);
                call.on('stream', (remoteStream) => {
                    otherUserVideoRef.current.srcObject = remoteStream;
                    otherUserVideoRef.current.play();
                });
            })
            .catch(err => {
                alert('Failed to get local stream', err);
            });
    };

    peer.on('call', function (call) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                call.answer(stream);
                call.on('stream', function (remoteStream) {
                    otherUserVideoRef.current.srcObject = remoteStream;
                    otherUserVideoRef.current.play();
                });
            })
            .catch(err => {
                alert('Failed to get local stream', err);
            });
    });

    return (
        <>
            <Container>
                <Title>Test Video Chat</Title>
                <Title2>Your Id : {peerId}</Title2>
                <VideoContainer>
                    <VideoOwn ref={currentUserVideoRef} autoPlay playsInline ></VideoOwn>
                    <VideoOther ref={otherUserVideoRef} autoPlay playsInline></VideoOther>
                </VideoContainer>
                <InputContainer>
                    <Input placeholder="Enter id" value={idValue} onChange={(e) => { setIdValue(e.target.value) }} />
                    <Button onClick={call}>Call Now</Button>
                </InputContainer>
            </Container>
        </>
    )
}




            {  /*  <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
    <h1>Hello, let's check the webcam</h1>
    <video id="vid" style={{ width: "300px", height: "200px", border: "1px solid black", display: isWebcamOpen ? "block" : "none" }} ></video>
    <br />
    <button id="but"  style={{ display: isWebcamOpen ? "none" : "block" }}>Open Webcam</button>
  </div>
  
  
      const handleOpenWebcam = () => {
        const video = document.getElementById("vid");
        video.muted = true;

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadedmetadata", () => {
                    video.play();
                    setIsWebcamOpen(true);
                });
            })
            .catch((error) => {
                console.error("Error accessing webcam:", error);
                alert("Failed to access webcam. Please check permissions and try again.");
            });
    };
  
  */}
        

export default Video
