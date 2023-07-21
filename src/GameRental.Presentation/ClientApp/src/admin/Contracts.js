import React, { useState, useEffect } from 'react';
import './Contracts.css'
import '../App.css'
import DropdownCtr from '../components/DropdownCtr';
import DropdownSoft from '../components/DropdownSoft';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isActiveS, setIsAtiveS] = useState(false);
  const [statusValue, setStatusValue] = useState("")
  const [soft, setSoft] = useState('')
  const [isActive, setIsAtive] = useState(false);
  const [isActiveChip, setIsAtiveChip] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [gameTitles, setGameTitles] = useState({});
  const [gameBoxArt, setGameBoxArt] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery, soft);
    } else {
      populateContractData(statusValue, soft);
      fetchGameTitles();
      fetchGameBoxArt()
    }
  }, [searchQuery, currentPage]);
  
  useEffect(() => {
    fetchGameTitles();
  }, [searchResults]);

  useEffect(() => {
    fetchGameBoxArt();
  }, [searchResults]);
  

  const handleEdit = (contractId) => {
    navigate(`/contracts/edit/${contractId}`);
  }

  const handleDetail = (contractId) => {
    navigate(`/contracts/detail/${contractId}`);
  }

  const handleDelete = (contractId) => {
    swal({
      title: "Bạn có chắc muốn xóa hợp đồng này?",
      text: "Khi xóa dữ liệu sẽ không được khôi phục!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          fetch(`/api/contract/delete/${contractId}`, { method: 'DELETE' })
            .then(() => {
              // Remove deleted game from games state
              setContracts(contracts => contracts.filter(contract => contract.id !== contractId));
              // Reset selected game ID
              setSelectedContractId(null);
            });
        }
      });
  }
  
  async function fetchSearchResults(query, soft) {
    try {
      const response = await fetch(`/api/contracts/search?searchTerm=${query}&sorts=${soft}&page=${currentPage}&pageSize=10`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('An error occurred while fetching search results:', error);
    }
  }

  function filterContractsByStatus(status, soft) {
    // Call API to get contracts filtered by status
    fetch(`/api/contracts?filters=status@=${status}&sorts=${soft}&page=${currentPage}&pageSize=10`)
      .then(response => response.json())
      .then(data => setContracts(data));
  }

  async function getGameTitle(gameId) {
    const response = await fetch(`/api/game/${gameId}`);
    const game = await response.json();
    return game.title;
  }
  async function fetchGameTitles() {
    const newGameTitles = {};
    for (const contract of contracts) {
      const gameTitle = await getGameTitle(contract.gameId);
      newGameTitles[contract.gameId] = gameTitle;
    }
    setGameTitles(newGameTitles);
  }

  async function getGameBoxArt(gameId) {
    const response = await fetch(`/api/game/${gameId}`);
    const game = await response.json();
    return game.boxArt;
  }
  async function fetchGameBoxArt() {
    const newGameBoxArt = {};
    for (const contract of searchResults) {
      const gameBoxArt = await getGameBoxArt(contract.gameId);
      newGameBoxArt[contract.gameId] = gameBoxArt;
    }
    setGameBoxArt(newGameBoxArt);
  }
  const handleStatusChange = async (contractId, newStatus) => {
    console.log(newStatus);
    const response = await fetch(`api/contract/${newStatus}/${contractId}`, {
      method: 'GET',
    });
    if (response.ok) {
      // Update contract status in contracts state
      setContracts(contracts => contracts.map(contract => {
        if (contract.id === contractId) {
          return { ...contract, status: newStatus };
        }
        return contract;
      }));
      window.location.reload();
    } else {
      // Handle failed status update
    }
  };
  
  
  function renderContractsTable(contracts) {
    return (
      <div className='wrapper'>
        <div className='tb-wrapper'>
          <table className="tb" aria-labelledby="tableLabel">
            <thead className='tb-head'>
              <tr>
                <th>Người thuê</th>
                <th>Game</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Tình trạng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            {searchResults.map(contract => {
              const startDate = new Date(contract.startDate);
              const endDate = new Date(contract.endDate);
              const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              return (
                <tbody className={selectedContractId === contract.id ? 'selected-game tb-body' : 'tb-body'}>
                  <tr key={contract.id} onClick={() => setSelectedContractId(contract.id)}>
                    <td>{contract.customerInfo.name}</td>
                    <td className='game-title'><img className="img-games-page" src={gameBoxArt[contract.gameId]}></img></td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{contract.status}</td>
                    <td>{contract.totalCost}</td>
                    <td>
                      
                      {contract.status !== "Canceled" && contract.status !== "Completed" && (
                        <button className='button btn-delete' onClick={() => handleStatusChange(contract.id, "cancel")}>Cancel</button>
                      )}
                      {contract.status !== "Canceled" && contract.status !== "Completed" && contract.status !=="Pending" && (
                        <button className='button btn-detail' onClick={() => handleStatusChange(contract.id, "complete")}>Complete</button>
                      )}
                      {contract.status === "Pending" && (
                        <button className='button btn-add' onClick={() => handleStatusChange(contract.id, "activate")}>Activate</button>
                      )}

                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <div className='page-btn'>
            <button className='next-page-btn' onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}><i className='fa fa-angle-left'></i></button>
            <button className='previous-page-btn' onClick={() => setCurrentPage(currentPage + 1)}><i className='fa fa-angle-right'></i></button>
            <p className='page-number'>Page {currentPage}</p>
        </div>
        <div className='btn-area'>
          <Link to="/addcontract"><button className='button btn-add'>Thêm</button></Link>
          <div className='hide-btn'>
            {selectedContractId && (
              <>
                <button className='button btn-edit' onClick={() => handleEdit(selectedContractId)}>Sửa</button>
                <button className='button btn-detail' onClick={() => handleDetail(selectedContractId)}>Chi tiết</button>
                <button className='button btn-delete' onClick={() => handleDelete(selectedContractId)}>Xóa</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  function DropdownCtr({Type, Title, content = [][100], onChange, onReset}) {    
    const showChip = (value) => {
        setIsAtive(false);
        setIsAtiveChip(true);
        setButtonText(value);
        onChange(value);
        populateContractData(value,soft);
    };
    let titleStyles = ['dropdown']
    if (Type === 'range') {
        titleStyles.push('right')}
  return (
    <div className={titleStyles.join(' ')}>
        <div className='dropdown-btn' onClick={e => setIsAtive(!isActive)}>{Title} <i className='fas fa-sort-down'/></div>
        {isActive && 
        <div className='dropdown-contents-ctr'>
            <div className='dropdown-item-ctr' onClick={e => showChip(content[0])}>
                {content[0]}
            </div>
            <div className='dropdown-item-ctr' onClick={e => showChip(content[1])}>
                {content[1]}
            </div>
            <div className='dropdown-item-ctr' onClick={e => showChip(content[2])}>
                {content[2]}
            </div>
            <div className='dropdown-item-ctr' onClick={e => showChip(content[3])}>
                {content[3]}
            </div>
            <div className='dropdown-item-ctr' onClick={e => showChip(content[4])}>
                {content[4]}
            </div> 
        </div>}
        {isActiveChip &&
        <div className='chip' onClick={e => {setIsAtiveChip(!isActiveChip); populateContractData("", soft);}}>
            <button className='chip-btn' id="chipcontract">{buttonText}<i className='fa fa-times'/></button>
        </div>}
    </div>
  )
}
  const softHandle = (value) => {
  setSoft(value);
  populateContractData(statusValue, value);
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
            <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); softHandle("id")}}>
                {content[0]}
            </div>
            <div className='dropdown-item' onClick={e => {setIsAtiveS(!isActiveS); softHandle("startDate")}}>
                {content[1]}
                
            </div>
            <div className='dropdown-item'onClick={e => {setIsAtiveS(!isActiveS); softHandle("-startDate")}}>
                {content[2]}
            </div>
        </div>}
    </div>
  )
  }

  async function populateContractData(statusValue, soft) {
    try {
      const response = await fetch(`/api/contracts?filters=status@=${statusValue}&sorts=${soft}&page=${currentPage}&pageSize=10`);
      const data = await response.json();
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }

  let contents = loading
    ? <p><em>Loading...</em></p>
    : renderContractsTable(contracts);

  return (
    <div className='manage-contracts-container'>
      <form className='search-bar'>
        <button type='submit'><i className='fa fa-search bg-contract'></i></button>
        <input type='text' placeholder='Tìm kiếm' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
      </form>
      <DropdownCtr
        Type={'filter'}
        Title={'Lọc'}
        content={['Completed', 'Canceled', 'Active', 'Pending', 'Overdue']}
        onChange={filterContractsByStatus}
        onReset={populateContractData}
      />
      <DropdownSoft Type={'range'} Title={'Sắp xếp'} content={['ID', 'Cũ nhất', 'Mới nhất']} onChange={filterContractsByStatus} />
      {contents}
    </div>
  );
}

export default Contracts;
