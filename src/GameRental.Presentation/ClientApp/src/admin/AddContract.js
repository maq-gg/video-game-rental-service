import React, { useState } from 'react';
import './AddContract.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import GameSuggestion from '../components/GameSuggestion';

const AddContract = () => {
  const [contractData, setContractData] = useState({
    id: '',
    gameId: '',
    status: '',
    customerInfo: {
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
    startDate: '',
    endDate: '',
    rentalDuration: 0,
    paymentMethod: '',
    shipmentMethod: '',
    shippingFee: 0,
    lateFee: 0,
    totalCost: 0,
  });
  const [gameId, setGameId] = useState('');
  const [matchingGames, setMatchingGames] = useState([]);

  const handleGameTitleChange = async (event) => {
    const gameTitle = event.target.value;
    if (!gameTitle) {
        setContractData({ ...contractData, gameId: '' });
        setMatchingGames([]);
        return;
    }
    // fetch matching games from database based on gameTitle
    const response = await fetch(`api/games/search?searchTerm=${gameTitle}`);
    const data = await response.json();
    setMatchingGames(data);
  };

  const handleGameSelect = (gameId, gameTitle) => {
    setGameId(gameId);
    document.getElementById('game').value = gameTitle;
    setMatchingGames([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // calculate totalCost based on rentalDuration and shippingFee
    const rentalDurationMap = {
      threedays: 3,
      sevendays: 7,
      fourteendays: 14,
      thirtydays: 30,
    };
    const rentalDuration = rentalDurationMap[event.target.duration.value];
    const totalCostMap = {
      threedays: 4.99,
      sevendays: 9.99,
      fourteendays: 19.99,
      thirtydays: 30.99,
    };
    const totalCost = totalCostMap[rentalDuration] + 5;
    const startDate = new Date(event.target.startDate.value);
    const endDate = new Date(startDate.setDate(startDate.getDate() + rentalDuration));
    const contractData = {
      gameId: gameId,
      status: 'Pending',
      customerInfo: {
        name: event.target.name.value,
        phoneNumber: event.target.phoneNumber.value,
        email: event.target.email.value,
        address: event.target.address.value,
      },
      startDate: event.target.startDate.value,
      endDate: endDate.toISOString().split('T')[0],
      rentalDuration,
      paymentMethod: event.target.paymentMethod.value,
      shipmentMethod: event.target.shipmentMethod.value,
      shippingFee: 5,
      lateFee: 0,
      totalCost,
    };
    const response = await fetch('api/contract/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });
    if (response.ok) {
      swal('Thành công', 'Thêm hợp đồng thành công', 'success');
    } else {
      swal('Thất bại', 'Bạn cần nhập đầy đủ thông tin', 'error');
    }
  };

    
    return (
      <div className='addcontracts-page'>
        <div className='addcontracts-form-container'>
            <form onSubmit={handleSubmit}>
                <div className='mb-2'>
                    <label htmlFor='game-ct' className='form-label'>
                        Game
                    </label>
                    <input 
                    id="game"
                    className='form-control'
                    type="text"
                    name="game"
                    onChange={handleGameTitleChange}
                    />
                
                <ul className="game-suggestion">
                {matchingGames.map(game => (
                  <li className="game-suggestion-item" key={game.id} onClick={() => handleGameSelect(game.id, game.title)}>
                    <img className='img-games-page' src={game.boxArt}></img>
                    <div>

                    <h5 className="game-suggestion-title">
                      {game.title}
                    </h5>
                    <p className="game-suggestion-genre">
                      Thể loại: {game.genre}
                    </p>
                    <p className="game-suggestion-platform">
                      Nền tảng: {game.platform}
                    </p>
                    </div>
                  </li>
                ))}
              </ul>
            
                </div>
                <div className='mb-2'>
                    <label htmlFor='name-ct' className='form-label'>
                        Tên người thuê
                    </label>
                    <input 
                    id="name-ct"
                    className='form-control'
                    type="text"
                    name="name"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='phonenumber-ct' className='form-label'>
                        Số điện thoại
                    </label>
                    <input 
                    id="phonenumber-ct"
                    className='form-control'
                    type="text"
                    name="phoneNumber"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='email-ct' className='form-label'>
                        Email
                    </label>
                    <input 
                    id="email-ct"
                    className='form-control'
                    type="text"
                    name="email"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='address-ct' className='form-label'>
                      Địa chỉ
                    </label>
                    <input 
                    id="address-ct"
                    className='form-control'
                    type="text"
                    name="address"
                    />
                </div>   
                <div className='mb-2'>
                    <label htmlFor='startdate-ct' className='form-label'>
                        Ngày thuê
                    </label>
                    <input 
                    id="startdate-ct"
                    className='form-control'
                    type="date"
                    name='startDate'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='duration-ct' className='form-label'>
                            Kỳ hạn
                    </label>
                    <div className='radio-container'>
                        <label className='radio' id="threedays">
                        <input type="radio" value="threedays" name='duration' />3 ngày
                        <span></span>
                        </label>
                        <label className='radio' id="sevendays">
                        <input type="radio" value="sevendays" name='duration' />7 ngày
                        <span></span>
                        </label>
                        <label className='radio' id="fourteendays">
                        <input type="radio" value="fourteendays" name='duration' />14 ngày
                        <span></span>
                        </label>
                        <label className='radio' id="thirtydays">
                        <input type="radio" value="thirtydays" name='duration' />30 ngày
                        <span></span>
                        </label>
                    </div>
                </div> 
                <div className='mb-2'>
                    <label htmlFor='paymentmethod' className='form-label'>
                            Phương thức thanh toán
                    </label>
                    <div className='radio-container'>
                        <label className='radio' id="creditcard">
                        <input type="radio" value="Credit Card" name='paymentMethod' />Credit Card
                        <span></span>
                        </label>
                        <label className='radio' id="paypal">
                        <input type="radio" value="PayPal" name='paymentMethod' />PayPal
                        <span></span>
                        </label>
                    </div>
                </div>      
                <div className='mb-2'>
                    <label htmlFor='shipmentmethod' className='form-label'>
                            Phương thức nhận game
                    </label>
                    <div className='radio-container'>
                        <label className='radio' id="ups">
                        <input type="radio" value="UPS" name='shipmentMethod' />UPS
                        <span></span>
                        </label>
                        <label className='radio' id="fedex">
                        <input type="radio" value="FedEx" name='shipmentMethod' />FedEx
                        <span></span>
                        </label>
                    </div>
                </div>           
                <button type="submit" className='submit-btn'>
                Thêm
                </button>
                <Link to="/contracts"><button type='cancel' className='cancel-btn'>
                Hủy
                </button></Link>
            </form>
            
        </div>
      </div>
    )
  
}

export default AddContract;
