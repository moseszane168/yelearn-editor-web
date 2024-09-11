import Vue from 'vue';

// 使用Vue.directive()定义一个全局指令
// 1.参数一：指令的名称，定义时指令前面不需要写v-
// 2.参数二：是一个对象，该对象中有相关的操作函数
// 3.在调用的时候必须写v-
// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
    // 1.指令绑定到元素上回立刻执行bind函数，只执行一次
    // 2.每个函数中第一个参数永远是el，表示绑定指令的元素，el参数是原生js对象
    // 3.第二个参数是一个对象：包含以下属性
        // name：指令名，不包括v-前缀
        // value：指令的绑定值
        // oldValue：指令绑定的前一个值，仅在 update 和 componentUpdate 钩子 中可用。
        // expression：绑定值的字符串形式
        // arg：传给指令的参数
        // modeifiers：一个包含修饰符的对象
    // 4.第三个参数：Vue 编译生成的虚拟节点
    // 5.第四个参数：上一个虚拟节点，仅在 update 和 componentUpdate 钩子中可用。
    bind(el, binding, vnode, oldVnode) {
        // 返回 el 中第一个匹配的元素
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');

        // 为元素添加 style 样式，将原本的css样式属性字符串与cursor:move;拼接，作为新的css样式属性字符串，;用于分割多个不同的css样式
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        // 立即执行函数+闭包
        const sty = (() => {
            //在 IE 浏览器中，可以使用 currentStyle 属性来获取元素的样式属性值 
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr];
            } else {
            //在其他浏览器中，需要使用 getComputedStyle 方法来获取元素的计算样式 
                return (dom, attr) => getComputedStyle(dom, false)[attr];
            }
        })()
        // 上述代码等价于
        // function sty(){
        //     if(window.document.currentStyle){
        //         return function(dom,attr){
        //             return dom.currentStyle[attr]
        //         }
        //     }else{
        //         return function(dom,attr){
        //             return getComputedStyle(dom,false)[attr]
        //         }
        //     }
        // }
        // var getStyle = sty();

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            // 获取鼠标当前位置距离弹窗头部左侧边缘的距离
            // clientX得到的是鼠标在视口的坐标相对距离
            // offsetleft得到的是元素盒子的边界相对其父元素盒子边界的偏移
            const disY = e.clientY - dialogHeaderEl.offsetTop;
            
            const screenWidth = document.body.clientWidth; // body当前宽度
            const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 
            // document.body仅包含body内容的宽度(不包含margin，padding和border)
            // document.documenteElement文档根元素（即html元素)，包括文档根元素的padding但不包括margin和border
            //dragDom 是拖拽元素的 DOM 对象 

            const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
            const dragDomheight = dragDom.offsetHeight; // 对话框高度

             // 拖拽元素最小可拖拽的左侧位置就是其最初位置的左偏移量
            const minDragDomLeft = dragDom.offsetLeft; // 离 document 的左边距离

            // 将拖拽元素的左边界放在屏幕最右侧，然后往左偏移拖拽元素的宽度以及其最初位置的左偏移量，就可以使得拖拽元素最大可拖拽到的左侧位置。
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth; // 屏幕宽度 - 离document 的左边距离 - 对话框宽度

            const minDragDomTop = dragDom.offsetTop;
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;


            // 获取到的值带px 正则匹配替换
            // sty() 是一个方法，用于获取指定元素的指定样式属性值。
            // 它接受两个参数，第一个参数为一个 DOM 对象，代表要获取样式属性值的元素；第二个参数为一个字符串，代表要获取的样式属性名。
            let styL = sty(dragDom, 'left');
            let styT = sty(dragDom, 'top');

            // 将获取到的样式属性值转换为具体的像素值
            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (styL.includes('%')) {
                // 如果 styL 中包含百分号（%）
                // 将 styL 中 % 替换为空字符串，然后将字符串转换为数值
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
            } else {
                // 将 styL 中的 px 去掉，然后将结果转换为数值
                styL = +styL.replace(/\px/g, '');
                styT = +styT.replace(/\px/g, '');
            };

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离 
                let left = e.clientX - disX;
                // clientX鼠标当前的坐标位置，以浏览器窗口左上角为原点
                // disX鼠标点击拖拽元素时，鼠标位置与拖拽元素左上角位置的偏移量
                // left表示拖拽元素的新位置
                let top = e.clientY - disY;

                // 边界处理，确保拖拽元素不会超出父容器的范围，避免出现不可预期的显示问题。
                if (-(left) > minDragDomLeft) {
                    left = -(minDragDomLeft);
                    // 即拖拽元素左边缘与父容器左边缘对齐的位置
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft;
                    // 拖拽元素右边缘与父容器右边缘对齐的位置
                }

                if (-(top) > minDragDomTop) {
                    top = -(minDragDomTop);
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop;
                }

                // 移动当前元素，设置拖拽元素的新位置 
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
                // 设置新位置时，需要先将其与原有的偏移量 styL 和 styT 做累加。这样做可以确保元素从原本的位置移动到新的位置，而不是从页面的左上角移动到新的位置。
            };
            //鼠标抬起事件时，取消鼠标移动事件和鼠标抬起事件的绑定 
            document.onmouseup = function (e) {
                // 当用户在拖拽元素上松开鼠标左键时，取消其对应的事件处理函数。 
                document.onmousemove = null;
                // 为了避免事件一直处于绑定状态，取消鼠标抬起事件的绑定。
                document.onmouseup = null;
            };
        }
    }
})
