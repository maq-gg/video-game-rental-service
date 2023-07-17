import React, { useState, useEffect } from 'react';
import './RentGame.css';
import { Link, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

function RentGame() {
  const [gameData, setGameData] = useState(null);
  const {gameId} = useParams();
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  }
  const [selectedDate, setSelectedDate] = useState('');
  //get today 
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log('Selected date:', event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const rentalDurationInDays = rentalDurations[selectedPeriod];;
    const contractData = {
    gameId: gameId,
    status: "Pending",
    customerInfo: {
      name: event.target.name.value,
      phoneNumber: event.target.phoneNumber.value,
      email: event.target.email.value,
      address: event.target.address.value,
    },
    startDate: selectedDate ? selectedDate : today,
    rentalDuration: rentalDurationInDays,
    paymentMethod: selectedOption,
    shipmentMethod: "",
    shippingFee: 0,
    lateFee: 0,
    // totalCost: rentalPrices[selectedPeriod] + deliveryCost,
  };
  console.log('Contract data:', contractData);
    const response = await fetch ("api/contract/create", {
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contractData),
    }
    );
    console.log('Response:', response);
    if (response.ok) {
        swal("Thành công", "Chúc mừng bạn thuê game thành công", "success")
        .then(() => {
          navigate('/explore');
      });
    }
    else
    {
        swal("Thất bại", "Bạn cần nhập đầy đủ thông tin", "error");
    }
};
  const [selectedPeriod, setSelectedPeriod] = useState('threeDays');
  useEffect(() => {
    // Fetch game data for the specific game using the gameId prop
    fetch(`/api/game/${gameId}`)
      .then(response => response.json())
      .then(data => setGameData(data));
  }, [gameId]);

  
  if (!gameData) return <p>Loading...</p>;
  const rentalPrices = {
    threeDays: gameData.price.threeDays,
    sevenDays: gameData.price.sevenDays,
    fourteenDays: gameData.price.fourteenDays,
    thirtyDays: gameData.price.thirtyDays,
  };
  const rentalDurations = {
    threeDays: 3,
    sevenDays: 7,
    fourteenDays: 14,
    thirtyDays: 30,
  };
  return (
    <form className='page-container' onSubmit={handleSubmit}>
      <h3 className='rent-title'>Thông tin thuê game</h3>
      <div className='rent-container'>
          <div className='rent-info'>
              <h4 className='info-title'>Thông tin</h4>
              <div className='line' method='post'>
                <label htmlFor='fullname'>Họ Tên:</label>
                <input type='text' name='name' id='fullname'/>
              </div>

              <div className='line' method='post'>
                <label htmlFor='email'>Email:</label>
                <input type='email' name='email' id='email' required/>
              </div>

              <div className='line' method='post'>
                <label htmlFor='tel'>SĐT:</label>
                <input type='tel' name='phoneNumber' id='tel'/>
              </div>
              <div className='line' method='post'>
                <label htmlFor='address'>Địa chỉ:</label>
                <input type='text' name='address' id='address'/>
              </div>

              <div className='line' method="post">
                <label htmlFor="period">Thời hạn thuê: </label>
                <select name="period" id="period" onChange={(event) => setSelectedPeriod(event.target.value)}>
                  <option value="threeDays">3 Ngày </option>
                  <option value="sevenDays">7 Ngày </option>
                  <option value="fourteenDays">14 Ngày </option>
                  <option value="thirtyDays">30 Ngày </option>
                </select>
              </div>

          </div>
          <div className='rent-method'>
              <div className='deli' method='post'>
              <h4 className='deli-title'>Nhận tại cửa hàng</h4>
                <div className='date'>
                  <label className='date-get'>Ngày đến nhận</label>
                  <input type="date"
                    value={selectedDate}
                    onChange={handleDateChange} 
                    name="startDate" id="date-get" />
                </div>
                </div>
              <div  className='deli-container'>
              <h4 className='deli-title'>Phương thức thanh toán</h4>
                <div>
                  <label htmlFor='payment-card' className='payment'>
                  <input type='radio' name='payment-scard' id='payment-card' value='card' 
                    checked={selectedOption === 'card'} 
                    onChange={handleOptionChange}/>
                    Thanh toán qua thẻ tín dụng/ghi nợ
                  </label>
                </div>
                <div>
                  <label htmlFor='payment-cod' className='payment'>
                  <input type='radio' name='payment-cod' id='payment-cod' value='cod'
                    checked={selectedOption === 'cod'} 
                    onChange={handleOptionChange}/>
                    Thanh toán sau khi nhận hàng
                  </label>
                </div>
              </div>
          </div>

          <div className='rent-game'>
              <h4>Game</h4>
              <div className='game-info'>
                  <img className='game-img' alt="Game" src={gameData.boxArt}/>
                  <div className='game-text'>
                    <h5 className='rentgame-title'>{gameData.title}</h5>
                    <h5 className='genre'>Thể loại: {gameData.genre ? gameData.genre.join(', ') : ''}</h5>
                  </div>
              </div>
              <div className='total'>
                  <h4 className='total'>Thành tiền: {rentalPrices[selectedPeriod]}$</h4>
              </div>

              <div className='button-area'>
                  <button type='submit' className='confirm-rent-btn' value="Create Contract">Xác nhận</button>
                  <Link to='/explore'><button type='cancel'className='cancel-rent-btn' >Hủy</button></Link>
              </div>
          </div>
      </div>
    </form>
  );
}

export default RentGame;

