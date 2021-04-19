import React, { Component } from "react";
import axios from "../../axios-orders";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Burger from "../../components/Burger/Burger";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSmmary";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    showModal: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get("/ingredients")
      .then((response) => this.setState({ ingredients: response.data }))
      .catch((error) => this.setState({ error: true }));
  }

  updatePurchaseState() {
    const ingredients = { ...this.state.ingredients };
    const sum = Object.keys(ingredients)
      .map((ingKey) => {
        return ingredients[ingKey];
      })
      .reduce((summary, el) => {
        return summary + el;
      }, 0);

    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const newPrice = this.state.totalPrice + priceAddition;

    this.setState(
      {
        ingredients: updatedIngredients,
        totalPrice: newPrice,
      },
      () => {
        this.updatePurchaseState();
      }
    );
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const newPrice = this.state.totalPrice - priceDeduction;

    this.setState(
      { ingredients: updatedIngredients, totalPrice: newPrice },
      () => {
        this.updatePurchaseState();
      }
    );
  };

  showModalHandler = () => {
    this.setState({ showModal: true });
  };
  removeModalHandler = () => {
    this.setState({ showModal: false });
  };

  purchaseContinueHandler = () => {
    // alert("You continue");
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Milos Mitrovic",
        address: {
          street: "Test street 1",
          zipCode: "3456",
          country: "Serbia",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then((response) => this.setState({ loading: false, showModal: false }))
      .catch((error) => this.setState({ loading: false, showModal: false }));
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            onAddIngredient={this.addIngredientHandler}
            onRemoveIngredient={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            onClick={this.showModalHandler}
          />
        </>
      );
      orderSummary = (
        <OrderSummary
          removeModal={this.removeModalHandler}
          purchaseContinue={this.purchaseContinueHandler}
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <>
        <Modal
          show={this.state.showModal}
          modalClosed={this.removeModalHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
        <div></div>
      </>
    );
  }
}
export default withErrorHandler(BurgerBuilder, axios);
