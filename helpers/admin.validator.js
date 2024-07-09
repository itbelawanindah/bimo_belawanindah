const {check} = require('express-validator')


module.exports.permissionValidator = 
[
    check('permission_name', 'Permission Name is required').not().isEmpty(),
]

module.exports.permissionDeleteValidator = 
[
    check('id', 'ID is required').not().isEmpty(),
]

module.exports.permissionUpdateValidator = 
[
    check('id', 'ID is required').not().isEmpty(),
    check('permission_name', 'Permission Name is required').not().isEmpty(),
]

module.exports.roleValidator = 
[
    check('role_name', 'Role Name is required').not().isEmpty(),
]

module.exports.storeRoleValidator = 
[
    check('role_name', 'Role name is required').not().isEmpty(),
    check('value', 'value is required').not().isEmpty(),
]
module.exports.addRouterPermissionValidator = 
[
    check('router_endpoint', 'Router End Point is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('permission', 'permission is required').isArray()
]
module.exports.getRouterPermissionValidator = 
[
    check('router_endpoint', 'Router End Point is required').not().isEmpty(),
]
//----------------------------------------------------------------
module.exports.categoryValidator = 
[
    check('category_name', 'Category Name is required').not().isEmpty(),
]


module.exports.categoryDeleteValidator = 
[
    check('id','ID is required').not().isEmpty(),
]
module.exports.categoryUpdateValidator = 
[
    check('id', 'ID is required').not().isEmpty(),
    check('category_name', 'Category Name is required').not().isEmpty(),
]


//----------------------------------------------------------------
module.exports.ItemValidator = 
[
    check('item_name', 'Category Name is required').not().isEmpty(),
]


module.exports.ItemDeleteValidator = 
[
    check('id','ID is required').not().isEmpty(),
]
module.exports.ItemUpdateValidator = 
[
    check('id', 'ID is required').not().isEmpty(),
    check('item_name', 'Item Name is required').not().isEmpty(),
]


module.exports.postValidator = 
[
    check('title', 'title is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
]
module.exports.postDeleteValidator = 
[
    check('id','ID is required').not().isEmpty(),
]

module.exports.updatepostValidator = 
[ 
    check('id','ID is required').not().isEmpty(),
    check('title', 'title is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
]
//================================================
 //user validatrors
module.exports.createUserValidator = 
[ 
    
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    })
]


module.exports.updateUserValidator = 
[ 
    
    check('id', 'ID is required').not().isEmpty(),
    check('name', 'name is required').not().isEmpty(),
]
module.exports.deleteUserValidator = 
[ 
    
    check('id', 'ID is required').not().isEmpty(),
]


//================================================
 //driver validatrors
 module.exports.createDriverValidator = 
 [ 
     
     check('name', 'name is required').not().isEmpty(),
     check('email', 'email include a valid email').isEmail().normalizeEmail({
         gmail_remove_dots: true
     })
 ]
 
 
 module.exports.updateDriverValidator = 
 [ 
     
     check('id', 'ID is required').not().isEmpty(),
     check('name', 'name is required').not().isEmpty(),
 ]
 
 module.exports.updatepasswordValidator = 
 [ 
    
     check('password', 'Password is required').not().isEmpty(),
 ]
 module.exports.deleteDriverValidator = 
 [ 
     
     check('id', 'ID is required').not().isEmpty(),
 ]
module.exports.postlikeunlikeValidator = 
[ 
    
    check('user_id', 'user ID is required').not().isEmpty(),
    check('post_id', 'Post ID is required').not().isEmpty(),
]
module.exports.postlikeCountValidator = 
[ 
    
    check('post_id', 'Post ID is required').not().isEmpty(),
]

//================================================================

//request order validation

module.exports.requestorderValidator = 
[ 
    
    check('pickup_address', 'lokasi muat is required').not().isEmpty(),
    check('drop_address', 'lokasi bongkar is required').not().isEmpty(),
    check('item_id', 'Item Order is required').not().isEmpty(),
]