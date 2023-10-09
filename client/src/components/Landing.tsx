import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Landing(): JSX.Element {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Live Code{" "}
          <Text as={"span"} color={"#4aed88"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"} fontSize="xl" px="5">
          Now you don't need to be on discord and share your screen anymore with
          your fellow coders. Code collaboration  chat rooms.
          <br />
          Connect with{" "}
          <span style={{ color: "#4aed88", display: "inline" }}>code verse</span>.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <NextLink href="/joinroom">
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"#4aed88"}
              _hover={{ bg: "green" }}
            >
              Join New Room
            </Button>
          </NextLink>
          <NextLink href="/createroom">
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"#4aed88"}
              _hover={{ bg: "green" }}
            >
              Create Room
            </Button>
          </NextLink>
        </Stack>

        <Stack spacing={6} direction={"row"}>
          {/* <NextLink href="#rooms">
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"gray.500"}
              _hover={{ bg: "gray.600" }}
            >
              Enter Into Room
            </Button>
          </NextLink> */}
        </Stack>
      </Stack>
    </Container>
  );
}
