"use client";
import { useEffect } from "react";

export default function CloseNav() {
  useEffect(() => {
    const navLinks = document.querySelectorAll("nav ul li a");
    const checkbox = document.querySelector("label.hamburger input") as HTMLInputElement;

    const handleLinkClick = () => {
      if (checkbox) {
        checkbox.checked = false;
      }
    };

    navLinks.forEach(link => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);

  return null;
}
