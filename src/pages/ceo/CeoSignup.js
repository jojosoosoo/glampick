import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  postOwnerAuthCode,
  postOwnerCheckSms,
  postOwnerMailSend,
  postOwnerSendSms,
  postOwnerSignUp,
} from "../../apis/ceoapi";
import AlertModal from "../../components/common/AlertModal";
import { CeoButton } from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import { ceoValidationSchema } from "../../components/validation/ceoValidationSchema";
import useModal from "../../hooks/UseModal";
import { colorSystem, size } from "../../styles/color";
import { TimerWrap } from "./CeoInfo";
import { useNavigate } from "react-router-dom";

const CeoSignUpStyle = styled.div`
  position: relative;

  .container {
    display: flex;
    width: 760px;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    width: 80%;
    display: flex;
    padding: 20px;
    justify-content: center;
    color: ${colorSystem.g800};
    font-size: 1.6rem;
    border-bottom: 1.5px solid ${colorSystem.g500};
    /* 반응형 */
    ${size.mid} {
      font-size: 1.4rem;
    }
  }
`;

export const SignupWrapStyle = styled.div`
  width: 100%;
  margin: 0 auto;

  form {
    width: 80%;
    margin: 0 auto;
  }

  .form-group {
    width: 100%;

    label {
      display: block;
      font-size: 1.1rem;
      margin-top: 20px;
      margin-bottom: 9px;
    }

    input {
      width: calc(100% - 150px - 10px);
      height: 40px;
      border: none;
      background-color: ${colorSystem.g100};
      padding: 10px;
      font-size: 0.9rem;
      border-radius: 10px;
    }
  }

  .input-group {
    display: flex;
    justify-content: space-between;

    input {
      width: calc(100% - 150px - 10px);
      height: 40px;
      border: none;
      background-color: ${colorSystem.g100};
      padding: 10px;
      font-size: 0.9rem;
      border-radius: 10px;
    }

    .form-button > button {
      width: 140px;
      height: 40px;
      font-size: 0.95rem;
    }
  }

  // 회원가입 버튼
  .signup-button > button {
    width: 100%;
    height: 50px;
    margin-top: 30px;
    margin-bottom: 100px;
    font-size: 1.2rem;
    ${size.mid} {
      font-size: 1.1rem;
      margin-bottom: 80px;
    }
  }
`;

// 에러메세지
export const ErrorMessage = styled.span`
  display: block;
  color: ${colorSystem.error};
  font-size: 0.9rem;
  margin-left: 3px;
  margin-top: 5px;
`;

// 폼의 초기값
const initState = {
  ceoEmail: "",
  password: "",
  name: "",
  businessNumber: "",
  file: "",
  phone: "",
};

// 모달 메시지 설정
export const modalMessages = {
  mailSend: {
    SU: "인증코드가 발송되었습니다. \n 메일을 확인해주세요",
    DE: "중복된 이메일입니다.",
    EE: "메일 주소를 입력해주세요.",
    IE: "메일 형식이 올바르지 않습니다.",
    default: "메일 발송에 실패하였습니다. \n 다시 시도해주세요.",
  },
  emailAuth: {
    SU: "인증이 완료되었습니다.",
    IC: "인증코드가 올바르지 않습니다.",
    VF: "인증코드를 입력해주세요.",
    default: "인증에 실패하였습니다. \n 다시 시도해주세요.",
  },
  businessNumber: {
    SU: "사업자등록번호 인증이 완료되었습니다.",
    INVALID: "유효하지 않은 사업자등록번호입니다.",
    ERROR: "사업자등록번호 확인에 실패하였습니다. \n 다시 시도해주세요.",
  },
  smsSend: {
    SU: "인증코드가 발송되었습니다. \n 문자메세지를 확인해주세요",
    DT: "중복된 전화번호 입니다.",
    IPH: "전화번호 형식이 올바르지 않습니다.",
    default: "문자 발송에 실패하였습니다. \n 다시 시도해주세요.",
  },
  phoneAuth: {
    SU: "인증이 완료되었습니다.",
    IC: "인증코드가 올바르지 않습니다.",
    VF: "인증코드를 입력해주세요.",
    default: "인증에 실패하였습니다. \n 다시 시도해주세요.",
  },
  patchOwner: {
    SU: "수정이 완료되었습니다.",
  },
};

// 모달 열기 함수
const handleModalOpen = (code, type, openModal) => {
  const message = modalMessages[type][code] || modalMessages[type].default;
  openModal({ message });
};

const CeoSignup = () => {
  // form 의 상태를 관리하는 기능
  // register : 각 항목의 데이터를 등록한다.
  // handleSubmit : 전송 이벤트 처리
  // formState : 폼의 데이터
  // setValue :  강제로 값을 셋팅 처리
  // formState : {errors}  폼에 형식에 맞지 않으면 에러출력
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ceoValidationSchema),
    defaultValues: initState,
    mode: "onChange",
  });
  // 메일발송 여부 확인
  const [isEmailSent, setIsEmailSent] = useState(false);
  // 이메일 인증을 위한 타이머 변수
  const [emailTimer, setEmailTimer] = useState(0);
  const [emailTimerId, setEmailTimerId] = useState(null);
  // 인증 완료 여부 상태 추가
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthCodeVerified, setIsAuthCodeVerified] = useState(false);

  // 사업자번호 인증 확인
  const [isBusinessNumberCheck, setIsBuisnessNumberCheck] = useState(false);
  const [isBusinessNumberVerified, setIsBuisnessNumberVerified] =
    useState(false);
  // 파일 상태 추가
  const [selectedFile, setSelectedFile] = useState(null);

  // 핸드폰 발송 여부 확인
  const [isSmsSent, setIsSmsSent] = useState(false);
  // 핸드폰 인증을 위한 타이머 변수
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [phoneTimerId, setPhoneTimerId] = useState(null);
  // 인증 완료 여부 상태 추가
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneAuthCodeVerified, setIsPhoneAuthCodeVerified] = useState(false);

  // 로딩
  const [loading, setLoading] = useState(false);
  // 모달
  const { openModal, closeModal, isModalOpen, modalMessage } = useModal();
  const navigate = useNavigate();

  // 메일 인증 타이머 초기화 및 정리
  useEffect(() => {
    if (emailTimer > 0 && !emailTimerId) {
      const id = setInterval(() => {
        setEmailTimer(prevemailTimer => prevemailTimer - 1);
      }, 1000); // 1000밀리초 (1초)마다 실행
      setEmailTimerId(id);
    } else if (emailTimer === 0 && emailTimerId) {
      clearInterval(emailTimerId);
      setEmailTimerId(null);
    }
    return () => {
      if (emailTimerId) {
        clearInterval(emailTimerId);
        setEmailTimerId(null);
      }
    };
  }, [emailTimer, emailTimerId]);

  // 이메일 타이머 포맷 함수 (분:초 형식으로 표시)
  const formatEmailTimer = () => {
    const minutes = Math.floor(emailTimer / 60);
    const seconds = emailTimer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // 이메일 인증코드 발송
  const handlEmailClick = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = watch("ceoEmail");
      const result = await postOwnerMailSend({ ceoEmail: email });
      console.log(result);
      handleModalOpen(result.data.code, "mailSend", openModal);
      if (result.data.code === "SU") {
        // 메일 발송 성공
        setIsEmailSent(true);
        setEmailTimer(299);
      } else {
        setIsEmailSent(false);
      }
    } catch (error) {
      openModal({ message: modalMessages.mailSend.default });
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증코드 확인 함수
  const handleEmailAuthCodeClick = async e => {
    e.preventDefault();
    const email = watch("ceoEmail");
    const authCode = watch("emailAuthCode");

    try {
      const result = await postOwnerAuthCode({ ceoEmail: email, authCode });
      console.log(result);

      if (result.data.code === "SU") {
        // 인증이 성공한 경우에만 처리
        setIsEmailVerified(true); // 이메일 인증 완료
        setIsAuthCodeVerified(true); // 이메일 인증 코드 확인 완료
        handleModalOpen(result.data.code, "emailAuth", openModal);
        setIsEmailSent(false);
        setEmailTimer(0);

        if (emailTimerId) {
          clearInterval(emailTimerId);
          setEmailTimerId(null);
        }
      } else {
        // 인증이 실패한 경우에는 타이머를 유지
        setIsAuthCodeVerified(false);
        handleModalOpen(result.data.code, "emailAuth", openModal);
      }
    } catch (error) {
      openModal({ message: modalMessages.emailAuth.default });
    }
  };

  // 사업자등록번호 확인 로직
  const handleBusinessNumberClick = async e => {
    e.preventDefault();
    const businessNumber = watch("businessNumber");
    const serviceKey =
      "XQOQV4Xnr3Q6b%2BMG2%2B6EV3HEaxW1RjQ6FZFmUpraSqUGeCBZRw2Tmh8tf6KuSVyKhXn4IjdqLzLIxSvF4shDtQ%3D%3D";
    setLoading(true);

    try {
      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`,
        {
          b_no: [businessNumber],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = response.data;
      const businessInfo = result.data[0];

      console.log(result.data);
      console.log(result.data[0]);
      // console.log(result.data[0].b_stt_cd);
      // console.log(result.data[0].tax_type);
      //  console.log(result.data[0].b_stt_cd)의 결과값이 01인 경우만 인증이 완료되었습니다.
      // 값이 비어있는 경우 console.log(result.data[0].tax_type); 에러메세지 출력하기

      if (businessInfo && businessInfo.b_stt_cd === "01") {
        handleModalOpen("SU", "businessNumber", openModal); // 성공
        setIsBuisnessNumberCheck(true);
        setIsBuisnessNumberVerified(true);
      }
      if (businessInfo && businessInfo.b_stt_cd === "") {
        handleModalOpen("INVALID", "businessNumber", openModal); // 실패
        setIsBuisnessNumberCheck(false);
        setIsBuisnessNumberVerified(false);
      }
    } catch (error) {
      console.error(error);
      handleModalOpen("ERROR", "businessNumber", openModal);
    } finally {
      setLoading(false);
    }
  };

  // 사업자등록증 업로드
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      console.log("선택된 파일:", file);
      setSelectedFile(file); // 선택된 파일을 상태에 저장
    } else {
      console.log("파일이 선택되지 않았습니다.");
      setSelectedFile(null);
    }
  };

  // 핸드폰 인증 타이머 초기화 및 정리
  useEffect(() => {
    if (phoneTimer > 0 && !phoneTimerId) {
      const id = setInterval(() => {
        setPhoneTimer(prevPhoneTimer => prevPhoneTimer - 1);
      }, 1000); // 1000밀리초 (1초)마다 실행
      setPhoneTimerId(id);
    } else if (phoneTimer === 0 && phoneTimerId) {
      clearInterval(phoneTimerId);
      setPhoneTimerId(null);
    }
    return () => {
      if (phoneTimerId) {
        clearInterval(phoneTimerId);
        setPhoneTimerId(null);
      }
    };
  }, [phoneTimer, phoneTimerId]);

  // 핸드폰 타이머 포맷 함수 (분:초 형식으로 표시)
  const formatPhoneTimer = () => {
    const minutes = Math.floor(phoneTimer / 60);
    const seconds = phoneTimer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // 휴대폰 인증코드 발송
  const handlPhoneClick = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const phone = watch("phone");
      const result = await postOwnerSendSms({ phone });
      console.log(result);
      handleModalOpen(result.data.code, "smsSend", openModal);
      if (result.data.code === "SU") {
        // Sms 발송 성공
        setIsSmsSent(true);
        setPhoneTimer(299);
      } else {
        setIsSmsSent(false);
      }
    } catch (error) {
      openModal({ message: modalMessages.smsSend.default });
    } finally {
      setLoading(false);
    }
  };

  // 휴대폰 인증코드 확인
  const handlePhoneAuthCodeClick = async e => {
    e.preventDefault();
    const phone = watch("phone");
    const phoneAuthCode = watch("phoneAuthCode");
    try {
      const result = await postOwnerCheckSms({
        phone,
        phoneAuthCode,
      });
      console.log(result);

      if (result.data.code === "SU") {
        // 인증이 성공한 경우에만 처리
        setIsPhoneVerified(true);
        setIsPhoneAuthCodeVerified(true);
        handleModalOpen(result.data.code, "phoneAuth", openModal);
        setIsSmsSent(false);
        setPhoneTimer(0);
        if (phoneTimerId) {
          // 타이머 중지
          clearInterval(phoneTimerId);
          setPhoneTimerId(null);
        }
      } else {
        // 핸드폰 인증 실패 시 상태 업데이트 방지
        setIsPhoneAuthCodeVerified(false);
      }
    } catch (error) {
      openModal({ message: modalMessages.phoneAuth.default });
    }
  };

  // // 전화번호 자동 변경
  // const handleChangePhone = e => {
  //   const phoneNumber = formatPhoneNumber(e.target.value);
  //   // console.log(phoneNumber);
  //   setValue("phone", phoneNumber);
  // };

  // // 전화번호 형식
  // const formatPhoneNumber = value => {
  //   if (!value) return value;
  //   const phoneNumber = value.replace(/[^\d]/g, "");
  //   const phoneNumberLength = phoneNumber.length;
  //   if (phoneNumberLength < 4) return phoneNumber;
  //   if (phoneNumberLength < 8) {
  //     return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  //   }
  //   return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  // };

  const onSubmit = async data => {
    console.log("이메일 인증 상태:", isEmailSent);
    console.log("이메일 인증코드 확인 상태:", isAuthCodeVerified);
    console.log("사업자등록번호 체크 상태:", isBusinessNumberCheck);
    console.log("선택된 파일:", selectedFile);
    console.log("휴대폰 인증 상태:", isSmsSent);
    console.log("휴대폰 인증코드 확인 상태:", isPhoneAuthCodeVerified);
    // 사업자등록증 첨부 체크
    if (!selectedFile) {
      openModal({ message: "사업자등록증을 첨부해주세요." });
      return;
    }
    // 이메일 인증여부 체크
    if (!isEmailVerified || !isAuthCodeVerified) {
      openModal({ message: "이메일 인증을 완료해주세요." });
      return;
    }
    // 사업자등록번호 체크
    if (!isBusinessNumberCheck) {
      openModal({ message: "사업자등록번호를 확인해주세요." });
      return;
    }
    // 핸드폰 인증여부 체크
    if (!isPhoneVerified || !isPhoneAuthCodeVerified) {
      openModal({ message: "휴대폰 인증을 완료해주세요." });
      return;
    }
    console.log("전송시 데이터 ", data);
    try {
      const response = await postOwnerSignUp({
        file: selectedFile, // 상태에서 파일 가져오기
        businessNumber: data.businessNumber,
        ceoEmail: data.ceoEmail,
        password: data.password,
        name: data.name,
        phone: data.phone,
      });
      if (response.data.code === "SU") {
        openModal({
          message:
            "회원가입에 성공하였습니다. \n 로그인은 관리자 승인 후 처리됩니다.",
          onClose: () => navigate("/ceologin"), // 모달 닫힘 후 페이지 이동
        });
      }
      console.log(response);
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <CeoSignUpStyle>
      {loading && <Loading />}
      <div className="container">
        <h2>회원가입</h2>
        <SignupWrapStyle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>이메일</label>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="glampickceo@good.kr"
                  {...register("ceoEmail")}
                  disabled={isEmailVerified} // 인증 완료 시 비활성화
                />
                <div className="form-button">
                  <CeoButton
                    label="인증코드 발송"
                    onClick={e => {
                      handlEmailClick(e);
                    }}
                  />
                  <AlertModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    message={modalMessage}
                  />
                </div>
              </div>
            </div>
            {errors.ceoEmail && (
              <ErrorMessage>{errors.ceoEmail.message}</ErrorMessage>
            )}
            <div className="form-group">
              <label>인증 코드</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="인증코드를 입력해주세요"
                  {...register("emailAuthCode")}
                />
                <div className="form-button">
                  <CeoButton
                    label="확인"
                    onClick={e => {
                      handleEmailAuthCodeClick(e);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* 타이머 */}
            {isEmailSent && emailTimer > 0 && (
              <TimerWrap>
                <p className="timer">남은시간: {formatEmailTimer()}</p>
              </TimerWrap>
            )}
            {isEmailSent && emailTimer === 0 && (
              <div>
                <p className="time-over">
                  인증 시간이 만료되었습니다. 다시 발송해주세요.
                </p>
              </div>
            )}
            {/* {errors.emailAuthCode && (
              <ErrorMessage>{errors.emailAuthCode.message}</ErrorMessage>
            )} */}
            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호를 한번 더 입력해주세요"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                {...register("name")}
              />
            </div>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            <div className="form-group">
              <label>사업자등록번호</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="사업자등록번호는 숫자로만 입력해주세요"
                  {...register("businessNumber")}
                />
                <div className="form-button">
                  <CeoButton
                    label="확인"
                    onClick={e => {
                      handleBusinessNumberClick(e);
                    }}
                  />
                </div>
              </div>
            </div>
            {errors.businessNumber && (
              <ErrorMessage>{errors.businessNumber.message}</ErrorMessage>
            )}
            {/* 사업자등록증 이미지 업로드 */}
            <div className="form-group">
              <label htmlFor="businessRegistrationImg">사업자등록증 첨부</label>
              <input
                type="file"
                accept="image/*" // 이미지 형식만 가능
                {...register("businessRegistrationImg", {
                  required: "사업자등록증 첨부는 필수 항목입니다.",
                })}
                onChange={e => {
                  handleImageUpload(e);
                }}
              />
            </div>
            {errors.businessRegistrationImg && (
              <ErrorMessage>
                {errors.businessRegistrationImg.message}
              </ErrorMessage>
            )}
            <div className="form-group">
              <label>휴대폰</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="휴대폰번호를 정확히 입력해주세요"
                  {...register("phone")}
                  disabled={isPhoneVerified} // 인증 완료 시 비활성화
                  // onChange={e => {
                  //   handleChangePhone(e);
                  // }}
                />
                <div className="form-button">
                  <CeoButton
                    label="인증코드 발송"
                    onClick={e => {
                      handlPhoneClick(e);
                    }}
                  />
                </div>
              </div>
            </div>
            {errors.phone && (
              <ErrorMessage>{errors.phone.message}</ErrorMessage>
            )}
            <div className="form-group">
              <label>인증 코드</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="인증코드를 입력해주세요"
                  {...register("phoneAuthCode")}
                />
                <div className="form-button">
                  <CeoButton
                    label="확인"
                    onClick={e => {
                      handlePhoneAuthCodeClick(e);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* {errors.phoneAuthCode && (
              <ErrorMessage>{errors.phoneAuthCode.message}</ErrorMessage>
            )} */}
            {/* 타이머 */}
            {isSmsSent && phoneTimer > 0 && (
              <TimerWrap>
                <p className="timer">남은 시간: {formatPhoneTimer()}</p>
              </TimerWrap>
            )}
            {isSmsSent && phoneTimer === 0 && (
              <div>
                <p className="time-over">
                  인증 시간이 만료되었습니다. 다시 발송해주세요.
                </p>
              </div>
            )}
            <div className="signup-button">
              <CeoButton label="회원가입" type="submit" />
            </div>
          </form>
        </SignupWrapStyle>
      </div>
    </CeoSignUpStyle>
  );
};

export default CeoSignup;
