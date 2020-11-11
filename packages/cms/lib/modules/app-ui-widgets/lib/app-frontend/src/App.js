import logo from './logo.svg';
import './App.css';
import TourApp from './TourApp.js';

function App(props) {
  return (
    <TourApp
      title={props.title}
      steps={props.views[0].elements.map(function(el){
        return el.data;
      })}
    />
  );
}

export default App;
