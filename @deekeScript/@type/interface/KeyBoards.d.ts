global {
    var KeyBoards: KeyBoards;
}

interface KeyBoards {
    /**
     * DeekeScript输入法是否启用（未设置为默认，也返回true，但是此时不能输入和删除）
     */
    public isEnabled(): boolean;

    /**
     * 判断DeekeScript输入法是否设置为默认，是的话，则可以使用输入和删除方法
     */
    public canInput():boolean;

    /**
     * 往文本框追加字符串
     */
    public input(str: string): boolean;

    /**
     * 删除文本框最后一个字符
     */
    public delete():boolean;

    /**
     * 隐藏键盘
     */
    public hide(): boolean;

    /**
     * 发送按键事件，支持各种按键
     * 注意：输入法只能发送文本输入相关的按键，系统级按键（如HOME、BACK、POWER等）无法通过输入法发送
     * @param key 按键代码，可以是字符串（如 "ENTER"）或数字（如 KeyBoards.KEYCODE.ENTER）
     */
    public pressKey(key: string | number): boolean;

    /**
     * 发送Enter键（回车键）
     */
    public pressEnter(): boolean;

    /**
     * 发送Tab键（制表符）
     */
    public pressTab(): boolean;

    /**
     * 发送空格键
     */
    public pressSpace(): boolean;
}

export { };
