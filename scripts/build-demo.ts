import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { build, type BuildOptions } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FileStats {
  name: string;
  size: number;
}

// Helper functions to replace fs-extra functionality
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function emptyDir(dirPath: string): Promise<void> {
  try {
    const files = await fs.readdir(dirPath);
    await Promise.all(
      files.map(file => fs.rm(path.join(dirPath, file), { recursive: true, force: true }))
    );
  } catch {
    // Directory doesn't exist, that's fine
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyFile(src: string, dest: string): Promise<void> {
  const srcStat = await fs.stat(src);
  
  if (srcStat.isDirectory()) {
    await ensureDir(dest);
    const files = await fs.readdir(src);
    await Promise.all(
      files.map(file => copyFile(path.join(src, file), path.join(dest, file)))
    );
  } else {
    await fs.copyFile(src, dest);
  }
}

async function buildDocs(): Promise<void> {
  console.log('🚀 Building SEO Select Documentation...');
  
  try {
    const outputPath = path.join(process.cwd(), 'output');
    await ensureDir(outputPath);
    await emptyDir(outputPath);
    
    console.log('🔨 Building TypeScript and SCSS files...');
    
    const buildConfig: BuildOptions = {
      outDir: 'output',
      lib: false,
      rollupOptions: {
        input: path.resolve(process.cwd(), 'src/main.ts'),
        output: {
          entryFileNames: 'main.js',
          chunkFileNames: '[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'components.css';
            }
            return '[name].[ext]';
          }
        }
      },
      minify: false,
      sourcemap: false,
      target: 'es2020'
    };

    await build({
      configFile: false,
      build: buildConfig,
      css: {
        preprocessorOptions: {
          scss: {
            charset: false
          }
        }
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      esbuild: {
        target: 'es2020'
      }
    });
    
    console.log('📄 Processing index.html...');
    let indexContent = await fs.readFile('index.html', 'utf8');
    
    // Replace script references
    indexContent = indexContent.replace(
      '<script type="module" src="/src/main.ts"></script>',
      '<script type="module" src="./main.js"></script>'
    );
    
    indexContent = indexContent.replace(
      '<script type="module" src="/main.js"></script>',
      '<script type="module" src="./demo.js"></script>'
    );
    
    // Add CSS link if components.css exists
    if (await pathExists(path.join(outputPath, 'components.css'))) {
      indexContent = indexContent.replace(
        '</head>',
        '    <link rel="stylesheet" href="./components.css">\n</head>'
      );
    }
    
    await fs.writeFile(path.join(outputPath, 'index.html'), indexContent);
    
    // Copy demo.js if exists
    console.log('📄 Processing demo.js...');
    if (await pathExists('demo.js')) {
      await copyFile('demo.js', path.join(outputPath, 'demo.js'));
    }
    
    // Copy style.css if exists
    console.log('📄 Copying style.css...');
    if (await pathExists('style.css')) {
      await copyFile('style.css', path.join(outputPath, 'style.css'));
    }
    
    // Copy static files
    const staticFiles: string[] = ['favicon.ico', 'robots.txt'];
    for (const file of staticFiles) {
      if (await pathExists(file)) {
        console.log(`📄 Copying ${file}...`);
        await copyFile(file, path.join(outputPath, file));
      }
    }
    
    // Copy public folder contents
    if (await pathExists('public')) {
      console.log('📁 Copying public folder...');
      const publicFiles = await fs.readdir('public');
      for (const file of publicFiles) {
        await copyFile(
          path.join('public', file), 
          path.join(outputPath, file)
        );
      }
    }
    
    // Generate build statistics
    const files = await fs.readdir(outputPath);
    const stats: FileStats[] = await Promise.all(
      files.map(async (file): Promise<FileStats> => {
        const stat = await fs.stat(path.join(outputPath, file));
        return { name: file, size: Math.round(stat.size / 1024) };
      })
    );
    
    // Display build results
    console.log('✅ Documentation build completed!');
    console.log(`📁 Output directory: ${outputPath}`);
    console.log(`📊 Files generated: ${files.length}`);
    console.log('📋 Files:');
    stats.forEach(({ name, size }: FileStats) => {
      console.log(`   ${name} (${size}KB)`);
    });
    console.log(`📅 Build time: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    process.exit(1);
  }
}

// Execute the build
buildDocs().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});