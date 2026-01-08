import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import DownloadIcon from "@mui/icons-material/Download";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [previewFile, setPreviewFile] = useState(null);

  const handleOpenPreview = (file) => setPreviewFile(file);
  const handleClosePreview = () => setPreviewFile(null);

  const handleDownload = (fileUrl, fileName = "file") => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ⭐ NEW → Format date for date separator
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* 💬 Chat Messages */}
      <Stack
        sx={{
          padding: "15px 2px 0 15px",
          "@media (max-width:490px)": { padding: "15px 3px" },
        }}
      >
        {messages?.map((m, index) => {
          const isOwn = m.sender._id === user._id;

          // ⭐ NEW → Date Separator Logic
          const currentDate = formatDate(m.createdAt);
          const previousDate =
            index > 0 ? formatDate(messages[index - 1].createdAt) : null;
          const showDateSeparator = currentDate !== previousDate;

          return (
            <React.Fragment key={m._id}>
              {/* ⭐ NEW → DATE SEPARATOR */}
              {showDateSeparator && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "15px 0",
                    color: "#bbb",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "#555",
                    }}
                  ></div>

                  <span style={{ margin: "0 10px" }}>{currentDate}</span>

                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "#555",
                    }}
                  ></div>
                </div>
              )}

              <Stack
                sx={{
                  textAlign: isOwn ? "end" : "start",
                  backgroundColor: isOwn ? "#005c4b" : "#202c33",
                  width: "fit-content",
                  borderRadius: "6px",
                  margin: isOwn ? "0 15px 5px auto" : "0 0 5px 15px",
                  maxWidth: "55%",
                  padding: "6px 10px",
                  color: "white",
                  "@media (max-width:980px)": { maxWidth: "70%" },
                  "@media (max-width:490px)": { maxWidth: "90%" },
                }}
              >
                {/* 📝 TEXT */}
                {m.msgType === "text" && (
                  <p style={{ fontSize: "14px", lineHeight: "18px" }}>
                    {m.content}
                  </p>
                )}

                {/* 🖼️ IMAGE */}
                {m.msgType === "Image" && (
                  <img
                    src={m.content}
                    alt="sent"
                    onClick={() =>
                      handleOpenPreview({ type: "image", content: m.content })
                    }
                    style={{
                      width: "250px",
                      height: "180px",
                      border: "2px solid gray",
                      borderRadius: "6px",
                      marginTop: "6px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* 🎥 VIDEO */}
                {m.msgType === "Video" && (
                  <video
                    src={m.content}
                    controls
                    onClick={() =>
                      handleOpenPreview({ type: "video", content: m.content })
                    }
                    style={{
                      width: "250px",
                      height: "180px",
                      border: "2px solid gray",
                      borderRadius: "6px",
                      marginTop: "6px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                    onPlay={(e) => e.preventDefault()}
                  />
                )}

                {/* 🎧 AUDIO */}
                {m.msgType === "Audio" && (
                  <audio src={m.content} controls style={{ height: "35px" }} />
                )}

                {/* 📄 PDF */}
                {m.msgType === "PDF" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                    }}
                  >
                    <InsertDriveFileIcon sx={{ fontSize: 20, color: "#bbb" }} />
                    <p style={{ fontSize: "13px", marginRight: "14px" }}>
                      {m.fileName || "PDF Document"}
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#fff",
                          borderColor: "#777",
                          textTransform: "none",
                          fontSize: "12px",
                        }}
                        onClick={() =>
                          handleOpenPreview({ type: "pdf", content: m.content })
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )}

                {/* 📦 ZIP */}
                {m.msgType === "ZIP" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                    }}
                  >
                    <ArchiveIcon sx={{ fontSize: 20, color: "#bbb" }} />
                    <p style={{ fontSize: "13px" }}>
                      {m.fileName || "ZIP Archive"}
                    </p>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "#fff",
                        borderColor: "#777",
                        textTransform: "none",
                        fontSize: "12px",
                      }}
                      startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleDownload(m.content, "archive.zip")}
                    >
                      Download
                    </Button>
                  </div>
                )}

                {/* 📜 TXT */}
                {m.msgType === "TextFile" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginTop: "6px",
                      borderRadius: "6px",
                      width: "220px ",
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px" }}>
                      <InsertDriveFileIcon
                        sx={{ fontSize: 20, color: "#bbb" }}
                      />
                      <p style={{ fontSize: "13px" }}>
                        {m.fileName || "Text File"}
                      </p>
                    </div>
                    <div>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#fff",
                          borderColor: "#777",
                          textTransform: "none",
                          fontSize: "12px",
                        }}
                        onClick={() =>
                          handleOpenPreview({ type: "txt", content: m.content })
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )}

                {/* ❓ FALLBACK */}
                {![
                  "Image",
                  "Video",
                  "Audio",
                  "PDF",
                  "TextFile",
                  "ZIP",
                  "text",
                ].includes(m.msgType) && (
                    <div
                      style={{
                        borderRadius: "6px",
                        marginTop: "5px",
                        fontSize: "13px",
                        textAlign: "center",
                      }}
                    >
                      Unsupported file type.
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "white",
                          borderColor: "#777",
                          textTransform: "none",
                          fontSize: "12px",
                          marginLeft: "6px",
                        }}
                        href={m.content}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </div>
                  )}

                {/* ⭐ NEW → Time under each message */}
                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    marginTop: "4px",
                    textAlign: "right",
                  }}
                >
                  {formatTime(m.createdAt)}
                </p>
              </Stack>
            </React.Fragment>
          );
        })}
      </Stack>

      {/* 🔍 Preview Modal */}
      <Dialog
        open={!!previewFile}
        onClose={handleClosePreview}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <IconButton
          onClick={handleClosePreview}
          sx={{
            position: "absolute",
            top: 10,
            right: 70,
            color: "white",
            zIndex: 1000,
          }}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={() => handleDownload(previewFile?.content)}
          sx={{
            position: "absolute",
            top: 10,
            right: 15,
            color: "white",
            zIndex: 1000,
          }}
        >
          <DownloadIcon />
        </IconButton>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            p: 2,
          }}
        >
          {previewFile && (
            <>
              {previewFile.type === "image" && (
                <img
                  src={previewFile.content}
                  alt="preview"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: "12px",
                    objectFit: "contain",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
                  }}
                />
              )}

              {previewFile.type === "video" && (
                <video
                  src={previewFile.content}
                  controls
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: "12px",
                    backgroundColor: "#000",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
                  }}
                />
              )}

              {previewFile.type === "pdf" && (
                <embed
                  src={previewFile.content}
                  type="application/pdf"
                  width="90%"
                  height="90%"
                  style={{
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#fff",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
                  }}
                />
              )}

              {previewFile.type === "txt" && (
                <iframe
                  src={previewFile.content}
                  width="80%"
                  height="80%"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
                  }}
                ></iframe>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScrollableChat;
