const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const TYPES_FOLDER = path.join(PROJECT_ROOT, '@deekeScript');
/** 旧版脚本使用的临时目录，仅用于清理遗留 */
const LEGACY_TEMP_DIR = path.join(PROJECT_ROOT, '.temp-update');
const PACKAGE_NAME = 'deeke-script-app';

const ROOT_FILES_FROM_PACKAGE = [
  { name: 'deekeScript.schema.json', required: false },
  { name: 'update-types.js', required: false }
];

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

function cleanupLegacyTemp() {
  if (fs.existsSync(LEGACY_TEMP_DIR)) {
    fs.rmSync(LEGACY_TEMP_DIR, { recursive: true, force: true });
  }
}

function removeDir(dir) {
  if (dir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 使用 npm pack + 解压 tarball 获取包内容，避免在项目内 npm install
 * 触发 deeke-script-app 的 postinstall（init），从而把文件写到错误目录。
 */
function updateFromNpm() {
  log('\n📦 从 npm 拉取包并更新类型与相关文件...', 'cyan');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'deeke-types-'));

  try {
    log('检查 npm 包版本...', 'blue');
    const latestVersion = execSync(`npm view ${PACKAGE_NAME} version`, { encoding: 'utf-8' }).trim();
    log(`最新版本: ${latestVersion}`, 'green');

    log('下载包（npm pack，不执行安装脚本）...', 'blue');
    const packOutput = execSync(`npm pack ${PACKAGE_NAME}@${latestVersion}`, {
      cwd: tempDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    const tgzLine = packOutput.split(/\r?\n/).filter(Boolean).pop();
    if (!tgzLine) {
      throw new Error('npm pack 未返回 tarball 文件名');
    }
    const tgzName = path.basename(tgzLine.trim());
    const tgzPath = path.join(tempDir, tgzName);
    if (!fs.existsSync(tgzPath)) {
      throw new Error(`未找到 tarball: ${tgzPath}`);
    }

    execSync(`tar -xzf ${JSON.stringify(tgzName)}`, {
      cwd: tempDir,
      stdio: 'pipe'
    });

    const packRoot = path.join(tempDir, 'package');
    if (!fs.existsSync(packRoot)) {
      throw new Error('解压后未找到 package 目录（npm 包结构异常）');
    }

    const sourceTypesFolder = path.join(packRoot, '@deekeScript');
    if (!fs.existsSync(sourceTypesFolder)) {
      throw new Error('npm 包中未找到 @deekeScript 文件夹');
    }

    if (fs.existsSync(TYPES_FOLDER)) {
      log('备份现有类型定义...', 'yellow');
      const backupFolder = path.join(PROJECT_ROOT, '@deekeScript.backup');
      removeDir(backupFolder);
      fs.cpSync(TYPES_FOLDER, backupFolder, { recursive: true });
    }

    if (fs.existsSync(TYPES_FOLDER)) {
      fs.rmSync(TYPES_FOLDER, { recursive: true, force: true });
    }
    fs.cpSync(sourceTypesFolder, TYPES_FOLDER, { recursive: true });
    log('✅ 已更新 @deekeScript', 'green');

    for (const { name, required } of ROOT_FILES_FROM_PACKAGE) {
      const src = path.join(packRoot, name);
      const dest = path.join(PROJECT_ROOT, name);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        log(`✅ 已更新 ${name}`, 'green');
      } else if (required) {
        throw new Error(`npm 包中未找到必需文件: ${name}`);
      } else {
        log(`⚠️ 包中暂无 ${name}，跳过（发布包含该文件后即可同步）`, 'yellow');
      }
    }

    log(`已同步自 registry 版本: ${latestVersion}`, 'green');
  } finally {
    removeDir(tempDir);
  }
}

function main() {
  log('🚀 开始从远程包更新 @deekeScript 等文件...', 'cyan');

  try {
    if (!fs.existsSync(path.join(PROJECT_ROOT, 'package.json'))) {
      throw new Error('请在项目根目录运行此脚本');
    }

    updateFromNpm();
  } catch (error) {
    log(`\n❌ 更新失败: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    cleanupLegacyTemp();
  }
}

main();
