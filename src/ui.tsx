import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import styles from "./ui.css";
import { highlightSwift } from "./ui/syntaxHighlight";

const App: React.VFC = () => {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = async () => {
    if (textRef.current) {
      textRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  useEffect(() => {
    onmessage = (event) => {
      setCode(event.data.pluginMessage.code);
    };
  }, []);

  return (
    <div className={styles.container}>
      <textarea
        className={styles.nonDisplayedTextArea}
        ref={textRef}
        value={code}
        readOnly
      />
      <div className={styles.codeWrapper}>
        {code ? (
          <pre
            className={styles.generatedCode}
            dangerouslySetInnerHTML={{ __html: highlightSwift(code) }}
          />
        ) : (
          <div className={styles.emptyState}>Select a layer to generate SwiftUI code</div>
        )}
      </div>
      {code && (
        <div className={styles.footer}>
          <button className={styles.copyButton} onClick={copyToClipboard}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
};

render(<App />, document.getElementById("app"));
