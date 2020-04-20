import React from "react";
import github from "../static/github-favicon.png";
import scp from "../static/scp-favicon.png";
import styles from "./Footer.module.css";

interface Props {}

const Footer: React.FC<Props> = ({}) => {
  return (
    <div className={styles.component}>
      <img src={github} className={styles.image} />
      <a href="https://github.com/t4sk/multi-sig-wallet" target="__blank">
        Code
      </a>
      <div className={styles.bar}>|</div>
      <img src={scp} className={styles.image} />
      <a href="https://smartcontractprogrammer.com" target="__blank">
        Smart Contract Programmer
      </a>
    </div>
  );
};

export default Footer;
