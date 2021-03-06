import './App.css';
import { Graph, DataTable } from './pages';
import Map from './pages/Map';
import { Switch, Route, NavLink } from 'react-router-dom';


function App() {
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
    return <NavLink style={{...linkStyle}} activeStyle={{...activeStyle}} to={`${to}`}>{text}</NavLink>
  }

  return (
    <div>
      <nav style={{...navStyle}}>
        {/* {CustomNavLink('', 'Home')} */}
        <NavLink style={{...linkStyle}} activeStyle={{...activeStyle}} exact to='/'>Graph</NavLink>
        {CustomNavLink('/data-table', 'Data Table')}
        {CustomNavLink('/map', 'Map')}
      </nav>

      <Switch>
          <Route exact path="/">
            <Graph/>
          </Route>
          <Route path='/data-table'>
            <DataTable/>
          </Route>
          <Route path='/map'>
            <Map/>
          </Route>
      </Switch>
    </div>
  );
}

export default App;
