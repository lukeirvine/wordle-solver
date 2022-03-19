import React, { useEffect, useState } from 'react';
import NavBar from './../../nav-bar/NavBar';
import { Form, Button } from 'react-bootstrap';
import TileGrid from './components/TileGrid';
import Keyboard from './components/Keyboard';
import { letterFreq } from '../../../resources/word-data';
import './Wordle.css';

export const tileColors = {
    0: 'rgb(58, 58, 60)',
    1: 'rgb(181, 159, 58)',
    2: 'rgb(83, 141, 78)',
}

const blankGrid = {
    letters: {
        0: {0: '', 1: '', 2: '', 3: '', 4: ''},
        1: {0: '', 1: '', 2: '', 3: '', 4: ''},
        2: {0: '', 1: '', 2: '', 3: '', 4: ''},
        3: {0: '', 1: '', 2: '', 3: '', 4: ''},
        4: {0: '', 1: '', 2: '', 3: '', 4: ''},
        5: {0: '', 1: '', 2: '', 3: '', 4: ''}
    },
    colors: {
        0: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        1: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        2: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        3: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        4: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        5: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    },
    index: {
        i: 0,
        j: 0
    }
}

const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ''],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', <i className="bi-backspace w-kb-backspace" />]
]

const Wordle = props => {
    const { words } = props;
    const [grid, setGrid] = useState(blankGrid)
    const [valid, setValid] = useState(false);
    const [possible, setPossible] = useState([]);
    const [sortAlg, setSortAlg] = useState('alph');

    const handleNewLetter = letter => {
        setGrid(prev => {
            if (prev.index.i === 6 && prev.index.j === 0) {
                return prev;
            }
            return {
                ...prev,
                letters: {
                    ...prev.letters,
                    [prev.index.i]: {
                        ...prev.letters[prev.index.i],
                        [prev.index.j]: letter
                    }
                },
                index: prev.index.j === 4 ? {
                    i: prev.index.i + 1,
                    j: 0
                } : {
                    ...prev.index,
                    j: prev.index.j + 1
                }
            }
        })
    }

    const handleBackSpace = () => {
        setGrid(prev => {
            let i0 = prev.index.j === 0 ? prev.index.i - 1 : prev.index.i;
            let j0 = prev.index.j === 0 ? 4 : prev.index.j - 1;
            if (prev.index.i === 0 && prev.index.j === 0) {
                return prev;
            }
            return {
                ...prev,
                letters: {
                    ...prev.letters,
                    [i0]: {
                        ...prev.letters[i0],
                        [j0]: ''
                    }
                },
                index: prev.index.j === 0 ? {
                    i: prev.index.i - 1,
                    j: 4
                } : {
                    ...prev.index,
                    j: prev.index.j - 1
                }
            }
        })
    }

    const handleKeyDown = e => {
        // key pressed is a letter
        if (65 <= e.which && e.which <= 90 && e.key !== 'Dead') {
            document.getElementById('key-' + e.key).click();
        }
        // backspace
        if (e.which === 8) {
            document.getElementById('key-backspace').click();
        }
        // enter
        if (e.which === 13) {
            document.getElementById('key-enter').click();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (grid.index.j === 0 && grid.index.i !== 0) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [grid.index])

    const handleTileClick = (i, j) => {
        return () => {
            if (i <= grid.index.i) {
                setGrid(prev => ({
                    ...prev,
                    colors: {
                        ...prev.colors,
                        [i]: {
                            ...prev.colors[i],
                            [j]: (prev.colors[i][j] + 1) % 3
                        }
                    }
                }))
            }
        }
    }

    /*
        Return Example:
        {
            l: 2,
            e: 2,
            v: 1
        }
    */
    const getLetterCount = (word, c) => {
        let backupColors = {}
        for (let i = 0; i < word.length; i++) {
            backupColors[i] = 1;
        }
        let colors = c || backupColors;
        let letters = [];
        for (const char of word) {
            if (!letters.includes(char)) {
                letters.push(char)
            }
        }
        let count = {};
        letters.forEach(letter => {
            count[letter] = 0;
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) === letter && colors[i] > 0) {
                    count[letter] += 1;
                }
            }
        })
        return count;
    }

    const sortAlphabetical = (a, b) => {
        return ('' + a).localeCompare(b);
    }

    const sortLetterFreq = (a, b) => {
        let aVal = 0;
        let bVal = 0;
        for (const l of a) {
            aVal += letterFreq[l];
        }
        for (const l of b) {
            bVal += letterFreq[l];
        }
        return bVal - aVal;
    }

    const sortUniqueLetterFreq = (a, b) => {
        let aLetters = Object.keys(getLetterCount(a));
        let bLetters = Object.keys(getLetterCount(b));
        let aVal = 0;
        let bVal = 0;
        for (const l of aLetters) {
            aVal += letterFreq[l];
        }
        for (const l of bLetters) {
            bVal += letterFreq[l];
        }
        return bVal - aVal;
    }

    const sortFuncList = {
        alph: sortAlphabetical,
        ltrFreq: sortLetterFreq,
        uniqueLtrFreq: sortUniqueLetterFreq
    }

    const createSets = () => {
        let sets = {
            cols: {
                0: {
                    is: '',
                    not: ''
                },
                1: {
                    is: '',
                    not: ''
                },
                2: {
                    is: '',
                    not: ''
                },
                3: {
                    is: '',
                    not: ''
                },
                4: {
                    is: '',
                    not: ''
                },
            },
            has: '',
            not: '',
            only: {}
        };
        
        for (let i = 0; i < grid.index.i; i++) {
            let word = '';
            for (let j = 0; j < 5; j++) {
                let letter = grid.letters[i][j];
                let color = grid.colors[i][j];
                // say what each char place is and is not.
                // char place is not gray and yellow tiles, but is green
                if (color < 2 && !sets.cols[j].not.includes(letter)) {
                // only add to 'not' if 'not' doesn't already contain letter
                    sets.cols[j].not += letter;
                } 
                if (color === 2 && sets.cols[j].is === '') {
                // only add to 'is' if 'is' is empty
                    sets.cols[j].is = letter;
                }
                if (color > 0 && !sets.has.includes(letter)) {
                // if tile is yellow or green, add to 'has' if 'has' doesn't already have the letter
                    sets.has += letter;
                    // remove from 'not' if already there
                    if (sets.not.includes(letter)) {
                        sets.not = sets.not.replace(new RegExp(letter, 'gi'), '');
                    }
                }
                if (color === 0 && !sets.not.includes(letter) && !sets.has.includes(letter)) {
                // if tile is gray, add to 'not' if 'not' doesn't already have letter and 
                // 'has' doesn't have letter
                    sets.not += letter;
                }
                // add current letter to current word;
                word += letter;
            }
            // handle duplicates
            // get letter count for each entered word
            const lCount = getLetterCount(word, grid.colors[i]);
            // loop through letters in letter count
            Object.keys(lCount).forEach(letter => {
                // number of letter in word
                let wordCount = lCount[letter];
                if (wordCount > 1) {
                    // get number of this letter in the 'has' set
                    let setCount = getLetterCount(sets.has)[letter];
                    // add the quantity difference between wordCount and setCount to sets.has
                    for (let j = 0; j < wordCount - setCount; j++) {
                        sets.has += letter;
                    }
                }
            })
            // handle when a duplicate letter is gray
            const countNoColors = getLetterCount(word);
            const countWithColors = getLetterCount(word, grid.colors[i]);
            // console.log(word + " counts", countNoColors, countWithColors)
            for (const letter of Object.keys(countNoColors)) {
                if ((countNoColors[letter] > countWithColors[letter] || countWithColors[letter] === undefined) && countWithColors[letter] > 0) {
                    // then we know there's a finite number of letter
                    sets.only[letter] = countWithColors[letter];
                }
            }
        }
        // console.log('sets', sets)
        return sets;
    }

    const handleSubmit = e => {
        e.preventDefault();
        let sets = createSets();
        let results = [];
        // loop through wordle words
        words.forEach(word => {
            let works = true;
            // console.log(word + " ====================================")
            // loop through characters in each word
            for (let j = 0; j < 5; j++) {
                // console.log(word.charAt(j) + " =============")
                // See if col has a green tile
                if (sets.cols[j].is !== '') {
                    // char position must be that green tile letter
                    if (word.charAt(j) !== sets.cols[j].is) {
                        // console.log("letter isn't green tile")
                        works = false;
                        break;
                    }
                } else {
                    // make sure position is not something in the 'not' list
                    if (sets.cols[j].not.includes(word.charAt(j))) {
                        // console.log("has letter that's in the not list")
                        works = false;
                        break;
                    }
                }
            }
            // loop through characters word must have
            let setCount = getLetterCount(sets.has);
            for (const letter of Object.keys(setCount)) {
                let wordCount = getLetterCount(word);
                // if word has less of the letter than sets.has or has none of that letter at all, then no good
                if (wordCount[letter] < setCount[letter] || wordCount[letter] === undefined) {
                    works = false;
                    break;
                }
            }
            // loop through characters word can't have anywhere
            for (const letter of sets.not) {
                if (word.includes(letter)) {
                    works = false;
                    break;
                }
            }
            // loop through characters we know word has a finite number of
            for (const letter of Object.keys(sets.only)) {
                let wordCount = getLetterCount(word);
                if (sets.only[letter] !== wordCount[letter]) {
                    works = false;
                    break;
                }
            }
            if (works) {
                results.push(word);
            }
        })
        results.sort(sortAlphabetical);
        setPossible(results);
    }

    const handleSortChange = e => {
        setSortAlg(e.target.value)
        setPossible(prev => {
            prev.sort(sortFuncList[e.target.value]);
            return prev;
        })
    }

    return <>
        <NavBar />
        <div className="w-page">
            <h1 className="w-title">Wordle Solver</h1>
            <div className="w-content">
                <Form className="w-grid-form w-half-content" onSubmit={handleSubmit}>
                    <TileGrid 
                        grid={grid} 
                        handleTileClick={handleTileClick} 
                        tileColors={tileColors}
                    />
                    <Keyboard 
                        keyboard={keyboard}
                        valid={valid}
                        handleNewLetter={handleNewLetter}
                        handleSubmit={handleSubmit}
                        handleBackSpace={handleBackSpace}
                    />
                    <Button
                        className="w-reset-btn"
                        variant="dark"
                        type="button"
                        onClick={() => {
                            setGrid(blankGrid);
                            setPossible([])
                        }}
                    >Reset</Button>
                </Form>
                {possible.length > 0 && <div className="w-results w-half-content">
                    <h2 className="w-subtitle">Potential Solutions</h2>
                    <div className="w-sort-select-container">
                        <div className="w-sort-heading">Sort by: </div>
                        <Form.Select
                            className="w-sort-select"
                            data-testid="w-sort-select"
                            size="sm"
                            aria-label="Default select example"
                            value={sortAlg}
                            onChange={handleSortChange}
                        >
                            <option value="alph">Alphabetical</option>
                            <option value="ltrFreq">Letter Frequency</option>
                            <option value="uniqueLtrFreq">Unique Letter Frequency</option>
                        </Form.Select>
                    </div>
                    <div data-testid="w-results-words" className="w-results-words">
                        {possible.map(word => {
                            return word + ', ';
                        })}
                    </div>
                </div>}
            </div>
        </div>
    </>
}

export default Wordle;