import styled from "@emotion/styled";
import { useState } from "react";
import { Link } from "react-router-dom";
import ClampingImage from "../images/main-list-1.png";
import { colorSystem } from "../styles/color";
import { MainButton } from "./common/Button";
import CreateReviewModal from "./common/CreateReviewModal";

export const FormContents = styled.div`
  width: 100%;
  height: 278px;
  margin-top: 13px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 65px;

  .top-contents {
    width: 100%;
    height: 25%;
    padding: 14px 20px;
    border-bottom: 2px solid ${colorSystem.g200};
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .reserv-number {
    font-size: 0.9rem;
    color: ${colorSystem.g800};
  }

  .bottom-contents {
    width: 100%;
    height: 75%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    display: flex;
    font-size: 0.85rem;
    color: ${colorSystem.g700};
    margin-left: 5px;
  }

  .glampingdetail-link {
    width: 100%;
    display: flex;
    gap: 20px;
  }

  .reserv-info-img {
    width: 140px;
    height: 110px;
    background: url(${ClampingImage}) no-repeat center;
    border-radius: 20px;
  }
  .reserv-info-txt {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: ${colorSystem.g900};
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .room-type {
    font-size: 1.1rem;
  }

  .date-used {
    font-size: 0.9rem;
  }

  .check-time {
    font-size: 0.9rem;
  }

  /* 예약취소 작성 버튼 */
  .cancel-btn {
    width: 40px;
    height: 35px;
    /* 높이 같지 않을 시 글자 위치가 달라짐 */
    font-size: 0.85rem;
    font-weight: 500;
    color: ${colorSystem.error};
    justify-content: flex-end;
    margin-left: auto;
    border: none;
    background-color: none;
    cursor: pointer;
    display: block;
  }

  /* 후기 작성 버튼 */
  .review-btn {
    display: flex;
    justify-content: flex-end;
    > button {
      width: 80px;
      height: 35px;
      font-size: 0.8rem;
      background-color: white;
      color: ${colorSystem.g800};
      border: 1.5px solid ${colorSystem.p700};
      &:hover {
        background-color: ${colorSystem.p700};
        color: white;
      }
    }
  }

  /* 빈공간 채우기 */
  .empty-space {
    width: 40px;
    height: 35px;
    justify-content: flex-end;
    margin-left: auto;
  }
`;

export const BookingDetailForm = ({
  booking,
  upcoming,
  isCompleted,
  isCancelled,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const handleOpenCreateReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseCreateReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  if (!booking) return null;

  return (
    <FormContents>
      <div className="top-contents">
        <h2>2024.06.27(목)</h2>
        <div className="reserv-number">예약번호: </div>
      </div>
      <div className="bottom-contents">
        <p>숙소</p>
        <div className="reserv-info">
          <Link to="/glampingdetail" className="glampingdetail-link">
            <div className="reserv-info-img">
              <img src={booking.glampImage} alt="Glamping" />
            </div>
            <div className="reserv-info-txt">
              <h4>{booking.glampName}</h4>
              <div className="room-type">{booking.roomName}</div>
              <div className="date-used">
                {booking.checkInDate} ~ {booking.checkOutDate} | 1박
              </div>
              <div className="check-time">
                체크인 {booking.checkInTime} | 체크아웃 {booking.checkOutTime}
              </div>
            </div>
          </Link>
        </div>
        {upcoming ? (
          <div className="cancel-btn">취소</div>
        ) : isCompleted ? (
          <div className="review-btn">
            <MainButton
              label="후기작성"
              onClick={() => {
                handleOpenCreateReviewModal();
              }}
            />
          </div>
        ) : (
          <div className="empty-space"></div>
        )}
      </div>
      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          handleCloseCreateReviewModal();
        }}
      />
    </FormContents>
  );
};

export default BookingDetailForm;
