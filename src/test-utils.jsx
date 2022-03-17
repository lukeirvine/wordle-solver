import React from 'react';
import { render } from '@testing-library/react';
// import { AuthProvider } from "./Auth";
import { BrowserRouter } from 'react-router-dom';

// tutorial for this code found at https://testing-library.com/docs/react-testing-library/setup

const AllTheProviders = ({ children }) => {
    return (
        // <AuthProvider>
            <BrowserRouter basename={process.env.PUBLIC_URL} onUpdate={() => window.scrollTo(0,0)}>
                {children}
            </BrowserRouter>
        // </AuthProvider>
    )
}

const customRender = (ui, options) => 
    render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
