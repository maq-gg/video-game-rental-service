import React from 'react'
import '../App.css';
import './HeroSection.css'
import { Link } from 'react-router-dom';
const HeroSection = () => {
  return (
    <body className='hero-container'>
        <img src="../../img/gamebackground.jpg" alt=""/>
        <p>Thuê Hàng Nghìn Game Trên Tất Cả Các Nền Tảng.</p>
        <div className='hero-btns'>
            <Link to="/explore"><button className=" btn--primary btn--large btn-mobile">Bắt đầu thuê</button></Link>
        </div>
        <div className='link-btn'>
            <Link to="/search?platform=PlayStation 5"><button className="link-btn-item">PlayStation 5</button></Link>
            <Link to="/search?platform=PlayStation 4"><button className="link-btn-item">PlayStation 4</button></Link>
            <Link to="/search?platform=Xbox Series X"><button className="link-btn-item">Xbox Series X</button></Link>
            <Link to="/search?platform=Xbox One"><button className="link-btn-item">Xbox One</button></Link>
            <Link to="/search?platform=Nintendo Switch"><button className="link-btn-item">Nintendo Switch</button></Link>
            <Link to="/search?sort=popularity"><button className="link-btn-item">Most Popular</button></Link>
            <Link to="/search?sort=releaseDate"><button className="link-btn-item">New Release</button></Link>
            <Link to="/search?sort=-ESRBRating"><button className="link-btn-item">High Rating</button></Link>
        </div>
        <div className='intro'>
            <h3>Dịch vụ cho thuê game | GameRental</h3>
            <p> 
                Chào mừng đến với Gamerental ! Đây là nơi lý tưởng để bạn tìm thấy những tựa game yêu thích của mình mà không cần phải bỏ ra một số tiền lớn để mua chúng.
                Trang web của chúng tôi cung cấp cho bạn một thư viện game đa dạng với hàng nghìn tựa game trên các hệ máy console. Chúng tôi cập nhật liên tục thư viện game của mình để đảm bảo rằng bạn luôn có thể tìm thấy những tựa game mới nhất và hấp dẫn nhất.
                Đăng ký thuê game ngay hôm nay và khám phá thế giới game đa dạng và phong phú chỉ với một khoản chi phí nhỏ! Chúng tôi tin rằng bạn sẽ tìm thấy những tựa game mà mình yêu thích và có trải nghiệm chơi game tuyệt vời.
            </p>
        </div>
    </body>
  );
}

export default HeroSection;