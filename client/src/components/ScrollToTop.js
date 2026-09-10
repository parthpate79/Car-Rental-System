import React, { useEffect, useState } from "react";
import { UpOutlined } from "@ant-design/icons";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className="scroll-to-top-button"
      onClick={scrollTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <UpOutlined />
    </button>
  );
}

export default ScrollToTop;
