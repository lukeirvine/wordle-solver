import React from 'react';
import { capitalize } from '../../../../resources/Functions';
import './TileGrid.css';

const TileGrid = props => {
    const { grid, handleTileClick, tileColors } = props;

    return <>
        <div className="tg-grid-container">
            <h2 className='w-subtitle'>Entry</h2>
            <p className="w-entry-directions">
                Directions: Enter the words you tried on Wordle, click the tiles repeatedly to 
                turn them yellow or green, and then click enter to see possible next words 
                <span className="w-down-below-text"> down below</span>.
            </p>
            <div className="tg-grid">
                {Object.values(grid.letters).map((row, i) => {
                    return Object.values(row).map((tile, j) => (
                        <button
                            key={j}
                            data-testid={"tile-" + i + "-" + j}
                            type="button"
                            className="tg-tile"
                            style={{
                                backgroundColor: grid.letters[i][j] === '' ? 'white' : tileColors[grid.colors[i][j]],
                                cursor: i <= grid.index.i ? 'pointer' : ''
                            }}
                            onClick={handleTileClick(i, j)}
                        >
                            <div
                                className="tg-tile-letter"
                            >{capitalize(tile)}</div>
                        </button>
                    ))
                })}
            </div>
        </div>
    </>
}

export default TileGrid;
