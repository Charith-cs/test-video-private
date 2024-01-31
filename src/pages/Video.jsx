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
    const OwnVideo = useRef(null);
    const OtherVideo = useRef(null);
    const [peerId, setPeerId] = useState(null);
    const [callId, setCallId] = useState(null);

    useEffect(() => {
        peer.on('open', (id) => {
            setPeerId(id);
        });
    }, []);

    const startCall = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true },
            (stream) => {
                var call = peer.call(callId.toString(), stream);
                call.on('stream', function (remoteStream) {
                    OwnVideo.current.mute = true;
                    OwnVideo.current.srcObject = remoteStream;
                    OwnVideo.current.play();
                });
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
    }

    
    peer.on('call',  (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true } , (stream) => {
            call.answer(stream); 
            call.on('stream', function (remoteStream) {
                OtherVideo.current.srcObject = remoteStream;
                OtherVideo.current.play();
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    });

    return (
        <>
            <Container>
                <Title>Test Video Chat</Title>
                <Title2><p style={{ color: 'red' }}>Your Id: </p> {peerId}</Title2>

                <VideoContainer>

                    <Title2>Own</Title2>
                    <VideoOwn ref={OwnVideo} autoPlay />

                    <Title2>Other</Title2>
                    <VideoOther ref={OtherVideo} autoPlay />

                </VideoContainer>

                <InputContainer>
                    <Input placeholder="Enter id" value={callId} onChange={(e) => { setCallId(e.target.value) }} />
                    <Button onClick={startCall}>Call Now</Button>
                </InputContainer>
            </Container>
        </>
    )
}
export default Video
