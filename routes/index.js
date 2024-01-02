const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();


const { admin } = require('../models');
const { user } = require('../models');
const { admin_registration } = require('../models');
const { Order } = require('../models');

const passport = require('passport');
const auth = require("../middleware/auth");

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

//------------------------------USER MAIN OUT------------------------------//
router.get("/", async(req, res, next) => {
    const admins = await admin.findAll({
        raw: true
    })
    res.render('user-main-out', { title: 'user-main-out', admins })
})

//----------------------------GET USER MAIN IN----------------------------------//
router.get("/user-main-in/:id", async(req, res, next) => {
    console.log(req.params.id);
    const users = await user.findOne({
        where: { id: req.params.id }
    })
    console.log(users.firstname)
    const admins = await admin.findAll({
        raw: true
    })
    res.render('user-main-in', { title: 'user-main-in', admins, users })
})

//---------------------------------GET LOGIN FOR USERS----------------------------------//
router.get("/user-login", async(req, res, next) => {
    const admins = await admin.findAll({
        raw: true
    })
    res.render('user-login', { title: 'user-login', admins })
})

//---------------------------POST LOGIN FOR USERS--------------------------------//

router.post('/user-postlogin', async(req, res) => {
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



//----------------------------GET SIGNUP FOR USERS----------------------------------//
router.get("/user-signup", async(req, res, next) => {
    const admins = await admin.findAll({
        raw: true
    })
    res.render('user-signup', { title: 'user-signup', admins })
})

//---------------------------POST SIGNUP FOR USERS--------------------------------//
router.post('/user-postsignup', async(req, res) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    console.log(req.body)
    const newUser = await user.create({ firstname, lastname, email, phone, password })
    const userId = newUser.id;
    res.json({
        userId: userId,
        success: true,
        code: 200
    })
})

//-----------------------------------USER BUYNOW-------------------------------//
router.post('/user_buynow', async(req, res) => {
    try {
        const selectedIDsObject = req.body;
        const profile_id = req.body.profile_id;
        console.log("fgfdfgfdgfgdsfggd" + profile_id);
        console.log('Received selectedIDs:', selectedIDsObject);

        const selectedIDsArray = Object.keys(selectedIDsObject)
            .filter(key => key.startsWith('selectedIDs['))
            .map(key => selectedIDsObject[key]);

        for (const id of selectedIDsArray) {
            console.log('ID:', id);
            const showdata = await admin.findOne({
                where: {
                    id: id
                },
                attributes: ['s_id', 'p_id', 'name', 'category', 'qty'],
            });
            const orderId = showdata.s_id
            const productId = showdata.p_id
            const productName = showdata.name
            const quantity = showdata.qty
            await Order.create({ orderId, productId, productName, quantity, profile_id: profile_id });
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




//------------------------------ADMIN------------------------------//
//------------------------------ADMIN------------------------------//
//------------------------------ADMIN------------------------------//

router.get("/admin_login", async(req, res, next) => {
    const admins = await admin.findAll({
        raw: true
    })
    res.render('admin_login', { title: 'admin_login', admins })
})

router.post("/admin_login", passport.authenticate("local", {

    failureRedirect: "/admin_login",
    failureFlash: true
}), async(req, res) => {
    const userid = req.user.id;
    res.json({
        success: true,
        code: 200,
        message: "successfull login",
        userid: userid
    })
})

router.get("/admin", auth, async(req, res, next) => {
    const admins = await admin.findAll({
        raw: true
    })
    res.render('admin', { title: 'admin', admins })
})

//--------------------------------ADD ADMIN-----------------------------//
router.post("/admin_registration", async(req, res, next) => {
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

//---------------------------------A D D  P R O D U C T-------------------------//
router.post("/product_add", upload.single("photo"), async(req, res, next) => {
    const s_id = req.body.s_id
    const p_id = req.body.p_id
    const name = req.body.name
    const category = req.body.category
    const qty = req.body.qty
    console.log(req.body)
    const photo = req.file.destination.replace("public", "") + req.file.filename
    console.log(photo)
    await admin.create({ s_id, p_id, name, category, qty, photo })
    res.json({
        success: true,
        code: 200
    })
})

//---------------------------------------------------V I E W----------------------------------------//
router.post("/view-details", async(req, res) => {
    const showdata = await admin.findOne({
        where: {
            id: req.body.id
        },
        attributes: ['s_id', 'p_id', 'name', 'category', 'qty', 'photo'],
    })
    res.json({ showdata })
})

//----------------------------------------------------E D I T-----------------------------------//
router.post('/post_edit', async(req, res) => {
    console.log(req.body);
    const id = req.body.edit_id;
    const s_id = req.body.edit_s_id;
    const p_id = req.body.edit_p_id;
    const name = req.body.edit_name;
    const category = req.body.edit_category;
    const qty = req.body.edit_qty;

    await admin.update({ s_id, p_id, name, category, qty }, {
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
router.post('/post_delete', async(req, res) => {

    const id = req.body.id

    await admin.destroy({
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