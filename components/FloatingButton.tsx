import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
import styled from "styled-components/native";

export { FloatingButton };

const visible = true;

const FloatingButton = () => {
  if (!visible) return null;

  return (
    <Link href="/exchange" asChild>
      <Pressable>
        <ArrowsRightLeftIcon stroke="white" width={31} />
      </Pressable>
    </Link>
  );
};

const Pressable = styled.Pressable`
  background: ${Colors.green};
  border-radius: 16px;
  width: 58px;
  height: 58px;
  place-items: center;
  display: grid;
  position: absolute;
  bottom: 52px;
  right: 28px;
`;
