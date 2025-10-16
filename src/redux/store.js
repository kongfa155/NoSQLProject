import { createStore, applyMiddleware, compose } from "redux";
import {thunk} from "redux-thunk";
import rootReducer from "./reducer/rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// --- Cấu hình persist ---
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // chỉ lưu state user
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Cấu hình DevTools an toàn ---
const composeEnhancers =
  // nếu Redux DevTools có sẵn thì dùng, không thì fallback về compose gốc
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// --- Tạo store ---
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
