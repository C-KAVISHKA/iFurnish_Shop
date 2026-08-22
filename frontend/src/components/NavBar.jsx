import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ containerStyles, onLinkClick }) => {
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Collection", path: "/collection" },
    { title: "Products", path: "/products" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `${
              isActive ? "active-link" : "link-inactive"
            } px-4 py-2.5 rounded-full transition-all duration-300`
          }
        >
          <div className="flexCenter gap-x-1">{link.title}</div>
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
