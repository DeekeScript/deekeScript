declare global {
    var Http: Http;
}

interface Http {
    /**
     * post请求  {"Content-Type":"application/json"}
     * @param url 请求地址
     * @param json 请求内容，请使用JOSN.parse()将对象处理成字符串
     */
    public post(url: string, json: object): string;

    /**
     * 
     * @param url 请求地址
     * @param json 请求内容
     * @param headers 请求头n的请求头，如：{"Content-Type":"application/json"}
     */
    public postHeaders(url: string, json: object, headers: object): string | null;

    /**
     * get请求
     * @param url 请求地址
     */
    public get(url: string): string;

    /**
     * 带请求头的get请求
     * @param url 请求地址
     * @param headers 请求头
     */
    public getHeaders(url: string, headers: object): string | null;

    //下面的方法，暂时还没使用过
    public postFile(url: string, files: string[], params: object, httpCallback: {
        success: (response: any) => void,
        fail: (response: any) => void
    }): void;
}

export { };
