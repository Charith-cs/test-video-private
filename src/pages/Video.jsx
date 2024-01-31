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
    const peer = useRef(new Peer());
    const ownVideoRef = useRef(null);
    const otherVideoRef = useRef(null);
    const [peerId, setPeerId] = useState(null);
    const [callId, setCallId] = useState('');

    useEffect(() => {
        peer.current.on('open', (id) => {
            setPeerId(id);
        });

        // Clean up PeerJS when component unmounts
        return () => {
            peer.current.destroy();
        };
    }, []);

    const startCall = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                const call = peer.current.call(callId, stream);
                call.on('stream', remoteStream => {
                    if (ownVideoRef.current) {
                        ownVideoRef.current.srcObject = stream;
                        ownVideoRef.current.play();
                    }
                });
            })
            .catch(err => {
                console.error('Failed to get local stream', err);
            });
    };

    peer.current.on('call', call => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                call.answer(stream);
                call.on('stream', remoteStream => {
                    if (otherVideoRef.current) {
                        otherVideoRef.current.srcObject = remoteStream;
                        otherVideoRef.current.play();
                    }
                });
            })
            .catch(err => {
                console.error('Failed to get local stream', err);
            });
    });

    return (
        <>
            <Container>
                <Title>Test Video Chat</Title>
                <Title2><p style={{ color: 'red' }}>Your Id: </p> {peerId}</Title2>

                <VideoContainer>
                    <Title2>Own</Title2>
                    <video ref={ownVideoRef} autoPlay muted />

                    <Title2>Other</Title2>
                    <video ref={otherVideoRef} autoPlay />

                </VideoContainer>

                <InputContainer>
                    <Input placeholder="Enter id" value={callId} onChange={(e) => { setCallId(e.target.value) }} />
                    <Button onClick={startCall}>Call Now</Button>
                </InputContainer>
            </Container>
        </>
    );
};
export default Video
