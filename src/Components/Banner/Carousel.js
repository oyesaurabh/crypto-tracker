import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { TrendingCoins } from "../../config/api";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import axios from "axios";

const Carousel = () => {
  const [trending, setTrending] = useState([]); //contain the trending coins
  const { currency, symbol } = CryptoState(); //using contextAPI to keep track of currency throughout the wholeApp
  const classes = useStyles();

  //function to fetch trending coins data using axios
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setTrending(data);
  };

  //will execute fetchTrendingCoins function everytime currency changes
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  //will contain final array of trending coins
  const items = trending.map((coin) => {
    // if profit, green else red
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        {/* image of coin */}
        <img
          src={coin?.image}
          alt={coin?.name}
          height="80"
          style={{ marginBottom: 10 }}
        ></img>
        {/* Name and profit in same line  */}
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        {/* per coin price acc. to selected currency */}
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol}&nbsp;
          {
            // comma lagane k liye
            coin?.current_price.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          }
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 1,
    },
    1024: {
      items: 4,
    },
    512: {
      items: 2,
    },
    768: {
      items: 3,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        responsive={responsive}
        autoPlay
        disableDotsControls
        disableButtonsControls
        items={items} //calculated above
      />
    </div>
  );
};
export default Carousel;

//Style related components
const useStyles = makeStyles(() => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignment: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));
