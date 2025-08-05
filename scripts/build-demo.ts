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

async function buildDemo(): Promise<void> {
  console.log('🚀 Building SEO Select Demo Website...');
  
  try {
    const outputPath = path.join(process.cwd(), 'output');
    await ensureDir(outputPath);
    await emptyDir(outputPath);
    
    console.log('🔨 Building main components (src/main.ts)...');
    
    // Build main components first (src/main.ts → main.js)
    const mainBuildConfig: BuildOptions = {
      outDir: 'output',
      lib: false,
      rollupOptions: {
        input: path.resolve(process.cwd(), 'src/main.ts'),
        output: {
          entryFileNames: 'main.js',
          chunkFileNames: 'main-[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'components.css';
            }
            return 'main-[name].[ext]';
          }
        }
      },
      minify: false,
      sourcemap: false,
      target: 'es2020'
    };

    await build({
      configFile: false,
      build: mainBuildConfig,
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

    console.log('🎨 Building demo TypeScript and SCSS...');
    
    // Build demo files (demo.ts → demo.js, style.scss → style.css)
    const demoBuildConfig: BuildOptions = {
      outDir: 'output',
      emptyOutDir: false, // 중요: 기존 파일을 삭제하지 않음
      lib: false,
      rollupOptions: {
        input: {
          demo: path.resolve(process.cwd(), 'demo/demo.ts'),
          style: path.resolve(process.cwd(), 'demo/style.scss')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'demo-[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              if (assetInfo.name.includes('style')) {
                return 'style.css';
              }
              return 'demo-[name].css';
            }
            return 'demo-[name].[ext]';
          }
        }
      },
      minify: false,
      sourcemap: false,
      target: 'es2020'
    };

    await build({
      configFile: false,
      build: demoBuildConfig,
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
    let indexContent = await fs.readFile('demo/index.html', 'utf8');
    
    // Replace script and style references with more flexible pattern matching
    // Handle both with and without type="module"
    indexContent = indexContent.replace(
      /<script[^>]*src=["'][^"']*src\/main\.ts["'][^>]*><\/script>/g,
      '<script type="module" src="./main.js"></script>'
    );
    
    // Handle demo.ts script - match both with and without type="module"
    indexContent = indexContent.replace(
      /<script[^>]*src=["']\/demo\.ts["'][^>]*><\/script>/g,
      '<script type="module" src="./demo.js"></script>'
    );

    // Handle SCSS to CSS conversion
    indexContent = indexContent.replace(
      /<link[^>]*href=["']\/style\.scss["'][^>]*>/g,
      '<link rel="stylesheet" href="./style.css">'
    );
    
    // Add components CSS link if exists
    if (await pathExists(path.join(outputPath, 'components.css'))) {
      const hasComponentsCSS = indexContent.includes('components.css');
      if (!hasComponentsCSS) {
        indexContent = indexContent.replace(
          '</head>',
          '    <link rel="stylesheet" href="./components.css">\n</head>'
        );
      }
    }

    // Fix other asset paths that might use absolute paths
    indexContent = indexContent.replace(/src=["']\/([^"']+)["']/g, 'src="./$1"');
    indexContent = indexContent.replace(/href=["']\/([^"']+)["']/g, 'href="./$1"');
    
    await fs.writeFile(path.join(outputPath, 'index.html'), indexContent);
    
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

    // Copy assets from demo folder (like images)
    if (await pathExists('demo')) {
      console.log('📁 Copying demo assets...');
      const demoFiles = await fs.readdir('demo');
      const assetExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];
      
      for (const file of demoFiles) {
        const ext = path.extname(file).toLowerCase();
        if (assetExtensions.includes(ext)) {
          console.log(`📄 Copying demo asset: ${file}...`);
          await copyFile(
            path.join('demo', file), 
            path.join(outputPath, file)
          );
        }
      }
    }
    
    // Verify main.js exists
    const mainJsPath = path.join(outputPath, 'main.js');
    if (await pathExists(mainJsPath)) {
      console.log('✅ main.js successfully created');
    } else {
      console.error('❌ main.js not found!');
    }
    
    // Verify demo.js exists
    const demoJsPath = path.join(outputPath, 'demo.js');
    if (await pathExists(demoJsPath)) {
      console.log('✅ demo.js successfully created');
    } else {
      console.error('❌ demo.js not found!');
    }

    // Verify style.css exists
    const styleCssPath = path.join(outputPath, 'style.css');
    if (await pathExists(styleCssPath)) {
      console.log('✅ style.css successfully created');
    } else {
      console.error('❌ style.css not found!');
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
    console.log('✅ Demo website build completed!');
    console.log(`📁 Output directory: ${outputPath}`);
    console.log(`📊 Files generated: ${files.length}`);
    console.log('📋 Files:');
    stats.forEach(({ name, size }: FileStats) => {
      console.log(`   ${name} (${size}KB)`);
    });
    console.log(`📅 Build time: ${new Date().toLocaleString()}`);
    
    // Display final HTML structure verification
    console.log('\n🔍 HTML References Updated:');
    console.log('   src/main.ts → ./main.js');
    console.log('   /demo.ts → ./demo.js');
    console.log('   /style.scss → ./style.css');
    console.log('   Absolute paths → Relative paths');
    
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
buildDemo().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});