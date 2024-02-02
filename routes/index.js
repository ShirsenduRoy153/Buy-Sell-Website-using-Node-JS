const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();


const { admin_shoes } = require('../models');
const { user } = require('../models');
const { admin_registration } = require('../models');
const { category } = require('../models');
const { product } = require('../models');
const { order } = require('../models');
const passport = require('passport');
const auth_admin = require("../middleware/auth_admin");
const auth_main_user = require("../middleware/auth_main_user");

//----------------------------------Photos----------------------------//
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
        fileExt = file.mimetype.split("/").pop();
        fileName = "image-" + Date.now() + "." + fileExt;
        cb(null, fileName)
    }
})
const upload = multer({ storage })

//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//
//--M A I N---//

//---M A I N  O U T---//
router.get("/", async(req, res, next) => {
    categories = await category.findAll({
        raw: true
    })
    res.render('user_main_out', { title: 'user_main_out', categories })
})

//---X---//

//---C A T E G O R Y  O U T---//
router.get("/user_category_out/:name", async(req, res, next) => {
    console.log(req.body)
    let category = req.params.name
    console.log(category)
    let products = await product.findAll({
        where: {
            category: req.params.name
        }
    });
    console.log(products)
    res.render('user_category_out', { title: 'user_category_out', products, category })
})

//---X---//

router.get("/user_main_login", async(req, res, next) => {
    res.render('user_main_login', { title: 'user_main_login' })
})

//
router.get("/user_category_login/:category", async(req, res, next) => {
    console.log(req.params.category)
    let categories = req.params.category
    res.render('user_category_login', { title: 'user_category_login', categories })
})


router.get("/user_main_signup", async(req, res, next) => {
    console.log(req.params.category)
    res.render('user_main_signup', { title: 'user_main_signup' })
})

router.get("/user_category_signup/:category", async(req, res, next) => {
    console.log(req.params.category)
    let categories = req.params.category
    res.render('user_category_signup', { title: 'user_category_signup', categories })
})

router.get("/user_main_in/:id", async(req, res, next) => {
    console.log(req.params.id);
    const users = await user.findOne({
        where: { id: req.params.id }
    })
    const categories = await category.findAll({
        raw: true
    })
    res.render('user_main_in', { title: 'user_main_in', categories, users })
})

router.get("/user_category_in/:name/:userId", async(req, res, next) => {
    console.log(req.body)
    let products = await product.findAll({
        where: {
            category: req.params.name
        }
    });
    const users = await user.findOne({
        where: { id: req.params.userId }
    })
    res.render('user_category_in', { title: 'user_category_in', products, users })
})

router.post('/user_place_order', async(req, res) => {
    console.log(req.body);
    try {
        const selectedIDsArray = req.body['cartItems[]'];

        for (const id of selectedIDsArray) {
            console.log('ID:', id);

            const showdata = await product.findOne({
                where: {
                    id: id
                },
                attributes: ['code', 'name', 'category', 'qty'],
            });

            const productId = showdata.code;
            const productName = showdata.name;
            const category = showdata.category;
            const quantity = showdata.qty;

            await order.create({ productId, productName, quantity, category });
        }

        res.status(200).json({
            success: true,
            code: 200,
            message: 'Buy Now request processed successfully'
        });
    } catch (error) {
        console.error('Error during "Buy Now" processing:', error);
        res.status(500).json({
            success: false,
            code: 500,
            message: 'Internal Server Error'
        });
    }
});

//---P O S T  U S E R  L O G I N---//
router.post('/user_postlogin', async(req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: 'Phone and password are required in the request body',
        });
    }

    const existingUser = await user.findOne({ where: { phone } });

    if (!existingUser) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: 'User not found',
        });
    }

    if (password !== existingUser.password) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: 'Invalid password',
        });
    }
    return res.json({
        userId: existingUser.id,
        success: true,
        code: 200,
    });

});

//
//
//
//
//
//
// router.post("/user_postlogin", passport.authenticate("local_main_user", {
//     failureRedirect: "/user_main_login",
//     failureFlash: true
// }), async(req, res) => {
//     const userId = req.user.id;
//     console.log("UserId = ", userId)
//     res.json({
//         success: true,
//         code: 200,
//         message: "successfull login",
//         userId: userId
//     })
// })

//---X---//

//---P O S T  U S E R  S I G N U P---//
router.post('/user_postsignup', async(req, res) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const address = req.body.address
    const state = req.body.state
    const city = req.body.city
    const password = req.body.password
    console.log(req.body)
    const newUser = await user.create({ firstname, lastname, email, phone, password, address, state, city })
    const userId = newUser.id;
    res.json({
        userId: userId,
        success: true,
        code: 200
    })
})

//---X---//

//---U P D A T E  U S E R---//
router.post('/update_user', async(req, res) => {
    const userId = req.body.id
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const address = req.body.address
    const state = req.body.state
    const city = req.body.city
    const password = req.body.password
    await user.update({ firstname, lastname, email, phone, address, state, city, password }, {
        where: {
            id: userId
        }
    })
    res.json({
        success: true,
        code: 200
    })
})

//---X---//





//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//
//---A D M I N---//

//---L O G I N---//
//---L O G I N---//
router.get("/admin_login", async(req, res, next) => {
    res.render('admin_login', { title: 'admin_login' })
})

router.post("/post_admin_login", passport.authenticate("local", {
    failureRedirect: "/admin_login",
    failureFlash: true
}), async(req, res) => {
    const userId = req.user.id;
    res.json({
        success: true,
        code: 200,
        message: "successfull login",
        userId: userId
    })
})

//---------X---------//

//---A D M I N---//
//---A D M I N---//
router.get("/admin/:id", auth_admin, async(req, res, next) => {
    console.log(req.params.id)
    const userId = req.params.id

    const admins_registrations = await admin_registration.findOne({
        where: { id: req.params.id }
    })
    res.render('admin', { title: 'admin', admins_registrations, userId })
})

router.post("/add_admin", async(req, res, next) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    await admin_registration.create({ firstname, lastname, email, phone, password })
    res.json({
        success: true,
        code: 200
    })
})

router.post('/update_admin', async(req, res) => {
    const userId = req.body.id
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    await admin_registration.update({ firstname, lastname, email, phone, password }, {
        where: {
            id: userId
        }
    })
    res.json({
        success: true,
        code: 200
    })
})

//------X-------//


//---C A T E G O R Y---//
//---C A T E G O R Y---//
router.get("/admin_category", async(req, res, next) => {
    categories = await category.findAll({
        raw: true
    })
    res.render('admin_category', { title: 'admin_category', categories })
})

router.post("/add_category", upload.single("photo"), async(req, res, next) => {
    const name = req.body.name
    const desc = req.body.desc
    const photo = req.file.destination.replace("public", "") + req.file.filename;
    console.log(req.body)
    await category.create({ name, desc, photo })
    res.json({
        success: true,
        code: 200
    })
})

//---X---//

//---V I E W  C A T E G O R Y---//
router.post("/view_cat_details", async(req, res) => {
    const showdata = await category.findOne({
        where: {
            id: req.body.id
        },
        attributes: ['id', 'name', 'desc', 'photo'],
    })
    res.json({ showdata })
})

//---X---//

//---D E L E T E  C A T E G O R Y---//
router.post('/post_cat_delete', async(req, res) => {

    const id = req.body.id

    await category.destroy({
        where: {
            id
        }
    })

    res.json({
        success: true,
        code: 200,
        message: "User deleted succesfully"
    })
});

//---X---//

//---E D I T   C A T E G O R Y---//
router.post('/post_cat_edit', async(req, res) => {
    console.log(req.body);
    const id = req.body.edit_id;
    const name = req.body.edit_name;
    const desc = req.body.edit_desc;

    await category.update({ name, desc }, {
        where: {
            id: id
        }
    })
    res.json({
        success: true,
        code: 200
    })
})

//---X---//


//---P R O D U C T---//
//---P R O D U C T---//
router.get("/admin_table", async(req, res, next) => {
    products = await product.findAll({
        raw: true
    })
    categories = await category.findAll({
        raw: true
    })
    res.render('admin_table', { title: 'admin_table', products, categories })
})

router.post("/add_product", upload.single("photo"), async(req, res, next) => {
    console.log(req.body)
    const code = req.body.code
    const name = req.body.name
    const desc = req.body.desc
    const qty = req.body.qty
    const category = req.body.category
    const photo = req.file.destination.replace("public", "") + req.file.filename;
    await product.create({ code, name, desc, qty, category, photo })
    res.json({
        success: true,
        code: 200
    })
});

//---X---//


//---V I E W---//
router.post("/view_details", async(req, res) => {
    const showdata = await product.findOne({
        where: {
            id: req.body.id
        },
        attributes: ['id', 'code', 'name', 'desc', 'category', 'qty', 'photo'],
    })
    res.json({ showdata })
})

//---X---//

//---E D I T---//
router.post('/post_edit', async(req, res) => {
    console.log(req.body);
    const id = req.body.edit_id;
    const code = req.body.edit_code;
    const name = req.body.edit_name;
    const desc = req.body.edit_desc;
    const category = req.body.edit_category;
    const qty = req.body.edit_qty;

    await admin_shoes.update({ code, name, desc, category, qty }, {
        where: {
            id: id
        }
    })
    res.json({
        success: true,
        code: 200
    })
})

//---X---//


//---D E L E T E---//
router.post('/post_delete', async(req, res) => {

    const id = req.body.id

    await product.destroy({
        where: {
            id
        }
    })

    res.json({
        success: true,
        code: 200,
        message: "User deleted succesfully"
    })
});

//---X---//
//---X---//
//---X---//


//---------------------------------------------------V I E W----------------------------------------//
router.post("/view-details-shoes", async(req, res) => {
    const showdata = await admin_shoes.findOne({
        where: {
            id: req.body.id
        },
        attributes: ['p_id', 'p_name', 'category', 'qty', 'photo'],
    })
    res.json({ showdata })
})

//----------------------------------------------------E D I T-----------------------------------//

router.post('/post_edit_shoes', async(req, res) => {
    console.log(req.body);
    const id = req.body.edit_id;
    const p_id = req.body.edit_p_id;
    const name = req.body.edit_name;
    const category = req.body.edit_category;
    const qty = req.body.edit_qty;

    await admin_shoes.update({ p_id, name, category, qty }, {
        where: {
            id: id
        }
    })
    res.json({
        success: true,
        code: 200
    })
})


//-----------------------------D E L E T E-------------------------------//
router.post('/post_delete_shoes', async(req, res) => {

    const id = req.body.id

    await admin_shoes.destroy({
        where: {
            id
        }
    })

    res.json({
        success: true,
        code: 200,
        message: "User deleted succesfully"
    })
});

module.exports = router;