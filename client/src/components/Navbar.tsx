import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { AuthContext } from "../providers/AuthProvider";

const Links: Array<[string, string]> = [
  ["Home", "/"],
  ["Create Room", "/createroom"],
  ["Join Room", "/joinroom"],
  // ["Room", "/room"],
];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={children[1]}
  >
    {children[0]}
  </Link>
);

export default function withAction() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, login, logout } = useContext(AuthContext);

  return (
    <Flex

    >
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        style={{ width: "100%" }}

      >
        <Flex
          className="container mx-auto"
          h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>CodeVerse</Box>
          {/* <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link[1]}>{link}</NavLink>
              ))}
            </HStack>
          </HStack> */}
          <div className="flex flex-row justify-center items-center gap-10">
            <Box className="flex flex-row justify-center items-center gap-4">
              Toggle mode
              <DarkModeSwitch />
            </Box>
            {
              user ? (
                <Menu>
                  <Avatar
                    as={MenuButton}
                    size={"md"}
                    src={
                      user.photoURL
                        ? user.photoURL
                        : "https://avatars.githubusercontent.com/u/8186664?v=4"
                    }
                  />
                  <MenuList>
                    <button className="w-full pb-3" onClick={logout}>
                      Logout
                    </button>
                    <a className="w-full py-5" href="/rooms">
                      <button className="w-full">Rooms</button>
                    </a>
                  </MenuList>
                </Menu>
              ) :
                <button className=" max-w-xs" onClick={() => login()}>
                  Login with Google
                </button>
            }
          </div>
        </Flex>
      </Box >
    </Flex >
  );
}
