import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
//import Page from "./components/Page";
import LarkInputLine from "./components/Editor/Editor";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "./reducers/index";

function App() {
  return (
    <div>
      {/*             <Button variant="contained" color="primary">
                Hello World
        </Button> */}
      <LarkInputLine />
    </div>
  );
}

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
//ReactDOM.render(<App />, document.querySelector('#app'));
