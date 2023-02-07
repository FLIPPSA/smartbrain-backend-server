import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div className='ma4 mt0'>
            <p className='f3'>
                {' This program will detect faces in your pictures. Increase your entry count by detecting faces '}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' placeholder='Image URL' onChange={onInputChange}/> {/*to input URL*/}
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-dark-gray' onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;