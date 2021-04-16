import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
  const ingredients = { ...props.ingredients };
  const ingredientsSummary = Object.keys(ingredients).map((ingKey) => {
    return (
      <li key={ingKey}>
        <span style={{ textTransform: "capitalize" }}>{ingKey}</span> :
        {ingredients[ingKey]}
      </li>
    );
  });
  console.log(ingredientsSummary);
  return (
    <>
      <h3>Your order</h3>
      <p>A delicious burger with the following ingredients: </p>
      <ul>{ingredientsSummary}</ul>
      <p>
        <strong>Price: {props.price.toFixed(2)}</strong>
      </p>
      <Button btnType="Success" clicked={props.purchaseContinue}>
        CONTINUE
      </Button>
      <Button btnType="Danger" clicked={props.removeModal}>
        CANCEL
      </Button>
    </>
  );
};

export default OrderSummary;
