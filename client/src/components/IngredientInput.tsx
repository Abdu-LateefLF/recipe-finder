import VoiceInput from "./VoiceInput";
import TextInput from "./TextInput";
import InputSelector from "./InputSelector";
import { useState } from "react";
import useSearch from "../hooks/useSearch";

interface Props {
  focusIngredients: () => void;
}

function IngredientInput({ focusIngredients }: Props) {
  const [useType, setUseType] = useState(false);
  const { ingredients, setIngredients } = useSearch();

  const addIngredient = (ingredient: string) => {
    setIngredients([...ingredients, ingredient]);
  };

  return (
    <>
      <div className="text-center my-5">
        <InputSelector useType={useType} setUseType={setUseType} />
      </div>
      <div className="flex align-center justify-center">
        {useType ? (
          <TextInput handleSubmit={addIngredient} />
        ) : (
          <VoiceInput focusIngredients={focusIngredients} />
        )}
      </div>
    </>
  );
}

export default IngredientInput;
