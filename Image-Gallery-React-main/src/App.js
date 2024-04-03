import React from 'react';
import ImageGallery from './components/ImageGallery';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Галерея</h1>
      </header>
      <main>
        <ImageGallery />
      </main>
    </div>
  );
};

export default App;
