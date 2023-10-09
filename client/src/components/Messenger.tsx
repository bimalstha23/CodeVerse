import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { PREXIX_SERVER_URL } from "../utils/env";
import { socket_global } from "../utils/sockets";

interface MessengerProps {
  currentRoomId: string;
}

export const Messenger: React.FC<MessengerProps> = ({
  currentRoomId,
}) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          PREXIX_SERVER_URL + "/messages/" + currentRoomId
        );
        // console.log(res);
        setMessages(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    getMessages();
  }, [currentRoomId]);

  useEffect(() => {
    socket_global.on('connect_error', (err) => {
      console.log(err, 'socket error'); // not authorized
    });

    socket_global.on("chatMessage", (msg: any) => {
      console.log('we are here')
      console.log(msg, 'messageon')
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  useEffect(() => {
    // @ts-ignore
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[90vh] overflow-y-scroll">
      {messages.map((msg, i) => {
        return (
          <Box
            bg="facebook.200"
            w="100%"
            p={4}
            color="white"
            rounded="base"
            mb="4"
            key={msg._id}
          >
            <Flex>
              <Box color="facebook.800" className="overflow-clip">{msg.senderName}</Box>
            </Flex>
            <Box color="blackAlpha.800">{msg.text}</Box>
            <Box color="facebook.800" className="text-xs" ml='auto'>
              {format(msg.createdAt)}
            </Box>
          </Box>
        );
      })}
      <div ref={scrollRef}></div>
    </div>
  );
};
