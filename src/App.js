import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import CoinPage from "./Pages/CoinPage";
import Homepage from "./Pages/Homepage";

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        {/* usign react router dom to create multipage application */}
        <Routes>
          <Route path="/crypto-tracker" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#101e27",
    color: "white",
    minHeight: "100vh",
  },
}));
