import * as PIXI from "pixi.js"
import gsap from "gsap"
import fit from "math-fit"

import img1 from "../img/1.jpg"
import img2 from "../img/2.jpg"
import img3 from "../img/3.jpg"
import img4 from "../img/4.jpg"
import img5 from "../img/5.jpg"
import img6 from "../img/6.jpg"
import img7 from "../img/7.jpg"
import img8 from "../img/8.jpg"
import img9 from "../img/9.jpg"
import img10 from "../img/10.jpg"

class Sketch {
  constructor() {
    this.app = new PIXI.Application({
      background: "white",
      resizeTo: window,
    })

    this.images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

    document.body.appendChild(this.app.view)
    this.margin = 50
    this.scroll = 0
    this.scrollTarget = 0
    this.width = (window.innerWidth - this.margin * 2) / 3
    this.height = window.innerHeight * 0.8
    this.thumbs = []
    this.wholeWidth = this.images.length * (this.width + this.margin)

    this.container = new PIXI.Container()
    this.app.stage.addChild(this.container)

    this.loadImages(this.images, (images) => {
      this.images = images
      this.addSlides()
      this.render()
      this.scrollEvent()
    })
  }

  scrollEvent() {
    document.addEventListener("wheel", (e) => {
      this.scrollTarget = e.wheelDelta / 3
    })
  }

  loadImages(paths, whenLoaded) {
    const imgs = []
    paths.forEach(function (path) {
      var img = new Image()
      img.onload = function () {
        imgs.push(img)
        if (imgs.length == paths.length) whenLoaded(imgs)
      }
      img.src = path
    })
  }

  addSlides() {
    // slide parent size
    let parent = {
      w: this.width,
      h: this.height,
    }

    this.images.forEach((img, i) => {
      let texture = PIXI.Texture.from(img)
      const sprite = new PIXI.Sprite(texture)
      let container = new PIXI.Container()
      let spriteContainer = new PIXI.Container()

      //this is a white rectangle that will be used as a mask
      let mask = new PIXI.Sprite(PIXI.Texture.WHITE)
      mask.width = this.width
      mask.height = this.height

      sprite.mask = mask

      // sprite.width = 100
      // sprite.height = 100

      // sets all images to top left
      sprite.anchor.set(0.5)

      // sets all images to center
      sprite.position.set(
        sprite.texture.orig.width / 2,
        sprite.texture.orig.height / 2
      )

      let image = {
        w: sprite.texture.orig.width,
        h: sprite.texture.orig.height,
      }

      let cover = fit(image, parent)

      spriteContainer.position.set(cover.left, cover.top)
      spriteContainer.scale.set(cover.scale, cover.scale)

      container.x = (this.margin + this.width) * i
      container.y = this.height / 10

      spriteContainer.addChild(sprite)
      // add events to PIXI
      container.interactive = true
      container.on("mouseover", this.mouseOver)
      container.on("mouseout", this.mouseOut)
      container.addChild(spriteContainer)
      container.addChild(mask)
      this.container.addChild(container)
      // array of containers
      this.thumbs.push(container)
    })
  }

  mouseOver(e) {
    let el = e.currentTarget.children[0].children[0]

    // scale images in
    gsap.to(el.scale, {
      x: 1.1,
      y: 1.1,
      duration: 1.5,
      ease: "expo.out",
    })
  }

  mouseOut(e) {
    let el = e.currentTarget.children[0].children[0]

    // scale images in
    gsap.to(el.scale, {
      x: 1,
      y: 1,
      duration: 1.5,
      ease: "expo.out",
    })
  }

  calculatePosition(scroll, position) {
    let movement = scroll + position

    //

    return movement
  }

  render() {
    this.app.ticker.add(() => {
      this.app.renderer.render(this.container)

      // lerp interpolation
      this.scroll -= (this.scroll - this.scrollTarget) * 0.1
      // slow it down more
      this.scroll *= 0.9

      this.thumbs.forEach((thumb, i) => {
        thumb.position.x = this.calculatePosition(this.scroll, thumb.position.x)
      })
    })
  }
}

const sketch = new Sketch()
