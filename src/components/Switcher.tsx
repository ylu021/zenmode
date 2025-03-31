import { useEffect, useState } from "react";
import chromeUtils from "../utils/chromeUtils";
import { StorageKey } from "../types/StorageKeys";

const Switcher = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [allowed, setAllowed] = useState<string[]>([]);

  useEffect(() => {
    getDefaultCheckedState();
  }, []);

  const getDefaultCheckedState = async () => {
    await chromeUtils.getSyncStorage(
      [StorageKey.FocusMode, StorageKey.AllowedSites],
      (res) => {
        setIsChecked(res.focusMode || false);
        setAllowed(res.allowedSites || []);
      }
    );
  };

  const handleCheckboxChange = async () => {
    const updatedCheck = !isChecked;
    setIsChecked(updatedCheck);
    await chromeUtils.setSyncStorage(StorageKey.FocusMode, updatedCheck, () => {
      chromeUtils.updateCurrentTab(allowed);
    });
  };

  return (
    <>
      <label className="themeSwitcherTwo relative inline-flex flex-wrap cursor-pointer select-none items-center">
        <div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <span
            className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 transition-colors duration-200 ${
              isChecked ? "bg-[#4C6651]" : "bg-[#CCCCCE]"
            }`}
          >
            <span
              className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                isChecked ? "translate-x-[28px]" : ""
              }`}
            ></span>
          </span>
        </div>
        <span className="label flex items-center text-md font-bold">
          {!isChecked ? "Start Focusing" : "Exit Zen Mode"}
        </span>
      </label>
    </>
  );
};

export default Switcher;
