import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildDocs() {
  console.log('🚀 Building SEO Select Documentation...');
  
  try {
    const outputPath = path.join(process.cwd(), 'output');
    await fs.ensureDir(outputPath);
    await fs.emptyDir(outputPath);
    
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
    
    await fs.writeFile(path.join(outputPath, 'index.html'), indexContent);
    
    console.log('📄 Processing main.js...');
    if (await fs.pathExists('main.js')) {
      await fs.copy('main.js', path.join(outputPath, 'demo.js'));
    }
    
    console.log('📄 Processing src/main.ts...');
    if (await fs.pathExists('src/main.ts')) {
      let mainTsContent = await fs.readFile('src/main.ts', 'utf8');
      
      mainTsContent = mainTsContent
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '') 
        .replace(/export\s+/g, '') 
        .replace(/:\s*\w+(\[\])?/g, '') 
        .replace(/\s*as\s+\w+/g, ''); 
      
      await fs.writeFile(path.join(outputPath, 'main.js'), mainTsContent);
    }
    
    console.log('📄 Copying style.css...');
    if (await fs.pathExists('style.css')) {
      await fs.copy('style.css', path.join(outputPath, 'style.css'));
    }
    
    const staticFiles = ['favicon.ico', 'robots.txt'];
    for (const file of staticFiles) {
      if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(outputPath, file));
      }
    }
    
    if (await fs.pathExists('public')) {
      const publicFiles = await fs.readdir('public');
      for (const file of publicFiles) {
        await fs.copy(
          path.join('public', file), 
          path.join(outputPath, file)
        );
      }
    }
    
    const files = await fs.readdir(outputPath);
    
    console.log('✅ Documentation build completed!');
    console.log(`📁 Output directory: ${outputPath}`);
    console.log(`📊 Files generated: ${files.length}`);
    console.log(`📋 Files: ${files.join(', ')}`);
    console.log(`📅 Build time: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildDocs();