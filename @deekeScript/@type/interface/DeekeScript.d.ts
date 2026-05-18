declare global {
    var DeekeScript: DeekeScript;
}

interface DeekeScript {
    /**
     * DeekeScript 版本号
     */
    public version(): number;

    /**
     * 读取 JS 项目目录下的文件内容
     * @param path 相对于项目根目录的文件路径
     * @returns 文件内容字符串，失败返回 null
     */
    public readFile(path: string): string | null;

    /**
     * 获取当前 JS 项目的根目录绝对路径
     * @returns 项目根目录路径
     */
    public getProjectRoot(): string;

    /**
     * 获取可设置的节点字段名列表
     * @returns 字段名字符串数组，用于 getAllAccessibilityNodeInfo 的 fields 参数
     */
    public getNodeFields(): string[];

    /**
     * 一次性获取当前界面所有控件的节点信息
     * @param bool true 为复杂模式（包含所有字段），false 为简单模式
     * @param fields 需要返回的字段名数组，可通过 getNodeFields() 获取完整字段列表
     * @returns { nodes: DeekeNodeInfo[] } 或 null（无障碍服务未启用时）
     */
    public getAllAccessibilityNodeInfo(bool: boolean, fields: string[]): { nodes: DeekeNodeInfo[] } | null;
}

/**
 * 节点位置/大小信息
 */
interface DeekeBounds {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * 无障碍节点信息
 */
interface DeekeNodeInfo {
    key?: string;
    viewIdResourceName?: string;
    text?: string;
    contentDescription?: string;
    className?: string;
    childCount?: number;
    packageName?: string;
    hintText?: string;
    inputType?: number;
    drawingOrder?: number;
    depth?: number;
    maxTextLength?: number;
    isPassword?: boolean;
    boundsInScreen?: DeekeBounds;
    boundsInParent?: DeekeBounds;
    isClickable?: boolean;
    isCheckable?: boolean;
    isChecked?: boolean;
    isEditable?: boolean;
    isEnabled?: boolean;
    isScrollable?: boolean;
    isSelected?: boolean;
    isVisibleToUser?: boolean;
    isFocusable?: boolean;
    isFocused?: boolean;
    isLongClickable?: boolean;
    isDismissable?: boolean;
    children?: DeekeNodeInfo[];
}

export { };
