import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

function InfoCard({ title, children }: Props) {
  return (
    <div className="h-[400px] py-3 px-4 text-gray-800 border-[1px] border-gray-500 rounded-md">
      <span className="block font-bold text-xl mb-9">{title}</span>
      <div>{children}</div>
    </div>
  );
}

export default InfoCard;
