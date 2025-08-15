


let tag = UiSelector().text('QQ').findOne();
console.log(tag);
Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
