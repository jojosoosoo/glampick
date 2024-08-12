import React, { useEffect, useState } from "react";
import { AdminHeader, GlampingKingStyle } from "../../styles/AdminStyle";
import AdminCategories from "../../components/mypage/AdminCategories";
import AdminSignupCard from "../../components/admin/AdminSignupCard";
import { adminAccessTokenState } from "../../atoms/loginState";
import { useRecoilState } from "recoil";
import { getAdminExitList } from "../../apis/adminapi";

const AdminExit = () => {
  const [adminAccessToken, setAdminAccessToken] = useRecoilState(
    adminAccessTokenState,
  );
  // 탈퇴 사장님 리스트
  const [exitList, setExitList] = useState([]);

  // 토큰 정보 불러오기
  useEffect(() => {
    const fetchAdminAccessToken = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          setAdminAccessToken(token);
          console.log("accessToken 있음");
        } else {
          console.log("accessToken 없음");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdminAccessToken();
  }, [setAdminAccessToken]);

  // 승인 대기 중인 사장님 회원가입 리스트
  useEffect(() => {
    const getExitList = async () => {
      try {
        if (adminAccessToken) {
          const list = await getAdminExitList(adminAccessToken);
          setExitList(list);
          console.log("리스트: ", list);
        } else {
          console.log("엑세스 토큰 없음");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (adminAccessToken) {
      getExitList();
    }
  }, [adminAccessToken]);

  return (
    <GlampingKingStyle>
      <AdminHeader>글램픽 관리자 페이지</AdminHeader>
      <AdminCategories />
      <div className="inner">
        <h3>사장님 가입 관리</h3>
        <div className="exit-inner">
          {exitList.length > 0 ? (
            exitList.map(item => (
              <AdminSignupCard
                key={item.ownerId}
                ownerName={item.ownerName}
                ownerId={item.ownerId}
              />
            ))
          ) : (
            <h5>탈퇴 대기 중인 목록이 없습니다.</h5>
          )}
        </div>
      </div>
    </GlampingKingStyle>
  );
};

export default AdminExit;
