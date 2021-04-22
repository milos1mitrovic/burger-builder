import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-orders";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Burger from "../../components/Burger/Burger";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Modal from "../../components/UI/Modal/Modal";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actionTypes from "../../store/actions";

class BurgerBuilder extends Component {
  state = {
    showModal: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    // console.log(this.props);
    // axios
    //   .get("/ingredients.json")
    //   .then((response) => this.setState({ ingredients: response.data }))
    //   .catch((error) => this.setState({ error: true }));
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((ingKey) => {
        return ingredients[ingKey];
      })
      .reduce((summary, el) => {
        return summary + el;
      }, 0);

    return sum > 0;
  }

  showModalHandler = () => {
    this.setState({ showModal: true });
  };

  removeModalHandler = () => {
    this.setState({ showModal: false });
  };

  purchaseContinueHandler = () => {
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ings,
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

    if (this.props.ings) {
      burger = (
        <>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.price}
            ingredients={this.props.ings}
            onAddIngredient={this.props.onIngredientAdded}
            onRemoveIngredient={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            onClick={this.showModalHandler}
          />
        </>
      );
      orderSummary = (
        <OrderSummary
          removeModal={this.removeModalHandler}
          purchaseContinue={this.purchaseContinueHandler}
          ingredients={this.props.ings}
          price={this.props.price}
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

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  };
};

const mapDispatchStateToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: (ingName) =>
      dispatch({
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingName,
      }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(withErrorHandler(BurgerBuilder, axios));
