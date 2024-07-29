import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import "../src/styles/color";
import "../src/styles/common.css";
import "../src/styles/reset.css";
import "./App.css";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CeoBooking from "./pages/ceo/CeoBooking";
import CeoGlamping from "./pages/ceo/CeoGlamping";
import CeoInfo from "./pages/ceo/CeoInfo";
import CeoReview from "./pages/ceo/CeoReview";
import CeoRoom from "./pages/ceo/CeoRoom";
import CeoSignup from "./pages/ceo/CeoSignup";
import Chart from "./pages/ceo/Chart";
import GlampingDetail from "./pages/GlampingDetail";
import GlampingKing from "./pages/GlampingKing";
import MainPage from "./pages/MainPage";
import BookingDetail from "./pages/mypage/BookingDetail";
import Favorite from "./pages/mypage/Favorite";
import MyReview from "./pages/mypage/MyReview";
import UserInfo from "./pages/mypage/UserInfo";
import NotfoundPage from "./pages/NotfoundPage";
import PaymentDone from "./pages/PaymentDone";
import PaymentPage from "./pages/PaymentPage";
import Review from "./pages/Review";
import RoomDetail from "./pages/RoomDetail";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignupPage";
import SnsSignupPage from "./pages/user/SnsSignUpPage";
import { getCookie, removeCookie } from "./utils/cookie";
import { useRecoilState } from "recoil";
import { accessTokenState, isLoginState } from "./atoms/loginState";

function App() {
  // 리코일로 로그인 상태 관리 변경
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const locationNow = useLocation();
  const navigate = useNavigate();

  // 숫자가 아닌 경우 NotfoundPage를 렌더링하는 컴포넌트
  const GlampingDetailWrapper = ({ isLogin }) => {
    const { glampId } = useParams();
    if (!/^\d+$/.test(glampId)) {
      return <NotfoundPage />;
    }
    return <GlampingDetail isLogin={isLogin} />;
  };

  // 페이지 이동할 때마다 로그인 확인
  useEffect(() => {
    // (변경) 로컬스토리에 토큰 저장
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [locationNow]); // location 변경시마다

  // 로그아웃
  const handleLogout = () => {
    // 로컬스토리지에서 토큰 삭제
    localStorage.removeItem("accessToken", { path: "/" });
    setIsLogin(false);
    navigate("/login");
    setAccessToken("");
  };

  return (
    <div>
      <Header isLogin={isLogin} handleLogout={handleLogout} />
      <Routes>
        {/* 메인 */}
        <Route path="/" element={<MainPage isLogin={isLogin} />}></Route>

        {/* 로그인, 회원가입 */}
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/sns-signup" element={<SnsSignupPage />}></Route>

        {/* 검색 결과 */}
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/places/:glampId"
          element={<GlampingDetailWrapper isLogin={isLogin} />}
        />
        <Route path="/roomdetail/:glampId" element={<RoomDetail />}></Route>
        <Route path="/review/:glampId" element={<Review />}></Route>

        {/* 결제 페이지 */}
        <Route path="/payment/:glampId" element={<PaymentPage />} />
        {/* <Route path="/payment" element={<PaymentPage />}></Route> */}
        <Route path="/paymentcompleted" element={<PaymentDone />}></Route>

        {/* 유저 페이지 */}
        <Route path="/bookingdetail" element={<BookingDetail />} />
        <Route path="/myreview" element={<MyReview />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/userinfo" element={<UserInfo />} />

        {/* 사장님 페이지 */}
        <Route path="/ceobooking" element={<CeoBooking />} />
        <Route path="/ceoglamping" element={<CeoGlamping />} />
        <Route path="/ceoinfo" element={<CeoInfo />} />
        <Route path="/ceoreview" element={<CeoReview />} />
        <Route path="/ceoroom" element={<CeoRoom />} />
        <Route path="/ceosignup" element={<CeoSignup />} />
        <Route path="/chart" element={<Chart />} />

        {/* 관리자 페이지 */}
        <Route path="/glampingking" element={<GlampingKing/>} />

        {/* 잘못된 경로 */}
        <Route path="/*" element={<NotfoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
