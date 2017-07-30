const ui = {
  get (className) {
    return document.querySelector(`.${className}`)
  }
}

const game = {
  state: {
    currentGenerator: 1,
    currentOverrideCode: 0,
    pairs: [],
    currentPair: 0,
    entryTotal: 0,
    codesEntered: 0,
    codesNeeded: 0,
    errorCount: 0,
    maxErrorCount: 4
  }
}

game.genCode = () => {
  const pairMin = 0xA1
  const pairMax = 0xFF
  const genPair = () => {
    const pair = ~~(pairMin + (Math.random() * (pairMax - pairMin)))
    return pair.toString(16)
  }

  game.pairs = [
    genPair(),
    genPair(),
    genPair(),
    genPair()
  ]

  return parseInt(game.pairs.join(''), 16)
}

game.codeToPairs = code => {
  return code.toString(16).toUpperCase().match(/.{1,2}/g)
}

game.flipSwitch = (sw, e) => {
  const switchOn = Boolean(sw.checked)

  if (game.state.locked) {
    switchOn && (sw.checked = false)
    !switchOn && (sw.checked = true)
    return
  }

  const switchValue = parseInt(sw.dataset.val, 10)

  const onSwitchOn = () => {
    game.state.entryTotal += switchValue
  }
  const onSwitchOff = () => {
    game.state.entryTotal -= switchValue
  }
  switchOn && onSwitchOn()
  !switchOn && onSwitchOff()

  ui.entryTotal.innerText = `${game.state.entryTotal}`
// switchOn && console.log('flip switch on: ', switchValue)
// !switchOn && console.log('flip switch off: ', switchValue)
}

game.enterCode = () => {
  if (game.state.locked) { return }

  const targetCode = game.state.pairs[game.state.currentPair]
  const targetValue = parseInt(targetCode, 16)

  if (game.state.entryTotal !== targetValue) {
    game.incorrectCodeEntered()
  } else {
    game.correctCodeEntered()
  }
}

game.incorrectCodeEntered = () => {
  game.state.errorCount += 1
  ui.errorCount.innerText = `${game.state.errorCount}`
  if (game.state.errorCount === game.state.maxErrorCount) {
    game.state.locked = true
    setTimeout(() => {
      game.gameOver()
    }, 800)
  }
}

game.correctCodeEntered = () => {
  game.state.score += (1 + game.state.currentPair) * 100
  game.state.errorCount = 0
  game.state.currentPair += 1
  game.state.codesEntered += 1
  game.state.entryTotal = 0

  ui.errorCount.innerText = `${game.state.errorCount}`
  ui.codesEntered.innerText = `${game.state.codesEntered}`

  ui.switches.forEach(sw => {
    sw.checked = false
  })

  ui.entryTotal.innerText = `${game.state.entryTotal}`

  if (game.state.codesEntered === game.state.codesNeeded) {
    ui.currentTarget.innerText = ''
    game.state.locked = true
    setTimeout(() => {
      game.state.locked = false
      game.nextOverrideCode()
    }, 800)
  } else {
    ui.currentTarget.innerText = game.state.pairs[game.state.currentPair]
  }
}

game.gameOver = () => {
  game.changeScene('gameOver')
  ui.finalScore.innerText = `${game.state.score}`
  ui.generatorsPowered.innerText = `${game.state.currentGenerator - 1}`
}

game.nextOverrideCode = () => {
  game.state.score += game.state.pairs.length * 100
  game.state.currentOverrideCode = game.genCode()
  game.state.pairs = game.codeToPairs(game.state.currentOverrideCode)

  game.state.codesEntered = 0
  game.state.codesNeeded = game.state.pairs.length
  game.state.entryTotal = 0
  game.state.currentGenerator += 1
  game.state.currentPair = 0

  ui.currentGenerator.innerText = game.state.currentGenerator
  ui.currentOverrideCode.innerText = game.state.pairs.join(' ')
  ui.codesEntered.innerText = `${game.state.codesEntered}`
  ui.codesNeeded.innerText = `${game.state.codesNeeded}`
  ui.currentTarget.innerText = game.state.pairs[game.state.currentPair]

  ui.switches.forEach(sw => {
    sw.checked = false
  })

  ui.entryTotal.innerText = `${game.state.entryTotal}`

  ui.errorCount.innerText = `${game.state.errorCount}`
  ui.maxErrorCount.innerText = `${game.state.maxErrorCount}`
}

game.start = () => {
  game.state.score = 0
  game.state.locked = false
  game.state.currentGenerator = 1
  game.state.errorCount = 0
  game.state.maxErrorCount = 4

  game.state.currentOverrideCode = game.genCode()
  game.state.pairs = game.codeToPairs(game.state.currentOverrideCode)
  game.state.currentPair = 0

  game.state.codesEntered = 0
  game.state.codesNeeded = game.state.pairs.length

  game.state.entryValue
  game.state.entryTotal = 0

  ui.currentGenerator.innerText = game.state.currentGenerator
  ui.currentOverrideCode.innerText = game.state.pairs.join(' ')
  ui.codesEntered.innerText = `${game.state.codesEntered}`
  ui.codesNeeded.innerText = `${game.state.codesNeeded}`
  ui.currentTarget.innerText = game.state.pairs[game.state.currentPair]

  ui.switches.forEach(sw => {
    sw.checked = false
  })

  ui.entryTotal.innerText = `${game.state.entryTotal}`

  ui.errorCount.innerText = `${game.state.errorCount}`
  ui.maxErrorCount.innerText = `${game.state.maxErrorCount}`

  game.changeScene('game')
}

game.changeScene = nextSceneName => {
  if (game.scene) {
    game.scene.style.display = 'none'
  }
  game.scene = ui.scenes[nextSceneName]
  game.scene.style.display = 'block'
}

game.end = () => {
  game.gameOver()
}

const boot = () => {
  ui.scenes = {
    title: ui.get('title-scene'),
    game: ui.get('game-scene'),
    gameOver: ui.get('game-over-scene'),
    tutorial: ui.get('tutorial-scene')
  }

  ui.scenes.game.style.display = 'none'
  ui.scenes.gameOver.style.display = 'none'
  ui.scenes.title.style.display = 'none'
  ui.scenes.tutorial.style.display = 'none'

  ui.btnPlayGame = ui.get('btn-play-game')
  ui.btnPlayAgain = ui.get('btn-play-again')
  ui.btnViewTutorial = ui.get('btn-view-tutorial')
  ui.btnBack = ui.get('btn-back')
  ui.btnExit = ui.get('btn-exit')
  ui.btnQuit = ui.get('btn-quit')

  ui.btnQuit.addEventListener('click', () => {
    game.end()
  }, false)

  ui.btnExit.addEventListener('click', () => {
    game.changeScene('title')
  }, false)

  ui.btnViewTutorial.addEventListener('click', () => {
    game.changeScene('tutorial')
  }, false)

  ui.btnBack.addEventListener('click', () => {
    game.changeScene('title')
  }, false)

  ui.btnPlayGame.addEventListener('click', () => {
    game.start()
  }, false)

  ui.btnPlayAgain.addEventListener('click', () => {
    game.start()
  }, false)

  ui.finalScore = ui.get('final-score')
  ui.generatorsPowered = ui.get('generators-powered')

  ui.currentGenerator = ui.get('current-generator')
  ui.currentOverrideCode = ui.get('current-override-code')
  ui.codesEntered = ui.get('codes-entered')
  ui.codesNeeded = ui.get('codes-needed')
  ui.currentTarget = ui.get('current-target')

  ui.switches = [
    ui.get('switch-128'),
    ui.get('switch-64'),
    ui.get('switch-32'),
    ui.get('switch-16'),
    ui.get('switch-8'),
    ui.get('switch-4'),
    ui.get('switch-2'),
    ui.get('switch-1')
  ]

  ui.switches.forEach(sw => sw.addEventListener('change', e => {
    game.flipSwitch(sw, e)
  }, false))

  ui.entryTotal = ui.get('entry-total')
  ui.errorCount = ui.get('error-count')
  ui.maxErrorCount = ui.get('max-error-count')
  ui.btnEnterCode = ui.get('btn-enter-code')

  ui.btnEnterCode.addEventListener('click', () => {
    game.enterCode()
  }, false)

  game.changeScene('title')
}

document.addEventListener('DOMContentLoaded', boot, false)
