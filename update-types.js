const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const TYPES_FOLDER = path.join(PROJECT_ROOT, '@deekeScript');
const TEMP_DIR = path.join(PROJECT_ROOT, '.temp-update');
const PACKAGE_NAME = 'deeke-script-app';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 清理临时目录
function cleanup() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// 从npm更新
async function updateFromNpm() {
  log('\n📦 从npm更新类型定义文件...', 'cyan');
  
  try {
    // 检查npm包是否存在
    log('检查npm包版本...', 'blue');
    const latestVersion = execSync(`npm view ${PACKAGE_NAME} version`, { encoding: 'utf-8' }).trim();
    log(`最新版本: ${latestVersion}`, 'green');
    
    // 创建临时目录
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    const tempPackageDir = path.join(TEMP_DIR, 'node_modules', PACKAGE_NAME);
    
    // 在临时目录安装npm包
    log('下载并安装npm包...', 'blue');
    const packageJsonPath = path.join(TEMP_DIR, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      name: 'temp-update',
      version: '1.0.0',
      dependencies: {
        [PACKAGE_NAME]: 'latest'
      }
    }, null, 2));
    
    execSync('npm install', { 
      cwd: TEMP_DIR, 
      stdio: 'pipe',
      env: { ...process.env, npm_config_progress: 'false' }
    });
    
    // 检查@deekeScript文件夹是否存在
    const sourceTypesFolder = path.join(tempPackageDir, '@deekeScript');
    if (!fs.existsSync(sourceTypesFolder)) {
      throw new Error('npm包中未找到@deekeScript文件夹');
    }
    
    // 备份现有文件夹
    if (fs.existsSync(TYPES_FOLDER)) {
      log('备份现有类型定义文件...', 'yellow');
      const backupFolder = path.join(PROJECT_ROOT, '@deekeScript.backup');
      if (fs.existsSync(backupFolder)) {
        fs.rmSync(backupFolder, { recursive: true, force: true });
      }
      fs.cpSync(TYPES_FOLDER, backupFolder, { recursive: true });
    }
    
    // 删除旧文件夹并复制新文件夹
    if (fs.existsSync(TYPES_FOLDER)) {
      fs.rmSync(TYPES_FOLDER, { recursive: true, force: true });
    }
    fs.cpSync(sourceTypesFolder, TYPES_FOLDER, { recursive: true });
    
    log('✅ 类型定义文件更新成功！', 'green');
    log(`已更新到版本: ${latestVersion}`, 'green');
    
  } catch (error) {
    log(`❌ 从npm更新失败: ${error.message}`, 'red');
    throw error;
  }
}

// 主函数
async function main() {
  log('🚀 开始更新@deekeScript类型定义文件...', 'cyan');
  
  try {
    // 确保在项目根目录
    if (!fs.existsSync(path.join(PROJECT_ROOT, 'package.json'))) {
      throw new Error('请在项目根目录运行此脚本');
    }
    
    await updateFromNpm();
    
  } catch (error) {
    log(`\n❌ 更新失败: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    // 清理临时文件
    cleanup();
  }
}

// 运行主函数
main();
