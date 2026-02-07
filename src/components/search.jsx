import React from 'react'; 


const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
      <img src="/searchicon.png.png" alt="search" style={{height: '30px', width: '30px'}} />
      <input 
        type="text"
        placeholder="Search through our countless movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    </div>
  )
} 


export default Search;
