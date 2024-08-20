import * as shell from 'shelljs';

shell.cp('-R', 'src/views', 'dist/src/');
shell.cp(
  '-R',
  'src/shared/services/watermark_240.png',
  'dist/src/shared/services/',
);
shell.cp(
  '-R',
  'src/shared/services/watermark_600.png',
  'dist/src/shared/services/',
);
shell.cp(
  '-R',
  'src/shared/services/watermark_1024.png',
  'dist/src/shared/services/',
);
