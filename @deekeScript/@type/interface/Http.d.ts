declare global {
    var Http: Http;
}

interface Http {
    /**
     * post请求
     * @param url 请求地址
     * @param json 请求内容
     * @param headers 请求头n的请求头，如：{"Content-Type":"application/json"}
     */
    public post(url: string, json: object, headers?: object): string | null;

    /**
     * get请求
     * @param url 请求地址
     * @param headers 请求头
     */
    public get(url: string, headers: object): string | null;

    /**
     * 
     * @param url 请求地址
     * @param files 
     * @param params 
     * @param httpCallback 
     */
    public postFile(url: string, files: Files[], params: object, httpCallback: {
        success: (response: any) => void,
        fail: (response: any) => void
    }): void;


    /**
      * 下载文件
      * @param url 下载链接
      * @param destPath 保存路径（含文件名称）
      * @param headers 请求头
      */
    public download(url: string, destPath: string, headers?: object): string | null;
}

export { };
