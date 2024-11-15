// App.js

import './App.css';
import FlatDetail from "./components/FlatDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateProperty from './components/CreateProperty';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/contact" component={Contact}></Route>
          <PrivateRoute path="/create" component={CreateProperty}></PrivateRoute>
          <Route path="/about" component={About}></Route>
          <Route path="/blog" exact component={Blog}></Route>
          <Route path="/blog/:id" component={BlogDetail}></Route>
          <Route path="/flat/:slug" component={FlatDetail}></Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
