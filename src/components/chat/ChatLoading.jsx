import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ChatLoading = () => {
  let array = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div style={{ padding: "1rem 0 1rem 10px" }}>
      {array.map((item) => {
        return (
          <Box
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <Skeleton
              width={35}
              height={35}
              animation="pulse"
              variant="circular"
              sx={{ bgcolor: "lightgrey" }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", width: "80%" }}
            >
              <Skeleton
                height={15}
                animation="pulse"
                variant="rounded"
                sx={{ bgcolor: "lightgrey", marginBottom: "5px" }}
              />
              <Skeleton
                height={15}
                animation="pulse"
                variant="rounded"
                sx={{ bgcolor: "lightgrey" }}
              />
            </div>
          </Box>
        );
      })}
    </div>
  );
};

export default ChatLoading;
