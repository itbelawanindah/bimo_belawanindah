const express               = require('express');
const router                = express.Router();

const {
    categoryValidator,
    categoryDeleteValidator,
    categoryUpdateValidator,
    postValidator,
    postDeleteValidator,
    updatepostValidator,
    postlikeunlikeValidator,
    postlikeCountValidator,
    ItemValidator,
    ItemUpdateValidator,
    ItemDeleteValidator
}                           = require('../../helpers/admin.validator')
const auth                  = require('../../middlewares/auth.middleware')
const {
    onlyAdminAccess
}                           = require('../../middlewares/admin.middleware')
const categoryController    = require('../../controllers/category.controller')
const postController        = require('../../controllers/post.controller')
const likecontroller        = require('../../controllers/like.controller')
const ItemController        = require('../../controllers/item.controller')



const {checkPermission}       = require('../../middlewares/check.Permissions')



//category routes
router.post('/add-category', auth,checkPermission, categoryValidator, categoryController.addCategory)
router.get('/get-category', auth,checkPermission, categoryValidator, categoryController.getCategory)
router.post('/delete-category', auth,checkPermission, categoryDeleteValidator, categoryController.deleteCategory)
router.post('/update-category', auth,checkPermission, categoryUpdateValidator, categoryController.updateCategory)

//post routes
router.post('/create-post', auth,checkPermission,postValidator, postController.createPost)
router.get('/get-post', auth,checkPermission, postController.getPost)
router.post('/delete-post', auth,checkPermission, postDeleteValidator,postController.deletePost)
router.post('/update-post', auth,checkPermission, updatepostValidator,postController.updatePost)

//like & unlike routes

router.post('/post-like',auth,postlikeunlikeValidator,likecontroller.postLike)
router.post('/post-unlike',auth,postlikeunlikeValidator,likecontroller.postunLike)
router.post('/post-like-count',auth,postlikeCountValidator,likecontroller.postLikeCount)


//category routes
router.post('/add-item', auth,checkPermission, ItemValidator, ItemController.addItems)
router.get('/get-item', auth,checkPermission, ItemValidator, ItemController.getItem)
router.post('/delete-item', auth,checkPermission, ItemDeleteValidator, ItemController.deleteItem)
router.post('/update-item', auth,checkPermission, ItemUpdateValidator, ItemController.updateItem)
module.exports = router