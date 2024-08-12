import { colorSystem, size } from "../styles/color";
import styled from "@emotion/styled";
import { FaStar } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import FavoriteIcon from "../images/icon/favorite-icon.png";
import ArticleImage from "../images/main-list-1.png";
import { MainButton } from "./common/Button";
import { Link } from "react-router-dom";

const FavoriteArticle = styled.article`
  display: flex;
  flex-direction: column;
  .article-image {
    position: relative;
    width: 290px;
    height: 190px;
    border-radius: 32px;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
    background: url(${ArticleImage}) no-repeat center;
    .article-place {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 34px;
      border-radius: 0px 0px 32px 32px;
      background: rgba(123, 123, 123, 0.5);
      padding: 0 20px;
      font-size: 16px;
      color: #fff;
      font-weight: 600;
      svg {
        width: 20px;
        height: 20px;
        color: #fff;
        margin-right: 2px;
      }
    }
  }
  .favorite-heart {
    position: absolute;
    top: 10px;
    right: 15px;
    width: 43px;
    height: 38px;
    background: url(${FavoriteIcon}) no-repeat center;
    cursor: pointer;
    ${size.mid} {
      left: 230px;
    }
  }
  ${size.mid} {
    display: flex;
    flex-direction: row;
  }
`;

const ArticleContent = styled.div`
  margin: 20px 10px 0 10px;
  ${size.mid} {
    margin-left: 20px;
    align-content: center;
  }
  .article-top {
    display: flex;
    flex-direction: grid;
    align-items: flex-end;

    ${size.mid} {
      flex-direction: column;
      align-items: baseline;
      margin-bottom: 10px;
      gap: 5px;
    }
  }
  .glamping-name {
    font-size: 18px;
    font-weight: 600;
  }
  .article-detail {
    display: flex;
    svg {
      margin: 0 5px;
      color: #ffd233;
    }
    .review-score {
      margin-right: 5px;
      font-size: 14px;
      font-weight: 600;
    }
    .review-count {
      font-size: 14px;
    }
  }

  .article-bottom {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;
    .glamping-price {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 5px;
    }
    ${size.mid} {
      margin-top: 20px;
      flex-direction: column;
    }
  }
`;

interface FavoriteCardProps {
  reviewCount: number;
  price: string;
  starPoint: number;
  glampImage?: string;
  glampLocation: string;
  glampName: string;
  glampId: string;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  reviewCount,
  price,
  starPoint,
  glampImage,
  glampLocation,
  glampName,
  glampId,
}) => {
  return (
    <FavoriteArticle key={glampId}>
      <Link to="/glampingdetail">
        <div className="article-image">
          <div className="article-place">
            <MdPlace />
            {glampLocation}
          </div>
        </div>
      </Link>
      <div className="favorite-heart"></div>
      <ArticleContent>
        <div className="article-top">
          <Link to="/glampingdetail">
            <div className="glamping-name">{glampName}</div>
          </Link>
          <div className="article-detail">
            <FaStar />
            <div className="review-score">{starPoint}</div>
          </div>
          <div className="review-count">(리뷰 {reviewCount}개)</div>
        </div>
        <div className="article-bottom">
          <div className="glamping-price">{price}원~</div>
          <Link to="/glampingdetail">
            <MainButton label="예약하기"></MainButton>
          </Link>
        </div>
      </ArticleContent>
    </FavoriteArticle>
  );
};

export default FavoriteCard;
