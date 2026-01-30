
let Common = {
    id(name) {
        return UiSelector().id('com.ss.android.ugc.aweme:id/' + name);
    },

    click(tag) {
        return Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
    },

    log(...args) {
        console.log(args);
        Log.log(args);
    },

    contains(title, keywords) {
        for (let k in keywords) {
            if (title.indexOf(keywords[k]) !== -1) {
                return true;
            }
        }
        return false;
    },

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        Common.log('数字：', text[0]);
        return text[0] * 1;//可能存在多个逗号
    },

    selectPhoto(file, isPrivate) {
        let file2 = MediaStore.saveContentImageToGallery(file);//文件移动到相册
        try {
            if (!isPrivate) {
                let tag = UiSelector().desc('插入图片').isVisibleToUser(true).findOne();
                // Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
                tag.click();
                System.sleep(2000 + 1000 * Math.random());
            } else {
                let tag = UiSelector().desc('更多面板').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
                System.sleep(3000);

                tag = UiSelector().text('相册').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
                System.sleep(3000);
            }

            let imageTag = UiSelector().className('android.widget.ImageView').isVisibleToUser(true).filter(v => {
                return v.parent().className() == 'android.widget.FrameLayout' && v.parent().bounds().width() == v.parent().bounds().height();
            }).findOne();

            Gesture.click(imageTag.bounds().centerX(), imageTag.bounds().centerY());
            System.sleep(500);
        } catch (e) {
            Common.log("图片处理异常：", e);
        }

        let success = MediaStore.deleteImage(file2);
        if (success) {
            console.log('删除成功');
        }
        System.sleep(2000);
    },

    swipeSearchUserOp(filterRootLayout) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            if (filterRootLayout) {
                return v.children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/root_layout').isVisibleToUser(true));
            }
            return true;
        }).isVisibleToUser(true).findOne();
        if (!tag) {
            Common.log('滑动失败');
            return 0;
        }

        if (tag.scrollForward()) {
            Common.log('滑动成功');
            return true;
        }
        Common.log('滑动到底了');
        return false;
    },

    swipeCommentListOp() {
        return this.swipeSearchUserOp();
    },

    sleep(time) {
        System.sleep(time);
    },

    back(times) {
        if (!times) {
            times = 1;
        }
        for (let i = 0; i < times; i++) {
            Gesture.back();
            Common.log('返回一次');
            Common.sleep(500);
        }
    },

    //判断在哪个页面
    inXPage() {
        if (!Common.id('user_avatar').findOne()) {
            Common.log('不在指定页面');
            return null;
        }

        if (UiSelector().className('android.widget.TextView').text('搜索').findOne()) {
            Common.log('在搜索页面');
            return 'search';
        }

        if (UiSelector().descContains('推荐').descContains('已选中').findOne()) {
            Common.log('在推荐页面');
            return 'tuijian';
        }

        if (UiSelector().descContains('推荐').findOne()) {
            Common.log('在同城页面');
            return 'tongcheng';
        }
    }
}

module.exports = Common;