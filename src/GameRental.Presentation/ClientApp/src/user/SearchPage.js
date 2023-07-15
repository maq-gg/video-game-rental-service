import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import CardItemS from '../components/CardItemS';
import './SearchPage.css';
import '../App.css';
import DropdownSoft from '../components/DropdownSoft';
import GameSuggestion from '../components/GameSuggestion';
import { useLocation } from 'react-router-dom';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const gameSuggestionRef = useRef(null);
  const [activeChips, setActiveChips] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([])
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [isActiveS, setIsAtiveS] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const platformFilter = queryParams.get('platform');
  const sortValue = queryParams.get('sort');
  const navigate = useNavigate();
  const handleViewInfo = (gameId) => {
    navigate(`/info/${gameId}`);
  }
  const showChip = (type,value) => {
    setActiveChips([...activeChips, value]);
    if (!activeChips.includes(value)) {
      setActiveChips([...activeChips, value]);
      const newFilter = selectedFilter.length === 0 ? `${type}@=${value}` : `,${type}@=${value}`;
      const newSelectedFilter = [...selectedFilter, newFilter];
      setSelectedFilter(newSelectedFilter);
      fetchGameData(newSelectedFilter.join(''), sort);
    }
  };
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery, sort);
    } else {
      fetchGameData(selectedFilter.join(''),sort);
    }
  }, [searchQuery, page]);
  

  useEffect(() => {
    setShowSuggestions(!!searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (platformFilter) {
      // Apply the platform filter
      showChip('platform', platformFilter);
    }
  }, [platformFilter]);
  useEffect(() => {
    if (sortValue) {
      // Apply the sort
      sortHandle(sortValue);
    }
  }, [sortValue]);


  function handleClickOutside(event) {
    if (gameSuggestionRef.current && !gameSuggestionRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  }
  async function fetchSearchResults(query, soft) {
    try {
      const response = await fetch(`/api/games/search?searchTerm=${query}&page=${page}&pageSize=25&sorts=${soft}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('An error occurred while fetching search results:', error);
    }
  }

  async function fetchGameData(value, soft) {
    try {
      const response = await fetch(`/api/games?page=${page}&pageSize=25&filters=${value}&sorts=${soft}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('An error occurred while fetching game data:', error);
    }
  }

  const sortHandle = (value) => {
    if (searchQuery)
    {
      setSort(value);
      fetchSearchResults(searchQuery, value);
    }
    else {
      setSort(value);
      fetchGameData(selectedFilter.join(''), value);
    }
  }
  function FilterPanel({ showChip }) {
    const removeChip = (index) => {
      const newButtonTexts = activeChips.filter((_, i) => i !== index);
      setActiveChips(newButtonTexts);
      const newSelectedFilter = selectedFilter.filter((_, i) => i !== index);
      if (index === 0 && newSelectedFilter.length > 0) {
        newSelectedFilter[0] = newSelectedFilter[0].replace(',', '');
      }
      setSelectedFilter(newSelectedFilter);
      fetchGameData(newSelectedFilter.join(''), sort);
    };
    return (
      <div className='filter-container'>
        <h6 className='filter'>Lọc</h6>
        <div className='chip-container'>
          {activeChips.map((chip, index) => (
            <div className='chip' onClick={() => removeChip(index)}>
              <button className='chip-btn'>{chip}<i className='fa fa-times'/></button>
            </div>
          ))}
        </div>
        <div className='filter-platform'>
          <h6>Nền tảng</h6>
          <input id='ch-pf' type='checkbox'/>
          <ul className='filter-item'>
            <li onClick={e => showChip("platform","PlayStation 5")}>PlayStation 5</li>
            <li onClick={e => showChip("platform","PlayStation 4")}>PlayStation 4</li>
            <li onClick={e => showChip("platform","PlayStation 3")}>PlayStation 3</li>
          </ul>
          <ul className='more-pf filter-item'>
            <li onClick={e => showChip("platform","Xbox Series X")}>Xbox Series X</li>
            <li onClick={e => showChip("platform","Xbox One")}>Xbox One</li>
            <li onClick={e => showChip("platform","Nintendo Switch")}>Nintendo Switch</li>
            <label for='ch-pf'>Ẩn</label>
          </ul>
          <label for='ch-pf'>Xem thêm</label>
        </div>
        <div className='filter-genre'>
          <h6>Genre</h6>
          <input id='ch-g' type='checkbox'/>
          <ul className='filter-item'>
            <li onClick={e => showChip("genre","Action")}>Action</li>
            <li onClick={e => showChip("genre","Adventure")}>Adventure</li>
            <li onClick={e => showChip("genre","RPG")}>RPG</li>
          </ul>
          <ul className='more-g filter-item'>
            <li onClick={e => showChip("genre","Racing")}>Racing</li>
            <li onClick={e => showChip("genre","Sports")}>Sports</li>
            <li onClick={e => showChip("genre","Indie")}>Indie</li>
            <label for='ch-g'>Ẩn</label>
          </ul>
          <label for='ch-g'>Xem thêm</label>
        </div>
        <div className='filter-tag'>
          <h6>Explore</h6>
          <input id='ch-t' type='checkbox'/>
            <ul className='filter-item'>
            <li onClick={e => showChip("explore","Featured")}>Featured</li>
            <li onClick={e => showChip("explore","Coming soon")}>Coming soon</li>
            <li onClick={e => showChip("explore","New releases")}>New releases</li>
            </ul>
            {/* <ul className='more-t filter-item'>
            <li onClick={e => showChip("Racing")}>Racing</li>
            <li onClick={e => showChip("Sports")}>Sports</li>
            <li onClick={e => showChip("Indie")}>Indie</li>
            <label for='ch-t'>Ẩn</label>
          </ul>
          <label for='ch-t'>Xem thêm</label> */}
        </div>
        <div className='filter-rating'>
          <h6>ESRB Rating</h6>
            <input id='ch-r' type='checkbox'/>
            <ul className='filter-item'>
              <li onClick={e => showChip("ESRBRating","EC")}>EC</li>
              <li onClick={e => showChip("ESRBRating","E")}>E</li>
              <li onClick={e => showChip("ESRBRating","E10+")}>E10+</li>
            </ul>
            <ul className='more-r filter-item'>
            <li onClick={e => showChip("ESRBRating","M17+")}>M17+</li>
            <li onClick={e => showChip("ESRBRating","M")}>M</li>
            <li onClick={e => showChip("ESRBRating","AO")}>AO</li>
            
            <label for='ch-r'>Ẩn</label>
          </ul>
          <label for='ch-r'>Xem thêm</label>
        </div>
        <div className='filter-publisher'>
          <h6>Nhà phát hành</h6>
            <input id='ch-p' type='checkbox'/>
            <ul className='filter-item'>
              <li onClick={e => showChip("publisher","Nintendo")}>Nintendo</li>
              <li onClick={e => showChip("publisher","Blizzard Entertainment")}>Blizzard Entertainment</li>
              <li onClick={e => showChip("publisher","Bethesda")}>Bethesda</li>
            </ul>
            <ul className='more-p filter-item'>
              <li onClick={e => showChip("publisher","Ubisoft")}>Ubisoft</li>
              <li onClick={e => showChip("publisher","Capcom")}>Capcom</li>
              <li onClick={e => showChip("publisher","Namco")}>Namco</li>
              <li onClick={e => showChip("publisher","Warner Bros. Games")}>Warner Bros. Games</li>
              <label for='ch-p'>Ẩn</label>
            </ul>
            <label for='ch-p'>Xem thêm</label>
        </div>
      </div>
    )
  }
  
  function DropdownSoft({Type, Title, content = []}) {
  
    let titleStyles = ['dropdown']
    if (Type === 'range') {
        titleStyles.push('right')}
  return (
    <div className={titleStyles.join(' ')}>
        <div className='dropdown-btn' onClick={e => setIsAtiveS(!isActiveS)}>{Title} <i className='fas fa-sort-down'/></div>
        {isActiveS && 
        <div className='dropdown-contents-soft search-sort'>
            <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); sortHandle("popularity")}}>
                {content[0]}
            </div>
            <div className='dropdown-item' onClick={e => {setIsAtiveS(!isActiveS); sortHandle("-releaseDate")}}>
                {content[1]}
                
            </div>
            <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); sortHandle("releaseDate")}}>
                {content[2]}
            </div>
        </div>}
    </div>
  )
  }

  return (
    <div className='search-page-container'>
      <SearchBar value={searchQuery} changeInput={e => setSearchQuery(e.target.value)} />
      {/* Render search results */}
      {showSuggestions && (
        <div ref={gameSuggestionRef}>
          <GameSuggestion suggestions={searchResults} />
        </div>
      )}
      <div className='panellist-wrap'>
        <div className='panel-wrap'>
            <FilterPanel showChip={showChip} />
        </div>
        <div className='list-wrap'>
          <div className='range-wrap'>
          <h6 className='filter-description'>#kết quả cho</h6>
            <DropdownSoft className='dropdown-soft' Type={"range"} Title={"Sắp xếp"} content={['Phổ biến', 'Mới nhất', 'Cũ nhất']} />
          </div>
          <div className='cards-wrap'>
            {searchResults.map(game => (
              <div key={game.id} onClick={() => handleViewInfo(game.id)}>
                <CardItemS src={game.boxArt} label={game.title} />
              </div>
            ))}
          </div>
          <div className='page-btn'>
              <button className='next-page-btn' onClick={() => setPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}><i className='fa fa-angle-left'></i></button>
              <button className='previous-page-btn' onClick={() => setPage(page + 1)}><i className='fa fa-angle-right'></i></button>
              <p className='page-number'>Page{page}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SearchBar from '../components/SearchBar';
// import FilterPanel from '../components/FilterPanel';
// import CardItemS from '../components/CardItemS';
// import './SearchPage.css';
// import '../App.css';
// import DropdownSoft from '../components/DropdownSoft';
// import GameSuggestion from '../components/GameSuggestion';

// export default function SearchPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const gameSuggestionRef = useRef(null);
//   const [activeChips, setActiveChips] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState([])
//   const [page, setPage] = useState(1);
//   const [sort, setSort] = useState('');
//   const [isActiveS, setIsAtiveS] = useState(false);
//   const navigate = useNavigate();
//   const handleViewInfo = (gameId) => {
//     navigate(`/info/${gameId}`);
//   }
//   useEffect(() => {
//     if (searchQuery) {
//       fetchSearchResults(searchQuery, sort);
//     } else {
//       fetchGameData(selectedFilter.join(''),sort);
//     }
//   }, [searchQuery, page]);
  

//   useEffect(() => {
//     setShowSuggestions(!!searchQuery);
//   }, [searchQuery]);

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   function handleClickOutside(event) {
//     if (gameSuggestionRef.current && !gameSuggestionRef.current.contains(event.target)) {
//       setShowSuggestions(false);
//     }
//   }
//   async function fetchSearchResults(query, soft) {
//     try {
//       const response = await fetch(`/api/games/search?searchTerm=${query}&page=${page}&pageSize=25&sorts=${soft}`);
//       const data = await response.json();
//       setSearchResults(data);
//     } catch (error) {
//       console.error('An error occurred while fetching search results:', error);
//     }
//   }

//   async function fetchGameData(value, soft) {
//     try {
//       const response = await fetch(`/api/games?page=${page}&pageSize=25&filters=${value}&sorts=${soft}`);
//       const data = await response.json();
//       setSearchResults(data);
//     } catch (error) {
//       console.error('An error occurred while fetching game data:', error);
//     }
//   }

//   const sortHandle = (value) => {
//     if (searchQuery)
//     {
//       setSort(value);
//       fetchSearchResults(searchQuery, value);
//     }
//     else {
//       setSort(value);
//       fetchGameData(selectedFilter.join(''), value);
//     }
//   }
//   function FilterPanel() {
    
//     const showChip = (type,value) => {
//       setActiveChips([...activeChips, value]);
//       if (!activeChips.includes(value)) {
//         setActiveChips([...activeChips, value]);
//         const newFilter = selectedFilter.length === 0 ? `${type}@=${value}` : `,${type}@=${value}`;
//         const newSelectedFilter = [...selectedFilter, newFilter];
//         setSelectedFilter(newSelectedFilter);
//         fetchGameData(newSelectedFilter.join(''), sort);
//       }
//     };
//     const removeChip = (index) => {
//       const newButtonTexts = activeChips.filter((_, i) => i !== index);
//       setActiveChips(newButtonTexts);
//       const newSelectedFilter = selectedFilter.filter((_, i) => i !== index);
//       if (index === 0 && newSelectedFilter.length > 0) {
//         newSelectedFilter[0] = newSelectedFilter[0].replace(',', '');
//       }
//       setSelectedFilter(newSelectedFilter);
//       fetchGameData(newSelectedFilter.join(''), sort);
//     };
//     return (
//       <div className='filter-container'>
//         <h6 className='filter'>Lọc</h6>
//         <div className='chip-container'>
//           {activeChips.map((chip, index) => (
//             <div className='chip' onClick={() => removeChip(index)}>
//               <button className='chip-btn'>{chip}<i className='fa fa-times'/></button>
//             </div>
//           ))}
//         </div>
//         <div className='filter-platform'>
//           <h6>Nền tảng</h6>
//           <input id='ch-pf' type='checkbox'/>
//           <ul className='filter-item'>
//             <li onClick={e => showChip("platform","PlayStation 5")}>PlayStation 5</li>
//             <li onClick={e => showChip("platform","PlayStation 4")}>PlayStation 4</li>
//             <li onClick={e => showChip("platform","PlayStation 3")}>PlayStation 3</li>
//           </ul>
//           <ul className='more-pf filter-item'>
//             <li onClick={e => showChip("platform","Xbox Series X")}>Xbox Series X</li>
//             <li onClick={e => showChip("platform","Xbox One")}>Xbox One</li>
//             <li onClick={e => showChip("platform","Nintendo Switch")}>Nintendo Switch</li>
//             <label for='ch-pf'>Ẩn</label>
//           </ul>
//           <label for='ch-pf'>Xem thêm</label>
//         </div>
//         <div className='filter-genre'>
//           <h6>Genre</h6>
//           <input id='ch-g' type='checkbox'/>
//           <ul className='filter-item'>
//             <li onClick={e => showChip("genre","Action")}>Action</li>
//             <li onClick={e => showChip("genre","Adventure")}>Adventure</li>
//             <li onClick={e => showChip("genre","RPG")}>RPG</li>
//           </ul>
//           <ul className='more-g filter-item'>
//             <li onClick={e => showChip("genre","Racing")}>Racing</li>
//             <li onClick={e => showChip("genre","Sports")}>Sports</li>
//             <li onClick={e => showChip("genre","Indie")}>Indie</li>
//             <label for='ch-g'>Ẩn</label>
//           </ul>
//           <label for='ch-g'>Xem thêm</label>
//         </div>
//         <div className='filter-tag'>
//           <h6>Thẻ</h6>
//           <input id='ch-t' type='checkbox'/>
//             <ul className='filter-item'>
//             <li onClick={e => showChip("Action")}>Action</li>
//             <li onClick={e => showChip("Adventure")}>Adventure</li>
//             <li onClick={e => showChip("RPG")}>RPG</li>
//             </ul>
//             <ul className='more-t filter-item'>
//             <li onClick={e => showChip("Racing")}>Racing</li>
//             <li onClick={e => showChip("Sports")}>Sports</li>
//             <li onClick={e => showChip("Indie")}>Indie</li>
//             <label for='ch-t'>Ẩn</label>
//           </ul>
//           <label for='ch-t'>Xem thêm</label>
//         </div>
//         <div className='filter-rating'>
//           <h6>Chia loại (Rating)</h6>
//             <input id='ch-r' type='checkbox'/>
//             <ul className='filter-item'>
//               <li onClick={e => showChip("Trẻ vị thành niên")}>Trẻ vị thành niên</li>
//               <li onClick={e => showChip("Mọi người")}>Mọi người</li>
//               <li onClick={e => showChip("18+")}>18+</li>
//             </ul>
//             <ul className='more-r filter-item'>
            
//             <label for='ch-r'>Ẩn</label>
//           </ul>
//           <label for='ch-r'>Xem thêm</label>
//         </div>
//         <div className='filter-publisher'>
//           <h6>Nhà phát hành</h6>
//             <input id='ch-p' type='checkbox'/>
//             <ul className='filter-item'>
//               <li onClick={e => showChip("publisher","Nis Ameria")}>Nis Ameria</li>
//               <li onClick={e => showChip("publisher","Sony")}>Sony</li>
//               <li onClick={e => showChip("publisher","Atari")}>Atari</li>
//             </ul>
//             <ul className='more-p filter-item'>
//               <li onClick={e => showChip("publisher","Ubisoft")}>Ubisoft</li>
//               <li onClick={e => showChip("publisher","Capcom")}>Capcom</li>
//               <li onClick={e => showChip("publisher","Namco")}>Namco</li>
//               <label for='ch-p'>Ẩn</label>
//             </ul>
//             <label for='ch-p'>Xem thêm</label>
//         </div>
//       </div>
//     )
//   }
  
//   function DropdownSoft({Type, Title, content = []}) {
  
//     let titleStyles = ['dropdown']
//     if (Type === 'range') {
//         titleStyles.push('right')}
//   return (
//     <div className={titleStyles.join(' ')}>
//         <div className='dropdown-btn' onClick={e => setIsAtiveS(!isActiveS)}>{Title} <i className='fas fa-sort-down'/></div>
//         {isActiveS && 
//         <div className='dropdown-contents-soft search-sort'>
//             <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); sortHandle("popularity")}}>
//                 {content[0]}
//             </div>
//             <div className='dropdown-item' onClick={e => {setIsAtiveS(!isActiveS); sortHandle("releaseDate")}}>
//                 {content[1]}
                
//             </div>
//             <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); sortHandle("-ESRBRating")}}>
//                 {content[2]}
//             </div>
//         </div>}
//     </div>
//   )
//   }

//   return (
//     <div className='search-page-container'>
//       <SearchBar value={searchQuery} changeInput={e => setSearchQuery(e.target.value)} />
//       {/* Render search results */}
//       {showSuggestions && (
//         <div ref={gameSuggestionRef}>
//           <GameSuggestion suggestions={searchResults} />
//         </div>
//       )}
//       <div className='panellist-wrap'>
//         <div className='panel-wrap'>
//           <FilterPanel />
//         </div>
//         <div className='list-wrap'>
//           <div className='range-wrap'>
//           <h6 className='filter-description'>#kết quả cho</h6>
//             <DropdownSoft className='dropdown-soft' Type={"range"} Title={"Sắp xếp"} content={['Phổ biến', 'Ngày phát hành', 'ESRBRating']} />
//           </div>
//           <div className='cards-wrap'>
//             {searchResults.map(game => (
//               <div key={game.id} onClick={() => handleViewInfo(game.id)}>
//                 <CardItemS src={game.boxArt} label={game.title} />
//               </div>
//             ))}
//           </div>
//           <div className='page-btn'>
//               <button className='next-page-btn' onClick={() => setPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}><i className='fa fa-angle-left'></i></button>
//               <button className='previous-page-btn' onClick={() => setPage(page + 1)}><i className='fa fa-angle-right'></i></button>
//               <p className='page-number'>Page{page}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }