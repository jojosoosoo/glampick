import styled from "@emotion/styled";
import { colorSystem } from "../../styles/color";

const ButtonStyle = styled.button`
  cursor: pointer;
  font-family: "Pretendard Variable";
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 30px;
  height: 2.7em;
  transition:
    border 0.3s,
    background-color 0.3s,
    color 0.3s;
  border: 1px solid;
  background-color: ${props => props.bg};
  color: ${props => props.color};

  &:hover {
    border: 1px solid ${props => props.hoverBorder};
    background-color: ${props => props.hoverBg};
    color: ${props => props.hoverColor};
  }
`;

const MainButtonStyle = styled(ButtonStyle)`
  background-color: ${colorSystem.primary};
  color: ${colorSystem.white};

  &:hover {
    border: 1px solid ${colorSystem.p700};
    background-color: ${colorSystem.p700};
  }
`;

const ActionButtonStyle = styled(ButtonStyle)`
  background-color: ${colorSystem.white};
  color: ${colorSystem.p700};

  &:hover {
    background-color: #d3dce9;
  }
`;

const DelectButtonStyle = styled(ButtonStyle)`
  background-color: ${colorSystem.error};
  color: ${colorSystem.white};

  &:hover {
    border: 1px solid #ca2929;
    background-color: #ca2929;
    color: ${colorSystem.white};
  }
`;

const MainButton = ({ label = "버튼", onClick }) => {
  return <MainButtonStyle onClick={onClick}>{label}</MainButtonStyle>;
};

const ActionButton = ({ label = "버튼", onClick }) => {
  return <ActionButtonStyle onClick={onClick}>{label}</ActionButtonStyle>;
};

const DelectButton = ({ label = "버튼", onClick }) => {
  return <DelectButtonStyle onClick={onClick}>{label}</DelectButtonStyle>;
};

export { MainButton, ActionButton, DelectButton };
