import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { CiMicrophoneOn } from "react-icons/ci";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSearch from "../hooks/useSearch";
import { useEffect, useState } from "react";

interface Props {
  focusIngredients: () => void;
}

function VoiceInput({ focusIngredients }: Props) {
  const { setIngredients, voiceInput, setVoiceInput, setLoadingIngredients } =
    useSearch();
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ clearTranscriptOnListen: true });

  const [previousInput, setPreviousInput] = useState("");
  const [isSame, setIsSame] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (previousInput.trim().toUpperCase() !== voiceInput.toUpperCase().trim())
      setIsSame(false);
    else setIsSame(true);
  }, [previousInput, voiceInput]);

  const toggleMicrophone = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setVoiceInput(transcript);
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const extractIngredients = () => {
    const controller = new AbortController();

    if (voiceInput.length < 2) return;

    focusIngredients();
    setLoadingIngredients(true);

    axiosPrivate
      .post(
        "/recipes/ingredients",
        {
          input: voiceInput,
        },
        { signal: controller.signal }
      )
      .then((res) => {
        setIngredients(res.data);
        setLoadingIngredients(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingIngredients(false);
      });

    setPreviousInput(voiceInput);
    return () => controller.abort();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="font-lg font-semibold py-12">
        Browser doesn't support speech recognition.
      </span>
    );
  }

  return (
    <div className="w-[100%] my-6 text-center">
      <div className="flex flex-col sm:flex-row justify-center sm:mb-4">
        <button
          className="mx-auto mb-8 sm:mx-0 sm:mb-0"
          onClick={toggleMicrophone}
        >
          <CiMicrophoneOn
            className={
              "p-4 rounded-full flex-shrink-0 drop-shadow-md z-10 " +
              (listening
                ? "bg-white text-blue-500 border-2 border-blue-500"
                : "bg-blue-500 text-white")
            }
            size={65}
          />
        </button>
        <textarea
          className="border-[1px] border-gray-500 w-full sm:w-[80%] min-h-32 rounded-md mb-6 sm:mb-0 sm:ml-4 p-3"
          value={listening ? transcript : voiceInput}
          onChange={(event) => setVoiceInput(event.target.value)}
        ></textarea>
      </div>

      <button
        className={
          "bg-gray-800 hover:bg-gray-900 text-white py-2 px-3 rounded-md mb-3 sm:mb-0 mx-4 drop-shadow-md" +
          (isSame && " bg-gray-300/50 hover:bg-gray-300/50")
        }
        onClick={extractIngredients}
        disabled={isSame}
      >
        Extract Ingredients
      </button>
    </div>
  );
}

export default VoiceInput;
