import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-7MBQ4D3F4S");
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
