import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import VendingMachine from "./pages/VendingMachine";
import InitVendingMachine from './pages/InitVendingMachine';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<InitVendingMachine />} />
                    <Route path='/vm/:vmID' element={<VendingMachine />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;