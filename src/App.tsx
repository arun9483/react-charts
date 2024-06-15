import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Header from './components/Header';
import StockChartContainer from './components/StockChartContainer';
import IceCreamFlavourChartContainer from './components/IceCreamFlavourChartContainer';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" Component={Header} />
          <Route path="/line" Component={StockChartContainer} />
          <Route path="/pie" Component={IceCreamFlavourChartContainer} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
