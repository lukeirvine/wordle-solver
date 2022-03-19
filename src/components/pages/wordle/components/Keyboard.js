import React from 'react';
import './Keyboard.css';

const Keyboard = props => {
    const { keyboard, valid, handleNewLetter, handleSubmit, handleBackSpace } = props;

    return <>
        <div className="w-kb">
            {keyboard.map((row, i) => (
                <div key={i} className="w-kb-row">
                    {row.map((letter, j) => (
                        <button 
                            key={j}
                            data-testid={/^\w+$/.test(letter) ? 'key-' + letter : 'key-backspace'}
                            id={/^\w+$/.test(letter) ? 'key-' + letter : 'key-backspace'}
                            type={letter === 'enter' ? 'submit' : 'button'}
                            disabled={letter === 'enter' && !valid}
                            onClick={/^\w$/.test(letter) ? () => handleNewLetter(letter) : letter === 'enter' ? handleSubmit : () => handleBackSpace()}
                            className={letter === '' ? 'w-kb-spacer' : 'w-kb-letter' + (/^\w$/.test(letter) ? '' : ' w-kb-one-point-five')}
                        >
                            {typeof letter === 'string' ? letter.toUpperCase() : letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    </>
}

export default Keyboard;