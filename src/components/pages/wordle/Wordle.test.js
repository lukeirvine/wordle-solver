import React from 'react';
import { render, screen, waitForElementToBeRemoved } from './../../../test-utils';
import userEvent from '@testing-library/user-event';
import { words, testWords } from './../../../resources/word-data';
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
    let results = ''
    try {
        results = screen.getByTestId('w-results-words').innerHTML;
    } catch (error) {
        // There are no result words
    }
    let resultArr = results.split(/, /);
    // remove empty element at end of array
    resultArr.pop();
    return resultArr;
}

beforeEach(async () => {
    
})

it('displays letters typed by clicking displayed keyboard', async () => {
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

    let typeLetters = [
        'ocean'
    ];
    typeKeys(typeLetters);
})

it('changes colors of tiles when clicked', async () => {
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

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
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

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
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

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
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

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
    render(<Wordle words={testWords} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

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

it('fixes known bug', async () => {
    render(<Wordle words={words} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

    let typeLetters = [
        'opera',
        'women',
        'moose'
    ];
    let colorClicks = [
        [1, 0, 1, 0, 0],
        [0, 2, 1, 1, 0],
        [2, 2, 0, 0, 2]
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    // compare results to actual
    expect(getResults()).toEqual([
        'movie'
    ]);
})

it('sorts results properly', async () => {
    render(<Wordle words={words} />);
    await screen.findByRole('heading', {name: /wordle solver/i})

    let typeLetters = [
        'ocean',
        'serum'
    ];
    let colorClicks = [
        [0, 0, 1, 0, 0],
        [0, 2, 0, 0, 0],
    ]
    typeKeys(typeLetters);
    clickTiles(colorClicks);
    // press enter
    userEvent.click(screen.getByTestId('key-enter'));
    expect(getResults()).toEqual([
        'befit', 'beget', 'belie', 'belle', 'belly', 'betel', 'bevel', 
        'bezel', 'debit', 'deity', 'delve', 'depth', 'devil', 'fetid', 
        'hedge', 'hefty', 'helix', 'jelly', 'jetty', 'jewel', 'ledge', 
        'lefty', 'leggy', 'level', 'petty', 'teddy', 'tepee', 'tepid', 
        'wedge', 'weigh',
    ]);
    userEvent.selectOptions(screen.getByTestId('w-sort-select'), 'ltrFreq')
    expect(getResults()).toEqual([
        'tepee', 'betel', 'beget', 'hedge', 'belie', 'ledge', 'fetid', 
        'deity', 'petty', 'tepid', 'delve', 'belle', 'debit', 'depth', 
        'level', 'wedge', 'jetty', 'teddy', 'befit', 'hefty', 'jewel', 
        'bevel', 'bezel', 'lefty', 'weigh', 'helix', 'devil', 'belly', 
        'jelly', 'leggy',
    ]);
    userEvent.selectOptions(screen.getByTestId('w-sort-select'), 'uniqueLtrFreq')
    expect(getResults()).toEqual([
        'fetid', 'deity', 'tepid', 'debit', 'depth', 'befit', 'hefty', 
        'lefty', 'weigh', 'helix', 'devil', 'teddy', 'betel', 'petty', 
        'beget', 'hedge', 'belie', 'jetty', 'tepee', 'ledge', 'delve', 
        'wedge', 'leggy', 'belly', 'jewel', 'bevel', 'jelly', 'bezel', 
        'belle', 'level',
    ]);
})