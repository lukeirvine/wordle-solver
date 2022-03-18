import React from 'react';
import { render, screen, waitForElementToBeRemoved } from './../../../test-utils';
import userEvent from '@testing-library/user-event';
import { testWords } from './../../../wordle-words';
import Wordle, { tileColors } from './Wordle';

const typeKeys = (typeLetters) => {
    for (let i = 0; i < typeLetters.length; i++) {
        for (let j = 0; j < typeLetters[i].length; j++) {
            const char = typeLetters[i][j];
            userEvent.click(screen.getByTestId('key-' + char))
            expect(screen.getByTestId('tile-' + i + '-' + j)).toHaveTextContent(new RegExp(char, 'gi'))
        }
    }
}

const clickTiles = (colorClicks) => {
    for (let i = 0; i < colorClicks.length; i++) {
        for (let j = 0; j < colorClicks[i].length; j++) {
            let tile = screen.getByTestId('tile-' + i + '-' + j);
            for (let k = 0; k < colorClicks[i][j]; k++) {
                userEvent.click(tile);
            }
            expect(window.getComputedStyle(tile).backgroundColor).toBe(tileColors[colorClicks[i][j]]);
        }
    }
}

const getResults = () => {
    // get result words into an array
    let results = screen.getByTestId('w-results-words').innerHTML;
    let resultArr = results.split(/, /);
    // remove empty element at end of array
    resultArr.pop();
    return resultArr;
}

beforeEach(async () => {
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})
})

it('displays letters typed by clicking displayed keyboard', async () => {
    let typeLetters = [
        'ocean'
    ];
    typeKeys(typeLetters);
})

it('changes colors of tiles when clicked', async () => {
    let typeLetters = [
        'ocean'
    ];
    typeKeys(typeLetters);
    let tile = screen.getByTestId('tile-0-1')
    // change to yellow
    userEvent.click(tile);
    expect(window.getComputedStyle(tile).backgroundColor).toBe(tileColors[1]);
    // change to green
    userEvent.click(tile);
    expect(window.getComputedStyle(tile).backgroundColor).toBe(tileColors[2])
})

it('outputs full dataset with ocean entered and yellow e', async () => {
    let typeLetters = [
        'ocean'
    ];
    let colorClicks = [
        [0, 0, 1, 0, 0]
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    // compare arrays
    expect(getResults()).toEqual(testWords);
})

it('works without duplicate letters', async () => {
    let typeLetters = [
        'ocean',
        'grief',
        'belly',
        'depth'
    ];
    let colorClicks = [
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0],
        [0, 2, 1, 1, 0]
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    // compare results to actual
    expect(getResults()).toEqual([
        'setup'
    ]);
})

it('selects words that have a correct number of duplicates', async () => {
    let typeLetters = [
        'ocean',
        'fewer',
        'melee',
    ];
    let colorClicks = [
        [0, 0, 1, 0, 0],
        [0, 2, 0, 2, 0],
        [0, 2, 0, 2, 2]
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    // compare results to actual
    expect(getResults()).toEqual([
        'tepee'
    ]);
})

it('works with a third duplicate that isn\'t selected', async () => {
    let typeLetters = [
        'ocean',
        'fewer',
        'melee',
    ];
    let colorClicks = [
        [0, 0, 1, 0, 0],
        [0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0]
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    // compare results to actual
    expect(getResults()).toEqual([
        'beget', 'beset'
    ]);
})

