import './preview.css';

import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
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
      window.addEventListener('message', event => {
        try {
          eval(event.data)
        }catch(err) {
          const root = document.querySelector('#root')
          root.innerHTML = '<div style="color: red;"> <h4>Runitme Error</h4>' + err + '</div>';
          console.error(err)
        }
      }, false)
    </script>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
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
    </div>
  );
};

export default Preview;
