import './App.css';
import Dashboard from './layout/Dashboard';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (window.electronAPI?.onNavigateTab) {
      window.electronAPI.onNavigateTab((direction) => {
        if (direction === 'previous') {
          console.log('Go to previous tab');
          // TODO: navigate to previous tab in your app
        } else if (direction === 'next') {
          console.log('Go to next tab');
          // TODO: navigate to next tab in your app
        }
      });
    }
  }, []);

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
