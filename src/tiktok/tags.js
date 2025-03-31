const tags = {
    package: 'com.zhiliaoapp.musically',
    index: {
        intoHome: ['jwm', 'Home'],
        intoForYou: ['android:id/text1', 'For You'],
        intoMessage: ['jwn', 'Inbox'],
        messageScroll: ['hf6'],
        message: ['o84', 'av9', 'Activity', 'j5o', 'p2_', 'tr_', 'e1y'],//分别是评论框，评论框内容，消息图标，私信和昵称， 私信消息图标外层容器（消息图标没有id）
        messageDetail: ['l4_', 'av_', 'naw', 'cqz', 'bpu'],//外层container，消息控件，回复控件，输入框，发送按钮
        messageContent: ['l2v', ' '],
        messageDetailScroll: ['l46'],
        privatePage: ['moa', 'Got it'],//弹窗
        latestPrivateMsg: ['kdv'],
        videoChange: ['androidx.viewpager.widget.ViewPager', 'u_q'],
        title: ['title'],
        desc: ['desc'],
        comment: ['cre', 'cqn'],
        zan: ['dwu'],
        input: ['cqz'],
        inputButton: ['bpu'],
        header: ['tou'],
        commentZan: ['j1s', 'i3y', 'i9h'],//i3y是未点赞状态，i9h是点赞后控件
        commentBottom: ['k9l'],
        commentAreaSwipe: ['nl9'],
        live: ['LIVE'],
    },
    user: {
        nickname: ['kpt'],
        focus: ['dgp', 'Follow'],
        //hm_是输入框外层的id，hme是按钮外层的id
        private: ['dgp', 'Message', 'hm_', 'android.widget.EditText', 'hme'],
    }
}

module.exports = tags;
