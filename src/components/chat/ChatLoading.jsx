import React from "react";
import Skeleton from "@mui/material/Skeleton";

const ChatLoading = ({ count = 6 }) => {
  // count = number of skeleton chat items to show
  return (
    <div style={{ padding: "10px" }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            backgroundColor: "#2a3a3c",
            padding: "8px",
            borderRadius: "10px",
          }}
        >
          {/* Avatar Skeleton */}
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ bgcolor: "#555" }}
          />

          {/* Text Skeletons */}
          <div style={{ marginLeft: "10px", flexGrow: 1 }}>
            <Skeleton
              variant="text"
              width="50%"
              height={20}
              sx={{ bgcolor: "#555", marginBottom: "6px" }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={15}
              sx={{ bgcolor: "#555" }}
            />
          </div>

          {/* Time/notification Skeleton */}
          <Skeleton
            variant="text"
            width={30}
            height={15}
            sx={{ bgcolor: "#555", marginLeft: "10px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatLoading;
