import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import AdminComponent from './Components/Admin/AdminComponent';
import SlideshowComponent from './Components/Slideshow/SlideshowComponent';
import UploadComponent from './Components/Upload/UploadComponent';
import { Provider } from 'react-redux';
import store from './Redux/store';

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/slideshow">Slideshow</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/upload">Upload</Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/admin" >
              <AdminComponent />
            </Route>
            <Route path="/upload">
              <UploadComponent />
            </Route>
            <Route path="/slideshow">
              <SlideshowComponent />
            </Route>
            <Route path="/">
              <div>HOME</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
