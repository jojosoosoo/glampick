import styled from "@emotion/styled";
import { CeoButton, MainButton } from "../../components/common/Button";
import { colorSystem, size } from "../../styles/color";
import { useForm } from "react-hook-form";
import { postAuthCode, postMailSend } from "../../apis/userapi";
import { useState } from "react";
import Loading from "../../components/common/Loading";
import { yupResolver } from "@hookform/resolvers/yup";
import { ceoValidationSchema } from "../../components/validation/ceoValidationSchema";
import AlertModal from "../../components/common/AlertModal";
import useModal from "../../hooks/UseModal";

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
  businessRegistrationNumber: "",
  businessRegistrationImg: "",
  phone: "",
};

// 메일 발송 모달 관련 함수
const handleModalOpen = (code, openModal) => {
  const messages = {
    SU: "인증코드가 발송되었습니다. \n 메일을 확인해주세요",
    DE: "중복된 이메일입니다.",
    EE: "메일 주소를 입력해주세요.",
    IE: "메일 형식이 올바르지 않습니다.",
    default: "메일 발송에 실패하였습니다. \n 다시 시도해주세요.",
  };

  if (messages[code]) {
    openModal({
      message: messages[code],
    });
  }
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
  });
  // 로딩
  const [loading, setLoading] = useState(false);
  // 모달
  const { openModal, closeModal, isModalOpen, modalMessage } = useModal();

  const handlEmailClick = async e => {
    // 이메일 발송 로직
    e.preventDefault();
    setLoading(true);

    try {
      const email = watch("ceoEmail");
      const result = await postMailSend({ userEmail: email });
      console.log(result);
      handleModalOpen(result.data.code, openModal);
    } catch (error) {
      openModal({
        message: "메일 발송에 실패하였습니다. \n 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthCodeClick = async e => {
    // 이메일 인증코드 확인 로직
    e.preventDefault();
    const email = watch("ceoEmail");
    const authCode = watch("emailAuthCode");
    const result = await postAuthCode({ userEmail: email, authCode });
    console.log(result.data);
    if (result.data.code === "SU") {
      openModal({
        message: "인증이 완료되었습니다.",
      });
    } else if (result.data.code === "IC") {
      openModal({
        message: "인증코드가 올바르지 않습니다.",
      });
    } else if (result.data.code === "VF") {
      openModal({
        message: "인증코드를 입력해주세요.",
      });
    } else {
      openModal({
        message: "인증에 실패하였습니다. \n 다시 시도해주세요",
      });
    }
  };

  const handleBusinessRegistrationNumberClick = () => {
    // 사업자등록번호 확인 로직
  };

  const handlPhoneClick = () => {
    // 휴대폰 발송 로직
  };

  const handlePhoneAuthCodeClick = () => {
    // 휴대폰 인증코드 확인 로직
  };

  // 전화번호 자동 변경
  const handleChangePhone = e => {
    const phoneNumber = formatPhoneNumber(e.target.value);
    // console.log(phoneNumber);
    setValue("phone", phoneNumber);
  };

  // 전화번호 형식
  const formatPhoneNumber = value => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }

    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  // 사업자등록번호 자동 변경
  const handleChangeBusinessNumber = e => {
    const businessNumber = formatBusinessNumber(e.target.value);
    // console.log(BusinessNumber);
    setValue("businessRegistrationNumber", businessNumber);
  };

  // 사업자등록번호 형식
  const formatBusinessNumber = value => {
    if (!value) return value;
    const businessNumber = value.replace(/[^\d]/g, ""); // 숫자가 아닌 문자 제거
    const businessNumberLength = businessNumber.length;
    if (businessNumberLength < 4) return businessNumber;
    if (businessNumberLength < 6) {
      return `${businessNumber.slice(0, 3)}-${businessNumber.slice(3)}`;
    }

    return `${businessNumber.slice(0, 3)}-${businessNumber.slice(3, 5)}-${businessNumber.slice(5)}`;
  };

  const onSubmit = data => {
    console.log("전송시 데이터 ", data);
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
            {errors.emailAuthCode && (
              <ErrorMessage>{errors.emailAuthCode.message}</ErrorMessage>
            )}
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
                  placeholder="사업자등록번호를 입력해주세요"
                  {...register("businessRegistrationNumber")}
                  onChange={e => {
                    handleChangeBusinessNumber(e);
                  }}
                />
                <div className="form-button">
                  <CeoButton label="확인" />
                </div>
              </div>
            </div>
            {errors.businessRegistrationNumber && (
              <ErrorMessage>
                {errors.businessRegistrationNumber.message}
              </ErrorMessage>
            )}
            {/* 사업자등록증 이미지 업로드 */}
            <div className="form-group">
              <label htmlFor="businessRegistrationImg">사업자등록증 첨부</label>
              <input
                type="file"
                {...register("businessRegistrationImg", {
                  required: "사업자등록증 첨부는 필수 항목입니다.",
                })}
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
                  onChange={e => {
                    handleChangePhone(e);
                  }}
                />
                <div className="form-button">
                  <CeoButton label="인증코드 발송" />
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
                  <CeoButton label="확인" />
                </div>
              </div>
            </div>
            {errors.phoneAuthCode && (
              <ErrorMessage>{errors.phoneAuthCode.message}</ErrorMessage>
            )}
            <div className="signup-button">
              <CeoButton label="회원가입" />
            </div>
          </form>
        </SignupWrapStyle>
      </div>
    </CeoSignUpStyle>
  );
};

export default CeoSignup;
