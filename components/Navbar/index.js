import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Keyframes } from "react-spring/renderprops.cjs";

const TextTransition =
  typeof window !== `undefined` ? require("react-text-transition") : null;

const buttons = [
  {
    label: "Copycash Club",
    view: "landing",
  },
  {
    label: "Sobre",
    view: "sobre",
  },
  {
    label: "Entrar",
    view: "entrar",
  },
];

const MenuAnimation = Keyframes.Spring({
  in: async (next) => {
    await next({
      transform: "scaleY(1)",
    });
  },
  out: async (next) => {
    await next({
      transform: "scaleY(0)",
    });
  },
});


const scrollToView = (view) => {
  document.getElementById(view) &&
  document
    .getElementById(view)
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

const Navbar = ({ title }) => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  useEffect(() => {
    document.onmouseup = (event) => {
      if (
        event &&
        !event.target.classList.contains("mobile-menu") &&
        event.target.offsetParent &&
        !event.target.offsetParent.classList.contains("mobile-menu")
      ) {
        setMobileMenuOpened(false);
      }
    };
  }, []);

  return (
    <div className="nav" id="navbar">
      <nav>
        <h1 className="logo">
          {TextTransition && (
            <TextTransition.default
              text={title}
              springConfig={TextTransition.presets.wobbly}
            />
          )}
          {!TextTransition && title}
        </h1>
        <ul className="mobile-hide">
          {buttons.map((button) => {
            const { label, view } = button;
            return (
              <button key={view} role="link" onClick={() => scrollToView(view)}>
                <li>{label}</li>
              </button>
            );
          })}
        </ul>
        <div
          className="mobile hamburger"
          onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <MenuAnimation
          state={mobileMenuOpened ? "in" : "out"}
          config={{ duration: 150 }}
        >
        {
        props => (
            <div style={props} className="mobile mobile-menu blackbg">
                <ul>
                    {buttons.map((button) => {
                    const { label, view } = button;
                    return (
                        <button key={view} role="link" onClick={() => scrollToView(view)}>
                        <li>{label}</li>
                        </button>
                    );
                    })}
                </ul>
            </div>
        )}
        </MenuAnimation>
      </nav>
    </div>
  );
};

export default Navbar;
