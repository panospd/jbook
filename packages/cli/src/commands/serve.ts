import { Command } from 'commander';
import { serve } from '@codebook-cli/local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(
    async (filename: string = 'notebook.js', options: { port: string }) => {
      try {
        await serve(
          parseInt(options.port),
          path.basename(filename),
          path.join(process.cwd(), path.dirname(filename)),
          !isProduction
        );

        console.log(
          `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
        );
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          console.error('Port is in use. Try running on a different port. ');
        } else {
          console.log('Here is the problem', error.message);
        }

        process.exit(1);
      }
    }
  );
