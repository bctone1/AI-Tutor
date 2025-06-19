"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    let mounted = true;

    // HTML 먼저 fetch 후 script 삽입
    fetch("/ai-tutor-main.html")
      .then((res) => res.text())
      .then((html) => {
        if (mounted) {
          setHtmlContent(html);

          // 약간의 지연 후 script 삽입 (DOM 렌더링 보장용)
          setTimeout(() => {
            const script = document.createElement("script");
            script.src = "/script.js";
            script.async = true;
            document.body.appendChild(script);
          }, 100); // 100ms 지연
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="p-0">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </main>
  );
}
