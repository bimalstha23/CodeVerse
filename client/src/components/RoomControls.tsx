
import { useRouter } from "next/router";
import { Editor } from "../components/EditorComponent";
import { useClipboard } from "@chakra-ui/react";
import { socket_global } from "../utils/sockets";

interface RoomControlsProps {
  theme: string;
  onRun: any;
  language: string;
  code: string;
  fontSize: string;
  setCode: any;
}

export default function RoomControls({ theme, onRun, language, code, fontSize, setCode }: RoomControlsProps): JSX.Element {
  let url = "";
  if (typeof window !== "undefined") {
    url = location.href;
  }

  const router = useRouter();
  const { id } = router.query;

  const onChangeEditor = (e: string) => {
    if (id && e !== '') {
      setCode(e);
      socket_global.emit("editor", { code: e, roomId: id });
    }
  };

  return (
    <div className="w-full h-full">
      <Editor
        mode={language}
        language={language}
        theme={theme}
        value={code}
        onChange={(e: any) => {
          onChangeEditor(e);
        }}
        width="100%"
        height="85vh"
        fontSize={parseInt(fontSize, 10)}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          animatedScroll: true,
          cursorStyle: "smooth",
          highlightActiveLine: true,
          displayIndentGuides: true,
        }}
        commands={[
          {
            name: "run",
            bindKey: {
              win: "Ctrl-enter",
              mac: "Cmd-enter",
            },
            exec: onRun,
          },
        ]}
      />
    </div>
  );
}
