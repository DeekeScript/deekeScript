const tags = {
    package: 'com.instagram.android',
    index: {
        intoHome: ['wrapper', 'android.view.ViewGroup'],
        intoVideo: ['clips_tab'],
        videoChange: ['androidx.viewpager.widget.ViewPager', 'clips_viewer_view_pager'],
        title: ['clips_author_username'],
        desc: ['clips_caption_component'],
        comment: ['comment_button', 'comment_count'],
        zan: ['like_button'],
        input: ['layout_comment_thread_edittext'],
        inputButton: ['layout_comment_thread_post_button_icon'],
        header: ['clips_author_profile_pic'],//注意ins不能点击头像进入用户中心，而是点击昵称
        commentZan: ['android.widget.ImageView', 'Like'],
        commentBottom: ['above_composer_views'],
        commentAreaSwipe: ['sticky_header_list'],
        city: ['action_bar_large_title', 'Reels', 'context_menu_item_label', 'Nearby', 'action_bar_title', 'Nearby'],
        intoMessage: ['wrapper', 'news_tab', 'action_bar_inbox_button'],
        message: ['activity_feed_newsfeed_story_row', 'Reply', 'android.widget.TextView', 'layout_comment_thread_edittext', 'layout_comment_thread_post_button_icon'],
        messageScroll: ['activity_feed_list'],
        privateMessage: ['row_inbox_container', 'thread_indicator_status_dot', 'avatar_container'],
        latestPrivateMsg: ['direct_text_message_text_view']
    },
    user: {
        nickname: ['profile_header_full_name_above_vanity'],
        focus: ['profile_header_follow_button', 'Follow'],
        //hm_是输入框外层的id，hme是按钮外层的id
        private: ['button_container', 'Message', 'row_thread_composer_edittext', 'row_thread_composer_send_button_background'],
    }
}

module.exports = tags;
