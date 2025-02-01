import { useRouter } from "expo-router";

const visible = true;

export const FloatingButton = () => {
  const router = useRouter();

  if (!visible) return null;

  return <>hiii</>;
};
