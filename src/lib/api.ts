import api from '@/composables/useApi'

// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'owner' | 'admin' | 'contributer' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface UserToken {
  token: string
  user: User
}

export interface UserRole extends User {
  role: Role
}

export interface Registration {
  email: string
  name: string
  password: string
}

export interface UpdatePassword {
  currentPassword: string
  newPassword: string
}

export interface Workspace {
  id: string
  title: string
  description?: string
  ownerID: string
  createdAt: string
  updatedAt?: string
}

export interface WorkspaceCreation {
  title: string
  description?: string
}

export interface WorkspaceUpdate {
  title?: string
  description?: string
}

export interface Board {
  id: string
  title: string
  description?: string
  prefix: string
  sequence: number
  isArchived: boolean
  workspaceID: string
  createdAt: string
  updatedAt?: string
}

export interface BoardCreation {
  title: string
  description?: string
  prefix: string
}

export interface BoardUpdate {
  title?: string
  description?: string
  isArchived?: boolean
}

export interface Tag {
  id: string
  name: string
  color?: string
  workspaceID: string
  createdAt: string
  updatedAt?: string
}

export interface TagCreation {
  name: string
  color: string
}

export interface TagUpdate {
  name?: string
  color?: string
}

export interface Column {
  id: string
  title: string
  limit?: number
  color?: string
  isTerminal: boolean
  position: number
  boardID: string
  createdAt: string
  updatedAt?: string
}

export interface ColumnCreation {
  title: string
  limit?: number
  color?: string
  isTerminal: boolean
  position: number
}

export interface ColumnUpdate {
  title?: string
  limit?: number
  color?: string
  isTerminal?: boolean
  position?: number
}

export interface Card {
  id: string
  title: string
  description?: string
  isArchived: boolean
  position: number
  boardID: string
  columnID?: string
  userID?: string
  createdAt: string
  updatedAt?: string
}

export interface CardWithTags extends Card {
  tags?: Tag[]
}

export interface ColumnWithCards extends Column {
  cards?: CardWithTags[]
}

export interface CardCreation {
  title: string
  description?: string
  position: number
  columnID?: string
  userID?: string
  tagIDs?: string[]
}

export interface CardUpdate {
  title?: string
  description?: string
  isArchived?: boolean
  position?: number
  columnID?: string
  userID?: string
}

export interface Comment {
  id: string
  body: string
  cardID: string
  userID?: string
  createdAt: string
  updatedAt?: string
}

export interface CommentCreation {
  body: string
}

export interface CommentUpdate {
  body: string
}

export interface Membership {
  userID: string
  role: Role
}

export interface MembershipUpdate {
  role: Role
}

export interface Activity {
  id: string
  workspaceID: string
  userID?: string
  boardID?: string
  columnID?: string
  cardID?: string
  commentID?: string
  tagID?: string
  description: string
  createdAt: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<UserToken> {
  const response = await api.post<UserToken>('/auth/login', null, {
    headers: {
      Authorization: `Basic ${btoa(`${email}:${password}`)}`
    }
  })
  return response.data
}

export async function register(body: Registration): Promise<UserToken> {
  const response = await api.post<UserToken>('/auth/register', body)
  return response.data
}

export async function updatePassword(body: UpdatePassword): Promise<void> {
  const response = await api.post<void>('/auth/updatePassword', body)
  return response.data
}

// ─── Workspaces ──────────────────────────────────────────────────────────────

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get<{ workspaces: Workspace[] }>('/workspaces')
  return response.data.workspaces
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const response = await api.get<Workspace>(`/workspaces/${id}`)
  return response.data
}

export async function createWorkspace(body: WorkspaceCreation): Promise<Workspace> {
  const response = await api.post<Workspace>('/workspaces/create', body)
  return response.data
}

export async function updateWorkspace(id: string, body: WorkspaceUpdate): Promise<Workspace> {
  const response = await api.patch<Workspace>(`/workspaces/${id}`, body)
  return response.data
}

export async function deleteWorkspace(id: string): Promise<void> {
  await api.delete(`/workspaces/${id}`)
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function getMembers(workspaceId: string): Promise<UserRole[]> {
  const response = await api.get<{ members: UserRole[] }>(`/workspaces/${workspaceId}/members`)
  return response.data.members
}

export async function getMember(workspaceId: string, userId: string): Promise<UserRole> {
  const response = await api.get<UserRole>(`/workspaces/${workspaceId}/members/${userId}`)
  return response.data
}

export async function addMember(workspaceId: string, body: Membership): Promise<void> {
  await api.post(`/workspaces/${workspaceId}/members`, body)
}

export async function updateMember(workspaceId: string, userId: string, body: MembershipUpdate): Promise<void> {
  await api.patch(`/workspaces/${workspaceId}/members/${userId}`, body)
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`)
}

// ─── Boards ──────────────────────────────────────────────────────────────────

export async function getBoards(workspaceId: string): Promise<Board[]> {
  const response = await api.get<{ boards: Board[] }>(`/workspaces/${workspaceId}/boards`)
  return response.data.boards
}

export async function getBoard(id: string): Promise<Board> {
  const response = await api.get<Board>(`/boards/${id}`)
  return response.data
}

export async function createBoard(workspaceId: string, body: BoardCreation): Promise<Board> {
  const response = await api.post<Board>(`/workspaces/${workspaceId}/boards/create`, body)
  return response.data
}

export async function updateBoard(id: string, body: BoardUpdate): Promise<Board> {
  const response = await api.patch<Board>(`/boards/${id}`, body)
  return response.data
}

export async function deleteBoard(id: string): Promise<void> {
  await api.delete(`/boards/${id}`)
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export async function getTags(workspaceId: string): Promise<Tag[]> {
  const response = await api.get<{ tags: Tag[] }>(`/workspaces/${workspaceId}/tags`)
  return response.data.tags
}

export async function getTag(id: string): Promise<Tag> {
  const response = await api.get<Tag>(`/tags/${id}`)
  return response.data
}

export async function createTag(workspaceId: string, body: TagCreation): Promise<Tag> {
  const response = await api.post<Tag>(`/workspaces/${workspaceId}/tags/create`, body)
  return response.data
}

export async function updateTag(id: string, body: TagUpdate): Promise<Tag> {
  const response = await api.patch<Tag>(`/tags/${id}`, body)
  return response.data
}

export async function deleteTag(id: string): Promise<void> {
  await api.delete(`/tags/${id}`)
}

// ─── Columns ─────────────────────────────────────────────────────────────────

export async function getColumns(boardId: string): Promise<ColumnWithCards[]> {
  const response = await api.get<{ columns: ColumnWithCards[] }>(`/boards/${boardId}/columns`)
  return response.data.columns
}

export async function getColumn(id: string): Promise<Column> {
  const response = await api.get<Column>(`/columns/${id}`)
  return response.data
}

export async function createColumn(boardId: string, body: ColumnCreation): Promise<Column> {
  const response = await api.post<Column>(`/boards/${boardId}/columns/create`, body)
  return response.data
}

export async function updateColumn(id: string, body: ColumnUpdate): Promise<Column> {
  const response = await api.patch<Column>(`/columns/${id}`, body)
  return response.data
}

export async function deleteColumn(id: string): Promise<void> {
  await api.delete(`/columns/${id}`)
}

// ─── Cards ───────────────────────────────────────────────────────────────────

export async function getCards(boardId: string): Promise<CardWithTags[]> {
  const response = await api.get<{ cards: CardWithTags[] }>(`/boards/${boardId}/cards`)
  return response.data.cards
}

export async function getCard(id: string): Promise<CardWithTags> {
  const response = await api.get<CardWithTags>(`/cards/${id}`)
  return response.data
}

export async function createCard(boardId: string, body: CardCreation): Promise<Card> {
  const response = await api.post<Card>(`/boards/${boardId}/cards/create`, body)
  return response.data
}

export async function updateCard(id: string, body: CardUpdate): Promise<Card> {
  const response = await api.patch<Card>(`/cards/${id}`, body)
  return response.data
}

export async function deleteCard(id: string): Promise<void> {
  await api.delete(`/cards/${id}`)
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getComments(cardId: string): Promise<Comment[]> {
  const response = await api.get<{ comments: Comment[] }>(`/cards/${cardId}/comments`)
  return response.data.comments
}

export async function getComment(id: string): Promise<Comment> {
  const response = await api.get<Comment>(`/comments/${id}`)
  return response.data
}

export async function createComment(cardId: string, body: CommentCreation): Promise<Comment> {
  const response = await api.post<Comment>(`/cards/${cardId}/comments/create`, body)
  return response.data
}

export async function updateComment(id: string, body: CommentUpdate): Promise<Comment> {
  const response = await api.patch<Comment>(`/comments/${id}`, body)
  return response.data
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`)
}

// ─── Activity ────────────────────────────────────────────────────────────────

export async function getActivity(id: string): Promise<Activity> {
  const response = await api.get<Activity>(`/activity/${id}`)
  return response.data
}

export async function getWorkspaceActivity(workspaceId: string): Promise<Activity[]> {
  const response = await api.get<{ activities: Activity[] }>(`/workspaces/${workspaceId}/activity`)
  return response.data.activities
}

export async function getBoardActivity(boardId: string): Promise<Activity[]> {
  const response = await api.get<{ activities: Activity[] }>(`/boards/boards/${boardId}/activity`)
  return response.data.activities
}

export async function getCardActivity(cardId: string): Promise<Activity[]> {
  const response = await api.get<{ activities: Activity[] }>(`/cards/cards/${cardId}/activity`)
  return response.data.activities
}
