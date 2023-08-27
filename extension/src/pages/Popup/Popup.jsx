import React from 'react';
import './Popup.css';

const Popup = () => {
  return (
    <div>
      <input type="text" id="searchBox" placeholder="Search..." />
      <ul id="matchesContainer"></ul>
      <script type="module" src="./popup.js"></script>
    </div>
  );
};

export default Popup;
