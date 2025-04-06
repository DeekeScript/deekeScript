

let container = UiSelector().id('com.xingin.xhs:id/fcc').isVisibleToUser(true).findOne();
// console.log(container);

let containers = container.children();
let len = containers.length();

for (let i = 0; i < len; i++) {
    let tag = containers.getChildren(i);
    if (!tag.isVisibleToUser()) {
        console.log(tag);
    }

    if (tag.bounds().top + tag.bounds().height() > Device.height()) {
        Log.log('标题在视线外');
        continue;
    }
    console.log(tag, tag.desc());
}
