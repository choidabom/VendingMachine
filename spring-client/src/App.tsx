import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import VendingMachine from "./pages/VendingMachine";
import InitVendingMachine from './pages/InitVendingMachine';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/vending_machine' element={<InitVendingMachine />} />
                    <Route path='/vending_machine/:vmID' element={<VendingMachine />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
