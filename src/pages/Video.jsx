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
    const [peerId, setPeerId] = useState(null);
    const [idValue, setIdValue] = useState('');
    const currentUserVideoRef = useRef(null);
    const otherUserVideoRef = useRef(null);

    useEffect(() => {  
        const peer = new Peer();
        peer.on('open', (id) => {
            setPeerId(id);
        });
        return () => {
            peer.disconnect();
        };
    }, []);

    let myVideoStream;
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video:true, audio:true })
            .then(stream => {
                myVideoStream = stream;
                addVideoStream(currentUserVideoRef.current, stream);
            })
            .catch(error => {
                console.error('Error accessing camera or microphone:', error);
            });
    }, []);

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }

    const connectToNewUser = () => {
        const peer = new Peer();
        const call = peer.call(idValue, myVideoStream);
        call.on('stream', userVideoStream => {
            addVideoStream(otherUserVideoRef.current, userVideoStream);
        });
    }

    return (
        <>
            <Container>
                <Title>Test Video Chat</Title>
                <Title2>Your Id : {peerId}</Title2>
                <VideoContainer>
                    <VideoOwn ref={currentUserVideoRef} autoPlay ></VideoOwn>
                    <VideoOther ref={otherUserVideoRef} autoPlay ></VideoOther>
                </VideoContainer>
                <InputContainer>
                    <Input placeholder="Enter id" value={idValue} onChange={(e) => { setIdValue(e.target.value) }} />
                    <Button onClick={connectToNewUser}>Call Now</Button>
                </InputContainer>
            </Container>
        </>
    )
}


export default Video
