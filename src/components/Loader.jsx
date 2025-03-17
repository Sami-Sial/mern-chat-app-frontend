import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
    <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CircularProgress color="success" />
        </div>
    </>
  )
}

export default Loader
