import { ReactNode } from "react";

interface Props {
  available: boolean;
  children: ReactNode;
}

function IngredientBagde({ available, children }: Props) {
  return (
    <span
      className={
        "inline-block py-[3px] px-[6px] m-[3px] text-[14px] text-white rounded-full " +
        (available ? "bg-green-400/75" : "bg-yellow-400/75")
      }
    >
      {children}
    </span>
  );
}

export default IngredientBagde;
