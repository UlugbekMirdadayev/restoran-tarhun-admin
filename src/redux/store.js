import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import report from "./reportSlice";
import loader from "./loaderSlice";
import waiters from "./waiterSlice";
import admin from "./adminSlice";
import rooms from "./roomSlice";
import products from "./productSlice";
import categories from "./categoriesSlice";
import modifiers from "./modifierSlice";
import measurements from "./measurementSlice";
import productHistories from "./productHistoriesSlice"

const store = configureStore({
  reducer: {
    user,
    report,
    loader,
    waiters,
    admin,
    rooms,
    products,
    productHistories,
    categories,
    modifiers,
    measurements,
  },
});

export default store;
