import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell, {CELL_STATUS} from './Cell.js'
import {SIZE, getAllMoves}from './GameLogic.js'

@autobind
export default class OtelloBoard {
  @observable cells = [];
  @observable turn = CELL_STATUS.BLACK
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE * SIZE; i++) {
      this.cells.push(new Cell())
    }
    this.initialValues()
  }

  initialValues() {
    let middle = SIZE / 2 - 1;
    this.cells[ SIZE * middle + middle].status = CELL_STATUS.BLACK
    this.cells[ SIZE * middle + middle + 1].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle + 1].status = CELL_STATUS.BLACK
  }

  // count remaining
  @computed get whiteCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.WHITE) {
        count++
      }
    })
    return count
  }

  @computed get blackCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.BLACK) {
        count++
      }
    })
    return count
  }

  @computed get emptyCount() {
    return SIZE * SIZE - this.whiteCount - this.blackCount
  }

  // Turns
  @action changeTurn() {
    this.turn = this.turn === CELL_STATUS.BLACK?
                CELL_STATUS.WHITE :
                CELL_STATUS.BLACK
  }

  // Game logic
  @action updateBoard(pos) {
    let moves = getAllMoves(pos, this.turn, this.cells)
    // Do the change
    if (moves.length > 0) {
      /* console.log(JSON.stringify(moves))*/
      this.cells[pos].status = this.turn
      this.turnMoveTiles(moves, this.turn)
      this.changeTurn()
      if (!this.calculateIfValidMovesExist()) {
        this.changeTurn()
      }
    }
  }

  calculateIfValidMovesExist() {
    for(let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].status === CELL_STATUS.EMPTY) {
        let moves = getAllMoves(i, this.turn, this.cells)
        if (moves.length > 1) {
          return true
        }
      }
    }
    return false
  }

  turnMoveTiles(moves, status) {
    for(let i = 0; i < moves.length; i++) {
      this.cells[moves[i]].status = status
    }
  }
}
