import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import LoadingSpin from '../components/LoadingSpin'

const NotLoggedIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/checkToken`, {
                    withCredentials: true,  // ส่ง cookie ที่ตั้งค่า httpOnly ไปกับคำขอ
                });
                
                const { status } = response.data;
                if (status) {
                    // หากสถานะเป็น true แสดงว่า user ได้ล็อกอินแล้ว
                    setIsLoggedIn(true);
                } else {
                    // หากไม่ใช่แสดงว่า user ยังไม่ได้ล็อกอิน
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error(err);
                setIsLoggedIn(false);
            }
        };

        checkToken();  // เรียกใช้งานฟังก์ชันตรวจสอบ token
    }, []);

    // ในกรณีที่ยังไม่ได้รับผลลัพธ์จากการตรวจสอบ token (ยังคงรอ)
    if (isLoggedIn === null) {
        return <LoadingSpin/> // แสดงข้อความโหลดก่อน
    }

    // หากล็อกอินแล้วก็จะถูกนำทางไปที่หน้าอื่น
    if (isLoggedIn) {
        return <Navigate to="/" replace />;  // ถ้าเข้าสู่ระบบแล้วจะไม่สามารถเข้า NotLoggedIn ได้
    }

    // หากยังไม่ได้ล็อกอินก็จะให้เข้าถึงหน้า Outlet ได้
    return <Outlet />;
};

export default NotLoggedIn;
