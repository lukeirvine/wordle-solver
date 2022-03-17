// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, screen, waitForElementToBeRemoved } from './test-utils';
import userEvent from '@testing-library/user-event'
import App from './App';
import { Container } from 'react-bootstrap';
import { getBlankGoal, dayInMili } from './resources/Functions';

const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

