import React, { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  createTheme,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@material-ui/lab";

//main export function
export default function CoinsTable() {
  const [coins, setCoins] = useState([]); //arry of all coins that is displayed as table
  const [loading, setLoading] = useState(false); //showing LinearProgress(MUI) if loading
  const [search, setSearch] = useState(""); // searched Coin
  const [page, setPage] = useState(1); //keep track of page number we are at currently.
  const navigate = useNavigate(); //use to navigate to coins_page

  const { currency, symbol } = CryptoState(); //contextAPI to keep track of current currency

  //   will fetch coin list with coingeckoAPI url using axios.get function
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  //   re-render fetchCoins function each time we change currency
  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line
  }, [currency]);

  //   materialUI theme palette
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  //   return new array of coins , based on symbol or name
  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin?.name.toLowerCase().includes(search) ||
        coin?.symbol.toLowerCase().includes(search)
    );
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        {/* heading */}
        <Typography variant="h4" style={{ margin: 18, fontFamily: "Roboto" }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        {/* search field */}
        <TextField
          label="Search for a Cryptocurrency..."
          variant="outlined"
          style={{ marginBottom: 20, width: "80%" }}
          onChange={(e) => setSearch(e.target.value)}
        ></TextField>

        {/* Table content */}
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#40E0D0" }} />
          ) : (
            <Table>
              {/* Table heading */}
              <TableHead style={{ backgroundColor: "#91bad6" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Roboto",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {
                  // this handleSearch method will return new array of coins that is based on the search element
                  // slice is used to only show 10 coins at a time per page.
                  handleSearch()
                    .slice((page - 1) * 10, page * 10)
                    .map((row) => {
                      const profit = row.price_change_percentage_24h > 0;
                      return (
                        <TableRow
                          // onclick navigate to new page
                          onClick={() => navigate(`/coins/${row.id}`)}
                          className={classes.row}
                          key={row.name}
                        >
                          {/* coin cell */}
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              display: "flex",
                              gap: 15,
                            }}
                          >
                            <img
                              src={row?.image}
                              alt={row?.name}
                              height="50"
                              style={{ marginBottom: 10 }}
                            ></img>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: 22,
                                }}
                              >
                                {row.symbol}
                              </span>
                              <span style={{ color: "darkgrey" }}>
                                {row.name}
                              </span>
                            </div>
                          </TableCell>

                          {/* price cell */}
                          <TableCell align="right">
                            {symbol}{" "}
                            {row.current_price.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>

                          {/* 24h change cell*/}
                          <TableCell
                            align="right"
                            style={{
                              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                              fontWeight: 500,
                            }}
                          >
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>

                          {/* MarketCap cell */}
                          <TableCell align="right">
                            {symbol}{" "}
                            {row.market_cap
                              .toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })
                              .slice(0, -8)}
                            {" M"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                }
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* different page numbers at the bottom to choose from */}
        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          count={(coins.length / 10).toFixed()}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450); //whenever we click, redirect to the top
          }}
        ></Pagination>
      </Container>
    </ThemeProvider>
  );
}

// ignore this... some useless styling
const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: "#101a27",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#091217",
    },
    fontFamily: "Roboto",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "#87cefb",
    },
  },
}));
