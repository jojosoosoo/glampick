import axios from "axios";

// 예약 수 데이터
export const getBookingData = async (token, startDayId, endDayId) => {
  try {
    const url = `/api/jin/poproom?startDayId=${startDayId}&endDayId=${endDayId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 매출 데이터
export const getRevenueData = async (token, startDayId, endDayId) => {
  try {
    const url = `/api/jin/revenue?startDayId=${startDayId}&endDayId=${endDayId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 취소율 데이터
export const getCancelData = async (token, startDayId, endDayId) => {
  try {
    const url = `/api/jin/glampingcancel?startDayId=${startDayId}&endDayId=${endDayId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
