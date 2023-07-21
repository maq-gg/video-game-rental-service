import React, { Component } from 'react'
import { useState } from 'react';
import './AddGame.css';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

function AddGame () {
  const [media, setMedia] = useState([]);
  const [boxArt, setBoxArt] = useState("");
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showBoxArtForm, setShowBoxArtForm] = useState (false);


  function handleDeleteMedia(index) {
    // Remove media item from media array
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  }

  function handleMediaSubmit(event) {
    // Validate media data
    event.preventDefault();
    const mediaData = {
        type: event.target.type.value,
        url: event.target.url.value,
        caption: event.target.caption.value
    };

    if (!mediaData.type || !mediaData.url || !mediaData.caption) {
        // Display error message
        alert("Please fill in all media fields");
      } else {
        // Add media data to media array
        setMedia([...media, mediaData]);
        setShowMediaForm(false)
      }
        

  }
  function handleBoxArtSubmit(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    
    // Get boxart URL from form input
    const boxartUrl = event.target.boxArt.value;
    
    // Validate boxart URL
    if (!boxartUrl) {
        // Display error message
        alert("Please enter a boxart URL");
    } else {
        setBoxArt(boxartUrl);
        setShowBoxArtForm(false);
    }
}
  

const handleSubmit = async (event) => {
    event.preventDefault();
    const gameData = {      
        title: event.target.title.value,
        genre: event.target.genre.value.split(","),
        platform: event.target.platform.value,
        explore: event.target.explore.value.split(","),
        releaseDate: event.target.releaseDate.value,
        developer: event.target.developer.value.split(","),
        publisher: event.target.publisher.value,
        description: event.target.description.value,
        esrbRating: event.target.esrbRating.value,
        media: media,
        price: {
            threeDays: 5.99,
            sevenDays: 9.99,
            fourteenDays: 14.99,
            thirtyDays: 19.99
        }
    };
    const response = await fetch ("api/game/create", {
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
    }
    );
    if (response.ok) {
        swal("Thành công", "Thêm game thành công", "success");
    }
    else
    {
        swal("Thất bại", "Bạn cần nhập đầy đủ thông tin", "error");
    }
};

    return (
      <div className='addgame-page'>
        <div className='addgame-form-container'>
        <form onSubmit={handleMediaSubmit}>

        {showMediaForm && (
            <div className='media-form'>
                        <h5 className='media-title'>Thêm Media</h5>
                        
                        
                            <div className='media-type'>
                            <label>Type:</label>
                            <select
                                name='type'>
                                <option value="img">Image</option>
                                <option value="video">Video</option>
                            </select>
                            </div>
                            <div className='media-url'>
                            <label>URL:</label>
                            <input
                                type="text"
                                name='url'
                            />
                            </div>
                            <div className='media-caption'>
                            <label>Caption:</label>
                            <input
                                type="text"
                                name='caption'
                                />
                            </div>
                        
                        
                        <button type="button" className='cancel-btn' onClick={() => setShowMediaForm(false)}>
                            Hủy
                        </button>
                        <button type="submit" className='update-btn'>
                            Thêm
                        </button>
                        </div>
                    )}
            </form>
            <form onSubmit={handleBoxArtSubmit}>
            {showBoxArtForm && (
            <div className='media-form'>
                        <h5 className='media-title'>Thêm BoxArt</h5>     
                            <div className='media-url'>
                            <label>URL:</label>
                            <input
                                type="text"
                                name='boxArt'
                            />
                            </div>
                        <button type="button" className='cancel-btn' onClick={() => setShowBoxArtForm(false)}>
                            Hủy
                        </button>
                        <button type="submit" className='update-btn'>
                            Thêm
                        </button>
                        </div>
                    )}
            </form>
            <form onSubmit={handleSubmit}>
            <div className='mb-2'>
                    <label htmlFor='media' className='form-label'>
                        Ảnh/Video:
                    </label>
                    <label htmlFor='media-btn' className='form-label-btn'>
                        <BsFillPlusCircleFill className='media-class' onClick={() => setShowBoxArtForm(!showBoxArtForm)}>
                        </BsFillPlusCircleFill> 
                    </label>
                    {boxArt && (
                <div className='media-content'>
                    <div>
                        <img className="media-item" src={boxArt}/>
                        <button className='delete-media-btn' onClick={() => setBoxArt("")}>x</button>
                    </div>
                </div>
                    )}
            </div>
            <div className="mb-2">
                <label htmlFor="thumbnail" className="form-label">
                    Thumbnail:
                </label>
                <label htmlFor="thumbnail-btn" className="form-label-btn">
                    <BsFillPlusCircleFill className="thumbnail-class" onClick={() => setShowMediaForm(!showMediaForm)}>
                        {showMediaForm ? "Hide Media Form" : "Show Media Form"}
                    </BsFillPlusCircleFill>
                </label>
                <div className='media-content'>

                {media.map((mediaItem, index) => (
                    <div key={index} className='media-content-item'>

                {mediaItem.type === "Image" ? (
                    <>
                    <img className="media-item" src={mediaItem.url} alt={mediaItem.caption} />
                    <button className='delete-media-btn' onClick={() => handleDeleteMedia()}>x</button>
                    </>
                ) : (
                    <>
                    <video className='media-item' src={mediaItem.url} controls />
                    <button className='delete-media-btn' onClick={() => handleDeleteMedia()}>x</button>
                    </>
                )}
                    </div>
                ))}   
                </div>
                </div>
                
                <div className='mb-2'>
                    <label htmlFor='tieu-de' className='form-label'>
                        Tiêu đề:
                    </label>
                    <input 
                    id="tieu-de"
                    className='form-control'
                    type="text"
                    name="title"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='the-loai' className='form-label'>
                        Thể loại:
                    </label>
                    <input 
                    id="the-loai"
                    className='form-control'
                    type="text"
                    name="genre"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='nen-tang' className='form-label'>
                        Nền tảng:
                    </label>
                    <input 
                    id="nen-tang"
                    className='form-control'
                    type="text"
                    name="platform"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='nha-phat-trien' className='form-label'>
                        Nhà phát triển:
                    </label>
                    <input 
                    id="nha-phat-trien"
                    className='form-control'
                    type="text"
                    name="developer"
                    />
                </div>
                 <div className='mb-2'>
                    <label htmlFor='nha-phat-hanh' className='form-label'>
                        Nhà phát hành:
                    </label>
                    <input 
                    id="nha-phat-hanh"
                    className='form-control'
                    type="text"
                    name="publisher"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='ngay-phat-hanh' className='form-label'>
                        Ngày phát hành:
                    </label>
                    <input 
                    id="ngay"
                    className='form-control'
                    type="date"
                    name='releaseDate'
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='kham-pha' className='form-label'>
                        Khám phá:
                    </label>
                    <input 
                    id="kham-pha"
                    className='form-control'
                    type="text"
                    name="explore"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='rating' className='form-label'>
                        Esrb Rating:
                    </label>
                    <input 
                    id="rating"
                    className='form-control'
                    type="text"
                    name="esrbRating"
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='mo-ta' className='form-label'>
                        Mô tả:
                    </label>
                    <textarea 
                    id="mo-ta"
                    className='form-control'
                    type="text"
                    name="description"
                    >
                    </textarea>
                </div>
                
                
                <button type="submit" className='update-btn' value="Create Game" >
                    Thêm
                </button>
                <Link to="/games"><button type='cancel' className='cancel-btn'>
                Hủy
                </button></Link>
            </form>
        </div>
      </div>
    )
}

export default AddGame;