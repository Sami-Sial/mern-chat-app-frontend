import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <CircularProgress color="dark" />
      </div>
    </>
  );
};

export default Loader;
