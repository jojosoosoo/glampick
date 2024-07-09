import styled from "@emotion/styled";
import { colorSystem } from "./color";

export const ModalBtn = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15px;
  > button {
    max-width: 45px;
    width: 100%;
    height: 23px;
    font-size: 0.65rem;
    padding: 0;
  }
`;

export const ModalLine = styled.div`
  width: 100%;
  border-bottom: 1px solid ${colorSystem.p100};
  margin-top: 10px;
`;

export const ModalStyle = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid ${colorSystem.p100};
  width: 250px;
  height: 120px;
  font-size: 0.8rem;
  background: ${colorSystem.white};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding-top: 15px;
  z-index: 99999;
  > p {
    margin-top: 20px;
    color: ${colorSystem.g800};
    font-weight: 500;
    font-size: 0.8rem;
  }

  .close-btn {
    background-color: transparent;
    border: 0px;
    position: absolute;
    width: 17px;
    top: 0;
    right: 10px;
    cursor: pointer;
    max-width: 25px;
  }

  .close-btn svg {
    width: 100%;
    height: 25px;
    color: #777;
  }
`;
