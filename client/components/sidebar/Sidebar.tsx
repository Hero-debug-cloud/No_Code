"use client";
import { useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { SiAuthelia } from "react-icons/si";
import { AiOutlineDatabase } from "react-icons/ai";
import { AiOutlineApi } from "react-icons/ai";
import { AiOutlineLogin } from "react-icons/ai";

const sidebarNavItems = [
  {
    display: "Athentication",
  },
  {
    display: "DataBase",
  },
  {
    display: "API Creation",
  },
  {
    display: "Log Out",
  },
];
const icons: any = [
  <SiAuthelia key={0} />,
  <AiOutlineDatabase key={1} />,
  <AiOutlineApi key={2} />,
  <AiOutlineLogin key={3} />,
];

const Sidebar = ({ active, change }: any) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [activeIndex, setActiveIndex] = useState(active);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [stepHeight, setStepHeight] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef.current?.querySelector(
        ".sidebar__menu__item"
      );
      if (sidebarItem) {
        indicatorRef.current!.style.height = `${sidebarItem.clientHeight}px`;
        setStepHeight(sidebarItem.clientHeight);
      }
    }, 50);
  }, []);

  const handlelogout = () => {
    removeCookie("token");
    router.push("/");
  };

  return (
    <div className="sidebar">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="sidebar__logo">No Code</div>
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            transform:
              stepHeight !== null
                ? `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                : undefined, // Set to undefined if stepHeight is null
          }}
        ></div>
        {sidebarNavItems.map((item, index) => {
          return (
            <div key={index}>
              <div
                className={`sidebar__menu__item cursor-pointer ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => {
                  if (item.display == "Log Out") {
                    handlelogout();
                  } else {
                    setActiveIndex(index);
                    change(index);
                  }
                }}
              >
                {icons[index]}
                <div className="sidebar__menu__item__text ml-3">
                  {item.display}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
