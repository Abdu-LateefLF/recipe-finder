import { useRef } from "react";

interface Props {
  handleSubmit: (ingredient: string) => void;
}

function TextInput({ handleSubmit }: Props) {
  const ingredientRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="py-[40px] md:py-[60px] w-[100%] self-center"
      onSubmit={(event) => {
        event.preventDefault();

        if (ingredientRef.current && ingredientRef.current.value != "") {
          handleSubmit(ingredientRef.current.value.trim());

          ingredientRef.current.value = "";
        }
      }}
    >
      <div className="text-center">
        <input
          className="border-[1px] border-gray-500 rounded-md px-3 py-4 w-[60%] sm:w-[50%]"
          type="text"
          placeholder="List ingredients here.."
          ref={ingredientRef}
        />
        <button
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-5 rounded-md mx-4 drop-shadow-md"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default TextInput;
