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
    const peer = useRef(new Peer());

    useEffect(() => {
        peer.current.on('open', (id) => {
            setPeerId(id);
        });
        return () => {
            peer.current.disconnect();
        };
    }, []);

    let myVideoStream;
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myVideoStream = stream;
                addVideoStream(currentUserVideoRef.current, stream);
            })
            .catch(error => {
                alert('Error accessing camera or microphone:', error);
            });
        return () => {
            if (myVideoStream) {
                myVideoStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.play();
    }

    const connectToNewUser = () => {
        const call = peer.current.call(idValue, myVideoStream);
        call.on('stream', userVideoStream => {
            addVideoStream(otherUserVideoRef.current, userVideoStream);
        });
    }

    peer.current.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                call.answer(stream); 
                call.on('stream', function (remoteStream) {
                    addVideoStream(otherUserVideoRef.current, remoteStream);
                });
            })
            .catch(error => {
                alert('Error accessing camera or microphone:', error);
            });
    });

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
