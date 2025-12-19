import { useEffect } from "react";

type propType = {
  onSelect?: (text: string) => void;
};
export default function AfterGreet({ onSelect }: propType) {
  useEffect(() => {
    const arr = [
      "That’s a good answer. Let’s move on to the next question.",
      "Thanks for explaining that. Now we’ll continue with the next one.",
      "Nice response. Let’s go ahead and move to the next question.",
      "Great, thank you for your answer. Let’s proceed to the next one.",
      "That sounds good. We’ll now move forward to the next question.",
      "Alright, I got your answer. Let’s continue with the next question.",
      "Thanks for sharing that. Let’s move on to the next part.",
      "Good explanation. Now let’s continue with the next question.",
      "That was helpful. Let’s move ahead to the next one.",
      "Nice, thanks for answering. Let’s go to the next question.",
    ];

    let index = Math.floor(Math.random() * arr.length);
    console.log(arr[index], "this is the page of greeting44444444444444444");

    onSelect?.(arr[index]);
  }, []);

  return null;
}
