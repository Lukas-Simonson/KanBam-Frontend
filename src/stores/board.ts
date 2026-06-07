import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBoards,
  createBoard as apiCreateBoard,
  updateBoard as apiUpdateBoard,
  deleteBoard as apiDeleteBoard,
} from '@/lib/api'
import type { Board, BoardCreation, BoardUpdate } from '@/lib/api'

export const useBoardStore = defineStore('board', () => {
  // state
  const boards = ref<Board[]>([])
  const activeBoard = ref<Board | null>(null)

  // actions
  async function fetchBoards(workspaceId: string) {
    boards.value = await getBoards(workspaceId)
  }

  async function createBoard(workspaceId: string, body: BoardCreation) {
    const board = await apiCreateBoard(workspaceId, body)
    boards.value.push(board)
    return board
  }

  async function updateBoard(id: string, body: BoardUpdate) {
    const updated = await apiUpdateBoard(id, body)
    const index = boards.value.findIndex(b => b.id === id)
    if (index >= 0) boards.value[index] = updated
    if (activeBoard.value?.id === id) activeBoard.value = updated
    return updated
  }

  async function deleteBoard(id: string) {
    await apiDeleteBoard(id)
    boards.value = boards.value.filter(b => b.id !== id)
    if (activeBoard.value?.id === id) activeBoard.value = null
  }

  return { boards, activeBoard, fetchBoards, createBoard, updateBoard, deleteBoard }
})
