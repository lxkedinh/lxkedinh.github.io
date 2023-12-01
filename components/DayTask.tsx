import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { animated, useSpring } from "@react-spring/web";
import { CalendarTask } from "../types/notion-api";
import { useModalContext } from "../util/contexts";

interface Props {
  pageId: string;
  time: string;
  title: string;
  typeId: string;
  label: string;
  url: string;
  setTasks: Dispatch<SetStateAction<CalendarTask[]>>;
}

const DayTask: FunctionComponent<Props> = ({
  pageId,
  time,
  title,
  typeId,
  label,
  url,
  setTasks,
}) => {
  // must be defined inside component because otherwise tailwind won't
  // detect and include these class names in output css bundle
  // map Notion property ids to tailwind color classes to assign different
  // colors to my different types of tasks on my notion calendar
  const colors: Record<string, string> = {
    "N@<q": "text-ctp-flamingo",
    xedJ: "text-ctp-pink",
    "u|KN": "text-ctp-lavender",
    "a>;l": "text-ctp-green",
    TzAx: "text-ctp-yellow",
    "qxB}": "text-ctp-red",
    sDxk: "text-ctp-peach",
    "[VjC": "text-ctp-sapphire",
    "3ced2350-32fe-4dd3-b0a4-cef6f6135f85": "text-ctp-teal",
  };
  const [springs, api] = useSpring(() => ({
    from: {
      opacity: 1,
    },
    onRest: () =>
      setTasks((current) => current.filter((t) => t.pageId !== pageId)),
  }));
  const [hovered, setHovered] = useState<boolean>(false);
  const { setModalText, setModalOpen } = useModalContext();

  const handleCompleteTask = async (pageId: string) => {
    try {
      await completeCalendarRequest(pageId);

      api.start({
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
      });
    } catch (err) {
      console.error("Task completion unsuccessful.", err);
      setModalText("Task completion unsuccessful. Try again.");
      setModalOpen(true);
    }
  };

  return (
    <animated.li
      className="font-[Kubasta] text-lg 2xl:text-xl/5 px-1 pb-1 text-ctp-text hover:bg-ctp-mantle [line-height:1rem] mb-2 cursor-pointer"
      style={springs}
    >
      <div
        className="flex flex-row items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <a href={url} className="hover:underline">
          <p>
            {time} - {title}
          </p>
          <p className={`${colors[typeId]} font-bold 2xl:font-normal`}>
            {label}
          </p>
        </a>
        <div
          className={`${
            hovered ? "scale-100 w-4" : "scale-0 w-0"
          } text-base text-ctp-green transition-all ml-1 p-0`}
          onClick={() => handleCompleteTask(pageId)}
        >
          <FaCheck />
        </div>
      </div>
    </animated.li>
  );
};

async function completeCalendarRequest(pageId: string) {
  const response = await fetch("/api/calendar", {
    method: "POST",
    body: JSON.stringify({
      pageId: pageId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const json = await response.json();
  if (json.status !== "success") {
    throw new Error("Task completion unsuccessful.");
  }

  return json;
}

export default DayTask;
