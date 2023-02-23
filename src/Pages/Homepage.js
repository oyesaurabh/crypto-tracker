import React from "react";
import Banner from "../Components/Banner/Banner";
import CoinsTable from "../Components/CoinsTable";

const Homepage = () => {
  return (
    <>
      {/* showing trending coins in a crousal manner */}
      <Banner />
      {/* Showing all the coins as well as the option to search. */}
      <CoinsTable />
    </>
  );
};
export default Homepage;
