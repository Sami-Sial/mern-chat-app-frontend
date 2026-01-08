import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ color = "success", size = 40 }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color={color} size={size} />
      </div>
    </>
  );
};

export default Loader;
