import React, { useState } from 'react';
import "./index.css";
import ItemImg from "../../assets/images/item.png";

export default function CollectionItem({name, place}) {
    const [isActiveFav, setIsActiveFav] = useState(false);

    const toggleFavorite = () => {
        setIsActiveFav(prevState => !prevState);
    };

    const [isActiveGone, setIsActiveGone] = useState(false);

    const toggleGone = () => {
        setIsActiveGone(prevState => !prevState);
    };

    return(
        <div className="item-container">
            <div className="item-header">
                <button className="product-slider__fav js-fav" onClick={toggleGone}>
                    <span className={`tick ${isActiveGone ? 'is-active' : ''}`}></span>
                </button>
                <button className="product-slider__fav js-fav" onClick={toggleFavorite}>
                    <span className={`heart ${isActiveFav ? 'is-active' : ''}`}></span>
                </button>
            </div>

            <img src={ItemImg} className="item-img" />

            <div className="item-footer">
                <div className="item-property">
                    <div>
                        <svg style={{marginBottom: '3px'}} xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path fill="#fafafa" d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
                    </div>
                    <span className="name-text">{name}</span>
                </div>
                <div className="item-property">
                    <div>
                        <svg style={{marginBottom: '3px'}} xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 384 512"><path fill="#fafafa" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                    </div>
                    <span className="place-text">{place}</span>
                </div>
            </div>
        </div>
    )
}