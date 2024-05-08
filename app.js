import React from 'react';
import { useAuth } from './AuthContext';
import Login from './Login';
import TinderCards from './TinderCards';  //change idk the real component name

const App = () => {
    const { user } = useAuth();

    return (
        <div>
            {user ? <TinderCards /> : <Login />}
        </div>
    );
};

export default App;
