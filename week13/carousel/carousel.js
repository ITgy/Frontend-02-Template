import { Component } from "./framework.js";

export class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (let record of this.attributes.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }

        let position = 0;

        this.root.addEventListener("mousedown", event => {
            let children = this.root.children;
            let startX = event.clientX; //记录鼠标按下那一刻的横坐标

            let move = event => {
                let x = event.clientX - startX; //记录鼠标按住不放移动的距离

                let current = position - ((x - x % 500) / 500); //记录当前显示的图片下标

                /**
                 * 把当前显示图片的前一张图片和后一张图片全部移动到正确的位置。
                 * 前一张图片+当前图片+后一张图片，一共三张图片，因此循环的数组长度为3，为[-1,0,1]。
                 */
                for (let offset of[-1, 0, 1]) {
                    //计算对应这三张图片对应的下标
                    let pos = current + offset;
                    //如果当前图片的下标为0的话，前一张图片的下标就为-1，因此需要做一下转换，-1变3，4变0
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = "none";
                    /*
                        -pos*500: 减去原始位置
                        offset*500：保持 前 中 后 的布局
                        x%500：平移的距离
                    */
                    children[pos].style.transform = `translateX(${-pos * 500 + offset*500 + x%500}px)`;
                }
            }
            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 500);

                let arr = [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]
                for (let offset of arr) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${-pos * 500 + offset*500}px)`;
                }
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        })

        let currentIndex = 0; //当前图片下标
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length; //下一张图片的下标
            let current = children[currentIndex]; //当前图片
            let next = children[nextIndex]; //下一张图片

            /**
             * 下方代码的含义：将下一张图片移动到正确位置，当前图片所处的位置为0，由于下一张图片紧挨着当前图片，所以下一张图片所处的位置为当前图片的位置加上当前图片的宽度。
             */
            next.style.transition = "none"; //下一张图片的归位不需要过渡效果，所以移除过渡效果
            next.style.transform = `translateX(${100-nextIndex*100}%)` //由于下一张图片的位置不一定紧跟在当前图片后面，所以需要先把下一张图片移动到当前图片的位置（即-nextIndex*100）,然后再移动到下一张图片应该处得位置，即（100-nextIndex*100）

            /**
             * 
             */
            setTimeout(() => {
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;
                currentIndex = nextIndex;
            }, 16);
        }, 3000)

        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}