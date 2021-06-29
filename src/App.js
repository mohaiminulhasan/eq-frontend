import './App.css';
import { Graph, DataTable, Map } from './pages';
import { Switch, Route, NavLink, useRouteMatch } from 'react-router-dom';


function App() {
  let {path, url} = useRouteMatch();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    height: 50,
    lineHeight: '50px'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    textTransform: 'uppercase',
    width: '20vh',
    textAlign: 'center'
  }

  const activeStyle = {
    backgroundColor: 'black',
    color: 'white'
  }
  
  const CustomNavLink = (to, text) => {
    return <NavLink style={{...linkStyle}} activeStyle={{...activeStyle}} exact to={`${url}${to}`}>{text}</NavLink>
  }

  return (
    <div>
      <nav style={{...navStyle}}>
        {/* {CustomNavLink('', 'Home')} */}
        {CustomNavLink('/eq-frontend', 'Graph')}
        {CustomNavLink('/eq-frontend/data-table', 'Data Table')}
        {CustomNavLink('/eq-frontend/map', 'Map')}
      </nav>

      <Switch>
          <Route exact path='/eq-frontend'>
            <Graph/>
          </Route>
          <Route path='/eq-frontend/data-table'>
            <DataTable/>
          </Route>
          <Route path="/eq-frontend/map">
            <Map/>
          </Route>
      </Switch>
    </div>
  );
}

export default App;
