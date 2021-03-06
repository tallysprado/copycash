import Navbar from "../../components/Navbar";
import Head from "../../components/Head";
import Card from "../../components/Card";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import withAuth from "../../helpers/WithAuth";
import { withRouter } from "next/router";
import BASE_URL from "../../constants";

const titles = ["Histórico", "Configurações"];
const isLoggedIn = false;

const Dashboard = () => {
  const [title, setTitle] = useState("Histórico");
  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.onscroll = function () {
        const currentScrollPos = window.pageYOffset;
        const h = Math.min(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
        const index = parseInt((currentScrollPos + 0.1 * h) / h);
        setTitle(titles[index]);
      };
    }
  }, []);

  return (
    <div id="dashboard">
      <Head />
      <Card title="Conta" history />
      <Card title="Configurações" config />
    </div>
  );
};

export default Dashboard;
