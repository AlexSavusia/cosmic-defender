import * as PIXI from 'pixi.js'
import { loadAssets } from './common/assets'
import appConstants from './common/constants'

const WIDTH = appConstants.size.WIDTH
const HEIGHT = appConstants.size.HEIGHT

const gameState = {
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
}


const createScene = () => {
  const app = new PIXI.Application({
    background: '#000000',
    antialias: true,
    width: WIDTH,
    height: HEIGHT,
  })
  document.body.appendChild(app.view)
  gameState.app = app 
  const rootContainer = app.stage
  rootContainer.eventMode = 'auto'
  rootContainer.hitArea = app.screen
}

const initInteraction = () => {

}

export const initGame = () => {
  loadAssets((progress) => {
    if(progress === 'all') {
      createScene()
      initInteraction()
    } else {
      console.log(progress * 100 + '%')
    }
  })
}