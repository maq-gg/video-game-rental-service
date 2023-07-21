import React, { useState, useEffect } from 'react';
import './Games.css'
import '../App.css'
import DropdownSoft from '../components/DropdownSoft';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState([])
  const [isActive, setIsAtive] = useState(false);
  const [isActiveSubGenre, setIsAtiveSubGenre] = useState(false);
  const [isActiveSubP, setIsAtiveSubP] = useState(false);
  const [isActiveSubPF, setIsAtiveSubPF] = useState(false);
  const [isActiveChip, setIsAtiveChip] = useState(false);
  const [buttonTexts, setButtonTexts] = useState([]);
  const [isActiveS, setIsAtiveS] = useState(false);
  const [soft, setSoft] = useState('')
  const suggestedGames = games.filter(game => game.title.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    populateGameData(selectedFilter.join(''), soft);
  }, [currentPage]);
  
  

  const handleEdit = (gameId) => {
    navigate(`/edit/${gameId}`);
  }

  const handleDelete = (gameId) => {
    swal({
      title: "Bạn có chắc muốn xóa game này?",
      text: "Khi xóa dữ liệu sẽ không được khôi phục!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        fetch(`api/game/delete/${gameId}`, { method: 'DELETE' })
          .then(() => {
            // Remove deleted game from games state
            setGames(games => games.filter(game => game.id !== gameId));
            // Reset selected game ID
            setSelectedGameId(null);
          });
      }
    });
  }
  const handleViewDetails = (gameId) => {
    navigate(`/detail/${gameId}`);
  }

  function Dropdown({Type, Title, content = [][100]}) {
    var value='';
    const showChip = (type, value) => {
      setIsAtiveSubGenre(false);
      setIsAtiveSubP(false);
      setIsAtiveSubPF(false);
      setIsAtive(false);
      setIsAtiveChip(true);
    
      if (!buttonTexts.includes(value)) {
        setButtonTexts([...buttonTexts, value]);
        const newFilter = selectedFilter.length === 0 ? `${type}@=${value}` : `,${type}@=${value}`;
        const newSelectedFilter = [...selectedFilter, newFilter];
        setSelectedFilter(newSelectedFilter);
        populateGameData(newSelectedFilter.join(''), soft);
      }
    };
    
    const removeChip = (index) => {
      const newButtonTexts = buttonTexts.filter((_, i) => i !== index);
      setButtonTexts(newButtonTexts);
      const newSelectedFilter = selectedFilter.filter((_, i) => i !== index);
      if (index === 0 && newSelectedFilter.length > 0) {
        newSelectedFilter[0] = newSelectedFilter[0].replace(',', '');
      }
      setSelectedFilter(newSelectedFilter);
      populateGameData(newSelectedFilter.join(''), soft);
    };

    let titleStyles = ['dropdown']
    if (Type === 'range') {
        titleStyles.push('right')}
  return (
    <div className={titleStyles.join(' ')}>
        <div className='dropdown-btn' onClick={e => setIsAtive(!isActive)}>{Title} <i className='fas fa-sort-down'/></div>
        {isActive && 
        <div className='dropdown-contents'>
            <div className='dropdown-item-game' onClick={e => setIsAtiveSubPF(!isActiveSubPF)}>
                {content[0][0]}
            </div>
            {isActiveSubPF &&
                <div className='sub-dropdown-contents'>
                    <div className='dropdown-item-game' onClick={e => showChip(content[0][1],content[0][2])}>
                        {content[0][2]}
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[0][1],content[0][3])}>
                        {content[0][3]}
                
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[0][1],content[0][4])}>
                        {content[0][4]}
                    </div>
                </div>}
            <div className='dropdown-item-game' onClick={e => setIsAtiveSubGenre(!isActiveSubGenre)}>
                {content[1][0]}
                
            </div>{isActiveSubGenre &&
                <div className='sub-dropdown-contents'>
                    <div className='dropdown-item-game' onClick={e => showChip(content[1][1],content[1][2])}>
                        {content[1][2]}
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[1][1],content[1][3])}>
                        {content[1][3]}
                
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[1][1],content[1][4])}>
                        {content[1][4]}
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[1][1],content[1][5])}>
                        {content[1][5]}
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[1][1],content[1][6])}>
                        {content[1][6]}
                    </div>
                </div>}
            <div className='dropdown-item-game'  onClick={e => {setIsAtiveSubP(!isActiveSubP) && (value=content[0][1])}}>
                {content[2][0]}
            </div>
                {isActiveSubP &&
                <div className='sub-dropdown-contents'>
                    <div className='dropdown-item-game' onClick={e => showChip(content[2][1],content[2][2])}>
                        {content[2][2]}
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[2][1],content[2][3])}>
                        {content[2][3]}
                
                    </div>
                    <div className='dropdown-item-game' onClick={e => showChip(content[2][1],content[2][4])}>
                        {content[2][4]}
                    </div>
                </div>}
        </div>}
        <div className='chip-wrapper'>
            {isActiveChip &&
            buttonTexts.map((text, index) => (
                <div key={index} className='chip' onClick={e => removeChip(index)}>
                <button className='chip-btn'>{text}<i className='fa fa-times'/></button>
            </div>
            ))}
        </div>
    </div>
  )
}

const sortHandle = (value) => {
  setSoft(value);
  populateGameData(selectedFilter.join(''), value);
}

function DropdownSoft({Type, Title, content = []}) {
  
  let titleStyles = ['dropdown']
  if (Type === 'range') {
      titleStyles.push('right')}
return (
  <div className={titleStyles.join(' ')}>
      <div className='dropdown-btn' onClick={e => setIsAtiveS(!isActiveS)}>{Title} <i className='fas fa-sort-down'/></div>
      {isActiveS && 
      <div className='dropdown-contents-soft'>
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

  function renderGamesTable(games) {
    return (
      <div className='wrapper'>
        <div className='tb-wrapper'>
          <table className="tb" aria-labelledby="tableLabel">
            <thead className='tb-head'>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Genre</th>
                <th>Platform</th>
                <th>Explore</th>
                <th>Release Date</th>
                <th>Developer</th>
                <th>Publisher</th>
                <th>ESRB Rating</th>
              </tr>
            </thead>

              {suggestedGames.map(game =>
            <tbody className={selectedGameId === game.id ? 'selected-game tb-body' : 'tb-body'}>
                <tr key={game.id} onClick={() => setSelectedGameId(game.id)}>
                  <td><img className='img-games-page' src={game.boxArt}></img></td>
                  <td>{game.title}</td>
                  {/* <td>{game.genre.join(', ')}</td> */}
                  <td>{game.genre ? game.genre.join(', ') : ''}</td>
                  <td>{game.platform}</td>
                  <td>{game.explore.join(', ')}</td>
                  <td>{game.releaseDate}</td>
                  <td>{game.developer}</td>
                  <td>{game.publisher}</td>
                  <td>{game.esrbRating}</td>                 
                </tr>
            </tbody>
              )}
          </table>
        </div>
        <div className='page-btn'>
            <button className='next-page-btn' onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}><i className='fa fa-angle-left'></i></button>
            <button className='previous-page-btn' onClick={() => setCurrentPage(currentPage + 1)}><i className='fa fa-angle-right'></i></button>
            <p className='page-number'>Page {currentPage}</p>
        </div>
        <div className='btn-area'>
          <Link to="/addgame"><button className='button btn-add'>Thêm</button></Link>
          <div className='hide-btn'>
          {selectedGameId && (
        <>
          <button className='button btn-edit' onClick={() => handleEdit(selectedGameId)}>Sửa</button>
          <button className='button btn-detail' onClick={() => handleViewDetails(selectedGameId)}>Chi tiết</button>
          <button className='button btn-delete' onClick={() => handleDelete(selectedGameId)}>Xóa</button>
        </>
      )}
          </div>
        </div>
      </div>
    );
  }

  async function populateGameData(selectedFilterString, soft) {
    try {
      const response = await fetch(`api/games?sorts=${soft}&page=${currentPage}&pageSize=10&filters=${selectedFilterString}`);
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }
  
  

  let contents = loading
    ? <p><em className='loading'>Loading...</em></p>
    : renderGamesTable(games);

  return (
    <div className='manage-container'>
      <form className='search-bar'>
        <button type='submit'><i className='fa fa-search bg-game'></i></button>
        <input type='text' placeholder='Tìm kiếm' onChange={e => setSearchQuery(e.target.value)}/>
      </form>
      <Dropdown Type={'filter'} Title={'Lọc'} 
      content={[['Platform','platform', 'PlayStation 5', 'PlayStation 4', 'Nintendo Switch'],
                ['Genre', 'genre', 'Action', 'RPG', 'Adventure', 'Racing', 'Fighting'],
                ['Publisher', 'publisher', 'CapCom', 'Ubisort', 'Nintendo']]} />
      <DropdownSoft Type={'range'} Title={'Sắp xếp'} content={['Phổ biến', 'Mới nhất', 'Cũ nhất']} />
      {contents}
    </div>
  );
}

export default Games;