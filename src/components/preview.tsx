import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
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
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <iframe
      title="preview"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;
