import { Colors } from "@/constants/Colors";
import { Link, usePathname } from "expo-router";
import { useEffect } from "react";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
import styled from "styled-components/native";

export { FloatingButton };

const FloatingButton = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/exchange")) return null;

  const href = (() => {
    if (!pathname.startsWith("/token")) return "/exchange";
    const tokenId = pathname.split("/")[2];
    return `/exchange?tokenId=${tokenId}` as const;
  })();

  return (
    <Link href={href} asChild>
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
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 52px;
  right: 28px;
`;
