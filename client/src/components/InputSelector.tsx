interface Props {
  useType: boolean;
  setUseType: (useType: boolean) => void;
}

function InputSelector({ useType, setUseType }: Props) {
  const colors = {
    selected: "bg-sky-400 text-white",
    unselected: "bg-white text-sky-400",
  };

  return (
    <div>
      <button
        className={
          "py-2 w-[70px] rounded-md rounded-r-none ml-4 drop-shadow-md font-semibold " +
          (useType ? colors.selected : colors.unselected)
        }
        onClick={() => setUseType(true)}
      >
        Type
      </button>
      <button
        className={
          "py-2 w-[70px] rounded-md rounded-l-none mr-4 drop-shadow-md font-semibold " +
          (!useType ? colors.selected : colors.unselected)
        }
        onClick={() => setUseType(false)}
      >
        Speak
      </button>
    </div>
  );
}

export default InputSelector;
