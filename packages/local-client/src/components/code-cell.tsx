import './code-cell.css';

import { useEffect } from 'react';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../state';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector(state => {
    return state.bundles[cell.id];
  }) || {
    loading: false,
    code: '',
    err: '',
  };

  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!cell.content) {
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;