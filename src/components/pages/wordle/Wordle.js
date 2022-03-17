import React, { useEffect, useState } from 'react';
import NavBar from './../../nav-bar/NavBar';
import { Form, Button } from 'react-bootstrap';
import { capitalize } from '../../../resources/Functions';
import { words, debugWords } from './wordle-words';
import './Wordle.css';

const tileColors = {
    0: 'rgb(58, 58, 60)',
    1: 'rgb(181, 159, 58)',
    2: 'rgb(83, 141, 78)',
}

const debugGrid = {
    letters: {
        0: {0: 'o', 1: 'c', 2: 'e', 3: 'a', 4: 'n'},
        1: {0: 'p', 1: 'e', 2: 'a', 3: 'c', 4: 'e'},
        2: {0: 't', 1: 'e', 2: 'r', 3: 'm', 4: 's'},
        3: {0: 'c', 1: 'a', 2: 't', 3: 'c', 4: 'h'},
        4: {0: '', 1: '', 2: '', 3: '', 4: ''},
        5: {0: '', 1: '', 2: '', 3: '', 4: ''}
    },
    colors: {
        0: {0: 0, 1: 1, 2: 1, 3: 1, 4: 0},
        1: {0: 0, 1: 1, 2: 1, 3: 1, 4: 0},
        2: {0: 1, 1: 1, 2: 1, 3: 0, 4: 0},
        3: {0: 2, 1: 2, 2: 2, 3: 0, 4: 0},
        4: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0},
        5: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    },
    index: {
        i: 4,
        j: 0
    }
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

const Wordle = () => {
    const [grid, setGrid] = useState(blankGrid)
    const [valid, setValid] = useState(false);
    const [possible, setPossible] = useState([]);

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
            not: ''
        };
        
        for (let i = 0; i < grid.index.i; i++) {
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
                // if tile is yellow or green, add to 'has' if it doesn't already have letter
                    sets.has += letter;
                }
                if (color === 0 && !sets.not.includes(letter)) {
                // if tile is gray, add to 'not' if it doesn't already have letter
                    sets.not += letter;
                }
            }
        }
        
        return sets;
    }

    const handleSubmit = e => {
        e.preventDefault();
        let sets = createSets();
        console.log(sets);
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
            for (let i = 0; i < sets.has.length; i++) {
                if (!word.includes(sets.has.charAt(i))) {
                    // console.log("word in the has list that isn't in the word")
                    works = false;
                    break;
                }
            }
            // loop through characters word can't have anywhere
            for (let i = 0; i < sets.not.length; i++) {
                if (word.includes(sets.not.charAt(i))) {
                    works = false;
                    break;
                }
            }
            if (works) {
                console.log("pushing " + word)
                results.push(word);
            }
        })
        console.log(results);
        setPossible(results);
    }

    return <>
        <NavBar />
        <div className="w-page">
            <h1 className="w-title">Wordle Solver</h1>
            <div className="w-content">
                <Form className="w-grid-form w-half-content" onSubmit={handleSubmit}>
                    <div className="w-grid-container">
                        <h2 className='w-subtitle'>Entry</h2>
                        <p className="w-entry-directions">
                            Directions: Enter the words you tried on Wordle, click the tiles repeatedly to 
                            turn them yellow or green, and then click enter to see possible next words down 
                            below.
                        </p>
                        <div className="w-grid">
                            {Object.values(grid.letters).map((row, i) => (
                                <>{Object.values(row).map((tile, j) => (
                                    <div
                                        className="w-tile"
                                        style={{
                                            backgroundColor: grid.letters[i][j] === '' ? 'white' : tileColors[grid.colors[i][j]],
                                            cursor: i <= grid.index.i ? 'pointer' : ''
                                        }}
                                        onClick={handleTileClick(i, j)}
                                    >
                                        <div
                                            className="w-tile-letter"
                                        >{capitalize(tile)}</div>
                                    </div>
                                ))}</>
                            ))}
                        </div>
                    </div>
                    <div className="w-kb">
                        {keyboard.map(row => (
                            <div className="w-kb-row">
                                {row.map(letter => (
                                    <button 
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
                    <div className="w-results-words">
                        {possible.map(word => (
                            <>{word}, </>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    </>
}

export default Wordle;