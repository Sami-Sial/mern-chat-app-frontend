import React from "react";
import { ChatState } from "../../context/ChatProvider";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Stack from "@mui/material/Stack";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      <Stack
        sx={{
          padding: "15px 2px 0 15px",
          "@media (max-width:490px)": { padding: "15px 3px" },
        }}
      >
        {messages?.map((m) => {
          if (m.sender._id == user._id) {
            return (
              <Stack
                key={m._id}
                sx={{
                  textAlign: "end",
                  backgroundColor: "#005c4b",
                  width: "fit-content",
                  borderRadius: "3px",
                  margin: "0 15px 5px auto",
                  maxWidth: "45%",
                  padding: "3px 10px",
                  "@media (max-width:980px)": { maxWidth: "70%" },
                  "@media (max-width:490px)": {
                    maxWidth: "90%",
                    marginRight: "2px",
                  },
                }}
              >
                <div style={{ textAlign: "start" }}>
                  {m.msgType === "text" ? (
                    <p style={{ fontSize: "13px" }}>{m.content}</p>
                  ) : m.msgType === "Image" ? (
                    <img
                      style={{
                        width: "200px",
                        height: "130px",
                        border: "2px solid gray",
                        marginTop: "4px",
                      }}
                      src={m.content}
                    />
                  ) : m.msgType === "Video" ? (
                    <video
                      controls
                      style={{
                        width: "200px",
                        height: "130px",
                        objectFit: "cover",
                        border: "2px solid gray",
                        marginTop: "4px",
                      }}
                      src={m.content}
                    />
                  ) : m.msgType === "Document" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <InsertDriveFileIcon />
                      <a
                        style={{ color: "white", marginTop: "4px" }}
                        href={m.content}
                        target="_blank"
                      >
                        View Document
                      </a>
                    </div>
                  ) : (
                    m.msgType === "Audio" && (
                      <audio
                        style={{
                          color: "white",
                          marginTop: "4px",
                          height: "30px",
                        }}
                        src={m.content}
                        controls
                      />
                    )
                  )}
                </div>
              </Stack>
            );
          }

          if (m.sender._id !== user._id) {
            return (
              <Stack
                sx={{
                  backgroundColor: "#202c33",
                  width: "fit-content",
                  borderRadius: "3px",
                  marginBottom: "5px",
                  maxWidth: "45%",
                  padding: "3px 10px",
                  "@media (max-width:980px)": { maxWidth: "70%" },
                  "@media (max-width:490px)": { maxWidth: "90%" },
                }}
                key={m._id}
              >
                {m.msgType === "text" ? (
                  <p
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {m.content}
                  </p>
                ) : m.msgType === "Image" ? (
                  <img
                    style={{
                      width: "200px",
                      height: "130px",
                      border: "2px solid gray",
                      marginTop: "4px",
                    }}
                    src={m.content}
                  />
                ) : m.msgType === "Document" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <InsertDriveFileIcon />
                    <a
                      style={{ color: "white", marginTop: "4px" }}
                      href={m.content}
                      target="_blank"
                    >
                      View Document
                    </a>
                  </div>
                ) : m.msgType === "Video" ? (
                  <video
                    style={{
                      width: "200px",
                      height: "130px",
                      marginTop: "4px",
                      objectFit: "cover",
                      border: "2px solid gray",
                    }}
                    src={m.content}
                    controls
                  />
                ) : (
                  m.msgType === "Audio" && (
                    <audio
                      controls
                      src={m.content}
                      style={{
                        marginTop: "4px",
                        height: "30px",
                      }}
                    />
                  )
                )}
              </Stack>
            );
          }
        })}
      </Stack>
    </>
  );
};

export default ScrollableChat;
