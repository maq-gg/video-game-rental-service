import React, { useState, useEffect } from 'react';
import './Dashboard.css'
import '../App.css'

function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameTitles, setGameTitles] = useState({});
  const [gamePlatforms, setGamePlatforms] = useState({})
  useEffect(() => {
    populateContractData();
    populateGameData();
    fetchGameTitlesAndPlatforms();
  }, []);

  useEffect(() => {
    fetchGameTitlesAndPlatforms();
  }, [contracts]);
  async function fetchGameTitlesAndPlatforms() {
    const newGameTitles = {};
    const newGamePlatforms = {};
  
    for (const contract of contracts) {
      const gameTitleAndPlatform = await getGameTitleAndPlatform(contract.gameId);
      newGameTitles[contract.gameId] = gameTitleAndPlatform.title;
      newGamePlatforms[contract.gameId] = gameTitleAndPlatform.platform;
    }
  
    setGameTitles(newGameTitles);
    setGamePlatforms(newGamePlatforms);
  }
  
  async function getGameTitleAndPlatform(gameId) {
    const response = await fetch(`/api/game/${gameId}`);
    const game = await response.json();
    return { title: game.title, platform: game.platform };
  }
  function renderContractsTable(contracts) {
    return (
        <div className='tbd-wrapper'>
          <table className="tbd" aria-labelledby="tableLabel">
            <thead className='tbd-head'>
              <tr>
                <th>Game</th>
                <th>Platform</th>
                <th>Người thuê</th>
                <th>Số điện thoại</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            {contracts.map(contract => {
              return (
                <tbody className='tbd-body'>
                  <tr key={contract.id}>
                    <td>{gameTitles[contract.gameId]}</td>
                    <td>{gamePlatforms[contract.gameId]}</td>
                    <td>{contract.customerInfo.name}</td>
                    <td>{contract.customerInfo.phoneNumber}</td>
                    <td>{contract.status}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
    );
  }

  async function populateContractData() {
    try {
      let allContracts = [];
      let page = 1;
      let hasMoreData = true;
  
      while (hasMoreData) {
        const response = await fetch(`/api/contracts?sorts=-startDate&page=${page}`);
        const data = await response.json();
  
        if (data.length > 0) {
          allContracts = allContracts.concat(data);
          page++;
        } else {
          hasMoreData = false;
        }
      }
  
      setContracts(allContracts);
      setLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }

  function renderGamesTable(games) {
    return (
        <div className='tbd-wrapper'>
          <table className="tbd" aria-labelledby="tableLabel">
            <thead className='tbd-head'>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Platform</th>
                <th>Genre</th>
                <th>Publisher</th>
              </tr>
            </thead>

              {games.map(game =>
            <tbody className='tbd-body'>
                <tr key={game.id}>
                  <td><img className='img-dashboard-page' src={game.boxArt}></img></td>
                  <td>{game.title}</td>
                  {/* <td>{game.genre.join(', ')}</td> */}
                  <td>{game.platform}</td>
                  <td>{game.genre ? game.genre.join(', ') : ''}</td>
                  <td>{game.publisher}</td>                
                </tr>
            </tbody>
              )}
          </table>
        </div>
    );
  }

  async function populateGameData() {
    try {
      let allGames = [];
      let page = 1;
      let hasMoreData = true;
  
      while (hasMoreData) {
        const response = await fetch(`api/games?sorts=popularity&page=${page}`);
        const data = await response.json();
  
        if (data.length > 0) {
          allGames = allGames.concat(data);
          page++;
        } else {
          hasMoreData = false;
        }
      }
  
      setGames(allGames.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }

  let contractContents = loading
    ? <p><em>Loading...</em></p>
    : renderContractsTable(contracts);

  let gameContents = loading
    ? <p><em>Loading...</em></p>
    : renderGamesTable(games);

    // Calculate the count of contracts with different statuses
    console.log(contracts);
  const pendingCount = contracts.filter(contract => contract.status === 'Pending').length;
  const activeCount = contracts.filter(contract => contract.status === 'Active').length;
  const completedCount = contracts.filter(contract => contract.status === 'Completed').length;
  const overdueCount = contracts.filter(contract => contract.status === 'Overdue').length;
  const canceledCount = contracts.filter(contract => contract.status === 'Canceled').length;
// Calculate the total revenue by summing up the totalCost property of all contracts
// const totalRevenue = contracts.reduce((sum, contract) => sum + contract.totalCost, 0);
// Calculate the total revenue by summing up the totalCost property of all contracts from the current month
const currentMonth = new Date().getMonth();
const totalRevenue = contracts.reduce((sum, contract) => {
  const contractMonth = new Date(contract.startDate).getMonth();
  return contractMonth === currentMonth ? sum + contract.totalCost : sum;
}, 0);

  return (
    <div className='dashboard-container'>
      <div className='db-games-container'>
        <h6>Popular Games</h6>
        {gameContents}
      </div>
        <div className='db-contract-container'>
          <h6>Recent Contracts</h6>
          {contractContents}
        </div>
      {/* Display the count of contracts with different statuses */}
      <div className='contract-status'>
        <h6></h6>
        <p className='pending'>Pending contract: {pendingCount}</p>
        <p className='active'>Avtive contract: {activeCount}</p>
        <p className='completed'>Completed contract: {completedCount}</p>
        <p className='overdue'>Overdue contract: {overdueCount}</p>
        <p className='canceled'>Canceled contract: {canceledCount}</p>
      </div>
      <div className='revenue'>
      <h6>Revenue </h6>
      <p>{totalRevenue} $</p>
      </div>
    </div>

  );
}

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import './Dashboard.css'
// import '../App.css'

// function Dashboard() {
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     populateContractData();
//   }, []);

//   function renderContractsTable(contracts) {
//     return (
//       <div className='wrapper'>
//         <div className='tb-wrapper'>
//           <table className="tb" aria-labelledby="tableLabel">
//             <thead className='tb-head'>
//               <tr>
//                 <th>ID</th>
//                 <th>Người thuê</th>
//                 <th>Số điện thoại</th>
//                 <th>Tình trạng</th>
//               </tr>
//             </thead>
//             {contracts.map(contract => {
//               return (
//                 <tbody className='tb-body'>
//                   <tr key={contract.id}>
//                     <td>{contract.id}</td>
//                     <td>{contract.customerInfo.name}</td>
//                     <td>{contract.customerInfo.phoneNumber}</td>
//                     <td>{contract.status}</td>
//                   </tr>
//                 </tbody>
//               );
//             })}
//           </table>
//         </div>
//       </div>
//     );
//   }

//   async function populateContractData() {
//     try {
//       const response = await fetch(`/api/contracts`);
//       const data = await response.json();
//       setContracts(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('An error occurred while fetching data:', error);
//     }
//   }

//   let contents = loading
//     ? <p><em>Loading...</em></p>
//     : renderContractsTable(contracts);

//   return (
//     <div className='manage-contracts-container'>
//       {contents}
//     </div>
//   );
// }

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import './Games.css'
// import '../App.css'

// function Dashboard() {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     populateGameData();
//   }, []);

//   function renderGamesTable(games) {
//     return (
//       <div className='wrapper'>
//         <div className='tb-wrapper'>
//           <table className="tb" aria-labelledby="tableLabel">
//             <thead className='tb-head'>
//               <tr>
//                 <th></th>
//                 <th>Title</th>
//                 <th>Platform</th>
//                 <th>Genre</th>
//                 <th>Publisher</th>
//               </tr>
//             </thead>

//               {games.map(game =>
//             <tbody className='tb-body'>
//                 <tr key={game.id}>
//                   <td><img className='img-games-page' src={game.boxArt}></img></td>
//                   <td>{game.title}</td>
//                   {/* <td>{game.genre.join(', ')}</td> */}
//                   <td>{game.platform}</td>
//                   <td>{game.genre ? game.genre.join(', ') : ''}</td>
//                   <td>{game.publisher}</td>                
//                 </tr>
//             </tbody>
//               )}
//           </table>
//         </div>
//       </div>
//     );
//   }

//   async function populateGameData() {
//     try {
//       const response = await fetch(`api/games?sorts=popularity`);
//       const data = await response.json();
//       setGames(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('An error occurred while fetching data:', error);
//     }
//   }

//   let contents = loading
//     ? <p><em className='loading'>Loading...</em></p>
//     : renderGamesTable(games);

//   return (
//     <div className='manage-container'>
//       {contents}
//     </div>
//   );
// }

// export default Dashboard;
