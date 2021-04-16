import burgerLogo from "../../assets/images/burger-logo.png";
import classes from "./Logo.module.css";

const Logo = () => (
  <div className={classes.Logo}>
    <img src={burgerLogo} alt="MyBurger" />
  </div>
);
export default Logo;
