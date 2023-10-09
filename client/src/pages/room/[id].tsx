import React, { Fragment, useState, useEffect, useRef, useContext } from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import { ChatDiscord, ChatDiscordButton } from "../../components/ChatDiscord";
import Navbar from "../../components/Navbar";
import RoomControls from "../../components/RoomControls";
import { useRouter } from "next/router";
import axios from "axios";
import ServerApi from "../../utils/serverInstance";
import { socket_global } from "../../utils/sockets";
import { enqueueSnackbar } from "notistack";
import Client from "../../components/Client";
import API from "../../utils/axiosInstance";
import { PREXIX_SERVER_URL } from "../../utils/env";
import { useDebouncedEffect } from "../../utils/useDebounceEffect";
import { Editor } from "../../components/EditorComponent";
import Peer from "simple-peer";
import styled from "@emotion/styled";
import { AuthContext } from "../../providers/AuthProvider";
import Auth from "../../config/firebase";
import { setTimeout } from "timers";
import useClipboard from "../../hooks/useClipboard";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      // @ts-ignore
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};


const Container = styled.div`
  padding: 20px;
  display: flex;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const languages = [
  "c",
  "cpp",
  "javascript",
  "java",
  "kotlin",
  "python",
  "python3",
  "scala",
  "swift",
  "csharp",
  "go",
  "haskell",
  "erlang",
  "perl",
  "ruby",
  "php",
  "bash",
  "r",
  "coffeescript",
  "mysql",
  "typescript",
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal",
];

const fontSizes = [
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
  "32",
  "40",
  "45",
];


const Room = ({ data }) => {

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [language, setLanguage] = useState<string>(data?.language || "javascript");
  const [theme, setTheme] = useState<string>("monokai");
  const [fontSize, setFontSize] = useState<string>("20");
  const [code, setCode] = useState<string>(data?.code);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<string>("");
  const [outputdata, setData] = useState({
    time: "0.00",
    result: "idel",
  });
  const userVideo = useRef();
  const [peers, setPeers] = useState([]);

  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    setCode(data?.code);
  }, []);

  useEffect(() => {
    if (user) {
      const isUserIncluded = data?.members?.map((member) => member.userId).includes(user?.uid);
      if (!isUserIncluded) {
        enqueueSnackbar("You are not allowed to access this room", { variant: 'error' });
        router.push('/')
        return;
      }

      socket_global.emit('joinroom', {
        roomId: id as string,
        username: user.displayName,
      });

      const setup = async () => {
        try {
          socket_global.on('Joined', ({ clients,
            username,
            socketId
          }) => {
            console.log('here', username, socketId, clients);
            if (username === user.displayName) {
              enqueueSnackbar("You have joined the room", { variant: "success" });
            } else {
              enqueueSnackbar(`${username} has joined the room`, { variant: "success" });
            };
            setClients(clients)
          });
        } catch (error) {
          console.log('error from stream')
        }
      }
      setup()
      socket_global.on('disconnected', ({ username }: any) => {
        console.log('here', username);
        enqueueSnackbar(`${username} has left the room`, { variant: "error" });
      });
    }

  }, [user])



  const onRun = async () => {
    setIsRunning(true);
    try {
      let response = await API.post("/create", {
        source_code: code,
        language: language,
        api_key: "guest",
        input,
      });
      setStatusId(response.data.id);
    } catch (err) {
      setIsRunning(false);
      console.log(err);
    }
  };

  const getOutput = async (statusId: string | String) => {
    if (statusId == "") return;
    try {
      let response = await API.get(`/get_details?id=${statusId}&api_key=guest`);
      console.log(response);
      const { stdout, stderr } = response.data;
      let newOutput = "";
      if (stdout) newOutput += stdout;
      if (stderr) newOutput += stderr;
      setOutput(newOutput);
      setData({ time: response.data.time, result: response.data.result });
      if (response.data.status != "completed") {
        await getOutput(statusId);
      }

      setIsRunning(false);
      setStatusId("");
    } catch (err) {
      setIsRunning(false);
      console.log(err);
    }
  };

  useEffect(() => {
    async function get_details() {
      await getOutput(statusId);
    }
    get_details();
  }, [statusId]);

  useEffect(() => {
    socket_global.on("editor", (msg: string) => {
      setCode(msg);
    });
    socket_global.on("language", (msg: string) => {
      setLanguage(msg);
    });
  });

  useEffect(() => {
    socket_global.on("output", (msg: string) => {
      setOutput(msg);
    });
  }, [output]);


  const onLanguageChange = async (e) => {
    setLanguage(e.target.value);
    socket_global.emit("language", { language: e.target.value, roomId: id });
    const data = {
      code: code,
      roomId: id,
      language: e.target.value,
    }
    try {
      axios.post(PREXIX_SERVER_URL + "/code", data);
      console.log("code saved")
    }
    catch (e) {
      console.log(e, 'error savig code')
    }
  };

  // useDebouncedEffect(
  //   async () => {
  //     const data = {
  //       code: code,
  //       roomId: id,
  //       language
  //     };
  //     try {
  //       axios.post(PREXIX_SERVER_URL + "/code", data);
  //       console.log('code saved')
  //     } catch (e) {
  //       console.log(e, 'error savig code')
  //     }
  //   },
  //   [code],
  //   1000
  // );


  //save the code in every 1 sec cronjob
  useEffect(() => {
    setTimeout(() => {
      const data = {
        code: code,
        roomId: id,
        language
      };
      try {
        axios.post(PREXIX_SERVER_URL + "/code", data);
        console.log('code saved')
      } catch (e) {
        console.log(e, 'error savig code')
      }
    }, 1000)
  }, [code]);

  const { copy } = useClipboard();

  const leaveRoom = async () => {
    location.replace("/");
  }

  if (!user) return <div>
    <h1>Please <span onClick={login} className="text-blue-700 underline">
    </span> Login
      First</h1>
  </div>;

  if (!data) return <div>
    <h1>Room Not Found</h1>
  </div>;

  return (
    <div className="flex flex-row justify-center items-center w-full h-full">
      <div className="aside min-h-screen xl:max-w-[15%] max-w-[20%]">
        <div className="asideInner">
          <div className="logo">
            Code Verse
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
              return <Video key={index} peer={peer} />;
            })}
          </div>
        </div>

        <label>
          Select Language:
          <select value={language} onChange={(e) => onLanguageChange(e)} className="seLang" >
            {languages.map((lang, index) => {
              return (
                <option key={index} value={lang}>
                  {lang}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          Select Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="seLang">
            {themes.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </label>

        <label>
          Font Size:
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="seLang">
            {fontSizes.map((fSize, index) => {
              return (
                <option key={index} value={fSize}>
                  {fSize}
                </option>
              );
            })}
          </select>
        </label>
        <button disabled={isRunning} className="btn copyBtn bg-white text-black mb-4" onClick={onRun}>
          {isRunning ? 'Code is Running' : 'Save and Run'}
        </button>
        <button className="btn copyBtn bg-white text-black mb-4" onClick={() => setIsChatOpen(prev => !prev)}>
          {isChatOpen ? 'Hide Chat' : "Show Chat"}
        </button>
        <button className="btn copyBtn bg-white text-black" onClick={() => copy(id as string)}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={() => leaveRoom()}>
          Leave
        </button>
      </div>
      <div className="flex flex-col  h-screen w-full gap-4">
        <div className="w-full">
          <RoomControls code={code} fontSize={fontSize} setCode={setCode} language={language} onRun={onRun} theme={theme} />
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="w-full">
            <h1>Input:</h1>
            {/* <Editor
              language="bash"
              theme={'terminal'}
              value={input}
              onChange={(e: React.SetStateAction<string>) => setInput(e)}
              width={"100%"}
              height={"15vh"}
              fontSize={parseInt(fontSize, 10)}
            /> */}

            <textarea
              className="bg-black text-white font-mono text-base border-none resize-none w-full h-40 p-2 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter') {
            //     e.preventDefault();
            //     handleCommand();
            //   }
            // }}
            />

          </div>
          <div className="w-full">
            <span>
              Output Time(sec):{outputdata?.time} Result:{outputdata?.result}
            </span>
            {/* <Editor
              // language="bash"
              theme={'terminal'}
              value={output}
              height={"15vh"}
              onChange={(e: React.SetStateAction<string>) => setOutput(e)}
              width={"100%"}
              fontSize={parseInt(fontSize, 10)}
            /> */}
            <textarea
              className="bg-black text-white font-mono text-base border-none resize-none w-full h-40 p-2 focus:outline-none"
              value={output}
              disabled
              onChange={(e) => setOutput(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter') {
            //     e.preventDefault();
            //     handleCommand();
            //   }
            // }}
            />
          </div>
        </div>

      </div>
      {isChatOpen &&
        <div className="w-[20%]">
          <ChatDiscord roomId={id as string} />
        </div>
      }
    </div>
  );
};

export default Room;

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  try {
    const res = await ServerApi({
      url: "/api/getRoom",
      data: { roomId: id },
      method: "get",
    });
    const data = res.data;
    return {
      props: { data },
    };
  } catch (error) {
    console.log(error)
    return {
      props: { data: null },
    };
  }
}