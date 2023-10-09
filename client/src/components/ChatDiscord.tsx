import { ChatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { PREXIX_SERVER_URL } from "../utils/env";
import ChatAndAudio from "./ChatAudioAndVideo";
import { Messenger } from "./Messenger";
import { socket_global } from "../utils/sockets";
import { AuthContext } from "../providers/AuthProvider";

export const ChatDiscordButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        variant="outline"
      >
        {/* Open */}
        <ChatIcon />
      </Button>
    </>
  );
};

export const ChatDiscord: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [inputState, setInputState] = useState("");

  const { user } = useContext(AuthContext);

  const submitMessageFn = async (msg: string, roomId: string) => {
    const message = {
      roomId: roomId,
      senderId: user.uid,
      senderName: user.displayName,
      text: msg,
    };
    try {
      const res = await axios.post(PREXIX_SERVER_URL + "/messages/", message);
      socket_global.emit("chatMessage", { msg: res.data, roomId: roomId });
      setInputState("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box>
      <Messenger
        currentRoomId={roomId}
      />
      {/* <Flex position="fixed" bottom="20">
        <Box p="5">
          <ChatAndAudio roomId={roomId} userId={userId} />
        </Box>
      </Flex > */}
      <form onSubmit={(e) => {
        e.preventDefault();
        submitMessageFn(inputState, roomId)
      }}>
        <Flex position="fixed" bottom="10">
          <Input
            placeholder="Type here..."
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
          />
          <Button
            type="submit"
            colorScheme="blue"
            ml="2"
          >
            send
          </Button>
        </Flex>
      </form >
    </Box >
  );
};
