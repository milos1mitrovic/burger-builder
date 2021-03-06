import BuildControl from "./BuildControl/BuildControl";
import classes from "./BuildControls.module.css";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Meat", type: "meat" },
  { label: "Cheese", type: "cheese" },
];

const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      <p>
        <strong>Price: {props.price.toFixed(2)}</strong>
      </p>

      {controls.map((control) => {
        return (
          <BuildControl
            key={control.type}
            ingredients={props.ingredients}
            label={control.label}
            addIngredient={() => props.onAddIngredient(control.type)}
            removeIngredient={() => props.onRemoveIngredient(control.type)}
            disabled={props.disabled[control.type]}
          />
        );
      })}
      <button
        onClick={props.ordered}
        disabled={!props.purchasable}
        className={classes.OrderButton}
      >
        {props.isAuth ? "ORDER NOW" : "SIGN UP TO ORDER"}
      </button>
    </div>
  );
};

export default BuildControls;
