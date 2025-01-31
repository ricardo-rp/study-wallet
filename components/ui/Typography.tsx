import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export { Headline4, Span };

const Span = styled.Text`
  font-size: 15px;
  font-weight: 400;
  line-height: 19.53px;
  text-align: right;
  color: ${Colors.darkBlue};
`;

const Headline4 = styled(Span)`
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.4000000059604645px;
  text-align: left;
  color: ${Colors.darkBlue};
`;
