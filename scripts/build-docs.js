import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildDocs() {
  console.log('🚀 Building SEO Select Documentation...');
  
  try {
    const outputPath = path.join(process.cwd(), 'output');
    await fs.ensureDir(outputPath);
    await fs.emptyDir(outputPath);
    
    console.log('🔨 Building TypeScript and SCSS files...');
    
    await build({
      configFile: false, 
      build: {
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
      },
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
    
    indexContent = indexContent.replace(
      '<script type="module" src="/src/main.ts"></script>',
      '<script type="module" src="./main.js"></script>'
    );
    
    indexContent = indexContent.replace(
      '<script type="module" src="/main.js"></script>',
      '<script type="module" src="./demo.js"></script>'
    );
    
    if (await fs.pathExists(path.join(outputPath, 'components.css'))) {
      indexContent = indexContent.replace(
        '</head>',
        '    <link rel="stylesheet" href="./components.css">\n</head>'
      );
    }
    
    await fs.writeFile(path.join(outputPath, 'index.html'), indexContent);
    
    console.log('📄 Processing demo.js...');
    if (await fs.pathExists('demo.js')) {
      await fs.copy('demo.js', path.join(outputPath, 'demo.js'));
    }
    
    console.log('📄 Copying style.css...');
    if (await fs.pathExists('style.css')) {
      await fs.copy('style.css', path.join(outputPath, 'style.css'));
    }
    
    const staticFiles = ['favicon.ico', 'robots.txt'];
    for (const file of staticFiles) {
      if (await fs.pathExists(file)) {
        console.log(`📄 Copying ${file}...`);
        await fs.copy(file, path.join(outputPath, file));
      }
    }
    
    if (await fs.pathExists('public')) {
      console.log('📁 Copying public folder...');
      const publicFiles = await fs.readdir('public');
      for (const file of publicFiles) {
        await fs.copy(
          path.join('public', file), 
          path.join(outputPath, file)
        );
      }
    }
    
    const files = await fs.readdir(outputPath);
    const stats = await Promise.all(
      files.map(async file => {
        const stat = await fs.stat(path.join(outputPath, file));
        return { name: file, size: Math.round(stat.size / 1024) };
      })
    );
    
    console.log('✅ Documentation build completed!');
    console.log(`📁 Output directory: ${outputPath}`);
    console.log(`📊 Files generated: ${files.length}`);
    console.log('📋 Files:');
    stats.forEach(({ name, size }) => {
      console.log(`   ${name} (${size}KB)`);
    });
    console.log(`📅 Build time: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

buildDocs();