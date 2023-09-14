import './App.css';
import MenuBar from './pages/MenuBar';
import SocialMediaPage from './pages/SocialMediaPage/SocialMediaPage';
import ImageComponent from './pages/SocialMediaPage/imagine';

function App() {
  return (
    <div className="App">
      <MenuBar></MenuBar>
      <SocialMediaPage></SocialMediaPage>
      <ImageComponent></ImageComponent>
    </div>
  );
}

export default App;
