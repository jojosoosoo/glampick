import axios, { AxiosResponse } from "axios";

// Define types for function parameters and responses

interface FetchGlampingDataParams {
  glampId: string;
  startDate: string;
  endDate: string;
  accessToken?: string;
}

interface GlampingDataResponse {
  // Define the structure of the response data according to your API
  [key: string]: any; // Replace with actual data structure
}

interface ToggleLikeResponse {
  resultValue: boolean; // Or the actual type of resultValue based on your API response
}

interface FetchRoomImagesResponse {
  code: string;
  // Define other fields based on your API response
  [key: string]: any; // Replace with actual data structure
}

// 1. 글램핑디테일페이지 정보 불러오기
export const fetchGlampingData = async ({
  glampId,
  startDate,
  endDate,
  accessToken,
}: FetchGlampingDataParams): Promise<GlampingDataResponse> => {
  try {
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
    const response: AxiosResponse<GlampingDataResponse> = await axios.get(
      `${process.env.PUBLIC_URL}/api/glamping/info?glampId=${glampId}&inDate=${startDate}&outDate=${endDate}`,
      { headers },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2. 관심 글램핑장 하트 버튼
export const toggleLikeGlamping = async (
  glampId: string,
  accessToken: string,
): Promise<ToggleLikeResponse> => {
  try {
    const response: AxiosResponse<ToggleLikeResponse> = await axios.get(
      `${process.env.PUBLIC_URL}/api/glamping/favorite?glampId=${glampId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling like status:", error);
    throw error;
  }
};

// 1. 방 이름 & 사진 정보 불러오기
export const fetchRoomImages = async (
  glampId: string,
): Promise<FetchRoomImagesResponse | undefined> => {
  try {
    const response: AxiosResponse<FetchRoomImagesResponse> = await axios.get(
      `/api/glamping/info/moreRoomImages?glampId=${glampId}`,
    );
    if (response.data.code === "SU") {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
