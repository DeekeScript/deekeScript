declare global {
    var Engines: Engines;
}

interface Engines {
    /**
     * 执行脚本
     * @param file 文件路径，相对根目录的路径
     */
    public executeScript(file: string): void;

    /**
     * 执行脚本
     * @param content 脚本内容
     */
    public executeScriptStr(content: string): void;

    /**
     * 关闭所有脚本
     */
    public closeAll(): void;

    /**
     * 关闭当前脚本之外的其他脚本
     */
    public closeOther(): void
}

export { };
