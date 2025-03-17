import React from "react";
import { ChatState } from "../../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      <div style={{ padding: "15px 5px 0 15px" }}>
        {messages?.map((m) => {
          if (m.sender._id == user._id) {
            return (
              <div
                key={m._id}
                style={{
                  textAlign: "end",
                  backgroundColor: "#005c4b",
                  width: "fit-content",
                  padding: "3px 10px",
                  borderRadius: "3px",
                  margin: "0 15px 5px auto",
                  maxWidth: "40%",
                }}
              >
                <div style={{ textAlign: "start" }}>
                  {m.msgType === "text" ? (
                    <>{m.content}</>
                  ) : m.msgType === "image" ? (
                    <img
                      style={{
                        width: "200px",
                        height: "130px",
                        borderRadius: "10px",
                      }}
                      src={m.content}
                    />
                  ) : m.msgType === "video" ? (
                    <video
                      style={{
                        width: "200px",
                        height: "130px",
                        borderRadius: "10px",
                      }}
                      src={m.content}
                    />
                  ) : (
                    <audio src={m.content} />
                  )}
                </div>
              </div>
            );
          }

          if (m.sender._id !== user._id) {
            return (
              <p
                style={{
                  backgroundColor: "#202c33",
                  width: "fit-content",
                  padding: "3px 10px",
                  borderRadius: "3px",
                  marginBottom: "5px",
                  maxWidth: "45%",
                }}
                key={m._id}
              >
                {m.msgType === "text" ? (
                  <>{m.content}</>
                ) : m.msgType === "image" ? (
                  <img
                    style={{
                      width: "200px",
                      height: "130px",
                      borderRadius: "10px",
                    }}
                    src={m.content}
                  />
                ) : m.msgType === "video" ? (
                  <video
                    style={{
                      width: "200px",
                      height: "130px",
                      borderRadius: "10px",
                    }}
                    src={m.content}
                  />
                ) : (
                  <audio src={m.content} />
                )}
              </p>
            );
          }
        })}
      </div>
    </>
  );
};

export default ScrollableChat;
