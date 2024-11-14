import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import LoadingSpin from '../components/LoadingSpin'
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/reduxSlice/userSlice';

const LoggedIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const dispatch = useDispatch()

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/checkToken`, {
                    withCredentials: true, 
                });
                
                const { status } = response.data;
                if (status) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error(err);
                dispatch(clearUser())
                setIsLoggedIn(false);
            }
        };

        checkToken();
    }, []);

    if (isLoggedIn === null) {
        return <LoadingSpin/>
    }


    if (isLoggedIn) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />; 
};

export default LoggedIn;
