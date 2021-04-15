import './preview.css';

import { useEffect, useRef } from 'react';
import { directive } from 'jscodeshift';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>html { background-color: white; }</style>
      <title>Document</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
    <script>
      const handleError = (err) => {
        const root = document.querySelector('#root')
        root.innerHTML = '<div style="color: red;"> <h4>Runitme Error</h4>' + err + '</div>';
        console.error(err)
      }
      window.addEventListener('error', (event) => {
        event.preventDefault()
        handleError(event.message)
      })
      window.addEventListener('message', event => {
        try {
          eval(event.data)
        }catch(err) {
          handleError(err)
        }
      }, false)
    </script>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
