import { storageService } from './async-storage.service.js'
// import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
// import { userService } from './user.service.js'


const STORAGE_KEY = 'comment_DB'

export const commentService = {
  query,
  getById,
  save,
  remove,
  getEmptyComment,
  addCommentMsg
}

window.commentsService = commentService

async function query(filterBy) {
  // return httpService.get(STORAGE_KEY, filterBy)
  let comments = await storageService.query(STORAGE_KEY)
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    comments = comments.filter((comment) => regex.test(comment.vendor) || regex.test(comment.description))
  }
  return comments
}
function getById(commentId) {
  return storageService.get(STORAGE_KEY, commentId)
  // return httpService.get(`comment/${commentId}`)
}

async function remove(commentId) {
  await storageService.remove(STORAGE_KEY, commentId)
  // return httpService.delete(`comment/${commentId}`)
}
async function save(comment) {
  var savedComment
  if (comment._id) {
    savedComment = await storageService.put(STORAGE_KEY, comment)
    // savedComment = await httpService.put(`comment/${comment._id}`, comment)
  } else {
    // Later, owner is set by the backend
    // comment.owner = userService.getLoggedinUser()
    savedComment = await storageService.post(STORAGE_KEY, comment)
    // savedComment = await httpService.post('comment', comment)
  }
  return savedComment
}

async function addCommentMsg(commentId, txt) {
  // const savedMsg = await httpService.post(`comment/${commentId}/msg`, {txt})
  return savedMsg
}

function getEmptyComment(){
  return{
    commentId: null,
    owner: { },
    text: "",
    createdAt: Date.now(),
    imgUrl: "https://example.com/image.jpg"
  }
}

// TEST DATA
;(async () => {
  utilService.saveToStorage(STORAGE_KEY, comments)
})()
